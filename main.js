import { generateContent } from './generator.js';
import { authAPI } from './auth.js';

// DOM Elements
const userProfile = document.getElementById('user-profile');
const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');
const logoutBtn = document.getElementById('logout-btn');

const topicInput = document.getElementById('topic-input');
const generateBtn = document.getElementById('generate-btn');
const welcomeArea = document.getElementById('welcome-area');
const resultsArea = document.getElementById('results-area');
const loading = document.getElementById('loading');
const contentDisplay = document.getElementById('content-display');
const historyList = document.getElementById('history-list');
const newBtn = document.getElementById('new-btn');
const suggestBtns = document.querySelectorAll('.suggest-btn');

// State
let history = JSON.parse(localStorage.getItem('edu_history')) || [];
let contentCache = JSON.parse(localStorage.getItem('edu_content_cache')) || {};

// Functions
const handleGenerate = async (topic) => {
    if (!topic) return;

    welcomeArea.classList.add('hidden');
    resultsArea.classList.remove('hidden');
    contentDisplay.innerHTML = '';
    loading.classList.remove('hidden');

    try {
        const content = await generateContent(topic);
        loading.classList.add('hidden');
        renderContent(content);
        addToHistory(topic, content);
    } catch (error) {
        console.error("Generation failed", error);
        loading.innerHTML = '<p style="color: #ef4444;">Failed to generate content. Please try again.</p>';
    }
};

const renderContent = (data) => {
    contentDisplay.innerHTML = `
        <!-- Title Section -->
        <div class="content-card title-card">
            <span class="card-label">Topic Overview</span>
            <h2>Exploring ${data.topic}</h2>
        </div>

        <!-- Automated Image Display -->
        <div class="content-card full-width-card">
            <span class="card-label">✨ AI Generated Visual</span>
            <div class="image-wrapper">
                <img src="https://image.pollinations.ai/prompt/${encodeURIComponent(data.imagePrompt)}?width=512&height=512&nologo=true" 
                     alt="${data.topic}" 
                     class="generated-img" 
                     onload="handleImageLoad(this)"
                     onerror="handleImageError(this, '${data.topic.replace(/'/g, "\\'")}')">
                <div class="image-skeleton">
                    <div class="skeleton-shimmer"></div>
                    <p>Generating high-quality visual for ${data.topic}...</p>
                </div>
            </div>
        </div>

        <!-- Explanation Section -->
        <div class="content-card">
            <span class="card-label">📘 Concept Explanation</span>
            <div class="concept-text">
                <p>${data.conceptExplanation.explanation}</p>
                <div class="real-life-example">
                    <strong>Real-life Example:</strong> ${data.conceptExplanation.realLifeExample}
                </div>
            </div>
        </div>

        <!-- Notes Section -->
        <div class="content-card">
            <span class="card-label">🧠 Structured Notes</span>
            <ul class="note-list">
                ${data.structuredNotes.bulletPoints.map(p => `<li>${p}</li>`).join('')}
            </ul>
            <div style="margin-top: 1.5rem;">
                <strong>Key Definitions:</strong>
                <ul style="list-style: none; margin-top: 0.5rem;">
                    ${data.structuredNotes.keyDefinitions.map(d => `
                        <li style="margin-bottom: 0.5rem;"><span class="definition">${d.term}:</span> ${d.definition}</li>
                    `).join('')}
                </ul>
            </div>
            ${data.structuredNotes.formulas && data.structuredNotes.formulas.length > 0 ? `
                <div style="margin-top: 1.5rem;">
                    <strong>Formulas:</strong>
                    <div style="font-family: monospace; background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px; margin-top: 0.5rem; color: var(--accent);">
                        ${data.structuredNotes.formulas.join('<br>')}
                    </div>
                </div>
            ` : ''}
        </div>

        <!-- Flashcards Section -->
        <div class="content-card" style="background: transparent; border: none; padding: 0; box-shadow: none;">
            <span class="card-label">🎯 Flashcards</span>
            <div class="flashcards-grid">
                ${data.flashcards.map((card, idx) => `
                    <div class="flashcard" onclick="this.classList.toggle('flipped')">
                        <div class="flashcard-inner">
                            <div class="flashcard-front">
                                <p>${card.q}</p>
                            </div>
                            <div class="flashcard-back">
                                <p>${card.a}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Image & Visualization Section -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
            <div class="content-card">
                <span class="card-label">🖼️ Image Generation Prompt</span>
                <div class="prompt-box">
                    <button class="copy-btn" onclick="navigator.clipboard.writeText('${data.imagePrompt.replace(/'/g, "\\'")}'); this.innerText='Copied!'">Copy</button>
                    ${data.imagePrompt}
                </div>
                <div class="generation-steps">
                    <strong>Steps to Generate:</strong>
                    <ul>
                        ${data.imageGenerationSteps.map(step => `<li>${step}</li>`).join('')}
                    </ul>
                </div>
            </div>
            <div class="content-card">
                <span class="card-label">📊 Visualization Suggestion</span>
                <p style="color: #cbd5e1; line-height: 1.6;">${data.visualizationSuggestion}</p>
            </div>
        </div>

        <!-- Quiz Section -->
        <div class="content-card">
            <span class="card-label">🎓 Quiz Questions</span>
            <div class="quiz-container">
                ${data.quiz.map((q, idx) => `
                    <div class="quiz-item" id="q-${idx}">
                        <p><strong>${idx + 1}. ${q.q}</strong></p>
                        <div class="quiz-options">
                            ${q.options.map((opt, optIdx) => `
                                <div class="quiz-option" data-is-correct="${optIdx === q.correct}" onclick="checkAnswer(this, ${optIdx === q.correct})">${opt}</div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Difficulty Levels -->
        <div class="content-card">
            <span class="card-label">🧩 Difficulty Levels</span>
            <div class="diff-container">
                <div class="diff-level" onclick="this.classList.toggle('active')">
                    <div class="diff-header">Beginner <span>+</span></div>
                    <div class="diff-content"><p>${data.difficultyLevels.beginner}</p></div>
                </div>
                <div class="diff-level" onclick="this.classList.toggle('active')">
                    <div class="diff-header">Intermediate <span>+</span></div>
                    <div class="diff-content"><p>${data.difficultyLevels.intermediate}</p></div>
                </div>
                <div class="diff-level" onclick="this.classList.toggle('active')">
                    <div class="diff-header">Advanced <span>+</span></div>
                    <div class="diff-content"><p>${data.difficultyLevels.advanced}</p></div>
                </div>
            </div>
        </div>
    `;
};

window.handleImageLoad = (img) => {
    img.parentElement.classList.add('loaded');
};

window.handleImageError = (img, topic) => {
    // Stage 1 Fallback: Try LoremFlickr for a realistic image
    if (!img.dataset.fallbackLevel) {
        img.dataset.fallbackLevel = "1";
        img.src = `https://loremflickr.com/512/512/${encodeURIComponent(topic)}`;
    } 
    // Stage 2 Fallback: If everything fails, use a clean placeholder so it doesn't spin forever
    else {
        img.src = `https://placehold.co/512x512/1e293b/22d3ee/png?text=${encodeURIComponent(topic)}`;
        img.onerror = null; // Prevent infinite loops
        img.parentElement.classList.add('loaded'); // Hide the loading skeleton
    }
};

window.checkAnswer = (el, isCorrect) => {
    const parent = el.parentElement;
    const options = parent.querySelectorAll('.quiz-option');
    options.forEach(opt => opt.style.pointerEvents = 'none');
    
    if (isCorrect) {
        el.classList.add('correct');
    } else {
        el.classList.add('incorrect');
        // Highlight the correct answer since the user got it wrong
        const correctOpt = parent.querySelector('[data-is-correct="true"]');
        if (correctOpt) {
            correctOpt.classList.add('correct');
        }
    }
};

const addToHistory = (topic, content) => {
    if (!history.includes(topic)) history.unshift(topic);
    contentCache[topic] = content;
    localStorage.setItem('edu_history', JSON.stringify(history));
    localStorage.setItem('edu_content_cache', JSON.stringify(contentCache));
    renderHistory();
};

const renderHistory = () => {
    historyList.innerHTML = history.map(topic => `
        <li class="history-item" onclick="loadCachedTopic('${topic.replace(/'/g, "\\'")}')">
            <span class="topic-name">${topic}</span>
            <button class="remove-topic-btn" onclick="removeTopic(event, '${topic.replace(/'/g, "\\'")}')" title="Remove topic">×</button>
        </li>
    `).join('');
};

window.removeTopic = (event, topic) => {
    event.stopPropagation();
    
    // Remove from state
    history = history.filter(t => t !== topic);
    delete contentCache[topic];
    
    // Update storage
    localStorage.setItem('edu_history', JSON.stringify(history));
    localStorage.setItem('edu_content_cache', JSON.stringify(contentCache));
    
    renderHistory();
};

window.loadCachedTopic = (topic) => {
    const content = contentCache[topic];
    if (content) {
        welcomeArea.classList.add('hidden');
        resultsArea.classList.remove('hidden');
        renderContent(content);
        topicInput.value = topic;
    }
};

const checkAuthState = async () => {
    const user = await authAPI.getProfile();
    if (user) {
        profileName.innerText = user.username;
        profileEmail.innerText = user.email;
        renderHistory();
    } else {
        window.location.href = './login.html';
    }
};

// Event Listeners
generateBtn.addEventListener('click', () => {
    const topic = topicInput.value.trim();
    if (topic) handleGenerate(topic);
});

topicInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') generateBtn.click();
});

newBtn.addEventListener('click', () => {
    topicInput.value = '';
    welcomeArea.classList.remove('hidden');
    resultsArea.classList.add('hidden');
});

suggestBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        topicInput.value = btn.innerText;
        handleGenerate(btn.innerText);
    });
});

logoutBtn.addEventListener('click', () => authAPI.logout());

// Initial Load
checkAuthState();
