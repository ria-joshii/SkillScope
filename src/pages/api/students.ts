import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/database';

// Student API endpoints
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;

  try {
    switch (method) {
      case 'GET':
        if (query.action === 'students') {
          // Get all students
          const result = await pool.query(`
            SELECT s.*, 
                   COUNT(os.session_id) as total_sessions,
                   AVG(CASE WHEN f.clarity_rating IS NOT NULL THEN f.clarity_rating END) as avg_clarity,
                   AVG(CASE WHEN f.empathy_rating IS NOT NULL THEN f.empathy_rating END) as avg_empathy,
                   AVG(CASE WHEN f.clinical_accuracy_rating IS NOT NULL THEN f.clinical_accuracy_rating END) as avg_clinical
            FROM students s
            LEFT JOIN osce_sessions os ON s.student_id = os.student_id
            LEFT JOIN feedback f ON os.session_id = f.session_id
            GROUP BY s.student_id
            ORDER BY s.created_at DESC
          `);
          res.status(200).json(result.rows);
        } else if (query.action === 'student' && query.id) {
          // Get specific student with their sessions
          const studentResult = await pool.query(
            'SELECT * FROM students WHERE student_id = $1',
            [query.id]
          );
          
          if (studentResult.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
          }

          const sessionsResult = await pool.query(`
            SELECT os.*, f.feedback_summary, f.clarity_rating, f.empathy_rating, f.clinical_accuracy_rating
            FROM osce_sessions os
            LEFT JOIN feedback f ON os.session_id = f.session_id
            WHERE os.student_id = $1
            ORDER BY os.session_date DESC
          `, [query.id]);

          res.status(200).json({
            student: studentResult.rows[0],
            sessions: sessionsResult.rows
          });
        }
        break;

      case 'POST':
        if (query.action === 'students') {
          // Create new student
          const { full_name, email, institution } = req.body;
          const result = await pool.query(
            'INSERT INTO students (full_name, email, institution) VALUES ($1, $2, $3) RETURNING *',
            [full_name, email, institution]
          );
          res.status(201).json(result.rows[0]);
        }
        break;

      case 'PUT':
        if (query.action === 'student' && query.id) {
          // Update student
          const { full_name, email, institution } = req.body;
          const result = await pool.query(
            'UPDATE students SET full_name = $1, email = $2, institution = $3 WHERE student_id = $4 RETURNING *',
            [full_name, email, institution, query.id]
          );
          res.status(200).json(result.rows[0]);
        }
        break;

      case 'DELETE':
        if (query.action === 'student' && query.id) {
          // Delete student
          await pool.query('DELETE FROM students WHERE student_id = $1', [query.id]);
          res.status(200).json({ message: 'Student deleted successfully' });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
