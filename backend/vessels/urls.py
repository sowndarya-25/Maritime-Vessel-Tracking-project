from django.urls import path
from .views import (
    VesselListView,
    VesselEventListView,
    NotificationListView,
    TriggerEventView
)

urlpatterns = [

    path("", VesselListView.as_view()),

    path("events/", VesselEventListView.as_view()),

    path("notifications/", NotificationListView.as_view()),

    path("detect-events/", TriggerEventView.as_view()),

]
from .views import PortAnalyticsView, SafetyAlertsView

urlpatterns += [

    path("ports/analytics/", PortAnalyticsView.as_view()),
    path("safety/alerts/", SafetyAlertsView.as_view()),

]
from .views import SafetyAlertView

path("safety/alerts/", SafetyAlertView.as_view()),