/**
 * auth.js
 * Frontend wrapper for backend authentication API calls.
 */

const API_URL = 'http://localhost:5000/api/auth';

export const authAPI = {
    async signup(username, email, password) {
        const res = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Signup failed');
        return data;
    },

    async login(email, password) {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        
        // Save token and user
        localStorage.setItem('edu_token', data.token);
        localStorage.setItem('edu_user', JSON.stringify(data.user));
        return data;
    },

    async getProfile() {
        const token = localStorage.getItem('edu_token');
        if (!token) return null;

        const res = await fetch(`${API_URL}/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
            this.logout();
            return null;
        }
        return await res.json();
    },

    logout() {
        localStorage.removeItem('edu_token');
        localStorage.removeItem('edu_user');
        window.location.reload();
    }
};
