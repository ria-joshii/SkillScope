# OSCE Feedback System

A professional OSCE (Objective Structured Clinical Examination) feedback system with teacher upload and student result viewing capabilities.

## Features

- **Teacher Portal**: Upload OSCE recordings (MP4/MP3) for analysis
- **Student Portal**: View feedback reports using unique session IDs
- **Database Integration**: MySQL database for user management and session tracking
- **Professional UI**: Clean, minimal interface without emojis or fake data

## Setup

### 1. Database Setup

```bash
# Create MySQL database
mysql -u root -p < database/schema.sql
```

### 2. Environment Configuration


Create a `.env.local` file:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=osce_feedback
```


### 2a. setup 
cd scripts && pip3 install -r requirements.txt && cd ..
mkdir -p uploads outputs
chmod +x scripts/osce_analyzer.py
npm run dev



### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

## Usage

### Admin Login (for testing)
- Email: `admin@admin.com`
- Password: `admin`

### Teacher Login
- Email: `teacher@rutgers.edu`
- Password: `password123`

### Student Login
- Email: `student@rutgers.edu`
- Password: `password123`

## API Endpoints

- `POST /api/auth/login` - User authentication
- `POST /api/upload` - File upload (teacher only)
- `GET /api/sessions` - List sessions (teacher only)
- `GET /api/sessions/[sessionId]` - Get session details (student)

## File Structure

```
src/
├── app/
│   ├── login/page.tsx      # Login page
│   ├── teacher/page.tsx    # Teacher portal
│   └── student/page.tsx    # Student portal
├── pages/api/
│   ├── auth/login.ts       # Authentication API
│   ├── upload.ts           # File upload API
│   ├── sessions.ts         # Sessions list API
│   └── sessions/[sessionId].ts # Session details API
└── database/
    └── schema.sql          # Database schema
```

## Backend Integration

The system is designed to integrate with a Python backend for:
1. Video/audio processing
2. AI analysis
3. PDF report generation

The upload API stores files and creates session records. The backend should:
1. Process uploaded files
2. Update session status to 'completed'
3. Store PDF path in database
4. Set status to 'failed' if processing fails
