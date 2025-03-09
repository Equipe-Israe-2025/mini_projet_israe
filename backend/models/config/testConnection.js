const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://neondb_owner:npg_Gzy3vUN4QVXK@ep-empty-tree-a9x0b77r-pooler.gwc.azure.neon.tech/neondb',
  ssl: {
    rejectUnauthorized: false // Important pour Neon
  }
});

async function testConnection() {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW()'); // Vérifie si la requête fonctionne
    console.log('Connexion réussie ! Heure actuelle :', res.rows[0].now);
    client.release();
  } catch (err) {
    console.error('Erreur de connexion à la base de données :', err);
  }
}

testConnection();