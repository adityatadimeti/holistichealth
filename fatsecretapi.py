
from fatsecret import Fatsecret
import os

oauth_consumer_key = os.getenv('FATSECRET_CONSUMER_KEY')
consumer_secret = os.getenv('FATSECRET_CONSUMER_SECRET')

fs = Fatsecret(oauth_consumer_key, consumer_secret)
foods = fs.foods_search("chicken breast")

fat = foods[0]["food_description"].split("Fat:")[1].split("|")[0].strip()
carbs = foods[0]["food_description"].split("Carbs:")[1].split("|")[0].strip()
protein = foods[0]["food_description"].split("Protein:")[1].split("|")[0].strip()
print(fat, carbs, protein)
