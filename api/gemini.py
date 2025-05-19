import os
import logging
import json
import requests
from typing import List, Dict, Any, Optional

# Gemini API configuration
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent"

def get_mcq_questions(quiz_type: str, num_questions: int) -> List[Dict[str, Any]]:
    """
    Get MCQ questions from Gemini API based on quiz type
    
    Args:
        quiz_type: Type of quiz (aptitude, reasoning, verbal, mixed)
        num_questions: Number of questions to generate (10-20)
        
    Returns:
        List of question dictionaries with question text, options, correct answer, and explanation
    """
    if not GEMINI_API_KEY:
        logging.error("Gemini API key not found")
        return []
    
    # Define prompt based on quiz type
    type_descriptions = {
        "aptitude": "math problems, percentages, ratios, time and work, profit and loss, etc. for BTech students",
        "reasoning": "logical reasoning problems, puzzles, sequences, coding-decoding, etc. for BTech students",
        "verbal": "reading comprehension, synonyms, antonyms, sentence completion, grammar, etc. for BTech students",
        "mixed": "a mix of aptitude, reasoning, and verbal problems for BTech students"
    }
    
    prompt = f"""Generate {num_questions} multiple-choice questions (MCQs) on {type_descriptions[quiz_type]}. 
    Each MCQ should have:
    1. A clear, concise question
    2. Exactly 4 options labeled as options array
    3. One correct answer
    4. A brief explanation of the correct answer
    
    Format the response as a JSON array of objects with the following structure:
    [
      {{
        "question": "Question text here",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct_answer": "Correct option here (exactly as it appears in options)",
        "explanation": "Explanation for why this is the correct answer"
      }},
      // more questions...
    ]
    
    Important: Ensure all questions are accurate, unbiased, and suitable for college-level aptitude tests.
    """
    
    try:
        # Prepare request to Gemini API
        headers = {
            "Content-Type": "application/json"
        }
        
        data = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }],
            "generationConfig": {
                "temperature": 0.2,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 4096
            }
        }
        
        # Make request to Gemini API
        response = requests.post(
            f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
            headers=headers,
            json=data
        )
        
        if response.status_code != 200:
            logging.error(f"Error from Gemini API: {response.text}")
            return []
        
        # Parse response
        result = response.json()
        content = result.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
        
        # Extract JSON part from the content
        # Find JSON array in the text (may be wrapped in markdown code blocks)
        json_text = content
        if "```json" in content:
            json_text = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            json_text = content.split("```")[1].strip()
        
        # Parse JSON array
        questions = json.loads(json_text)
        
        # Validate questions structure
        validated_questions = []
        for q in questions:
            if all(key in q for key in ["question", "options", "correct_answer", "explanation"]):
                if len(q["options"]) == 4 and q["correct_answer"] in q["options"]:
                    validated_questions.append(q)
        
        return validated_questions[:num_questions]
        
    except Exception as e:
        logging.error(f"Error generating questions: {e}")
        return []
