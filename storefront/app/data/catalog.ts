export type Product = {
  id: string;
  name: string;
  type: string;
  group: string;
  appearance: string;
  colour: string;
  colourValue: string;
  indexName: string;
  section: string;
  garmentGroup: string;
  description: string;
  image: string;
  price: number;
  popularity: number;
  badge?: string;
};

export const catalog: Product[] = [
  { id: "0448509014", name: "Perrie Slim Mom Jeans", type: "Trousers", group: "Garment Lower body", appearance: "Solid", colour: "Light blue", colourValue: "Light", indexName: "Divided", section: "Divided Collection", garmentGroup: "Trousers", description: "5-pocket, ankle-length jeans in washed, sturdy cotton denim with a high waist, button fly and slim, straight legs with raw-edge hems.", image: "/products/0448509014.jpg", price: 39.99, popularity: 397, badge: "Trending" },
  { id: "0673677002", name: "Henry Polo-Neck Sweater", type: "Sweater", group: "Garment Upper body", appearance: "Solid", colour: "Black", colourValue: "Dark", indexName: "Ladieswear", section: "Women’s Tailoring", garmentGroup: "Knitwear", description: "Jumper in a soft, fine knit with a ribbed polo neck and ribbing at the cuffs and hem.", image: "/products/0673677002.jpg", price: 34.99, popularity: 340 },
  { id: "0714790020", name: "Ultra High Mom Jeans", type: "Trousers", group: "Garment Lower body", appearance: "Denim", colour: "Washed blue", colourValue: "Medium dusty", indexName: "Divided", section: "Ladies Denim", garmentGroup: "Trousers Denim", description: "5-pocket, ankle-length jeans in washed stretch cotton denim with an extra-high waist and straight legs.", image: "/products/0714790020.jpg", price: 49.99, popularity: 378 },
  { id: "0751471001", name: "Pluto Cigarette Trousers", type: "Trousers", group: "Garment Lower body", appearance: "Solid", colour: "Black", colourValue: "Dark", indexName: "Ladieswear", section: "Women’s Everyday", garmentGroup: "Trousers", description: "Ankle-length cigarette trousers in a stretch weave with a regular waist, side pockets and tapered legs.", image: "/products/0751471001.jpg", price: 29.99, popularity: 433, badge: "Bestseller" },
  { id: "0762846027", name: "Lucy Collared Blouse", type: "Shirt", group: "Garment Upper body", appearance: "Solid", colour: "Beige", colourValue: "Dusty light", indexName: "Ladieswear", section: "Women’s Tailoring", garmentGroup: "Blouses", description: "Long-sleeved blouse in woven fabric with a collar, V-neck, buttons down the front and rounded hem.", image: "/products/0762846027.jpg", price: 24.99, popularity: 416 },
  { id: "0850917001", name: "Sadie Fitted Shirt", type: "Shirt", group: "Garment Upper body", appearance: "Solid", colour: "White", colourValue: "Light", indexName: "Ladieswear", section: "Women’s Tailoring", garmentGroup: "Blouses", description: "Gently fitted shirt in a stretch cotton-blend weave with peak lapels, wide buttoned cuffs and a rounded hem.", image: "/products/0850917001.jpg", price: 32.99, popularity: 336 },
  { id: "0865799006", name: "Barrel-Leg Twill Trousers", type: "Trousers", group: "Garment Lower body", appearance: "Solid", colour: "Light beige", colourValue: "Dusty light", indexName: "Ladieswear", section: "Women’s Everyday", garmentGroup: "Trousers", description: "5-pocket, ankle-length trousers in washed cotton twill with a high waist and wide, tapered legs.", image: "/products/0865799006.jpg", price: 34.99, popularity: 393 },
  { id: "0866731001", name: "Lana Seamless Sports Tights", type: "Leggings/Tights", group: "Garment Lower body", appearance: "Solid", colour: "Black", colourValue: "Dark", indexName: "Sport", section: "H&M Move", garmentGroup: "Jersey Fancy", description: "Ankle-length sports tights in fast-drying fabric with a high waist and wide elasticated ribbing.", image: "/products/0866731001.jpg", price: 29.99, popularity: 484, badge: "Bestseller" },
  { id: "0889550002", name: "Long Puffer Jacket", type: "Jacket", group: "Garment Upper body", appearance: "Solid", colour: "Black", colourValue: "Dark", indexName: "Divided", section: "Divided Collection", garmentGroup: "Outdoor", description: "Knee-length padded jacket with a stand-up collar, hood, two-way zip and welt pockets.", image: "/products/0889550002.jpg", price: 69.99, popularity: 342 },
  { id: "0896169005", name: "Hilton Soft-Knit Cardigan", type: "Cardigan", group: "Garment Upper body", appearance: "Melange", colour: "Light purple", colourValue: "Dusty light", indexName: "Ladieswear", section: "Women’s Everyday", garmentGroup: "Knitwear", description: "Soft wool-blend cardigan with a boxy fit, deep V-neck, decorative buttons and dropped shoulders.", image: "/products/0896169005.jpg", price: 44.99, popularity: 360 },
  { id: "0909370001", name: "Haley Jacquard Dress", type: "Dress", group: "Garment Full body", appearance: "Jacquard", colour: "Off white", colourValue: "Dusty light", indexName: "Ladieswear", section: "Women’s Everyday", garmentGroup: "Special Offers", description: "Short A-line jacquard dress with a pleated stand-up collar, long puff sleeves and gathered tiers.", image: "/products/0909370001.jpg", price: 39.99, popularity: 472, badge: "New" },
  { id: "0915529003", name: "Liliana Square-Neck Sweater", type: "Sweater", group: "Garment Upper body", appearance: "Solid", colour: "Black", colourValue: "Dark", indexName: "Ladieswear", section: "Women’s Everyday", garmentGroup: "Knitwear", description: "Soft fine-knit wool-blend jumper with a square neckline, long puff sleeves and wide ribbed trims.", image: "/products/0915529003.jpg", price: 34.99, popularity: 460 },
  { id: "0915529005", name: "Liliana Square-Neck Sweater", type: "Sweater", group: "Garment Upper body", appearance: "Solid", colour: "Beige", colourValue: "Dusty light", indexName: "Ladieswear", section: "Women’s Everyday", garmentGroup: "Knitwear", description: "Soft fine-knit wool-blend jumper with a square neckline, long puff sleeves and wide ribbed trims.", image: "/products/0915529005.jpg", price: 34.99, popularity: 433 },
  { id: "0918292001", name: "Strong Seamless Sports Tights", type: "Leggings/Tights", group: "Garment Lower body", appearance: "Melange", colour: "Black", colourValue: "Dark", indexName: "Sport", section: "H&M Move", garmentGroup: "Jersey Fancy", description: "Fast-drying sports tights with jacquard details, a high waist and minimal seams for increased mobility.", image: "/products/0918292001.jpg", price: 39.99, popularity: 405 },
  { id: "0918522001", name: "Jackie Cable-Knit Vest", type: "Sweater", group: "Garment Upper body", appearance: "Solid", colour: "Off white", colourValue: "Light", indexName: "Ladieswear", section: "Women’s Everyday", garmentGroup: "Knitwear", description: "Relaxed V-neck slipover in a soft cable knit with ribbing around the neckline and hem.", image: "/products/0918522001.jpg", price: 29.99, popularity: 578, badge: "Most loved" },
  { id: "0919273002", name: "Lucien Lace Blouse", type: "Blouse", group: "Garment Upper body", appearance: "Lace", colour: "Black", colourValue: "Dark", indexName: "Ladieswear", section: "Women’s Everyday", garmentGroup: "Blouses", description: "Soft cotton-blend lace blouse with a stand-up collar, draped gathers and long puff sleeves.", image: "/products/0919273002.jpg", price: 32.99, popularity: 365 },
  { id: "0923758001", name: "Vanessa Oversized Shirt", type: "Unknown", group: "Unknown", appearance: "Solid", colour: "White", colourValue: "Light", indexName: "Ladieswear", section: "Women’s Everyday", garmentGroup: "Blouses", description: "Wide cotton shirt with a collar, buttons down the front, dropped shoulders and a rounded hem.", image: "/products/0923758001.jpg", price: 29.99, popularity: 526 },
  { id: "0924243001", name: "Ohlsson Rib-Knit Vest", type: "Sweater", group: "Garment Upper body", appearance: "Solid", colour: "Beige", colourValue: "Dusty light", indexName: "Ladieswear", section: "Women’s Everyday", garmentGroup: "Knitwear", description: "Relaxed-fit wool-blend sweater vest in a soft rib knit with side slits and a longer back.", image: "/products/0924243001.jpg", price: 27.99, popularity: 775, badge: "Most loved" },
  { id: "0924243002", name: "Ohlsson Rib-Knit Vest", type: "Sweater", group: "Garment Upper body", appearance: "Solid", colour: "Black", colourValue: "Dark", indexName: "Ladieswear", section: "Women’s Everyday", garmentGroup: "Knitwear", description: "Relaxed-fit wool-blend sweater vest in a soft rib knit with side slits and a longer back.", image: "/products/0924243002.jpg", price: 27.99, popularity: 545 },
  { id: "0935541001", name: "Aussi Ribbed Midi Dress", type: "Dress", group: "Garment Full body", appearance: "Solid", colour: "Black", colourValue: "Dark", indexName: "Divided", section: "Divided Projects", garmentGroup: "Unknown", description: "Fitted calf-length dress in soft ribbed fabric with a high neckline, long sleeves and side slits.", image: "/products/0935541001.jpg", price: 49.99, popularity: 346 },
];

export type ProfileId = "maya" | "alex" | "noor";

type Profile = {
  name: string;
  signal: string;
  description: string;
  seedLabel: string;
  categories: string[];
  colours: string[];
  indexes: string[];
  purchased: string[];
};

export const profiles: Record<ProfileId, Profile> = {
  maya: { name: "Maya", signal: "Neutral layers", description: "Soft tailoring, polished layers and quiet neutrals—ranked from Maya’s demo history.", seedLabel: "beige knitwear + a relaxed white shirt", categories: ["Sweater", "Cardigan", "Shirt", "Blouse", "Unknown"], colours: ["Beige", "Light beige", "White", "Off white"], indexes: ["Ladieswear"], purchased: ["0924243001", "0923758001"] },
  alex: { name: "Alex", signal: "Denim first", description: "Relaxed denim, easy trousers and Divided essentials shaped around Alex’s demo history.", seedLabel: "two blue denim purchases", categories: ["Trousers", "Jacket"], colours: ["Light blue", "Washed blue", "Black"], indexes: ["Divided"], purchased: ["0448509014", "0714790020"] },
  noor: { name: "Noor", signal: "Move in black", description: "High-performance staples and versatile black layers based on Noor’s demo activity.", seedLabel: "seamless black sports tights", categories: ["Leggings/Tights", "Sweater", "Jacket"], colours: ["Black"], indexes: ["Sport"], purchased: ["0866731001", "0918292001"] },
};

export type Recommendation = { product: Product; score: number; reason: string };

export function recommend(profileId: ProfileId): Recommendation[] {
  const profile = profiles[profileId];
  const maximumPopularity = Math.max(...catalog.map((product) => product.popularity));
  return catalog
    .filter((product) => !profile.purchased.includes(product.id))
    .map((product) => {
      const popularity = (product.popularity / maximumPopularity) * 0.35;
      const categoryMatch = profile.categories.includes(product.type) ? 0.3 : 0;
      const colourMatch = profile.colours.includes(product.colour) ? 0.2 : 0;
      const collectionMatch = profile.indexes.includes(product.indexName) ? 0.1 : 0;
      const discovery = 0.05;
      const score = popularity + categoryMatch + colourMatch + collectionMatch + discovery;
      let reason = "Popular right now";
      if (categoryMatch && colourMatch) reason = `Your ${product.colour.toLowerCase()} ${product.type.toLowerCase()} edit`;
      else if (categoryMatch) reason = `More ${product.garmentGroup.toLowerCase()} for you`;
      else if (colourMatch) reason = `In your ${product.colour.toLowerCase()} palette`;
      else if (collectionMatch) reason = `From ${product.indexName}`;
      return { product, score, reason };
    })
    .sort((a, b) => b.score - a.score || b.product.popularity - a.product.popularity);
}
