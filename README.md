# 🎓 EduAI Admin — AI-Powered EdTech Dashboard

A modern, production-ready admin dashboard for EdTech platforms with AI-powered features, built with Next.js 16, TypeScript, Tailwind CSS v4, and Framer Motion.

![Dashboard Preview](https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎯 Core Features
- **Dashboard Overview** — Real-time stats, revenue analytics, AI usage tracking
- **Student Management** — 48K+ students with progress tracking, AI usage analytics
- **Teacher Management** — Instructor approvals, earnings dashboard, verification system
- **Course Management** — Create, edit, publish courses with AI-generated summaries
- **AI Content Control Panel** — Generate study notes, quizzes, podcasts, flashcards
- **Podcast Management** — AI voice generation, transcript viewer, episode analytics
- **Quiz & Exam System** — Auto-generate MCQs, leaderboards, pass rate analytics
- **Payment & Subscriptions** — Revenue tracking, Razorpay/Stripe integration UI
- **Analytics Dashboard** — User engagement, retention curves, geographic distribution
- **Notifications Center** — Push notifications, email alerts, announcements
- **Settings** — API keys, AI model config, roles & permissions

### 🎨 Design Features
- **Modern Glassmorphism UI** — Frosted glass effects with backdrop blur
- **Dark/Light Mode** — Seamless theme switching with system preference support
- **Smooth Animations** — Framer Motion powered transitions and micro-interactions
- **Responsive Design** — Mobile, tablet, and desktop optimized
- **AI-Focused Aesthetics** — Gradient accents, glow effects, futuristic look
- **Interactive Charts** — Recharts with area, bar, pie, radar, and line charts
- **Real-time Updates** — Live user counts, AI status indicators

### 🤖 AI Integration Ready
- **OpenAI GPT-4o** — Text generation, study notes, summaries
- **Google Gemini Pro** — Alternative AI model support
- **Ollama Llama 3.2** — Local AI model integration
- **HuggingFace** — Custom model support
- **Voice Models** — Neural Voice Pro, Studio Voice, ElevenLabs
- **Token Usage Tracking** — Monitor AI costs and usage limits

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ and npm
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Navigate to project directory
cd edtech-admin

# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
edtech-admin/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Dashboard Overview
│   ├── students/page.tsx         # Student Management
│   ├── teachers/page.tsx         # Teacher Management
│   ├── courses/page.tsx          # Course Management
│   ├── ai-control/page.tsx       # AI Content Control Panel
│   ├── podcasts/page.tsx         # Podcast Management
│   ├── quizzes/page.tsx          # Quiz & Exam System
│   ├── payments/page.tsx         # Payments & Subscriptions
│   ├── analytics/page.tsx        # Analytics Dashboard
│   ├── notifications/page.tsx    # Notifications Center
│   ├── settings/page.tsx         # Settings & Configuration
│   ├── layout.tsx                # Root layout with providers
│   └── globals.css               # Global styles & Tailwind
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx           # Collapsible sidebar navigation
│   │   ├── Navbar.tsx            # Top navigation bar
│   │   └── AIAssistantPanel.tsx  # Right-side AI chat panel
│   └── ui/
│       ├── StatCard.tsx          # Animated stat cards
│       ├── Badge.tsx             # Status badges
│       ├── PageHeader.tsx        # Page title headers
│       └── DataTable.tsx         # Sortable data tables
│
├── contexts/
│   ├── ThemeContext.tsx          # Dark/Light mode provider
│   └── SidebarContext.tsx        # Sidebar state management
│
├── lib/
│   ├── utils.ts                  # Utility functions
│   └── dummy-data.ts             # Mock data for demo
│
└── public/                       # Static assets

```

## 🎨 Tech Stack

### Frontend
- **Next.js 16.2.6** — React framework with App Router
- **React 19** — Latest React with concurrent features
- **TypeScript 5** — Type-safe development
- **Tailwind CSS v4** — Utility-first CSS framework
- **Framer Motion 12** — Animation library
- **Recharts 3** — Chart library for data visualization
- **Lucide React** — Beautiful icon library
- **Radix UI** — Headless UI components

### Features
- **Server Components** — Optimized rendering
- **Turbopack** — Fast bundler for development
- **CSS-first Tailwind v4** — New @theme syntax
- **Responsive Design** — Mobile-first approach
- **Accessibility** — WCAG compliant components

## 🎯 Pages Overview

### 1. Dashboard (`/`)
- Total students, teachers, courses, AI usage stats
- Revenue analytics with 6-month trend
- AI usage breakdown by content type
- Course distribution pie chart
- User engagement heatmap
- Recent activity feed
- AI model status cards

### 2. Students (`/students`)
- 48,291 students with search & filters
- Student profiles with progress tracking
- Subscription plans (Basic, Pro, Enterprise)
- AI usage per student
- Quiz scores and completion rates
- Activity timeline
- Bulk actions (export, suspend)

### 3. Teachers (`/teachers`)
- 1,847 teachers with verification status
- Earnings dashboard per instructor
- Course count and student reach
- AI content generation stats
- Approval workflow for new teachers
- Rating and review system

### 4. Courses (`/courses`)
- 3,642 courses with grid/table view
- Course creation with rich text editor
- AI-generated summaries toggle
- Completion rate tracking
- Revenue per course
- Category distribution
- Publish/draft/review status

### 5. AI Control Panel (`/ai-control`)
- Generate study notes, quizzes, podcasts, flashcards
- Multi-model support (GPT-4o, Gemini, Ollama)
- Token usage tracking and limits
- Prompt history with status
- Weekly usage charts
- Cost monitoring per model

### 6. Podcasts (`/podcasts`)
- AI-generated audio content
- Voice model selector (Neural, Studio, ElevenLabs)
- Audio player with progress bar
- Transcript viewer
- Play count analytics
- Upload custom audio

### 7. Quizzes (`/quizzes`)
- Auto-generate MCQs with AI
- Difficulty levels (Easy, Medium, Hard)
- Pass rate analytics
- Student leaderboard with rankings
- Quiz attempt tracking
- Performance heatmaps

### 8. Payments (`/payments`)
- Revenue trend charts (6 months)
- Transaction history table
- Subscription plan distribution
- Payment gateway status (Razorpay, Stripe, PayPal)
- Invoice management
- Refund tracking

### 9. Analytics (`/analytics`)
- Student engagement metrics
- Retention curve (8-week cohort)
- Course completion rates
- Platform health radar chart
- Geographic distribution map
- Real-time active users
- NPS score tracking

### 10. Notifications (`/notifications`)
- Push notification composer
- Email notification settings
- Alert preferences by type
- Notification history feed
- Delivery rate analytics
- Announcement system

### 11. Settings (`/settings`)
- Platform configuration
- AI API keys management (show/hide)
- Theme customization (Dark/Light)
- Security settings (2FA, IP whitelist)
- Admin roles & permissions
- Notification preferences

## 🎨 Design System

### Color Palette
- **Primary**: Indigo (#6366f1)
- **Secondary**: Purple (#a855f7)
- **Accent**: Cyan (#06b6d4)
- **Success**: Emerald (#22c55e)
- **Warning**: Yellow (#eab308)
- **Danger**: Red (#ef4444)

### Typography
- **Font**: Inter (Google Fonts)
- **Mono**: JetBrains Mono

### Animations
- Fade in/out transitions
- Slide animations for modals
- Pulse effects for live indicators
- Gradient shifts for AI elements
- Card hover effects
- Progress bar animations

### Components
- Glass morphism cards
- Gradient text effects
- Glow shadows for AI features
- Animated stat cards
- Interactive charts
- Responsive tables
- Modal drawers

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:

```env
# AI API Keys
OPENAI_API_KEY=your_openai_key
GOOGLE_AI_API_KEY=your_gemini_key
HUGGINGFACE_TOKEN=your_hf_token

# Payment Gateways
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
STRIPE_SECRET_KEY=your_stripe_key

# Database (optional)
DATABASE_URL=your_database_url

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
```

### Tailwind Configuration
Tailwind v4 uses CSS-first configuration in `app/globals.css`:

```css
@theme {
  --color-primary-500: #6366f1;
  --font-sans: 'Inter', system-ui, sans-serif;
  --shadow-glow: 0 0 20px rgba(99, 102, 241, 0.4);
}
```

## 📊 Dummy Data

The dashboard uses realistic dummy data from `lib/dummy-data.ts`:
- 48,291 students
- 1,847 teachers
- 3,642 courses
- 284 quizzes
- 892,341 AI generations
- $284,750 monthly revenue

Replace with real API calls for production.

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Other Platforms
- **Netlify**: Connect GitHub repo
- **Railway**: One-click deploy
- **AWS Amplify**: Connect Git provider

## 🎯 Roadmap

- [ ] Real-time WebSocket updates
- [ ] Advanced AI model fine-tuning
- [ ] Multi-language support (i18n)
- [ ] Mobile app (React Native)
- [ ] Video conferencing integration
- [ ] Gamification system
- [ ] Advanced analytics with ML
- [ ] White-label customization

## 📝 License

MIT License — Free for personal and commercial use.

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📧 Support

For questions or support, contact: admin@edtech.ai

---

**Built with ❤️ using Next.js, TypeScript, and AI**

🌐 **Live Demo**: http://localhost:3000
📚 **Documentation**: [Next.js Docs](https://nextjs.org/docs)
🎨 **Design**: Modern SaaS UI with AI aesthetics
