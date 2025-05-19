import os
import logging
import json
import requests
from typing import List, Dict, Any, Optional

# Gemini API configuration
GEMINI_API_KEY = "AIzaSyCvTtIXqEP67VXLs11OzDuN4lkReja0UbQ"
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent"

def list_models() -> List[Dict[str, Any]]:
    """
    List available Gemini models
    """
    try:
        response = requests.get(
            f"https://generativelanguage.googleapis.com/v1/models?key={GEMINI_API_KEY}",
            timeout=30
        )
        response.raise_for_status()
        return response.json().get("models", [])
    except Exception as e:
        logging.error(f"Failed to list models: {str(e)}")
        return []

def get_mcq_questions(quiz_type: str, num_questions: int) -> List[Dict[str, Any]]:
    """
    Get MCQ questions from Gemini API based on quiz type
    
    Args:
        quiz_type: Type of quiz (aptitude, reasoning, verbal, mixed)
        num_questions: Number of questions to generate (10-20)
        
    Returns:
        List of question dictionaries with question text, options, correct answer, and explanation
    
    Raises:
        ValueError: If quiz_type is not valid
        ValueError: If num_questions is not in the range 10-20
    """
    
    # Validate inputs
    if quiz_type not in ["aptitude", "reasoning", "verbal", "mixed"]:
        raise ValueError(f"Invalid quiz type: {quiz_type}")
    if not (10 <= num_questions <= 20):
        raise ValueError("Number of questions must be between 10 and 20")
    
    if not GEMINI_API_KEY:
        logging.error("Gemini API key not found")
        return []
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
        
        # Make request to Gemini API with proper error handling
        try:
            # Debug log the request data
            logging.debug(f"Requesting questions from Gemini API for {quiz_type} ({num_questions} questions)")
            logging.debug(f"API URL: {GEMINI_API_URL}")
            logging.debug(f"Request data: {json.dumps(data, indent=2)}")
            
            response = requests.post(
                f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code != 200:
                logging.error(f"Gemini API returned status code {response.status_code}")
                logging.error(f"Response: {response.text}")
                return []
                
            result = response.json()
            
            # Debug log the full response
            logging.debug(f"Gemini API Response: {json.dumps(result, indent=2)}")
            
            # Extract content
            if "candidates" not in result or not result["candidates"]:
                logging.error("No candidates found in API response")
                return []
                
            content = result["candidates"][0].get("content", {}).get("parts", [{}])[0].get("text", "")
            
            # Debug log the extracted content
            logging.debug(f"Extracted Content: {content}")
            
            # Try to parse JSON directly
            try:
                questions = json.loads(content)
                if isinstance(questions, list) and all(isinstance(q, dict) for q in questions):
                    return questions[:num_questions]
                logging.error("Content is not a valid list of questions")
            except json.JSONDecodeError:
                logging.error("Failed to parse JSON from content")
                
            # If JSON parsing fails, try to find JSON in markdown code blocks
            if "```json" in content:
                json_text = content.split("```json")[1].split("```")[0].strip()
                try:
                    questions = json.loads(json_text)
                    if isinstance(questions, list) and all(isinstance(q, dict) for q in questions):
                        return questions[:num_questions]
                    logging.error("Found JSON block but it's not a valid list of questions")
                except json.JSONDecodeError:
                    logging.error("Failed to parse JSON from code block")
            
            # If all else fails, return empty list
            logging.error("Failed to extract questions from API response")
            return []
            
        except requests.exceptions.RequestException as e:
            logging.error(f"Request to Gemini API failed: {str(e)}")
            return []
        except Exception as e:
            logging.error(f"Unexpected error with Gemini API: {str(e)}")
            return []
        
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
