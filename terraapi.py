import logging
import flask
from flask import request
from terra.base_client import Terra
import os

logging.basicConfig(level=logging.INFO)
_LOGGER = logging.getLogger("app")

API_KEY = os.getenv('TERRA_API_KEY')
DEV_ID = os.getenv('TERRA_DEV_ID')
SIGNING_SECRET = os.getenv('TERRA_SIGNING_SECRET')

terra = Terra(api_key= API_KEY, dev_id= DEV_ID, secret=SIGNING_SECRET)

parsed_api_response = terra.list_providers().get_parsed_response()
print(parsed_api_response)

parsed_api_response = terra.list_users().get_parsed_response()
print(parsed_api_response)


auth_resp = terra.generate_authentication_url(
  reference_id="USER ID IN YOUR APP",
	resource="FITBIT",
	auth_success_redirect_url="https://success.url",
  auth_failure_redirect_url="https://failure.url",
).get_parsed_response()

print(auth_resp)

# app = flask.Flask(__name__)

# @app.route("/consumeTerraWebhook", methods=["POST"])
# def consume_terra_webhook() -> flask.Response:
#     # body_str = str(request.get_data(), 'utf-8')
#     body = request.get_json()
#     _LOGGER.info(
#         "Received webhook for user %s of type %s",
#         body.get("user", {}).get("user_id"),
#         body["type"])
#     verified = terra.check_terra_signature(request.get_data().decode("utf-8"), request.headers['terra-signature'])
#     if verified:
#       return flask.Response(status=200)
#     else:
#       return flask.Response(status=403)
    
    
# auth_resp = terra.generate_authentication_url(
#   reference_id="USER ID IN YOUR APP",
# 	resource="GARMIN",
# 	auth_success_redirect_url="https://success.url",
#   auth_failure_redirect_url="https://failure.url",
# ).get_parsed_response()

# print(auth_resp)

# if __name__ == "__main__":
#     app.run(host="localhost", port=8080)