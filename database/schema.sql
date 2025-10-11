-- NLP-Powered OSCE Feedback System Database Schema
-- Enhanced with Bias Detection and Fairness Analysis

-- Table: students
-- Stores basic information about each medical student
CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    institution VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: osce_sessions
-- Each session corresponds to one OSCE video/audio transcript
CREATE TABLE osce_sessions (
    session_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    video_url TEXT,  -- Link to stored (de-identified) video/audio
    transcript TEXT,  -- Full transcript (optional; segments also stored separately)
    processing_status VARCHAR(20) DEFAULT 'pending',  -- pending | processing | complete | error
    lms_link TEXT,  -- Optional link to LMS session if integrated
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: transcript_segments
-- Segments of conversation parsed from transcript (via rule-based NLP)
CREATE TABLE transcript_segments (
    segment_id SERIAL PRIMARY KEY,
    session_id INT REFERENCES osce_sessions(session_id) ON DELETE CASCADE,
    start_time FLOAT,  -- in seconds
    end_time FLOAT,
    speaker VARCHAR(20),  -- 'student' or 'patient'
    content TEXT NOT NULL,  -- Transcript of that segment
    detected_intent VARCHAR(100),  -- e.g., 'ask_symptom', 'greet_patient' (rule-based NLP)
    sentiment_label VARCHAR(20),  -- e.g., 'positive', 'neutral', 'negative' (keyword or lexicon based)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: exam_actions
-- Manually or heuristically captured physical exam maneuvers (from text or reviewers)
CREATE TABLE exam_actions (
    action_id SERIAL PRIMARY KEY,
    session_id INT REFERENCES osce_sessions(session_id) ON DELETE CASCADE,
    action_type VARCHAR(100),  -- e.g., 'inspection', 'palpation', 'auscultation'
    body_part VARCHAR(50),  -- Optional: 'abdomen', 'chest', etc.
    timestamp FLOAT,  -- When the action occurs (in seconds)
    notes TEXT  -- Optional description or justification
);

-- Table: checklist_items
-- Stores rubric-based evaluation items for structured scoring
CREATE TABLE checklist_items (
    checklist_id SERIAL PRIMARY KEY,
    category VARCHAR(50),  -- 'clinical_content', 'communication', 'professionalism'
    description TEXT NOT NULL,
    expected_behavior TEXT,  -- e.g., "Ask about onset and duration of symptom"
    weight FLOAT DEFAULT 1.0  -- Optional: weight in scoring
);

-- Table: session_checklist_scores
-- Stores performance of a student per checklist item, per session (manual or rule-based)
CREATE TABLE session_checklist_scores (
    score_id SERIAL PRIMARY KEY,
    session_id INT REFERENCES osce_sessions(session_id) ON DELETE CASCADE,
    checklist_id INT REFERENCES checklist_items(checklist_id),
    achieved BOOLEAN,
    reviewer_comments TEXT,  -- Optional reviewer notes
    reviewed_by_human BOOLEAN DEFAULT TRUE
);

-- Table: reviewer_comments
-- Enables manual review and flagging of specific segments
CREATE TABLE reviewer_comments (
    comment_id SERIAL PRIMARY KEY,
    session_id INT REFERENCES osce_sessions(session_id),
    reviewer_name VARCHAR(100),
    comment TEXT,
    segment_reference INT REFERENCES transcript_segments(segment_id),
    is_flagged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced Bias Detection and Fairness Analysis Tables

-- Table: bias_fairness_analysis
-- Comprehensive bias detection and fairness metrics per session
CREATE TABLE bias_fairness_analysis (
    analysis_id SERIAL PRIMARY KEY,
    session_id INT REFERENCES osce_sessions(session_id) ON DELETE CASCADE,
    bias_severity FLOAT DEFAULT 0.0,  -- 0.0 = no bias, 1.0 = high bias
    speech_rate_score FLOAT,  -- Normalized speech rate (0.0-1.0)
    accent_cluster VARCHAR(50),  -- Detected accent region/cluster
    audio_quality_score FLOAT,  -- Audio quality assessment (0.0-1.0)
    gender_bias_score FLOAT DEFAULT 0.0,  -- Gender-related bias detection
    age_bias_score FLOAT DEFAULT 0.0,  -- Age-related bias detection
    regional_bias_score FLOAT DEFAULT 0.0,  -- Regional accent bias
    language_bias_score FLOAT DEFAULT 0.0,  -- Language proficiency bias
    cultural_competency_score FLOAT DEFAULT 0.0,  -- Cultural sensitivity score
    overall_fairness_score FLOAT DEFAULT 0.0,  -- Overall fairness (0.0-1.0)
    fairness_confidence FLOAT DEFAULT 0.0,  -- Confidence in fairness assessment
    analysis_model_version VARCHAR(50),  -- Version of bias detection model
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: bias_mitigation_strategies
-- Available strategies for bias mitigation
CREATE TABLE bias_mitigation_strategies (
    strategy_id SERIAL PRIMARY KEY,
    strategy_name VARCHAR(100) NOT NULL,
    strategy_type VARCHAR(50) NOT NULL,  -- 'speech_normalization', 'accent_agnostic', 'quality_compensation', 'cultural_adjustment'
    description TEXT,
    parameters JSONB,  -- Strategy-specific parameters
    effectiveness_score FLOAT DEFAULT 0.0,  -- Historical effectiveness (0.0-1.0)
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: session_bias_mitigation
-- Tracks which mitigation strategies were applied to each session
CREATE TABLE session_bias_mitigation (
    mitigation_id SERIAL PRIMARY KEY,
    session_id INT REFERENCES osce_sessions(session_id) ON DELETE CASCADE,
    strategy_id INT REFERENCES bias_mitigation_strategies(strategy_id),
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    effectiveness_score FLOAT,  -- Effectiveness of this strategy for this session
    notes TEXT,  -- Additional notes about the mitigation
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: model_versions
-- Tracks different versions of analysis models
CREATE TABLE model_versions (
    model_id SERIAL PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL,
    model_type VARCHAR(50) NOT NULL,  -- 'NLP', 'Bias_Detection', 'Fairness_Analysis'
    version VARCHAR(20) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance optimization
CREATE INDEX idx_osce_sessions_student_id ON osce_sessions(student_id);
CREATE INDEX idx_osce_sessions_date ON osce_sessions(session_date);
CREATE INDEX idx_transcript_segments_session_id ON transcript_segments(session_id);
CREATE INDEX idx_transcript_segments_speaker ON transcript_segments(speaker);
CREATE INDEX idx_exam_actions_session_id ON exam_actions(session_id);
CREATE INDEX idx_session_checklist_scores_session_id ON session_checklist_scores(session_id);
CREATE INDEX idx_session_checklist_scores_checklist_id ON session_checklist_scores(checklist_id);
CREATE INDEX idx_reviewer_comments_session_id ON reviewer_comments(session_id);
CREATE INDEX idx_bias_fairness_analysis_session_id ON bias_fairness_analysis(session_id);
CREATE INDEX idx_session_bias_mitigation_session_id ON session_bias_mitigation(session_id);
CREATE INDEX idx_session_bias_mitigation_strategy_id ON session_bias_mitigation(strategy_id);