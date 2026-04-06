import requests

API_URL = "http://127.0.0.1:8000"

menus = [
    {"name": "Paneer Tikka", "description": "Smoky charbroiled cottage cheese", "price": 220, "is_veg": True, "image_url": "https://images.unsplash.com/photo-1599487405620-60a6ae578e91?auto=format&fit=crop&q=80&w=200"},
    {"name": "Chicken Biryani", "description": "Authentic dum biryani cooked to perfection", "price": 280, "is_veg": False, "image_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=200"},
    {"name": "Veg Fried Rice", "description": "Wok tossed wok fast", "price": 180, "is_veg": True, "image_url": "https://images.unsplash.com/photo-1645696301019-35adcc18fc21?auto=format&fit=crop&q=80&w=200"},
    {"name": "Chocolate Brownie", "description": "Warm gooey brownie with walnuts", "price": 120, "is_veg": True, "image_url": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=200"},
]

def seed_menu():
    try:
        res = requests.get(f"{API_URL}/restaurants/")
        restaurants = res.json()
        for r in restaurants:
            # check if menu exists, if empty then seed
            if not r.get("menu_items") or len(r["menu_items"]) == 0:
                for m in menus:
                    requests.post(f"{API_URL}/restaurants/{r['id']}/menu", json=m)
        print("Successfully seeded menus for all restaurants!")
    except Exception as e:
        print(f"Failed to seed menu: {e}")

if __name__ == "__main__":
    seed_menu()
