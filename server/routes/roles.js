import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

/**
 * Get all roles
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name
      FROM roles
      ORDER BY id;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

export default router;