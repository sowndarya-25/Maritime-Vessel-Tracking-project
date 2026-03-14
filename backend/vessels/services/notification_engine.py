from vessels.models import VesselSubscription, Notification


def create_notifications(vessel, events):
    """Create notifications for subscribers when vessel events occur."""
    subscribers = VesselSubscription.objects.filter(vessel=vessel)

    for subscription in subscribers:
        for event in events:
            Notification.objects.create(
                user=subscription.user,
                vessel_event=event,
                message=f"{vessel.vessel_name}: {event.description}"
            )