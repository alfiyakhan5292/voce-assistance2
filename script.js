document.getElementById("start-btn").addEventListener("click", () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
  
    recognition.onstart = () => {
      document.getElementById("response").innerText = "Listening...";
    };
  
    recognition.onspeechend = () => {
      recognition.stop();
    };
  
    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript;
      document.getElementById("response").innerText = `You said: ${command}`;
  
      // Send command to Python backend
      fetch("/process_voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      })
        .then((response) => response.json())
        .then((data) => {
          document.getElementById("response").innerText = data.response;
        })
        .catch((error) => {
          console.error("Error:", error);
          document.getElementById("response").innerText = "Error communicating with the server.";
        });
    };
  
    recognition.onerror = (event) => {
      document.getElementById("response").innerText = `Error: ${event.error}`;
    };
  
    recognition.start();
  });
  // Manual Command Handling
document.getElementById("send-btn").addEventListener("click", () => {
    const command = document.getElementById("manual-input").value.trim();
    if (command) {
      fetch("/process_voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      })
        .then((response) => response.json())
        .then((data) => {
          document.getElementById("response").innerText = data.response;
        })
        .catch((error) => {
          console.error("Error:", error);
          document.getElementById("response").innerText = "Error communicating with the server.";
        });
    } else {
      document.getElementById("response").innerText = "Please enter a command.";
    }
  });
  