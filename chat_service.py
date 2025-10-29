# RAG Chat Service with OpenAI and AstraDB
import os
from openai import OpenAI
from astrapy import DataAPIClient
import logging

logging.basicConfig(level=logging.DEBUG)

class ChatService:
    def __init__(self):
        # Initialize OpenAI
        openai_key = os.environ.get('OPENAI_API_KEY', '')
        self.openai_client = OpenAI(api_key=openai_key)
        
        # Initialize Astra DB
        astra_endpoint = os.environ.get('ASTRA_DB_ENDPOINT', '')
        astra_token = os.environ.get('ASTRA_DB_APPLICATION_TOKEN', '')
        self.astra_client = DataAPIClient()
        self.db = self.astra_client.get_database(
            astra_endpoint,
            token=astra_token
        )
        self.collection_name = os.environ.get('ASTRA_DB_COLLECTION', 'phucgpt')
    
    async def retrieve_context(self, query: str) -> str:
        """Retrieve relevant context from AstraDB using vector similarity search"""
        try:
            logging.info('Step 1: Creating embedding for query...')
            # Create embedding for the query
            embedding_response = self.openai_client.embeddings.create(
                model="text-embedding-3-small",
                input=query,
                encoding_format="float"
            )
            query_vector = embedding_response.data[0].embedding
            logging.info(f'Step 2: Query vector ready, length: {len(query_vector)}')
            
            # Search in AstraDB
            logging.info('Step 3: Searching DB...')
            collection = self.db.get_collection(self.collection_name)
            results = collection.find(
                {},
                sort={"$vector": query_vector},
                limit=3
            )
            
            # Extract text from results
            texts = []
            for doc in results:
                text = doc.get('text', '') or doc.get('body', '') or doc.get('content', '') or doc.get('chunk', '')
                if len(text) > 10:
                    texts.append(text)
            
            logging.info(f'Step 4: Found {len(texts)} relevant chunks')
            
            if not texts:
                return "Không tìm thấy ngữ cảnh liên quan."
            
            return '\n\n---\n\n'.join(texts)
            
        except Exception as error:
            logging.error(f'Retrieve context failed: {str(error)}')
            return "Không thể lấy ngữ cảnh từ DB."
    
    async def chat(self, message: str) -> str:
        """Chat with RAG - retrieve context and generate response"""
        try:
            # Retrieve context
            context = await self.retrieve_context(message)
            logging.info(f'Retrieved context preview: {context[:100]}...')
            
            # Create system prompt with context
            system_prompt = f"""Tên bạn là Phúc GPT. Dựa trên ngữ cảnh sau từ dữ liệu mới nhất, 
            trả lời câu hỏi của user một cách chính xác và hữu ích. Nếu ngữ cảnh không liên quan hoặc rỗng, 
            dùng kiến thức chung của bạn nếu dữ liệu thiếu hãy suy luận theo kiến thức bạn đang có.

Ngữ cảnh từ DB:
{context}"""
            
            # Call OpenAI
            response = self.openai_client.chat.completions.create(
                model='gpt-4',
                messages=[
                    {'role': 'system', 'content': system_prompt},
                    {'role': 'user', 'content': message}
                ],
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
        except Exception as error:
            logging.error(f'Chat failed: {str(error)}')
            raise error

# Create singleton instance
chat_service = ChatService()
