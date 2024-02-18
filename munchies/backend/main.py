from fastapi import FastAPI
import googlemaps
import os
from dotenv import load_dotenv
import json
from supabase import create_client, Client
from fastapi.middleware.cors import CORSMiddleware
import postgrest
from pydantic import BaseModel

# to run: uvicorn main:app --reload

app = FastAPI()
load_dotenv()

origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3001/chat/",
    "http://localhost:3001/chat/code/",
    "http://localhost:1420",
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    
    return {"nearby_restaurants": restaurants}

@app.get("/restaurant-details/")
async def restaurant_details(name: str):
    with open('stanford_restaurants.json', 'r') as file:
        data = json.load(file)
    
    print(data[name])
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
            
    return {"nearby_requesters": nearby_requesters}

@app.post("/create-request/")
async def create_request(requester_name: str, restaurant_name: str, delivery_lat: float, delivery_lng: float, expiry: str):
    # will have lat and long
    delivery_loc = {"latitude": 37.4380424, "longitude": -122.1642276}
    query_loc = (delivery_loc['latitude'], delivery_loc['longitude'])

    # get nearest place with restaurant name from google maps
    places_result = gmaps.places_nearby(location=query_loc, radius=10000, keyword=restaurant_name)
    restaurant_loc = places_result['results'][0].get('geometry', {}).get('location', {})

    expiry = "2024-02-18T12:00:00Z"

    try:
        response = supabase.table('requesters').insert([{"requester_name": requester_name, "restaurant_name": restaurant_name, "restaurant_lat": restaurant_loc['lat'], "restaurant_lng": restaurant_loc['lng'], "delivery_lat": delivery_loc['latitude'], "delivery_lng": delivery_loc['longitude'], "expiry": expiry}]).execute()
        print(response)
    except postgrest.exceptions.APIError as e:
        print(f"API Error: {e}")
        print(e.args)
        
@app.get("/nearby-donators/")
async def nearby_donators(latitude: float, longitude: float, radius: int):
    print(latitude, longitude, radius)
    latitude, longitude = 37.42801109129112, -122.17436390356903
    
    response = supabase.table('donaters').select("*").execute()
    donators = response.data

    nearby_donators = []
    for donater in donators:
        donater_loc = (donater['lat'], donater['lng'])
        distance = gmaps.distance_matrix((latitude, longitude), donater_loc, mode='walking')
        if distance['rows'][0]['elements'][0]['distance']['value'] < radius:
            nearby_donators.append(donater)
            
    return {"nearby_donators": nearby_donators}

@app.post("/create-donator/")
async def create_donator(name: str, items: str, latitude: float, longitude: float, expiry: str):
    
    expiry = "2024-02-18T12:00:00Z"
    try:
        response = supabase.table('donaters').insert([{"name": name, "items": items, "lat": latitude, "lng": longitude, "expiry": expiry, "fulfilled": False}]).execute()
    except postgrest.exceptions.APIError as e:
        print(f"API Error: {e}")
        print(e.args)
    
@app.get("/")
async def root():
    return {"message": "Hello World"}