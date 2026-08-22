import json
import re
from pathlib import Path
from typing import List, Dict, Any, Tuple
from backend.config import settings
from backend.models import LegalProvision

class KnowledgeRetriever:
    def __init__(self, data_dir: Path = None):
        self.data_dir = data_dir or settings.DATA_DIR
        self.provisions: List[LegalProvision] = []
        self._load_knowledge()

    def _load_knowledge(self):
        self.provisions = []
        if not self.data_dir.exists():
            return
        
        json_files = list(self.data_dir.glob("*.json"))
        for file_path in json_files:
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if isinstance(data, list):
                        for item in data:
                            prov = LegalProvision(
                                id=item.get("id", ""),
                                act=item.get("act", ""),
                                section=item.get("section", ""),
                                title=item.get("title", ""),
                                summary=item.get("summary", ""),
                                key_provisions=item.get("key_provisions", []),
                                remedy=item.get("remedy", ""),
                                category=item.get("category", "general")
                            )
                            self.provisions.append(prov)
            except Exception as e:
                print(f"Error loading {file_path}: {e}")

    def detect_category(self, query: str) -> str:
        text = query.lower()
        
        tenant_patterns = [
            r"\btenant", r"\blandlord", r"\brent", r"\bflat\b", r"\bapartment", r"\bdeposit", r"\bsecurity deposit",
            r"\bevict", r"\blease\b", r"\bbroker", r"\bowner\b", r"\bhouse\b", r"\bpg\b", r"\brented\b", r"\bvacat"
        ]
        consumer_patterns = [
            r"\bconsumer", r"\bbought\b", r"\bpurchas", r"\bproduct", r"\bdefect", r"\bdamag", r"\bwarranty",
            r"\bguarantee", r"\brefund", r"\breturn", r"\bamazon\b", r"\bflipkart\b", r"e-commerce", r"\becommerce\b",
            r"\bseller", r"\border", r"\brefrigerator", r"\bmobile\b", r"\blaptop", r"\bflight", r"\bairline",
            r"\binsurance", r"\bbank\b", r"\bchargeback", r"\bmachine\b", r"\bitem\b", r"\bappliances\b", r"\bdelivery\b",
            r"\bdelayed delivery\b", r"\bfailed transaction\b", r"\bcourier\b"
        ]
        workplace_patterns = [
            r"\bworkplace", r"\bjob\b", r"\bsalary", r"\bemployer", r"\bemployee", r"\bcompany\b", r"\bboss\b",
            r"\bmanager\b", r"\bfired\b", r"\bterminat", r"\bresign", r"\bnotice period", r"\bfnf\b",
            r"\bharass", r"\bposh\b", r"\bmaternity", r"\bhr\b", r"\brelieving letter", r"\bexperience letter",
            r"\bovertime", r"\bwages", r"\bprovident fund", r"\bepfo\b", r"\bgratuity\b", r"\bretrench"
        ]
        rti_patterns = [
            r"\brti\b", r"right to information", r"\btender", r"\bcontractor", r"\broad repair",
            r"\bmunicipal", r"\bcorporation", r"\bgovernment", r"\bpublic authority", r"\bpio\b",
            r"\bcpio\b", r"\bspio\b", r"\bexam marks", r"\bcutoff", r"\bpension delay", r"\bscheme",
            r"\bfund utilization", r"\bcivic\b", r"\bpwd\b", r"\bfirst appeal", r"\bofficial records\b"
        ]
        
        scores = {
            "tenant": sum(1 for p in tenant_patterns if re.search(p, text)),
            "consumer": sum(1 for p in consumer_patterns if re.search(p, text)),
            "workplace": sum(1 for p in workplace_patterns if re.search(p, text)),
            "rti": sum(1 for p in rti_patterns if re.search(p, text))
        }
        
        max_cat = max(scores, key=scores.get)
        if scores[max_cat] > 0:
            return max_cat
        return "general"

    def retrieve(self, query: str, category: str = "auto", top_k: int = 4) -> List[LegalProvision]:
        if not self.provisions:
            self._load_knowledge()

        detected = self.detect_category(query) if category in ("auto", None, "") else category
        query_words = set(re.findall(r'\w+', query.lower()))
        
        scored_provisions: List[Tuple[float, LegalProvision]] = []
        
        for prov in self.provisions:
            score = 0.0
            
            # Category match bonus
            if detected != "general" and prov.category == detected:
                score += 5.0
            
            # Title overlap
            title_words = set(re.findall(r'\w+', prov.title.lower()))
            score += len(query_words.intersection(title_words)) * 3.0
            
            # Summary overlap
            summary_words = set(re.findall(r'\w+', prov.summary.lower()))
            score += len(query_words.intersection(summary_words)) * 1.5
            
            # Key provisions overlap
            key_text = " ".join(prov.key_provisions).lower()
            key_words = set(re.findall(r'\w+', key_text))
            score += len(query_words.intersection(key_words)) * 1.0
            
            # Act/Section overlap
            act_words = set(re.findall(r'\w+', f"{prov.act} {prov.section}".lower()))
            score += len(query_words.intersection(act_words)) * 2.0
            
            prov_copy = prov.model_copy()
            prov_copy.score = round(score, 2)
            scored_provisions.append((score, prov_copy))
            
        scored_provisions.sort(key=lambda x: x[0], reverse=True)
        return [prov for score, prov in scored_provisions[:top_k]]

    def get_all_provisions(self) -> List[LegalProvision]:
        if not self.provisions:
            self._load_knowledge()
        return self.provisions

retriever = KnowledgeRetriever()
