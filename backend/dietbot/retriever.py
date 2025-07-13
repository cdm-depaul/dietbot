import numpy as np
import pandas as pd
import os
import logging
from sentence_transformers import SentenceTransformer

## 7/6/2025 nt: added
logging.basicConfig(level=logging.INFO) ## 7/6/2025 nt: keep INFO level
logger = logging.getLogger(__name__)

class Retriever:
    ## 7/7/2025 nt: add a class variable to see how many times the class is called.
    static_count = 0
    
    def __init__(self):
        """Initialize the retriever by loading the embedding model and the knowledge base."""
        ## 7/7/2025 nt: first increment the static count vriable
        print (f"#### Retriever constructor called: {Retriever.static_count}")
        Retriever.static_count += 1
        
        try:
            self.embed_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
            
            """ 
            7/6/2025 nt: KB data as text chunks and their embeddings is stored in a csv file.
            They are first read into a dataframe and then placed in parallel np arrays.            
            """
            data_path = './data/embeddings.csv'  
            self.knowledge_df = pd.read_csv(data_path)
            
            ## 7/6/2025 nt: embeddings arrays/vectors
            self.knowledge_embeddings = np.array(
                self.knowledge_df['embedding']
                .apply(lambda x: np.array(eval(x), dtype=np.float32))
                .tolist()
            )
            ## 7/6/2025 nt: pre-compute the norm for the knowledge embeddings
            self.knowledge_norms = np.linalg.norm(self.knowledge_embeddings, axis=1)
            
            ## 7/6/2025 nt: text chunks
            self.knowledge_texts = self.knowledge_df['sentence_chunk'].tolist()
            print ("========= KB embedding norms created =======")
            
        except Exception as e:
            logger.error(f"Error initializing Retriever: {e}")
            raise

    def embed_query(self, query: str) -> np.ndarray:
        """Generate an embedding for the given query."""
        return self.embed_model.encode([query])[0]

    def retrieve(self, query) -> str:
        """Retrieve relevant context from the knowledge base based on the query.
           Cosine angle is used as the simlarity metric."""
        try:
            ## 7/6/2025 nt: apply embedding to query only if query was passed as string.
            #query_embedding = self.embed_query(query)           
            if isinstance(query, str):
                query_embedding = self.embed_query(query)
            else:
                query_embedding = query # nt: just to align variable names
            
            ## 7/6/2025 nt: norms are pre-computed in the constructor
            #knowledge_norms = np.linalg.norm(self.knowledge_embeddings, axis=1)
            #similarities = np.dot(self.knowledge_embeddings, query_norm) / knowledge_norms
            similarities = np.dot(self.knowledge_embeddings, query_embedding) / (
                           self.knowledge_norms * np.linalg.norm(query_embedding)
                           )
            max_score = np.max(similarities)
            
            if max_score < 0.30:
                return (f"Sorry, this question is outside my nutrition expertise. "
                        f"Please ask about food, nutrients, or health-related topics. (score: {max_score:.2f})")
                
            most_relevant_idx = np.argmax(similarities)
            return f"Knowledge Source (score: {max_score:.2f}): {self.knowledge_texts[most_relevant_idx]}"
            
        except Exception as e:
            logger.error(f"Retrieval error: {e}")
            return "Error accessing knowledge base"