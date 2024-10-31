// admin.js

let users = JSON.parse(localStorage.getItem('users')) || [];

function loadAdminData() {
    const adminData = JSON.parse(localStorage.getItem('admin')) || {
        username: 'Admin',
        email: 'admin@dynastydefense.com'
    };

    document.getElementById('admin-username').textContent = adminData.username;
    document.getElementById('admin-email').textContent = adminData.email;
}

function updateUserList() {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';

    users.forEach((user, index) => {
        const userItem = document.createElement('div');
        userItem.className = 'user-item';
        userItem.innerHTML = `
            <span>${user.username} (${user.role})</span>
            <div>
                <button onclick="editUser(${index})" class="btn-secondary">Edit</button>
                <button onclick="deleteUser(${index})" class="btn-danger">Delete</button>
            </div>
        `;
        userList.appendChild(userItem);
    });
}

document.getElementById('add-user-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('new-username').value;
    const email = document.getElementById('new-email').value;
    const password = document.getElementById('new-password').value;
    const role = document.getElementById('user-role').value;

    users.push({ username, email, password, role });
    localStorage.setItem('users', JSON.stringify(users));
    updateUserList();
    e.target.reset();
});

function editUser(index) {
    const user = users[index];
    const newUsername = prompt('Enter new username:', user.username);
    const newEmail = prompt('Enter new email:', user.email);
    const newRole = prompt('Enter new role (user/admin):', user.role);

    if (newUsername && newEmail && newRole) {
        users[index] = { ...user, username: newUsername, email: newEmail, role: newRole };
        localStorage.setItem('users', JSON.stringify(users));
        updateUserList();
    }
}

function deleteUser(index) {
    if (confirm('Are you sure you want to delete this user?')) {
        users.splice(index, 1);
        localStorage.setItem('users', JSON.stringify(users));
        updateUserList();
    }
}

document.getElementById('changeAdminPassword').addEventListener('click', () => {
    const newPassword = prompt('Enter new admin password:');
    if (newPassword) {
        const admin = JSON.parse(localStorage.getItem('admin')) || {};
        admin.password = newPassword;
        localStorage.setItem('admin', JSON.stringify(admin));
        alert('Admin password changed successfully!');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadAdminData();
    updateUserList();
});