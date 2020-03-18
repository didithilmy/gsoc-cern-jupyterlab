class WeatherDataConnector():
    def __init__(self, ipython):
        self.ipython = ipython
    
    def register_comm(self):
        print("Comm registered!")
        """ Register a comm_target which will be used by frontend to start communication """
        self.ipython.kernel.comm_manager.register_target("WeatherDataConnector", self.target_func)

    def handle_comm_message(self, msg):
        print(msg)
        self.ipython.push({'weather_data': msg['content']['data']})

    def target_func(self, comm, msg):
        """ Callback function to be called when a frontend comm is opened """
        self.comm = comm

        @self.comm.on_msg
        def _recv(msg):
            self.handle_comm_message(msg)

def load_ipython_extension(ipython):
    connector = WeatherDataConnector(ipython)
    connector.register_comm()