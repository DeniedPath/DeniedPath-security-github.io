// main.js

// Global variables
let currentUser = null;
const inactivityTimeout = 1 * 60 * 1000; // 1 minute in milliseconds
let inactivityTimer;

// Master username and password for login
const masterUsername = "ManIWantToSleep";
const masterPassword = "S3cur3#AlarmSy$tem";

// Function to handle login
// In main.js

// Function to handle login
function signIn() {
    const username = document.getElementById("signInUsername").value.trim();
    const password = document.getElementById("signInPassword").value.trim();

    // Retrieve admin data from local storage
    const storedAdmin = JSON.parse(localStorage.getItem("admin"));

    // Retrieve regular users from local storage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if it's the admin
    if (storedAdmin && username === storedAdmin.username && password === storedAdmin.password) {
        currentUser = { username: username, isAdmin: true };
        window.location.href = 'dashboard/dashboard.html'; // Redirect to admin dashboard
        return;
    }

    // Check regular users
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = { username: username, isAdmin: false };
        window.location.href = 'dashboard/dashboard.html'; // Redirect to user dashboard
        return;
    }

    // If no match found
    showPopup("Invalid username or password.");
}

// Function to create a new account
function createAccount() {
    const newUsername = document.getElementById("newUsername").value.trim();
    const newPassword1 = document.getElementById("newPassword1").value;
    const newPassword2 = document.getElementById("newPassword2").value;
    const securityQuestion = document.getElementById("securityQuestion").value;
    const securityAnswer = document.getElementById("securityAnswer").value;

    if (newPassword1 !== newPassword2) {
        showPopup("Passwords do not match.");
        return;
    }

    if (newPassword1.length < 16 || !/[A-Z]/.test(newPassword1) || !/[!@#$%^&*]/.test(newPassword1)) {
        showPopup("Password must be at least 16 characters long, with one capital letter and one special character.");
        return;
    }

    if (!newUsername || !securityQuestion || !securityAnswer) {
        showPopup("Please fill in all fields.");
        return;
    }

    // Check if username already exists
    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some(user => user.username === newUsername)) {
        showPopup("Username already exists. Please choose a different one.");
        return;
    }

    const newUser = {
        username: newUsername,
        password: newPassword1,
        securityQuestion: securityQuestion,
        securityAnswer: securityAnswer,
        isAdmin: false
    };

    // Add new user to the users array
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    showPopup("Account created successfully! You can now sign in.");
    showSection('signIn');
}

// Function to check security answer
function checkSecurityAnswer() {
    const username = document.getElementById('forgotPasswordUsername').value.trim();
    const selectedQuestion = document.getElementById('securityQuestionCheck').value;
    const providedAnswer = document.getElementById('securityAnswerCheck').value.trim();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.username === username);

    if (user && user.securityQuestion === selectedQuestion && user.securityAnswer.toLowerCase() === providedAnswer.toLowerCase()) {
        showResetPassword(user);
    } else {
        showPopup('Incorrect answer or username. Please try again.');
    }
}

// Function to show reset password form
function showResetPassword(user) {
    const resetPasswordForm = `
        <h2>Reset Password</h2>
        <input type="password" id="newPassword" placeholder="New Password">
        <input type="password" id="confirmNewPassword" placeholder="Confirm New Password">
        <button onclick="resetPassword('${user.username}')">Reset Password</button>
    `;
    document.getElementById('forgotPassword').innerHTML = resetPasswordForm;
}

// Function to reset password
function resetPassword(username) {
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    if (newPassword !== confirmNewPassword) {
        showPopup('Passwords do not match.');
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(u => u.username === username);
    
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem("users", JSON.stringify(users));
        showPopup('Password reset successfully!');
        showSection('signIn');
    }
}

// Function to show a specific section and hide others
function showSection(sectionId) {
    const sections = ['signIn', 'createAccount', 'forgotPassword'];
    sections.forEach(section => {
        document.getElementById(section).classList.toggle('hidden', section !== sectionId);
    });
}

// Show pop-up message function
function showPopup(message) {
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modalMessage');
    const span = document.getElementsByClassName('close')[0];

    modalMessage.textContent = message;
    modal.style.display = "block";

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

// Initialize when the page loads
window.onload = function() {
    showSection('signIn');
};

// Add event listener for theme toggle
document.getElementById('themeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    this.innerHTML = document.body.classList.contains('dark-theme') ? 
        '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});