class PortDataService:

    def fetch_port_data(self):
        """
        Fetch port arrival/departure statistics.
        For now we simulate data.
        Later this will call UNCTAD API.
        """

        port_data = [
            {
                "port": "Singapore",
                "arrivals": 120,
                "departures": 115
            },
            {
                "port": "Rotterdam",
                "arrivals": 95,
                "departures": 90
            },
            {
                "port": "Dubai",
                "arrivals": 140,
                "departures": 130
            }
        ]

        return port_data