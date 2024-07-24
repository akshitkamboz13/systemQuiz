const startButton = document.getElementById('start-quiz');
const quizForm = document.getElementById('quiz-form');
const questionsContainer = document.getElementById('questions');
const amountInput = document.getElementById('amount');
const difficultyInput = document.getElementById('difficulty');
const typeInput = document.getElementById('type');
const categoryInput = document.getElementById('category');

let quizData = []; 

let timerInterval = 0; 
// let currentQuestionIndex = 0; 

// Shuffle function
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
        
        currentQuestionIndex = 0; 
        clearInterval(timerInterval); 
        const timeLimit = amount * 15 * 1000;

        // Start the timer
        startTimer(timeLimit);

        displayQuestions(quizData);
    } catch (error) {
        console.error("Error fetching quiz data:", error);
    }
}

function startTimer(timeLimit) {
    let timeRemaining = timeLimit;
    
    timerInterval = setInterval(() => {
        const minutes = Math.floor(timeRemaining / 60000);
        const seconds = Math.floor((timeRemaining % 60000) / 1000);

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            submitQuiz(); 
        }

        document.getElementById('timer-display').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        timeRemaining -= 1000; 
    }, 1000);
}

function displayQuestions(quizData) {
    quizForm.style.display = 'block';
    startButton.style.display = 'none';
    // document.getElementById('div-options').styles.display = 'none';

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

startButton.addEventListener('click', () => {
    document.getElementById('div-options').style.display = 'none';

    const amount = amountInput.value;
    const difficulty = difficultyInput.value;
    const category = categoryInput.value;
    const type = typeInput.value;

    if (amount > 50) {
        customAlert("Maximum questions allowed is 50.");

        function customAlert(message) {
            // Implement custom UI for alert
            console.log("Alert: " + message);
        }

        function customConfirm(message) {
            // Implement custom UI for confirm
            console.log("Confirm: " + message);
            // Placeholder for user response simulation
            return true; // or false based on user action
        }

        function customPrompt(question) {
            // Implement custom UI for prompt
            console.log("Prompt: " + question);
            // Placeholder for user response simulation
            return "User response"; // simulate user typing a response
        }
        return;
    }

    fetchQuizData(amount, difficulty, category, type);
});

quizForm.addEventListener('submit', (event) => {
    event.preventDefault();
    submitQuiz();
});

function submitQuiz() {
    clearInterval(timerInterval); 

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
            userAnswer,
            isCorrect: isCorrect
        });
    });

    localStorage.setItem('quizData', JSON.stringify(quizResults));
    window.location.href = './html/results.html';
}
