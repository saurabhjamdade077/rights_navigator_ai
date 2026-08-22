import asyncio
import sys
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backend.retriever import retriever
from backend.models import DisputeAnalysisRequest, FollowUpChatRequest, ChatMessage
from backend.navigator_service import navigator_service
from backend.llm.factory import get_llm_client

async def run_tests():
    print("=== 1. Testing Retriever & Data Loading ===")
    provisions = retriever.get_all_provisions()
    print(f"Loaded {len(provisions)} legal provisions.")
    assert len(provisions) >= 10, f"Expected at least 10 provisions, got {len(provisions)}"
    
    test_queries = [
        ("Landlord is refusing to refund 50,000 security deposit", "tenant"),
        ("E-commerce site sent defective mobile and rejected refund", "consumer"),
        ("Company withheld final month salary and experience letter", "workplace"),
        ("Need contractor name and tender budget for incomplete road repair", "rti")
    ]
    
    for query, expected_cat in test_queries:
        cat = retriever.detect_category(query)
        results = retriever.retrieve(query, top_k=2)
        print(f"Query: '{query[:40]}...' -> Detected Category: {cat} (Expected: {expected_cat}), Retrieved {len(results)} matches.")
        assert cat == expected_cat, f"Category mismatch: got {cat}, expected {expected_cat}"
        assert len(results) > 0, "No results retrieved"
    print("PASS: Retriever & Data loading tests.\n")

    print("=== 2. Testing LLM Client Abstraction & Service Analysis ===")
    client = get_llm_client()
    print(f"Active LLM Client: {client.provider_name}")
    
    req = DisputeAnalysisRequest(
        dispute_text="My landlord in Bangalore is refusing to return my security deposit of 70,000 rupees even though I vacated the flat on time with 1 month notice."
    )
    res = await navigator_service.analyze_dispute(req)
    print(f"Summary: {res.summary}")
    print(f"Rights explained: {len(res.rights_explanation)}")
    for r in res.rights_explanation:
        print(f" - [{r.act_citation}] {r.title}")
    print(f"Next steps count: {len(res.next_steps)}")
    for s in res.next_steps:
        print(f" - Step {s.step_number}: {s.title} ({s.action_type})")
    print(f"RTI Draft Applicable: {res.rti_draft.is_applicable}")
    print(f"Provider Used: {res.provider_used}")
    
    assert len(res.rights_explanation) >= 2, "Expected at least 2 rights explained"
    assert len(res.next_steps) >= 2, "Expected at least 2 next steps"
    assert res.disclaimer is not None, "Disclaimer missing"
    print("PASS: Dispute Analysis Service test.\n")

    print("=== 3. Testing Follow-up Chat ===")
    chat_req = FollowUpChatRequest(
        dispute_context="Landlord refusing security deposit refund of 70,000 rupees",
        conversation_history=[
            ChatMessage(role="user", content="How many days notice should I give before taking legal action?"),
            ChatMessage(role="assistant", content="A 15-day formal notice is customary under Indian tenancy practices.")
        ],
        user_message="Does filing a complaint cost a lot of lawyer fees?"
    )
    chat_res = await navigator_service.handle_chat(chat_req)
    print(f"Chat reply: {chat_res.reply[:120]}...")
    assert len(chat_res.reply) > 20, "Chat reply too short"
    print("PASS: Follow-up Chat test.\n")
    print("ALL BACKEND TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    asyncio.run(run_tests())
