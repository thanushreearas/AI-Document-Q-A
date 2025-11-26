import PyPDF2
from docx import Document as DocxDocument
import os
import re

class DocumentProcessor:
    @staticmethod
    def extract_text(file_path, filename):
        """Extract text from different file formats"""
        try:
            file_extension = filename.lower().split('.')[-1]
            
            if file_extension == 'pdf':
                return DocumentProcessor._extract_from_pdf(file_path)
            elif file_extension == 'docx':
                return DocumentProcessor._extract_from_docx(file_path)
            elif file_extension == 'txt':
                return DocumentProcessor._extract_from_txt(file_path)
            else:
                raise ValueError(f"Unsupported file format: {file_extension}")
                
        except Exception as e:
            print(f"Error extracting text from {filename}: {e}")
            return ""
    
    @staticmethod
    def _extract_from_pdf(file_path):
        """Extract text from PDF file"""
        text = ""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
        except Exception as e:
            print(f"Error reading PDF: {e}")
        return text
    
    @staticmethod
    def _extract_from_docx(file_path):
        """Extract text from DOCX file"""
        text = ""
        try:
            doc = DocxDocument(file_path)
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
        except Exception as e:
            print(f"Error reading DOCX: {e}")
        return text
    
    @staticmethod
    def _extract_from_txt(file_path):
        """Extract text from TXT file"""
        text = ""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                text = file.read()
        except Exception as e:
            print(f"Error reading TXT: {e}")
        return text
    
    @staticmethod
    def chunk_text(text, chunk_size=1000, overlap=200):
        """Split text into overlapping chunks for better context"""
        if not text:
            return []
        
        # Clean text
        text = re.sub(r'\s+', ' ', text).strip()
        
        chunks = []
        start = 0
        
        while start < len(text):
            end = start + chunk_size
            
            # If not at the end, try to break at sentence boundary
            if end < len(text):
                # Look for sentence endings within the last 100 characters
                last_period = text.rfind('.', start, end)
                last_exclamation = text.rfind('!', start, end)
                last_question = text.rfind('?', start, end)
                
                sentence_end = max(last_period, last_exclamation, last_question)
                
                if sentence_end > start + chunk_size - 200:  # If found within reasonable range
                    end = sentence_end + 1
            
            chunk = text[start:end].strip()
            if chunk:
                chunks.append({
                    'text': chunk,
                    'start_pos': start,
                    'end_pos': end
                })
            
            start = end - overlap
        
        return chunks