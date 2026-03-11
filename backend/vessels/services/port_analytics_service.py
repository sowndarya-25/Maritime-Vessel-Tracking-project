class PortAnalyticsService:

    def calculate_congestion(self, port_data):

        analytics = []

        for port in port_data:

            arrivals = port["arrivals"]
            departures = port["departures"]

            congestion_score = (arrivals - departures) / arrivals

            analytics.append({
                "port": port["port"],
                "arrivals": arrivals,
                "departures": departures,
                "congestion_score": round(congestion_score, 2)
            })

        return analytics