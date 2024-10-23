let users = [];

function loadUsers() {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    } else {
        // Create a default admin user if no users exist
        users = [{
            username: 'admin',
            password: 'Launchpad101@',
            securityQuestion: 'What is the default admin username?',
            securityAnswer: 'admin',
            isAdmin: true
        }];
        saveUsers();
    }
}

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

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

    if (users.some(user => user.username === username)) {
        showPopup('Username already exists. Please choose a different one.');
        return;
    }

    const newUser = {
        username,
        password: password1,
        securityQuestion,
        securityAnswer,
        isAdmin: false
    };

    users.push(newUser);
    saveUsers();
    showPopup('Account created successfully!');
    showSection('signIn');
}