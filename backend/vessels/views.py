from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Vessel, VesselEvent, Notification
from .serializers import VesselSerializer, VesselEventSerializer, NotificationSerializer
from .services.vessel_service import detect_events


class VesselListView(ListAPIView):

    queryset = Vessel.objects.all()
    serializer_class = VesselSerializer
    permission_classes = [IsAuthenticated]


class VesselEventListView(ListAPIView):

    queryset = VesselEvent.objects.all()
    serializer_class = VesselEventSerializer
    permission_classes = [IsAuthenticated]


class NotificationListView(ListAPIView):

    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Notification.objects.filter(user=self.request.user)


class TriggerEventView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        vessels = Vessel.objects.all()

        for vessel in vessels:
            detect_events(vessel)

        return Response({"message": "Event detection executed"})
    from rest_framework.views import APIView
from rest_framework.response import Response

from .services.port_data_service import PortDataService
from .services.port_analytics_service import PortAnalyticsService


class PortAnalyticsView(APIView):

    def get(self, request):

        port_service = PortDataService()
        analytics_service = PortAnalyticsService()

        port_data = port_service.fetch_port_data()
        analytics = analytics_service.calculate_congestion(port_data)

        return Response(analytics)
    from .services.safety_data_service import SafetyDataService
from .services.safety_detection_service import SafetyDetectionService


class SafetyAlertsView(APIView):

    def get(self, request):

        safety_service = SafetyDataService()
        detection_service = SafetyDetectionService()

        zones = safety_service.fetch_safety_zones()
        alerts = detection_service.detect_risks(zones)

        return Response(alerts)
    from rest_framework.views import APIView
from rest_framework.response import Response
from vessels.services.safety_engine import detect_zone_violations


class SafetyAlertView(APIView):

    def get(self, request):
        alerts = detect_zone_violations()
        return Response(alerts)