const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Create connection to MySQL database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'AMC_Management'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/registration', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'registration.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/order_user', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'order_user.html'));
});

app.get('/order_admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'order_admin.html'));
});

app.get('/admin_login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin_login.html'));
});

// Handle registration
app.post('/register', (req, res) => {
    const { name, phone, email, password, role } = req.body;
    const query = 'INSERT INTO users (name, phone_number, email_id, password, role) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [name, phone, email, password, role], (err, result) => {
        if (err) {
            console.error('Error registering user:', err);
            res.status(500).send('Registration failed');
            return;
        }
        res.status(200).send('User registered successfully');
        res.redirect('/login');
    });
});

// Handle user login
app.post('/login', (req, res) => {
    const { employee_id, password } = req.body;
    const query = 'SELECT * FROM users WHERE employee_id = ? AND password = ?';
    connection.query(query, [employee_id, password], (err, results) => {
        if (err) {
            console.error('Error logging in:', err);
            res.status(500).send('Login failed');
            return;
        }
        if (results.length > 0) {
            res.status(200).json({ success: true, role: results[0].role });
        } else {
            res.status(401).json({ success: false });
        }
    });
});

// Handle admin login
app.post('/adminLogin', (req, res) => {
    const { employee_id, password } = req.body;
    const query = 'SELECT * FROM users WHERE employee_id = ? AND password = ? AND role = "admin"';
    connection.query(query, [employee_id, password], (err, results) => {
        if (err) {
            console.error('Error logging in as admin:', err);
            res.status(500).send('Admin login failed');
            return;
        }
        if (results.length > 0) {
            res.status(200).json({ success: true });
        } else {
            res.status(401).json({ success: false });
        }
    });
});

// Fetch orders based on status (warranty/AMC)
app.get('/orders', (req, res) => {
    const status = req.query.status;
    let query = `
        SELECT 
            orders.order_id, 
            orders.product_name, 
            orders.purchase_date, 
            orders.warranty_start_date, 
            orders.warranty_end_date, 
            amc_details.amc_start_date, 
            amc_details.amc_end_date, 
            amc_details.amc_number
        FROM 
            orders 
        LEFT JOIN 
            amc_details 
        ON 
            orders.order_id = amc_details.order_id
            
    `;
    
    if (status === 'warranty_active') {
        query += ' WHERE orders.warranty_end_date >= CURDATE()';
    } else if (status === 'warranty_expired') {
        query += ' WHERE orders.warranty_end_date < CURDATE()';
    } else if (status === 'amc_active') {
        query += ' WHERE amc_details.amc_end_date >= CURDATE()';
    } else if (status === 'amc_expired') {
        query += ' WHERE amc_details.amc_end_date < CURDATE()';
    }

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching orders:', err);
            res.status(500).send('Failed to fetch orders');
            return;
        }
        res.json(results);
    });
});

// Fetch statistics for dashboard
app.get('/statistics', (req, res) => {
    const warrantyQuery = `
        SELECT
            CASE
                WHEN warranty_end_date >= CURDATE() THEN 'Active'
                ELSE 'Expired'
            END AS status,
            COUNT(*) AS count
        FROM orders
        GROUP BY status
    `;

    const amcQuery = `
        SELECT
            CASE
                WHEN amc_end_date >= CURDATE() THEN 'Active'
                ELSE 'Expired'
            END AS status,
            COUNT(*) AS count
        FROM amc_details
        GROUP BY status
    `;

    const data = {
        activeWarrantyCount: 0,
        expiredWarrantyCount: 0,
        activeAmcCount: 0,
        expiredAmcCount: 0
    };

    connection.query(warrantyQuery, (err, warrantyResults) => {
        if (err) {
            console.error('Error executing warranty query:', err);
            res.status(500).send('Error fetching warranty data');
            return;
        }

        warrantyResults.forEach(row => {
            if (row.status === 'Active') {
                data.activeWarrantyCount = row.count;
            } else {
                data.expiredWarrantyCount = row.count;
            }
        });

        connection.query(amcQuery, (err, amcResults) => {
            if (err) {
                console.error('Error executing AMC query:', err);
                res.status(500).send('Error fetching AMC data');
                return;
            }

            amcResults.forEach(row => {
                if (row.status === 'Active') {
                    data.activeAmcCount = row.count;
                } else {
                    data.expiredAmcCount = row.count;
                }
            });

            res.json(data);
        });
    });
});

// Fetch active warranty data
app.get('/warranty_active', (req, res) => {
    const query = `
        SELECT orders.*, amc_details.amc_start_date, amc_details.amc_end_date, amc_details.amc_number
        FROM orders
        LEFT JOIN amc_details ON orders.order_id = amc_details.order_id
        WHERE warranty_end_date >= CURDATE()
    `;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching active warranty data:', err);
            res.status(500).send('Failed to fetch data');
            return;
        }
        res.json(results);
    });
});

// Fetch expired warranty data
app.get('/warranty_expired', (req, res) => {
    const query = `
        SELECT orders.*, amc_details.amc_start_date, amc_details.amc_end_date, amc_details.amc_number
        FROM orders
        LEFT JOIN amc_details ON orders.order_id = amc_details.order_id
        WHERE warranty_end_date < CURDATE()
    `;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching expired warranty data:', err);
            res.status(500).send('Failed to fetch data');
            return;
        }
        res.json(results);
    });
});

// Fetch active AMC data
app.get('/amc_active', (req, res) => {
    const query = `
        SELECT orders.*, amc_details.amc_start_date, amc_details.amc_end_date, amc_details.amc_number
        FROM orders
        LEFT JOIN amc_details ON orders.order_id = amc_details.order_id
        WHERE amc_end_date >= CURDATE()
    `;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching active AMC data:', err);
            res.status(500).send('Failed to fetch data');
            return;
        }
        res.json(results);
    });
});

// Fetch expired AMC data
app.get('/amc_expired', (req, res) => {
    const query = `
        SELECT orders.*, amc_details.amc_start_date, amc_details.amc_end_date, amc_details.amc_number
        FROM orders
        LEFT JOIN amc_details ON orders.order_id = amc_details.order_id
        WHERE amc_end_date < CURDATE()
    `;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching expired AMC data:', err);
            res.status(500).send('Failed to fetch data');
            return;
        }
        res.json(results);
    });
});

app.post('/addOrder', (req, res) => {
    const { order_id, product_name, purchase_date, warranty_start_date, warranty_end_date, amc_start_date, amc_end_date, amc_number } = req.body;

    if (!order_id || !product_name || !purchase_date || !warranty_start_date || !warranty_end_date) {
        console.error('Missing required fields:', req.body);
        res.status(400).send('Missing required fields');
        return;
    }

    connection.beginTransaction((err) => {
        if (err) {
            console.error('Error starting transaction:', err);
            res.status(500).send('Error starting transaction');
            return;
        }

        const orderQuery = 'INSERT INTO orders (order_id, product_name, purchase_date, warranty_start_date, warranty_end_date) VALUES (?, ?, ?, ?, ?)';
        connection.query(orderQuery, [order_id, product_name, purchase_date, warranty_start_date, warranty_end_date], (err, results) => {
            if (err) {
                console.error('Error adding order:', err);
                return connection.rollback(() => {
                    res.status(500).send('Error adding order');
                });
            }

            const amcQuery = 'INSERT INTO amc_details (order_id, amc_start_date, amc_end_date, amc_number) VALUES (?, ?, ?, ?)';
            connection.query(amcQuery, [order_id, amc_start_date, amc_end_date, amc_number], (err, results) => {
                if (err) {
                    console.error('Error adding AMC details:', err);
                    return connection.rollback(() => {
                        res.status(500).send('Error adding AMC details');
                    });
                }

                connection.commit((err) => {
                    if (err) {
                        console.error('Error committing transaction:', err);
                        return connection.rollback(() => {
                            res.status(500).send('Error committing transaction');
                        });
                    }

                    res.status(200).send('Order and AMC details added');
                });
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
