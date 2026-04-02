// Select the forms and input fields
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const usernameInput = document.getElementById('username');

// Function to show messages to users
function showMessage(elementId, message, isSuccess) {
    const messageElement = document.getElementById(elementId);
    messageElement.textContent = message;
    messageElement.style.color = isSuccess ? 'green' : 'red';
    messageElement.style.display = 'block';
}

// Handle login form submission
loginForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission
    const email = emailInput.value;
    const password = passwordInput.value;

    // Perform login logic here (placeholder)
    if(email && password) {
        // On success (placeholder)
        showMessage('loginMessage', 'Login successful!', true);
    } else {
        // On failure (placeholder)
        showMessage('loginMessage', 'Please enter valid email and password.', false);
    }
});

// Handle register form submission
registerForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission
    const email = emailInput.value;
    const password = passwordInput.value;
    const username = usernameInput.value;

    // Perform registration logic here (placeholder)
    if(email && password && username) {
        // On success (placeholder)
        showMessage('registerMessage', 'Registration successful!', true);
    } else {
        // On failure (placeholder)
        showMessage('registerMessage', 'Please fill out all fields correctly.', false);
    }
});

// Hiding messages on load
window.onload = function() {
    document.getElementById('loginMessage').style.display = 'none';
    document.getElementById('registerMessage').style.display = 'none';
};