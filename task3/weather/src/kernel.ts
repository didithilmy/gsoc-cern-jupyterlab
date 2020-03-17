import { KernelManager } from '@jupyterlab/services';

const COMM_NAME = "WeatherDataConnector";
const VARIABLE_NAME = "weather_data"

const code = 
`
class WeatherDataConnector():
    def __init__(self, ipython):
        self.ipython = ipython
    
    def register_comm(self):
        """ Register a comm_target which will be used by frontend to start communication """
        self.ipython.kernel.comm_manager.register_target("${COMM_NAME}", self.target_func)

    def handle_comm_message(self, msg):
        print(msg)
        self.ipython.push({'${VARIABLE_NAME}': msg['content']['data']})

    def target_func(self, comm, msg):
        """ Callback function to be called when a frontend comm is opened """
        self.comm = comm

        @self.comm.on_msg
        def _recv(msg):
            self.handle_comm_message(msg)

connector = WeatherDataConnector(get_ipython())
connector.register_comm()
`

export function sendCommToKernel(weatherData: any, kernel: any) {
    const kernelManager = new KernelManager();
      const connection = kernelManager.connectTo({ model: kernel });
      const comm = connection.createComm(COMM_NAME);
      comm.open('hello').done
        .then(() => {
          return comm.send(weatherData).done;
        })
        .then(() => {
          return comm.close('bye').done;
        })
        .catch(e => {
          console.log(e);
        })
}

export async function setupKernelComm(model: any) {
    const kernelManager = new KernelManager();
    const connection = kernelManager.connectTo({ model });
    await connection.requestExecute({ code }).done;
}