let masterPassword = '';
let sensors = [];

function setMasterPassword() {
    const password1 = document.getElementById('password1').value;
    const password2 = document.getElementById('password2').value;
    const message = document.getElementById('passwordMessage');

    if (password1 !== password2) {
        message.textContent = "Passwords do not match!";
        return;
    }

    if (password1.length !== 16 || !/[!@#$%^&*(),.?":{}|<>]/.test(password1) || !/[A-Z]/.test(password1)) {
        message.textContent = "Password must be 16 characters long, contain a special character, and a capital letter!";
        return;
    }

    masterPassword = password1;
    localStorage.setItem('masterPassword', masterPassword);
    message.textContent = "Password set successfully!";

    document.getElementById('passwordSetup').style.display = 'none';
    document.getElementById('sensorConfig').style.display = 'block';
    document.getElementById('sensorList').style.display = 'block';
    document.getElementById('alarmSimulation').style.display = 'block';
}

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
}

function updateSensorList() {
    const sensorList = document.getElementById('sensors');
    sensorList.innerHTML = '';
    sensors.forEach(sensor => {
        const li = document.createElement('li');
        li.textContent = `Sensor ${sensor.number}: ${sensor.type} (Delay: ${sensor.delay}s)`;
        sensorList.appendChild(li);
    });
}

function simulateAlarm() {
    if (sensors.length === 0) {
        alert("No sensors configured!");
        return;
    }

    const randomSensor = sensors[Math.floor(Math.random() * sensors.length)];
    const alarmInfo = document.getElementById('alarmInfo');
    alarmInfo.textContent = `ALARM: ${randomSensor.type.toUpperCase()} detected by Sensor ${randomSensor.number}!`;

    // Simulating sending alarm info via chat
    console.log(`Alarm information sent: ${randomSensor.type} alarm from Sensor ${randomSensor.number}`);
}

// Check if master password is already set
if (localStorage.getItem('masterPassword')) {
    document.getElementById('passwordSetup').style.display = 'none';
    document.getElementById('sensorConfig').style.display = 'block';
    document.getElementById('sensorList').style.display = 'block';
    document.getElementById('alarmSimulation').style.display = 'block';
}