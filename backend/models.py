from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class LegalProvision(BaseModel):
    id: str
    act: str
    section: str
    title: str
    summary: str
    key_provisions: List[str] = Field(default_factory=list)
    remedy: Optional[str] = None
    category: str
    score: Optional[float] = None

class RightItem(BaseModel):
    title: str = Field(..., description="Short title of the right, e.g. Right to Immediate Security Deposit Refund")
    act_citation: str = Field(..., description="Legal act and section, e.g. Section 13, Model Tenancy Act, 2021")
    explanation: str = Field(..., description="Plain-language explanation of how this right applies to the user's dispute")
    applicability: str = Field(..., description="High, Medium, or General")

class NextStepItem(BaseModel):
    step_number: int
    title: str = Field(..., description="Short action name, e.g. Issue Formal Legal Notice")
    action_type: str = Field(..., description="Notice / Grievance Portal / Authority Filing / Evidence Gathering")
    description: str = Field(..., description="Clear instructions on how to execute this step")
    timeline: str = Field(..., description="e.g. Within 7-15 days or Immediate")
    authority_or_platform: Optional[str] = Field(None, description="e.g. E-Daakhil Portal / Rent Authority / Labour Commissioner")
    draft_template: Optional[str] = Field(None, description="Optional brief draft/text snippet for the user to copy or adapt")

class RTIDraft(BaseModel):
    is_applicable: bool = Field(..., description="Whether an RTI application is relevant to this dispute")
    reason_for_applicability: Optional[str] = Field(None, description="Why an RTI is helpful or why not")
    public_authority_name: Optional[str] = Field(None, description="E.g. Municipal Corporation / Public Works Dept / Labour Ministry")
    public_information_officer_title: Optional[str] = Field(None, description="The Public Information Officer, [Name of Department/Ministry]")
    subject: Optional[str] = Field(None, description="Subject line for RTI application under Section 6(1)")
    questions_sought: List[str] = Field(default_factory=list, description="Specific pinpointed questions to seek in the RTI")
    sample_draft_text: Optional[str] = Field(None, description="Full formatted RTI application draft ready to copy or download")
    filing_instructions: Optional[str] = Field(None, description="Instructions on paying ₹10 fee via IPO/online portal rtionline.gov.in")
    portal_url: Optional[str] = Field("https://rtionline.gov.in", description="Direct official portal link")

class DisputeAnalysisRequest(BaseModel):
    dispute_text: str = Field(..., min_length=5, description="Plain language description of the dispute")
    category: Optional[str] = Field("auto", description="tenant | consumer | workplace | rti | auto")
    context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Optional additional context like state, city, amount")

class DisputeAnalysisResponse(BaseModel):
    query: str
    detected_category: str
    summary: str
    rights_explanation: List[RightItem]
    next_steps: List[NextStepItem]
    rti_draft: RTIDraft
    relevant_provisions: List[LegalProvision]
    disclaimer: str = (
        "IMPORTANT DISCLAIMER: Rights Navigator is an educational and informational tool designed "
        "to help citizens understand statutory provisions and dispute processes in plain language. "
        "This output does not constitute formal legal advice or create an attorney-client relationship. "
        "For complex disputes or litigation, please consult an advocate licensed with the Bar Council of India."
    )
    provider_used: str

class ChatMessage(BaseModel):
    role: str = Field(..., description="user | assistant | system")
    content: str

class FollowUpChatRequest(BaseModel):
    dispute_context: str
    conversation_history: List[ChatMessage]
    user_message: str

class FollowUpChatResponse(BaseModel):
    reply: str
    relevant_citations: List[str] = Field(default_factory=list)
    suggested_actions: List[str] = Field(default_factory=list)
    disclaimer: str = "Informational guidance only. Not legal advice."
