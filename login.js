import { authAPI } from './auth.js';

const loginForm = document.getElementById('login-form');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginSubmit = document.getElementById('login-submit');
const authError = document.getElementById('auth-error');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    authError.classList.add('hidden');
    loginSubmit.disabled = true;
    loginSubmit.innerText = 'Logging in...';

    try {
        await authAPI.login(loginEmail.value, loginPassword.value);
        window.location.href = './index.html';
    } catch (err) {
        authError.innerText = err.message;
        authError.classList.remove('hidden');
        loginSubmit.disabled = false;
        loginSubmit.innerText = 'Login';
    }
});
