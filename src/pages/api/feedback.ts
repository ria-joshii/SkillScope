import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/database';

// Feedback API endpoints
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;

  try {
    switch (method) {
      case 'GET':
        if (query.action === 'feedback' && query.session_id) {
          // Get detailed feedback for a session
          const feedbackResult = await pool.query(`
            SELECT f.*, os.session_date, s.full_name as student_name
            FROM feedback f
            JOIN osce_sessions os ON f.session_id = os.session_id
            JOIN students s ON os.student_id = s.student_id
            WHERE f.session_id = $1
          `, [query.session_id]);

          if (feedbackResult.rows.length === 0) {
            return res.status(404).json({ error: 'Feedback not found' });
          }

          // Get checklist scores with details
          const checklistResult = await pool.query(`
            SELECT 
              scs.*,
              ci.category,
              ci.description,
              ci.expected_behavior,
              ci.weight
            FROM session_checklist_scores scs
            JOIN checklist_items ci ON scs.checklist_id = ci.checklist_id
            WHERE scs.session_id = $1
            ORDER BY ci.category, ci.checklist_id
          `, [query.session_id]);

          // Get transcript segments
          const segmentsResult = await pool.query(`
            SELECT * FROM transcript_segments 
            WHERE session_id = $1 
            ORDER BY start_time ASC
          `, [query.session_id]);

          // Get bias analysis
          const biasResult = await pool.query(`
            SELECT * FROM bias_fairness_analysis 
            WHERE session_id = $1
          `, [query.session_id]);

          res.status(200).json({
            feedback: feedbackResult.rows[0],
            checklist: checklistResult.rows,
            segments: segmentsResult.rows,
            biasAnalysis: biasResult.rows[0] || null
          });
        }
        break;

      case 'POST':
        if (query.action === 'feedback') {
          // Create new feedback
          const { 
            session_id, 
            feedback_summary, 
            clarity_rating, 
            empathy_rating, 
            clinical_accuracy_rating,
            strengths,
            areas_for_improvement,
            reference_segments
          } = req.body;

          const result = await pool.query(`
            INSERT INTO feedback (
              session_id, feedback_summary, clarity_rating, empathy_rating, 
              clinical_accuracy_rating, strengths, areas_for_improvement, reference_segments
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING *
          `, [
            session_id, feedback_summary, clarity_rating, empathy_rating,
            clinical_accuracy_rating, strengths, areas_for_improvement, reference_segments
          ]);

          res.status(201).json(result.rows[0]);
        }
        break;

      case 'PUT':
        if (query.action === 'review' && query.score_id) {
          // Mark checklist item as reviewed by human
          const { reviewed_by_human, achieved } = req.body;
          const result = await pool.query(`
            UPDATE session_checklist_scores 
            SET reviewed_by_human = $1, achieved = $2 
            WHERE score_id = $3 
            RETURNING *
          `, [reviewed_by_human, achieved, query.score_id]);

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
