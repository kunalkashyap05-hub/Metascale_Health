require('dotenv').config();
const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const [users] = await connection.query("SELECT id, email, role FROM users LIMIT 10");
  console.log("Current Users:", users);
  
  if (users.length > 0) {
    const targetEmail = users[0].email;
    await connection.query("UPDATE users SET role = 'admin' WHERE email = ?", [targetEmail]);
    console.log(`Successfully upgraded ${targetEmail} to ADMIN`);
  } else {
    // If no users, we mock create one.
    console.log("No users exist.");
  }
  await connection.end();
}
run().catch(console.error);
