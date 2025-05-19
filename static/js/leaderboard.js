/**
 * Leaderboard functionality for Aptify
 * Handles leaderboard display and filtering
 */

// Leaderboard state variables
let leaderboard = [];
let activeFilter = 'all';

document.addEventListener('DOMContentLoaded', function() {
    // Load leaderboard from localStorage
    leaderboard = getStoredData('aptify_leaderboard', []);
    
    // Display leaderboard
    displayLeaderboard();
    
    // Set up event listeners
    setupEventListeners();
});

/**
 * Set up event listeners for leaderboard page
 */
function setupEventListeners() {
    // Category filter change
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            activeFilter = this.value;
            displayLeaderboard();
        });
    }
}

/**
 * Display leaderboard with current filter
 */
function displayLeaderboard() {
    const leaderboardBody = document.getElementById('leaderboardBody');
    const emptyLeaderboard = document.getElementById('emptyLeaderboard');
    
    if (!leaderboardBody || !emptyLeaderboard) return;
    
    // Filter leaderboard based on active filter
    const filteredLeaderboard = activeFilter === 'all' ?
        leaderboard :
        leaderboard.filter(entry => entry.quizType === activeFilter);
    
    // Clear existing entries
    leaderboardBody.innerHTML = '';
    
    // Check if leaderboard is empty
    if (filteredLeaderboard.length === 0) {
        leaderboardBody.innerHTML = `
            <tr class="leaderboard-placeholder">
                <td colspan="6">No entries found for this category</td>
            </tr>
        `;
        return;
    }
    
    // Generate leaderboard entries
    filteredLeaderboard.forEach((entry, index) => {
        const row = document.createElement('tr');
        
        // Calculate rank
        const rank = index + 1;
        
        // Format date
        const formattedDate = formatDate(entry.date);
        
        // Format time
        const formattedTime = formatTime(entry.time);
        
        // Capitalize quiz type
        const formattedQuizType = entry.quizType.charAt(0).toUpperCase() + entry.quizType.slice(1);
        
        row.innerHTML = `
            <td>${rank}</td>
            <td>${entry.username}</td>
            <td>${entry.score}/${entry.totalQuestions} (${Math.round((entry.score / entry.totalQuestions) * 100)}%)</td>
            <td>${formattedTime}</td>
            <td>${formattedDate}</td>
            <td>${formattedQuizType}</td>
        `;
        
        leaderboardBody.appendChild(row);
    });
}

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
