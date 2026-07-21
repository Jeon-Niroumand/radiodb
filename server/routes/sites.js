import express from 'express';
import pool from '../db/pool.js';
import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();

// Get all sites
router.get('/', authenticate, authorize("Administrator", "Technician", "Viewer"),
  async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sites ORDER BY index');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching sites');
  }
});

// Add a new site
router.post('/', authenticate, authorize("Administrator"),
  async (req, res) => {
  const { index, name, type, frequency, repeater_rx, repeater_tx, plcode } = req.body;
  try {
    // Check if index already exists
    const existing = await pool.query(
      'SELECT * FROM sites WHERE "index" = $1',
      [index]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Site index already exists' });
    }

    const result = await pool.query(
      'INSERT INTO sites ("index", name, type, frequency, repeater_rx, repeater_tx, plcode ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [index, name, type, frequency, repeater_rx, repeater_tx, plcode ]
    );

    res.status(201).json(result.rows[0]);
    
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding site');
  }
});

// Get a site by index
router.get('/:index', authenticate, authorize("Administrator", "Technician", "Viewer"),
  async (req, res) => {
  const { index } = req.params;

  console.log('Looking up site index:', index);

  const result = await pool.query('SELECT * FROM sites WHERE "index" = $1', [index]);

  console.log(result.rows);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Site not found' });
  }

  res.json(result.rows[0]);
});

// Update a site
router.put('/:index', authenticate, authorize("Administrator", "Technician"),
  async (req, res) => {
  
  const index = Number(req.params.index);

  const {
    index: newIndex,
    name,
    type,
    frequency,
    repeater_rx,
    repeater_tx,
    plcode
  } = req.body;

  const routeIndex = Number(req.params.index);
  const submittedIndex = Number(req.body.index);

  if (submittedIndex !== routeIndex) {
    return res.status(400).json({ error: 'Index cannot be updated' });
  }

  try {
    const result = await pool.query(
      `UPDATE sites
       SET name = $1,
           type = $2,
           frequency = $3,
           repeater_rx = $4,
           repeater_tx = $5,
           plcode = $6
       WHERE index = $7
       RETURNING *`,
      [name, type, frequency, repeater_rx, repeater_tx, plcode, index]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Site not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating site' });
  }
});

// Delete a site
router.delete('/:index', authenticate, authorize("Administrator"),
  async (req, res) => {
  const { index } = req.params;

  try {
    // Check whether any radios still reference this site
    const radioCheck = await pool.query(
      'SELECT COUNT(*) FROM radios WHERE site_index = $1',
      [index]
    );

    const radioCount = Number(radioCheck.rows[0].count);

    if (radioCount > 0) {
      return res.status(409).json({
        error: 'Cannot delete site because radios are still assigned to it.'
      });
    }

    const result = await pool.query(
      'DELETE FROM sites WHERE index = $1 RETURNING *',
      [index]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Site not found' });
    }

    res.json({ message: 'Site deleted successfully' });
  } catch (err) {
    console.error('DELETE /sites/:index error:', err);
    res.status(500).json({ error: 'Server error deleting site' });
  }
});

export default router;