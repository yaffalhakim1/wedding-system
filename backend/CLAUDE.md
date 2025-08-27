# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the backend code in this repository.

## Project Overview

This is the **backend API server** for a wedding invitation system built with Express.js, PostgreSQL, and Sequelize ORM - part of a larger full-stack project for learning DevOps and monitoring concepts. The backend provides RESTful APIs for RSVP management, photo uploads, guest messages, and admin dashboard functionality.

FOR BACKEND IM THE ONE WHO DO THE CODE. YOU JUST GIVE THE CODE AND I WILL FOLLOW.

### Complete System Architecture

- **Frontend**: Next.js (pages dir) with React Query - ../frontend
- **Backend**: Express.js with Node.js and Sequelize ORM - this repository
- **Database**: PostgreSQL with Sequelize migrations
- **Deployment**: VPS with PM2 process manager and Nginx reverse proxy
- **Monitoring**: Prometheus + Grafana stack

### Project Goals & Learning Focus

This backend serves both a real wedding project and a learning vehicle for DevOps practices, specifically API monitoring, database performance tracking, and production deployment patterns. The system handles real-world scenarios like traffic spikes and ensures reliable data persistence.

## Development Commands

- **Development**: `npm run dev` - Starts server with nodemon auto-reload
- **Production**: `npm start` - Runs production server
- **Database**: `npm run db:migrate` - Run database migrations
- **Seed Data**: `npm run db:seed` - Populate database with initial data
- **Reset DB**: `npm run db:reset` - Drop, create, migrate, and seed database

## Architecture & Structure

### Express.js API Architecture

- **Server Entry**: `server.js` - Main application with middleware and route setup
- **Database Config**: `config/database.js` - Sequelize configuration for all environments
- **Models**: `models/` directory with Sequelize models and associations
- **Routes**: `routes/` directory with API endpoint handlers
- **Middleware**: `middleware/` directory with authentication, validation, and upload handlers

### Database Schema (PostgreSQL)

- **Wedding**: Wedding details and configuration
- **Rsvp**: Guest RSVP responses with meal preferences and plus-ones
- **Message**: Guest congratulations and messages
- **Photo**: Uploaded photos with metadata and captions

### Key Dependencies & Patterns

- **Express.js**: Web framework with middleware pattern
- **Sequelize**: ORM with migrations, models, and associations
- **PostgreSQL**: Production-ready database with connection pooling
- **Multer**: File upload handling for photo uploads
- **Joi**: Request validation and data sanitization
- **Bcrypt**: Password hashing for admin authentication
- **CORS**: Cross-origin resource sharing for frontend communication

## API Endpoints Specification

### Wedding Details

- `GET /api/wedding` - Get wedding information and details

### RSVP System

- `POST /api/rsvp` - Submit guest RSVP response
- `GET /api/admin/rsvps` - Get all RSVP responses (admin only)

### Guest Messages

- `POST /api/messages` - Submit guest message/congratulations
- `GET /api/messages` - Get approved messages for display

### Photo Gallery

- `POST /api/photos` - Upload photos with captions
- `GET /api/photos` - Get approved photos for gallery

### Admin Dashboard

- `GET /api/admin/stats` - Get dashboard statistics
- `POST /api/admin/login` - Admin authentication
- `PUT /api/admin/messages/:id` - Approve/hide messages
- `PUT /api/admin/photos/:id` - Approve/hide photos
- `PUT /api/admin/wedding` - Update wedding details

## Database Models

### Wedding Model

```javascript
{
  id: INTEGER (Primary Key),
  bride_name: STRING,
  groom_name: STRING,
  wedding_date: DATE,
  wedding_time: TIME,
  venue_name: STRING,
  venue_address: STRING,
  ceremony_time: TIME,
  ceremony_location: STRING,
  reception_time: TIME,
  reception_location: STRING,
  created_at: DATE,
  updated_at: DATE
}
```

### RSVP Model

```javascript
{
  id: INTEGER (Primary Key),
  name: STRING,
  email: STRING,
  phone: STRING,
  attendance: ENUM('yes', 'no'),
  plus_one: BOOLEAN,
  plus_one_name: STRING,
  meal_preference: ENUM('chicken', 'fish', 'vegetarian', 'vegan'),
  plus_one_meal: ENUM('chicken', 'fish', 'vegetarian', 'vegan'),
  dietary_restrictions: TEXT,
  message: TEXT,
  created_at: DATE,
  updated_at: DATE
}
```

### Message Model

```javascript
{
  id: INTEGER (Primary Key),
  name: STRING,
  message: TEXT,
  approved: BOOLEAN,
  created_at: DATE,
  updated_at: DATE
}
```

### Photo Model

```javascript
{
  id: INTEGER (Primary Key),
  filename: STRING,
  original_name: STRING,
  uploader_name: STRING,
  caption: TEXT,
  approved: BOOLEAN,
  file_size: INTEGER,
  mime_type: STRING,
  created_at: DATE,
  updated_at: DATE
}
```

## Environment Configuration

Required environment variables in `.env`:

- **PORT**: Server port (default: 3001)
- **NODE_ENV**: Environment mode (development/production)
- **DATABASE_URL**: PostgreSQL connection string
- **DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD**: Database configuration
- **JWT_SECRET**: Secret key for admin authentication
- **ADMIN_PASSWORD**: Default admin password
- **FRONTEND_URL**: Frontend URL for CORS configuration
- **MAX_FILE_SIZE**: Maximum upload file size
- **UPLOAD_PATH**: Photo storage directory

## Development Phases & Current State

### Phase Status

1. **Phase 1: Foundation Setup** ✅ **COMPLETED** - Project structure and basic server
2. **Phase 2: Data and Storage** 🔄 **IN PROGRESS** - Models, migrations, and API endpoints
3. **Phase 3: Production Deployment** - VPS deployment with PM2 and Nginx
4. **Phase 4: Monitoring Implementation** - Prometheus metrics and Grafana dashboards
5. **Phase 5: Real-World Testing** - Load testing and alerting systems

### Implementation Task List (24 Tasks)

#### Phase 1: Foundation ✅ (5 tasks - COMPLETED)

- ✅ Initialize Node.js project and install dependencies
- ✅ Create project folder structure
- ✅ Setup environment configuration
- ✅ Create basic Express server
- ✅ Add essential middleware

#### Phase 2: Database 🔄 (5 tasks - TO IMPLEMENT)

- 🔲 Configure Sequelize with PostgreSQL
- 🔲 Create database models
- 🔲 Create database migrations
- 🔲 Setup database seeders
- 🔲 Test database connectivity

#### Phase 3: API Routes 🔄 (5 tasks - TO IMPLEMENT)

- 🔲 Wedding details endpoints
- 🔲 RSVP management endpoints
- 🔲 Message system endpoints
- 🔲 Photo upload endpoints
- 🔲 Admin dashboard endpoints

#### Phase 4: Security & Middleware 🔄 (4 tasks - TO IMPLEMENT)

- 🔲 CORS configuration
- 🔲 Request validation
- 🔲 File upload handling
- 🔲 Authentication & error handling

#### Phase 5: Documentation 🔄 (5 tasks - TO IMPLEMENT)

- ✅ Create backend CLAUDE.md
- 🔲 API documentation
- 🔲 Setup instructions
- 🔲 Development scripts
- 🔲 Production preparation

## Security Considerations

- **Input Validation**: All requests validated with Joi schemas
- **Authentication**: JWT-based admin authentication
- **File Upload Security**: File type and size restrictions for photos
- **SQL Injection Prevention**: Sequelize ORM with parameterized queries
- **CORS Configuration**: Restricted to frontend domain
- **Error Handling**: Sanitized error messages in production

## Monitoring & Logging

- **Request Logging**: Morgan middleware for HTTP request logs
- **Error Tracking**: Centralized error handling and logging
- **Database Monitoring**: Connection pool and query performance tracking
- **Health Checks**: `/health` endpoint for uptime monitoring
- **Metrics Collection**: Ready for Prometheus integration

## Getting Started

1. **Install Dependencies**: `npm install`
2. **Environment Setup**: Copy `.env.example` to `.env` and configure
3. **Database Setup**: Create PostgreSQL database and run migrations
4. **Development**: `npm run dev` to start with auto-reload
5. **Testing**: Use health check endpoint to verify server status

## Current State

**Phase 1 Foundation is COMPLETE!** The backend project structure is fully set up with:

- Complete Express.js server configuration
- Database connection setup with Sequelize
- Environment configuration and security middleware
- Project structure ready for model and route implementation
- Comprehensive documentation and development commands

**Ready for Phase 2**: Database models, migrations, and API endpoint implementation.
