import json
import logging
from typing import Dict, Any, List
from backend.models import (
    DisputeAnalysisRequest,
    DisputeAnalysisResponse,
    RightItem,
    NextStepItem,
    RTIDraft,
    FollowUpChatRequest,
    FollowUpChatResponse,
    LegalProvision
)
from backend.retriever import retriever
from backend.llm.factory import get_llm_client

logger = logging.getLogger("rights_navigator")

SYSTEM_PROMPT = """You are Rights Navigator, an expert Indian Legal Rights & Citizen Empowerment Assistant.
Your mission is to help Indian citizens understand their statutory rights in plain, accessible language and provide concrete, pragmatic next steps.

Focus Domains:
1. Tenant Rights (Model Tenancy Act, 2021, Transfer of Property Act, State Rent Control Acts)
2. Consumer Protection (Consumer Protection Act, 2019, E-Commerce Rules, 2020, CCPA Guidelines)
3. Workplace Rights (Payment of Wages Act, POSH Act, 2013, Maternity Benefit Act, Industrial Disputes Act, State Shops & Establishments)
4. Right to Information (RTI Act, 2005 - Section 6, 7, 19, 20)

OUTPUT REQUIREMENTS:
You MUST output a single valid JSON object containing exactly these fields:
{
  "summary": "1-2 sentence plain-language summary of the dispute and legal situation",
  "rights_explanation": [
    {
      "title": "Clear right name (e.g. Right to Security Deposit Refund)",
      "act_citation": "Exact Act and Section (e.g. Section 13, Model Tenancy Act, 2021)",
      "explanation": "Clear, jargon-free explanation of how this right protects the citizen in their specific scenario",
      "applicability": "High | Medium | General"
    }
  ],
  "next_steps": [
    {
      "step_number": 1,
      "title": "Action title (e.g. Issue Formal Legal Demand Notice)",
      "action_type": "Notice | Grievance Portal | Authority Filing | Evidence Gathering",
      "description": "Step-by-step pragmatic instructions on what to do, where to file, and what proof to keep",
      "timeline": "Timeline to act or expected resolution window (e.g. Within 7 days / 15-day notice)",
      "authority_or_platform": "Name of portal, authority, or agency (e.g. National Consumer Helpline / E-Daakhil / Rent Authority)",
      "draft_template": "Draft notice or application text template for user to copy/adapt if applicable, otherwise null"
    }
  ],
  "rti_draft": {
    "is_applicable": true or false,
    "reason_for_applicability": "Explanation why an RTI is helpful or why not",
    "public_authority_name": "Target department/body (or null)",
    "public_information_officer_title": "The Public Information Officer (or null)",
    "subject": "Formal RTI Subject line under Section 6(1)",
    "questions_sought": [
      "1. Certified copy of ...",
      "2. Specific inquiry on ..."
    ],
    "sample_draft_text": "Complete, ready-to-use formatted RTI application letter",
    "filing_instructions": "Fee instructions (₹10 postal order/UPI on rtionline.gov.in) and dispatch guide",
    "portal_url": "https://rtionline.gov.in"
  }
}

Guidelines:
- 2 to 4 clear next steps. Step 1 is usually informal/formal notice or grievance portal, Step 2 is statutory filing/conciliation, Step 3 is higher tribunal/appeal.
- Generate an RTI draft whenever a public authority, municipal board, PSU, public utility, or statutory regulator is relevant.
- Always use authentic Indian statutes and sections.
- Tone: Empathetic, empowering, objective, legally sound, and accessible.
"""

class NavigatorService:
    def __init__(self):
        pass

    async def analyze_dispute(self, request: DisputeAnalysisRequest) -> DisputeAnalysisResponse:
        # 1. Detect Category
        detected_category = (
            request.category
            if request.category and request.category != "auto"
            else retriever.detect_category(request.dispute_text)
        )
        
        # 2. Retrieve Relevant Legal Sections
        retrieved_provisions = retriever.retrieve(
            query=request.dispute_text,
            category=detected_category,
            top_k=4
        )
        
        # Format retrieved knowledge for prompt context
        knowledge_context = "\n\n".join([
            f"--- PROVISION: {p.act} ({p.section}) ---\n"
            f"Title: {p.title}\n"
            f"Summary: {p.summary}\n"
            f"Key Points: {'; '.join(p.key_provisions)}\n"
            f"Remedy: {p.remedy}"
            for p in retrieved_provisions
        ])
        
        user_prompt = f"""
USER DISPUTE DESCRIPTION:
\"\"\"{request.dispute_text}\"\"\"

DETECTED CATEGORY: {detected_category}

RELEVANT SECTIONS FROM INDIAN LEGAL KNOWLEDGE BASE:
{knowledge_context}

Please analyze the citizen's dispute, explain their rights, provide 2-3 concrete actionable next steps with draft templates where helpful, and prepare an auto-filled RTI application draft if relevant.
"""
        # 3. Call LLM
        client = get_llm_client()
        provider_name = client.provider_name
        
        try:
            raw_data = await client.generate_structured(
                system_prompt=SYSTEM_PROMPT,
                user_prompt=user_prompt
            )
        except Exception as e:
            logger.error(f"Error generating LLM response from {provider_name}: {e}. Falling back to Mock.")
            from backend.llm.mock_client import MockLLMClient
            mock_client = MockLLMClient()
            raw_data = await mock_client.generate_structured(SYSTEM_PROMPT, user_prompt)
            provider_name = f"{provider_name} (Fallback to Mock due to error: {str(e)[:40]}...)"
            
        # 4. Parse & Validate into Pydantic models
        rights_items = []
        for r in raw_data.get("rights_explanation", []):
            rights_items.append(RightItem(
                title=r.get("title", "Statutory Right"),
                act_citation=r.get("act_citation", "Indian Legal Framework"),
                explanation=r.get("explanation", ""),
                applicability=r.get("applicability", "High")
            ))
            
        next_step_items = []
        for idx, step in enumerate(raw_data.get("next_steps", []), 1):
            next_step_items.append(NextStepItem(
                step_number=step.get("step_number", idx),
                title=step.get("title", f"Step {idx}"),
                action_type=step.get("action_type", "Action"),
                description=step.get("description", ""),
                timeline=step.get("timeline", "Immediate"),
                authority_or_platform=step.get("authority_or_platform"),
                draft_template=step.get("draft_template")
            ))
            
        rti_raw = raw_data.get("rti_draft", {})
        rti_draft = RTIDraft(
            is_applicable=rti_raw.get("is_applicable", False),
            reason_for_applicability=rti_raw.get("reason_for_applicability"),
            public_authority_name=rti_raw.get("public_authority_name"),
            public_information_officer_title=rti_raw.get("public_information_officer_title"),
            subject=rti_raw.get("subject"),
            questions_sought=rti_raw.get("questions_sought", []),
            sample_draft_text=rti_raw.get("sample_draft_text"),
            filing_instructions=rti_raw.get("filing_instructions"),
            portal_url=rti_raw.get("portal_url", "https://rtionline.gov.in")
        )
        
        return DisputeAnalysisResponse(
            query=request.dispute_text,
            detected_category=detected_category,
            summary=raw_data.get("summary", "Analysis of your dispute under applicable Indian laws."),
            rights_explanation=rights_items,
            next_steps=next_step_items,
            rti_draft=rti_draft,
            relevant_provisions=retrieved_provisions,
            provider_used=provider_name
        )

    async def handle_chat(self, request: FollowUpChatRequest) -> FollowUpChatResponse:
        client = get_llm_client()
        system_prompt = (
            "You are Rights Navigator AI assistant answering follow-up questions regarding an Indian legal dispute. "
            "Provide helpful, practical, and legally grounded answers referencing Indian laws (Tenant law, Consumer Protection 2019, Workplace Acts, RTI 2005). "
            "Keep the tone polite, clear, and reassuring."
        )
        
        full_user_msg = f"DISPUTE CONTEXT:\n{request.dispute_context}\n\nUSER QUESTION:\n{request.user_message}"
        
        reply = await client.chat(
            system_prompt=system_prompt,
            messages=request.conversation_history,
            user_message=full_user_msg
        )
        
        return FollowUpChatResponse(
            reply=reply,
            relevant_citations=[],
            suggested_actions=[]
        )

navigator_service = NavigatorService()
