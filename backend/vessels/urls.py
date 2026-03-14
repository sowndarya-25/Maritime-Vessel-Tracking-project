from django.urls import path
from .views import (
    VesselListView,
    VesselDetailView,
    VesselEventListView,
    NotificationListView,
    NotificationMarkReadView,
    TriggerEventView,
    SubscribeView,
    UnsubscribeView,
    PortAnalyticsView,
    SafetyAlertsView,
    SafetyZoneListView,
)

urlpatterns = [
    path("", VesselListView.as_view()),
    path("<int:pk>/", VesselDetailView.as_view()),
    path("<int:pk>/subscribe/", SubscribeView.as_view()),
    path("<int:pk>/unsubscribe/", UnsubscribeView.as_view()),
    path("events/", VesselEventListView.as_view()),
    path("notifications/", NotificationListView.as_view()),
    path("notifications/<int:pk>/mark-read/", NotificationMarkReadView.as_view()),
    path("detect-events/", TriggerEventView.as_view()),
    path("ports/analytics/", PortAnalyticsView.as_view()),
    path("safety/alerts/", SafetyAlertsView.as_view()),
    path("safety/zones/", SafetyZoneListView.as_view()),
]