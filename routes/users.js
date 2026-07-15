import express from "express";
import pool from "../db/pool.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                id,
                display_name
            FROM users
            WHERE active = TRUE
            ORDER BY display_name;
        `);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch users." });
    }
});

/**
 * Get one user by ID
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT
        u.id,
        u.display_name,
        u.username,
        u.email,
        u.role_id,
        u.active,
        r.name AS role_name
      FROM users u
      LEFT JOIN roles r
        ON u.role_id = r.id
      WHERE u.id = $1;
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

/**
 * Create user
 */
router.post('/', async (req, res) => {
  const {
    display_name,
    username,
    email,
    role_id,
    active
  } = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO users (
        display_name,
        username,
        email,
        role_id,
        active
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
      `,
      [
        display_name,
        username,
        email || null,
        role_id,
        active ?? true
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

/**
 * Update user
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  const {
    display_name,
    username,
    email,
    role_id,
    active
  } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE users
      SET
        display_name = $1,
        username = $2,
        email = $3,
        role_id = $4,
        active = $5,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *;
      `,
      [
        display_name,
        username,
        email || null,
        role_id,
        active,
        id
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

export default router;