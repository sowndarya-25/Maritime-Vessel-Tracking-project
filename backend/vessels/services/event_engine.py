from vessels.models import VesselEvent, Notification, VesselSubscription


def detect_events(vessel):
    if vessel.speed == 0:
        event = VesselEvent.objects.create(
            vessel=vessel,
            event_type="STOPPED",
            description=f"{vessel.vessel_name} has stopped."
        )

        subscribers = VesselSubscription.objects.filter(vessel=vessel)

        for sub in subscribers:
            Notification.objects.create(
                user=sub.user,
                vessel_event=event,
                message=f"Alert: {vessel.vessel_name} has stopped."
            )