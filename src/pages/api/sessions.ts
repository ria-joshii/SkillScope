import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/database';

// OSCE Sessions API endpoints
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;

  try {
    switch (method) {
      case 'GET':
        if (query.action === 'sessions') {
          // Get all sessions with student info
          const result = await pool.query(`
            SELECT os.*, s.full_name as student_name, s.email as student_email,
                   f.feedback_summary, f.clarity_rating, f.empathy_rating, f.clinical_accuracy_rating,
                   COUNT(scs.score_id) as total_checklist_items,
                   COUNT(CASE WHEN scs.achieved = true THEN 1 END) as achieved_items
            FROM osce_sessions os
            JOIN students s ON os.student_id = s.student_id
            LEFT JOIN feedback f ON os.session_id = f.session_id
            LEFT JOIN session_checklist_scores scs ON os.session_id = scs.session_id
            GROUP BY os.session_id, s.student_id, f.feedback_id
            ORDER BY os.session_date DESC
          `);
          res.status(200).json(result.rows);
        } else if (query.action === 'session' && query.id) {
          // Get specific session with detailed data
          const sessionResult = await pool.query(`
            SELECT os.*, s.full_name as student_name, s.email as student_email
            FROM osce_sessions os
            JOIN students s ON os.student_id = s.student_id
            WHERE os.session_id = $1
          `, [query.id]);

          if (sessionResult.rows.length === 0) {
            return res.status(404).json({ error: 'Session not found' });
          }

          // Get transcript segments
          const segmentsResult = await pool.query(`
            SELECT * FROM transcript_segments 
            WHERE session_id = $1 
            ORDER BY start_time ASC
          `, [query.id]);

          // Get checklist scores
          const checklistResult = await pool.query(`
            SELECT scs.*, ci.category, ci.description, ci.expected_behavior
            FROM session_checklist_scores scs
            JOIN checklist_items ci ON scs.checklist_id = ci.checklist_id
            WHERE scs.session_id = $1
            ORDER BY ci.category, ci.checklist_id
          `, [query.id]);

          // Get feedback
          const feedbackResult = await pool.query(`
            SELECT * FROM feedback WHERE session_id = $1
          `, [query.id]);

          // Get bias analysis
          const biasResult = await pool.query(`
            SELECT * FROM bias_fairness_analysis WHERE session_id = $1
          `, [query.id]);

          res.status(200).json({
            session: sessionResult.rows[0],
            segments: segmentsResult.rows,
            checklist: checklistResult.rows,
            feedback: feedbackResult.rows[0] || null,
            biasAnalysis: biasResult.rows[0] || null
          });
        }
        break;

      case 'POST':
        if (query.action === 'sessions') {
          // Create new session
          const { student_id, session_date, video_url, transcript } = req.body;
          const result = await pool.query(
            'INSERT INTO osce_sessions (student_id, session_date, video_url, transcript, processing_status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [student_id, session_date, video_url, transcript, 'pending']
          );
          res.status(201).json(result.rows[0]);
        }
        break;

      case 'PUT':
        if (query.action === 'session' && query.id) {
          // Update session
          const { processing_status, transcript } = req.body;
          const result = await pool.query(
            'UPDATE osce_sessions SET processing_status = $1, transcript = $2 WHERE session_id = $3 RETURNING *',
            [processing_status, transcript, query.id]
          );
          res.status(200).json(result.rows[0]);
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
