# 🧠 DietBot: PDF-Grounded Question Generation and Evaluation

This notebook generates realistic, emotionally authentic questions grounded in authoritative PDF content (e.g., ADA guidelines), and verifies whether "answerable" questions are actually supported by the reference documents using a retrieval-augmented LLM.

---

## 📌 What It Does

1. **Ingests** all PDF files from `data/input_pdfs/`
2. **Chunks & Embeds** documents using LangChain + FAISS
3. **Generates** 100 natural-language questions (50 answerable, 50 unanswerable) using GPT-4o
4. **Verifies** answerable questions using GPT-4o against the original documents
5. **Saves** results to `data/csv_outputs/`

---

## 🚀 How to Use

1. **Set your OpenAI API key**

Create a `.env` file in the `notebooks/` directory with:

```env
OPENAI_API_KEY=sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

2. **Install dependencies**

Run from inside your virtual environment:

```bash
pip install -r requirements.txt
```

3. **Add your PDFs**

Place any ADA or nutrition-related PDFs into:

```
notebooks/data/input_pdfs/
```

4. **Launch the notebook**

From the `notebooks/` directory:

```bash
jupyter lab
```

Open and run `00_generate_questions_from_pdf.ipynb` step-by-step.

---

## 📁 Output Files

- `data/csv_outputs/00_diabetes_qna_generated_*.csv` — All generated questions
- `data/csv_outputs/00_qna_verification_summary_*.csv` — Summary of fact-checking results

---

## 🛠️ Dependencies

- Python 3.10+
- LangChain
- FAISS
- OpenAI (GPT-4o)
- PyPDFLoader
- Pandas
- dotenv

---

## 📎 License

MIT License
