import os
import subprocess
from flask import Flask, request, jsonify
import speech_recognition as sr
import pyttsx3

app = Flask(__name__)
recognizer = sr.Recognizer()
engine = pyttsx3.init()

def speak(text):
    """Convert text to speech."""
    engine.say(text)
    engine.runAndWait()

@app.route('/process_voice', methods=['POST'])
def process_voice():
    """Handle voice commands sent from the frontend."""
    data = request.json
    command = data.get("command", "").lower()
    response = "I didn't understand the command."

    if "open word" in command:
        # Path to Microsoft Word (update this for your system)
        subprocess.Popen(["start", "winword"], shell=True)
        response = "Opening Microsoft Word."
    elif "open notepad" in command:
        subprocess.Popen(["notepad"])
        response = "Opening Notepad."
    elif "open code" in command:
        # Path to Visual Studio Code (update for your system)
        subprocess.Popen(["code"])
        response = "Opening Visual Studio Code."
    elif "write" in command:
        content = command.replace("write", "").strip()
        file_path = "output.txt"
        with open(file_path, "a") as file:
            file.write(content + "\n")
        response = f"Written to {file_path}: {content}"
    elif "time" in command:
        from datetime import datetime
        response = f"The current time is {datetime.now().strftime('%I:%M %p')}"
    elif "hello" in command:
        response = "Hello! How can I assist you?"
    elif "exit" in command:
        response = "Goodbye!"
    speak(response)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)
