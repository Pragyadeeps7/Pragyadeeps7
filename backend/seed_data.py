# Seed data for Saukriti backend (mirrors /app/frontend/src/mock.js)

PRODUCT_IMAGES = {
    "vase": "https://images.unsplash.com/photo-1643569556871-91ec60671ed7?w=800&q=80",
    "candle": "https://images.unsplash.com/photo-1640095889747-2090ee12fa7d?w=800&q=80",
    "plate": "https://images.unsplash.com/photo-1630527152680-500b5453fb04?w=800&q=80",
    "tray": "https://images.unsplash.com/photo-1524084848619-1161d3c8501a?w=800&q=80",
    "bowl": "https://images.unsplash.com/photo-1519916478825-b1d7aef08f54?w=800&q=80",
    "mug": "https://images.unsplash.com/photo-1520485521983-bfaa0bc6c80e?w=800&q=80",
    "wine": "https://images.unsplash.com/photo-1634832296440-b5bac2df86c3?w=800&q=80",
    "planter": "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=800&q=80",
    "lamp": "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&q=80",
    "cushion": "https://images.unsplash.com/photo-1629949009765-40fc74c9ec21?w=800&q=80",
    "towel": "https://images.unsplash.com/photo-1523471826770-c437b4636fe6?w=800&q=80",
    "basket": "https://images.unsplash.com/photo-1622153060419-468f83a0f8f8?w=800&q=80",
    "jar": "https://images.unsplash.com/photo-1622428051717-dcd8412959de?w=800&q=80",
    "frame": "https://images.unsplash.com/photo-1551373884-8a0750074df7?w=800&q=80",
    "clock": "https://images.unsplash.com/photo-1616198814651-e71f960c3180?w=800&q=80",
    "organizer": "https://images.unsplash.com/photo-1636014701699-f086cd23fab6?w=800&q=80",
}

TEMPLATES = [
    ("vase", ["Terracotta Amphora Vase", "Hand-glazed Stoneware Vase", "Marble Bud Vase", "Fluted Ceramic Vessel", "Onyx Tabletop Urn"], "decor"),
    ("candle", ["Sandalwood Pillar Candle", "Oudh & Rose Soy Candle", "Vetiver Travel Candle", "Brass Bell Candleholder", "Saffron Tea-light Set"], "decor"),
    ("plate", ["Ivory Dinner Plate Set", "Stoneware Charger Plate", "Hand-painted Mughal Plate", "Ceramic Pasta Plate", "Marble Side Plate Set"], "dining"),
    ("tray", ["Brass-rimmed Serving Tray", "Mango Wood Ottoman Tray", "Marble Vanity Tray", "Cane Round Serving Tray", "Inlay Coffee Table Tray"], "dining"),
    ("bowl", ["Reactive Glaze Snack Bowl", "Olive Stoneware Bowl", "Hammered Brass Bowl", "Rim-blue Ceramic Bowl", "Pinch Pot Mini Bowl"], "dining"),
    ("mug", ["Speckle-glaze Coffee Mug", "Sage Stoneware Mug Set", "Cloud Latte Cup", "Hand-thrown Tea Mug", "Linen-cream Mug Pair"], "kitchen"),
    ("wine", ["Cut-glass Wine Goblet", "Smoked Crystal Tumbler", "Fluted Champagne Flute", "Amber Vintage Wine Glass", "Bohemia Stemware Set"], "dining"),
    ("planter", ["Ribbed Ceramic Planter", "Terracotta Garden Pot", "Stoneware Round Planter", "Brass-band Plant Holder", "Concrete Sculptural Planter"], "decor"),
    ("lamp", ["Sculptural Table Lamp", "Brass Mushroom Lamp", "Ribbed Glass Lantern", "Linen Drum Shade Lamp", "Onyx Pebble Lamp"], "decor"),
    ("cushion", ["Linen Block-print Cushion", "Velvet Bolster Cushion", "Embroidered Cotton Cushion", "Chenille Throw Cushion", "Tassel Edge Cushion Cover"], "soft"),
    ("towel", ["Waffle Bath Towel Set", "Egyptian Cotton Towel", "Linen Hand Towel Pair", "Turkish Spa Towel", "Striped Bath Sheet"], "bath"),
    ("basket", ["Woven Cane Storage Basket", "Seagrass Round Basket", "Jute Laundry Hamper", "Bamboo Bread Basket", "Rattan Magazine Basket"], "bath"),
    ("jar", ["Crystal Knob Fluted Jar", "Brass Lid Spice Jar", "Apothecary Glass Jar", "Ceramic Storage Canister", "Amber Pantry Jar Set"], "kitchen"),
    ("frame", ["Brass Photo Frame", "Marble Edge Frame", "Walnut Wood Frame", "Mother-of-Pearl Frame", "Beaded Picture Frame"], "gifts"),
    ("clock", ["Roman Numeral Wall Clock", "Brass Desk Clock", "Minimal Oak Clock", "Vintage Station Clock", "Marble Mantel Clock"], "decor"),
    ("organizer", ["Linen Drawer Organizer", "Velvet Jewel Tray", "Cane Desk Caddy", "Marble Stationery Holder", "Wood Watch Box"], "bath"),
]

TAGS_OPTIONS = [
    ["new"], ["sale"], ["festive"], ["new", "festive"], ["sale", "bestseller"],
    ["bestseller"], ["luxe"], ["new", "bestseller"]
]

DESC = ("Hand-crafted by skilled artisans, this piece marries old-world craftsmanship with "
        "contemporary sensibility. Each one is subtly unique \u2014 imperfections are part of its story.")

def _build_products():
    out = []
    idx = 0
    for key, names, cat in TEMPLATES:
        for i in range(8):
            base_price = 1500 + ((idx * 137) % 23000)
            has_sale = idx % 3 == 0
            price = round(base_price * 0.78) if has_sale else base_price
            compare = base_price if has_sale else None
            rating = round(4 + ((idx * 7) % 9) / 10, 1)
            reviews = 24 + (idx * 13) % 480
            tags = list(TAGS_OPTIONS[idx % len(TAGS_OPTIONS)])
            if has_sale:
                tags.append("sale")
            colors_all = ["#D4A574", "#1A1A1A", "#F5F5F5", "#8B5A3C"]
            colors = colors_all[: 2 + (idx % 3)]
            name = names[i % len(names)]
            if i >= len(names):
                name = f"{name} 0{i - len(names) + 2}"
            out.append({
                "id": f"p-{idx + 1}",
                "name": name,
                "category": cat,
                "image": PRODUCT_IMAGES[key],
                "price": int(price),
                "compareAtPrice": int(compare) if compare else None,
                "rating": rating,
                "reviews": reviews,
                "tags": list(dict.fromkeys(tags)),
                "colors": colors,
                "sizes": ["S", "M", "L"],
                "description": DESC,
            })
            idx += 1
    return out

PRODUCTS_SEED = _build_products()

CATEGORIES_SEED = [
    {"id": "dining", "name": "Dining", "image": "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=900&q=80"},
    {"id": "kitchen", "name": "Kitchen", "image": "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=900&q=80"},
    {"id": "decor", "name": "Decor", "image": "https://images.pexels.com/photos/30923809/pexels-photo-30923809.jpeg?w=900"},
    {"id": "bath", "name": "Bath + Storage", "image": "https://images.pexels.com/photos/19916713/pexels-photo-19916713.jpeg?w=900"},
    {"id": "bags", "name": "Bags", "image": "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=900&q=80"},
    {"id": "soft", "name": "Soft Furnishing", "image": "https://images.unsplash.com/photo-1592789705501-f9ae4278a9c9?w=900&q=80"},
    {"id": "gifts", "name": "Gifts", "image": "https://images.unsplash.com/photo-1592903297149-37fb25202dfa?w=900&q=80"},
    {"id": "sale", "name": "Sale", "image": "https://images.pexels.com/photos/7359595/pexels-photo-7359595.jpeg?w=900"},
]

TESTIMONIALS_SEED = [
    {"id": 1, "name": "Aanya Mehta", "city": "Mumbai", "rating": 5,
     "quote": "Every piece feels like it belongs in a gallery. The packaging itself is a love letter to craft.",
     "product": "Marble Vanity Tray"},
    {"id": 2, "name": "Rohan Kapoor", "city": "Delhi", "rating": 5,
     "quote": "The quality is exceptional. My dining table has never looked more thoughtful.",
     "product": "Ivory Dinner Plate Set"},
    {"id": 3, "name": "Tara Pillai", "city": "Bengaluru", "rating": 4,
     "quote": "Beautiful, slow-made objects. I keep coming back for the gift edit \u2014 it never disappoints.",
     "product": "Sandalwood Pillar Candle"},
    {"id": 4, "name": "Ishaan Verma", "city": "Pune", "rating": 5,
     "quote": "Saukriti turned our living room into a quiet, soulful corner of the house.",
     "product": "Sculptural Table Lamp"},
    {"id": 5, "name": "Kavya Singh", "city": "Hyderabad", "rating": 5,
     "quote": "The attention to detail is rare. Each item arrives wrapped like a keepsake.",
     "product": "Linen Block-print Cushion"},
]
