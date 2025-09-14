# Green Elixir Vision: The Future of Herbal Healing

## Overview

Green Elixir Vision is an AI-powered web application that combines ancient Ayurvedic wisdom with modern technology. The platform provides users with a comprehensive database of medicinal herbs, AI-driven health recommendations, and interactive 3D plant visualizations. Users can search for herbs, input symptoms to receive personalized herbal remedies through natural language processing, and explore detailed plant information including cultivation requirements and usage instructions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and component-based architecture
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with shadcn/ui components for consistent design system
- **State Management**: TanStack Query for server state management and caching
- **UI Components**: Radix UI primitives with custom styling for accessibility and consistency
- **3D Visualization**: Placeholder implementation for Three.js/React-Three-Fiber integration

### Backend Architecture
- **Server**: Express.js with TypeScript for API endpoints and middleware
- **Authentication**: Replit Auth integration with session-based authentication
- **API Design**: RESTful endpoints for herbs, user management, and AI recommendations
- **Session Storage**: PostgreSQL-backed session store for persistent authentication
- **Error Handling**: Centralized error middleware with structured error responses

### Data Layer
- **Database**: PostgreSQL with Neon serverless driver for scalability
- **ORM**: Drizzle ORM for type-safe database operations and schema management
- **Schema Design**: 
  - Users table with role-based access (user/admin)
  - Herbs table with comprehensive plant information
  - User history and bookmarks for personalized experience
  - Sessions table for authentication persistence

### AI and NLP Services
- **Symptom Analysis**: Custom NLP service for processing natural language symptom descriptions
- **Recommendation Engine**: Rule-based system mapping symptoms to Ayurvedic herbs using traditional knowledge
- **Response Structure**: Structured AI responses including analysis, recommendations, disclaimers, and lifestyle suggestions

### Authentication and Authorization
- **Provider**: Replit Auth with OpenID Connect protocol
- **Session Management**: Server-side sessions with PostgreSQL storage
- **Role-Based Access**: Admin panel restricted to users with admin role
- **Security**: HTTP-only cookies and CSRF protection

### Development and Build Tools
- **Build System**: Vite for fast development and optimized production builds
- **TypeScript**: Strict typing across frontend, backend, and shared schemas
- **Development**: Hot module replacement and runtime error handling
- **Production**: ESBuild for server bundling and static asset serving

## External Dependencies

### Database and Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **WebSocket Support**: Real-time capabilities through ws library

### Authentication Services
- **Replit Auth**: OAuth 2.0/OpenID Connect authentication provider
- **Session Storage**: connect-pg-simple for PostgreSQL session management

### UI and Styling Libraries
- **Radix UI**: Comprehensive set of accessible React components
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Drizzle Kit**: Database schema management and migrations
- **TanStack Query**: Server state synchronization and caching
- **React Hook Form**: Form validation and state management
- **Zod**: Runtime type validation and schema definition

### AI and Data Processing
- **NLP Libraries**: Custom symptom analysis and herb recommendation system
- **Date Utilities**: date-fns for date manipulation and formatting

### Build and Development
- **Vite Plugins**: React support and Replit integration tools
- **TypeScript**: Full-stack type safety and development experience
- **PostCSS**: CSS processing and autoprefixing