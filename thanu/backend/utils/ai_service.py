import requests
import json
from config import Config

class AIService:
    def __init__(self):
        self.api_key = Config.OPENROUTER_API_KEY
        self.base_url = Config.OPENROUTER_BASE_URL
        self.model = Config.MODEL_NAME
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    def answer_question(self, question, document_chunks, document_title=""):
        """Generate answer based on document content and user question"""
        try:
            # Prepare context from document chunks
            context = self._prepare_context(document_chunks, document_title)
            
            # Create prompt
            prompt = self._create_prompt(question, context, document_title)
            
            # Make API call
            response = self._make_api_call(prompt)
            
            return {
                'success': True,
                'answer': response,
                'context_used': len(document_chunks)
            }
            
        except Exception as e:
            print(f"Error in AI service: {e}")
            return {
                'success': False,
                'error': str(e),
                'answer': "Sorry, I couldn't process your question at the moment."
            }
    
    def _prepare_context(self, chunks, document_title):
        """Prepare context from document chunks"""
        if not chunks:
            return "No document content available."
        
        # Combine relevant chunks (limit to avoid token limits)
        context_parts = []
        total_length = 0
        max_context_length = 3000  # Adjust based on model limits
        
        for chunk in chunks[:10]:  # Limit to first 10 chunks
            chunk_text = chunk.get('text', '')
            if total_length + len(chunk_text) > max_context_length:
                break
            context_parts.append(chunk_text)
            total_length += len(chunk_text)
        
        context = "\n\n".join(context_parts)
        
        if document_title:
            context = f"Document: {document_title}\n\n{context}"
        
        return context
    
    def _create_prompt(self, question, context, document_title):
        """Create a well-structured prompt for the AI model"""
        prompt = f"""You are an AI assistant that answers questions based on document content. 

Document Context:
{context}

User Question: {question}

Instructions:
- Answer the question based ONLY on the provided document context
- If the answer is not in the document, say "I cannot find this information in the provided document"
- Be concise and accurate
- Quote relevant parts from the document when possible
- If the question is unclear, ask for clarification

Answer:"""
        
        return prompt
    
    def _make_api_call(self, prompt):
        """Make API call to OpenRouter"""
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "max_tokens": 500,
            "temperature": 0.7
        }
        
        response = requests.post(
            f"{self.base_url}/chat/completions",
            headers=self.headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            return result['choices'][0]['message']['content'].strip()
        else:
            raise Exception(f"API call failed: {response.status_code} - {response.text}")
    
    def summarize_document(self, document_chunks, document_title=""):
        """Generate a summary of the document"""
        try:
            context = self._prepare_context(document_chunks, document_title)
            
            prompt = f"""Please provide a concise summary of the following document:

Document: {document_title}

Content:
{context}

Summary:"""
            
            response = self._make_api_call(prompt)
            
            return {
                'success': True,
                'summary': response
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'summary': "Could not generate summary."
            }