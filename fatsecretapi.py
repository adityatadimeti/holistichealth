
from fatsecret import Fatsecret
import os

oauth_consumer_key = os.getenv('FATSECRET_CONSUMER_KEY')
consumer_secret = os.getenv('FATSECRET_CONSUMER_SECRET')

fs = Fatsecret(oauth_consumer_key, consumer_secret)
foods = fs.foods_search("veggie taco")

#print("Food Search Results: {}".format(len(foods)))
print("{}\n".format(foods))
