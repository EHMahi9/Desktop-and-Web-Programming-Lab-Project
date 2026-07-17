// Function to toggle between Login and Register tabs
function toggleAuth(tabName) {
    // Get DOM elements
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');

    if (tabName === 'login') {
        // Show Login, Hide Register
        loginForm.classList.add('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.remove('active');
        registerForm.classList.add('hidden');
        
        // Update Tab styling
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
    } else {
        // Show Register, Hide Login
        registerForm.classList.add('active');
        registerForm.classList.remove('hidden');
        loginForm.classList.remove('active');
        loginForm.classList.add('hidden');
        
        // Update Tab styling
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
    }
}

// Handle Form Submissions for Phase 3 MVP
document.addEventListener("DOMContentLoaded", () => {
    
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Simulate Login Action
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // In Phase 4, this will send a POST to /api/auth/login
            // For now, redirect to the dashboard to test the UI flow
            window.location.href = "dashboard.html";
        });
    }

    // Simulate Register Action
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // In Phase 4, this will send a POST to /api/auth/register
            // For now, redirect to the dashboard
            window.location.href = "dashboard.html";
        });
    }
});

// Check if the URL came with a hash (e.g., index.html#register)
window.onload = () => {
    if (window.location.hash === "#register") {
        toggleAuth('register');
    }
};