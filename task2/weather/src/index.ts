import { JupyterFrontEnd, JupyterFrontEndPlugin, ILabShell } from '@jupyterlab/application';
import { ICommandPalette } from '@jupyterlab/apputils';
import { listIcon } from '@jupyterlab/ui-components';
import { WeatherPanel } from'./panel';

/**
 * Initialization data for the weather extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'weather',
  autoStart: true,
  requires: [ICommandPalette, ILabShell],
  activate: (app: JupyterFrontEnd, palette: ICommandPalette, labShell: ILabShell) => {
    const panel = new WeatherPanel({
      widgetId: 'weather',
      widgetIcon: listIcon,
      widgetTitle: 'Weather'
    });

    labShell.add(panel, 'left', { rank: 900 });
    labShell.activateById(panel.id);
  }
};

export default extension;
