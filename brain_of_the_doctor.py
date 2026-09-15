# # Step 1: Install and import dependencies
# import os
# import anthropic
# from dotenv import load_dotenv

# load_dotenv()

# # Step 2: Create client

# base_url=os.environ.get("OPENROUTER_BASE_URL")
# api_key=os.environ.get("OPENROUTER_API_KEY")
# client = anthropic.Anthropic(base_url=base_url, api_key=api_key)

# # Step 3: Create message
# message = [
#     {
#         "role": "user",
#         "content": [
#             {
#                 "type": "text",
#                 "text": "Hello, What can you help me with?"
#             }
#         ]
#     },
# ]

# # Step 4: Send message
# response = client.message.create(
#     model=,
#     max_tokens=,
#     messages=messages
# )

# # Step 5: Print response
# print(response)



# # With OpenAI
# # Step 1: Install and import dependencies
# from openai import OpenAI
# from dotenv import load_dotenv
# import os
# import base64

# load_dotenv()


# base_url=os.environ.get("OPENROUTER_BASE_URL")
# api_key=os.environ.get("OPENROUTER_API_KEY")
# model_name = "openrouter/free"


# # Step 2: Create client
# client = OpenAI(
#     base_url=base_url,
#     api_key=api_key
# )


# # Step 3: Create message

# # # Text Messages
# # messages = [
# #     {
# #         "role": "user",
# #         "content": [
# #             {
# #                 "type": "text",
# #                 "text": "Hello, What can you help me with?"
# #             }
# #         ]
# #     },
# # ]

# # Image Messages
# folder = os.path.dirname(__file__)
# image_path = os.path.join(folder, "sample-image.jpg")
# print(image_path)

# with open(image_path, "rb") as file:
#     image_data = base64.b64encode(file.read()).decode("utf-8")

# messages = [
#     {
#         "role": "user",
#         "content": [
#             # {
#             #     "type": "image",
#             #     "source": {
#             #         "type": "base64",
#             #         "media_type": "image/jpg",
#             #         "data": image_data
#             #     },
#             # },
#             {
#                 "type": "image_url",
#                 "image_url": {
#                     "url": f"data:image/jpeg;base64,{image_data}"
#                 }
#             },
#             {
#                 "type": "text",
#                 "text": "What do you see in this image?"
#             }
#         ]
#     },
# ]


# # Step 4: Send message
# response = client.chat.completions.create(
#     model=model_name,
#     # max_tokens=1000,
#     messages=messages
# )

# # Step 5: Print response
# print(response.choices[0].message.content)



# from openai import OpenAI
# from dotenv import load_dotenv
# import os
# import base64

# load_dotenv()

# # OpenRouter configuration
# client = OpenAI(
#     base_url=os.getenv("OPENROUTER_BASE_URL"),
#     api_key=os.getenv("OPENROUTER_API_KEY")
# )

# # Vision-capable model
# MODEL_NAME = "inclusionai/ling-3.0-flash-vl:free"


# def encode_image(image_path):
#     with open(image_path, "rb") as file:
#         image_data = base64.b64encode(file.read()).decode("utf-8")

#     return image_data


# # Image path
# folder = os.path.dirname(__file__)
# image_path = os.path.join(folder, "sample-image.jpg")

# # Convert image to base64
# image_data = encode_image(image_path)

# # Send text + image to the model
# messages = [
#     {
#         "role": "user",
#         "content": [
#             {
#                 "type": "text",
#                 "text": (
#                     "Look at this image carefully and describe what you can see. "
#                     "Focus only on visible features. "
#                     "Do not make a definitive medical diagnosis."
#                 )
#             },
#             {
#                 "type": "image_url",
#                 "image_url": {
#                     "url": f"data:image/jpeg;base64,{image_data}"
#                 }
#             }
#         ]
#     }
# ]

# # Ask the AI
# response = client.chat.completions.create(
#     model=MODEL_NAME,
#     messages=messages
# )

# # Print response
# print("\nAI Doctor Response:\n")
# print(response.choices[0].message.content)


from openai import OpenAI
from dotenv import load_dotenv
import os
import base64

load_dotenv()

client = OpenAI(
    base_url=os.getenv("OPENROUTER_BASE_URL"),
    api_key=os.getenv("OPENROUTER_API_KEY")
)

MODEL_NAME = "inclusionai/ling-3.0-flash-vl:free"


def encode_video(video_path):
    with open(video_path, "rb") as file:
        video_data = base64.b64encode(file.read()).decode("utf-8")

    return video_data


# MP4 video path
folder = os.path.dirname(__file__)
video_path = os.path.join(folder, "sample-video.mp4")

# Convert MP4 to base64
video_data = encode_video(video_path)

messages = [
    {
        "role": "user",
        "content": [
            {
                "type": "text",
                "text": (
                    "Analyze this video carefully and describe what you can see. "
                    "Focus on the visible features, changes and relevant observations. "
                    "Do not make a definitive medical diagnosis."
                )
            },
            {
                "type": "video_url",
                "video_url": {
                    "url": f"data:video/mp4;base64,{video_data}"
                }
            }
        ]
    }
]

response = client.chat.completions.create(
    model=MODEL_NAME,
    messages=messages
)

print("\nAI Doctor Video Response:\n")
print(response.choices[0].message.content)