# Aptify - Professional Aptitude Test Platform

Aptify is a professional, black-and-white aptitude test platform designed specifically for BTech students preparing for campus placements. The application features a sleek, minimal UI with a focus on functionality and user experience.

![Aptify Screenshot](generated-icon.png)

## 🚀 Features

- **Dynamic Question Generation**: Utilizes Google Gemini API to generate high-quality MCQs across different categories
- **Multiple Quiz Categories**: Practice with Aptitude, Reasoning, Verbal, or Mixed questions
- **Interactive Quiz Interface**: User-friendly quiz environment with timer and progress tracking
- **Detailed Results Analysis**: Comprehensive breakdown of performance with visual charts
- **Downloadable PDF Reports**: Generate and download detailed performance reports with embedded charts
- **Local Leaderboard**: Compare your performance with others (no login required)
- **Responsive Design**: Works seamlessly on all devices from mobile to desktop
- **Professional UI**: Clean black-and-white theme with glassmorphism effects

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Flask (Python)
- **API Integration**: Google Gemini AI for question generation
- **Data Visualization**: Chart.js
- **PDF Generation**: jsPDF, html2canvas
- **Icons & UI**: Font Awesome, Google Fonts (Inter, Roboto Mono)
- **Deployment**: Ready for deployment on Vercel, Render, or similar platforms

## 🔧 Setup & Installation

### Prerequisites
- Python 3.10+ installed
- Google Gemini API key

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/aptify.git
   cd aptify
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Run the application:
   ```bash
   python main.py
   ```

5. Access the application at `http://localhost:5000`

## 📱 Usage Guide

1. **Home Page**: Overview of the application and features
2. **Practice Page**: Select a quiz category (Aptitude, Reasoning, Verbal, Mixed)
3. **Quiz Initialization**: Enter your username and customize quiz settings
4. **Quiz Taking**: Answer questions, track your progress and time
5. **Results Page**: View detailed analysis of your performance with charts
6. **PDF Report**: Download a comprehensive report of your quiz results
7. **Leaderboard**: Compare your scores with others

## 📊 Quiz Categories

- **Aptitude**: Mathematical problems, percentages, ratios, time & work
- **Reasoning**: Logical puzzles, sequences, patterns, coding-decoding
- **Verbal**: Reading comprehension, vocabulary, grammar, synonyms/antonyms
- **Mixed**: Combination of all categories for comprehensive practice

## 🚀 Deployment

### Vercel Deployment
The application includes a `vercel.json` configuration file for easy deployment to Vercel:

1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel login`
3. Deploy: `vercel --prod`

### Render Deployment
To deploy on Render:

1. Create a new Web Service
2. Connect your repository
3. Set the build command: `pip install -r requirements.txt`
4. Set the start command: `gunicorn --bind 0.0.0.0:$PORT main:app`
5. Add environment variables for `GEMINI_API_KEY`

## 🛠️ Development

### Project Structure
```
aptify/
├── api/                    # API integration modules
│   ├── gemini.py           # Google Gemini API integration
│   └── fallback_questions.py  # Fallback questions when API fails
├── static/                 # Static assets
│   ├── css/                # Stylesheets
│   ├── js/                 # JavaScript files
│   └── images/             # Images and icons
├── templates/              # HTML templates
│   ├── layout.html         # Base template
│   ├── index.html          # Home page
│   ├── practice.html       # Practice page
│   ├── quiz.html           # Quiz interface
│   ├── results.html        # Results page
│   ├── leaderboard.html    # Leaderboard page
│   └── about.html          # About page
├── app.py                  # Flask application and routes
├── main.py                 # Entry point
├── vercel.json             # Vercel deployment configuration
└── README.md               # Project documentation
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Google Gemini API for question generation
- Font Awesome for icons
- Chart.js for data visualization
- jsPDF and html2canvas for PDF generation

---

*Developed with ❤️ for BTech students preparing for campus placements*