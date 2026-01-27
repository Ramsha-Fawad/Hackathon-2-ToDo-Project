# Phase II Frontend - Todo Application

This is the frontend for the Phase II Todo application, built with Next.js 14.2.3, TypeScript, and Better Auth.

## Environment Variables

The application requires the following environment variables to be configured for deployment:

### Required Variables
- `AUTH_SECRET`: Secret key for Better Auth encryption (recommended: 32+ character random string)
- `DATABASE_URL`: Connection string for the database (e.g., PostgreSQL, SQLite)

### Optional Variables
- `NEXT_PUBLIC_API_BASE_URL`: Base URL for API endpoints (defaults to empty string)
- `NEXT_PUBLIC_BASE_URL`: Base URL for the application (used by Better Auth)

### Example .env.local
```env
AUTH_SECRET=your-super-secret-jwt-key-change-me
DATABASE_URL=sqlite:./db.sqlite
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Deployment

This application is designed for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set the environment variables in Vercel dashboard under Settings > Environment Variables
3. The build command is configured as `npm run build`
4. The output directory is `.next`

## Development

To run locally:
1. Install dependencies: `npm install`
2. Run the development server: `npm run dev`

## Architecture

- **Framework**: Next.js 14.2.3 with App Router
- **Authentication**: Better Auth with email/password
- **Styling**: Tailwind CSS with responsive design
- **API**: REST API integration with JWT authentication
- **State Management**: React Context API for authentication state