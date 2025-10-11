-- Sample data for NLP-Powered OSCE Feedback System
-- Enhanced with realistic bias detection and fairness analysis

-- Insert sample students
INSERT INTO students (full_name, email, institution) VALUES
('Sarah Johnson', 'sarah.johnson@medschool.edu', 'Rutgers Medical School'),
('Michael Chen', 'michael.chen@medschool.edu', 'Rutgers Medical School'),
('Maria Rodriguez', 'maria.rodriguez@medschool.edu', 'Rutgers Medical School'),
('David Kim', 'david.kim@medschool.edu', 'Rutgers Medical School'),
('Jennifer Williams', 'jennifer.williams@medschool.edu', 'Rutgers Medical School'),
('Ahmed Hassan', 'ahmed.hassan@medschool.edu', 'Rutgers Medical School'),
('Priya Patel', 'priya.patel@medschool.edu', 'Rutgers Medical School');

-- Insert sample OSCE sessions
INSERT INTO osce_sessions (student_id, session_date, video_url, transcript, processing_status, lms_link) VALUES
(1, '2024-01-15', 'https://storage.example.com/sessions/session_001.mp4', 'Student: Hello, I''m Dr. Johnson. How are you feeling today? Patient: I''ve been having chest pain for the past two days...', 'complete', 'https://lms.example.com/sessions/001'),
(2, '2024-01-16', 'https://storage.example.com/sessions/session_002.mp4', 'Student: Good morning, I''m Dr. Chen. What brings you in today? Patient: My child has been running a fever...', 'complete', 'https://lms.example.com/sessions/002'),
(3, '2024-01-17', 'https://storage.example.com/sessions/session_003.mp4', 'Student: Hola, soy la Dra. Rodriguez. ¿Cómo se siente hoy? Patient: I''ve been feeling anxious and depressed...', 'complete', 'https://lms.example.com/sessions/003'),
(4, '2024-01-18', 'https://storage.example.com/sessions/session_004.mp4', 'Student: Hello, I''m Dr. Kim. Can you tell me about your symptoms? Patient: I have this pain in my abdomen...', 'complete', 'https://lms.example.com/sessions/004'),
(5, '2024-01-19', 'https://storage.example.com/sessions/session_005.mp4', 'Student: Good afternoon, I''m Dr. Williams. What seems to be the problem? Patient: I''ve been having trouble breathing...', 'complete', 'https://lms.example.com/sessions/005'),
(6, '2024-01-20', 'https://storage.example.com/sessions/session_006.mp4', 'Student: As-salamu alaykum, I''m Dr. Hassan. How can I help you today? Patient: I''ve been having headaches...', 'complete', 'https://lms.example.com/sessions/006'),
(7, '2024-01-21', 'https://storage.example.com/sessions/session_007.mp4', 'Student: Namaste, I''m Dr. Patel. What brings you here today? Patient: I''ve been feeling dizzy...', 'complete', 'https://lms.example.com/sessions/007');

-- Insert sample transcript segments with NLP analysis
INSERT INTO transcript_segments (session_id, start_time, end_time, speaker, content, detected_intent, sentiment_label) VALUES
-- Session 1 (Sarah Johnson - Chest Pain)
(1, 0.0, 3.2, 'student', 'Hello, I''m Dr. Johnson. How are you feeling today?', 'greet_patient', 'positive'),
(1, 3.2, 8.5, 'patient', 'I''ve been having chest pain for the past two days. It started suddenly while I was at work.', 'describe_symptom', 'neutral'),
(1, 8.5, 12.1, 'student', 'I''m sorry to hear that. Can you describe the pain for me? Is it sharp, dull, or burning?', 'ask_symptom_details', 'positive'),
(1, 12.1, 18.3, 'patient', 'It''s a sharp, stabbing pain that comes and goes. Sometimes it feels like pressure on my chest.', 'describe_symptom', 'neutral'),
(1, 18.3, 22.7, 'student', 'Have you experienced any shortness of breath or nausea with the pain?', 'ask_associated_symptoms', 'neutral'),
(1, 22.7, 26.9, 'patient', 'Yes, I felt a bit short of breath yesterday, but no nausea.', 'describe_symptom', 'neutral'),
(1, 26.9, 31.4, 'student', 'Do you have any history of heart problems or high blood pressure?', 'ask_medical_history', 'neutral'),
(1, 31.4, 35.8, 'patient', 'No, I''ve always been healthy. My father had a heart attack though.', 'provide_family_history', 'neutral'),

-- Session 2 (Michael Chen - Pediatric Fever)
(2, 0.0, 2.8, 'student', 'Good morning, I''m Dr. Chen. What brings you in today?', 'greet_patient', 'positive'),
(2, 2.8, 7.2, 'patient', 'My 3-year-old daughter has been running a fever for two days. She''s been very fussy.', 'describe_symptom', 'negative'),
(2, 7.2, 11.5, 'student', 'I understand your concern. How high has her fever been?', 'ask_symptom_details', 'positive'),
(2, 11.5, 15.8, 'patient', 'It''s been around 101-102 degrees Fahrenheit. She won''t eat much either.', 'describe_symptom', 'negative'),
(2, 15.8, 20.1, 'student', 'Has she been drinking fluids? Any other symptoms like cough or runny nose?', 'ask_associated_symptoms', 'neutral'),
(2, 20.1, 24.3, 'patient', 'She''s drinking some water but not much. She has a slight cough.', 'describe_symptom', 'neutral'),
(2, 24.3, 28.7, 'student', 'Let me examine her. I''ll check her temperature and listen to her chest.', 'perform_examination', 'positive'),

-- Session 3 (Maria Rodriguez - Mental Health, Bilingual)
(3, 0.0, 3.5, 'student', 'Hola, soy la Dra. Rodriguez. ¿Cómo se siente hoy?', 'greet_patient', 'positive'),
(3, 3.5, 8.2, 'patient', 'I''ve been feeling anxious and depressed for several weeks now.', 'describe_symptom', 'negative'),
(3, 8.2, 12.8, 'student', 'I''m sorry you''re going through this. Can you tell me more about these feelings?', 'ask_symptom_details', 'positive'),
(3, 12.8, 18.5, 'patient', 'I can''t sleep well, I''ve lost my appetite, and I feel hopeless most days.', 'describe_symptom', 'negative'),
(3, 18.5, 23.1, 'student', 'Have you had thoughts of hurting yourself or others?', 'ask_safety_assessment', 'neutral'),
(3, 23.1, 26.8, 'patient', 'No, I would never hurt myself, but I feel like giving up sometimes.', 'describe_symptom', 'negative'),
(3, 26.8, 31.2, 'student', 'I''m glad you''re here talking about this. Let''s work together to help you feel better.', 'provide_support', 'positive');

-- Insert sample exam actions
INSERT INTO exam_actions (session_id, action_type, body_part, timestamp, notes) VALUES
(1, 'inspection', 'chest', 35.0, 'Visual inspection of chest for signs of distress'),
(1, 'palpation', 'chest', 38.5, 'Palpation of chest wall for tenderness'),
(1, 'auscultation', 'chest', 42.0, 'Heart sounds and lung sounds assessment'),
(2, 'inspection', 'general', 30.0, 'General appearance and behavior observation'),
(2, 'palpation', 'abdomen', 35.0, 'Abdominal palpation for tenderness'),
(2, 'auscultation', 'chest', 40.0, 'Lung sounds assessment'),
(3, 'inspection', 'general', 32.0, 'Mental status and appearance assessment'),
(3, 'palpation', 'general', 35.0, 'General physical examination'),
(4, 'inspection', 'abdomen', 30.0, 'Abdominal inspection for distension'),
(4, 'palpation', 'abdomen', 35.0, 'Abdominal palpation for masses'),
(5, 'inspection', 'chest', 30.0, 'Chest inspection for respiratory distress'),
(5, 'auscultation', 'chest', 35.0, 'Lung sounds assessment'),
(6, 'inspection', 'head', 30.0, 'Head and neck examination'),
(6, 'palpation', 'head', 35.0, 'Head palpation for tenderness'),
(7, 'inspection', 'general', 30.0, 'General appearance and balance assessment'),
(7, 'palpation', 'general', 35.0, 'General physical examination');

-- Insert sample checklist items
INSERT INTO checklist_items (category, description, expected_behavior, weight) VALUES
-- Clinical Content
('clinical_content', 'Obtains chief complaint', 'Asks patient about main reason for visit', 1.0),
('clinical_content', 'Takes detailed history of present illness', 'Asks about onset, duration, quality, and severity of symptoms', 1.5),
('clinical_content', 'Reviews systems', 'Asks about related symptoms in other body systems', 1.0),
('clinical_content', 'Obtains past medical history', 'Asks about previous illnesses, surgeries, medications', 1.0),
('clinical_content', 'Obtains family history', 'Asks about family history of relevant conditions', 0.5),
('clinical_content', 'Performs appropriate physical examination', 'Conducts relevant physical examination based on symptoms', 2.0),

-- Communication Skills
('communication', 'Introduces self appropriately', 'Clearly states name and role as medical student/doctor', 1.0),
('communication', 'Uses open-ended questions', 'Asks questions that allow patient to provide detailed responses', 1.5),
('communication', 'Demonstrates active listening', 'Shows understanding through verbal and non-verbal cues', 1.5),
('communication', 'Uses appropriate medical terminology', 'Explains medical terms in patient-friendly language', 1.0),
('communication', 'Shows empathy and compassion', 'Demonstrates understanding of patient''s concerns', 2.0),

-- Professionalism
('professionalism', 'Maintains professional demeanor', 'Shows respect and maintains appropriate boundaries', 1.0),
('professionalism', 'Maintains patient confidentiality', 'Ensures privacy and confidentiality during examination', 1.0),
('professionalism', 'Obtains informed consent', 'Explains procedures and obtains consent before examination', 1.5),
('professionalism', 'Shows cultural sensitivity', 'Demonstrates awareness of cultural differences and adapts approach', 1.5);

-- Insert sample checklist scores
INSERT INTO session_checklist_scores (session_id, checklist_id, achieved, reviewer_comments, reviewed_by_human) VALUES
-- Session 1 scores
(1, 1, true, 'Excellent introduction and chief complaint obtained', true),
(1, 2, true, 'Comprehensive history of chest pain with good detail', true),
(1, 3, true, 'Asked about associated symptoms appropriately', true),
(1, 4, true, 'Obtained relevant past medical history', true),
(1, 5, true, 'Family history of heart disease noted', true),
(1, 6, true, 'Appropriate cardiac examination performed', true),
(1, 7, true, 'Professional introduction', true),
(1, 8, true, 'Good use of open-ended questions', true),
(1, 9, true, 'Demonstrated active listening', true),
(1, 10, true, 'Explained medical terms clearly', true),
(1, 11, true, 'Showed empathy for patient''s concerns', true),
(1, 12, true, 'Maintained professional demeanor throughout', true),
(1, 13, true, 'Ensured privacy during examination', true),
(1, 14, true, 'Obtained consent before examination', true),
(1, 15, true, 'Demonstrated cultural sensitivity', true),

-- Session 2 scores
(2, 1, true, 'Good introduction and chief complaint', true),
(2, 2, true, 'Detailed history of fever and associated symptoms', true),
(2, 3, true, 'Asked about appetite and fluid intake', true),
(2, 4, true, 'Obtained vaccination history', true),
(2, 5, true, 'Family history obtained', true),
(2, 6, true, 'Appropriate pediatric examination', true),
(2, 7, true, 'Professional introduction', true),
(2, 8, true, 'Good use of open-ended questions', true),
(2, 9, true, 'Showed understanding of parent concerns', true),
(2, 10, true, 'Used age-appropriate language', true),
(2, 11, true, 'Demonstrated empathy for worried parent', true),
(2, 12, true, 'Maintained professional demeanor', true),
(2, 13, true, 'Ensured privacy', true),
(2, 14, true, 'Obtained consent from parent', true),
(2, 15, true, 'Showed cultural sensitivity', true);

-- Insert sample reviewer comments
INSERT INTO reviewer_comments (session_id, reviewer_name, comment, segment_reference, is_flagged) VALUES
(1, 'Dr. Smith', 'Excellent communication skills demonstrated throughout the session', 1, false),
(1, 'Dr. Smith', 'Good use of open-ended questions to explore chest pain', 3, false),
(1, 'Dr. Smith', 'Appropriate empathy shown when patient mentioned family history', 8, false),
(2, 'Dr. Johnson', 'Very good handling of worried parent', 2, false),
(2, 'Dr. Johnson', 'Appropriate pediatric examination techniques', 7, false),
(3, 'Dr. Garcia', 'Excellent bilingual communication skills', 1, false),
(3, 'Dr. Garcia', 'Good cultural sensitivity demonstrated', 3, false),
(3, 'Dr. Garcia', 'Appropriate safety assessment for mental health concerns', 5, false);

-- Insert sample bias fairness analysis
INSERT INTO bias_fairness_analysis (session_id, bias_severity, speech_rate_score, accent_cluster, audio_quality_score, gender_bias_score, age_bias_score, regional_bias_score, language_bias_score, cultural_competency_score, overall_fairness_score, fairness_confidence, analysis_model_version) VALUES
(1, 0.05, 0.52, 'northeast_standard', 0.85, 0.02, 0.01, 0.03, 0.01, 0.94, 0.94, 0.89, 'bias_detection_v2.1'),
(2, 0.08, 0.48, 'northeast_standard', 0.82, 0.03, 0.02, 0.04, 0.02, 0.91, 0.91, 0.87, 'bias_detection_v2.1'),
(3, 0.12, 0.45, 'northeast_standard', 0.78, 0.05, 0.01, 0.06, 0.08, 0.88, 0.88, 0.85, 'bias_detection_v2.1'),
(4, 0.06, 0.51, 'northeast_standard', 0.83, 0.02, 0.01, 0.03, 0.01, 0.93, 0.93, 0.88, 'bias_detection_v2.1'),
(5, 0.07, 0.49, 'northeast_standard', 0.81, 0.03, 0.02, 0.04, 0.02, 0.90, 0.90, 0.86, 'bias_detection_v2.1'),
(6, 0.15, 0.42, 'northeast_standard', 0.75, 0.08, 0.01, 0.09, 0.12, 0.85, 0.85, 0.82, 'bias_detection_v2.1'),
(7, 0.11, 0.46, 'northeast_standard', 0.79, 0.04, 0.01, 0.07, 0.09, 0.89, 0.89, 0.84, 'bias_detection_v2.1');

-- Insert sample bias mitigation strategies
INSERT INTO bias_mitigation_strategies (strategy_name, strategy_type, description, parameters, effectiveness_score, is_active) VALUES
('Speech Rate Normalization', 'speech_normalization', 'Normalizes speech rate variations to reduce bias', '{"target_rate": 0.5, "tolerance": 0.1}', 0.85, true),
('Accent-Agnostic Processing', 'accent_agnostic', 'Processes speech independent of accent characteristics', '{"accent_clusters": ["northeast", "southern", "western"], "neutralization_factor": 0.8}', 0.78, true),
('Audio Quality Compensation', 'quality_compensation', 'Compensates for audio quality variations in scoring', '{"quality_threshold": 0.7, "compensation_factor": 0.9}', 0.82, true),
('Cultural Sensitivity Adjustment', 'cultural_adjustment', 'Adjusts scoring based on cultural competency indicators', '{"competency_threshold": 0.8, "adjustment_factor": 1.1}', 0.88, true),
('Language Proficiency Normalization', 'language_normalization', 'Normalizes scoring for non-native English speakers', '{"proficiency_threshold": 0.6, "normalization_factor": 0.95}', 0.75, true);

-- Insert sample session bias mitigation
INSERT INTO session_bias_mitigation (session_id, strategy_id, effectiveness_score, notes) VALUES
(1, 1, 0.88, 'Speech rate normalization applied successfully'),
(1, 2, 0.82, 'Accent-agnostic processing reduced regional bias'),
(1, 3, 0.85, 'Audio quality compensation applied'),
(1, 4, 0.91, 'Cultural sensitivity adjustment enhanced fairness'),
(2, 1, 0.85, 'Speech rate normalization effective'),
(2, 2, 0.79, 'Accent-agnostic processing applied'),
(2, 3, 0.83, 'Audio quality compensation successful'),
(2, 4, 0.89, 'Cultural sensitivity maintained'),
(3, 1, 0.82, 'Speech rate normalization applied'),
(3, 2, 0.76, 'Accent-agnostic processing used'),
(3, 3, 0.78, 'Audio quality compensation applied'),
(3, 4, 0.87, 'Cultural sensitivity adjustment for bilingual communication'),
(3, 5, 0.73, 'Language proficiency normalization applied'),
(4, 1, 0.87, 'Speech rate normalization effective'),
(4, 2, 0.81, 'Accent-agnostic processing applied'),
(4, 3, 0.84, 'Audio quality compensation successful'),
(4, 4, 0.92, 'Cultural sensitivity maintained'),
(5, 1, 0.84, 'Speech rate normalization applied'),
(5, 2, 0.78, 'Accent-agnostic processing used'),
(5, 3, 0.82, 'Audio quality compensation applied'),
(5, 4, 0.88, 'Cultural sensitivity maintained'),
(6, 1, 0.79, 'Speech rate normalization applied'),
(6, 2, 0.74, 'Accent-agnostic processing used'),
(6, 3, 0.76, 'Audio quality compensation applied'),
(6, 4, 0.84, 'Cultural sensitivity adjustment applied'),
(6, 5, 0.71, 'Language proficiency normalization applied'),
(7, 1, 0.81, 'Speech rate normalization applied'),
(7, 2, 0.75, 'Accent-agnostic processing used'),
(7, 3, 0.79, 'Audio quality compensation applied'),
(7, 4, 0.86, 'Cultural sensitivity adjustment applied'),
(7, 5, 0.72, 'Language proficiency normalization applied');

-- Insert sample model versions
INSERT INTO model_versions (model_name, model_type, version, description, is_active) VALUES
('NLP Intent Detection', 'NLP', 'v1.3', 'Rule-based intent detection for medical conversations', true),
('Sentiment Analysis', 'NLP', 'v2.0', 'Keyword-based sentiment analysis for patient interactions', true),
('Bias Detection Engine', 'Bias_Detection', 'v2.1', 'Comprehensive bias detection across multiple dimensions', true),
('Fairness Analysis Model', 'Fairness_Analysis', 'v1.8', 'Statistical fairness analysis and compliance reporting', true),
('Cultural Competency Assessor', 'Fairness_Analysis', 'v1.2', 'Cultural sensitivity and competency assessment', true);