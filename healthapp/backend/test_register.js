async function run() {
  try {
     const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           full_name: 'Super Admin',
           email: 'admin2@metascale.com',
           password: 'AdminPassword123!',
           role: 'admin'
        })
     });
     const data = await res.json();
     console.log(data);
  } catch(e) { console.error(e) }
}
run();
