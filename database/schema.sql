-- OSCE Feedback System Database Schema
CREATE DATABASE IF NOT EXISTS osce_feedback;
USE osce_feedback;

-- Users table for authentication
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('teacher', 'student') NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sessions table for tracking OSCE sessions
CREATE TABLE sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT NOT NULL,
    student_id INT NOT NULL,
    unique_id VARCHAR(50) UNIQUE NOT NULL,
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    status ENUM('uploaded', 'processing', 'completed', 'failed') DEFAULT 'uploaded',
    pdf_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id),
    FOREIGN KEY (student_id) REFERENCES users(id)
);

-- Insert sample users
INSERT INTO users (email, password_hash, role, name) VALUES
('teacher@rutgers.edu', '$2b$10$rQZ8K9mN2pL3qR4sT5uV6w', 'teacher', 'Dr. Michael Chen'),
('student@rutgers.edu', '$2b$10$rQZ8K9mN2pL3qR4sT5uV6w', 'student', 'Sarah Johnson'),
('admin@admin.com', '$2b$10$rQZ8K9mN2pL3qR4sT5uV6w', 'teacher', 'Admin User');

-- Insert sample session
INSERT INTO sessions (teacher_id, student_id, unique_id, file_name, status) VALUES
(1, 2, 'OSCE-2024-001', 'sample_recording.mp4', 'completed');
