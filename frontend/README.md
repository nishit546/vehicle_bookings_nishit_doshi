# Vehicle Bookings — Frontend Dashboard

A full-stack admin + user dashboard for managing 18,000+ vehicle booking records, built with React, MUI, and Express/MongoDB backend.

## Tech Stack

- **Vite + React** — Build tool & UI framework
- **MUI v6** — Component library
- **Tailwind CSS v4** — Utility CSS
- **Redux Toolkit** — State management
- **React Router v7** — Routing with lazy loading
- **Axios** — HTTP client with interceptors
- **Formik + Yup** — Forms & validation
- **Recharts** — Analytics charts
- **Notistack** — Toast notifications
- **React Helmet Async** — SEO metadata

## Folder Structure

```
src/
├── app/           # Theme config
├── components/    # Reusable UI (Button, Table, Modal, etc.)
├── features/      # Feature-based modules
├── hooks/         # Custom hooks
├── layouts/       # Dashboard layout (sidebar + navbar)
├── pages/         # Route pages (auth, dashboard, users, etc.)
├── routes/        # Route config + protected route guard
├── services/      # API layer (Axios instances)
├── store/         # Redux Toolkit (authSlice, uiSlice)
├── utils/         # Helpers
```

## Getting Started

```bash
cd frontend
npm install
npm run dev     # → http://localhost:3000
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## Features

- JWT authentication (login/register/logout)
- Protected routes with role-based access
- User management (CRUD with Modals + Formik/Yup)
- Bookings data listing (search, filter, pagination)
- Analytics dashboard (Revenue, Status, Locations, Ratings charts)
- Profile management (view/edit)
- Dark/Light theme (persisted)
- Toast notifications
- Skeleton loaders, empty states, error states
- Lazy-loaded routes for performance
- SEO metadata via React Helmet

## API Integration

All pages connect to the backend at `/api/v1/*` via Axios. The dev server proxies `/api` requests to `http://localhost:5000`.
