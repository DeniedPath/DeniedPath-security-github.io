// Global variables
let masterPassword = '';
let sensors = [];
const inactivityTimeout = 1 * 60 * 1000; // 1 minute in milliseconds
let inactivityTimer;

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

    document.getElementById('passwordSetup').style.display = 'none';
    document.getElementById('sensorConfig').style.display = 'block';
    document.getElementById('sensorList').style.display = 'block';
    document.getElementById('alarmSimulation').style.display = 'block';

    resetInactivityTimer(); // Start the inactivity timer
}

// Function to add a new sensor
function addSensor() {
    const number = document.getElementById('sensorNumber').value;
    const type = document.getElementById('sensorType').value;
    const delay = document.getElementById('delayTime').value;

    if (!number || !type || !delay) {
        alert("Please fill in all fields!");
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
        alert("No sensors configured!");
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
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(lockScreen, inactivityTimeout);
}

// Function to lock the screen
function lockScreen() {
    document.getElementById('sensorConfig').style.display = 'none';
    document.getElementById('sensorList').style.display = 'none';
    document.getElementById('alarmSimulation').style.display = 'none';
    
    const passwordReentry = document.getElementById('passwordReentry');
    if (!passwordReentry) {
        const reentryDiv = document.createElement('div');
        reentryDiv.id = 'passwordReentry';
        reentryDiv.innerHTML = `
            <h2>Session Locked</h2>
            <input type="password" id="reentryPassword" placeholder="Re-enter password">
            <button onclick="unlockScreen()">Unlock</button>
        `;
        document.querySelector('.container').appendChild(reentryDiv);
    } else {
        passwordReentry.style.display = 'block';
    }
}

// Function to unlock the screen
function unlockScreen() {
    const reenteredPassword = document.getElementById('reentryPassword').value;
    const storedPassword = localStorage.getItem('masterPassword');
    
    if (reenteredPassword === storedPassword) {
        document.getElementById('passwordReentry').style.display = 'none';
        document.getElementById('sensorConfig').style.display = 'block';
        document.getElementById('sensorList').style.display = 'block';
        document.getElementById('alarmSimulation').style.display = 'block';
        resetInactivityTimer();
    } else {
        alert('Incorrect password. Please try again.');
    }
}

// Event listeners to reset the timer on user activity
document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('keypress', resetInactivityTimer);

// Check if master password is already set when the page loads
if (localStorage.getItem('masterPassword')) {
    document.getElementById('passwordSetup').style.display = 'none';
    document.getElementById('sensorConfig').style.display = 'block';
    document.getElementById('sensorList').style.display = 'block';
    document.getElementById('alarmSimulation').style.display = 'block';
    resetInactivityTimer(); // Start the inactivity timer
}