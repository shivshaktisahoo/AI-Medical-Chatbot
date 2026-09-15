from deepgram import DeepgramClient
from dotenv import load_dotenv
from pathlib import Path
import os
import base64

load_dotenv()

text = "Hi, my name is AI with Shiv, who are you?. I am very happy."
api_key = os.environ.get("DEEPGRAM_API_KEY")
deepgram = DeepgramClient(api_key=api_key)
audio = deepgram.speak.v1.audio.generate(
    text=text,
    model="aura-2-thalia-en",
    encoding="mp3",
)
# Step3: Save audio


audio_file="test-output.mp3"
audio_path = Path(__file__).with_name(audio_file)
with audio_path.open("wb") as file:
    for chunk in audio:
        file.write(chunk)

# # Step4: Play audio
import platform
import subprocess


if platform.system() == "Darwin":  # macOS
    subprocess.run(["afplay", str(audio_path)])
elif platform.system() == "Windows":
    os.startfile(audio_path)
else:  # Linux
    subprocess.run(["xdg-open", str(audio_path)])