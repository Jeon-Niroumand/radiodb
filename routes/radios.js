import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

/**
 * Get all radios (pagination support)
 */
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;
  const search = (req.query.search || '').trim();

  try {
    const result = await pool.query(
  `
  SELECT
    r.*,
    s.name as site_name,
    s.type as site_type,
    s.frequency as site_frequency,
    s.repeater_rx as site_repeater_rx,
    s.repeater_tx as site_repeater_tx,
    s.plcode as site_plcode
  FROM radios r
  LEFT JOIN sites s ON r.site_index = s.index
  WHERE
    $1 = ''
    OR LOWER(r.model) LIKE LOWER($2)
    OR LOWER(r.serial) LIKE LOWER($2)
    OR LOWER(s.name) LIKE LOWER($2)
    OR LOWER(s.type) LIKE LOWER($2)
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
      WHERE
        $1 = ''
        OR LOWER(r.model) LIKE LOWER($2)
        OR LOWER(r.serial) LIKE LOWER($2)
        OR LOWER(s.name) LIKE LOWER($2)
        OR LOWER(s.type) LIKE LOWER($2);
      `,
      [
        search,
        `%${search}%`
      ]
    );

    res.json({
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
      totalPages: Math.ceil(countResult.rows[0].count / limit),
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
router.post('/', async (req, res) => {
  const { model, serial, site_index, frequency, repeater_tx_frequency, repeater_rx_frequency, pl, in_serv_date, tech_sign } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO radios (model, serial, site_index, frequency, repeater_tx_frequency, repeater_rx_frequency, pl, in_serv_date, tech_sign)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [model, serial, site_index, frequency, repeater_tx_frequency, repeater_rx_frequency, pl, in_serv_date, tech_sign]
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
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    model,
    serial,
    site_index,
    frequency,
    repeater_tx_frequency,
    repeater_rx_frequency,
    pl,
    in_serv_date,
    tech_sign
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
        frequency = $4,
        repeater_tx_frequency = $5,
        repeater_rx_frequency = $6,
        pl = $7,
        in_serv_date = $8,
        tech_sign = $9,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *
      `,
      [
        model,
        serial,
        site_index,
        frequency,
        repeater_tx_frequency,
        repeater_rx_frequency,
        pl,
        in_serv_date || null,
        tech_sign || null,
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
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT
        r.id,
        r.model,
        r.serial,
        r.site_index,
        r.frequency,
        r.repeater_tx_frequency,
        r.repeater_rx_frequency,
        r.pl,
        r.in_serv_date,
        r.tech_sign
      FROM radios r
      WHERE r.id = $1
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
 * Delete a radio
 */
router.delete('/:id', async (req, res) => {
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