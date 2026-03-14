"""
Management command to fetch/update vessel data (e.g. for cron or manual run).
Matches the scheduler job that runs every 2 minutes.
"""
from django.core.management.base import BaseCommand
from vessels.services.vessel_updater import update_vessels


class Command(BaseCommand):
    help = "Fetch and update vessel data from external source / demo updater"

    def handle(self, *args, **options):
        update_vessels()
        self.stdout.write(self.style.SUCCESS("Vessel update completed."))
