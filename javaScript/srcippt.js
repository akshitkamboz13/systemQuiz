const quizContainer = document.querySelector('.quiz-container');
const startButton = document.getElementById('start-quiz');
const quizForm = document.getElementById('quiz-form');
const questionsContainer = document.getElementById('questions');
const amountInput = document.getElementById('amount');
const difficultyInput = document.getElementById('difficulty');
const typeInput = document.getElementById('type');
const categoryInput = document.getElementById('category');

let quizData = []; // Declare quizData globally

// Shuffle function to randomize array elements
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function fetchQuizData(amount, difficulty, category, type) {
    try {
        const validatedAmount = Math.min(amount, 50); // Ensure amount is less than or equal to 50
        const response = await fetch(`https://opentdb.com/api.php?amount=${validatedAmount}&category=${category}&difficulty=${difficulty}&type=${type}`);
        const data = await response.json();
        quizData = data.results.map(question => {
            question.answers = shuffleArray([...question.incorrect_answers, question.correct_answer]);
            return question;
        });
        displayQuestions(quizData);
    } catch (error) {
        console.error("Error fetching quiz data:", error);
    }
}

function displayQuestions(quizData) {
    quizForm.style.display = 'block';
    startButton.style.display = 'none';

    quizData.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.className = 'question';
        questionElement.innerHTML = `
            <p>${index + 1}. ${question.question}</p>
            <ul>
                ${question.answers.map(answer => `
                    <li>
                        <label>
                            <input type="radio" name="question-${index}" value="${answer}">
                            ${answer}
                        </label>
                    </li>
                `).join('')}
            </ul>
        `;
        questionsContainer.appendChild(questionElement);
    });
}

startButton.addEventListener('click', function() {
    const amount = amountInput.value;
    const difficulty = difficultyInput.value;
    const category = categoryInput.value;
    const type = typeInput.value;

    if (amount > 50) {
        alert("Maximum questions allowed is 50.");
        return;
    }

    fetchQuizData(amount, difficulty, category, type);
});

quizForm.addEventListener('submit', function(event) {
    event.preventDefault();

    if (!quizData.length) {
        console.error("Quiz data is not available.");
        return;
    }

    const submittedAnswers = document.querySelectorAll('.question input:checked');
    const quizResults = [];

    submittedAnswers.forEach((answer, index) => {
        const question = quizData[index];
        const userAnswer = answer.value;
        const isCorrect = userAnswer === question.correct_answer;
        quizResults.push({
            question: question.question,
            correct_answer: question.correct_answer,
            userAnswer: userAnswer,
            isCorrect: isCorrect
        });
    });

    localStorage.setItem('quizData', JSON.stringify(quizResults));
    window.location.href = 'results.html';
});
