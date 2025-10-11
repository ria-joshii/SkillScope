#!/usr/bin/env python3
import os
import sys
import time
import json
from pathlib import Path
from typing import List
import google.generativeai as genai
from google.api_core.exceptions import GoogleAPICallError, DeadlineExceeded

API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyCx7loNOONvL6GWvj75EsGm0y89gArIKoU")
PRIMARY_MODEL = os.getenv("GEMINI_MODEL_PRIMARY", "gemini-2.0-flash-exp")
FALLBACK_MODEL = os.getenv("GEMINI_MODEL_FALLBACK", "gemini-1.5-flash")
DEFAULT_TIMEOUT_SEC = int(os.getenv("GEMINI_TIMEOUT_SEC", "1800"))
MAX_RETRIES = int(os.getenv("GEMINI_MAX_RETRIES", "3"))
RETRY_BASE_DELAY = float(os.getenv("GEMINI_RETRY_BASE", "5.0"))

SYSTEM_PROMPT = """You are an AI OSCE evaluator. Analyze the medical student encounter and return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "transcript": [{"timestamp": "00:00:00", "speaker": "STUDENT", "text": "..."}],
  "rubric_evaluation": {
    "critical_action_checklist": [{"criterion": "...", "met": true, "evidence": "..."}],
    "empathy_clarity_scale": {
      "FosteringRelationship": {"score": 4, "comment": "..."},
      "GatheringInformation": {"score": 5, "comment": "..."},
      "ProvidingInformation": {"score": 4, "comment": "..."},
      "HelpingPatientDecisions": {"score": 3, "comment": "..."}
    },
    "clinical_reasoning": {
      "epidemiology_profile": 2,
      "prioritized_problem_cues": 2,
      "problem_statement": 1,
      "differential_diagnosis": 2,
      "diagnostic_plan": 1,
      "total_score": 8
    }
  },
  "aggregate_scores": {
    "checklist_percent": 75,
    "communication_percent": 80,
    "post_note_score": 8,
    "passed": true
  },
  "feedback_summary": "..."
}
Be critical and evidence-based."""

def ensure_api():
    genai.configure(api_key=API_KEY)

def wait_until_active(file_name: str, timeout_sec: int = 600):
    start = time.time()
    while True:
        f = genai.get_file(file_name)
        if f.state.name == "ACTIVE":
            return f
        if f.state.name == "FAILED":
            raise RuntimeError(f"File processing failed")
        if time.time() - start > timeout_sec:
            raise TimeoutError("Timed out")
        time.sleep(2)

def generate_with_retries(model_name: str, file_obj, timeout_sec: int) -> str:
    models = [model_name, FALLBACK_MODEL] if FALLBACK_MODEL != model_name else [model_name]
    for m in models:
        model = genai.GenerativeModel(m)
        for attempt in range(MAX_RETRIES):
            try:
                resp = model.generate_content([SYSTEM_PROMPT, file_obj], request_options={"timeout": timeout_sec})
                text = resp.text.strip()
                if text.startswith("```"):
                    lines = text.split("\n")
                    text = "\n".join(lines[1:-1]) if len(lines) > 2 else text.strip("` ")
                text = text.strip()
                # Validate JSON
                json.loads(text)
                return text
            except Exception as e:
                if attempt == MAX_RETRIES - 1:
                    break
                time.sleep(RETRY_BASE_DELAY * (2 ** attempt))
    raise RuntimeError("All attempts failed")

def main():
    if len(sys.argv) < 3:
        sys.exit(1)
    
    ensure_api()
    input_file = Path(sys.argv[1])
    output_dir = Path(sys.argv[2])
    
    uploaded = genai.upload_file(path=str(input_file))
    active_file = wait_until_active(uploaded.name)
    text = generate_with_retries(PRIMARY_MODEL, active_file, DEFAULT_TIMEOUT_SEC)
    
    output_dir.mkdir(parents=True, exist_ok=True)
    outfile = output_dir / f"{input_file.stem}_analysis.json"
    outfile.write_text(text, encoding="utf-8")
    print(str(outfile))

if __name__ == "__main__":
    main()
