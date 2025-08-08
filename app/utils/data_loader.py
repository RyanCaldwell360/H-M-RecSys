import pandas as pd
import streamlit as st

@st.cache_data
def load_catalog():
    # read in csv
    df = pd.read_csv("data/sample_articles.csv", dtype={'article_id': 'str'}, nrows=10)
    
    # Construct image path based on article_id (zero-padded)
    df["image_url"] = df["article_id"].apply(lambda x: f"data/images/{x}.jpg")

    return df