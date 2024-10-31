// settings.js

document.addEventListener('DOMContentLoaded', function() {
    loadAdminData();
    attachEventListeners();
    initializeNavigation();
});

function loadAdminData() {
    const adminData = JSON.parse(localStorage.getItem('admin')) || {
        username: 'Admin',
        email: 'admin@gmail.com'
    };

    document.getElementById('admin-username').value = adminData.username;
    document.getElementById('admin-email').value = adminData.email;
}

function attachEventListeners() {
    document.getElementById('logout-button').addEventListener('click', logout);
    document.getElementById('reset-password-button').addEventListener('click', resetPassword);
    document.getElementById('clear-cache-button').addEventListener('click', clearCache);
    document.getElementById('factory-reset-button').addEventListener('click', factoryReset);
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            input.readOnly = !input.readOnly;
            input.focus();
        });
    });
}

function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.settings-section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            
            navButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === target) {
                    section.classList.add('active');
                }
            });
        });
    });
}

function logout() {
    localStorage.removeItem('admin');
    showPopup('Logged out successfully!');
    window.location.href = '../index.html';
}

function resetPassword() {
    const newPassword = prompt('Enter new password:');
    if (newPassword) {
        const admin = JSON.parse(localStorage.getItem('admin')) || {};
        admin.password = newPassword;
        localStorage.setItem('admin', JSON.stringify(admin));
        showPopup('Password reset successfully!');
    }
}

function clearCache() {
    localStorage.clear();
    showPopup('Cache cleared!');
}

function factoryReset() {
    if (confirm('Are you sure you want to factory reset? This action cannot be undone.')) {
        localStorage.clear();
        showPopup('System reset to factory settings.');
        window.location.href = '../index.html';
    }
}

function showPopup(message) {
    // Implement your popup logic here
    alert(message);
}