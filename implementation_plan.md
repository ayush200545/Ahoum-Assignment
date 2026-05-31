# Implementation Plan — Sessions Marketplace

This plan outlines the creation of the full-stack **Sessions Marketplace (Sessionly)** from scratch in the empty workspace. We will build a premium, highly interactive application with beautiful styling (TailwindCSS, custom fonts Satoshi and Cabinet Grotesk, glassmorphism, smooth animations) and complete Docker-compose setups.

## User Review Required

> [!IMPORTANT]
> - **OAuth Redirect Handling**: `social-django` completes its flow inside a standard Django session. To bridge this with simplejwt on our SPA React frontend, we have introduced a custom Django view `oauth_redirect` mapped to `LOGIN_REDIRECT_URL`. This view generates simplejwt tokens and redirects the user's browser back to the frontend's `/auth/callback` page with these tokens as query parameters, enabling `AuthCallback.jsx` to parse and store them.
> - **Default Ports**:
>   - Web Application Port: `80` (mapped via Nginx)
>   - MinIO Console Port: `9001`
>   - Django Admin: `http://localhost/admin/`

## Open Questions

> [!NOTE]
> None. The assignment requirements are comprehensive and we've designed beautiful, working implementations for any unprovided UI pages (e.g. `Profile.jsx`, `NotFound.jsx`, `index.css`, `index.html`) to deliver a fully functional product.

---

## Proposed Changes

We will populate the root directory `d:\Ahoum_Assignment\` with the files listed below.

### 1. Infrastructure Layer

#### [NEW] [docker-compose.yml](file:///d:/Ahoum_Assignment/docker-compose.yml)
- Configures Postgres, Django Backend, React Frontend, Nginx, and MinIO services.

#### [NEW] [nginx.conf](file:///d:/Ahoum_Assignment/nginx/nginx.conf)
- Configures reverse proxying for `/api/`, `/admin/`, static files, and the React frontend.

#### [NEW] [.env.example](file:///d:/Ahoum_Assignment/.env.example)
- The required template for project secrets, OAuth IDs, Stripe details, and MinIO settings.

#### [NEW] [.env](file:///d:/Ahoum_Assignment/.env)
- Local runtime environment file preconfigured with default developer keys to allow instant "one-command" startup.

---

### 2. Backend (Django 4.2 + DRF)

We will initialize the Django skeleton structure and create individual apps for **Accounts**, **Sessions**, and **Bookings**.

#### [NEW] [manage.py](file:///d:/Ahoum_Assignment/backend/manage.py)
- Standard Django entry point script.

#### [NEW] [Dockerfile](file:///d:/Ahoum_Assignment/backend/Dockerfile)
- Slim Python-3.11 environment with compilation tools and package installation.

#### [NEW] [requirements.txt](file:///d:/Ahoum_Assignment/backend/requirements.txt)
- Specifies Django, DRF, simplejwt, social-auth-django, PostgreSQL drivers, pillow, and CORS headers.

#### [NEW] [base.py](file:///d:/Ahoum_Assignment/backend/config/settings/base.py)
- Core Django settings containing authentication backends, simplejwt lifetimes, social pipeline steps, and Stripe parameters.

#### [NEW] [development.py](file:///d:/Ahoum_Assignment/backend/config/settings/development.py)
- Extends base settings to enable Debug and permissive CORS origins.

#### [NEW] [production.py](file:///d:/Ahoum_Assignment/backend/config/settings/production.py)
- Production security configurations.

#### [NEW] [urls.py](file:///d:/Ahoum_Assignment/backend/config/urls.py)
- Global routing including auth, sessions, bookings, social logins, and interactive Swagger UI documentation.

#### [NEW] [wsgi.py](file:///d:/Ahoum_Assignment/backend/config/wsgi.py) & [asgi.py](file:///d:/Ahoum_Assignment/backend/config/asgi.py)
- WSGI & ASGI entrypoints.

#### [NEW] [Accounts App](file:///d:/Ahoum_Assignment/backend/apps/accounts/)
- `models.py`: Custom `User` model supporting `ROLE_USER` and `ROLE_CREATOR`, bio, and avatar.
- `pipeline.py`: Pulls avatar URLs from Google/GitHub profiles.
- `permissions.py`: Permissions check for Creators and Owners.
- `serializers.py`: User profile read/update schema.
- `views.py`: Controls JWT generation, Profile fetch, and Custom `oauth_redirect` view to pass tokens to React.
- `urls.py`: Maps token refresh, logout, profile, and oauth callback paths.
- `create_superuser_if_none_exists.py`: Auto-provisioner command.

#### [NEW] [Sessions App](file:///d:/Ahoum_Assignment/backend/apps/sessions/)
- `models.py`: `Session` and `Category` schemas.
- `serializers.py`: Formats sessions, embeds creators, computes remaining slots.
- `views.py`: Session catalog with filtering/searching, Creator list, and category lists.
- `seed_data.py`: Seed script supplying realistic starter sessions.

#### [NEW] [Bookings App](file:///d:/Ahoum_Assignment/backend/apps/bookings/)
- `models.py`: `Booking` table mapping users, sessions, status, and Stripe session metadata.
- `serializers.py`: Validates slot availability and duplicate bookings.
- `views.py`: Booking creation (auto-confirms free, handles paid via Stripe checkout and webhooks).

---

### 3. Frontend (React 18 + Vite)

We will set up a premium React application featuring elegant Cabinet Grotesk typography, rich dark/light states, smooth Framer Motion catalog animations, and complete CRUD dashboards.

#### [NEW] [package.json](file:///d:/Ahoum_Assignment/frontend/package.json)
- React 18, React Router DOM, React Query, Zustand, Axios, Lucide Icons, Framer Motion, and Tailwind CSS.

#### [NEW] [vite.config.js](file:///d:/Ahoum_Assignment/frontend/vite.config.js)
- Standard development server setup with workspace path aliasing.

#### [NEW] [tailwind.config.js](file:///d:/Ahoum_Assignment/frontend/tailwind.config.js)
- Establishes Satoshi and Cabinet Grotesk typography and brand HSL color schemes.

#### [NEW] [postcss.config.js](file:///d:/Ahoum_Assignment/frontend/postcss.config.js)
- Enables Tailwind and Autoprefixer compilation.

#### [NEW] [index.html](file:///d:/Ahoum_Assignment/frontend/index.html)
- Main HTML structure pulling high-quality fonts from Fontshare.

#### [NEW] [index.css](file:///d:/Ahoum_Assignment/frontend/src/index.css)
- Imports Tailwind base styles and standard glassmorphic/shimmer components.

#### [NEW] [main.jsx](file:///d:/Ahoum_Assignment/frontend/src/main.jsx)
- Renders React with Query Client, Router, and global Toast notifications.

#### [NEW] [App.jsx](file:///d:/Ahoum_Assignment/frontend/src/App.jsx)
- Implements application routes, navigation, and protected route handlers for users and creators.

#### [NEW] [Zustand & Axios](file:///d:/Ahoum_Assignment/frontend/src/store/authStore.js) & [axios.js](file:///d:/Ahoum_Assignment/frontend/src/lib/axios.js)
- Provides persistent state management and auto-refresh interceptors for JWT renewals.

#### [NEW] [API Core](file:///d:/Ahoum_Assignment/frontend/src/api/index.js)
- Simple endpoints covering sessions, bookings, and user auth.

#### [NEW] [Pages](file:///d:/Ahoum_Assignment/frontend/src/pages/)
- `Home.jsx`: Catalog listing, tag search, category filter, and interactive hero banner.
- `SessionDetail.jsx`: Dynamic details, spots counter, and Stripe/Free booking triggers.
- `AuthCallback.jsx`: Captures JWT from social auth and routes to correct dashboard.
- `UserDashboard.jsx`: Learner bookings categorized by upcoming/past states with cancel option.
- `CreatorDashboard.jsx`: Key metrics (Revenue, Sessions, Bookings) and list of creator sessions.
- `Profile.jsx`: View and update user profiles, toggle creator mode, and update avatars.
- `NotFound.jsx`: Elegant 404 page.

#### [NEW] [Shared Components](file:///d:/Ahoum_Assignment/frontend/src/components/shared/)
- `Navbar.jsx`: Premium header containing navigation, dark mode, dynamic avatar menu, and social logins.
- `SessionCard.jsx`: Interactive Framer Motion cards with hover scaling.
- `SkeletonCard.jsx`: Premium shimmer loading placeholders.
- `SessionFormModal.jsx`: Full-featured session editor and file uploader.

---

## Verification Plan

### Automated/Local Checks
- Build the Docker environment using:
  ```bash
  docker-compose up --build -d
  ```
- Validate that the seed script completes successfully.
- Check accessibility of endpoints:
  - Homepage: `http://localhost/`
  - Swagger Documentation: `http://localhost/api/docs/`
  - Django Admin: `http://localhost/admin/`

### Manual Verification
- Test User flow: Create session, book free session, confirm visibility in user dashboard, and verify cancel logic.
- Test Profile update: Switch role to creator, fill bio, upload custom image, and observe real-time header update.
