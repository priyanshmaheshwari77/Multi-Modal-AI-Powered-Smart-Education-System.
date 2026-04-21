# Multimodal Education Creator

**Multimodal Education Creator** is an advanced AI-powered educational platform designed to transform any topic into a comprehensive, multi-layered learning experience. Built for both students and educators, this platform simplifies complex subjects through dynamic visuals, structured notes, and interactive interactions.

## ✨ Key Features

1. **AI-Powered Multimodal Generation**: 
   - Simply input a topic, and the AI generates structured, multi-faceted content.
   - Includes an **8-Step Learning Path**: Concept Explanation, Real-life Examples, Structured Notes, Key Definitions, Interactive Flashcards, Comprehensive Quiz (8 questions), and scalable Difficulty Levels (Beginner to Advanced).

2. **Automated Educational Visuals**:
   - The platform automatically generates high-quality, textbook-style diagrams for every topic.
   - Utilizes `image.pollinations.ai` for lightning-fast image generation, complete with a robust 2-step fallback system (LoremFlickr & placeholders) to ensure a seamless UI experience without infinite loading.

3. **Premium Modern UI/UX**:
   - **Glassmorphism Design**: Features a sleek, futuristic dark theme with translucent, blurred elements.
   - **Animated UI**: An animated, vibrant mesh gradient background and glowing orbs create an immersive, dynamic environment.

4. **Secure Authentication Architecture**:
   - Dedicated, isolated pages for **Login** and **Signup**.
   - **JWT (JSON Web Token)** based security ensuring private, authenticated access to the dashboard.
   - Complete with user profile displays and secure logout capabilities.

5. **Smart History & Persistence**:
   - Previous topic searches are automatically cached and saved to a "Recent Topics" sidebar.
   - Includes seamless state management with a one-click deletion feature to easily manage search history.

## 🛠️ Technology Stack

*   **Frontend**: HTML5, Vanilla JavaScript, CSS3 (Modern Glassmorphism & Animations), Vite.
*   **Backend**: Node.js, Express.js.
*   **Database**: JSON-based local storage (Lightweight server-side persistence).
*   **Security**: bcryptjs (password hashing), jsonwebtoken (JWT).
*   **AI Integration**: 
    - Text Generation capabilities (ready for full LLM integration).
    - Image Generation via Pollinations.ai.

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start the Backend Server** (Port 5000):
   ```bash
   node server/server.js
   ```
3. **Start the Frontend Vite Server** (Port 5173):
   ```bash
   npm run dev
   ```
4. **Access the Application**:
   Navigate to `http://localhost:5173/` in your browser. You will be prompted to sign up or log in before accessing the dashboard.
