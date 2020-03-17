import { VDomRenderer } from '@jupyterlab/apputils';

import React from 'react';
// import ReactDOM from 'react-dom';
import WeatherView from './view';

export interface WeatherPanelOptions {
    widgetId: string;
    widgetIcon: any;
    widgetTitle?: string;
}

const PANEL_CLASS = 'jp-WeatherPanel';

export class WeatherPanel extends VDomRenderer {
    constructor(options: WeatherPanelOptions) {
      super();
      super.addClass(PANEL_CLASS);
      const { widgetId, widgetIcon, widgetTitle } = options;
  
      super.id = widgetId;
      super.title.label = widgetTitle;
      super.title.closable = true;
      super.title.icon = widgetIcon;
    }

    render() {
      return <WeatherView />
    }
}
