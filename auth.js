function togglePassword(id) {
    const input = document.getElementById(id);
    input.type = input.type === 'password' ? 'text' : 'password';
}

// Register
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirm = document.getElementById('regConfirm').value;
        
        document.querySelectorAll('.error').forEach(e => e.textContent = '');
        
        let valid = true;
        
        if (name.length < 3) {
            document.getElementById('regNameError').textContent = 'Name must be at least 3 characters';
            valid = false;
        }
        
        if (!email.includes('@')) {
            document.getElementById('regEmailError').textContent = 'Enter valid email';
            valid = false;
        }
        
        if (password.length < 6) {
            document.getElementById('regPasswordError').textContent = 'Password must be at least 6 characters';
            valid = false;
        }
        
        if (password !== confirm) {
            document.getElementById('regConfirmError').textContent = 'Passwords do not match';
            valid = false;
        }
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.find(u => u.email === email)) {
            document.getElementById('regEmailError').textContent = 'Email already exists';
            valid = false;
        }
        
        if (!valid) return;
        
        users.push({ name, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('Registration successful! Please login.');
        window.location.href = 'login.html';
    });
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        document.querySelectorAll('.error').forEach(e => e.textContent = '');
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            document.getElementById('loginPasswordError').textContent = 'Invalid email or password';
            return;
        }
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'shop.html';
    });
}
