# app/home.py
import streamlit as st
import random

st.set_page_config(page_title="H&M Recommender", layout="wide")

def get_mock_items(n):
    return [
        {
            "title": f"Item {i+1}",
            "price": f"${random.randint(10, 100)}",
            "image": f"https://placehold.co/150x200?text=Item+{i+1}"
        }
        for i in range(n)
    ]

def display_items(title, items, num_columns=5):
    st.subheader(title)
    cols = st.columns(num_columns)
    for idx, item in enumerate(items):
        with cols[idx % num_columns]:
            st.image(item["image"], use_container_width=True)
            st.caption(item["title"])
            st.markdown(f"**{item['price']}**")

st.title("🛍️ H&M Recommender System")
st.write("Explore personalized clothing recommendations based on your shopping history.")

st.text_input("Search for clothing, styles, or categories", placeholder="e.g. Dresses, Jeans, Fall Jackets")

display_items("Top Picks for You", get_mock_items(10))
display_items("Trending Now", get_mock_items(10))
display_items("Recently Viewed", get_mock_items(6))
