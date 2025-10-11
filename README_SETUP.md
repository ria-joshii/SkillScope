# OSCE AI Analysis System - Setup Guide

## Prerequisites
- Node.js 18+
- Python 3.8+
- MySQL 8.0+

## Installation Steps

### 1. Install Node Dependencies
```bash
npm install
```

### 2. Install Python Dependencies
```bash
cd scripts
pip3 install -r requirements.txt
cd ..
```

### 3. Database Setup
```bash
mysql -u root -p < database/schema.sql
```

### 4. Environment Configuration
Create `.env.local` file:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
- Set your Gemini API key
- Configure MySQL connection

### 5. Create Required Directories
```bash
mkdir -p uploads outputs
chmod +x scripts/osce_analyzer.py
```

### 6. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000

## How It Works

1. **Teacher uploads video/audio** → File saved to `uploads/`
2. **API triggers Python script** → `scripts/osce_analyzer.py`
3. **Python processes with Gemini AI** → Generates JSON analysis
4. **Results saved** → `outputs/` directory
5. **Student views results** → Via session ID

## API Endpoints

- `POST /api/upload` - Upload OSCE recording
- `POST /api/process` - Trigger AI analysis
- `GET /api/status/[sessionId]` - Check processing status
- `GET /api/sessions/[sessionId]` - Get session details

## File Structure

```
├── scripts/
│   ├── osce_analyzer.py    # AI analysis script
│   └── requirements.txt     # Python dependencies
├── uploads/                 # Uploaded videos/audio
├── outputs/                 # Analysis results (JSON)
├── src/
│   ├── app/
│   │   ├── teacher/        # Teacher upload UI
│   │   └── student/        # Student view UI
│   └── pages/api/          # API endpoints
└── database/
    └── schema.sql          # Database schema
```

## Troubleshooting

**Python script fails:**
- Check Gemini API key is valid
- Ensure Python packages installed: `pip3 install -r scripts/requirements.txt`

**Upload fails:**
- Check `uploads/` directory exists and is writable
- Verify file size < 100MB

**Processing stuck:**
- Check `outputs/` directory exists
- View logs in terminal for Python errors
