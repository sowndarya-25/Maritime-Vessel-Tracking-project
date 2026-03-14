from rest_framework import serializers
from .models import Vessel, VesselEvent, Notification, SafetyZone


class VesselSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vessel
        fields = "__all__"


class VesselEventSerializer(serializers.ModelSerializer):

    class Meta:
        model = VesselEvent
        fields = "__all__"


class NotificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Notification
        fields = "__all__"


class SafetyZoneSerializer(serializers.ModelSerializer):

    class Meta:
        model = SafetyZone
        fields = "__all__"