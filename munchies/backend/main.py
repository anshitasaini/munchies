from fastapi import FastAPI
import googlemaps
import os
from dotenv import load_dotenv

# to run: uvicorn main:app --reload

app = FastAPI()
load_dotenv()

gmaps_api_key = os.getenv("GMAPS_API_KEY")
gmaps = googlemaps.Client(key=gmaps_api_key)

@app.get("/nearby-restaurants/")
async def nearby_restaurants(latitude: float, longitude: float):
    # default location set to UT tower
    places_result = gmaps.places_nearby(location=(30.286357101910593, -97.73935062676166), radius=750, keyword='food')
    
    restaurants = []
    for place in places_result['results']:
        name = place.get('name')
        location = place.get('geometry', {}).get('location', {})
        restaurants.append({'name': place.get('name'), 'address': place.get('vicinity'), 'location': location})
    
    return {"restaurants": restaurants}

@app.get("/")
async def root():
    return {"message": "Hello World"}