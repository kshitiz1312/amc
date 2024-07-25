// Registration form submission
const registrationForm = document.getElementById('registrationForm');
if (registrationForm) {
    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Collect form data
        var employeeId = document.getElementById('employee_id').value;
        var name = document.getElementById('name').value;
        var phone = document.getElementById('phone').value;
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        var role = document.getElementById('role').value;

        // Send data to the backend server
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ employee_id: employeeId, name, phone, email, password, role }),
        })
        .then(response => response.text())
        .then(data => {
            alert('Registration successful!');
            localStorage.setItem('userRole', role); // Save the role in localStorage
            window.location.href = 'home.html'; // Redirect to home page
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
}

// Admin login form submission
const adminLoginForm = document.getElementById('adminLoginForm');
if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Collect form data
        var employeeId = document.getElementById('admin_employee_id').value;
        var password = document.getElementById('admin_password').value;

        // Send data to the backend server
        fetch('/adminLogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ employee_id: employeeId, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Admin login successful!');
                localStorage.setItem('userRole', 'admin'); // Set role to admin
                localStorage.setItem('loggedIn', 'true'); // Mark as logged in
                window.location.href = 'order_admin.html'; // Redirect to admin order page
            } else {
                alert('Invalid credentials. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
}

// Function to handle user redirection
function redirectToOrderPage() {
    const role = localStorage.getItem('userRole');
    if (role === 'user') {
        window.location.href = 'order_user.html';
    } else {
        window.location.href = 'admin_login.html';
    }
}

// Function to handle admin login redirection
function goToAdminLoginPage() {
    window.location.href = 'admin_login.html';
}

// Handle login form submission
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());

        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                sessionStorage.setItem('userRole', result.role);
                sessionStorage.setItem('loggedIn', 'true');
                window.location.href = 'home.html';
            } else {
                alert('Invalid employee ID or password');
            }
        } else {
            alert('Login failed');
        }
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

function initializeDataTables(tableId) {
    $(tableId).DataTable();
}

// Fetch orders for order_user.html
if (window.location.pathname === '/order_user.html') {
    fetch('/orders')
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('orderTable');
            data.forEach(order => {
                const row = table.insertRow();
                row.insertCell(0).textContent = order.order_id;
                row.insertCell(1).textContent = order.product_name;
                row.insertCell(2).textContent = formatDate(order.purchase_date);
                row.insertCell(3).textContent = formatDate(order.warranty_start_date);
                row.insertCell(4).textContent = formatDate(order.warranty_end_date);
                row.insertCell(5).textContent = formatDate(order.amc_start_date);
                row.insertCell(6).textContent = formatDate(order.amc_end_date);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Fetch orders for order_admin.html
if (window.location.pathname === '/order_admin.html') {
    fetch('/orders')
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById('adminOrderTable');
            data.forEach(order => {
                const row = table.insertRow();
                row.insertCell(0).textContent = order.order_id;
                row.insertCell(1).textContent = order.product_name;
                row.insertCell(2).textContent = formatDate(order.purchase_date);
                row.insertCell(3).textContent = formatDate(order.warranty_start_date);
                row.insertCell(4).textContent = formatDate(order.warranty_end_date);
                row.insertCell(5).innerHTML = `<select id="amcNumber_${order.order_id}" name="amcNumber_${order.order_id}">
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                                    <option value="6">6</option>
                                                    <option value="7">7</option>
                                                    <option value="8">8</option>
                                                    <option value="9">9</option>
                                                    <option value="10">10</option>
                                                </select>`;
                row.insertCell(6).textContent = formatDate(order.amc_start_date);
                row.insertCell(7).textContent = formatDate(order.amc_end_date);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Redirect based on role from session storage on home.html
if (window.location.pathname === '/home.html') {
    const loggedIn = sessionStorage.getItem('loggedIn');
    const userRole = sessionStorage.getItem('userRole');
    console.log('loggedIn:', loggedIn);
    console.log('userRole:', userRole);

    if (loggedIn && userRole) {
        fetch('/statistics')
            .then(response => response.json())
            .then(data => {
                initializeCharts(data);
            })
            .catch(error => console.error('Error:', error));
    } else {
        console.error('User role or login status not found.');
        alert('User role or login status not found.');
    }
}

function initializeCharts(data) {
    if (Chart.getChart("warrantyChart")) {
        Chart.getChart("warrantyChart").destroy();
    }
    if (Chart.getChart("amcChart")) {
        Chart.getChart("amcChart").destroy();
    }

    const warrantyData = {
        labels: ['Active Warranty', 'Expired Warranty'],
        datasets: [{
            label: 'Warranty',
            data: [data.activeWarrantyCount, data.expiredWarrantyCount],
            backgroundColor: ['#36a2eb', '#ff6384']
        }]
    };

    const amcData = {
        labels: ['Active AMC', 'Expired AMC'],
        datasets: [{
            label: 'AMC',
            data: [data.activeAmcCount, data.expiredAmcCount],
            backgroundColor: ['#4bc0c0', '#ffcd56']
        }]
    };

    const warrantyCtx = document.getElementById('warrantyChart').getContext('2d');
    new Chart(warrantyCtx, {
        type: 'pie',
        data: warrantyData,
        options: {
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    if (index === 0) {
                        window.location.href = 'warranty_active.html';
                    } else if (index === 1) {
                        window.location.href = 'warranty_expired.html';
                    }
                }
            }
        }
    });

    const amcCtx = document.getElementById('amcChart').getContext('2d');
    new Chart(amcCtx, {
        type: 'pie',
        data: amcData,
        options: {
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    if (index === 0) {
                        window.location.href = 'amc_active.html';
                    } else if (index === 1) {
                        window.location.href = 'amc_expired.html';
                    }
                }
            }
        }
    });
}

function fetchActiveWarrantyData() {
    fetch('/orders?status=warranty_active')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('activeWarrantyTable').getElementsByTagName('tbody')[0];
            data.forEach(order => {
                const row = tableBody.insertRow();
                row.insertCell(0).textContent = order.order_id;
                row.insertCell(1).textContent = order.product_name;
                row.insertCell(2).textContent = formatDate(order.purchase_date);
                row.insertCell(3).textContent = formatDate(order.warranty_start_date);
                row.insertCell(4).textContent = formatDate(order.warranty_end_date);
            });
        })
        .catch(error => console.error('Error:', error));
}

function fetchExpiredWarrantyData() {
    fetch('/orders?status=warranty_expired')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('expiredWarrantyTable').getElementsByTagName('tbody')[0];
            data.forEach(order => {
                const row = tableBody.insertRow();
                row.insertCell(0).textContent = order.order_id;
                row.insertCell(1).textContent = order.product_name;
                row.insertCell(2).textContent = formatDate(order.purchase_date);
                row.insertCell(3).textContent = formatDate(order.warranty_start_date);
                row.insertCell(4).textContent = formatDate(order.warranty_end_date);
            });
        })
        .catch(error => console.error('Error:', error));
}

function fetchActiveAmcData() {
    fetch('/orders?status=amc_active')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('activeAmcTable').getElementsByTagName('tbody')[0];
            data.forEach(order => {
                const row = tableBody.insertRow();
                row.insertCell(0).textContent = order.order_id;
                row.insertCell(1).textContent = order.product_name;
                row.insertCell(2).textContent = formatDate(order.purchase_date);
                row.insertCell(3).textContent = formatDate(order.amc_start_date);
                row.insertCell(4).textContent = formatDate(order.amc_end_date);
            });
        })
        .catch(error => console.error('Error:', error));
}

function fetchExpiredAmcData() {
    fetch('/orders?status=amc_expired')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('expiredAmcTable').getElementsByTagName('tbody')[0];
            data.forEach(order => {
                const row = tableBody.insertRow();
                row.insertCell(0).textContent = order.order_id;
                row.insertCell(1).textContent = order.product_name;
                row.insertCell(2).textContent = formatDate(order.purchase_date);
                row.insertCell(3).textContent = formatDate(order.amc_start_date);
                row.insertCell(4).textContent = formatDate(order.amc_end_date);
            });
        })
        .catch(error => console.error('Error:', error));
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

// Call the appropriate function based on the current page
if (window.location.pathname === '/warranty_active.html') {
    fetchActiveWarrantyData();
} else if (window.location.pathname === '/warranty_expired.html') {
    fetchExpiredWarrantyData();
} else if (window.location.pathname === '/amc_active.html') {
    fetchActiveAmcData();
} else if (window.location.pathname === '/amc_expired.html') {
    fetchExpiredAmcData();
}

// Handle add order form submission
console.log('Script loaded'); // Check if the script is running

addOrderForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    console.log('Form submitted'); // Check if the event listener is triggered

    const formData = new FormData(addOrderForm);
    const data = Object.fromEntries(formData.entries());
    console.log('Form data:', data); // Check the collected data

    try {
        const response = await fetch('/addOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        console.log('Response status:', response.status); // Check the response status

        if (response.ok) {
            window.location.href = 'order_admin.html';
        } else {
            alert('Failed to add order. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting the form:', error);
        alert('An error occurred while adding the order.');
    }
});




