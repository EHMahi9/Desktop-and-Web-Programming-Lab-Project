console.log("Hello! I am Mahi.")

console.log("NoboGhat Portal Initialized - Developer: Mahi");

// Wait for the HTML document to fully load
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Toggle the mobile menu when the hamburger icon is clicked
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
});