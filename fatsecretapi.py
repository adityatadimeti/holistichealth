
from fatsecret import Fatsecret
import os 
import hmac
import hashlib
import base64
import urllib.parse
import requests
import time
import random

import urllib.parse
import hmac
import hashlib
import base64
import requests
from collections import OrderedDict

import os
import time
import urllib.parse
import hashlib
import hmac
import base64
from collections import OrderedDict


oauth_consumer_key = os.environ.get('FATSECRET_CONSUMER_KEY')
oauth_signature_method = "HMAC-SHA1"
oauth_timestamp = int(time.time())
oauth_nonce = "abc"
oauth_version = "1.0"

consumer_secret = os.environ.get('FATSECRET_CONSUMER_SECRET')
breakpoint()


# The request details
http_method = "GET"
base_url = "https://platform.fatsecret.com/rest/server.api"
parameters = OrderedDict([
    ("oauth_consumer_key", oauth_consumer_key),
    ("oauth_nonce", "abc"),  # Typically a random string or timestamp
    ("oauth_timestamp", int(time.time())),  # Current timestamp
    ("oauth_signature_method", "HMAC-SHA1"),
    ("oauth_version", "1.0"),
    ("method", "foods.search"),
    ("search_expression", "banana"),
    ("format", "json"),
])

# 1. Creating a Signature Base String
parameter_string = '&'.join([f"{urllib.parse.quote(str(k), safe='')}={urllib.parse.quote(str(v), safe='')}" for k, v in parameters.items()])
signature_base_string = '&'.join([urllib.parse.quote(http_method, safe=''), urllib.parse.quote(base_url, safe=''), urllib.parse.quote(parameter_string, safe='')])

# 2. Calculating the signature value
signing_key = f"{urllib.parse.quote(consumer_secret, safe='')}&"  # Note: append '&' even if token secret is not used
signature = hmac.new(signing_key.encode(), signature_base_string.encode(), hashlib.sha1).digest()
base64_signature = base64.b64encode(signature).decode()
oauth_signature = urllib.parse.quote(base64_signature, safe='')

# 3. Add the Signature to Your Request Parameters or Headers
parameters["oauth_signature"] = oauth_signature

# For simplicity, adding OAuth parameters to the header (could also be added to the request body or URL for GET requests)
auth_header = 'OAuth ' + ', '.join([f'{urllib.parse.quote(k, safe="")}="{urllib.parse.quote(v, safe="")}"' for k, v in parameters.items()])
headers = {'Authorization': auth_header}

# 4. Send the Request
response = requests.post(base_url, headers=headers)

# 5. Handle the Response
if response.status_code == 200:
    print("Success:", response.json())
else:
    print("Error:", response.status_code, response.text)
