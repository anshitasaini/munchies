from fastapi import FastAPI
import googlemaps
import os
from dotenv import load_dotenv
import json
from supabase import create_client, Client
import postgrest

# to run: uvicorn main:app --reload

app = FastAPI()
load_dotenv()

gmaps_api_key = os.getenv("GMAPS_API_KEY")
gmaps = googlemaps.Client(key=gmaps_api_key)

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

@app.get("/nearby-restaurants/")
async def nearby_restaurants(latitude: float, longitude: float):
    # default location set to Jen Hsung
    places_result = gmaps.places_nearby(location=(37.42801109129112, -122.17436390356903), radius=1000, keyword='food')
    
    restaurants = []
    for place in places_result['results']:
        print(place)
        name = place.get('name')
        location = place.get('geometry', {}).get('location', {})
        restaurants.append({'name': place.get('name'), 'address': place.get('vicinity'), 'location': location})
    
    return {"restaurants": restaurants}

@app.get("/restaurant-details/")
async def restaurant_details(name: str):
    with open('stanford_restaurants.json', 'r') as file:
        data = json.load(file)
    
    return data[name]

@app.get("/nearby-requesters/")
async def nearby_requesters(latitude: float, longitude: float, radius: int):
    latitude, longitude = 37.42801109129112, -122.17436390356903
    
    response = supabase.table('requesters').select("*").execute()
    requesters = response.data

    # only get the requesters within radius
    nearby_requesters = []
    for requester in requesters:
        delivery_loc = (requester['delivery_lat'], requester['delivery_lng'])
        distance = gmaps.distance_matrix(delivery_loc, (latitude, longitude), mode='walking')
        if distance['rows'][0]['elements'][0]['distance']['value'] < radius:
            nearby_requesters.append(requester)
            
    return {"requesters": nearby_requesters}

@app.post("/create-request/")
async def create_request(requester_name: str, restaurant_name: str, delivery_loc: str, expiry: str):
    # will have lat and long
    delivery_loc = {"latitude": 37.42801109129112, "longitude": -122.17436390356903}
    query_loc = (delivery_loc['latitude'], delivery_loc['longitude'])

    # get nearest place with restaurant name from google maps
    places_result = gmaps.places_nearby(location=query_loc, radius=1000, keyword=restaurant_name)
    restaurant_loc = places_result['results'][0].get('geometry', {}).get('location', {})

    expiry = "2024-02-18T12:00:00Z"

    try:
        response = supabase.table('requesters').insert([{"requester_name": requester_name, "restaurant_name": restaurant_name, "restaurant_lat": restaurant_loc['lat'], "restaurant_lng": restaurant_loc['lng'], "delivery_lat": delivery_loc['latitude'], "delivery_lng": delivery_loc['longitude'], "expiry": expiry}]).execute()
        print(response)
    except postgrest.exceptions.APIError as e:
        print(f"API Error: {e}")
        print(e.args)
        
@app.get("/nearby-donaters/")
async def nearby_donaters(latitude: float, longitude: float, radius: int):
    latitude, longitude = 37.42801109129112, -122.17436390356903
    
    response = supabase.table('donaters').select("*").execute()
    donaters = response.data

    nearby_donaters = []
    for donater in donaters:
        donater_loc = (donater['lat'], donater['lng'])
        distance = gmaps.distance_matrix((latitude, longitude), donater_loc, mode='walking')
        if distance['rows'][0]['elements'][0]['distance']['value'] < radius:
            nearby_donaters.append(donater)
            
    return {"donaters": nearby_donaters}

@app.post("/create-donater/")
async def create_donater(name: str, items: str, latitude: float, longitude: float, expiry: str):
    
    expiry = "2024-02-18T12:00:00Z"
    try:
        response = supabase.table('donaters').insert([{"name": name, "items": items, "lat": latitude, "lng": longitude, "expiry": expiry, "fulfilled": False}]).execute()
    except postgrest.exceptions.APIError as e:
        print(f"API Error: {e}")
        print(e.args)
    
@app.get("/")
async def root():
    return {"message": "Hello World"}