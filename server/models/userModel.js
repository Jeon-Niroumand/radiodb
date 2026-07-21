import pool from "../db/pool.js";

export async function getAllActiveUsers() {
  const result = await pool.query(`
    SELECT
      id,
      display_name
    FROM users
    WHERE active = TRUE
    ORDER BY display_name;
  `);

  return result.rows;
}

export async function getUserById(id) {
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

  return result.rows[0] || null;
}

export async function createUser(user) {
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
      user.display_name,
      user.username,
      user.email || null,
      user.role_id,
      user.active ?? true,
    ]
  );

  return result.rows[0];
}

export async function updateUser(id, user) {
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
      user.display_name,
      user.username,
      user.email || null,
      user.role_id,
      user.active,
      id,
    ]
  );

  return result.rows[0] || null;
}

export async function getUserByGoogleId(googleId) {
  const result = await pool.query(
    `
    SELECT
      u.*,
      r.name AS role_name
    FROM users u
    LEFT JOIN roles r
      ON u.role_id = r.id
    WHERE u.google_id = $1;
    `,
    [googleId]
  );

  return result.rows[0] || null;
}

export async function getUserByEmail(email) {
  const result = await pool.query(
    `
    SELECT
      u.*,
      r.name AS role_name
    FROM users u
    LEFT JOIN roles r
      ON u.role_id = r.id
    WHERE LOWER(u.email) = LOWER($1);
    `,
    [email]
  );

  return result.rows[0] || null;
}

export async function updateGoogleAccount(userId, googleId, pictureUrl) {
  const result = await pool.query(
    `
    UPDATE users
    SET
      google_id = $1,
      picture_url = $2,
      last_login = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING *;
    `,
    [googleId, pictureUrl, userId]
  );

  return result.rows[0];
}

export async function updateLastLogin(userId, pictureUrl) {
  const result = await pool.query(
    `
    UPDATE users
    SET
      last_login = CURRENT_TIMESTAMP,
      picture_url = $1
    WHERE id = $2
    RETURNING *;
    `,
    [pictureUrl, userId]
  );

  return result.rows[0];
}

export async function createGoogleUser(profile, viewerRoleId) {
  const email = profile.emails[0].value.toLowerCase();

  // Use the email as the username so it is always unique.
  const username = email;

  const result = await pool.query(
    `
    INSERT INTO users (
      google_id,
      username,
      display_name,
      email,
      picture_url,
      role_id,
      active
    )
    VALUES ($1,$2,$3,$4,$5,$6,TRUE)
    RETURNING *;
    `,
    [
      profile.id,
      username,
      profile.displayName,
      email,
      profile.photos?.[0]?.value ?? null,
      viewerRoleId,
    ]
  );

  return result.rows[0];
}