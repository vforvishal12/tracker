# Holiday Tracker 🏖️

A comprehensive web application for managing team leave requests and holidays, built for teams of up to 100 people.

## Features

### 🎯 Core Functionality
- **Employee Portal**: Submit vacation requests, view personal request history
- **Manager Dashboard**: Approve/reject direct reports' requests with comments
- **Admin Panel**: Full system access, manage all requests and company holidays
- **Interactive Calendar**: Multi-view calendar (Day/Week/Month/Year) with color-coded status indicators

### 🔐 Role-Based Access Control
- **Employee**: Submit and track personal requests
- **Manager**: Manage direct reports' requests
- **Admin**: Full system administration

### 📊 Smart Features
- Real-time approval notifications
- Aggregate statistics (days off taken, pending requests)
- Email notifications (configurable)
- Responsive design with dark/light mode
- Form validation with Zod
- Optimistic UI updates

## Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credential provider
- **UI**: Tailwind CSS + shadcn/ui components
- **Calendar**: react-big-calendar with framer-motion animations
- **Forms**: React Hook Form with Zod validation
- **Deployment**: Vercel-ready

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### 1. Clone and Install
\`\`\`bash
git clone <your-repo>
cd holiday-tracker
npm install
\`\`\`

### 2. Environment Setup
Create `.env.local`:
\`\`\`env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/holiday_tracker"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Optional: Email service (for notifications)
# SMTP_HOST="smtp.gmail.com"
# SMTP_PORT="587"
# SMTP_USER="your-email@gmail.com"
# SMTP_PASS="your-app-password"
\`\`\`

### 3. Database Setup
\`\`\`bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with demo data (100 users + sample requests)
npm run db:seed
\`\`\`

### 4. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` and sign in with demo credentials:
- **Employee**: `john.doe@company.com` / `demo123`
- **Manager**: `sarah.manager@company.com` / `demo123`  
- **Admin**: `admin@company.com` / `demo123`

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Database Options
- **Neon**: Serverless PostgreSQL (recommended for Vercel)
- **Supabase**: Full-stack platform with auth
- **Railway**: Simple PostgreSQL hosting
- **AWS RDS**: Enterprise-grade option

### Environment Variables for Production
\`\`\`env
DATABASE_URL="your-production-db-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="secure-random-string"
\`\`\`

## Project Structure

\`\`\`
holiday-tracker/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── calendar/          # Calendar view
│   └── approvals/         # Manager approval interface
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── calendar-board.tsx # Main calendar component
│   ├── leave-request-form.tsx
│   └── approvals-list.tsx
├── lib/                   # Utilities and configurations
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Database client
│   ├── validations.ts    # Zod schemas
│   └── email.ts          # Email service
├── prisma/               # Database schema and migrations
└── scripts/              # Database seeding scripts
\`\`\`

## API Endpoints

### Leave Requests
- `GET /api/leave` - Fetch leave requests (role-filtered)
- `POST /api/leave` - Create new leave request
- `PATCH /api/leave/[id]` - Approve/reject request
- `DELETE /api/leave/[id]` - Cancel request

### Calendar
- `GET /api/calendar/events` - Fetch calendar events

### Utilities
- `GET /api/leave/pending-count` - Get pending approval count

## Customization

### Brand Colors
Update `app/globals.css` to change the primary brand color:
\`\`\`css
:root {
  --primary: 221.2 83.2% 53.3%; /* #4267b2 */
}
\`\`\`

### Email Templates
Modify `lib/email.ts` to customize notification templates and integrate with your email provider (SendGrid, Resend, etc.).

### Leave Types
Add new leave types in `prisma/schema.prisma`:
\`\`\`prisma
enum LeaveType {
  VACATION
  SICK
  PERSONAL
  MATERNITY
  PATERNITY
  BEREAVEMENT
  SABBATICAL  // Add new types here
  OTHER
}
\`\`\`

### Business Rules
Implement custom approval workflows in `app/api/leave/route.ts`:
- Maximum concurrent absences
- Blackout periods
- Minimum notice requirements
- Department-specific rules

## Roadmap & TODOs

### Phase 1 (Current)
- ✅ Core CRUD operations
- ✅ Role-based permissions
- ✅ Calendar integration
- ✅ Email notifications (stub)

### Phase 2 (Nice-to-Have)
- [ ] Slack/Teams webhook integration
- [ ] CSV export functionality
- [ ] Advanced reporting dashboard
- [ ] Mobile app (React Native)
- [ ] Bulk operations
- [ ] Advanced calendar features (recurring events)

### Phase 3 (Enterprise)
- [ ] SSO integration (SAML, OIDC)
- [ ] Advanced approval workflows
- [ ] Time tracking integration
- [ ] Multi-tenant support
- [ ] Advanced analytics

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Support

For issues and questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed description
3. For urgent matters, contact the development team

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ for modern teams who value work-life balance.
