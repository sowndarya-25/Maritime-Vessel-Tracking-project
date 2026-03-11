from django.db import models
from django.conf import settings


class Vessel(models.Model):

    mmsi = models.CharField(max_length=20, unique=True)
    imo_number = models.CharField(max_length=20, unique=True)

    vessel_name = models.CharField(max_length=255)

    latitude = models.FloatField()
    longitude = models.FloatField()

    speed = models.FloatField(null=True, blank=True)
    course = models.FloatField(null=True, blank=True)

    vessel_type = models.CharField(max_length=100, null=True, blank=True)
    flag = models.CharField(max_length=100, null=True, blank=True)
    cargo_type = models.CharField(max_length=100, null=True, blank=True)

    last_signal_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.vessel_name


class VesselEvent(models.Model):

    EVENT_TYPES = [
        ("POSITION_UPDATE", "Position Update"),
        ("STOPPED", "Stopped"),
        ("ROUTE_CHANGE", "Route Change"),
        ("PORT_ENTRY", "Port Entry"),
        ("AIS_LOST", "AIS Lost"),
    ]

    vessel = models.ForeignKey(Vessel, on_delete=models.CASCADE)
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)

    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.vessel.vessel_name} - {self.event_type}"


class VesselSubscription(models.Model):

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    vessel = models.ForeignKey(Vessel, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "vessel")

    def __str__(self):
        return f"{self.user} subscribed to {self.vessel.vessel_name}"


class Notification(models.Model):

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    vessel_event = models.ForeignKey(VesselEvent, on_delete=models.CASCADE)

    message = models.TextField()

    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user}"


class SafetyZone(models.Model):

    name = models.CharField(max_length=100)

    latitude = models.FloatField()
    longitude = models.FloatField()

    radius_km = models.FloatField()

    def __str__(self):
        return self.name