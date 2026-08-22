from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List

from backend.config import settings
from backend.models import (
    DisputeAnalysisRequest,
    DisputeAnalysisResponse,
    FollowUpChatRequest,
    FollowUpChatResponse,
    LegalProvision
)
from backend.navigator_service import navigator_service
from backend.retriever import retriever
from backend.llm.factory import get_llm_client

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="FastAPI Backend for Rights Navigator - Indian Citizen Legal Rights Assistant"
)

# Enable CORS for frontend development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "app": settings.APP_NAME,
        "status": "online",
        "docs": "/docs",
        "llm_provider": settings.LLM_PROVIDER
    }

@app.get("/api/health")
def get_health():
    client = get_llm_client()
    return {
        "status": "healthy",
        "llm_provider": settings.LLM_PROVIDER,
        "active_client": client.provider_name,
        "has_gemini_key": bool(settings.GEMINI_API_KEY),
        "has_openai_key": bool(settings.OPENAI_API_KEY),
        "has_anthropic_key": bool(settings.ANTHROPIC_API_KEY),
        "data_provisions_count": len(retriever.get_all_provisions())
    }

@app.get("/api/categories")
def get_categories():
    return {
        "categories": [
            {
                "id": "tenant",
                "label": "Tenant Rights",
                "icon": "Home",
                "badge": "Model Tenancy Act & Rent Control",
                "description": "Security deposit refunds, illegal eviction threats, maintenance disputes, arbitrary rent hikes.",
                "examples": [
                    "Landlord is refusing to return my ₹50,000 security deposit after vacating flat with 1 month notice.",
                    "Owner gave 2 days notice to vacate the apartment and threatened to disconnect water and power.",
                    "Severe bathroom water leakage in rented flat, landlord refuses to repair or allow deduction from rent."
                ]
            },
            {
                "id": "consumer",
                "label": "Consumer Protection",
                "icon": "ShoppingBag",
                "badge": "Consumer Protection Act 2019",
                "description": "Defective electronics, denied refunds, e-commerce dark patterns, unfair service charges, flight cancellations.",
                "examples": [
                    "Bought a smartphone on an online sale, received a defective unit and customer care is refusing return or replacement.",
                    "Airline cancelled my flight unilaterally and only offering credit shell instead of bank refund.",
                    "Health insurance company rejected cashless claim citing arbitrary pre-existing condition after 6 years of active policy."
                ]
            },
            {
                "id": "workplace",
                "label": "Workplace & Employment",
                "icon": "Briefcase",
                "badge": "Payment of Wages & Labour Laws",
                "description": "Unpaid salary, withheld relieving letters, illegal termination, POSH harassment, maternity pay.",
                "examples": [
                    "Resigned after serving full 30 days notice period, but company is withholding my final month salary and relieving letter.",
                    "Terminated abruptly without notice pay or retrenchment compensation after 2 years of continuous service.",
                    "Employer refusing 26 weeks paid maternity leave claiming company policy only offers 12 weeks."
                ]
            },
            {
                "id": "rti",
                "label": "Right to Information (RTI)",
                "icon": "FileText",
                "badge": "RTI Act 2005",
                "description": "Public works tenders, road repair delays, exam copies, pending pension, municipal budgets.",
                "examples": [
                    "Municipal corporation dug up road 6 months ago and left it incomplete. Need contractor name, sanctioned budget, and completion deadline.",
                    "Applied for government service verification 3 months ago with no progress; seeking file notes and timeline reasons.",
                    "Need certified copy of sanctioned building plan and property tax records for civic layout."
                ]
            }
        ]
    }

@app.post("/api/analyze", response_model=DisputeAnalysisResponse)
async def analyze_dispute(request: DisputeAnalysisRequest):
    if not request.dispute_text or len(request.dispute_text.strip()) < 5:
        raise HTTPException(status_code=400, detail="Please provide a valid dispute description.")
    try:
        response = await navigator_service.analyze_dispute(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/api/chat", response_model=FollowUpChatResponse)
async def follow_up_chat(request: FollowUpChatRequest):
    try:
        response = await navigator_service.handle_chat(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {str(e)}")

@app.get("/api/knowledge", response_model=List[LegalProvision])
def get_knowledge_base():
    return retriever.get_all_provisions()
