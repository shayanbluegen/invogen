# InvoGen 🧾

A modern invoice generation application built with Next.js, Prisma, and TypeScript. Create, manage, and send professional invoices with multiple PDF templates and multi-currency support.

## Features ✨

- **User Authentication** - Secure login/logout with bcrypt password hashing
- **Invoice Management** - Create, edit, and track invoices with different statuses
- **Client Management** - Organize and manage your client database
- **Company Profile** - Set up your business information and branding
- **PDF Templates** - Multiple professional invoice templates (Modern Minimalist, Classic Professional, Corporate Executive, Creative Designer)
- **Multi-Currency Support** - Support for multiple currencies with conversion
- **Dashboard Analytics** - Revenue tracking and invoice metrics
- **Responsive Design** - Built with Tailwind CSS and shadcn/ui components

## Tech Stack 🛠️

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS, shadcn/ui
- **PDF Generation**: @react-pdf/renderer
- **Authentication**: Cookie-based sessions with bcryptjs
- **Forms**: React Hook Form with Zod validation

## Prerequisites 📋

Before you begin, ensure you have the following installed:

- Node.js (version 18 or higher)
- npm, yarn, pnpm, or bun
- PostgreSQL database (local or cloud)

## Getting Started 🚀

### 1. Clone the repository

```bash
git clone <repository-url>
cd invogen
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the root directory and add the following environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/invogen?schema=public"

# Node Environment
NODE_ENV="development"
```

**Important:** Replace the `DATABASE_URL` with your actual PostgreSQL connection string:
- For local PostgreSQL: `postgresql://username:password@localhost:5432/invogen`
- For cloud providers like Supabase, Railway, or PlanetScale: Use their provided connection string

### 4. Database Setup

Generate Prisma Client and run migrations:

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with sample data
npm run db:seed
```

### 5. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### 6. Login Credentials

After seeding the database, you can login with these test accounts:

- **Email**: `john@example.com`
- **Password**: `password123`

OR

- **Email**: `jane@example.com`
- **Password**: `password123`

## Available Scripts 📝

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run db:seed` - Seed the database with sample data
- `npm run ui` - Add shadcn/ui components
- `npm run prisma` - Run Prisma CLI commands

## Project Structure 📁

```
invogen/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts               # Database seeding
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── dashboard/        # Dashboard pages
│   │   ├── login/           # Authentication
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layouts/         # Layout components
│   │   └── pdf-templates/   # Invoice PDF templates
│   ├── lib/
│   │   ├── auth.ts          # Authentication logic
│   │   ├── prisma.ts        # Prisma client
│   │   ├── currency.ts      # Currency utilities
│   │   └── utils.ts         # Utility functions
│   └── generated/           # Generated Prisma client
└── public/                  # Static assets
```

## Database Schema 🗄️

The application uses the following main models:

- **User** - User accounts with authentication
- **Company** - Business information and settings
- **Client** - Customer/client information
- **Invoice** - Invoice records with items
- **InvoiceItem** - Individual line items in invoices

## Features Guide 📖

### Creating Your First Invoice

1. **Set up Company Profile**: Go to Company settings and fill in your business details
2. **Add Clients**: Navigate to Clients and add your customers
3. **Create Invoice**: Go to Invoices → New Invoice
4. **Select Template**: Choose from available PDF templates
5. **Add Items**: Add line items with descriptions, quantities, and prices
6. **Generate PDF**: Preview and download your professional invoice

### PDF Templates

- **Modern Minimalist** - Clean, simple design
- **Classic Professional** - Traditional business style
- **Corporate Executive** - Formal corporate layout  
- **Creative Designer** - Modern, creative aesthetic

## Environment Variables Reference 🔧

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | `postgresql://user:pass@localhost:5432/invogen` |
| `NODE_ENV` | Environment mode | No | `development` or `production` |

## Deployment 🚀

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Contributing 🤝

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting 🔧

### Common Issues

1. **Database Connection Error**: Verify your `DATABASE_URL` is correct
2. **Prisma Client Issues**: Run `npx prisma generate` after schema changes
3. **Migration Errors**: Check database permissions and connection
4. **Build Errors**: Ensure all environment variables are set

### Reset Database

If you need to reset your database:

```bash
npx prisma migrate reset
npm run db:seed
```

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Support 💬

If you have any questions or run into issues, please:

1. Check the troubleshooting section above
2. Review the [Next.js documentation](https://nextjs.org/docs)
3. Check the [Prisma documentation](https://prisma.io/docs)
4. Open an issue in this repository

---

Built with ❤️ using Next.js and modern web technologies.
