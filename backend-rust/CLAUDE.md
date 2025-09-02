# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Rust backend service for a wedding management system using Axum web framework with PostgreSQL database integration. The project appears to be in early development stages with basic health check endpoints.

this development rust follow the @C:\Users\yafit\Documents\Learn\Docker\backend (this using express js, not done yet)
and
@C:\Users\yafit\Documents\Learn\Docker\frontend (this using react as FE, done)

since I dont know anything about rust, make sure use context7 mcp for validation and agent `rust-pro`.

## Development Commands

### Build & Run

```bash
cargo build          # Build the project
cargo run            # Run the development server (localhost:8000)
cargo check          # Fast compile check without building
```

### Testing

```bash
cargo test           # Run all tests
cargo test -- --nocapture  # Run tests with output
```

### Code Quality

```bash
cargo clippy         # Rust linter
cargo fmt            # Format code
cargo clippy -- -D warnings  # Treat warnings as errors
```

## Architecture

### Core Structure

- `src/main.rs` - Entry point with Axum server setup, health endpoints
- `src/database.rs` - PostgreSQL connection pool management with production-ready configuration
- `migrations/` - Database migration files (currently empty)

### Key Dependencies

- **Axum** - Async web framework with routing and middleware
- **SQLx** - Async PostgreSQL driver with compile-time query checking
- **Tokio** - Async runtime
- **Tower/Tower-HTTP** - Middleware (CORS, file serving)
- **JWT/BCrypt** - Authentication and password hashing
- **Validator** - Request validation
- **Multer** - File upload handling

### Database Configuration

The application uses a production-configured connection pool:

- Max connections: 10
- Min connections: 1
- Acquire timeout: 8s
- Idle timeout: 5 minutes
- Max lifetime: 30 minutes

### Environment Setup

Requires `.env` file with:

- `DATABASE_URL` - PostgreSQL connection string
- `PORT` (optional) - Server port, defaults to 8000

### Current Endpoints

- `GET /` - Health check with database status
- `GET /health` - Same as root endpoint

## Database Notes

**IMPORTANT**: This project connects to a production database with real client data. Never run migrations, delete data, or modify database structure without explicit user approval and planning discussion first.
