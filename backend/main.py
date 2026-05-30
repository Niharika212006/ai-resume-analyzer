from fastapi import FastAPI
from dotenv import load_dotenv
import google.generativeai as genai
import os
from fastapi.middleware.cors import CORSMiddleware
load_dotenv()
print("API KEY =", os.getenv("GEMINI_API_KEY"))
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

@app.get("/")
def home():
    return {"message": "AI Resume Analyzer Backend Running"}
from fastapi import FastAPI
from pydantic import BaseModel

class ResumeRequest(BaseModel):
    resumeText: str

@app.post("/analyze")
def analyze_resume(data: ResumeRequest):

    text = data.resumeText.lower()

    score = 50

    keywords = []

    tech_keywords = [
        "python",
        "java",
        "react",
        "git",
        "fastapi",
        "sql",
        "javascript",
        "html",
        "css",
        "machine learning",
        "ai"
    ]

    for keyword in tech_keywords:
        if keyword in text:
            keywords.append(keyword.title())
            score += 4

    word_count = len(data.resumeText.split())

    if "project" in text:
        score += 5

    if "internship" in text:
        score += 5

    if "github" in text:
        score += 3

    if "skills" in text:
        score += 3

    if "education" in text:
        score += 3

    if "experience" in text:
        score += 5

    if word_count > 100:
        score += 10

    if word_count > 200:
        score += 10

    score = min(score, 100)

    if score >= 85:
        grade = "A"
    elif score >= 70:
        grade = "B"
    elif score >= 55:
        grade = "C"
    else:
        grade = "D"

    suggestions = []
    if "project" not in text:
        suggestions.append("Add project details.")
        
    if "skills" not in text:
        suggestions.append("Add a dedicated Skills section.")

    if "education" not in text:
        suggestions.append("Add your Education section.")

    if "experience" not in text:
        suggestions.append("Add your Experience section.")

    if "certification" not in text and "certifications" not in text:
        suggestions.append("Add certifications to strengthen your resume.")

    if "internship" not in text:
        suggestions.append("Mention internships or practical experience.")

    if "github" not in text:
        suggestions.append("Add your GitHub profile.")

    if "achievement" not in text:
        suggestions.append("Mention measurable achievements.")

    if len(suggestions) == 0:
        suggestions.append("Great resume. Keep improving your project portfolio.")

    return {
        "grade": grade,
        "score": score,
        "wordCount": word_count,
        "keywordMatches": keywords,
        "suggestions": suggestions
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
        return {"models": models}
    except Exception as e:
        return {"error": str(e)}