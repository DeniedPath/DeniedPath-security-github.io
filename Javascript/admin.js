function updateUserList() {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.username} (${user.isAdmin ? 'Admin' : 'User'})`;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteUser(user.username);
        li.appendChild(deleteButton);
        userList.appendChild(li);
    });
}

function deleteUser(username) {
    if (confirm(`Are you sure you want to delete user ${username}?`)) {
        users = users.filter(user => user.username !== username);
        saveUsers();
        updateUserList();
        showPopup(`User ${username} deleted successfully.`);
    }
}

function updateAdminLogs() {
    // This is a placeholder. In a real application, you would fetch logs from a server.
    const logs = [
        'Admin logged in - ' + new Date().toLocaleString(),
        'User account created - ' + new Date().toLocaleString(),
        'Sensor added - ' + new Date().toLocaleString()
    ];
    
    const logList = document.getElementById('logList');
    logList.innerHTML = '';
    logs.forEach(log => {
        const li = document.createElement('li');
        li.textContent = log;
        logList.appendChild(li);
    });
}

function showAdminDashboard() {
    showSection('adminDashboard');
    updateUserList();
    updateAdminLogs();
}