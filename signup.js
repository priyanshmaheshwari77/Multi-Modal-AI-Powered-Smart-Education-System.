import { authAPI } from './auth.js';

const signupForm = document.getElementById('signup-form');
const signupUsername = document.getElementById('signup-username');
const signupEmail = document.getElementById('signup-email');
const signupPassword = document.getElementById('signup-password');
const signupSubmit = document.getElementById('signup-submit');
const authError = document.getElementById('auth-error');

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    authError.classList.add('hidden');
    signupSubmit.disabled = true;
    signupSubmit.innerText = 'Creating account...';

    try {
        await authAPI.signup(signupUsername.value, signupEmail.value, signupPassword.value);
        // On success, redirect to login with a message
        window.location.href = './login.html?signup=success';
    } catch (err) {
        authError.innerText = err.message;
        authError.classList.remove('hidden');
        signupSubmit.disabled = false;
        signupSubmit.innerText = 'Sign Up';
    }
});
