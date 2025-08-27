Project: Wedding Invitation System with DevOps Monitoring Learning Path
I'm building a wedding invitation system to learn DevOps and monitoring concepts. This is both a real project for my upcoming wedding and a learning vehicle for server monitoring, deployment, and system observability.
Technical Stack:

Frontend: Next.js (pages dir) (React-based)
Backend: Express.js with Node.js and Sequelize ORM
Database: PostgreSQL
Deployment: VPS with PM2 process manager and Nginx reverse proxy
Monitoring: Prometheus + Grafana stack

Project Learning Objectives:
The primary goal is learning DevOps practices, specifically monitoring and observability. I want to understand how to track application performance, detect issues before users report them, and gain hands-on experience with industry-standard monitoring tools. This wedding system provides a practical context where monitoring actually matters.
Core System Features:
Create a digital wedding invitation system where guests can view wedding details, RSVP with meal preferences and plus-one information, upload photos to share memories, and leave congratulatory messages. The system should handle real-world scenarios like traffic spikes when invitations are sent out and ensure reliable RSVP data collection.

Development Phase Structure:
Phase 1: Foundation Setup
Build the basic Next.js frontend with an attractive invitation display showing wedding details, date, venue, and basic navigation. Create the Express backend with fundamental RSVP API endpoints. Focus on getting the core user flow working locally before adding complexity.

Phase 2: Data and Storage
Integrate PostgreSQL for structured data storage, implementing proper database schemas for guests, RSVPs, and messages. Add photo upload functionality with proper file handling. This phase introduces database monitoring concepts and file storage operations that we'll track later.

Phase 3: Production Deployment
Deploy the full stack to my VPS using production-ready configurations. Set up PM2 for Node.js process management, configure Nginx as a reverse proxy, and establish proper environment variable handling. This teaches production deployment patterns that require monitoring.

Phase 4: Monitoring Implementation
This is the core learning phase. Implement Prometheus metrics collection within the Express application, tracking response times, error rates, database query performance, and custom business metrics like RSVP completion rates. Set up Grafana dashboards for visualization and establish log aggregation for debugging.

Phase 5: Real-World Testing and Alerting
Simulate realistic load scenarios and failure conditions, then use the monitoring system to detect and diagnose issues. Implement alerting for critical failures and performance degradation.

Specific Learning Questions I Want to Explore:
How do I know if my database is becoming a bottleneck? What metrics indicate my application is handling load well versus poorly? How can I detect issues before users experience them? What's the difference between monitoring system health versus user experience?

My Current Experience Level:
I'm comfortable with frontend development and backend little experienced (last time i do vibe code). I know basic Linux commands, Git, and have used VPS deployments with simple git pull and PM2 reload workflows. I understand basic health check endpoints but want to learn comprehensive application monitoring.
Please guide me through building this system with a focus on the monitoring and DevOps learning aspects. Emphasize teaching moments where monitoring concepts apply and help me understand not just what to implement, but why each monitoring decision matters for production applications.
