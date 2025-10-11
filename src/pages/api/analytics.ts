import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/database';

// Enhanced Analytics API endpoints with focus on bias detection
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;

  try {
    switch (method) {
      case 'GET':
        if (query.action === 'overview') {
          // Get system overview statistics
          const [
            studentsResult,
            sessionsResult,
            avgScoresResult,
            completionRateResult,
            biasFlagsResult,
            pendingReviewsResult
          ] = await Promise.all([
            pool.query('SELECT COUNT(*) as total FROM students'),
            pool.query('SELECT COUNT(*) as total FROM osce_sessions'),
            pool.query(`
              SELECT AVG((clarity_rating + empathy_rating + clinical_accuracy_rating) / 3.0) as avg_score
              FROM feedback WHERE clarity_rating IS NOT NULL
            `),
            pool.query(`
              SELECT 
                COUNT(CASE WHEN processing_status = 'complete' THEN 1 END) as completed,
                COUNT(*) as total
              FROM osce_sessions
            `),
            pool.query('SELECT COUNT(*) as total FROM bias_fairness_analysis WHERE bias_detected = true'),
            pool.query(`
              SELECT COUNT(*) as total 
              FROM session_checklist_scores 
              WHERE ai_flagged = true AND reviewed_by_human = false
            `)
          ]);

          res.status(200).json({
            totalStudents: parseInt(studentsResult.rows[0].total),
            totalSessions: parseInt(sessionsResult.rows[0].total),
            averageScore: parseFloat(avgScoresResult.rows[0].avg_score || 0),
            completionRate: parseFloat(completionRateResult.rows[0].completed) / parseFloat(completionRateResult.rows[0].total) * 100,
            biasFlags: parseInt(biasFlagsResult.rows[0].total),
            pendingReviews: parseInt(pendingReviewsResult.rows[0].total)
          });
        } else if (query.action === 'performance') {
          // Get performance breakdown by category
          const result = await pool.query(`
            SELECT 
              'Communication' as category,
              AVG(clarity_rating) as score,
              COUNT(*) as sessions
            FROM feedback WHERE clarity_rating IS NOT NULL
            UNION ALL
            SELECT 
              'Clinical Skills' as category,
              AVG(clinical_accuracy_rating) as score,
              COUNT(*) as sessions
            FROM feedback WHERE clinical_accuracy_rating IS NOT NULL
            UNION ALL
            SELECT 
              'Empathy' as category,
              AVG(empathy_rating) as score,
              COUNT(*) as sessions
            FROM feedback WHERE empathy_rating IS NOT NULL
            UNION ALL
            SELECT 
              'Professionalism' as category,
              AVG((clarity_rating + empathy_rating + clinical_accuracy_rating) / 3.0) as score,
              COUNT(*) as sessions
            FROM feedback WHERE clarity_rating IS NOT NULL
          `);
          res.status(200).json(result.rows);
        } else if (query.action === 'bias-analysis') {
          // Enhanced bias analysis data
          const result = await pool.query(`
            SELECT 
              bias_type,
              COUNT(*) as count,
              AVG(bias_severity) as avg_severity,
              AVG(overall_fairness_score) as avg_fairness,
              AVG(speech_rate_score) as avg_speech_rate,
              AVG(audio_quality_score) as avg_audio_quality,
              AVG(gender_bias_score) as avg_gender_bias,
              AVG(regional_bias_score) as avg_regional_bias
            FROM bias_fairness_analysis 
            WHERE bias_type IS NOT NULL
            GROUP BY bias_type
            ORDER BY count DESC
          `);
          res.status(200).json(result.rows);
        } else if (query.action === 'bias-trends') {
          // Get bias trends over time
          const result = await pool.query(`
            SELECT 
              DATE_TRUNC('week', os.session_date) as week,
              COUNT(CASE WHEN bfa.bias_detected = true THEN 1 END) as bias_count,
              COUNT(*) as total_sessions,
              AVG(bfa.overall_fairness_score) as avg_fairness,
              AVG(bfa.bias_severity) as avg_severity
            FROM osce_sessions os
            LEFT JOIN bias_fairness_analysis bfa ON os.session_id = bfa.session_id
            WHERE os.session_date >= CURRENT_DATE - INTERVAL '12 weeks'
            GROUP BY week
            ORDER BY week ASC
          `);
          res.status(200).json(result.rows);
        } else if (query.action === 'mitigation-effectiveness') {
          // Get bias mitigation strategy effectiveness
          const result = await pool.query(`
            SELECT 
              bms.strategy_name,
              bms.strategy_type,
              bms.effectiveness_score as theoretical_effectiveness,
              AVG(sbm.effectiveness_measured) as measured_effectiveness,
              COUNT(sbm.mitigation_id) as applications,
              bms.description
            FROM bias_mitigation_strategies bms
            LEFT JOIN session_bias_mitigation sbm ON bms.strategy_id = sbm.strategy_id
            WHERE bms.is_active = true
            GROUP BY bms.strategy_id, bms.strategy_name, bms.strategy_type, bms.effectiveness_score, bms.description
            ORDER BY measured_effectiveness DESC NULLS LAST
          `);
          res.status(200).json(result.rows);
        } else if (query.action === 'review-queue') {
          // Enhanced review queue with bias information
          const result = await pool.query(`
            SELECT 
              os.session_id,
              s.full_name as student_name,
              os.session_date,
              os.processing_status,
              AVG(scs.confidence_score) as avg_confidence,
              bfa.bias_type,
              bfa.bias_detected,
              bfa.bias_severity,
              bfa.overall_fairness_score,
              bfa.accent_cluster,
              bfa.audio_quality_score
            FROM osce_sessions os
            JOIN students s ON os.student_id = s.student_id
            LEFT JOIN session_checklist_scores scs ON os.session_id = scs.session_id
            LEFT JOIN bias_fairness_analysis bfa ON os.session_id = bfa.session_id
            WHERE (scs.confidence_score < 0.5 OR bfa.bias_detected = true OR bfa.overall_fairness_score < 0.8)
            AND scs.ai_flagged = true AND scs.reviewed_by_human = false
            GROUP BY os.session_id, s.student_id, bfa.analysis_id
            ORDER BY 
              CASE WHEN bfa.bias_detected = true THEN bfa.bias_severity ELSE 0 END DESC,
              os.session_date DESC
            LIMIT 20
          `);
          res.status(200).json(result.rows);
        } else if (query.action === 'fairness-metrics') {
          // Comprehensive fairness metrics
          const result = await pool.query(`
            SELECT 
              'Overall Fairness' as metric,
              AVG(overall_fairness_score) as avg_score,
              MIN(overall_fairness_score) as min_score,
              MAX(overall_fairness_score) as max_score,
              STDDEV(overall_fairness_score) as std_dev
            FROM bias_fairness_analysis
            UNION ALL
            SELECT 
              'Speech Rate Bias' as metric,
              AVG(speech_rate_score) as avg_score,
              MIN(speech_rate_score) as min_score,
              MAX(speech_rate_score) as max_score,
              STDDEV(speech_rate_score) as std_dev
            FROM bias_fairness_analysis
            UNION ALL
            SELECT 
              'Audio Quality' as metric,
              AVG(audio_quality_score) as avg_score,
              MIN(audio_quality_score) as min_score,
              MAX(audio_quality_score) as max_score,
              STDDEV(audio_quality_score) as std_dev
            FROM bias_fairness_analysis
            UNION ALL
            SELECT 
              'Gender Bias' as metric,
              AVG(gender_bias_score) as avg_score,
              MIN(gender_bias_score) as min_score,
              MAX(gender_bias_score) as max_score,
              STDDEV(gender_bias_score) as std_dev
            FROM bias_fairness_analysis
            UNION ALL
            SELECT 
              'Regional Bias' as metric,
              AVG(regional_bias_score) as avg_score,
              MIN(regional_bias_score) as min_score,
              MAX(regional_bias_score) as max_score,
              STDDEV(regional_bias_score) as std_dev
            FROM bias_fairness_analysis
          `);
          res.status(200).json(result.rows);
        }
        break;

      default:
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}