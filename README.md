# Home Expense Tracker

**Smart expense tracking for modern households** - A full-stack web application built with Next.js that helps individuals and households track, split, and analyze their expenses with real-time collaboration and intelligent insights.

## Table of Contents

- [Features (Working)](#features-working)
- [Features (Planned/Not Yet Working)](#features-plannednot-yet-working)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Testing](#testing)
- [Security & Best Practices](#security--best-practices)
- [Code Comments Style](#code-comments-style)
- [Future Roadmap](#future-roadmap)
- [License & Copyright](#license--copyright)

## Features (Working)

### ✅ Authentication & Security
- **JWT-based authentication** with secure httpOnly cookies
- **User registration and login** with password hashing (bcrypt)
- **Protected routes** with middleware-based authentication
- **Session management** with automatic token refresh
- **Logout functionality** with proper cookie cleanup
- **JWT self-test script** for debugging authentication issues

### ✅ Dashboard & Navigation
- **Responsive dashboard layout** with sidebar navigation
- **Dark/light theme toggle** with system preference detection
- **Mobile-responsive design** with hamburger menu
- **User profile display** with avatar and name
- **Protected route structure** under `/dashboard`

### ✅ Expense Management (Core)
- **Add expense modal** with comprehensive form validation
- **Expense splitting options**: Just Me, Split Equally, Custom Split
- **Category selection** with visual icons and color coding
- **Real-time expense display** on dashboard and expenses page
- **Database persistence** with user data isolation
- **Delete expense functionality** with confirmation dialogs
- **Search and filter** expenses by category and description
- **Monthly/yearly expense totals** with trend calculations

### ✅ Database & Data Management
- **SQLite database** with Prisma ORM
- **User-specific data isolation** - each user sees only their expenses
- **Category management** with auto-creation for new categories
- **Expense splits tracking** with payment status
- **Data persistence** across sessions and server restarts
- **Optimistic UI updates** with API fallback

### ✅ UI/UX Components
- **Empty state components** with encouraging call-to-actions
- **Loading states** with spinners and skeleton screens
- **Error handling** with user-friendly messages
- **Form validation** with real-time feedback
- **Responsive card layouts** for expenses and metrics
- **Chart placeholders** for future data visualization

## Features (Planned/Not Yet Working)

### 🚧 Advanced Expense Features
- **Receipt upload and OCR** processing for automatic expense entry
- **Recurring expense** setup and management
- **Expense editing** functionality (currently read-only after creation)
- **Bulk expense operations** (import/export, bulk delete)
- **Expense tags and notes** enhancement

### 🚧 Household & Collaboration
- **Household creation and management** with invite codes
- **Real-time expense sharing** between household members
- **Settlement tracking** for split expenses
- **Notification system** for pending payments
- **Household member roles** and permissions

### 🚧 Analytics & Reporting
- **Interactive charts** for spending patterns and trends
- **Budget creation and tracking** with alerts
- **Expense categorization insights** with recommendations
- **Monthly/yearly reports** with PDF export
- **Spending goal tracking** and achievement badges

### 🚧 Advanced Features
- **PWA capabilities** for offline functionality
- **Mobile app** with React Native
- **Bank integration** for automatic transaction import
- **Multi-currency support** with real-time exchange rates
- **Advanced search** with date ranges and filters

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library with hooks and context
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Radix UI** - Accessible component primitives

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Database toolkit and query builder
- **SQLite** - Lightweight database for development
- **bcryptjs** - Password hashing
- **Jose** - JWT token handling

### Authentication & Security
- **JWT (JSON Web Tokens)** - Stateless authentication
- **HTTP-only cookies** - Secure token storage
- **Middleware protection** - Route-level security
- **CORS protection** - Cross-origin request security

### Development Tools
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Prisma Studio** - Database GUI

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HomeExpenseTracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   Create a `.env` file in the root directory and add the required variables (see [Environment Variables](#environment-variables) section below)

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `JWT_SECRET` | Secret key for JWT token signing (min 32 chars) | `your-super-secret-jwt-key-that-is-at-least-32-characters-long` | ✅ |
| `DATABASE_URL` | SQLite database connection string | `file:./prisma/dev.db` | ✅ |
| `NODE_ENV` | Environment mode | `development` | ✅ |
| `NEXTAUTH_URL` | Base URL for authentication callbacks | `http://localhost:3000` | ✅ |

### Generating JWT_SECRET
```bash
# Generate a secure random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Database Setup

### Initial Setup
```bash
# Generate Prisma client
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name init

# Seed database (if seed file exists)
npx prisma db seed
```

### Database Management
```bash
# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (development only)
npx prisma migrate reset

# Push schema changes without migration
npx prisma db push
```

### Database Schema
The application uses the following main models:
- **User** - User accounts with authentication
- **Category** - Expense categories (user-specific)
- **Expense** - Individual expense records
- **Split** - Expense splitting between users
- **Household** - Shared household groups
- **Budget** - Budget tracking and limits

## Testing

### JWT Authentication Test
I implemented a comprehensive JWT self-test script to validate the authentication flow:

```bash
npm run test-jwt
```

This script tests:
- JWT token generation and signing
- Token verification with multiple libraries
- Environment variable consistency
- Clock tolerance and algorithm validation

### Manual Testing
1. **Registration Flow**: Create new account at `/register`
2. **Login Flow**: Sign in at `/login`
3. **Protected Routes**: Verify dashboard access requires authentication
4. **Expense Creation**: Add expenses through the dashboard
5. **Data Persistence**: Logout and login to verify data persistence

## Security & Best Practices

### Authentication Security
- **JWT tokens** stored in httpOnly cookies (not localStorage)
- **Secure cookie flags** with SameSite protection
- **CSRF protection** through cookie-based authentication
- **Password hashing** with bcrypt (12 rounds)
- **Token expiration** with 7-day validity

### Data Protection
- **User data isolation** - strict database-level separation
- **Input validation** on all API endpoints
- **SQL injection prevention** through Prisma ORM
- **XSS protection** through React's built-in escaping

### Environment Security
- **No secrets in code** - all sensitive data in environment variables
- **`.gitignore` protection** - excludes `.env`, database files, and build artifacts
- **Environment validation** - runtime checks for required variables

### CORS & Headers
- **Same-origin policy** enforcement
- **Secure headers** for production deployment
- **Content Security Policy** ready for implementation

## Future Roadmap

### Phase 1: Core Functionality (Next 2-4 weeks)
- [ ] **Expense editing** - Allow users to modify existing expenses
- [ ] **Receipt upload** - Image upload with basic OCR processing
- [ ] **Budget creation** - Set monthly/category budgets with alerts
- [ ] **Expense search** - Advanced filtering and date range selection

### Phase 2: Collaboration Features (1-2 months)
- [ ] **Household management** - Create and join households with invite codes
- [ ] **Real-time expense sharing** - Live updates for household members
- [ ] **Settlement tracking** - Track who owes what to whom
- [ ] **Payment notifications** - Email/push notifications for pending payments

### Phase 3: Analytics & Insights (2-3 months)
- [ ] **Interactive charts** - Spending trends and category breakdowns
- [ ] **Spending insights** - AI-powered recommendations and patterns
- [ ] **Export functionality** - PDF reports and CSV data export
- [ ] **Goal tracking** - Savings goals and achievement system

### Phase 4: Advanced Features (3-6 months)
- [ ] **PWA implementation** - Offline functionality and app-like experience
- [ ] **Mobile app** - React Native version for iOS/Android
- [ ] **Bank integration** - Automatic transaction import via APIs
- [ ] **Multi-currency** - Support for international expenses

### Phase 5: Enterprise Features (6+ months)
- [ ] **Team workspaces** - Business expense tracking
- [ ] **Advanced reporting** - Custom report builder
- [ ] **API access** - Third-party integrations
- [ ] **White-label solution** - Customizable branding

## License & Copyright

© 2024 Sachin Chhetri. All rights reserved.

This project is proprietary software developed by Sachin Chhetri. Unauthorized copying, modification, distribution, or use of this software is strictly prohibited without explicit written permission from the copyright holder.

---

**Built with ❤️ by Sachin Chhetri** | [Portfolio](https://sachinpc202.netlify.app)
