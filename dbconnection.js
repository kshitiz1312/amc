const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',          // This is your local machine
    user: 'root',               // Your MySQL username
    password: '1234',           // Your MySQL password
    database: 'AMC_Management'  // Your database name
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to database');
});