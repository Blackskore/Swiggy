"""
seed_cities.py — Seeds restaurants for 12 major Indian cities with random menu items.
Run: python seed_cities.py
Backend must be running on http://127.0.0.1:8000
"""

import requests
import random

import os

API_URL = os.environ.get("API_URL", "http://127.0.0.1:8000")

IMAGES = {
    "biryani":   "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&auto=format&fit=crop",
    "burger":    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop",
    "northind":  "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=600&auto=format&fit=crop",
    "pizza":     "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=600&auto=format&fit=crop",
    "chinese":   "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?q=80&w=600&auto=format&fit=crop",
    "southind":  "https://images.unsplash.com/photo-1630383249896-424e482df921?q=80&w=600&auto=format&fit=crop",
    "icecream":  "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?q=80&w=600&auto=format&fit=crop",
    "seafood":   "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?q=80&w=600&auto=format&fit=crop",
    "sweets":    "https://images.unsplash.com/photo-1466637574441-749b8f19452f?q=80&w=600&auto=format&fit=crop",
    "cafe":      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=600&auto=format&fit=crop",
    "thali":     "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600&auto=format&fit=crop",
    "kebab":     "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop",
    "dhaba":     "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=600&auto=format&fit=crop",
    "fastfood":  "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=600&auto=format&fit=crop",
    "dessert":   "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=600&auto=format&fit=crop",
}

MENU_ITEMS_POOL = {
    "biryani": [
        {"name": "Hyderabadi Chicken Biryani", "description": "Authentic chicken biryani", "price": 280, "is_veg": False},
        {"name": "Mutton Biryani", "description": "Slow cooked mutton biryani", "price": 350, "is_veg": False},
        {"name": "Paneer Biryani", "description": "Marinated paneer with basmati rice", "price": 250, "is_veg": True},
        {"name": "Chicken Lollipop", "description": "Spicy fried chicken wings", "price": 220, "is_veg": False},
        {"name": "Mirchi Ka Salan", "description": "Traditional chili gravy", "price": 120, "is_veg": True},
    ],
    "burger": [
        {"name": "Cheese Burger", "description": "Extra cheesy burger", "price": 180, "is_veg": True},
        {"name": "Chicken Crispy Burger", "description": "Crispy chicken patty with mayo", "price": 210, "is_veg": False},
        {"name": "French Fries", "description": "Classic salted fries", "price": 100, "is_veg": True},
        {"name": "Onion Rings", "description": "Crispy fried onion rings", "price": 120, "is_veg": True},
        {"name": "Coke", "description": "Refreshing soft drink", "price": 50, "is_veg": True},
    ],
    "northind": [
        {"name": "Butter Chicken", "description": "Rich and creamy tomato gravy chicken", "price": 320, "is_veg": False},
        {"name": "Paneer Butter Masala", "description": "Classic paneer dish", "price": 280, "is_veg": True},
        {"name": "Dal Makhani", "description": "Slow cooked black lentils", "price": 240, "is_veg": True},
        {"name": "Garlic Naan", "description": "Freshly baked in tandoor", "price": 60, "is_veg": True},
        {"name": "Butter Naan", "description": "Soft naan with butter", "price": 50, "is_veg": True},
    ],
    "pizza": [
        {"name": "Margherita Pizza", "description": "Classic dots and cheese", "price": 300, "is_veg": True},
        {"name": "Pepperoni Pizza", "description": "Spicy pepperoni and cheese", "price": 450, "is_veg": False},
        {"name": "Veggie Supreme Pizza", "description": "All the veggies you love", "price": 380, "is_veg": True},
        {"name": "Garlic Breadsticks", "description": "Warm and buttery", "price": 150, "is_veg": True},
        {"name": "Stuffed Garlic Bread", "description": "Cheesy and delicious", "price": 180, "is_veg": True},
    ],
    "chinese": [
        {"name": "Veg Manchurian", "description": "Asian delight in gravy", "price": 220, "is_veg": True},
        {"name": "Chicken Fried Rice", "description": "Stir fried rice with chicken", "price": 250, "is_veg": False},
        {"name": "Hakka Noodles", "description": "Classic vegetable noodles", "price": 200, "is_veg": True},
        {"name": "Chili Chicken", "description": "Spicy Indo-Chinese classic", "price": 280, "is_veg": False},
        {"name": "Spring Rolls", "description": "Crispy vegetable rolls", "price": 160, "is_veg": True},
    ],
    "southind": [
        {"name": "Masala Dosa", "description": "Crispy dosa with potato filling", "price": 120, "is_veg": True},
        {"name": "Idli Sambar", "description": "Steamed rice cakes with lentil soup", "price": 80, "is_veg": True},
        {"name": "Vada", "description": "Savory fried donuts", "price": 90, "is_veg": True},
        {"name": "Filter Coffee", "description": "Traditional south indian coffee", "price": 40, "is_veg": True},
        {"name": "Onion Uthappam", "description": "Thick pancake with onions", "price": 110, "is_veg": True},
    ],
    "icecream": [
        {"name": "Vanilla Scoop", "description": "Classic vanilla flavor", "price": 60, "is_veg": True},
        {"name": "Death by Chocolate", "description": "Ultimate chocolate dessert", "price": 180, "is_veg": True},
        {"name": "Mango Mastani", "description": "Thick mango milkshake with ice cream", "price": 150, "is_veg": True},
        {"name": "Gudbod Ice Cream", "description": "Layered mixed fruit ice cream", "price": 160, "is_veg": True},
    ],
    "seafood": [
        {"name": "Fish Curry", "description": "Coastal style fish curry", "price": 350, "is_veg": False},
        {"name": "Prawns Fry", "description": "Spicy masala fried prawns", "price": 400, "is_veg": False},
        {"name": "Surmai Thali", "description": "Complete fish thali", "price": 500, "is_veg": False},
        {"name": "Crab Masala", "description": "Rich and spicy crab gravy", "price": 550, "is_veg": False},
    ],
    "sweets": [
        {"name": "Gulab Jamun (2pcs)", "description": "Soft milk solids balls in syrup", "price": 70, "is_veg": True},
        {"name": "Rasmalai (2pcs)", "description": "Creamy milk dessert", "price": 90, "is_veg": True},
        {"name": "Kaju Katli (250g)", "description": "Cashew fudge", "price": 250, "is_veg": True},
        {"name": "Jalebi (250g)", "description": "Crispy sweet rings", "price": 120, "is_veg": True},
    ],
}

CITY_RESTAURANTS = {

    # ── Bengaluru ───────────────────────────────────────────────────────────────
    "Bengaluru": [
        {"name": "Meghana Foods", "area": "Indiranagar", "rating": 4.5, "cuisines": "Biryani, Andhra, South Indian", "delivery_time": "30-35 mins", "price_for_two": "₹500 for two", "img": "biryani"},
        {"name": "Truffles", "area": "Koramangala", "rating": 4.5, "cuisines": "American, Continental, Fast Food", "delivery_time": "40-45 mins", "price_for_two": "₹600 for two", "img": "burger"},
        {"name": "Empire Restaurant", "area": "Church Street", "rating": 4.1, "cuisines": "North Indian, Kebabs, Biryani", "delivery_time": "25-30 mins", "price_for_two": "₹400 for two", "img": "kebab"},
        {"name": "Leon's Burgers & Wings", "area": "HSR Layout", "rating": 4.4, "cuisines": "American, Fast Food, Snacks", "delivery_time": "20-25 mins", "price_for_two": "₹300 for two", "img": "burger"},
        {"name": "Corner House Ice Cream", "area": "Jayanagar", "rating": 4.8, "cuisines": "Desserts, Ice Creams", "delivery_time": "15-20 mins", "price_for_two": "₹200 for two", "img": "icecream"},
        {"name": "MTR - Mavalli Tiffin Room", "area": "Lalbagh Road", "rating": 4.7, "cuisines": "South Indian, Breakfast, Tiffin", "delivery_time": "25-30 mins", "price_for_two": "₹250 for two", "img": "southind"},
        {"name": "Vidyarthi Bhavan", "area": "Gandhi Bazaar", "rating": 4.6, "cuisines": "South Indian, Dosa, Breakfast", "delivery_time": "30-35 mins", "price_for_two": "₹200 for two", "img": "southind"},
        {"name": "Flechazo", "area": "Indiranagar", "rating": 4.3, "cuisines": "Mexican, Mediterranean, Italian", "delivery_time": "35-40 mins", "price_for_two": "₹700 for two", "img": "pizza"},
    ],

    # ── Mumbai ───────────────────────────────────────────────────────────────
    "Mumbai": [
        {"name": "Bademiya", "area": "Colaba", "rating": 4.4, "cuisines": "Kebabs, North Indian, Rolls", "delivery_time": "30-35 mins", "price_for_two": "₹400 for two", "img": "kebab"},
        {"name": "Trishna", "area": "Fort", "rating": 4.6, "cuisines": "Seafood, Coastal, Goan", "delivery_time": "40-45 mins", "price_for_two": "₹1500 for two", "img": "seafood"},
        {"name": "Sardar Pav Bhaji", "area": "Tardeo", "rating": 4.5, "cuisines": "Pav Bhaji, Street Food, Snacks", "delivery_time": "20-25 mins", "price_for_two": "₹200 for two", "img": "fastfood"},
        {"name": "Cafe Mondegar", "area": "Colaba", "rating": 4.2, "cuisines": "Continental, Cafe, Snacks", "delivery_time": "30-35 mins", "price_for_two": "₹500 for two", "img": "cafe"},
        {"name": "Britannia & Co.", "area": "Ballard Estate", "rating": 4.7, "cuisines": "Parsi, Berry Pulao, Iranian", "delivery_time": "35-40 mins", "price_for_two": "₹600 for two", "img": "northind"},
        {"name": "Jimmy Boy", "area": "Fort", "rating": 4.5, "cuisines": "Parsi, Dhansak, Continental", "delivery_time": "35-40 mins", "price_for_two": "₹700 for two", "img": "thali"},
        {"name": "Ram Ashraya", "area": "Matunga", "rating": 4.6, "cuisines": "South Indian, Udupi, Breakfast", "delivery_time": "25-30 mins", "price_for_two": "₹200 for two", "img": "southind"},
        {"name": "Khyber", "area": "Fort", "rating": 4.5, "cuisines": "North Indian, Mughlai, Kebabs", "delivery_time": "40-45 mins", "price_for_two": "₹1500 for two", "img": "northind"},
    ],

    # ── Delhi ─────────────────────────────────────────────────────────────────
    "Delhi": [
        {"name": "Paranthe Wali Gali", "area": "Chandni Chowk", "rating": 4.5, "cuisines": "North Indian, Parantha, Street Food", "delivery_time": "25-30 mins", "price_for_two": "₹200 for two", "img": "northind"},
        {"name": "Karim's", "area": "Jama Masjid", "rating": 4.6, "cuisines": "Mughlai, Kebabs, Biriyani", "delivery_time": "30-35 mins", "price_for_two": "₹600 for two", "img": "kebab"},
        {"name": "Indian Accent", "area": "The Lodhi", "rating": 4.8, "cuisines": "Modern Indian, Fine Dining, Continental", "delivery_time": "45-50 mins", "price_for_two": "₹4000 for two", "img": "thali"},
        {"name": "Bukhara - ITC Maurya", "area": "Chanakyapuri", "rating": 4.7, "cuisines": "North Indian, Dal Bukhara, Kebabs", "delivery_time": "50-55 mins", "price_for_two": "₹5000 for two", "img": "northind"},
        {"name": "Haldiram's", "area": "Chandni Chowk", "rating": 4.3, "cuisines": "Sweets, Snacks, Chaat, Mithai", "delivery_time": "20-25 mins", "price_for_two": "₹300 for two", "img": "sweets"},
        {"name": "Al Jawahar", "area": "Jama Masjid", "rating": 4.4, "cuisines": "Mughlai, Biryani, Nihari", "delivery_time": "35-40 mins", "price_for_two": "₹500 for two", "img": "biryani"},
        {"name": "Soda Bottle Openerwala", "area": "Cyber Hub", "rating": 4.3, "cuisines": "Parsi, Irani Cafe, Continental", "delivery_time": "35-40 mins", "price_for_two": "₹800 for two", "img": "cafe"},
        {"name": "Dilli 6", "area": "Vasant Kunj", "rating": 4.2, "cuisines": "Street Food, North Indian, Chaat", "delivery_time": "25-30 mins", "price_for_two": "₹400 for two", "img": "fastfood"},
    ],

    # ── Hyderabad ────────────────────────────────────────────────────────────
    "Hyderabad": [
        {"name": "Paradise Restaurant", "area": "Secunderabad", "rating": 4.5, "cuisines": "Biryani, Hyderabadi, Mughlai", "delivery_time": "30-35 mins", "price_for_two": "₹500 for two", "img": "biryani"},
        {"name": "Bawarchi", "area": "RTC X Roads", "rating": 4.4, "cuisines": "Biryani, Hyderabadi, North Indian", "delivery_time": "25-30 mins", "price_for_two": "₹400 for two", "img": "biryani"},
        {"name": "Shah Ghouse", "area": "Tolichowki", "rating": 4.6, "cuisines": "Biryani, Haleem, Mughlai", "delivery_time": "35-40 mins", "price_for_two": "₹500 for two", "img": "biryani"},
        {"name": "Ohri's Dum Pukht", "area": "Banjara Hills", "rating": 4.4, "cuisines": "Mughlai, Dum Biryani, Kebabs", "delivery_time": "40-45 mins", "price_for_two": "₹800 for two", "img": "kebab"},
        {"name": "Chutneys", "area": "Banjara Hills", "rating": 4.3, "cuisines": "South Indian, Tiffin, Breakfast", "delivery_time": "20-25 mins", "price_for_two": "₹300 for two", "img": "southind"},
        {"name": "Kritunga Restaurant", "area": "Jubilee Hills", "rating": 4.2, "cuisines": "Andhra, Rayalaseema, South Indian", "delivery_time": "30-35 mins", "price_for_two": "₹400 for two", "img": "southind"},
        {"name": "Hotel Shadab", "area": "High Court Road", "rating": 4.5, "cuisines": "Biryani, Haleem, Paya", "delivery_time": "35-40 mins", "price_for_two": "₹450 for two", "img": "biryani"},
    ],

    # ── Chennai ──────────────────────────────────────────────────────────────
    "Chennai": [
        {"name": "Saravana Bhavan", "area": "T. Nagar", "rating": 4.5, "cuisines": "South Indian, Tiffin, Veg", "delivery_time": "20-25 mins", "price_for_two": "₹250 for two", "img": "southind"},
        {"name": "Murugan Idli Shop", "area": "T. Nagar", "rating": 4.6, "cuisines": "Idli, Dosa, South Indian", "delivery_time": "20-25 mins", "price_for_two": "₹200 for two", "img": "southind"},
        {"name": "Buhari Hotel", "area": "Anna Salai", "rating": 4.3, "cuisines": "North Indian, Biryani, Kebabs", "delivery_time": "30-35 mins", "price_for_two": "₹500 for two", "img": "biryani"},
        {"name": "Junior Kuppanna", "area": "Saidapet", "rating": 4.4, "cuisines": "Chettinad, South Indian, Biryani", "delivery_time": "35-40 mins", "price_for_two": "₹400 for two", "img": "southind"},
        {"name": "The Boardroom", "area": "Nungambakkam", "rating": 4.3, "cuisines": "Continental, Cafe, Grills", "delivery_time": "35-40 mins", "price_for_two": "₹700 for two", "img": "cafe"},
        {"name": "Mathsya Seafood", "area": "Nungambakkam", "rating": 4.4, "cuisines": "Seafood, Coastal, South Indian", "delivery_time": "40-45 mins", "price_for_two": "₹800 for two", "img": "seafood"},
        {"name": "Annalakshmi", "area": "Boat Club Road", "rating": 4.5, "cuisines": "South Indian, Veg, Sweets", "delivery_time": "25-30 mins", "price_for_two": "₹300 for two", "img": "thali"},
    ],

    # ── Kolkata ──────────────────────────────────────────────────────────────
    "Kolkata": [
        {"name": "Peter Cat", "area": "Park Street", "rating": 4.5, "cuisines": "Continental, Chelo Kebab, Mughlai", "delivery_time": "35-40 mins", "price_for_two": "₹700 for two", "img": "kebab"},
        {"name": "Arsalan", "area": "Park Circus", "rating": 4.6, "cuisines": "Biryani, Mughlai, Rolls", "delivery_time": "30-35 mins", "price_for_two": "₹500 for two", "img": "biryani"},
        {"name": "6 Ballygunge Place", "area": "Ballygunge", "rating": 4.5, "cuisines": "Bengali, Traditional, Fish", "delivery_time": "40-45 mins", "price_for_two": "₹800 for two", "img": "seafood"},
        {"name": "Kewpie's Kitchen", "area": "Elgin Road", "rating": 4.4, "cuisines": "Bengali, Thali, Home Style", "delivery_time": "35-40 mins", "price_for_two": "₹600 for two", "img": "thali"},
        {"name": "Bhojohori Manna", "area": "Hindustan Park", "rating": 4.3, "cuisines": "Bengali, Fish Curry, Mustard", "delivery_time": "30-35 mins", "price_for_two": "₹500 for two", "img": "seafood"},
        {"name": "Oh! Calcutta", "area": "Quest Mall", "rating": 4.5, "cuisines": "Bengali Fine Dining, Seafood", "delivery_time": "40-45 mins", "price_for_two": "₹1200 for two", "img": "seafood"},
        {"name": "Flurys", "area": "Park Street", "rating": 4.4, "cuisines": "Bakery, Continental, Cafe", "delivery_time": "25-30 mins", "price_for_two": "₹500 for two", "img": "cafe"},
    ],

    # ── Pune ─────────────────────────────────────────────────────────────────
    "Pune": [
        {"name": "Vaishali Restaurant", "area": "FC Road", "rating": 4.5, "cuisines": "South Indian, Tiffin, Veg", "delivery_time": "20-25 mins", "price_for_two": "₹200 for two", "img": "southind"},
        {"name": "Malaka Spice", "area": "Koregaon Park", "rating": 4.4, "cuisines": "Asian, Pan-Asian, Thai", "delivery_time": "35-40 mins", "price_for_two": "₹700 for two", "img": "chinese"},
        {"name": "Sujata Mastani", "area": "Sadashiv Peth", "rating": 4.6, "cuisines": "Mastani, Milkshakes, Desserts", "delivery_time": "20-25 mins", "price_for_two": "₹200 for two", "img": "icecream"},
        {"name": "Shabree", "area": "Camp", "rating": 4.3, "cuisines": "Maharashtrian, Misal, Tiffin", "delivery_time": "25-30 mins", "price_for_two": "₹300 for two", "img": "thali"},
        {"name": "Kayani Bakery", "area": "East Street", "rating": 4.5, "cuisines": "Bakery, Shrewsbury, Mawa Cake", "delivery_time": "20-25 mins", "price_for_two": "₹200 for two", "img": "dessert"},
        {"name": "Durvankur", "area": "Narayan Peth", "rating": 4.4, "cuisines": "Maharashtrian, Thali, Seafood", "delivery_time": "35-40 mins", "price_for_two": "₹500 for two", "img": "thali"},
        {"name": "Marzorin", "area": "Camp", "rating": 4.3, "cuisines": "Bakery, Continental, Cafe", "delivery_time": "25-30 mins", "price_for_two": "₹300 for two", "img": "cafe"},
    ],

    # ── Ahmedabad ────────────────────────────────────────────────────────────
    "Ahmedabad": [
        {"name": "Gordhan Thal", "area": "Vastrapur", "rating": 4.5, "cuisines": "Gujarati Thali, Veg", "delivery_time": "25-30 mins", "price_for_two": "₹400 for two", "img": "thali"},
        {"name": "Agashiye", "area": "Old City", "rating": 4.6, "cuisines": "Gujarati Thali, Traditional, Veg", "delivery_time": "35-40 mins", "price_for_two": "₹600 for two", "img": "thali"},
        {"name": "Vishalla", "area": "Vasna", "rating": 4.7, "cuisines": "Gujarati Village Food, Traditional", "delivery_time": "40-45 mins", "price_for_two": "₹600 for two", "img": "thali"},
        {"name": "Green House", "area": "CG Road", "rating": 4.3, "cuisines": "Multi-Cuisine, Continental, Chinese", "delivery_time": "30-35 mins", "price_for_two": "₹500 for two", "img": "chinese"},
        {"name": "LMB - Laxmi Mishthan Bhandar", "area": "Johari Bazaar", "rating": 4.4, "cuisines": "Sweets, Rajasthani Thali, Farsan", "delivery_time": "25-30 mins", "price_for_two": "₹350 for two", "img": "sweets"},
        {"name": "Tomatoes", "area": "Navrangpura", "rating": 4.2, "cuisines": "Chinese, Indo-Chinese, Fast Food", "delivery_time": "25-30 mins", "price_for_two": "₹400 for two", "img": "chinese"},
    ],

    # ── Jaipur ───────────────────────────────────────────────────────────────
    "Jaipur": [
        {"name": "Chokhi Dhani", "area": "Tonk Road", "rating": 4.6, "cuisines": "Rajasthani, Dal Bati, Thali", "delivery_time": "40-45 mins", "price_for_two": "₹700 for two", "img": "thali"},
        {"name": "Laxmi Mishtan Bhandar", "area": "Johari Bazar", "rating": 4.4, "cuisines": "Sweets, Rajasthani, Mithai", "delivery_time": "20-25 mins", "price_for_two": "₹300 for two", "img": "sweets"},
        {"name": "Niros", "area": "MI Road", "rating": 4.3, "cuisines": "North Indian, Chinese, Continental", "delivery_time": "35-40 mins", "price_for_two": "₹800 for two", "img": "northind"},
        {"name": "Rawat Misthan Bhandar", "area": "Station Road", "rating": 4.5, "cuisines": "Sweets, Pyaz Kachori, Snacks", "delivery_time": "20-25 mins", "price_for_two": "₹200 for two", "img": "sweets"},
        {"name": "1135 AD", "area": "Amer Fort Road", "rating": 4.5, "cuisines": "Royal Rajasthani, Fine Dining", "delivery_time": "45-50 mins", "price_for_two": "₹2500 for two", "img": "thali"},
        {"name": "Suvarna Mahal", "area": "Rambagh Palace", "rating": 4.7, "cuisines": "Royal Indian, Continental", "delivery_time": "50-55 mins", "price_for_two": "₹4000 for two", "img": "northind"},
    ],

    # ── Kochi ─────────────────────────────────────────────────────────────────
    "Kochi": [
        {"name": "Dal Roti", "area": "Fort Kochi", "rating": 4.4, "cuisines": "North Indian, Dhaba, Punjabi", "delivery_time": "25-30 mins", "price_for_two": "₹400 for two", "img": "dhaba"},
        {"name": "Malabar Junction", "area": "Fort Kochi", "rating": 4.5, "cuisines": "Kerala, Seafood, Coastal", "delivery_time": "35-40 mins", "price_for_two": "₹800 for two", "img": "seafood"},
        {"name": "Kayees Biryani", "area": "Mattancherry", "rating": 4.6, "cuisines": "Malabar Biryani, Seafood, Kerala", "delivery_time": "30-35 mins", "price_for_two": "₹400 for two", "img": "biryani"},
        {"name": "Pai Brothers", "area": "Broadway", "rating": 4.3, "cuisines": "Kerala Sadhya, Thali, South Indian", "delivery_time": "25-30 mins", "price_for_two": "₹300 for two", "img": "thali"},
        {"name": "Fort House Restaurant", "area": "Fort Kochi", "rating": 4.5, "cuisines": "Seafood, Kerala, Continental", "delivery_time": "35-40 mins", "price_for_two": "₹900 for two", "img": "seafood"},
    ],

    # ── Chandigarh ───────────────────────────────────────────────────────────
    "Chandigarh": [
        {"name": "Sindhi Sweets", "area": "Sector 17", "rating": 4.4, "cuisines": "Sweets, Punjabi, Snacks", "delivery_time": "15-20 mins", "price_for_two": "₹200 for two", "img": "sweets"},
        {"name": "Pal Dhaba", "area": "Sector 28", "rating": 4.5, "cuisines": "Punjab Dhaba, Dal Makhani, Tandoor", "delivery_time": "25-30 mins", "price_for_two": "₹500 for two", "img": "dhaba"},
        {"name": "Peddlers", "area": "Sector 8", "rating": 4.3, "cuisines": "Continental, Bar Food, Grills", "delivery_time": "30-35 mins", "price_for_two": "₹700 for two", "img": "cafe"},
        {"name": "Gopal's Sweets", "area": "Sector 22", "rating": 4.5, "cuisines": "Sweets, Mithai, Snacks, Chaat", "delivery_time": "15-20 mins", "price_for_two": "₹200 for two", "img": "sweets"},
        {"name": "The Great Wall of China", "area": "Sector 17", "rating": 4.2, "cuisines": "Chinese, Pan-Asian, Thai", "delivery_time": "30-35 mins", "price_for_two": "₹600 for two", "img": "chinese"},
    ],

    # ── Lucknow ──────────────────────────────────────────────────────────────
    "Lucknow": [
        {"name": "Tunday Kababi", "area": "Aminabad", "rating": 4.7, "cuisines": "Awadhi Kebabs, Biryani, Mughlai", "delivery_time": "30-35 mins", "price_for_two": "₹400 for two", "img": "kebab"},
        {"name": "Idris Biryani", "area": "Nakhas", "rating": 4.5, "cuisines": "Awadhi Biryani, Mughlai", "delivery_time": "25-30 mins", "price_for_two": "₹300 for two", "img": "biryani"},
        {"name": "Dastarkhwan", "area": "Hazratganj", "rating": 4.4, "cuisines": "Awadhi, Mughlai, Dum Biryani", "delivery_time": "35-40 mins", "price_for_two": "₹500 for two", "img": "biryani"},
        {"name": "Wahid Biryani", "area": "Chowk", "rating": 4.5, "cuisines": "Biryani, Mughlai, Kebabs", "delivery_time": "30-35 mins", "price_for_two": "₹350 for two", "img": "biryani"},
        {"name": "Royal Cafe", "area": "Hazratganj", "rating": 4.2, "cuisines": "Continental, Cafe, Fast Food", "delivery_time": "20-25 mins", "price_for_two": "₹300 for two", "img": "cafe"},
    ],

    # ── Goa ──────────────────────────────────────────────────────────────────
    "Goa": [
        {"name": "Vinayak Family Restaurant", "area": "Calangute", "rating": 4.4, "cuisines": "Goan, Seafood, Coastal", "delivery_time": "25-30 mins", "price_for_two": "₹600 for two", "img": "seafood"},
        {"name": "Fisherman's Wharf", "area": "Cavelossim", "rating": 4.5, "cuisines": "Seafood, Goan, Coastal", "delivery_time": "35-40 mins", "price_for_two": "₹800 for two", "img": "seafood"},
        {"name": "Ritz Classic", "area": "Panaji", "rating": 4.4, "cuisines": "Goan, Seafood, Catholic Style", "delivery_time": "30-35 mins", "price_for_two": "₹500 for two", "img": "seafood"},
        {"name": "Gunpowder", "area": "Assagao", "rating": 4.5, "cuisines": "South Indian, Kerala, Chettinad", "delivery_time": "35-40 mins", "price_for_two": "₹700 for two", "img": "southind"},
        {"name": "Baba Au Rhum", "area": "Anjuna", "rating": 4.3, "cuisines": "Bakery, Cafe, Western", "delivery_time": "20-25 mins", "price_for_two": "₹400 for two", "img": "cafe"},
    ],
}

def seed():
    total_created = 0
    total_items = 0
    total_failed = 0

    for city, restaurants in CITY_RESTAURANTS.items():
        print(f"\n📍 Seeding {city} ({len(restaurants)} restaurants)...")
        for r in restaurants:
            payload = {
                "name": r["name"],
                "description": r["area"],
                "area": r["area"],
                "city": city,
                "rating": r["rating"],
                "is_active": True,
                "image_url": IMAGES.get(r["img"], IMAGES["northind"]),
                "delivery_time": r["delivery_time"],
                "cuisines": r["cuisines"],
                "price_for_two": r["price_for_two"],
            }
            try:
                res = requests.post(f"{API_URL}/restaurants/", json=payload, timeout=10)
                if res.status_code == 201:
                    res_data = res.json()
                    res_id = res_data["id"]
                    print(f"  ✅ {r['name']} (ID: {res_id})")
                    total_created += 1

                    # Add random menu items based on the restaurant's image/category
                    cat = r["img"]
                    # If the category isn't in pool, pick a random one
                    pool_cat = cat if cat in MENU_ITEMS_POOL else random.choice(list(MENU_ITEMS_POOL.keys()))
                    menu_choices = MENU_ITEMS_POOL[pool_cat]
                    
                    # Randomly pick 3-5 items from the category
                    count = random.randint(3, 5)
                    selected_items = random.sample(menu_choices, min(len(menu_choices), count))
                    
                    for item in selected_items:
                        item_payload = {
                            "name": item["name"],
                            "description": item["description"],
                            "price": item["price"],
                            "is_veg": item["is_veg"],
                            "is_available": True,
                            "image_url": IMAGES.get(pool_cat, IMAGES["northind"])
                        }
                        item_res = requests.post(f"{API_URL}/restaurants/{res_id}/menu", json=item_payload, timeout=5)
                        if item_res.status_code == 201:
                            total_items += 1
                        else:
                            print(f"    ❌ Failed item {item['name']}: {item_res.text}")
                else:
                    print(f"  ❌ {r['name']} — {res.status_code}: {res.text[:80]}")
                    total_failed += 1
            except Exception as e:
                print(f"  ❌ {r['name']} — Error: {e}")
                total_failed += 1

    print(f"\n{'='*50}")
    print(f"✅ Restaurants Created: {total_created}")
    print(f"🍔 Menu Items Added: {total_items}")
    print(f"❌ Failed: {total_failed}")
    print(f"{'='*50}")

if __name__ == "__main__":
    seed()
