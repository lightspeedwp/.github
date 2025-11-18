---
file_type: "documentation"
description: "Full-Stack Web Application Repository Setup"
title: Full-Stack Web Application Repository Setup
model: copilot
use_case: development
version: 1.0.0
author: LightSpeed WP Team
last_updated: 2024-10-17
---

## Goal

Generate a complete repository structure and setup instructions for a modern full-stack web application with best practices for development, testing, and deployment.

## Inputs

Provide the following information for your project:

- **Project Name**: Name of your application (kebab-case)
- **Frontend Framework**: React, Vue, Angular, Svelte, etc.
- **Backend Framework**: Express.js, Django, Ruby on Rails, Laravel, etc.
- **Database**: PostgreSQL, MongoDB, MySQL, etc.
- **Authentication Method**: JWT, OAuth, Auth0, Firebase, etc.
- **Deployment Platform**: Vercel, Netlify, Heroku, AWS, etc.
- **Team Size**: Solo, small team (2-5), large team (6+)
- **Project Type**: MVP, production app, enterprise application
- **Additional Services**: Email service, file storage, analytics, etc.

## Instructions

1. Create a comprehensive directory structure for the full-stack application
2. Generate package.json files with appropriate dependencies
3. Set up development environment configuration files
4. Create Docker configuration for containerization
5. Generate GitHub Actions workflows for CI/CD
6. Create comprehensive README with setup instructions
7. Generate environment variable templates
8. Set up database schema and migration files
9. Create basic component/route structures
10. Generate testing configuration and sample tests
11. Set up linting and code formatting rules
12. Create deployment configuration files

## Quality Checks

The generated repository structure should include:

- [ ] Clear, logical directory organization
- [ ] Complete package.json with all necessary dependencies
- [ ] Environment configuration for development, staging, and production
- [ ] Database setup and migration scripts
- [ ] Authentication implementation templates
- [ ] CI/CD pipeline configuration
- [ ] Comprehensive documentation
- [ ] Testing framework setup
- [ ] Code quality tools (ESLint, Prettier, etc.)
- [ ] Security best practices implemented
- [ ] Performance optimization configurations
- [ ] Error handling and logging setup

## Safety & Limits

**Do not include:**

- Hardcoded secrets, API keys, or passwords
- Production database credentials
- Specific company or client information
- Copyrighted code or proprietary libraries
- Insecure authentication implementations

**Always include:**

- Environment variable templates with example values
- Security headers and middleware
- Input validation and sanitization
- Rate limiting configurations
- Error handling and logging
- Backup and recovery procedures

## Examples

### Example Input

- **Project Name**: task-manager-pro
- **Frontend Framework**: React (TypeScript)
- **Backend Framework**: Express.js (TypeScript)
- **Database**: PostgreSQL
- **Authentication Method**: JWT with refresh tokens
- **Deployment Platform**: Vercel (frontend) + Railway (backend)
- **Team Size**: Small team (3 developers)
- **Project Type**: Production application
- **Additional Services**: SendGrid (email), Cloudinary (file storage)

### Example Output

# Task Manager Pro - Full-Stack Application

A modern task management application built with React, Express.js, and PostgreSQL.

## 🏗️ Repository Structure

```
task-manager-pro/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service functions
│   │   ├── utils/         # Utility functions
│   │   ├── types/         # TypeScript type definitions
│   │   ├── assets/        # Images, fonts, etc.
│   │   └── styles/        # CSS/SCSS files
│   ├── public/            # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env.example
├── server/                # Express.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utility functions
│   │   ├── types/         # TypeScript interfaces
│   │   └── config/        # Configuration files
│   ├── tests/             # API tests
│   ├── migrations/        # Database migrations
│   ├── seeds/             # Database seed files
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── shared/                # Shared TypeScript types
│   └── types/
├── docker/                # Docker configuration
│   ├── Dockerfile.client
│   ├── Dockerfile.server
│   └── docker-compose.yml
├── .github/              # GitHub Actions
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── docs/                 # Project documentation
├── scripts/              # Build and deployment scripts
├── .gitignore
├── .env.example
├── README.md
├── docker-compose.yml
└── package.json          # Root package.json for workspace
```

## 📋 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Docker and Docker Compose (optional)

### Installation

1. **Clone and install dependencies**

```bash
git clone <repository-url> task-manager-pro
cd task-manager-pro
npm install
```

2. **Set up environment variables**

```bash
# Copy environment templates
cp .env.example .env
cp client/.env.example client/.env.local
cp server/.env.example server/.env

# Edit environment files with your values
```

3. **Start PostgreSQL database**

```bash
# Option 1: Using Docker
docker-compose up -d postgres

# Option 2: Local PostgreSQL
# Ensure PostgreSQL is running and create database
createdb task_manager_pro
```

4. **Run database migrations**

```bash
cd server
npm run migrate
npm run seed
```

5. **Start development servers**

```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:client    # Runs on http://localhost:5173
npm run dev:server    # Runs on http://localhost:3001
```
