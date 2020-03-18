import { KernelManager, Kernel } from '@jupyterlab/services';
import { VARIABLE_NAME, COMM_NAME } from './const';

const code = 
`
class WeatherDataConnector():
    def __init__(self, ipython):
        self.ipython = ipython
    
    def register_comm(self):
        self.ipython.kernel.comm_manager.register_target("${COMM_NAME}", self.target_func)

    def target_func(self, comm, msg):
        self.comm = comm

        @self.comm.on_msg
        def _recv(msg):
          self.ipython.push({'${VARIABLE_NAME}': msg['content']['data']})

connector = WeatherDataConnector(get_ipython())
connector.register_comm()
`

export function sendCommToKernel(weatherData: any, kernel: Kernel.IModel) {
    const kernelManager = new KernelManager();
      const connection = kernelManager.connectTo({ model: kernel });
      const comm = connection.createComm(COMM_NAME);
      comm.open().done
        .then(() => {
          return comm.send(weatherData).done;
        })
        .then(() => {
          return comm.close().done;
        })
        .catch(e => {
          console.log(e);
        })
}

export async function setupKernelComm(model: Kernel.IModel) {
    const kernelManager = new KernelManager();
    const connection = kernelManager.connectTo({ model });
    await connection.requestExecute({ code }).done;
}