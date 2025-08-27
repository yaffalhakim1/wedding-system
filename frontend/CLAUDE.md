# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **wedding invitation system** built with Next.js 15, TypeScript, and Tailwind CSS - part of a larger full-stack project for learning DevOps and monitoring concepts. The frontend uses shadcn/ui components for the UI design and React Query for state management. The project is configured with Turbopack for faster development builds.

### Complete System Architecture
- **Frontend**: Next.js (pages dir) with React - this repository
- **Backend**: Express.js with Node.js and Sequelize ORM 
- **Database**: PostgreSQL
- **Deployment**: VPS with PM2 process manager and Nginx reverse proxy
- **Monitoring**: Prometheus + Grafana stack

### Project Goals & Learning Focus
This is both a real wedding project and a learning vehicle for DevOps practices, specifically monitoring and observability. The system will handle real-world scenarios like traffic spikes when invitations are sent out and ensure reliable RSVP data collection.

## Development Commands

- **Development**: `npm run dev` - Starts development server with Turbopack
- **Build**: `npm run build` - Creates production build with Turbopack
- **Start**: `npm start` - Runs production server
- **Lint**: `npm run lint` - Runs ESLint for code quality

## Architecture & Structure

### Pages Router Architecture
- Uses Next.js Pages Router (not App Router)
- Main page: `pages/index.tsx` - Wedding invitation landing page
- API routes: `pages/api/` directory for backend endpoints
- Global app setup: `pages/_app.tsx` with React Query provider

### UI Component System
- **shadcn/ui**: Component library configured in `components.json`
- **Components**: Located in `components/ui/` directory
- **Styling**: Tailwind CSS v4 with custom design system
- **Utilities**: Common functions in `lib/utils.ts` (includes `cn` helper)

### Key Dependencies & Patterns
- **React Query**: Global state management and data fetching
- **Radix UI**: Accessible component primitives
- **Class Variance Authority (CVA)**: Component variant system
- **Font**: Playfair Display for elegant typography
- **Path Aliases**: `@/*` maps to project root

### TypeScript Configuration
- Strict mode enabled
- Path aliases configured (`@/*`)
- Module resolution: bundler
- Target: ES2017

### Styling Approach
- Tailwind CSS with custom color scheme (rose/pink theme)
- CSS variables for theming
- Responsive design patterns
- Glass morphism effects (`backdrop-blur`)

## Component Conventions

1. UI components follow shadcn/ui patterns with CVA for variants
2. Use `cn()` utility for conditional className merging
3. TypeScript interfaces for component props
4. Radix UI primitives for accessibility
5. Responsive design with mobile-first approach

## Development Phases & Current State

The project follows a structured learning approach:

1. **Phase 1: Foundation Setup** ✅ **COMPLETED** - Full Next.js frontend with all core features
2. **Phase 2: Data and Storage** - PostgreSQL integration, API endpoints, real data persistence
3. **Phase 3: Production Deployment** - VPS deployment with PM2 and Nginx
4. **Phase 4: Monitoring Implementation** - Prometheus metrics and Grafana dashboards
5. **Phase 5: Real-World Testing** - Load testing and alerting systems

### Core Features Implementation Status

✅ **Completed Features:**
- **Digital Wedding Invitation Display** - Full responsive invitation with wedding details
- **Guest RSVP System** - Complete form with meal preferences, plus-one options, and dietary restrictions
- **Photo Upload and Sharing** - Drag & drop interface with captions and preview functionality
- **Guest Message/Congratulations System** - Message submission with live display and moderation
- **Admin Dashboard** - Full management interface with statistics, RSVP tracking, and settings
- **React Query Integration** - Complete data fetching with loading states and error handling
- **Form Validation** - Comprehensive validation using react-hook-form and zod
- **Responsive Design** - Mobile-first design working across all device sizes

### Pages & Routes
- `/` - Main wedding invitation with section navigation
- `/rsvp` - RSVP submission form  
- `/photos` - Photo gallery with upload functionality
- `/messages` - Guest messages with submission form
- `/admin` - Password-protected admin dashboard (demo: `admin123`)

### Frontend Architecture
- **Components**: 18+ shadcn/ui components integrated
- **State Management**: React Query for server state, local state for UI
- **API Layer**: Abstracted in `/lib/api.ts` with mock functions ready for backend integration
- **Hooks**: Custom React Query hooks in `/hooks/use-wedding-data.ts`
- **Validation**: Form validation with react-hook-form + zod schemas
- **Styling**: Tailwind CSS with rose/pink wedding theme

### Current State
**Phase 1 is 100% complete!** The frontend is production-ready with all core wedding invitation features implemented. All API calls are abstracted and ready for backend integration. The system includes proper error handling, loading states, form validation, and responsive design.

**Ready for Phase 2**: Backend API integration - just replace mock functions in `/lib/api.ts` with real HTTP calls to Express.js endpoints.