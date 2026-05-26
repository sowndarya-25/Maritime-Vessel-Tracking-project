# Maritime-Vessel-Tracking
A full-stack maritime monitoring and analytics platform developed to track vessels in real time, monitor maritime safety zones, analyze port congestion, and manage voyage operations efficiently.

The system combines a scalable Django REST backend with a modern React frontend to provide live vessel tracking, safety overlay detection, notification management, port intelligence analytics, and voyage monitoring.

## ✨ Features
- Real-time vessel tracking and monitoring
- Safety overlay and restricted zone detection
- Automated safety alerts and notifications
- Port congestion analytics with congestion index
- Voyage history and tracking management
- JWT-based authentication system-
- Role-based access control (Operator & Analyst)
- Automated vessel update scheduler
- REST API architecture using Django REST Framework
- Responsive React frontend dashboard
## 🛠️ Tech Stack
### Frontend
- React.js
- Vite
- Axios
- JavaScript
- CSS
### Backend
- Django
- Django REST Framework
- SQLite
- APScheduler
- Authentication
- JWT Authentication
### 📂 Core Modules
#### Vessel Tracking

Tracks vessel location, speed, course, and movement updates in real time.

##### Safety Detection System

Detects whether vessels enter restricted or dangerous maritime zones and generates alerts accordingly.

##### Port Analytics

Calculates congestion index based on vessel density and port capacity conditions.

#### Voyage Management

Maintains voyage history, routes, and operational tracking data.

#### Notification Engine

Generates automated notifications for safety violations and operational events.

### 🧠 System Workflow
- Vessel data is updated periodically using the scheduler.
- Backend services process vessel positions.
- Safety engine checks vessel coordinates against restricted zones.
- Port analytics calculates congestion conditions.
- APIs expose processed maritime intelligence data.
- Frontend dashboard visualizes vessels, alerts, and analytics.
### 🔐 Authentication & Roles

The system includes secure JWT authentication with role-based access control:
- Admin
- Operator
- Analyst
#### 📡 API Endpoints
- /api/vessels/
- /api/vessels/safety/status/
- /api/vessels/notifications/
- /api/vessels/ports/analytics/
- /api/voyages/
### 🚀 Future Enhancements
Live AIS API integration
WebSocket-based real-time updates
Interactive maritime map overlays
Predictive congestion analytics using AI/ML
Weather and piracy zone integration
Docker deployment support
### 📷 Project Highlights
Modular service-based backend architecture
Scalable REST API design
Clean frontend separation using pages, services, and layouts
Real-world maritime monitoring use case implementation
### 👨‍💻 Team Collaboration

This project was developed collaboratively with separate frontend and backend integration workflows following modular full-stack architecture principles.

### 🏁 Conclusion

The Maritime Vessel Tracking & Port Intelligence System provides a centralized platform for maritime monitoring, safety management, and port analytics, helping improve operational awareness and maritime decision-making.
