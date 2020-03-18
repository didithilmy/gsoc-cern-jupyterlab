import { JupyterFrontEnd, JupyterFrontEndPlugin, ILabShell } from '@jupyterlab/application';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { ICommandPalette } from '@jupyterlab/apputils';
import { listIcon } from '@jupyterlab/ui-components';
import { WeatherPanel } from'./panel';
import { EXTENSION_ID } from './const';

/**
 * Initialization data for the weather extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: EXTENSION_ID,
  autoStart: true,
  requires: [ICommandPalette, ILabShell, ISettingRegistry],
  activate: async (app: JupyterFrontEnd, palette: ICommandPalette, labShell: ILabShell, settingRegistry: ISettingRegistry) => {
    const panel = new WeatherPanel({
      app,
      settingRegistry,
      widgetId: `${EXTENSION_ID}:weather`,
      widgetIcon: listIcon,
      widgetTitle: 'Weather'
    });

    labShell.add(panel, 'left', { rank: 900 });
    labShell.activateById(panel.id);
  }
};

export default extension;
