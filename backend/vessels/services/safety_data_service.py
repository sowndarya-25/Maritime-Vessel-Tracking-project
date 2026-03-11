class SafetyDataService:

    def fetch_safety_zones(self):
        """
        Simulated storm / cyclone zones.
        Later this will fetch NOAA weather data.
        """

        zones = [
            {
                "type": "Storm",
                "lat": 18.4,
                "lon": 72.2,
                "radius": 5
            },
            {
                "type": "Cyclone",
                "lat": 16.0,
                "lon": 70.5,
                "radius": 6
            }
        ]

        return zones