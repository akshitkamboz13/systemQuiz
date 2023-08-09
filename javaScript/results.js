const resultsContainer = document.getElementById('results');

// Retrieve quiz data from local storage
const quizData = JSON.parse(localStorage.getItem('quizData'));

if (quizData) {
    displayResults(quizData);
} else {
    resultsContainer.innerHTML = '<p>No quiz data found.</p>';
}

function displayResults(quizData) {
    const totalQuestions = quizData.length;
    let correctAnswers = 0;

    quizData.forEach(question => {
        if (question.isCorrect) {
            correctAnswers++;
        }
    });

    const scorePercentage = (correctAnswers / totalQuestions) * 100;
    const scoreText = `You answered ${correctAnswers} out of ${totalQuestions} questions correctly (${scorePercentage.toFixed(2)}%).`;

    resultsContainer.innerHTML = `
        <p class="result_p">${scoreText}</p>
        <button id="start-quiz-again">Start Quiz Again</button>
    `;

    const startQuizAgainButton = document.getElementById('start-quiz-again');
    startQuizAgainButton.addEventListener('click', function() {
        localStorage.removeItem('quizData');
        window.location.href = '../index.html'; // Redirect to the quiz start page
    });
}
