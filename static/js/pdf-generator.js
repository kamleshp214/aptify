/**
 * PDF Generation functionality for Aptify
 * Handles creating downloadable PDF reports with quiz results and charts
 */

// PDF generation variables
let pdfDoc;
const pageWidth = 210;  // A4 width in mm
const pageHeight = 297; // A4 height in mm
const pageMargin = 15;  // margin in mm
const contentWidth = pageWidth - (pageMargin * 2);

/**
 * Generate and download PDF report
 */
function generatePDF() {
    // Show loading indicator
    const downloadBtn = document.getElementById('downloadPdfBtn');
    const originalBtnText = downloadBtn.textContent;
    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
    downloadBtn.disabled = true;
    
    // Load quiz results
    const quizResults = getStoredData('aptify_last_results');
    if (!quizResults) {
        showError('No quiz results found');
        downloadBtn.textContent = originalBtnText;
        downloadBtn.disabled = false;
        return;
    }
    
    // Initialize jsPDF
    const { jsPDF } = window.jspdf;
    pdfDoc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });
    
    // Set font
    pdfDoc.setFont('helvetica', 'normal');
    
    // Add header
    addPdfHeader(quizResults);
    
    // Capture and add charts
    captureCharts()
        .then(chartImages => {
            // Add summary section
            addSummarySection(quizResults);
            
            // Add performance charts
            addChartsSection(chartImages);
            
            // Add question analysis
            addQuestionAnalysis(quizResults);
            
            // Add footer
            addPdfFooter();
            
            // Save the PDF
            pdfDoc.save(`Aptify_Results_${quizResults.username}_${formatDate(new Date())}.pdf`);
            
            // Reset button
            downloadBtn.textContent = originalBtnText;
            downloadBtn.disabled = false;
        })
        .catch(error => {
            console.error('Error generating PDF:', error);
            showError('Error generating PDF. Please try again.');
            downloadBtn.textContent = originalBtnText;
            downloadBtn.disabled = false;
        });
}

/**
 * Add PDF header with title and basic info
 * @param {Object} results - Quiz results data
 */
function addPdfHeader(results) {
    // Add logo/title
    pdfDoc.setFontSize(24);
    pdfDoc.text('Aptify', pageMargin, 20);
    
    pdfDoc.setFontSize(12);
    pdfDoc.setTextColor(100, 100, 100);
    pdfDoc.text('Aptitude Test Results', pageMargin, 28);
    
    // Add horizontal line
    pdfDoc.setDrawColor(200, 200, 200);
    pdfDoc.line(pageMargin, 32, pageWidth - pageMargin, 32);
    
    // Reset text color
    pdfDoc.setTextColor(0, 0, 0);
    
    // Add quiz info
    pdfDoc.setFontSize(11);
    
    const quizType = results.quizType.charAt(0).toUpperCase() + results.quizType.slice(1);
    const date = formatDate(new Date(results.date));
    
    pdfDoc.text(`Username: ${results.username}`, pageMargin, 40);
    pdfDoc.text(`Quiz Type: ${quizType}`, pageMargin, 46);
    pdfDoc.text(`Date: ${date}`, pageMargin, 52);
    pdfDoc.text(`Questions: ${results.questions.length}`, pageWidth / 2, 40);
    pdfDoc.text(`Time Taken: ${formatTime(results.time)}`, pageWidth / 2, 46);
    pdfDoc.text(`Score: ${results.score}/${results.questions.length} (${Math.round((results.score / results.questions.length) * 100)}%)`, pageWidth / 2, 52);
}

/**
 * Add summary section to the PDF
 * @param {Object} results - Quiz results data
 */
function addSummarySection(results) {
    // Add section title
    pdfDoc.setFontSize(14);
    pdfDoc.text('Performance Summary', pageMargin, 70);
    
    // Add horizontal line
    pdfDoc.setDrawColor(200, 200, 200);
    pdfDoc.line(pageMargin, 73, pageWidth - pageMargin, 73);
    
    // Count correct, incorrect and skipped answers
    const correct = results.score;
    const skipped = results.selectedAnswers.filter(answer => answer === null).length;
    const incorrect = results.questions.length - correct - skipped;
    
    // Add summary text
    pdfDoc.setFontSize(11);
    
    pdfDoc.text(`Correct Answers: ${correct} (${Math.round((correct / results.questions.length) * 100)}%)`, pageMargin, 80);
    pdfDoc.text(`Incorrect Answers: ${incorrect} (${Math.round((incorrect / results.questions.length) * 100)}%)`, pageMargin, 86);
    pdfDoc.text(`Skipped Questions: ${skipped} (${Math.round((skipped / results.questions.length) * 100)}%)`, pageMargin, 92);
    
    const accuracy = correct / (correct + incorrect) * 100 || 0;
    pdfDoc.text(`Accuracy: ${Math.round(accuracy)}%`, pageMargin, 98);
    
    const avgTimePerQuestion = results.time / results.questions.length;
    pdfDoc.text(`Average Time per Question: ${Math.round(avgTimePerQuestion)} seconds`, pageMargin, 104);
}

/**
 * Capture charts as images using html2canvas
 * @returns {Promise<Object>} Promise resolving to object with chart images
 */
async function captureCharts() {
    const charts = {};
    
    try {
        // Capture pie chart
        const pieChartCanvas = document.getElementById('pieChart');
        if (pieChartCanvas) {
            const pieChartImage = await html2canvas(pieChartCanvas);
            charts.pieChart = pieChartImage.toDataURL('image/png');
        }
        
        // Capture bar chart
        const barChartCanvas = document.getElementById('barChart');
        if (barChartCanvas) {
            const barChartImage = await html2canvas(barChartCanvas);
            charts.barChart = barChartImage.toDataURL('image/png');
        }
        
        return charts;
    } catch (error) {
        console.error('Error capturing charts:', error);
        return {};
    }
}

/**
 * Add charts section to the PDF
 * @param {Object} chartImages - Object containing chart images as data URLs
 */
function addChartsSection(chartImages) {
    // Add section title
    pdfDoc.setFontSize(14);
    pdfDoc.text('Performance Charts', pageMargin, 115);
    
    // Add horizontal line
    pdfDoc.setDrawColor(200, 200, 200);
    pdfDoc.line(pageMargin, 118, pageWidth - pageMargin, 118);
    
    // Add pie chart if available
    if (chartImages.pieChart) {
        pdfDoc.setFontSize(12);
        pdfDoc.text('Performance Breakdown', pageMargin, 125);
        
        const imgWidth = contentWidth / 2;
        const imgHeight = imgWidth * 0.75;
        
        pdfDoc.addImage(
            chartImages.pieChart,
            'PNG',
            pageMargin,
            128,
            imgWidth,
            imgHeight
        );
    }
    
    // Add bar chart if available
    if (chartImages.barChart) {
        pdfDoc.setFontSize(12);
        pdfDoc.text('Score Distribution', pageWidth / 2, 125);
        
        const imgWidth = contentWidth / 2;
        const imgHeight = imgWidth * 0.75;
        
        pdfDoc.addImage(
            chartImages.barChart,
            'PNG',
            pageWidth / 2,
            128,
            imgWidth,
            imgHeight
        );
    }
}

/**
 * Add question analysis section to the PDF
 * @param {Object} results - Quiz results data
 */
function addQuestionAnalysis(results) {
    // Add new page for question analysis
    pdfDoc.addPage();
    
    // Add section title
    pdfDoc.setFontSize(14);
    pdfDoc.text('Question Analysis', pageMargin, 20);
    
    // Add horizontal line
    pdfDoc.setDrawColor(200, 200, 200);
    pdfDoc.line(pageMargin, 23, pageWidth - pageMargin, 23);
    
    // Set up variables
    let yPosition = 30;
    const lineHeight = 5;
    
    // Loop through questions
    results.questions.forEach((question, index) => {
        // Check if we need a new page
        if (yPosition > 250) {
            pdfDoc.addPage();
            yPosition = 20;
        }
        
        const selectedAnswer = results.selectedAnswers[index];
        const correctAnswer = question.options.indexOf(question.correct_answer);
        
        // Determine question status
        let status;
        if (selectedAnswer === null) {
            status = 'Skipped';
            pdfDoc.setTextColor(241, 196, 15); // Yellow
        } else if (selectedAnswer === correctAnswer) {
            status = 'Correct';
            pdfDoc.setTextColor(46, 204, 113); // Green
        } else {
            status = 'Incorrect';
            pdfDoc.setTextColor(231, 76, 60); // Red
        }
        
        // Add question number and status
        pdfDoc.setFontSize(11);
        pdfDoc.text(`Question ${index + 1}: ${status}`, pageMargin, yPosition);
        pdfDoc.setTextColor(0, 0, 0); // Reset text color
        
        yPosition += lineHeight + 2;
        
        // Add question text
        pdfDoc.setFontSize(10);
        
        // Handle long question text with wrapping
        const splitQuestion = pdfDoc.splitTextToSize(question.question, contentWidth);
        pdfDoc.text(splitQuestion, pageMargin, yPosition);
        
        yPosition += (splitQuestion.length * lineHeight) + 2;
        
        // Add options
        pdfDoc.setFontSize(9);
        question.options.forEach((option, optIndex) => {
            // Set color based on option status
            if (optIndex === correctAnswer) {
                pdfDoc.setTextColor(46, 204, 113); // Green for correct answer
            } else if (optIndex === selectedAnswer && selectedAnswer !== correctAnswer) {
                pdfDoc.setTextColor(231, 76, 60); // Red for incorrect selection
            } else {
                pdfDoc.setTextColor(0, 0, 0); // Black for other options
            }
            
            // Add option text
            let optionPrefix = `   ${String.fromCharCode(65 + optIndex)}. `;
            
            if (optIndex === correctAnswer) {
                optionPrefix += '✓ ';
            } else if (optIndex === selectedAnswer && selectedAnswer !== correctAnswer) {
                optionPrefix += '✗ ';
            }
            
            pdfDoc.text(optionPrefix + option, pageMargin, yPosition);
            yPosition += lineHeight;
        });
        
        // Reset text color
        pdfDoc.setTextColor(0, 0, 0);
        
        // Add explanation
        yPosition += 2;
        pdfDoc.setFontSize(8);
        pdfDoc.setTextColor(100, 100, 100);
        
        const splitExplanation = pdfDoc.splitTextToSize(`Explanation: ${question.explanation}`, contentWidth);
        pdfDoc.text(splitExplanation, pageMargin, yPosition);
        
        yPosition += (splitExplanation.length * lineHeight) + 8;
        
        // Reset text color
        pdfDoc.setTextColor(0, 0, 0);
    });
}

/**
 * Add footer to the PDF
 */
function addPdfFooter() {
    // Get total pages
    const totalPages = pdfDoc.getNumberOfPages();
    
    // Add footer to each page
    for (let i = 1; i <= totalPages; i++) {
        pdfDoc.setPage(i);
        
        // Add horizontal line
        pdfDoc.setDrawColor(200, 200, 200);
        pdfDoc.line(pageMargin, pageHeight - 20, pageWidth - pageMargin, pageHeight - 20);
        
        // Add footer text
        pdfDoc.setFontSize(8);
        pdfDoc.setTextColor(150, 150, 150);
        pdfDoc.text('Generated by Aptify - Professional Aptitude Test Platform', pageMargin, pageHeight - 15);
        pdfDoc.text(`Page ${i} of ${totalPages}`, pageWidth - pageMargin - 20, pageHeight - 15, { align: 'right' });
        
        // Add date
        const currentDate = new Date();
        pdfDoc.text(`Generated on: ${formatDate(currentDate)}`, pageMargin, pageHeight - 10);
    }
}

/**
 * Format date for PDF
 * @param {Date} date - Date to format
 * @returns {string} Formatted date
 */
function formatPdfDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Show error message
 * @param {string} message - Error message
 */
function showError(message) {
    console.error('PDF Generation Error:', message);
    alert(`Error: ${message}`);
}
