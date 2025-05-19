from typing import List, Dict, Any

def get_fallback_questions(quiz_type: str, num_questions: int) -> List[Dict[str, Any]]:
    """
    Get fallback MCQ questions when Gemini API fails
    
    Args:
        quiz_type: Type of quiz (aptitude, reasoning, verbal, mixed)
        num_questions: Number of questions to return
        
    Returns:
        List of question dictionaries
    """
    # Define fallback questions by category
    aptitude_questions = [
        {
            "question": "If 5x + 3 = 18, what is x?",
            "options": ["2", "3", "4", "5"],
            "correct_answer": "3",
            "explanation": "5x + 3 = 18 => 5x = 15 => x = 3"
        },
        {
            "question": "A car travels at 60 km/h for 2 hours and then at 40 km/h for 3 hours. What is the average speed?",
            "options": ["48 km/h", "50 km/h", "52 km/h", "54 km/h"],
            "correct_answer": "48 km/h",
            "explanation": "Total distance = 60×2 + 40×3 = 120 + 120 = 240 km. Total time = 5 hours. Average speed = 240÷5 = 48 km/h."
        },
        {
            "question": "If a product is discounted by 20% and then by 25% on the reduced price, what is the overall discount percentage?",
            "options": ["40%", "45%", "40.5%", "40%"],
            "correct_answer": "40%",
            "explanation": "After first discount, price becomes 80%. After second discount, price becomes 80% × 75% = 60% of original. So discount is 40%."
        },
        {
            "question": "The ratio of boys to girls in a class is 3:5. If there are 24 boys, how many students are there in total?",
            "options": ["56", "64", "60", "58"],
            "correct_answer": "64",
            "explanation": "Boys:Girls = 3:5. If boys = 24, then 3x = 24, so x = 8. Girls = 5x = 40. Total = 24 + 40 = 64."
        },
        {
            "question": "A can complete a work in 12 days and B can complete it in 15 days. How many days will they take to complete the work together?",
            "options": ["6.67 days", "7.5 days", "6 days", "6.5 days"],
            "correct_answer": "6.67 days",
            "explanation": "A's work per day = 1/12, B's work per day = 1/15. Together = 1/12 + 1/15 = (5+4)/60 = 9/60 = 3/20. Days needed = 20/3 = 6.67 days."
        },
        {
            "question": "If a number is increased by 20% and then decreased by 20%, the final number is what percent of the original?",
            "options": ["96%", "100%", "95%", "90%"],
            "correct_answer": "96%",
            "explanation": "If original = x, after 20% increase: 1.2x, after 20% decrease: 1.2x × 0.8 = 0.96x, which is 96% of original."
        },
        {
            "question": "A train passes a 200m long platform in 20 seconds and a 300m long platform in 25 seconds at the same speed. What is the length of the train?",
            "options": ["300m", "200m", "100m", "400m"],
            "correct_answer": "100m",
            "explanation": "Let train length be L and speed be v. Then (L+200)/v = 20 and (L+300)/v = 25. Solving these equations: L = 100m."
        },
        {
            "question": "The compound interest on a certain sum for 2 years at 10% per annum is Rs. 2100. What is the simple interest for the same period and rate?",
            "options": ["Rs. 1900", "Rs. 2000", "Rs. 2050", "Rs. 2150"],
            "correct_answer": "Rs. 2000",
            "explanation": "Let principal be P. Then P(1.1)² - P = 2100, so P = 10000. Simple interest = 10000 × 0.1 × 2 = 2000."
        },
        {
            "question": "The average of 5 consecutive even numbers is 22. What is the largest of these numbers?",
            "options": ["24", "26", "28", "30"],
            "correct_answer": "26",
            "explanation": "Let the numbers be x, x+2, x+4, x+6, x+8. Their average is 22. So (5x+20)/5 = 22, which gives x = 18. Largest number = x+8 = 26."
        },
        {
            "question": "A man buys an article for Rs. 1200 and sells it at a profit of 20%. What is the selling price?",
            "options": ["Rs. 1400", "Rs. 1440", "Rs. 1500", "Rs. 1420"],
            "correct_answer": "Rs. 1440",
            "explanation": "Profit = 20% of 1200 = 240. Selling price = 1200 + 240 = 1440."
        }
    ]
    
    reasoning_questions = [
        {
            "question": "Which number should come next in the series: 2, 6, 12, 20, 30, ?",
            "options": ["42", "36", "40", "44"],
            "correct_answer": "42",
            "explanation": "The differences between consecutive terms are 4, 6, 8, 10, 12. So the next number is 30 + 12 = 42."
        },
        {
            "question": "If EARTH is coded as 41590, how is HEART coded?",
            "options": ["04159", "01459", "94150", "94510"],
            "correct_answer": "04159",
            "explanation": "In EARTH: E=4, A=1, R=5, T=9, H=0. So HEART would be 04159."
        },
        {
            "question": "If 'A + B' means 'A is the father of B', 'A - B' means 'A is the wife of B', 'A × B' means 'A is the brother of B', and 'A ÷ B' means 'A is the daughter of B', then which of the following means 'P is the maternal uncle of Q'?",
            "options": ["P × R - S + Q", "P × S - R + Q", "P × S + R - Q", "P - S × R + Q"],
            "correct_answer": "P × S - R + Q",
            "explanation": "P is the brother of S, S is the wife of R, R is the father of Q. So P is the brother of Q's mother, or Q's maternal uncle."
        },
        {
            "question": "In a certain code, COMPUTER is written as RFUVQNPC. How will PRINTER be written in the same code?",
            "options": ["QSJOUFS", "SFUOJSQ", "STNUIQE", "QSJOUFQ"],
            "correct_answer": "QSJOUFQ",
            "explanation": "Each letter is replaced by the previous letter in the alphabet. So P→Q, R→S, I→J, N→O, T→U, E→F, R→S."
        },
        {
            "question": "If A=1, B=2, ..., Z=26, what is the sum of the values of the letters in the word 'CODE'?",
            "options": ["27", "37", "26", "25"],
            "correct_answer": "27",
            "explanation": "C=3, O=15, D=4, E=5. Sum = 3 + 15 + 4 + 5 = 27."
        },
        {
            "question": "Which figure comes next in the sequence? [Square, Circle, Triangle, Square, Circle, ?]",
            "options": ["Square", "Triangle", "Circle", "Pentagon"],
            "correct_answer": "Triangle",
            "explanation": "The pattern repeats: Square, Circle, Triangle. So after Square, Circle comes Triangle."
        },
        {
            "question": "If 'table' is called 'chair', 'chair' is called 'bed', 'bed' is called 'window', and 'window' is called 'almirah', then where does a person sleep?",
            "options": ["Table", "Chair", "Window", "Bed"],
            "correct_answer": "Window",
            "explanation": "A person sleeps on a bed, which is called 'window' in this coded language."
        },
        {
            "question": "A is B's sister. C is B's mother. D is C's father. E is D's mother. How is A related to D?",
            "options": ["Granddaughter", "Grandfather", "Grandmother", "Daughter"],
            "correct_answer": "Granddaughter",
            "explanation": "A is B's sister, C is B's mother, so C is also A's mother. D is C's father, so D is A's grandfather. Therefore, A is D's granddaughter."
        },
        {
            "question": "In a row of children, Ravi is 7th from the left and Rani is 12th from the right. If they interchange their positions, Ravi becomes 22nd from the left. How many children are there in the row?",
            "options": ["33", "34", "32", "31"],
            "correct_answer": "33",
            "explanation": "After interchange, Ravi is 22nd from left. Originally he was 7th from left, so he moved 15 positions right. This means Rani was 15 positions to his right. So Rani was at position 7+15=22. Rani was also 12th from right, so total children = 22+12-1 = 33."
        },
        {
            "question": "If '+' means '÷', '-' means '×', '×' means '+', and '÷' means '-', then 16 + 4 - 3 × 2 ÷ 5 = ?",
            "options": ["7", "8", "9", "10"],
            "correct_answer": "9",
            "explanation": "Using the substitutions: 16 ÷ 4 × 3 + 2 - 5 = 4 × 3 + 2 - 5 = 12 + 2 - 5 = 14 - 5 = 9."
        }
    ]
    
    verbal_questions = [
        {
            "question": "Choose the synonym of 'Benevolent':",
            "options": ["Beneficial", "Kind", "Malevolent", "Selfish"],
            "correct_answer": "Kind",
            "explanation": "Benevolent means 'well-meaning and kindly'. 'Kind' is a synonym."
        },
        {
            "question": "Choose the antonym of 'Audacious':",
            "options": ["Timid", "Bold", "Brave", "Daring"],
            "correct_answer": "Timid",
            "explanation": "Audacious means 'showing a willingness to take surprisingly bold risks'. 'Timid' means showing a lack of courage or confidence, which is the opposite."
        },
        {
            "question": "Complete the analogy: Wood is to Carpenter as Brick is to _______",
            "options": ["Building", "Mason", "Clay", "Stone"],
            "correct_answer": "Mason",
            "explanation": "A carpenter works with wood, and a mason works with bricks."
        },
        {
            "question": "Choose the word with the correct spelling:",
            "options": ["Acommodation", "Accommodation", "Accomodation", "Acomodation"],
            "correct_answer": "Accommodation",
            "explanation": "The correct spelling is 'Accommodation' with two 'c's and two 'm's."
        },
        {
            "question": "Choose the meaning of the idiom 'To bite the dust':",
            "options": ["To die", "To eat dirt", "To fail", "To be humiliated"],
            "correct_answer": "To fail",
            "explanation": "To bite the dust means to fail or to be defeated."
        },
        {
            "question": "Choose the part that contains an error: The committee (A)/ has submitted (B)/ their report (C)/ to the principal. (D)",
            "options": ["A", "B", "C", "D"],
            "correct_answer": "C",
            "explanation": "The committee is singular, so it should be 'its report' not 'their report'."
        },
        {
            "question": "Fill in the blank: She _______ watching the movie when the power went out.",
            "options": ["was", "is", "were", "are"],
            "correct_answer": "was",
            "explanation": "The sentence is in past continuous tense, and 'she' is singular, so 'was' is the correct form."
        },
        {
            "question": "Choose the one-word substitute for 'A person who collects coins':",
            "options": ["Philatelist", "Numismatist", "Philanthropist", "Misanthrope"],
            "correct_answer": "Numismatist",
            "explanation": "A numismatist is a person who collects coins. A philatelist collects stamps."
        },
        {
            "question": "Choose the correct meaning of the prefix 'inter-':",
            "options": ["Within", "Below", "Between", "Above"],
            "correct_answer": "Between",
            "explanation": "The prefix 'inter-' means 'between' or 'among', as in 'international' (between nations)."
        },
        {
            "question": "Choose the passive voice of 'They are building a new bridge':",
            "options": ["A new bridge is built by them", "A new bridge has been built by them", "A new bridge was being built by them", "A new bridge is being built by them"],
            "correct_answer": "A new bridge is being built by them",
            "explanation": "The active voice is in present continuous tense, so the passive form is 'is being built'."
        }
    ]
    
    # Create mixed questions by taking from each category
    mixed_questions = (aptitude_questions[:3] + reasoning_questions[:4] + verbal_questions[:3])
    
    # Select the appropriate question set based on quiz type
    if quiz_type == 'aptitude':
        questions = aptitude_questions
    elif quiz_type == 'reasoning':
        questions = reasoning_questions
    elif quiz_type == 'verbal':
        questions = verbal_questions
    else:  # mixed
        questions = mixed_questions
    
    # Return the requested number of questions (with wraparound if needed)
    if len(questions) < num_questions:
        # Repeat the questions until we have enough
        questions = questions * (num_questions // len(questions) + 1)
    
    return questions[:num_questions]
