const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres.nsnzwrsihwtdytnuhhxv:YOUR_PASSWORD_HERE@aws-0-eu-north-1.pooler.supabase.com:6543/postgres',
  ssl: {
    rejectUnauthorized: false  // Only for testing!
  },
  connectionTimeoutMillis: 5000
});

console.log('Attempting to connect...');
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Connection error:', err);
    process.exit(1);
  }
  console.log('Connection successful!', res.rows[0]);
  pool.end();
});
