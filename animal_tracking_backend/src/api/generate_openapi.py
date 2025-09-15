import json
import os

from src.api.main import app

# Generate the OpenAPI schema using the app's custom_openapi to include enriched metadata
openapi_schema = app.openapi()

# Write to interfaces/openapi.json to be discoverable by dependent containers
output_dir = "interfaces"
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, "openapi.json")

with open(output_path, "w") as f:
    json.dump(openapi_schema, f, indent=2)
