// Global variables
let masterPassword = '';
let adminPassword = 'Launchpad101@'; // Default admin password
let sensors = [];
const inactivityTimeout = 1 * 60 * 1000; // 1 minute in milliseconds
let inactivityTimer;
let isPasswordSet = false;

// Function to show only one section and hide others
function showSection(sectionId) {
    const sections = ['signIn', 'createPassword', 'forgotPassword', 'passwordSetup', 'sensorConfig', 'sensorList', 'alarmSimulation', 'mainApp', 'passwordReentry'];
    sections.forEach(section => {
        document.getElementById(section).style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Function to set the master password
function setMasterPassword() {
    const password1 = document.getElementById('password1').value;
    const password2 = document.getElementById('password2').value;
    const message = document.getElementById('passwordMessage');

    if (password1 !== password2) {
        message.textContent = "Passwords do not match!";
        return;
    }

    if (password1.length < 16 || !/[!@#$%^&*(),.?":{}|<>]/.test(password1) || !/[A-Z]/.test(password1)) {
        message.textContent = "Password must be at least 16 characters long, contain a special character, and a capital letter!";
        return;
    }

    masterPassword = password1;
    localStorage.setItem('masterPassword', masterPassword);
    message.textContent = "Password set successfully!";
    isPasswordSet = true;

    showMainApp();
    resetInactivityTimer(); // Start the inactivity timer
}

// Function to show the main application
function showMainApp() {
    showSection('mainApp');
    document.getElementById('sensorConfig').style.display = 'block';
    document.getElementById('sensorList').style.display = 'block';
    document.getElementById('alarmSimulation').style.display = 'block';
}

// Function to handle user login
function signIn() {
    const enteredPassword = document.getElementById('signInPassword').value;
    const storedPassword = localStorage.getItem('masterPassword');
    
    if (enteredPassword === storedPassword) {
        showMainApp();
        resetInactivityTimer();
    } else {
        showPopup('Incorrect password. Please try again.');
    }
}

// Function to show admin login prompt
function showAdminLogin() {
    const enteredPassword = prompt("Enter Admin Password:");
    if (enteredPassword === adminPassword) {
        showPopup('Admin access granted!');
        showMainApp();
        // Add any admin-specific functionality here
    } else {
        showPopup('Incorrect admin password.');
    }
}

// Function to change admin password
function changeAdminPassword() {
    const newPassword = prompt("Enter new admin password:");
    if (newPassword && newPassword.length >= 16 && /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) && /[A-Z]/.test(newPassword)) {
        adminPassword = newPassword;
        localStorage.setItem('adminPassword', adminPassword);
        showPopup('Admin password changed successfully!');
    } else {
        showPopup("Password must be at least 16 characters long, contain a special character, and a capital letter!");
    }
}

// Function to show forgot password section
function showForgotPassword() {
    showSection('forgotPassword');
}

// Function to show create password section
function showCreatePassword() {
    showSection('createPassword');
}

// Function to create a new password
function createPassword() {
    const password1 = document.getElementById('newPassword1').value;
    const password2 = document.getElementById('newPassword2').value;
    const securityQuestion = document.getElementById('securityQuestion').value;
    const securityAnswer = document.getElementById('securityAnswer').value;
    
    if (password1 !== password2) {
        showPopup('Passwords do not match.');
        return;
    }
    
    if (!securityQuestion || !securityAnswer) {
        showPopup('Please select a security question and provide an answer.');
        return;
    }
    
    // Save the password and security info
    localStorage.setItem('masterPassword', password1);
    localStorage.setItem('securityQuestion', securityQuestion);
    localStorage.setItem('securityAnswer', securityAnswer);
    
    showPopup('Password created successfully!');
    isPasswordSet = true;
    showSection('signIn');
}

// Function to check the security answer
function checkSecurityAnswer() {
    const selectedQuestion = document.getElementById('securityQuestionCheck').value;
    const providedAnswer = document.getElementById('securityAnswerCheck').value;
    
    const storedQuestion = localStorage.getItem('securityQuestion');
    const storedAnswer = localStorage.getItem('securityAnswer');
    
    if (selectedQuestion === storedQuestion && providedAnswer.toLowerCase() === storedAnswer.toLowerCase()) {
        showSection('createPassword');
    } else {
        showPopup('Incorrect answer. Please try again.');
    }
}

// Function to add a new sensor
function addSensor() {
    const number = document.getElementById('sensorNumber').value;
    const type = document.getElementById('sensorType').value;
    const delay = document.getElementById('delayTime').value;

    if (!number || !type || !delay) {
        showPopup("Please fill in all fields!");
        return;
    }

    const sensor = { number, type, delay };
    sensors.push(sensor);
    updateSensorList();
    resetInactivityTimer(); // Reset timer on user action
}

// Function to update the list of sensors displayed on the page
function updateSensorList() {
    const sensorList = document.getElementById('sensors');
    sensorList.innerHTML = '';
    sensors.forEach(sensor => {
        const li = document.createElement('li');
        li.textContent = `Sensor ${sensor.number}: ${sensor.type} (Delay: ${sensor.delay}s)`;
        sensorList.appendChild(li);
    });
}

// Function to simulate an alarm
function simulateAlarm() {
    if (sensors.length === 0) {
        showPopup("No sensors configured!");
        return;
    }

    const randomSensor = sensors[Math.floor(Math.random() * sensors.length)];
    const alarmInfo = document.getElementById('alarmInfo');
    alarmInfo.textContent = `ALARM: ${randomSensor.type.toUpperCase()} detected by Sensor ${randomSensor.number}!`;

    console.log(`Alarm information sent: ${randomSensor.type} alarm from Sensor ${randomSensor.number}`);
    resetInactivityTimer(); // Reset timer on user action
}

// Function to reset the inactivity timer
function resetInactivityTimer() {
    if (isPasswordSet) {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(lockScreen, inactivityTimeout);
    }
}

// Function to lock the screen
function lockScreen() {
    showSection('passwordReentry');
}

// Function to unlock the screen
function unlockScreen() {
    const reenteredPassword = document.getElementById('reentryPassword').value;
    const storedPassword = localStorage.getItem('masterPassword');
    
    if (reenteredPassword === storedPassword) {
        showMainApp();
        resetInactivityTimer();
    } else {
        showPopup('Incorrect password. Please try again.');
    }
}

// Function to show pop-up message
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

// Function to log out
function signOut() {
    showSection('signIn');
    document.getElementById('signInPassword').value = '';
    isPasswordSet = false;
    clearTimeout(inactivityTimer);
}

// Event listeners to reset the timer on user activity
document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('keypress', resetInactivityTimer);

// Initialize when the page loads
window.onload = function() {
    // Load admin password from local storage if it exists
    const storedAdminPassword = localStorage.getItem('adminPassword');
    if (storedAdminPassword) {
        adminPassword = storedAdminPassword;
    }

    // Check if master password is already set
    if (localStorage.getItem('masterPassword')) {
        isPasswordSet = true;
        showSection('signIn');
    } else {
        showSection('createPassword');
    }
};