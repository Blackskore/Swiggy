import requests

API_URL = "http://127.0.0.1:8000"

restaurants = [
    {
        "name": "Meghana Foods",
        "description": "Indiranagar",
        "rating": 4.5,
        "is_active": True,
        "image_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&auto=format&fit=crop",
        "delivery_time": "30-35 mins",
        "cuisines": "Biryani, Andhra, South Indian",
        "price_for_two": "₹500 for two"
    },
    {
        "name": "Truffles",
        "description": "Koramangala",
        "rating": 4.5,
        "is_active": True,
        "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop",
        "delivery_time": "40-45 mins",
        "cuisines": "American, Continental, Fast Food",
        "price_for_two": "₹600 for two"
    },
    {
        "name": "Empire Restaurant",
        "description": "Church Street",
        "rating": 4.1,
        "is_active": True,
        "image_url": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=600&auto=format&fit=crop",
        "delivery_time": "25-30 mins",
        "cuisines": "North Indian, Kebabs, Biryani",
        "price_for_two": "₹400 for two"
    },
    {
        "name": "Leon's Burgers & Wings",
        "description": "HSR Layout",
        "rating": 4.4,
        "is_active": True,
        "image_url": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=600&auto=format&fit=crop",
        "delivery_time": "20-25 mins",
        "cuisines": "American, Fast Food, Snacks",
        "price_for_two": "₹300 for two"
    },
    {
        "name": "Corner House Ice Cream",
        "description": "Jayanagar",
        "rating": 4.8,
        "is_active": True,
        "image_url": "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?q=80&w=600&auto=format&fit=crop",
        "delivery_time": "15-20 mins",
        "cuisines": "Desserts, Ice Creams",
        "price_for_two": "₹200 for two"
    }
]

def seed():
    for r in restaurants:
        res = requests.post(f"{API_URL}/restaurants/", json=r)
        if res.status_code == 201:
            print(f"Created: {r['name']}")
        else:
            print(f"Failed: {r['name']} - {res.text}")

if __name__ == "__main__":
    seed()
