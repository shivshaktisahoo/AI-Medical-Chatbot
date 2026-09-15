
import base64
import os
from io import BytesIO

from dotenv import load_dotenv
from groq import Groq
from PIL import Image


folder = os.path.dirname(__file__)
env_path = os.path.join(folder, ".env")
load_dotenv(env_path)

api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("Missing GROQ_API_KEY in .env or environment")


image_path = os.path.join(folder, "sample-image.jpg")

image = Image.open(image_path)
image.thumbnail((1024, 1024))

buffer = BytesIO()
image.convert("RGB").save(buffer, format="JPEG", quality=75)
image_data = base64.b64encode(buffer.getvalue()).decode("utf-8")

client = Groq(api_key=api_key)

response = client.chat.completions.create(
    model="meta-llama/llama-prompt-guard-2-86m",
    max_completion_tokens=500,
    messages=[
        {
            "role": "system",
            "content": "You are a helpful medical assistant. Give general information, not a diagnosis.",
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "What do you see in this image? Give general skin care advice, not a diagnosis.",
                },
                # {
                #     "type": "image_url",
                #     "image_url": {
                #         "url": f"data:image/jpeg;base64,{image_data}",
                #     },
                # },
            ],
        },
    ],
)

print(response)
