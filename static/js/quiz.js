/**
 * Quiz functionality for Aptify
 * Handles quiz initialization, question display, timer, and scoring
 */

// Quiz state variables
let questions = [];
let currentQuestion = 0;
let selectedAnswers = [];
let timer = 0;
let timerInterval;
let quizStartTime;
let quizType = 'mixed';
let username = '';
let questionCount = 10;
let apiRetries = 0;
let maxRetries = 3;

document.addEventListener('DOMContentLoaded', function() {
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    quizType = urlParams.get('type') || 'mixed';
    questionCount = parseInt(urlParams.get('count') || '10');
    
    // Validate question count
    if (questionCount < 10 || questionCount > 20) {
        questionCount = 10;
    }
    
    // Update quiz type display
    const quizTypeElement = document.getElementById('quizType');
    if (quizTypeElement) {
        quizTypeElement.textContent = `Quiz Type: ${quizType.charAt(0).toUpperCase() + quizType.slice(1)}`;
    }
    
    // Always show username modal before starting quiz
    username = localStorage.getItem('aptify_username');
    showUsernameModal();
    
    // Set up event listeners
    setupEventListeners();
});

/**
 * Set up event listeners for quiz functionality
 */
function setupEventListeners() {
    // Username modal submit
    const startQuizBtn = document.getElementById('startQuizBtn');
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', handleUsernameSubmit);
    }
    
    // Modal question count slider
    const modalQuestionCount = document.getElementById('modalQuestionCount');
    const modalQuestionCountValue = document.getElementById('modalQuestionCountValue');
    if (modalQuestionCount && modalQuestionCountValue) {
        modalQuestionCount.addEventListener('input', function() {
            modalQuestionCountValue.textContent = this.value;
        });
    }
    
    // Quiz navigation buttons
    const skipBtn = document.getElementById('skipBtn');
    const nextBtn = document.getElementById('nextBtn');
    const retryBtn = document.getElementById('retryBtn');
    
    if (skipBtn) {
        skipBtn.addEventListener('click', handleSkip);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', handleNext);
    }
    
    if (retryBtn) {
        retryBtn.addEventListener('click', handleRetry);
    }
}

/**
 * Show username modal
 */
function showUsernameModal() {
    const modal = document.getElementById('usernameModal');
    if (modal) {
        // Only show modal if username is not set or explicitly forced
        if (!username) {
            modal.style.display = 'flex';
            
            // Pre-fill username if available
            const modalUsername = document.getElementById('modalUsername');
            if (modalUsername && username) {
                modalUsername.value = username;
            }
            
            // Set quiz type dropdown
            const modalQuizType = document.getElementById('modalQuizType');
            if (modalQuizType) {
                modalQuizType.value = quizType;
            }
            
            // Set question count slider
            const modalQuestionCount = document.getElementById('modalQuestionCount');
            const modalQuestionCountValue = document.getElementById('modalQuestionCountValue');
            if (modalQuestionCount && modalQuestionCountValue) {
                modalQuestionCount.value = questionCount;
                modalQuestionCountValue.textContent = questionCount;
            }
        } else {
            // If username already exists, start fetching questions immediately
            fetchQuestions();
        }
    }
}

/**
 * Handle username modal submission
 */
function handleUsernameSubmit() {
    const modalUsername = document.getElementById('modalUsername');
    const modalUsernameError = document.getElementById('modalUsernameError');
    const modalQuizType = document.getElementById('modalQuizType');
    const modalQuestionCount = document.getElementById('modalQuestionCount');
    const modal = document.getElementById('usernameModal');
    
    // Validate username
    if (modalUsername && modalUsernameError) {
        const usernameValue = modalUsername.value.trim();
        
        if (!usernameValue) {
            modalUsernameError.textContent = 'Username is required';
            return;
        }
        
        if (usernameValue.length < 3 || usernameValue.length > 20) {
            modalUsernameError.textContent = 'Username must be 3-20 characters';
            return;
        }
        
        if (!/^[a-zA-Z0-9_]+$/.test(usernameValue)) {
            modalUsernameError.textContent = 'Username must contain only letters, numbers, and underscores';
            return;
        }
        
        // Clear error and save username
        modalUsernameError.textContent = '';
        username = usernameValue;
        localStorage.setItem('aptify_username', username);
    }
    
    // Update quiz type and question count
    if (modalQuizType) {
        quizType = modalQuizType.value;
    }
    
    if (modalQuestionCount) {
        questionCount = parseInt(modalQuestionCount.value);
    }
    
    // Hide modal
    if (modal) {
        modal.style.display = 'none';
    }
    
    // Start loading questions
    fetchQuestions();
}

/**
 * Fetch questions from API
 */
function fetchQuestions() {
    // Show loading state
    document.getElementById('loadingContainer').style.display = 'flex';
    document.getElementById('quizContent').style.display = 'none';
    document.getElementById('errorContainer').style.display = 'none';
    
    // Make API request
    fetch('/api/questions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            quiz_type: quizType,
            num_questions: questionCount
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch questions');
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'success' && data.questions && data.questions.length > 0) {
            questions = data.questions;
            selectedAnswers = new Array(questions.length).fill(null);
            
            // Save questions to localStorage
            localStorage.setItem('aptify_questions', JSON.stringify(questions));
            
            // Start quiz
            startQuiz();
        } else {
            handleFetchError('No questions received from server');
        }
    })
    .catch(error => {
        console.error('Error fetching questions:', error);
        handleFetchError(error.message);
    });
}

/**
 * Handle API fetch error
 * @param {string} errorMessage - Error message
 */
function handleFetchError(errorMessage) {
    if (apiRetries < maxRetries) {
        apiRetries++;
        document.getElementById('loadingContainer').innerHTML = `
            <div class="spinner"></div>
            <p class="loading-text">Fetching questions... Retry ${apiRetries}/${maxRetries}</p>
        `;
        
        // Retry after delay
        setTimeout(fetchQuestions, 2000);
    } else {
        // Show error state
        document.getElementById('loadingContainer').style.display = 'none';
        document.getElementById('errorContainer').style.display = 'flex';
        document.getElementById('errorMessage').textContent = 
            `${errorMessage}. Please check your internet connection and try again.`;
    }
}

/**
 * Handle retry button click
 */
function handleRetry() {
    apiRetries = 0;
    fetchQuestions();
}

/**
 * Start quiz
 */
function startQuiz() {
    // Hide loading state
    document.getElementById('loadingContainer').style.display = 'none';
    document.getElementById('quizContent').style.display = 'block';
    
    // Reset quiz state
    currentQuestion = 0;
    selectedAnswers = new Array(questions.length).fill(null);
    timer = 0;
    quizStartTime = new Date();
    
    // Display first question
    displayQuestion();
    
    // Start timer
    startTimer();
}

/**
 * Start quiz timer
 */
function startTimer() {
    // Clear any existing timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Update timer every second
    timerInterval = setInterval(() => {
        timer++;
        document.getElementById('quizTimer').textContent = `Time: ${formatTime(timer)}`;
    }, 1000);
}

/**
 * Display current question
 */
function displayQuestion() {
    const question = questions[currentQuestion];
    
    // Update question counter
    document.getElementById('questionCounter').textContent = 
        `Question: ${currentQuestion + 1}/${questions.length}`;
    
    // Update question text
    document.getElementById('questionText').textContent = question.question;
    
    // Generate options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option-item';
        optionElement.setAttribute('data-index', index);
        optionElement.textContent = option;
        
        // Add selected class if already answered
        if (selectedAnswers[currentQuestion] === index) {
            optionElement.classList.add('selected');
        }
        
        // Add click event
        optionElement.addEventListener('click', () => selectOption(index));
        
        optionsContainer.appendChild(optionElement);
    });
    
    // Update next button state
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.disabled = selectedAnswers[currentQuestion] === null;
}

/**
 * Select an option
 * @param {number} index - Option index
 */
function selectOption(index) {
    // Update selected answer
    selectedAnswers[currentQuestion] = index;
    
    // Update UI
    const options = document.querySelectorAll('.option-item');
    options.forEach(option => {
        option.classList.remove('selected');
    });
    
    options[index].classList.add('selected');
    
    // Enable next button
    document.getElementById('nextBtn').disabled = false;
}

/**
 * Handle skip button click
 */
function handleSkip() {
    // Mark as skipped
    selectedAnswers[currentQuestion] = null;
    
    // Move to next question
    goToNextQuestion();
}

/**
 * Handle next button click
 */
function handleNext() {
    goToNextQuestion();
}

/**
 * Go to next question or finish quiz
 */
function goToNextQuestion() {
    if (currentQuestion < questions.length - 1) {
        // Go to next question
        currentQuestion++;
        displayQuestion();
    } else {
        // Finish quiz
        finishQuiz();
    }
}

/**
 * Finish quiz and save results
 */
function finishQuiz() {
    // Stop timer
    clearInterval(timerInterval);
    
    // Calculate score
    const quizEndTime = new Date();
    const quizDuration = Math.floor((quizEndTime - quizStartTime) / 1000); // in seconds
    
    const results = {
        username: username,
        quizType: quizType,
        questions: questions,
        selectedAnswers: selectedAnswers,
        time: quizDuration,
        date: new Date().toISOString(),
        score: calculateScore()
    };
    
    // Save results to localStorage
    localStorage.setItem('aptify_last_results', JSON.stringify(results));
    
    // Redirect to results page
    window.location.href = '/results';
}

/**
 * Calculate quiz score
 * @returns {number} Score (correct answers count)
 */
function calculateScore() {
    let score = 0;
    
    for (let i = 0; i < questions.length; i++) {
        const selectedAnswer = selectedAnswers[i];
        
        // Skip null answers (skipped questions)
        if (selectedAnswer === null) continue;
        
        // Check if answer is correct
        const correctAnswer = questions[i].options.indexOf(questions[i].correct_answer);
        if (selectedAnswer === correctAnswer) {
            score++;
        }
    }
    
    return score;
}
