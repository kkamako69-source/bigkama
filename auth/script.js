// auth/script.js

class Auth {
    constructor() {
        this.users = []; // Array to hold registered users
    }

    register(username, password) {
        if (this.validateInput(username, password)) {
            const newUser = { username, password };
            this.users.push(newUser);
            console.log("User registered successfully.");
        } else {
            console.error("Registration failed: Invalid input.");
        }
    }

    login(username, password) {
        const user = this.users.find(user => user.username === username);
        if (user && user.password === password) {
            console.log("Login successful.");
        } else {
            console.error("Login failed: Invalid credentials.");
        }
    }

    validateInput(username, password) {
        return username.length > 0 && password.length > 5; // Basic validation
    }

    handleRegisterForm(event) {
        event.preventDefault();
        const username = event.target.username.value;
        const password = event.target.password.value;
        this.register(username, password);
    }

    handleLoginForm(event) {
        event.preventDefault();
        const username = event.target.username.value;
        const password = event.target.password.value;
        this.login(username, password);
    }
}

// Event listeners for forms (assuming forms have id 'registerForm' and 'loginForm')
const auth = new Auth();

document.getElementById('registerForm').addEventListener('submit', (event) => {
    auth.handleRegisterForm(event);
});

document.getElementById('loginForm').addEventListener('submit', (event) => {
    auth.handleLoginForm(event);
});
