const quizData = [
    {
        question: "Which is a secure way to manage passwords?",
        options: [
            "Use the same password everywhere",
            "Use a password manager",
            "Write them on sticky notes"
        ],
        answer: 1,
        feedback: "Password managers generate and store unique passwords for every site."
    },
    {
        question: "What does HTTPS provide?",
        options: [
            "It speeds up your internet",
            "Encrypted communication between you and the website",
            "Better search results"
        ],
        answer: 1,
        feedback: "HTTPS encrypts data, protecting it from eavesdroppers."
    },
    {
        question: "Which of the following reduces online tracking?",
        options: [
            "Accepting all cookies",
            "Using private browsing and tracker blockers",
            "Sharing your location with every website"
        ],
        answer: 1,
        feedback: "Private browsing and tracker blockers limit the data companies can collect."
    }
];

let currentQuestion = 0;
let score = 0;

function showQuestion() {
    const q = quizData[currentQuestion];
    const container = document.getElementById('quizContent');
    container.innerHTML = `
        <div class="quiz-card fade-in">
            <h3>${q.question}</h3>
            <form id="quizForm">
                ${q.options.map((opt, idx) => `
                    <label class="quiz-option">
                        <input type="radio" name="option" value="${idx}">
                        <span>${opt}</span>
                    </label>
                `).join('')}
                <button type="submit" class="submit-btn">submit</button>
            </form>
            <div id="feedback" class="feedback"></div>
        </div>`;
    document.getElementById('quizForm').addEventListener('submit', handleSubmit);
}

function handleSubmit(e) {
    e.preventDefault();
    const selected = document.querySelector('input[name="option"]:checked');
    if (!selected) return;
    const idx = parseInt(selected.value);
    const q = quizData[currentQuestion];
    const feedback = document.getElementById('feedback');
    if (idx === q.answer) {
        feedback.textContent = 'Correct! ' + q.feedback;
        feedback.className = 'feedback correct';
        score++;
    } else {
        feedback.textContent = 'Incorrect. ' + q.feedback;
        feedback.className = 'feedback incorrect';
    }
    document.querySelector('.submit-btn').disabled = true;
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < quizData.length) {
            showQuestion();
        } else {
            showResults();
        }
    }, 1000);
}

function showResults() {
    const container = document.getElementById('quizContent');
    const percent = Math.round((score / quizData.length) * 100);
    container.innerHTML = `
        <div class="quiz-card fade-in">
            <h3>Your privacy score: ${score}/${quizData.length}</h3>
            <p>${getMessage(percent)}</p>
            <p>Further reading:</p>
            <ul class="quiz-links">
                <li><a href="https://www.privacyguides.org/en/" target="_blank" class="inline-link">Privacy Guides</a></li>
                <li><a href="https://privacyactivistkit.org/" target="_blank" class="inline-link">Privacy Activist Kit</a></li>
            </ul>
        </div>`;
}

function getMessage(percent) {
    if (percent === 100) return 'Excellent! You\'re a privacy pro.';
    if (percent >= 60) return 'Good job! There\'s always more to learn.';
    return 'Consider exploring the resources below to improve your privacy.';
}

document.addEventListener('DOMContentLoaded', () => {
    const quizTab = document.getElementById('quizTab');
    const resourcesTab = document.getElementById('resourcesTab');
    const quizSection = document.getElementById('quizSection');
    const resourcesSection = document.getElementById('resourcesSection');

    if (quizTab && resourcesTab) {
        quizTab.addEventListener('click', () => {
            quizTab.classList.add('active');
            resourcesTab.classList.remove('active');
            resourcesSection.style.display = 'none';
            quizSection.style.display = 'block';
            showQuestion();
        });

        resourcesTab.addEventListener('click', () => {
            resourcesTab.classList.add('active');
            quizTab.classList.remove('active');
            quizSection.style.display = 'none';
            resourcesSection.style.display = 'block';
        });
    }
});
