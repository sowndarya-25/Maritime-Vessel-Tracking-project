from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Vessel, VesselEvent, Notification, SafetyZone, VesselSubscription
from .serializers import (
    VesselSerializer,
    VesselEventSerializer,
    NotificationSerializer,
    SafetyZoneSerializer,
)
from .services.event_engine import detect_events
from .services.port_data_service import PortDataService
from .services.port_analytics_service import PortAnalyticsService
from .services.safety_data_service import SafetyDataService
from .services.safety_detection_service import SafetyDetectionService


class VesselListView(ListAPIView):
    serializer_class = VesselSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Vessel.objects.all()
        vessel_type = self.request.query_params.get("vessel_type")
        flag = self.request.query_params.get("flag")
        cargo_type = self.request.query_params.get("cargo_type")
        if vessel_type:
            qs = qs.filter(vessel_type__icontains=vessel_type)
        if flag:
            qs = qs.filter(flag__icontains=flag)
        if cargo_type:
            qs = qs.filter(cargo_type__icontains=cargo_type)
        return qs


class VesselDetailView(RetrieveAPIView):
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


class NotificationMarkReadView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        notification = get_object_or_404(
            Notification, pk=pk, user=request.user
        )
        notification.is_read = True
        notification.save()
        return Response(
            {"detail": "Marked as read"},
            status=status.HTTP_200_OK
        )


class TriggerEventView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        vessels = Vessel.objects.all()

        for vessel in vessels:
            detect_events(vessel)

        return Response({"message": "Event detection executed"})


class SubscribeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        vessel = get_object_or_404(Vessel, pk=pk)
        _, created = VesselSubscription.objects.get_or_create(
            user=request.user, vessel=vessel
        )
        if created:
            return Response(
                {"detail": "Subscribed to vessel."},
                status=status.HTTP_201_CREATED
            )
        return Response(
            {"detail": "Already subscribed."},
            status=status.HTTP_200_OK
        )


class UnsubscribeView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        vessel = get_object_or_404(Vessel, pk=pk)
        deleted, _ = VesselSubscription.objects.filter(
            user=request.user, vessel=vessel
        ).delete()
        if deleted:
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(
            {"detail": "Subscription not found."},
            status=status.HTTP_404_NOT_FOUND
        )


class PortAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        port_service = PortDataService()
        analytics_service = PortAnalyticsService()
        port_data = port_service.fetch_port_data()
        analytics = analytics_service.calculate_congestion(port_data)
        return Response(analytics)


class SafetyAlertsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        safety_service = SafetyDataService()
        detection_service = SafetyDetectionService()
        zones = safety_service.fetch_safety_zones()
        alerts = detection_service.detect_risks(zones)
        return Response(alerts)


class SafetyZoneListView(ListAPIView):

    queryset = SafetyZone.objects.all()
    serializer_class = SafetyZoneSerializer
    permission_classes = [IsAuthenticated]