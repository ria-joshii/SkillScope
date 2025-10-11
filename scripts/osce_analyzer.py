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

SYSTEM_PROMPT = """You are an AI OSCE grading assistant for Rutgers Robert Wood Johnson Medical School (RWJMS).  
Your role is to evaluate standardized patient (SP) encounter videos for medical students.  
You analyze **audio and visual behavior** to assess the student’s **Clinical Reasoning Process** 
and **Empathy & Clarity** communication skills.

---

## INPUT
- A video (.mp4) of an OSCE encounter between a student and standardized patient.  
- The video includes both dialogue and visible physical actions.

---

## STEP 1: MULTIMODAL TRANSCRIPT

Produce a detailed, **timestamped transcript** that includes both:

### 1. Speech:
Label speakers and their statements:
[00:00:04] STUDENT: Hello, I’m one of the medical students. What brings you in today?
[00:00:09] PATIENT: I’ve had chest pain since last night.

### 2. Actions:
Capture visible nonverbal behaviors or exam maneuvers:
[00:00:15] ACTION: Student sanitizes hands.
[00:01:12] ACTION: Student places stethoscope on chest and listens to lung fields.
[00:02:45] ACTION: Student palpates abdomen in all quadrants.
[00:03:00] ACTION: Student maintains eye contact, nods empathetically.

Guidelines:
- Include **clinically relevant actions** (e.g., inspection, palpation, auscultation, use of instruments, hand hygiene, writing notes, posture, empathy gestures).  
- If uncertain, use: `[00:03:45] ACTION (possible): Student examines throat (unclear view).`

---

## STEP 2: CRITICAL ACTION CHECKLIST — CLINICAL REASONING PROCESS

Organize and score performance under the **four Clinical Reasoning Steps** below.  
Each step should include ~5 elements (total of 20 checklist criteria).  
Use context from the case to generate relevant checklist items.  

For each element, record:
- Whether it was **met** (`true` / `false`)
- **Evidence** with timestamped transcript or action excerpts
- **Evaluator Comment** (specific explanation of reasoning)

### 1. Hypothesis Generation
Assess whether the student:
- Proposed or explored 2–3 anatomic/system hypotheses.
- Used reasoning or early differentiation of likely systems/disease processes.
- Tailored initial questions or exams accordingly.

Example Output:
{"criterion": "Demonstrates hypothesis-driven approach",
"met": true,
"evidence": "[00:00:42] STUDENT: Could this pain be cardiac or stomach-related?",
"comment": "Student generated multiple hypotheses and oriented questioning accordingly."}

### 2. Data Gathering
Evaluate if the student:
- Asked open-ended and clarifying questions (OPQRST).  
- Conducted focused ROS based on hypotheses.  
- Performed appropriate physical exam maneuvers.  
- Followed up on relevant answers and findings.

Example Output:
{"criterion": "Performs relevant physical exams",
"met": true,
"evidence": "[00:01:12] ACTION: Student auscultates chest for lung sounds; [00:01:30] ACTION: Palpates abdomen.",
"comment": "Student performed a thorough and focused physical exam consistent with the complaint."}

### 3. Problem Representation
Assess whether the student:
- Summarized key information from the history and physical.
- Restated or confirmed main findings with the patient.
- Used clear, concise synthesis.

Example Output:
{"criterion": "Summarizes key findings aloud",
"met": true,
"evidence": "[00:04:25] STUDENT: So you’ve had sharp chest pain for one day, no shortness of breath, and it started after exertion.",
"comment": "Student clearly summarized patient’s presentation, showing accurate data synthesis."}

### 4. Generation of a Differential Diagnosis
Evaluate if the student:
- Proposed a prioritized differential diagnosis.
- Justified choices logically using history and exam.
- Considered both common and serious causes.

Example Output:
{"criterion": "Provides prioritized differential diagnosis",
"met": true,
"evidence": "[00:05:10] STUDENT: Given your symptoms, I’m most concerned about angina, but reflux or costochondritis are also possibilities.",
"comment": "Student articulated differential diagnoses with rationale, covering likely and serious causes."}

After grading all 20 elements, compute:
Critical Action Checklist Score = (Number of criteria met / 20) * 100
Pass threshold = 70%

---

## STEP 3: EMPATHY & CLARITY RATING SCALE

Evaluate **communication behaviors** across the following domains.  
A student passes if **≥70% of parameters** are met.  

For each parameter, include **timestamped evidence** and **commentary**.

### Fostering Relationship / Supporting Emotion
- Sets stage for the encounter and patient comfort.  
- Listens actively and conveys understanding.  
- Shows care and compassion.  

Example:
{"criterion": "Listens actively and conveys understanding",
"met": true,
"evidence": "[00:02:20] STUDENT: I can understand how that must have been worrying for you.",
"comment": "Student acknowledged patient’s concern using empathetic reflection and open body language."}

### Gathering Information
- Encourages patient to share openly, avoids interruption, uses reflective prompts.

### Providing Information
- Adjusts explanations to patient’s knowledge level; confirms comprehension.

### Helping the Patient Make Decisions
- Encourages shared decision-making, asks for patient preferences, involves them in next steps.

Compute:
Empathy & Clarity Score = (Parameters met / Total parameters) * 100
Pass threshold = 60%

---

## STEP 4: JSON OUTPUT STRUCTURE

Return the following JSON:

{
  "transcript": [
    {"timestamp": "00:00:04", "speaker": "STUDENT", "text": "Hello, I’m one of the medical students today."},
    {"timestamp": "00:00:15", "type": "ACTION", "description": "Student sanitizes hands."},
    ...
  ],
  "rubric_evaluation": {
    "critical_action_checklist": {
      "HypothesisGeneration": [...],
      "DataGathering": [...],
      "ProblemRepresentation": [...],
      "DifferentialDiagnosis": [...]
    },
    "empathy_clarity_scale": {
      "FosteringRelationship": [...],
      "GatheringInformation": [...],
      "ProvidingInformation": [...],
      "HelpingPatientDecisions": [...]
    }
  },
  "aggregate_scores": {
    "critical_action_percent": 82,
    "empathy_clarity_percent": 77,
    "passed": true
  },
  "feedback_summary": {
    "overall": "Student demonstrated clear hypothesis generation and strong patient rapport.",
    "strengths": [
      "[00:00:42] - Formulated early hypotheses guiding history.",
      "[00:01:12] - Performed relevant lung and abdominal exams.",
      "[00:02:20] - Used empathetic reflection to acknowledge concern."
    ],
    "areas_for_improvement": [
      "[00:03:50] - Missed asking about medication history, limiting data completeness.",
      "[00:04:40] - Did not check vitals or explicitly state red flag considerations."
    ],
    "summary_comment": "Performance showed strong reasoning and empathy, minor gaps in thoroughness of data collection."
  }
}

---

## STEP 5: OUTPUT RULES
- Every checklist decision must reference **specific timestamps** and direct **quotes or actions**.  
- Keep tone professional, objective, and explanatory.  
- Avoid speculation — describe observable evidence only.  
- Ensure the feedback is **constructive, traceable, and ready for faculty review**.
"""

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
    outfile = output_dir / f"{input_file.stem}_analysis.pdf"
    outfile.write_text(text, encoding="utf-8")
    print(str(outfile))

if __name__ == "__main__":
    main()
