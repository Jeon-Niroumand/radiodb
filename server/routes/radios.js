import express from 'express';
import pool from '../db/pool.js';
import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';

function escapeCSV(value) {
  if (value === null || value === undefined) return "";

  return `"${String(value).replace(/"/g, '""')}"`;
}

const router = express.Router();

/**
 * Get all radios (pagination support)
 */
router.get(
  '/', authenticate, authorize("Administrator", "Technician", "Viewer"),
  async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;
  const search = (req.query.search || '').trim();

  try {
    const result = await pool.query(
  `
  SELECT
    r.*,

    s.name AS site_name,
    s.type AS site_type,
    s.frequency AS site_frequency,
    s.repeater_rx AS site_repeater_rx,
    s.repeater_tx AS site_repeater_tx,
    s.plcode AS site_plcode,

    u.display_name AS tech_sign

  FROM radios r

  LEFT JOIN sites s
      ON r.site_index = s.index

  LEFT JOIN users u
      ON r.tech_sign_id = u.id

  WHERE
      $1 = ''
      OR LOWER(r.model) LIKE LOWER($2)
      OR LOWER(r.serial) LIKE LOWER($2)
      OR LOWER(s.name) LIKE LOWER($2)
      OR LOWER(s.type) LIKE LOWER($2)
      OR LOWER(COALESCE(u.display_name, '')) LIKE LOWER($2)

  ORDER BY
      s.name ASC,
      r.model ASC,
      r.serial ASC

  LIMIT $3
  OFFSET $4;
    `,
  [
    search,
    `%${search}%`,
    limit,
    offset
  ]
);

    const countResult = await pool.query(
      `
      SELECT COUNT(*)
      FROM radios r
      LEFT JOIN sites s
        ON r.site_index = s.index
      LEFT JOIN users u
        ON r.tech_sign_id = u.id
      WHERE
        $1 = ''
        OR LOWER(r.model) LIKE LOWER($2)
        OR LOWER(r.serial) LIKE LOWER($2)
        OR LOWER(s.name) LIKE LOWER($2)
        OR LOWER(s.type) LIKE LOWER($2)
        OR LOWER(COALESCE(u.display_name, '')) LIKE LOWER($2);
      `,
      [
        search,
        `%${search}%`
      ]
    );
    
    res.json({
      data: result.rows,
      totalPages: Math.ceil(countResult.rows[0].count / limit),
      totalRecords: Number(countResult.rows[0].count),
      page
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch radios' });
  }
});

/**
 * Add a new radio
 */
router.post(
  '/', authenticate, authorize("Administrator", "Technician"),
   async (req, res) => {
  const {
    model,
    serial,
    site_index,
  } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO radios (
          model,
          serial,
          site_index,
          tech_sign_id,
          created_by,
          updated_by
      )
      VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $5
      )
      RETURNING *;`,
      [
          model,
          serial,
          site_index,
          req.user.id,
          req.user.id,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding radio');
  }
});

/**
 * Update a radio
 */
router.put(
  '/:id', authenticate, authorize("Administrator", "Technician"), 
  async (req, res) => {
  const { id } = req.params;
  const {
      model,
      serial,
      site_index,
  } = req.body;

  try {
    console.log('PUT /radios body:', req.body);
    const result = await pool.query(
      `
      UPDATE radios
      SET
          model = $1,
          serial = $2,
          site_index = $3,
          tech_sign_id = $4,
          updated_by = $5,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *;
      `,
      [
          model,
          serial,
          site_index,
          req.user.id, // Use the current user ID
          req.user.id,
          id
      ]
    )
    console.log('Updated rows:', result.rowCount);
    console.log(result.rows[0]);;

    if (result.rowCount === 0) {
      return res.status(404).send('Radio not found');
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating radio');
  }
});

/**
 * Get one radio by ID
 */
router.get(
  '/:id', authenticate, authorize("Administrator", "Technician", "Viewer"),
  async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT

          r.*,

          s.name AS site_name,
          s.type AS site_type,
          s.frequency AS site_frequency,
          s.repeater_rx AS site_repeater_rx,
          s.repeater_tx AS site_repeater_tx,
          s.plcode AS site_plcode,

          u.display_name AS tech_sign

      FROM radios r

      LEFT JOIN sites s
          ON r.site_index = s.index

      LEFT JOIN users u
          ON r.tech_sign_id = u.id

      WHERE r.id = $1;
            `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send('Radio not found');
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching radio');
  }
});

/**
 * Export all radios as CSV
 */
router.get(
  '/export', authenticate, authorize("Administrator", "Technician"), 
  async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        r.*,
        s.name AS site_name,
        s.type AS site_type,
        s.frequency AS site_frequency,
        s.repeater_rx AS site_repeater_rx,
        s.repeater_tx AS site_repeater_tx,
        s.plcode AS site_plcode,
        u.display_name AS tech_sign
      FROM radios r
      LEFT JOIN sites s
        ON r.site_index = s.index
      LEFT JOIN users u
        ON r.tech_sign_id = u.id
      ORDER BY
        s.name ASC,
        r.model ASC,
        r.serial ASC;
    `);

    // We'll build the CSV here next.

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to export radios." });
  }
});

/**
 * Delete a radio
 */
router.delete(
  '/:id', authenticate, authorize("Administrator", "Technician"),
  (req, res, next) => {
    console.log("DELETE REQUEST HIT:", req.params.id);
    next();
  },
  authenticate,
  authorize("Administrator", "Technician"),
  async (req, res) => {
  console.log("DELETE USER:", req.user);
  console.log("DELETE RADIO ID:", req.params.id);
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM radios WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send('Radio not found');
    }

    res.json({ message: 'Radio deleted', radio: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting radio');
  }
});

export default router;