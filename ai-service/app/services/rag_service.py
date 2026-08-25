import os
from typing import List
import numpy as np
from groq import Groq

_model = None
def get_model():
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            _model = SentenceTransformer('all-MiniLM-L6-v2')
        except ImportError:
            _model = None
    return _model

class RagService:
    def __init__(self):
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        if self.groq_api_key:
            self.client = Groq(api_key=self.groq_api_key)
        else:
            self.client = None
            
        # Mock document store
        self.doc_store = {
            "doc1": "The Axon platform uses Next.js and TypeScript for the frontend, and Python FastAPI for the AI backend.",
            "doc2": "Semantic matching is handled by comparing sentence-transformers embeddings using cosine similarity.",
            "doc3": "Projects require a mix of skills. An AI project often requires Python and vector database knowledge.",
            "template_a": "A standard project template requires 3 engineers: 1 frontend, 1 backend, 1 DevOps."
        }

    async def query(self, query_text: str, context_ids: List[str]) -> dict:
        import faiss
        
        model = get_model()
        if not model or not self.client:
            return {
                "answer": "Cannot run RAG. Missing GROQ_API_KEY or sentence-transformers.",
                "sources": []
            }
            
        # 1. Retrieve chunks
        # If context_ids is empty, use all docs, otherwise filter
        docs_to_search = self.doc_store if not context_ids else {k: v for k, v in self.doc_store.items() if k in context_ids}
        if not docs_to_search:
            docs_to_search = self.doc_store # fallback
            
        keys = list(docs_to_search.keys())
        texts = list(docs_to_search.values())
        
        # Build FAISS index
        embeddings = model.encode(texts)
        dimension = embeddings.shape[1]
        index = faiss.IndexFlatL2(dimension)
        index.add(embeddings)
        
        # Search
        query_embedding = model.encode([query_text])
        k = min(3, len(texts))
        distances, indices = index.search(query_embedding, k)
        
        retrieved_texts = []
        sources = []
        for idx in indices[0]:
            if idx != -1:
                retrieved_texts.append(texts[idx])
                sources.append(keys[idx])
                
        # 2. Formulate prompt
        context_str = "\n".join([f"- {t}" for t in retrieved_texts])
        prompt = f"""
Answer the user's question based ONLY on the provided context. If you cannot answer based on the context, say so.

Context:
{context_str}

Question: {query_text}
"""
        
        # 3. Generate answer
        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt}
                ],
                model="llama3-8b-8192",
                temperature=0.3
            )
            answer = chat_completion.choices[0].message.content
            
            return {
                "answer": answer,
                "sources": sources
            }
        except Exception as e:
            return {
                "answer": f"Error generating answer: {str(e)}",
                "sources": sources
            }
