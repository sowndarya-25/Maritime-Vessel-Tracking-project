import math
from vessels.models import Vessel


class SafetyDetectionService:

    def calculate_distance(self, lat1, lon1, lat2, lon2):

        return math.sqrt((lat1 - lat2) ** 2 + (lon1 - lon2) ** 2)


    def detect_risks(self, zones):

        alerts = []

        vessels = Vessel.objects.all()

        for vessel in vessels:

            for zone in zones:

                distance = self.calculate_distance(
                    vessel.latitude,
                    vessel.longitude,
                    zone["lat"],
                    zone["lon"]
                )

                if distance <= zone["radius"]:

                    alerts.append({
                        "vessel": vessel.vessel_name,
                        "risk": zone["type"],
                        "severity": "High"
                    })

        return alerts