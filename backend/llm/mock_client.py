import re
from typing import Dict, Any, List, Optional
from backend.llm.base import BaseLLMClient
from backend.models import ChatMessage

class MockLLMClient(BaseLLMClient):
    """
    Intelligent offline mock LLM client for seamless local development, testing,
    and fallback when no API key is provided.
    Generates rich, realistic Indian statutory analysis and RTI drafts.
    """
    @property
    def provider_name(self) -> str:
        return "Mock Provider (Offline Development Mode)"

    async def generate_structured(
        self,
        system_prompt: str,
        user_prompt: str,
        response_schema: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        # Extract detected category if present in the prompt
        cat_match = re.search(r"DETECTED CATEGORY:\s*(\w+)", user_prompt, re.IGNORECASE)
        detected_cat = cat_match.group(1).lower() if cat_match else "general"

        # Also extract user dispute description if present
        disp_match = re.search(r'USER DISPUTE DESCRIPTION:\s*"""(.*?)"""', user_prompt, re.DOTALL)
        query = (disp_match.group(1) if disp_match else user_prompt).lower()

        if detected_cat == "tenant":
            return self._generate_tenant_mock(query)
        elif detected_cat == "consumer":
            return self._generate_consumer_mock(query)
        elif detected_cat == "workplace":
            return self._generate_workplace_mock(query)
        elif detected_cat == "rti":
            return self._generate_rti_mock(query)

        # Fallback to keyword matching on query text only
        is_tenant = any(w in query for w in ["rent", "deposit", "landlord", "flat", "tenant", "evict", "house", "owner"])
        is_consumer = any(w in query for w in ["amazon", "flipkart", "order", "refund", "defective", "damaged", "warranty", "seller", "product", "refrigerator", "laptop", "flight", "washing machine"])
        is_workplace = any(w in query for w in ["salary", "wages", "unpaid", "relieving", "experience letter", "notice period", "fired", "posh", "harassment", "employer", "job", "maternity", "fnf"])
        is_rti = any(w in query for w in ["rti", "road", "tender", "contractor", "municipal", "officer", "scheme", "exam", "pension", "delay"])

        if is_tenant:
            return self._generate_tenant_mock(query)
        elif is_consumer:
            return self._generate_consumer_mock(query)
        elif is_workplace:
            return self._generate_workplace_mock(query)
        elif is_rti:
            return self._generate_rti_mock(query)
        else:
            return self._generate_general_mock(query)

    def _generate_tenant_mock(self, query: str) -> Dict[str, Any]:
        return {
            "summary": "Your dispute concerns landlord-tenant obligations in India, specifically regarding security deposit refund, tenancy agreements, or tenancy rights.",
            "rights_explanation": [
                {
                    "title": "Right to Full Security Deposit Refund",
                    "act_citation": "Section 13, Model Tenancy Act, 2021 & State Rent Control Acts",
                    "explanation": "A landlord is legally required to refund the security deposit to the tenant upon handing over vacant possession of the premises. Arbitrary deductions without prior written notice and itemized proof of damages beyond ordinary wear and tear are strictly illegal.",
                    "applicability": "High"
                },
                {
                    "title": "Protection Against Arbitrary Eviction & Lockouts",
                    "act_citation": "Section 20 & 21, Model Tenancy Act, 2021",
                    "explanation": "A landlord cannot arbitrarily evict a tenant or cut off essential supplies (water, electricity, access) without obtaining an explicit eviction decree from the Rent Court/Authority following due process.",
                    "applicability": "High"
                },
                {
                    "title": "Right to 24-Hour Notice for Entry",
                    "act_citation": "Section 15, Model Tenancy Act, 2021",
                    "explanation": "The landlord or property manager must provide at least 24 hours prior notice before inspecting the rented premises or undertaking repairs.",
                    "applicability": "Medium"
                }
            ],
            "next_steps": [
                {
                    "step_number": 1,
                    "title": "Send Formal Demand Notice to Landlord",
                    "action_type": "Notice",
                    "description": "Send a registered notice (via WhatsApp/Email and Speed Post) demanding the full refund of the security deposit within 15 days, citing Section 13 of the Model Tenancy Act.",
                    "timeline": "Immediate (within 1-3 days)",
                    "authority_or_platform": "Direct Communication / Speed Post",
                    "draft_template": "Subject: Formal Demand Notice for Immediate Refund of Security Deposit for [Address]\n\nDear [Landlord Name],\nI vacated premises [Address] on [Date] after providing mandatory notice and handing over keys. Under Section 13 of the Model Tenancy Act, you are obligated to refund the full security deposit of ₹[Amount] immediately. Please credit ₹[Amount] to my bank account within 15 days of this notice, failing which I will initiate legal recovery proceedings before the Rent Authority with 18% statutory interest and litigation damages."
                },
                {
                    "step_number": 2,
                    "title": "File Petition with the Rent Authority / Tribunal",
                    "action_type": "Authority Filing",
                    "description": "If the landlord fails to refund within the 15-day notice window, submit an application for recovery of security deposit with interest before the local Rent Authority / Sub-Divisional Magistrate (SDM) or District Consumer Commission.",
                    "timeline": "After 15 days of notice expiration",
                    "authority_or_platform": "District Rent Authority / Rent Court",
                    "draft_template": None
                },
                {
                    "step_number": 3,
                    "title": "Police Complaint for Criminal Breach of Trust / Trespass (If Lockout/Harassment)",
                    "action_type": "Authority Filing",
                    "description": "If the landlord attempts unlawful lockout or criminal intimidation, file a police complaint at the local police station under Section 316 (Criminal Breach of Trust) / Section 329 (Criminal Trespass) of the Bharatiya Nyaya Sanhita (BNS).",
                    "timeline": "As needed upon threat of eviction",
                    "authority_or_platform": "Local Police Station",
                    "draft_template": None
                }
            ],
            "rti_draft": {
                "is_applicable": True,
                "reason_for_applicability": "If the rented property is under a municipal housing board, government quarters, or if you need certified property tax and sanction records to verify the landlord's legal title.",
                "public_authority_name": "Municipal Corporation / Local Development Authority",
                "public_information_officer_title": "The Public Information Officer (Town Planning / Revenue Dept), [Municipal Corporation Name]",
                "subject": "Application under Section 6(1) of the RTI Act, 2005 for Property Sanction & Tax Records for [Property Address]",
                "questions_sought": [
                    "1. Certified copy of the approved building plan and occupancy certificate (OC) for property at [Address].",
                    "2. Details of property tax assessment and pending dues registered against property [Address].",
                    "3. Whether any unauthorized construction or zoning violation notice has been issued for the said premises."
                ],
                "sample_draft_text": "To,\nThe Public Information Officer (RTI Cell),\n[Municipal Corporation / Town Planning Dept],\n[City, State - PIN]\n\n1. Name of the Applicant: [Your Full Name]\n2. Address: [Your Residential Address]\n3. Contact: [Phone & Email]\n\nSubject: Application under Section 6(1) of the Right to Information Act, 2005.\n\nRespected Sir/Madam,\nKindly provide the following certified information regarding Property No. [Address / Khata No]:\n1. Certified copy of the Sanctioned Building Plan and Occupancy Certificate.\n2. Certified record of property tax assessment number and registered owner details.\n3. Inspection reports, if any, conducted by the municipal authorities on this premises.\n\nI have deposited the statutory application fee of ₹10 via [IPO No. / Online Portal Receipt No.].\n\nDate: [Current Date]\nPlace: [City]\n\nSincerely,\n[Your Name]",
                "filing_instructions": "Submit online at rtionline.gov.in (for Central/UT) or your State RTI portal. For offline submission, print draft, attach a ₹10 Indian Postal Order (IPO) or court stamp, and send via Speed Post.",
                "portal_url": "https://rtionline.gov.in"
            }
        }

    def _generate_consumer_mock(self, query: str) -> Dict[str, Any]:
        return {
            "summary": "Your dispute relates to consumer rights in India regarding defective products, deficient after-sales service, unfair e-commerce trade practices, or denied refunds.",
            "rights_explanation": [
                {
                    "title": "Right to Full Refund or Replacement for Defective Goods",
                    "act_citation": "Section 2(47) & Section 35, Consumer Protection Act, 2019",
                    "explanation": "Under Indian consumer law, selling a defective product or refusing to honor warranty/replacement terms constitutes 'Deficiency of Service' and 'Unfair Trade Practice'. You have the right to a full refund, replacement, and compensation.",
                    "applicability": "High"
                },
                {
                    "title": "Mandatory E-Commerce Grievance Redressal",
                    "act_citation": "Rule 4 & 5, Consumer Protection (E-Commerce) Rules, 2020",
                    "explanation": "E-commerce platforms are statutorily required to appoint a Grievance Officer who must acknowledge complaints within 48 hours and resolve them within 30 days. Unilateral cancellation penalties on consumers are prohibited.",
                    "applicability": "High"
                },
                {
                    "title": "Product Liability Against Manufacturer & Seller",
                    "act_citation": "Section 82-87, Consumer Protection Act, 2019",
                    "explanation": "Both the e-commerce platform and the manufacturer can be held jointly liable for manufacturing defects, deviation from advertised specifications, and harm caused by substandard products.",
                    "applicability": "Medium"
                }
            ],
            "next_steps": [
                {
                    "step_number": 1,
                    "title": "Lodge Grievance with National Consumer Helpline (NCH)",
                    "action_type": "Grievance Portal",
                    "description": "Call 1915 or register an online grievance on consumerhelpline.gov.in (or via WhatsApp to 8800001915). NCH has direct mediation channels with major companies and e-commerce platforms.",
                    "timeline": "Immediate (within 24 hours)",
                    "authority_or_platform": "National Consumer Helpline (NCH - 1915)",
                    "draft_template": "Order/Invoice ID: [Order No]\nProduct: [Product Name]\nIssue: Received damaged/defective product on [Date]. Seller/Platform has refused refund/replacement violating Consumer Protection (E-Commerce) Rules, 2020. Requesting immediate full refund of ₹[Amount] and compensation."
                },
                {
                    "step_number": 2,
                    "title": "Send Formal Legal Notice to Seller & Platform Grievance Officer",
                    "action_type": "Notice",
                    "description": "Send a formal legal notice giving 15 days to refund the amount with interest, warning of proceedings before the Consumer Disputes Redressal Commission.",
                    "timeline": "Within 3-5 days if NCH ticket is delayed",
                    "authority_or_platform": "Company Grievance Officer / Registered Email",
                    "draft_template": "To: Grievance Officer, [Company Name]\nSubject: Formal Legal Notice for Deficiency in Service & Unfair Trade Practice regarding Order #[Order No]\n\nSir/Madam,\nTake notice that I purchased [Product] on [Date] for ₹[Amount]. The product delivered was defective/damaged. Despite repeated requests, your team refused refund/replacement. This violates Section 2(47) of the Consumer Protection Act, 2019. You are hereby called upon to refund ₹[Amount] along with ₹5,000 for mental harassment within 15 days, failing which I will file a formal case on E-Daakhil."
                },
                {
                    "step_number": 3,
                    "title": "File Online Consumer Case on E-Daakhil Portal",
                    "action_type": "Authority Filing",
                    "description": "If unresolved, file an electronic complaint before the District Consumer Commission via the official E-Daakhil portal (edaakhil.nic.in) without requiring an advocate.",
                    "timeline": "After 15 days of notice expiration",
                    "authority_or_platform": "E-Daakhil Portal (edaakhil.nic.in)",
                    "draft_template": None
                }
            ],
            "rti_draft": {
                "is_applicable": True,
                "reason_for_applicability": "If the dispute involves a Public Sector Undertaking (e.g. IRCTC, Air India earlier, BSNL, PSU Banks, Nationalized Insurance companies) or if you need regulatory inspection records from BIS / FSSAI / CCPA.",
                "public_authority_name": "Bureau of Indian Standards (BIS) / Central Consumer Protection Authority (CCPA)",
                "public_information_officer_title": "The Public Information Officer, Central Consumer Protection Authority (CCPA)",
                "subject": "Application under Section 6(1) of RTI Act, 2005 regarding Consumer Grievance Action on [Company Name]",
                "questions_sought": [
                    "1. Certified copy of actions taken on Consumer Grievance Docket #[Docket No] registered against [Company Name].",
                    "2. Details of quality compliance and BIS certification issued for [Product Category/Model].",
                    "3. Total number of consumer unfair trade practice complaints received against [Company Name] in the current financial year."
                ],
                "sample_draft_text": "To,\nThe Public Information Officer,\nCentral Consumer Protection Authority (CCPA) / Ministry of Consumer Affairs,\nKrishi Bhawan, New Delhi - 110001\n\n1. Applicant Name: [Your Name]\n2. Address: [Your Full Address]\n3. Contact: [Phone Number]\n\nSubject: Information sought under Section 6(1) of the Right to Information Act, 2005.\n\nSir/Madam,\nPlease provide the following information under the RTI Act, 2005:\n1. Status and certified action-taken report on grievance registration number [Grievance No].\n2. Details of show-cause notices or advisories issued against [Company/Entity Name] regarding consumer violations.\n\nPrescribed fee of ₹10 is paid herewith.\n\nDate: [Date]\nPlace: [City]\n\n[Your Signature/Name]",
                "filing_instructions": "Submit online at rtionline.gov.in selecting Ministry of Consumer Affairs, Food and Public Distribution, or send offline via Speed Post with ₹10 IPO.",
                "portal_url": "https://rtionline.gov.in"
            }
        }

    def _generate_workplace_mock(self, query: str) -> Dict[str, Any]:
        return {
            "summary": "Your dispute relates to employment and workplace rights in India, covering unpaid wages, withheld relieving/experience letters, wrongful termination, or statutory workplace protections.",
            "rights_explanation": [
                {
                    "title": "Right to Timely Payment of Earned Wages & FnF Settlement",
                    "act_citation": "Section 5 & 15, Payment of Wages Act, 1936 & State Shops & Establishments Acts",
                    "explanation": "An employer is legally obligated to disburse all earned salary and complete Full & Final Settlement (FnF) within the statutory window (typically 7 to 30 days post last working day). Withholding earned wages as leverage or penalty is unlawful.",
                    "applicability": "High"
                },
                {
                    "title": "Right to Experience & Relieving Certificates",
                    "act_citation": "State Shops & Commercial Establishments Acts & High Court Precedents",
                    "explanation": "Employers cannot legally withhold service certificates, relieving letters, or PF transfer approvals once employment has concluded as per terms or notice period served.",
                    "applicability": "High"
                },
                {
                    "title": "Protection Against Wrongful Termination & Arbitrary Retrenchment",
                    "act_citation": "Section 25F, Industrial Disputes Act, 1947",
                    "explanation": "Termination without mandatory 30-day notice (or pay in lieu) and retrenchment compensation (15 days pay per completed year of service) is invalid under Indian labour law.",
                    "applicability": "Medium"
                }
            ],
            "next_steps": [
                {
                    "step_number": 1,
                    "title": "Issue Formal Demand Notice to Employer HR and Directors",
                    "action_type": "Notice",
                    "description": "Send a formal email and registered postal letter to HR and Managing Director demanding the release of pending FnF dues and relieving documents within 7 working days.",
                    "timeline": "Immediate (within 1-2 days)",
                    "authority_or_platform": "Company HR & Registered Office",
                    "draft_template": "To: HR Department & Board of Directors, [Company Name]\nSubject: Formal Demand Notice for Immediate Release of FnF Dues and Relieving Letter - Employee ID: [Emp ID]\n\nDear Management,\nI completed my tenure with [Company Name] on [LWD] after serving the requisite notice period. Under the Payment of Wages Act and State Shops & Establishments Act, my FnF settlement of ₹[Amount] and Service/Relieving Certificate were due within [Timeline]. Please disburse my pending salary and issue my relieving letter within 7 business days, failing which I will lodge a formal complaint before the Regional Labour Commissioner."
                },
                {
                    "step_number": 2,
                    "title": "File Complaint with Regional Labour Commissioner / Conciliation Officer",
                    "action_type": "Authority Filing",
                    "description": "Approach the Office of the Deputy/Regional Labour Commissioner having jurisdiction over your office location. The Labour Commissioner will issue summons to the employer for conciliation.",
                    "timeline": "Within 7-10 days of notice expiry",
                    "authority_or_platform": "Office of the Labour Commissioner / Samadhan Portal (samadhan.labour.gov.in)",
                    "draft_template": None
                },
                {
                    "step_number": 3,
                    "title": "EPFO / Gratuity Grievance (For PF or Gratuity Withholding)",
                    "action_type": "Grievance Portal",
                    "description": "If Provident Fund (PF) contributions were deducted from your salary but not deposited with EPFO, file a complaint on EPFiGMS (epfigms.gov.in). If gratuity is withheld after 5 years of service, file Form N before the Controlling Authority under Payment of Gratuity Act.",
                    "timeline": "Immediate upon finding PF/Gratuity irregularity",
                    "authority_or_platform": "EPFiGMS (epfigms.gov.in) & Controlling Authority",
                    "draft_template": None
                }
            ],
            "rti_draft": {
                "is_applicable": True,
                "reason_for_applicability": "If you work in a PSU / Government Department, or if you need inspection records of your private employer's PF deposits from EPFO / ESIC / Labour Inspector.",
                "public_authority_name": "Employees' Provident Fund Organisation (EPFO) / Ministry of Labour & Employment",
                "public_information_officer_title": "The Public Information Officer (CPIO), Regional EPFO Office",
                "subject": "Application under Section 6(1) of RTI Act, 2005 for EPF Remittance and Employer Inspection Details",
                "questions_sought": [
                    "1. Certified statement of month-wise PF remittances made by employer [Company Name - Establishment ID] against UAN [Your UAN].",
                    "2. Whether any inquiry under Section 7A of the EPF Act has been initiated against [Company Name] for default in contributions.",
                    "3. Action taken on grievance docket #[Grievance No] filed regarding non-credit of PF dues."
                ],
                "sample_draft_text": "To,\nThe Central Public Information Officer (CPIO),\nRegional Office, Employees' Provident Fund Organisation (EPFO),\n[City, State - PIN]\n\n1. Name: [Your Name]\n2. Address: [Your Address]\n3. UAN Number: [Your UAN] | Member ID: [Your Member ID]\n\nSubject: RTI Application under Section 6(1) of RTI Act, 2005 regarding Employer PF Remittance.\n\nRespected Sir,\nPlease provide certified copies of the following:\n1. Month-wise employer and employee share remitted by [Establishment Name] from [Start Date] to [End Date].\n2. Any notices or penalties issued to the establishment for delayed remittance under Section 14B / 7Q.\n\nStatutory fee of ₹10 is enclosed.\n\nDate: [Date]\nPlace: [City]\n\n[Your Name]",
                "filing_instructions": "Submit on rtionline.gov.in under Ministry of Labour & Employment -> EPFO, or send via Registered Post with ₹10 IPO.",
                "portal_url": "https://rtionline.gov.in"
            }
        }

    def _generate_rti_mock(self, query: str) -> Dict[str, Any]:
        return {
            "summary": "Your query involves exercising citizen oversight and information access under the Right to Information (RTI) Act, 2005 for government operations, civic works, or public authorities.",
            "rights_explanation": [
                {
                    "title": "Fundamental Right to Inspect Public Records & Works",
                    "act_citation": "Section 2(j) & Section 6(1), Right to Information Act, 2005",
                    "explanation": "Every citizen has the legal right to inspect government works, documents, records, take certified samples of materials, and obtain certified copies of contracts, tenders, and expenditures.",
                    "applicability": "High"
                },
                {
                    "title": "Strict 30-Day Response Mandate & PIO Penalties",
                    "act_citation": "Section 7(1) & Section 20, Right to Information Act, 2005",
                    "explanation": "The Public Information Officer (PIO) is statutorily bound to provide information within 30 days. For unreasonable delay or malafide refusal, the Information Commission can impose personal fines of ₹250/day up to ₹25,000 on the PIO.",
                    "applicability": "High"
                },
                {
                    "title": "Right of First and Second Appeal",
                    "act_citation": "Section 19(1) & Section 19(3), Right to Information Act, 2005",
                    "explanation": "If the PIO does not respond within 30 days or provides incomplete information, you can file a First Appeal to the designated senior officer (FAA) within 30 days at zero extra fee.",
                    "applicability": "High"
                }
            ],
            "next_steps": [
                {
                    "step_number": 1,
                    "title": "Draft & Submit RTI Application under Section 6(1)",
                    "action_type": "Authority Filing",
                    "description": "Submit your pinpointed questions either online via rtionline.gov.in / State RTI Portal or offline via Speed Post along with the ₹10 fee.",
                    "timeline": "Immediate (within 1-2 days)",
                    "authority_or_platform": "RTI Online Portal (rtionline.gov.in) / Public Information Officer",
                    "draft_template": None
                },
                {
                    "step_number": 2,
                    "title": "Track 30-Day Statutory Response Window",
                    "action_type": "Grievance Portal",
                    "description": "Keep postal tracking or online registration number safe. The PIO has exactly 30 calendar days to furnish the information.",
                    "timeline": "30 days from application receipt",
                    "authority_or_platform": "RTI Tracking Dashboard / Speed Post Track Consignment",
                    "draft_template": None
                },
                {
                    "step_number": 3,
                    "title": "File First Appeal under Section 19(1) if No Reply or Deficient Reply",
                    "action_type": "Authority Filing",
                    "description": "If the 30 days elapse without a response (deemed refusal) or misleading info is given, file a First Appeal to the First Appellate Authority (FAA) within 30 days.",
                    "timeline": "Within 30 days after the 30-day PIO deadline",
                    "authority_or_platform": "First Appellate Authority of the concerned Department",
                    "draft_template": "To: The First Appellate Authority (under Section 19(1) of RTI Act, 2005)\nDepartment: [Department Name]\nSubject: First Appeal against Non-Response / Deemed Refusal of RTI Application Registration #[Reg No]\n\nSir/Madam,\nI filed RTI application #[Reg No] on [Date]. 30 days have elapsed without any reply from the PIO, constituting deemed refusal under Section 7(2). Kindly direct the PIO to supply certified information immediately free of cost under Section 7(6)."
                }
            ],
            "rti_draft": {
                "is_applicable": True,
                "reason_for_applicability": "Direct civic oversight / government accountability query requiring official records under RTI Act, 2005.",
                "public_authority_name": "Municipal Corporation / Public Works Department (PWD) / Ministry",
                "public_information_officer_title": "The Public Information Officer (CPIO/SPIO), [Concerned Department / Division]",
                "subject": "Application seeking information under Section 6(1) of the Right to Information Act, 2005",
                "questions_sought": [
                    "1. Certified copy of the work order, sanctioned budget, and tender agreement for the work: [Description of work/area].",
                    "2. Name, designation, and official contact details of the contractor and executive engineer responsible for supervising this work.",
                    "3. Date of commencement, scheduled completion date, actual completion date, and Defect Liability Period (DLP) duration.",
                    "4. Certified copy of the measurement book (MB) and quality inspection test reports conducted before clearing final billing."
                ],
                "sample_draft_text": "To,\nThe Public Information Officer (RTI Cell),\n[Department / Municipal Corporation / Public Authority Name],\n[Office Address, City, State - PIN]\n\n1. Name of the Applicant: [Your Full Name]\n2. Address: [Your Full Address]\n3. Contact Details: [Mobile Number & Email]\n\nSubject: Application seeking information under Section 6(1) of the Right to Information Act, 2005.\n\nRespected Sir/Madam,\nUnder the provisions of the RTI Act, 2005, please furnish certified information for the following:\n1. Certified copy of the sanctioned estimate and tender contract for [Describe Work/Location].\n2. Name and contact details of the contractor awarded the tender and the supervising Junior/Executive Engineer.\n3. Total expenditure sanctioned and paid till date for this work.\n4. Certified copy of the quality testing reports and milestone inspection notes.\n5. Defect liability period during which the contractor is legally obligated to repair damages at their own cost.\n\nFee of ₹10 is enclosed herewith via [Postal Order / Court Fee Stamp / Online Receipt No: _________].\n\nI state that I am a Citizen of India and the information sought does not fall under the exemptions specified under Section 8 of the RTI Act, 2005.\n\nDate: [Date]\nPlace: [City]\n\nYours faithfully,\n[Your Name]",
                "filing_instructions": "Submit online on rtionline.gov.in (for Central departments) or state RTI portal. For offline submission, print, sign, attach ₹10 IPO, and send via Registered / Speed Post.",
                "portal_url": "https://rtionline.gov.in"
            }
        }

    def _generate_general_mock(self, query: str) -> Dict[str, Any]:
        return {
            "summary": f"Your legal dispute query '{query[:60]}...' has been analyzed against Indian civil, consumer, tenancy, and statutory rights frameworks.",
            "rights_explanation": [
                {
                    "title": "Right to Redressal of Grievance & Fair Dealing",
                    "act_citation": "Consumer Protection Act, 2019 & Indian Contract Act, 1872",
                    "explanation": "You have a legally protected right to enforce contractual agreements and seek statutory remedies for breach of contract, deficiency in promised service, or monetary withholding.",
                    "applicability": "High"
                },
                {
                    "title": "Right to Information & Transparency",
                    "act_citation": "Right to Information Act, 2005",
                    "explanation": "Whenever a public authority or regulated utility is involved, you have the statutory power to seek certified records, files, and inspection notes.",
                    "applicability": "Medium"
                }
            ],
            "next_steps": [
                {
                    "step_number": 1,
                    "title": "Issue Written Notice of Dispute",
                    "action_type": "Notice",
                    "description": "Send a formal demand communication specifying facts, monetary claims, and giving a 15-day resolution deadline.",
                    "timeline": "Immediate",
                    "authority_or_platform": "Registered Post / Email",
                    "draft_template": "Subject: Formal Notice of Dispute\n\nTake notice that [describe issue]. You are requested to rectify this matter within 15 days of this notice failing which appropriate statutory authorities will be approached."
                },
                {
                    "step_number": 2,
                    "title": "Approach Designated Statutory Ombudsman or Tribunal",
                    "action_type": "Authority Filing",
                    "description": "Submit a formal petition before the relevant sectoral regulator (Consumer Commission / Rent Authority / Labour Commissioner / Ombudsman).",
                    "timeline": "After notice expiration",
                    "authority_or_platform": "Relevant Statutory Tribunal",
                    "draft_template": None
                }
            ],
            "rti_draft": {
                "is_applicable": False,
                "reason_for_applicability": "This dispute primarily involves private parties where RTI Act does not directly apply unless records of a supervising public authority are required.",
                "public_authority_name": None,
                "public_information_officer_title": None,
                "subject": None,
                "questions_sought": [],
                "sample_draft_text": None,
                "filing_instructions": None,
                "portal_url": "https://rtionline.gov.in"
            }
        }

    async def chat(
        self,
        system_prompt: str,
        messages: List[ChatMessage],
        user_message: str
    ) -> str:
        msg = user_message.lower()
        if "notice" in msg or "time" in msg or "days" in msg:
            return (
                "Under Indian law, standard legal notices typically provide a 15-day window for compliance. "
                "For employment disputes, a 7-day demand is standard. If the counterparty fails to respond or comply within this window, "
                "you can immediately escalate to the relevant forum (e.g. E-Daakhil for consumers, Rent Authority for tenants, or Labour Commissioner for employees)."
            )
        elif "cost" in msg or "fee" in msg or "lawyer" in msg:
            return (
                "You do not necessarily need a lawyer for initial steps! \n"
                "1. National Consumer Helpline (1915) is completely free.\n"
                "2. E-Daakhil filing fee is ₹0 for claims up to ₹5 Lakhs.\n"
                "3. RTI application fee is ₹10.\n"
                "4. Rent Authority and Labour Commissioner petitions can be filed in person by the aggrieved individual."
            )
        else:
            return (
                f"Regarding your query on '{user_message}': You are legally protected under Indian statutory provisions. "
                "Ensure you preserve all documentary evidence (receipts, WhatsApp chats, emails, agreement copies) as they form the primary evidentiary basis if you escalate to a formal forum."
            )
