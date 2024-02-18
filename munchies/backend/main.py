from fastapi import FastAPI
import googlemaps
import os
from dotenv import load_dotenv
import json

# to run: uvicorn main:app --reload

app = FastAPI()
load_dotenv()

gmaps_api_key = os.getenv("GMAPS_API_KEY")
gmaps = googlemaps.Client(key=gmaps_api_key)

@app.get("/nearby-restaurants/")
async def nearby_restaurants(latitude: float, longitude: float):
    # default location set to Jen Hsung
    places_result = gmaps.places_nearby(location=(37.42801109129112, -122.17436390356903), radius=1000, keyword='food')
    
    restaurants = []
    for place in places_result['results']:
        name = place.get('name')
        location = place.get('geometry', {}).get('location', {})
        restaurants.append({'name': place.get('name'), 'address': place.get('vicinity'), 'location': location})
    
    return {"restaurants": restaurants}

@app.get("/restaurant-details/")
async def restaurant_details(name: str):
    with open('stanford_restaurants.json', 'r') as file:
        data = json.load(file)
    
    return data[name]
    
@app.get("/")
async def root():
    return {"message": "Hello World"}