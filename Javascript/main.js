// Global variables
let currentUser = null;
let users = [];
let sensors = [];
const inactivityTimeout = 1 * 60 * 1000; // 1 minute in milliseconds
let inactivityTimer;

// Function to show only one section and hide others
function showSection(sectionId) {
    const sections = ['signIn', 'createAccount', 'forgotPassword', 'userDashboard', 'adminDashboard', 'passwordReentry'];
    sections.forEach(section => {
        document.getElementById(section).style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Function to handle user login
function signIn() {
    const username = document.getElementById('signInUsername').value;
    const password = document.getElementById('signInPassword').value;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        if (user.isAdmin) {
            showAdminDashboard();
        } else {
            showUserDashboard();
        }
        resetInactivityTimer();
    } else {
        showPopup('Incorrect username or password. Please try again.');
    }
}

// Function to show admin login prompt
function showAdminLogin() {
    const enteredPassword = prompt("Enter Admin Password:");
    const adminUser = users.find(u => u.isAdmin && u.password === enteredPassword);
    
    if (adminUser) {
        currentUser = adminUser;
        showAdminDashboard();
    } else {
        showPopup('Incorrect admin password.');
    }
}

// Function to show forgot password section
function showForgotPassword() {
    showSection('forgotPassword');
}

// Function to show create account section
function showCreateAccount() {
    showSection('createAccount');
}

// Function to create a new account
function createAccount() {
    const username = document.getElementById('newUsername').value;
    const password1 = document.getElementById('newPassword1').value;
    const password2 = document.getElementById('newPassword2').value;
    const securityQuestion = document.getElementById('securityQuestion').value;
    const securityAnswer = document.getElementById('securityAnswer').value;

    if (password1 !== password2) {
        showPopup('Passwords do not match.');
        return;
    }

    if (!username || !password1 || !securityQuestion || !securityAnswer) {
        showPopup('Please fill in all fields.');
        return;
    }

    if (users.some(u => u.username === username)) {
        showPopup('Username already exists. Please choose a different one.');
        return;
    }

    const newUser = {
        username: username,
        password: password1,
        securityQuestion: securityQuestion,
        securityAnswer: securityAnswer,
        isAdmin: false
    };

    users.push(newUser);
    saveUsers();

    showPopup('Account created successfully!');
    showSection('signIn');
}

// Function to check the security answer
function checkSecurityAnswer() {
    const username = document.getElementById('forgotPasswordUsername').value;
    const selectedQuestion = document.getElementById('securityQuestionCheck').value;
    const providedAnswer = document.getElementById('securityAnswerCheck').value;

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

    const user = users.find(u => u.username === username);
    
    if (user) {
      user.password = newPassword;
      saveUsers();
      showPopup('Password reset successfully!');
      showSection('signIn');
   }
}

// Function to add a new sensor
function addSensor() {
   const number = document.getElementById('sensorNumber').value;
   const type = document.getElementById('sensorType').value;
   const building = document.getElementById('sensorBuilding').value;
   const floor = document.getElementById('sensorFloor').value;
   const room = document.getElementById('sensorRoom').value;
   const status = 'off'; // Default status is off
   const delay = document.getElementById('delayTime').value;

   if (!number || !type || !building || !floor || !room || !delay) {
       showPopup("Please fill in all fields!");
       return;
   }

   const sensor = { number, type, building, floor, room, status, delay };
   sensors.push(sensor);
   updateSensorList();
   resetInactivityTimer();
}

// Function to update the list of sensors displayed on the page
function updateSensorList() {
   const sensorList = document.getElementById('sensors');
   sensorList.innerHTML = '';
   sensors.forEach(sensor => {
       const li = document.createElement('li');
       li.textContent = `Sensor ${sensor.number}: ${sensor.type} (${sensor.status}) - Building: ${sensor.building}, Floor: ${sensor.floor}, Room: ${sensor.room} (Delay: ${sensor.delay}s)`;
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
   randomSensor.status = 'on';
   const alarmInfo = document.getElementById('alarmInfo');
   alarmInfo.textContent = `ALARM: ${randomSensor.type.toUpperCase()} detected by Sensor ${randomSensor.number} in Building: ${randomSensor.building}, Floor: ${randomSensor.floor}, Room: ${randomSensor.room}!`;

   console.log(`Alarm information sent: ${randomSensor.type} alarm from Sensor ${randomSensor.number}`);
   updateSensorList();
   resetInactivityTimer();
}

// Function to reset the inactivity timer
function resetInactivityTimer() {
   clearTimeout(inactivityTimer);
   inactivityTimer = setTimeout(lockScreen, inactivityTimeout);
}

// Function to lock the screen
function lockScreen() {
   showSection('passwordReentry');
}

// Function to unlock the screen
function unlockScreen() {
   const reenteredPassword = document.getElementById('reentryPassword').value;

   if (reenteredPassword === currentUser.password) {
       if (currentUser.isAdmin) {
           showAdminDashboard();
       } else {
           showUserDashboard();
       }
       resetInactivityTimer();
   } else {
       showPopup('Incorrect password. Please try again.');
   }
}

// Function to log out
function logout() {
   currentUser = null;
   showSection('signIn');
   document.getElementById('signInUsername').value = '';
   document.getElementById('signInPassword').value = '';
   clearTimeout(inactivityTimer);
}

// Function to save users to local storage
function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}

// Event listeners to reset the timer on user activity
document.addEventListener("mousemove", resetInactivityTimer);
document.addEventListener("keypress", resetInactivityTimer);

// Initialize when the page loads
window.onload = function () { 
  loadUsers(); 
  showSection("signIn"); 
};