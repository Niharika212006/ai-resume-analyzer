from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq
import google.generativeai as genai
import os
import json

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://ai-resume-analyzer-seven-amber-32.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


class ResumeRequest(BaseModel):
    resumeText: str
    jobRole: str
    jobDescription: str = ""

@app.get("/")
def home():
    return {"message": "AI Resume Analyzer Backend Running"}


@app.post("/analyze")
def analyze_resume(data: ResumeRequest):
    try:
        client = Groq(
            api_key=os.getenv("GROQ_API_KEY")
        )

        prompt = f"""
You are an expert ATS (Applicant Tracking System) resume reviewer used by top tech companies.
Target Job Role: {data.jobRole}
Analyze the resume carefully and realistically.

Scoring Rules:
- ATS Score must be between 0 and 100.
- Do NOT give extremely low scores unless the resume is truly poor.
- Consider:
  * Education
  * Skills
  * Projects
  * Internships / Experience
  * Certifications
  * Achievements
  * Resume Structure
  * Technical Keywords
  * Impact and Quantified Results
For the selected job role:

- Evaluate how well the resume matches the role.
- Mention role-specific strengths.
- Mention role-specific weaknesses.
- Mention missing skills important for this role.
- Give suggestions specifically for this role.

If a Job Description is provided:

- Compare the resume against the job description.
- Calculate a matchScore between 0 and 100.
- Identify matchingSkills from the resume.
- Identify missingSkills that appear important in the job description but are absent from the resume.
- Give suggestions to improve the match score.

Score Guidelines:
- 90-100 = Outstanding resume, interview-ready.
- 80-89 = Strong resume with minor improvements needed.
- 70-79 = Good resume but missing some important elements.
- 60-69 = Average resume requiring improvements.
- Below 60 = Weak resume with major gaps.

IMPORTANT:
Do not write any explanation.
Do not write any text before or after the JSON.
Return ONLY a JSON object.

{{
    "atsScore": 0,
    "potentialScore": 0,
    "matchScore": 0,
    "summary": "",
    "strengths": [],
    "weaknesses": [],
    "matchingSkills": [],
    "missingSkills": [],
    "missingKeywords": [],
    "suggestions": []
}}

Rules:
- summary is REQUIRED.
- summary must contain 2-3 professional sentences.
- Do not leave summary empty.
- Do not omit any field.

Requirements:
- Provide 4-6 strengths.
- Provide 3-5 weaknesses.
- Provide 5-10 missing keywords important for the selected role.
- Provide 5 actionable suggestions.
- potentialScore must be greater than atsScore.
- ATS score should be realistic and consistent with the resume quality.
- Every field in the JSON must be present.

Resume:

{data.resumeText}

Job Description:

{data.jobDescription}
"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        result = response.choices[0].message.content

        result = result.replace("```json", "")
        result = result.replace("```", "")
        result = result.strip()

        start = result.find("{")
        end = result.rfind("}") + 1

        json_text = result[start:end]

        analysis = json.loads(json_text)

        return analysis

    except Exception as e:
        return {
            "error": str(e)
        }


@app.get("/test-gemini")
def test_gemini():
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")

        response = model.generate_content(
            "Say hello to Niharika in one sentence."
        )

        return {
            "response": response.text
        }

    except Exception as e:
        return {
            "error": str(e)
        }


@app.get("/models")
def list_models():
    try:
        models = []

        for model in genai.list_models():
            models.append(model.name)

        return {
            "models": models
        }

    except Exception as e:
        return {
            "error": str(e)
        }


@app.get("/test-groq")
def test_groq():
    try:
        client = Groq(
            api_key=os.getenv("GROQ_API_KEY")
        )

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": "Say hello to Niharika in one sentence."
                }
            ]
        )

        return {
            "response": response.choices[0].message.content
        }

    except Exception as e:
        return {
            "error": str(e)
        }