/**
 * Central API service for vessel, safety, notifications, and analytics.
 * Uses the shared axios instance from api/axios.js (with JWT and baseURL).
 */
import api from "../api/axios"

export const vesselService = {
  getVessels: (params) => api.get("vessels/", { params }),
  getVesselEvents: () => api.get("vessels/events/"),
  getNotifications: () => api.get("vessels/notifications/"),
  getPortAnalytics: () => api.get("vessels/ports/analytics/"),
  getSafetyAlerts: () => api.get("vessels/safety/alerts/"),
  getSafetyZones: () => api.get("vessels/safety/zones/"),
}

export default vesselService
