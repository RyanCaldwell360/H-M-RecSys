# 🛍️ H&M Personalized Recommender System

This project is a personalized recommender system built on transaction data from the [H&M Personalized Fashion Recommendations](https://www.kaggle.com/competitions/h-and-m-personalized-fashion-recommendations) Kaggle competition.

The goal is to build a production-ready app (like Netflix/Spotify-style UIs) using [Streamlit](https://streamlit.io/) that lets users explore item recommendations and product data interactively.

---

## 🚀 Features

- Clean Streamlit front-end (mimics real-world shopping interfaces)
- Modular architecture for plugging in different RecSys models
- Easy to extend with new features (search, filtering, personalization, etc.)

---

## 🧱 Project Structure

h-m-recsys/
├── app/ # Streamlit app code
│ └── home.py
├── models/ # Future recommender system models
├── data/ # Data files (CSV, metadata, etc.)
├── .venv/ # uv-created virtual environment
├── README.md
├── .gitignore

---

## 💻 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/RyanCaldwell360/H-M-RecSys.git
cd h-m-recsys
```

### 2. Set up the environment using uv

```bash
uv venv
uv pip install streamlit
```

### 3. Run the Streamlit app

```bash
streamlit run app/home.py
```

Then open your browser to:

```arduino
http://localhost:8501
```

## 📦 Dependencies

This project uses the following core dependencies:

- [Python 3.9+](https://www.python.org/downloads/)
- [Streamlit](https://streamlit.io/) — for building the interactive UI
- [uv](https://github.com/astral-sh/uv) — for managing the virtual environment and dependencies

## 📌 Roadmap

This project is evolving toward a fully interactive, production-ready recommendation system. Below are the planned phases of development:

- [x] **Initial Setup**  
  Establish project structure, version control, and basic Streamlit UI.

- [ ] **Data Integration**  
  Load and visualize H&M product and transaction data.

- [ ] **Baseline Recommendations**  
  Implement simple heuristics and popularity-based models.

- [ ] **Personalized Recommendations**  
  Integrate user-based and item-based models using collaborative filtering or hybrid approaches.

- [ ] **Advanced Modeling**  
  Experiment with matrix factorization, sequence models (e.g., Transformers), and semantic representations.

- [ ] **Interactive Features**  
  Add user controls, filters, search functionality, and item details.

- [ ] **Deployment**  
  Deploy to Streamlit Cloud or similar platform for public access.

- [ ] **Documentation & Polish**  
  Finalize README, code comments, and usability improvements.
