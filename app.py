import os
import logging
from flask import Flask, render_template, request, jsonify
from api.gemini import get_mcq_questions
from api.fallback_questions import get_fallback_questions

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "aptify-secret-key")

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/practice')
def practice():
    return render_template('practice.html')

@app.route('/quiz')
def quiz():
    quiz_type = request.args.get('type', 'mixed')
    return render_template('quiz.html', quiz_type=quiz_type)

@app.route('/results')
def results():
    return render_template('results.html')

@app.route('/leaderboard')
def leaderboard():
    return render_template('leaderboard.html')

@app.route('/about')
def about():
    return render_template('about.html')

# API endpoints
@app.route('/api/questions', methods=['POST'])
def get_questions():
    try:
        data = request.get_json()
        quiz_type = data.get('quiz_type', 'mixed')
        num_questions = data.get('num_questions', 10)
        
        # Validate input
        if num_questions < 10 or num_questions > 20:
            num_questions = 10
            
        if quiz_type not in ['aptitude', 'reasoning', 'verbal', 'mixed']:
            quiz_type = 'mixed'
            
        # Get questions from Gemini API
        questions = get_mcq_questions(quiz_type, num_questions)
        
        if not questions or len(questions) == 0:
            # Fallback to predefined questions
            questions = get_fallback_questions(quiz_type, num_questions)
            
        return jsonify({"status": "success", "questions": questions})
    except Exception as e:
        logging.error(f"Error getting questions: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
