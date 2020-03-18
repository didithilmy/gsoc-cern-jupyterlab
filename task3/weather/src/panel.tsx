import { VDomRenderer } from '@jupyterlab/apputils';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { toArray } from '@lumino/algorithm';

import { sendCommToKernel, setupKernelComm } from './kernel';

import React from 'react';
// import ReactDOM from 'react-dom';
import WeatherView from './view';
import { Session } from '@jupyterlab/services';

export interface WeatherPanelOptions {
    app: JupyterFrontEnd,
    settingRegistry: ISettingRegistry;
    widgetId: string;
    widgetIcon: any;
    widgetTitle?: string;
}

const PANEL_CLASS = 'jp-WeatherPanel';

export class WeatherPanel extends VDomRenderer {
    app: JupyterFrontEnd;
    commSet: Set<string>;
    weatherData?: any;
    settingRegistry: ISettingRegistry;

    constructor(options: WeatherPanelOptions) {
      super();
      super.addClass(PANEL_CLASS);
      const { app, settingRegistry, widgetId, widgetIcon, widgetTitle } = options;
  
      super.id = widgetId;
      super.title.label = widgetTitle;
      super.title.closable = true;
      super.title.icon = widgetIcon;

      app.serviceManager.sessions.runningChanged.connect(this._onRunningChanged, this)
      this.app = app;
      this.settingRegistry = settingRegistry;
      this.commSet = new Set();
    }

    render() {
      return <WeatherView onDataRetrieved={d => this._weatherDataRetrieved(d)} settingRegistry={this.settingRegistry} />
    }

    private _weatherDataRetrieved(weatherData: any) {
      this.weatherData = weatherData;

      const sessions = toArray(this.app.serviceManager.sessions.running());
      sessions.forEach(session => {
        sendCommToKernel(weatherData, session.kernel);
      })
    }

    private _onRunningChanged(sender: Session.IManager, models: Iterable<Session.IModel>): void {
      const newModels = this._findNewElements(Array.from(models), this.commSet);
      newModels.forEach(model => {
        setupKernelComm(model.kernel)
          .then(() => {
            if (!!this.weatherData) {
              sendCommToKernel(this.weatherData, model.kernel);
            }
          });
        this.commSet.add(model.kernel.id);
      })
    }

    private _findNewElements(models: Session.IModel[], commSet: Set<string>): Session.IModel[] {
      return models.filter(x => !commSet.has(x.kernel.id));
    }
}
