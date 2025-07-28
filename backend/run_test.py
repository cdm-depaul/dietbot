"""

"""
import requests
import csv
import time
import pandas as pd
import numpy as np

def read_csv_questions(fname) -> np.array:
    """assumes the file is a csv file"""
    # Read the CSV file into a DataFrame
    df = pd.read_csv(fname)
    # put them in numpy array and return it
    return df.to_numpy()
    

def generate_response(questions) -> list:
    """post each question-query and obtain response"""
    results = [] # results list

    # RUN TESTS
    for i, question in enumerate(questions, 1):
        start_time = time.time()
        query = question[2]
        print (f'{i} -- {query}')
        
        try:
            response = requests.post(ENDPOINT, json={"query": query})
            elapsed = round(time.time() - start_time, 3)

            if response.status_code == 200:
                reply = response.json().get("response", "")
            else:
                reply = f"ERROR: {response.status_code} - {response.text}"

            results.append({
                "id": question[0],
                "answerable": question[1],
                "query": query,
                "response": reply,
                "status_code": response.status_code,
                "time_taken_sec": elapsed
            })

        except Exception as e:
            print(f"[{i}] Error: {e}")
            results.append({
                "id": question[0],
                "answerable": question[1],
                "query": query,
                "response": f"Exception: {e}",
                "status_code": "N/A",
                "time_taken_sec": round(time.time() - start_time, 3)
            })
        
    return results

def write_query_response(outfname, results) -> None:
    with open(outfname, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=results[0].keys())
        writer.writeheader()
        writer.writerows(results)
    

if __name__ == "__main__":
    # CONFIGURATION
    BASE_URL = "http://localhost:8001"
    USER_ID = 1  # replace with a valid user ID from your DB
    ENDPOINT = f"{BASE_URL}/chat/{USER_ID}/ask"

    #testfile = "./evaluate/test_questions.csv"
    testfile = "./evaluate/test_questions_tiny.csv"
    #outfile = "./evaluate/test_results-0.63.csv" # align threshold with line 79 in retriever.py
    outfile = "./evaluate/test_results_tiny-0.63.csv"

    # Read the CSV file into a DataFrame
    questions = read_csv_questions(testfile)
    
    # Generate response to all queries
    results = generate_response(questions)
    
    # Write to an output file
    write_query_response(outfile, results)
