// sensor-control-panel.js

document.addEventListener('DOMContentLoaded', function() {
    loadBuildingName();
    populateFloorDropdown();
    attachEventListeners();
});

function loadBuildingName() {
    const savedBuildingName = localStorage.getItem('buildingName');
    if (savedBuildingName) {
        document.getElementById('building-name').value = savedBuildingName;
    }
}

function saveBuildingName() {
    const buildingName = document.getElementById('building-name').value.trim();
    localStorage.setItem('buildingName', buildingName);
}

function populateFloorDropdown() {
    const floors = JSON.parse(localStorage.getItem('floors')) || [];
    const floorSelector = document.getElementById('floor-selector');
    floorSelector.innerHTML = '<option>Select Floor</option>';
    floors.forEach((floor, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = floor.name;
        floorSelector.appendChild(option);
    });
}

function populateSensorDropdown(floorIndex) {
    const floors = JSON.parse(localStorage.getItem('floors')) || [];
    const selectedFloor = floors[floorIndex];
    const sensorSelector = document.getElementById('sensor-selector');
    sensorSelector.innerHTML = '<option>Select Sensor</option>';

    if (selectedFloor) {
        for (const [sensorType, sensors] of Object.entries(selectedFloor.sensors)) {
            sensors.forEach(sensor => {
                const option = document.createElement('option');
                option.value = `${sensorType}:${sensor}`;
                option.textContent = `${sensorType.charAt(0).toUpperCase() + sensorType.slice(1)}: ${sensor}`;
                sensorSelector.appendChild(option);
            });
        }
    }
}

function attachEventListeners() {
    document.getElementById('building-name').addEventListener('input', saveBuildingName);
    document.getElementById('floor-selector').addEventListener('change', function() {
        populateSensorDropdown(this.value);
    });
    document.querySelector('.turn-on').addEventListener('click', () => toggleSensor(true));
    document.querySelector('.turn-off').addEventListener('click', () => toggleSensor(false));
    document.getElementById('check-status-button').addEventListener('click', checkSensorStatus);
    document.getElementById('clear-logs-button').addEventListener('click', clearLogs);
}

function toggleSensor(turnOn) {
    const floorIndex = document.getElementById('floor-selector').value;
    const sensorValue = document.getElementById('sensor-selector').value;
    if (floorIndex === 'Select Floor' || !sensorValue) {
        showPopup('Please select both a floor and a sensor.');
        return;
    }

    const [sensorType, sensorName] = sensorValue.split(':');
    const floors = JSON.parse(localStorage.getItem('floors')) || [];
    const floor = floors[floorIndex];
    const sensorArray = floor.sensors[sensorType];
    const sensorIndex = sensorArray.indexOf(sensorName);

    if (turnOn && sensorIndex === -1) {
        sensorArray.push(sensorName);
        logAction(`${sensorType.charAt(0).toUpperCase() + sensorType.slice(1)} Sensor "${sensorName}" on Floor "${floor.name}" is now ON.`);
    } else if (!turnOn && sensorIndex !== -1) {
        sensorArray.splice(sensorIndex, 1);
        logAction(`${sensorType.charAt(0).toUpperCase() + sensorType.slice(1)} Sensor "${sensorName}" on Floor "${floor.name}" is now OFF.`);
    } else {
        showPopup(`Sensor is already ${turnOn ? 'ON' : 'OFF'}.`);
        return;
    }

    localStorage.setItem('floors', JSON.stringify(floors));
    showPopup(`Sensor ${turnOn ? 'activated' : 'deactivated'} successfully.`);
}

function checkSensorStatus() {
    const floors = JSON.parse(localStorage.getItem('floors')) || [];
    let statusMessage = '';

    floors.forEach(floor => {
        statusMessage += `Floor: ${floor.name}\n`;
        for (const [sensorType, sensors] of Object.entries(floor.sensors)) {
            statusMessage += `  ${sensorType.charAt(0).toUpperCase() + sensorType.slice(1)} Sensors: ${sensors.length > 0 ? 'ON' : 'OFF'}\n`;
        }
        statusMessage += '\n';
    });

    logAction(statusMessage);
}

function clearLogs() {
    document.getElementById('log-content').innerHTML = '<p>No recent logs available.</p>';
}

function logAction(message) {
    const logContent = document.getElementById('log-content');
    const logEntry = document.createElement('p');
    logEntry.textContent = `${new Date().toLocaleString()} - ${message}`;
    
    if (logContent.firstChild.textContent === 'No recent logs available.') {
        logContent.innerHTML = '';
    }
    
    logContent.insertBefore(logEntry, logContent.firstChild);
}

function showPopup(message) {
    // Assuming you have a modal or popup function in your main.js
    // If not, you can implement a simple alert here
    if (typeof window.showPopup === 'function') {
        window.showPopup(message);
    } else {
        alert(message);
    }
}