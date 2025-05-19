/**
 * Results page functionality for Aptify
 * Handles results display, charts, and saving to leaderboard
 */

// Results state variables
let quizResults = null;
let chartInstances = {};

document.addEventListener('DOMContentLoaded', function() {
    // Load results from localStorage
    quizResults = getStoredData('aptify_last_results');
    
    if (!quizResults) {
        // No results found, redirect to practice page
        window.location.href = '/practice';
        return;
    }
    
    // Display results
    displayResults();
    
    // Generate charts
    generateCharts();
    
    // Generate question analysis
    displayQuestionAnalysis();
    
    // Set up event listeners
    setupEventListeners();
});

/**
 * Set up event listeners for results page
 */
function setupEventListeners() {
    // Download PDF button
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', generatePDF);
    }
    
    // Retake quiz button
    const retakeQuizBtn = document.getElementById('retakeQuizBtn');
    if (retakeQuizBtn) {
        retakeQuizBtn.addEventListener('click', () => {
            window.location.href = `/quiz?type=${quizResults.quizType}`;
        });
    }
    
    // Save to leaderboard button
    const saveToLeaderboardBtn = document.getElementById('saveToLeaderboardBtn');
    if (saveToLeaderboardBtn) {
        saveToLeaderboardBtn.addEventListener('click', saveToLeaderboard);
    }
}

/**
 * Display quiz results summary
 */
function displayResults() {
    // Display score
    const scoreValue = document.getElementById('scoreValue');
    const scorePercentage = document.getElementById('scorePercentage');
    if (scoreValue && scorePercentage) {
        scoreValue.textContent = quizResults.score;
        const percentage = Math.round((quizResults.score / quizResults.questions.length) * 100);
        scorePercentage.textContent = `${percentage}%`;
    }
    
    // Display time
    const timeValue = document.getElementById('timeValue');
    if (timeValue) {
        timeValue.textContent = formatTime(quizResults.time);
    }
    
    // Display category
    const categoryValue = document.getElementById('categoryValue');
    if (categoryValue) {
        categoryValue.textContent = quizResults.quizType.charAt(0).toUpperCase() + quizResults.quizType.slice(1);
    }
}

/**
 * Generate and display charts
 */
function generateCharts() {
    // Count correct, incorrect and skipped answers
    const correct = quizResults.score;
    const skipped = quizResults.selectedAnswers.filter(answer => answer === null).length;
    const incorrect = quizResults.questions.length - correct - skipped;
    
    // Generate pie chart
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    chartInstances.pie = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: ['Correct', 'Incorrect', 'Skipped'],
            datasets: [{
                data: [correct, incorrect, skipped],
                backgroundColor: ['rgba(46, 204, 113, 0.7)', 'rgba(231, 76, 60, 0.7)', 'rgba(241, 196, 15, 0.7)'],
                borderColor: ['#2ecc71', '#e74c3c', '#f1c40f'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#FFFFFF'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
    
    // Generate bar chart for category distribution
    const categories = quizResults.questions.reduce((acc, q, index) => {
        // Determine question category based on quizType
        // For this demo, we'll create dummy categories
        let category;
        if (quizResults.quizType === 'mixed') {
            // Assign random categories for mixed quiz
            const categories = ['Aptitude', 'Reasoning', 'Verbal'];
            category = categories[index % categories.length];
        } else {
            // Split into sub-categories for specific quiz types
            const subCategories = {
                'aptitude': ['Arithmetic', 'Percentages', 'Ratios', 'Time & Work'],
                'reasoning': ['Logical', 'Patterns', 'Sequences', 'Puzzles'],
                'verbal': ['Vocabulary', 'Grammar', 'Comprehension', 'Synonyms']
            };
            
            category = subCategories[quizResults.quizType][index % subCategories[quizResults.quizType].length];
        }
        
        if (!acc[category]) {
            acc[category] = {
                total: 0,
                correct: 0,
                incorrect: 0,
                skipped: 0
            };
        }
        
        acc[category].total++;
        
        if (quizResults.selectedAnswers[index] === null) {
            acc[category].skipped++;
        } else {
            const isCorrect = quizResults.questions[index].options[quizResults.selectedAnswers[index]] === 
                              quizResults.questions[index].correct_answer;
            
            if (isCorrect) {
                acc[category].correct++;
            } else {
                acc[category].incorrect++;
            }
        }
        
        return acc;
    }, {});
    
    // Prepare data for bar chart
    const categoryLabels = Object.keys(categories);
    const correctData = categoryLabels.map(cat => categories[cat].correct);
    const incorrectData = categoryLabels.map(cat => categories[cat].incorrect);
    const skippedData = categoryLabels.map(cat => categories[cat].skipped);
    
    // Generate bar chart
    const barCtx = document.getElementById('barChart').getContext('2d');
    chartInstances.bar = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: categoryLabels,
            datasets: [
                {
                    label: 'Correct',
                    data: correctData,
                    backgroundColor: 'rgba(46, 204, 113, 0.7)',
                    borderColor: '#2ecc71',
                    borderWidth: 1
                },
                {
                    label: 'Incorrect',
                    data: incorrectData,
                    backgroundColor: 'rgba(231, 76, 60, 0.7)',
                    borderColor: '#e74c3c',
                    borderWidth: 1
                },
                {
                    label: 'Skipped',
                    data: skippedData,
                    backgroundColor: 'rgba(241, 196, 15, 0.7)',
                    borderColor: '#f1c40f',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: '#FFFFFF'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    ticks: {
                        color: '#FFFFFF'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#FFFFFF'
                    }
                }
            }
        }
    });
}

/**
 * Display question-by-question analysis
 */
function displayQuestionAnalysis() {
    const questionAnalysis = document.getElementById('questionAnalysis');
    if (!questionAnalysis) return;
    
    questionAnalysis.innerHTML = '';
    
    quizResults.questions.forEach((question, index) => {
        const selectedAnswer = quizResults.selectedAnswers[index];
        const correctAnswer = question.options.indexOf(question.correct_answer);
        
        let status, statusClass;
        if (selectedAnswer === null) {
            status = 'Skipped';
            statusClass = 'status-skipped';
        } else if (selectedAnswer === correctAnswer) {
            status = 'Correct';
            statusClass = 'status-correct';
        } else {
            status = 'Incorrect';
            statusClass = 'status-incorrect';
        }
        
        const questionItem = document.createElement('div');
        questionItem.className = 'question-item';
        
        questionItem.innerHTML = `
            <div class="question-header">
                <h4>Question ${index + 1}</h4>
                <span class="question-status ${statusClass}">${status}</span>
            </div>
            <p class="question-text">${question.question}</p>
            <div class="options-list">
                ${question.options.map((option, optIndex) => {
                    let optionClass = '';
                    if (optIndex === correctAnswer) {
                        optionClass = 'option-correct';
                    } else if (optIndex === selectedAnswer && selectedAnswer !== correctAnswer) {
                        optionClass = 'option-incorrect';
                    }
                    
                    return `<div class="option ${optionClass}">
                        ${optIndex === correctAnswer ? '✓ ' : ''}
                        ${optIndex === selectedAnswer && selectedAnswer !== correctAnswer ? '✗ ' : ''}
                        ${option}
                        ${optIndex === correctAnswer ? ' (Correct Answer)' : ''}
                    </div>`;
                }).join('')}
            </div>
            <div class="explanation">
                <strong>Explanation:</strong> ${question.explanation}
            </div>
        `;
        
        questionAnalysis.appendChild(questionItem);
    });
}

/**
 * Save results to leaderboard
 */
function saveToLeaderboard() {
    // Get existing leaderboard from localStorage
    const leaderboard = getStoredData('aptify_leaderboard', []);
    
    // Create leaderboard entry
    const entry = {
        id: generateId(),
        username: quizResults.username,
        score: quizResults.score,
        totalQuestions: quizResults.questions.length,
        time: quizResults.time,
        date: quizResults.date,
        quizType: quizResults.quizType
    };
    
    // Add to leaderboard
    leaderboard.push(entry);
    
    // Sort by score (highest first) and then by time (lowest first)
    leaderboard.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return a.time - b.time;
    });
    
    // Save to localStorage
    storeData('aptify_leaderboard', leaderboard);
    
    // Show confirmation
    const saveToLeaderboardBtn = document.getElementById('saveToLeaderboardBtn');
    if (saveToLeaderboardBtn) {
        saveToLeaderboardBtn.textContent = 'Saved to Leaderboard!';
        saveToLeaderboardBtn.disabled = true;
    }
}
