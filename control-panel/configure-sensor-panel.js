// configure-sensor-panel.js

let floors = JSON.parse(localStorage.getItem('floors')) || [];

document.addEventListener('DOMContentLoaded', function() {
    updateFloorList();
    attachEventListeners();
});

function attachEventListeners() {
    document.getElementById('add-floor-button').addEventListener('click', addFloor);
    document.getElementById('add-sensor-button').addEventListener('click', addSensor);
}

function addFloor() {
    const floorInput = document.getElementById('floor-input');
    const floorName = floorInput.value.trim();

    if (floorName) {
        floors.push({ name: floorName, sensors: { fire: [], heat: [], smoke: [] } });
        floorInput.value = '';
        updateFloorList();
        saveFloors();
    }
}

function updateFloorList() {
    const floorList = document.getElementById('floor-list');
    floorList.innerHTML = '';

    floors.forEach((floor, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = floor.name;
        
        listItem.addEventListener('click', () => {
            document.getElementById('selected-floor').textContent = floor.name;
            updateSensorList(floor.sensors);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('btn-danger');
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteFloor(index);
        });

        listItem.appendChild(deleteButton);
        floorList.appendChild(listItem);
    });
}

function deleteFloor(index) {
    floors.splice(index, 1);
    updateFloorList();
    document.getElementById('sensor-list').innerHTML = '';
    document.getElementById('selected-floor').textContent = 'Select a Floor';
    saveFloors();
}

function updateSensorList(sensors) {
    const sensorList = document.getElementById('sensor-list');
    sensorList.innerHTML = '';

    for (const [sensorType, sensorArray] of Object.entries(sensors)) {
        sensorArray.forEach(sensor => {
            const listItem = document.createElement('li');
            listItem.textContent = `${sensorType.charAt(0).toUpperCase() + sensorType.slice(1)}: ${sensor}`;
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('btn-danger');
            deleteButton.addEventListener('click', () => deleteSensor(sensorType, sensor));

            listItem.appendChild(deleteButton);
            sensorList.appendChild(listItem);
        });
    }
}

function addSensor() {
    const selectedFloorName = document.getElementById('selected-floor').textContent;
    const sensorInput = document.getElementById('sensor-input');
    const sensorName = sensorInput.value.trim();
    const sensorType = document.getElementById('sensor-type-selector').value;

    const floor = floors.find(f => f.name === selectedFloorName);
    
    if (floor && sensorName) {
        floor.sensors[sensorType].push(sensorName);
        sensorInput.value = '';
        updateSensorList(floor.sensors);
        saveFloors();
    } else {
        showPopup("Please select a floor and enter a sensor name.");
    }
}

function deleteSensor(sensorType, sensorName) {
    const selectedFloorName = document.getElementById('selected-floor').textContent;
    const floor = floors.find(f => f.name === selectedFloorName);

    if (floor) {
        const index = floor.sensors[sensorType].indexOf(sensorName);
        if (index !== -1) {
            floor.sensors[sensorType].splice(index, 1);
            updateSensorList(floor.sensors);
            saveFloors();
        }
    }
}

function saveFloors() {
    localStorage.setItem('floors', JSON.stringify(floors));
}

function showPopup(message) {
    // Check if window.showPopup exists and is not this function
    if (typeof window.showPopup === 'function' && window.showPopup !== showPopup) {
        window.showPopup(message);
    } else {
        // Fallback to alert if window.showPopup is not available or is this function
        alert(message);
    }
}