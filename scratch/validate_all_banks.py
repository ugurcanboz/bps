import re
import json
import os

FILES = [
    r"C:\Users\Ugurcan\Desktop\Projekt APP\v9\data\question-bank.js",
    r"C:\Users\Ugurcan\Desktop\Projekt APP\v9\data\question-bank-kaufm.js",
    r"C:\Users\Ugurcan\Desktop\Projekt APP\v9\data\question-bank-sozial.js",
    r"C:\Users\Ugurcan\Desktop\Projekt APP\v9\data\question-bank-it-extra.js",
    r"C:\Users\Ugurcan\Desktop\Projekt APP\v9\data\question-bank-mathe.js"
]

def clean_js_to_json(js_content):
    # Find the push( call
    push_match = re.search(r'\.push\s*\(', js_content)
    if not push_match:
        raise ValueError("Could not find '.push(' in file")
        
    start_idx = push_match.end()
    # Find the last closing parenthesis
    end_idx = js_content.rfind(')')
    if end_idx == -1 or end_idx < start_idx:
        raise ValueError("Could not find matching end of push in file")

    raw_array = js_content[start_idx:end_idx].strip()
    
    # Wrap it as a JSON array
    if not raw_array.startswith('['):
        raw_array = '[' + raw_array + ']'

    # Strip single line comments and multi-line comments
    raw_array = re.sub(r'//.*', '', raw_array)
    raw_array = re.sub(r'/\*.*?\*/', '', raw_array, flags=re.DOTALL)

    # Remove trailing commas before closing braces and brackets
    raw_array = re.sub(r',\s*}', '}', raw_array)
    raw_array = re.sub(r',\s*\]', ']', raw_array)

    return raw_array

def validate_file(file_path):
    print(f"Validating {os.path.basename(file_path)}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    try:
        json_str = clean_js_to_json(content)
        items = json.loads(json_str)
    except Exception as e:
        print(f"  [ERROR] Failed to parse as JSON: {e}")
        # Print a snippet of the parsed text for debugging
        return None

    errors = 0
    warnings = 0
    seen_ids = set()

    for idx, item in enumerate(items):
        q_id = item.get("id", f"index_{idx}")
        
        # 1. ID checks
        if "id" not in item:
            print(f"  [WARNING] Missing 'id' field in question index {idx}.")
            warnings += 1
        elif q_id in seen_ids:
            print(f"  [ERROR] Duplicate ID found: {q_id}")
            errors += 1
        else:
            seen_ids.add(q_id)

        # 2. Basic fields check
        q_text = item.get("question") or item.get("q")
        if not q_text:
            print(f"  [ERROR] Question {q_id}: Missing question text.")
            errors += 1
            
        answers = item.get("answers") or item.get("a")
        if not answers or not isinstance(answers, list) or len(answers) < 2:
            print(f"  [ERROR] Question {q_id}: Answers must be a list with at least 2 options.")
            errors += 1

        correct = item.get("correct")
        if correct is None:
            correct = item.get("correctIndex")
            
        if correct is None or not isinstance(correct, int) or correct < 0 or (answers and correct >= len(answers)):
            print(f"  [ERROR] Question {q_id}: Invalid correct answer index ({correct}).")
            errors += 1

        # 3. Duplicate answers check
        if answers and len(answers) != len(set(answers)):
            print(f"  [WARNING] Question {q_id}: Duplicate options in answers list {answers}.")
            warnings += 1

        # 4. Math-specific checks (tip, trick, stepByStep, testedConcept, similarQuestion)
        if "question-bank-mathe.js" in file_path:
            required_keys = ["tip", "trick", "stepByStep", "testedConcept", "similarQuestion"]
            for rk in required_keys:
                if not item.get(rk):
                    print(f"  [WARNING] Question {q_id}: Missing math-specific help key '{rk}'.")
                    warnings += 1

    print(f"  Finished. Found {len(items)} questions. Errors: {errors}, Warnings: {warnings}\n")
    return (errors, warnings)

if __name__ == "__main__":
    total_errors = 0
    total_warnings = 0
    for f in FILES:
        res = validate_file(f)
        if res is None:
            total_errors += 1
        else:
            total_errors += res[0]
            total_warnings += res[1]

    print(f"Validation summary: Total Errors = {total_errors}, Total Warnings = {total_warnings}")
    if total_errors > 0:
        exit(1)
    else:
        exit(0)
