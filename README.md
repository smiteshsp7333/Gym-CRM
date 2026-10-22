# Gym-CRM

> Enterprise-grade gym management, athlete retention, and automated operations platform.

A modern, high-performance web platform built with **Next.js 15 (App Router)**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**. Designed for modern fitness centers, clubs, and athletic training facilities to streamline memberships, billing, attendance, lead pipelines, and personalized nutrition plans.

---

## Key Capabilities

- **Executive Analytics Dashboard**: Real-time revenue tracking, active athlete counts, daily check-in velocity, and membership tier distribution.
- **Athlete Management**: Complete member directory, profile lifecycles, attendance streaks, and birthday alerts.
- **Biometric & Floor Attendance**: Instant check-in logger with real-time floor occupancy feeds and historical logging.
- **Billing, Invoicing & GST Accounting**: Instant invoice generation, pending payment tracking, and 1-click WhatsApp payment reminders.
- **Lead Generation Pipeline**: Multi-channel lead tracking (Walk-in, Phone, Instagram, WhatsApp) with scheduled trial workouts and follow-up alerts.
- **Diet & Nutrition Engine**: Custom meal planning, caloric macronutrient calculations, and WhatsApp delivery templates.
- **Executive Authentication**: Minimalist split-screen authentication featuring automated role detection for administrators and athletes.

---

## Technology Stack

| Component | Specification |
|:---|:---|
| **Framework** | Next.js 15 (App Router) with React 19 |
| **Language** | TypeScript (ES2022) |
| **Database** | PostgreSQL |
| **ORM** | Prisma ORM 6 |
| **Icons** | Lucide React (100% pure icon system) |
| **Styling** | Tailwind CSS with CSS Variables & Dark Theme |
| **Components** | Radix UI primitives & custom styled surfaces |
| **Deployment** | Vercel Serverless / Edge ready |

---

## Getting Started

### Prerequisites

- Node.js 18.18+ or 20+
- PostgreSQL database (Local or Cloud e.g. Neon, Supabase, Railway)
- npm package manager

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/smiteshsp7333/Gym-CRM.git
   cd Gym-CRM
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/gym_crm?schema=public"
   DIRECT_URL="postgresql://username:password@localhost:5432/gym_crm?schema=public"
   JWT_SECRET="your-secure-jwt-secret-key-32-chars-minimum"
   ```

4. **Initialize Database Schema**:
   ```bash
   npx prisma db push
   ```

5. **Start Local Development Server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Deployment on Vercel

1. Push your code to your GitHub repository: `https://github.com/smiteshsp7333/Gym-CRM`.
2. Navigate to [vercel.com/new](https://vercel.com/new) and select **Gym-CRM**.
3. In the **Environment Variables** section, configure:
   - `DATABASE_URL`: Hosted PostgreSQL connection URL with connection pooling (e.g. Neon Serverless Postgres).
   - `DIRECT_URL`: Direct PostgreSQL connection URL (port 5432).
   - `JWT_SECRET`: Random 32+ character secret string.
4. Click **Deploy**. Vercel will automatically run `prisma generate` and `next build`.

---

## License

This project is licensed under the MIT License.