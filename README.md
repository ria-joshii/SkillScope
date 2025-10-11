# OSCE Feedback System

AI-powered OSCE (Objective Structured Clinical Examination) assessment and feedback platform for medical education with advanced bias detection and fairness analysis.

## 🎯 Features

- **AI-Powered Assessment**: Automated scoring of clinical accuracy, communication skills, and empathy
- **Bias Detection & Fairness Analysis**: Comprehensive analysis of speech patterns, audio quality, and cultural competency
- **Real-time Feedback**: Interactive transcript analysis with clickable timestamps
- **Administrator Dashboard**: Advanced analytics and bias monitoring
- **Student Dashboard**: Personal performance tracking and progress monitoring
- **PDF Export**: Comprehensive reports with detailed analysis

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd osce-feedback-system
   npm install --legacy-peer-deps
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database credentials
   ```

3. **Set up the database**
   ```bash
   npm run setup-db
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📊 Key Pages

- **Home** (`/`): Upload OSCE recordings or select demo cases
- **Student Dashboard** (`/student`): Personal performance overview
- **Admin Dashboard** (`/admin`): System analytics and bias monitoring
- **Results** (`/results`): Comprehensive feedback analysis

## 🛠️ Tech Stack

- **Frontend**: Next.js 13, React 18, TypeScript
- **UI**: TailwindCSS, shadcn/ui, Radix UI
- **Charts**: Recharts
- **Database**: PostgreSQL
- **API**: Next.js API Routes

## 📈 Bias Detection Features

- **Speech Rate Analysis**: Normalization and bias detection
- **Accent Bias Detection**: Regional accent analysis
- **Audio Quality Assessment**: Quality-based bias mitigation
- **Cultural Competency Scoring**: Cross-cultural fairness metrics
- **Mitigation Strategies**: Automated bias reduction techniques
- **Fairness Compliance**: Standards adherence tracking

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run setup-db` - Set up database schema and sample data

## 📁 Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── admin/          # Administrator dashboard
│   ├── student/        # Student dashboard
│   ├── results/        # Results analysis
│   └── export/         # PDF export functionality
├── components/ui/      # Reusable UI components
├── lib/                # Utility functions and services
├── pages/api/          # API endpoints
└── types/              # TypeScript type definitions
```

## 🎨 Design Philosophy

- **Medical-Friendly Theme**: Blue/teal color scheme inspired by EMR systems
- **Accessibility**: WCAG compliant components
- **Responsive Design**: Mobile-first approach
- **Clean Interface**: Minimal, focused user experience

## 📝 License

This project is part of the RU Health Hack 2024 competition.

---

**Ready for Demo**: The system is optimized for 4-minute pitch demonstrations with comprehensive bias detection and fairness analysis capabilities.