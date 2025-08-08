import streamlit as st
import pandas as pd
from utils.data_loader import load_catalog

st.set_page_config(page_title="Product Catalog", layout="wide")
st.title("🛒 Shop the Collection")

# Load product catalog
df = load_catalog()

# Show first 5 rows to debug
st.subheader("🔍 Debug View of Catalog Data")
st.dataframe(df.head(5))

# Sidebar filters
st.sidebar.header("Filter by")

index_names = sorted(df["index_name"].dropna().unique())
product_names = sorted(df["prod_name"].dropna().unique())
product_types = sorted(df["product_type_name"].dropna().unique())
colors = sorted(df["colour_group_name"].dropna().unique())

selected_indexes = st.sidebar.multiselect("Index Name", index_names)
selected_product_types = st.sidebar.multiselect("Product Type", product_types)
selected_colors = st.sidebar.multiselect("Color Group", colors)

# Sort options
sort_option = st.selectbox(
    "Sort by",
    ["Product Name A → Z"],
)

# Apply filters
filtered = df.copy()

if selected_indexes:
    filtered = filtered[filtered["index_name"].isin(selected_indexes)]
if selected_product_types:
    filtered = filtered[filtered['product_type_name'].isin(selected_product_types)]
if selected_colors:
    filtered = filtered[filtered["colour_group_name"].isin(selected_colors)]

# Sort results
if  sort_option == "Product Name A → Z":
    filtered = filtered.sort_values("prod_name")

# Show product count
st.markdown(f"### {len(filtered)} products found")

# Display products in a scrollable grid
cols = st.columns(5)

for i, (_, row) in enumerate(filtered.iterrows()):
    with cols[i % 5]:
        st.image(row["image_url"], use_container_width=True)
        st.caption(f"**{row.get('prod_name', 'Unknown')}**")
        st.write(f"Color: {row.get('colour_group_name', 'N/A')}")

        with st.expander("🔍 View Details"):
            st.write(f"{row.get('detail_desc', 'N/A')}")

        st.markdown("---")
