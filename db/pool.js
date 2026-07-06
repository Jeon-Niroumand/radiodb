import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on('connect', () => {
  console.log('DB connected successfully');
});

pool.on('error', (err) => {
  console.error('Unexpected DB error:', err);
});

export default pool;