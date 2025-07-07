import os
import pandas as pd
import numpy as np
from typing import Tuple, List

""" 12/15/2024: nt
Module for Ms. Potts.  So far it classifies a user query into one of the four intents:
	0. Meal-Logging
	1. Meal-Planning-Recipes
	2. Educational-Content
	3. Personalized-Health-Advice
"""

## 6/29/2025 nt: path fixed
CSV_PATH = "./data/intent_embeddings/intent_embeddings_all.csv"
#CSV_PATH = "../data/intent_embeddings/intent_embeddings_all.csv"

class IntentClassifier:
    def __init__(self):
        self.intent_df = pd.read_csv(CSV_PATH)

		## 7/6/2025 nt: moved from under classify_from..()
        self.categories = self.intent_df['Category'].to_numpy()
        self.intents = self.intent_df['Intent'].to_numpy()
        
        ## 7/6/2025 nt: similarly to Retriever, we should pre-compute the
        ##  intent embeddings for efficiency.
        df_temp = self.intent_df.drop(['Intent', 'Category'], axis=1)
        self.intent_embeddings = df_temp.to_numpy()
        self.intent_norms = np.linalg.norm(self.intent_embeddings, axis=1)
        
        ## 7/6/2025 nt: use a threshold to filter out non-diet/nutrition related query
        self.threshold = 0.4
        
    #def compute_similarity(self, query_embedding: np.ndarray, intent_embeddings: np.ndarray) -> List[Tuple[int, float]]:
    def compute_similarity(self, query_embedding: np.ndarray) -> List[Tuple[int, float]]:
        ## 7/6/2025 nt: change to align with the above
        #similarities = np.dot(intent_embeddings, query_embedding) / (
        #    np.linalg.norm(intent_embeddings, axis=1) * np.linalg.norm(query_embedding)
        #)
        similarities = np.dot(self.intent_embeddings, query_embedding) / (
	               self.intent_norms * np.linalg.norm(query_embedding)
	               )
        
        top_indices = np.argsort(similarities)[::-1] # 7/6/2025 nt: sort by sim score
        return [(idx, similarities[idx]) for idx in top_indices[:3]]
    
    def classify_from_embedding(self, query_embedding: np.ndarray) -> dict:
        ## 7/6/2025 nt: do these in the pre-computation of intent embeddings in constructor
        #df_temp = self.intent_df.drop(['Intent', 'Category'], axis=1)
        #embeddings = df_temp.to_numpy()
        #results = self.compute_similarity(query_embedding, embeddings)
        results = self.compute_similarity(query_embedding)
        
        ## 7/6/2025 nt: moved to the constructor for efficiency
        #categories = self.intent_df['Category'].to_numpy()
        #intents = self.intent_df['Intent'].to_numpy()
        
        classifications = [
            {
                "category": self.categories[idx], # 7/6/2025 nt: changed
                "intent": self.intents[idx], # 7/6/2025 nt: changed
                "confidence": float(score)
            }
            for idx, score in results
        ]
        
        return {
            "top_intent": classifications[0]["intent"],
            "top_category": classifications[0]["category"],
            ## 7/6/2025 nt: addition
            "top_score": classifications[0]["confidence"],
            "classifications": classifications
        }