import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/**
 * Get all radios
 */
app.get('/radios', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        r.id,
        r.model,
        r.serial,
        r.site_index,
        s.name AS site_name,
        s.type AS site_type
      FROM radios r
      LEFT JOIN sites s ON r.site_index = s.index
      ORDER BY r.id;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching radios');
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

// Delete a site
app.delete('/sites/:index', async (req, res) => {
  const { index } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM sites WHERE "index" = $1 RETURNING *',
      [index]
    );

    if (result.rowCount === 0) {
      return res.status(404).send('Site not found');
    }

    res.json({ message: 'Site deleted', site: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting site');
  }
});

/**
 * More routes (edit, delete) can be added later
 */

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
