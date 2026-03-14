import random
from vessels.models import Vessel
from .event_engine import detect_events


def update_vessels():
    vessels = Vessel.objects.all()

    if not vessels.exists():
        # Create demo vessels first time
        for i in range(5):
            Vessel.objects.create(
                mmsi=f"10000{i}",
                imo_number=f"IMO100{i}",
                vessel_name=f"Demo Vessel {i}",
                latitude=20 + i,
                longitude=70 + i,
                speed=random.uniform(0, 20),
                course=random.uniform(0, 360),
                vessel_type="Cargo"
            )
        return

    for vessel in vessels:
        vessel.latitude += random.uniform(-0.1, 0.1)
        vessel.longitude += random.uniform(-0.1, 0.1)
        vessel.speed = random.randint(0, 20)
        vessel.save()

        detect_events(vessel)