# Quickstart Guide: Phase II Frontend Todo Application

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Git for version control

## Setup Instructions

### 1. Clone and Navigate
```bash
cd phases/PhaseII/frontend
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env.local` file in the root of the frontend directory:
```env
# Better Auth Configuration
AUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# API Configuration (assumed backend)
API_BASE_URL=http://localhost:8000
```

### 4. Run Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Key Directories

```
phases/PhaseII/frontend/
├── app/                    # Next.js App Router pages
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── dashboard/         # Main dashboard
│   └── ...                # Other routes
├── components/            # Reusable React components
├── lib/                  # Utility functions and API clients
├── hooks/                # Custom React hooks
├── styles/               # Global styles and CSS modules
└── public/               # Static assets
```

## Development Workflow

### Adding New Pages
1. Create new directories in the `app/` folder
2. Add `page.tsx` files for route definitions
3. Use server components for initial data loading
4. Use client components for interactive elements

### Authentication Flow
1. All protected routes should use the authentication provider
2. JWT tokens are automatically attached to API requests
3. Unauthorized requests redirect to login page

### API Integration
1. Use the API client in `lib/api-client.ts`
2. All authenticated requests automatically include Authorization header
3. Error handling is centralized in the API client

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter
- `npm run test` - Run tests (when implemented)

## Environment Variables

- `NEXT_PUBLIC_BASE_URL` - Base URL for the frontend application
- `API_BASE_URL` - URL for the backend API (assumed for Phase II)
- `AUTH_SECRET` - Secret key for authentication (required for Better Auth)

## Troubleshooting

### Common Issues
- **JWT not being sent**: Ensure API calls go through the API client
- **Authentication not persisting**: Check httpOnly cookie configuration
- **Build errors**: Verify all dependencies are installed and compatible

### Debugging Tips
- Check browser developer tools for network requests
- Verify JWT token is stored in httpOnly cookie
- Confirm API endpoints match contract specifications