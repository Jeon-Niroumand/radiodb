import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required for Neon
  },
});

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

app.use(cors());
app.use(express.json());

/**
 * Get all radios (pagination support)
 */
app.get('/radios', async (req, res) => {
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
app.post('/radios', async (req, res) => {
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
app.put('/radios/:id', async (req, res) => {
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
    );

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
app.get('/radios/:id', async (req, res) => {
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
app.delete('/radios/:id', async (req, res) => {
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

// Get all sites
app.get('/sites', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sites ORDER BY index');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching sites');
  }
});

// Add a new site
app.post('/sites', async (req, res) => {
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

// Update a site
app.put('/sites/:index', async (req, res) => {
  
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
app.delete('/sites/:index', async (req, res) => {
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

/**
 * More routes (edit, delete) can be added later
 */

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
