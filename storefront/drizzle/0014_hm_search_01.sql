CREATE VIRTUAL TABLE articles_fts USING fts5(article_id UNINDEXED, name, product_type, colour, section, garment_group);
INSERT INTO articles_fts (article_id, name, product_type, colour, section, garment_group) SELECT article_id, name, product_type, colour, section, garment_group FROM articles;
PRAGMA optimize;
