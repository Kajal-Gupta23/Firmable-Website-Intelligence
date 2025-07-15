from typing import Dict, List

analysis_history: Dict[str, List[Dict[str, str]]] = {}

def store_analysis_questions(url: str, questions: List[Dict[str, str]]) -> None:

   # Append questions and answers from /analyze-website endpoint for a given URL.

    if url not in analysis_history:
        analysis_history[url] = []
    analysis_history[url].extend(questions)
    print(analysis_history[url])

def get_analysis_history(url: str) -> List[Dict[str, str]]:
    """
    Retrieve stored questions and answers for a given URL.
    """
    return analysis_history.get(url, [])