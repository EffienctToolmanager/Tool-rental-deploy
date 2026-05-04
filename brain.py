import json
import uuid
from datetime import datetime
import ollama

MODEL_NAME = "gemma4:e4b"

SYSTEM_PROMPT = """
You are the 'P-Reinforce Architect', an autonomous knowledge gardener based on Andre Karpathy's LLM-Wiki architecture.
Your task is to convert raw, fragmented notes into structured, permanent wiki documents.
You must output ONLY valid JSON format, with no markdown code blocks wrapping it, and no conversational text.

The JSON object must have the following keys:
- "title": A short, clear title for the document based on the content.
- "category": Choose the most appropriate subfolder from: "Projects/...", "Topics/...", "Decisions/...", "Skills/...". Create a new subfolder if necessary. Example: "Topics/Psychology" or "Projects/AI_Agent"
- "confidence_score": Float between 0.0 and 1.0 indicating your confidence in this categorization.
- "tags": A list of relevant string tags.
- "summary": A one-sentence insight capturing the essence of the note (The Karpathy Summary).
- "extracted_patterns": A short string describing the extracted pattern or wisdom.
- "details": A list of bullet point strings summarizing the main points.
- "contradictions": A short string noting any potential conflicts with standard knowledge, or just "None".
- "related_links": A list of strings representing related concepts to link to.

Example Output:
{
  "title": "Thoughts on AI Agents",
  "category": "Topics/AI",
  "confidence_score": 0.95,
  "tags": ["AI", "Agent", "Automation"],
  "summary": "AI agents move beyond simple prompt-response by utilizing loops and tool access to achieve goals autonomously.",
  "extracted_patterns": "Agentic workflows require memory, planning, and tools.",
  "details": ["Agents use LLMs as their core reasoning engine.", "Memory can be short-term or long-term."],
  "contradictions": "None",
  "related_links": ["[[LLM]]", "[[LangChain]]"]
}
"""

def generate_wiki_content(raw_text: str, filename: str) -> dict:
    """
    Sends the raw text to Ollama and returns a parsed dictionary with the structured Wiki data.
    """
    prompt = f"Filename: {filename}\nRaw Content:\n{raw_text}\n\nAnalyze and structure this content according to the system prompt. Output ONLY valid JSON."
    
    try:
        response = ollama.chat(model=MODEL_NAME, messages=[
            {'role': 'system', 'content': SYSTEM_PROMPT},
            {'role': 'user', 'content': prompt}
        ])
        
        response_text = response['message']['content'].strip()
        # Clean up in case the model returns markdown JSON blocks
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        
        data = json.loads(response_text.strip())
        
        # Add generated fields
        data['id'] = str(uuid.uuid4())[:13]
        data['last_reinforced'] = datetime.now().strftime("%Y-%m-%d")
        
        return data
        
    except Exception as e:
        print(f"Error during Ollama generation: {e}")
        return None

def format_markdown(data: dict, original_filename: str) -> str:
    """
    Converts the structured dictionary into the standard P-Reinforce Markdown format.
    """
    tags_str = ", ".join(data.get('tags', []))
    details_str = "\n".join([f"- {d}" for d in data.get('details', [])])
    related_str = ", ".join(data.get('related_links', []))
    
    md = f"""---
id: {data['id']}
category: "[[10_Wiki/{data['category']}]]"
confidence_score: {data.get('confidence_score', 0.9)}
tags: [{tags_str}]
last_reinforced: {data['last_reinforced']}
github_commit: "pending"
---

# [[{data['title']}]]

## 📌 한 줄 통찰 (The Karpathy Summary)
> {data['summary']}

## 📖 구조화된 지식 (Synthesized Content)
- **추출된 패턴:** {data['extracted_patterns']}
- **세부 내용:**
{details_str}

## ⚠️ 모순 및 업데이트 (Contradictions & RL Update)
- **과거 데이터와의 충돌:** {data['contradictions']}
- **정책 변화:** (자동화 로직에 의한 신규 편입)

## 🔗 지식 연결 (Graph)
- **Parent:** [[10_Wiki/{data['category']}]]
- **Related:** {related_str}
- **Raw Source:** [[00_Raw/{original_filename}]]
"""
    return md
