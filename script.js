```javascript
/* =====================================
   SPEECH RECOGNITION CHATBOT
===================================== */


const chatBox =
    document.getElementById("chatBox");

const micButton =
    document.getElementById("micButton");

const stopButton =
    document.getElementById("stopButton");

const clearButton =
    document.getElementById("clearButton");

const sendButton =
    document.getElementById("sendButton");

const textInput =
    document.getElementById("textInput");

const statusText =
    document.getElementById("status");


/* =====================================
   SPEECH RECOGNITION
===================================== */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


let recognition = null;

let isListening = false;


/* Check Browser Support */

if (SpeechRecognition) {

    recognition =
        new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.continuous = false;

    recognition.interimResults = false;


    /* Speech Result */

    recognition.onresult =
        function(event) {

            const speechText =
                event.results[0][0].transcript;

            statusText.textContent =
                "✅ Speech recognized";

            addUserMessage(
                speechText
            );

            setTimeout(
                function() {

                    chatbotResponse(
                        speechText
                    );

                },
                500
            );

        };


    /* Speech Started */

    recognition.onstart =
        function() {

            isListening = true;

            micButton.classList.add(
                "listening"
            );

            micButton.textContent =
                "🔴";

            statusText.textContent =
                "🎤 Listening... Speak now";

        };


    /* Speech Ended */

    recognition.onend =
        function() {

            isListening = false;

            micButton.classList.remove(
                "listening"
            );

            micButton.textContent =
                "🎤";

            if (
                statusText.textContent.includes(
                    "Listening"
                )
            ) {

                statusText.textContent =
                    "🟢 Ready to listen";

            }

        };


    /* Speech Error */

    recognition.onerror =
        function(event) {

            isListening = false;

            micButton.classList.remove(
                "listening"
            );

            micButton.textContent =
                "🎤";


            if (
                event.error ===
                "not-allowed"
            ) {

                statusText.textContent =
                    "❌ Microphone permission denied";

            }
            else if (
                event.error ===
                "no-speech"
            ) {

                statusText.textContent =
                    "⚠️ No speech detected";

            }
            else {

                statusText.textContent =
                    "❌ Speech error: " +
                    event.error;

            }

        };

}
else {

    statusText.textContent =
        "❌ Speech recognition is not supported. Use Google Chrome.";

}


/* =====================================
   START MICROPHONE
===================================== */

micButton.addEventListener(
    "click",
    function() {

        if (!recognition) {

            alert(
                "Speech Recognition is not supported in this browser. Please use Google Chrome."
            );

            return;

        }


        if (isListening) {

            recognition.stop();

            return;

        }


        try {

            recognition.start();

        }
        catch (error) {

            console.log(error);

        }

    }
);


/* =====================================
   STOP SPEECH
===================================== */

stopButton.addEventListener(
    "click",
    function() {

        /* Stop recognition */

        if (
            recognition &&
            isListening
        ) {

            recognition.stop();

        }


        /* Stop voice */

        if (
            "speechSynthesis"
            in window
        ) {

            speechSynthesis.cancel();

        }


        statusText.textContent =
            "⏹ Speech stopped";

    }
);


/* =====================================
   SEND TEXT MESSAGE
===================================== */

sendButton.addEventListener(
    "click",
    function() {

        sendTextMessage();

    }
);


textInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            sendTextMessage();

        }

    }
);


function sendTextMessage() {

    const message =
        textInput.value.trim();


    if (message === "") {

        return;

    }


    addUserMessage(
        message
    );


    textInput.value = "";


    setTimeout(
        function() {

            chatbotResponse(
                message
            );

        },
        500
    );

}


/* =====================================
   ADD USER MESSAGE
===================================== */

function addUserMessage(message) {

    const div =
        document.createElement("div");

    div.className =
        "message user";


    div.innerHTML = `

        <div class="bubble">
            ${escapeHTML(message)}
        </div>

        <div class="icon">
            👤
        </div>

    `;


    chatBox.appendChild(div);

    scrollChat();

}


/* =====================================
   ADD BOT MESSAGE
===================================== */

function addBotMessage(message) {

    const div =
        document.createElement("div");

    div.className =
        "message bot";


    div.innerHTML = `

        <div class="icon">
            🤖
        </div>

        <div class="bubble">
            ${escapeHTML(message)}
        </div>

    `;


    chatBox.appendChild(div);

    scrollChat();

}


/* =====================================
   CHATBOT RESPONSE
===================================== */

function chatbotResponse(message) {

    const text =
        message.toLowerCase();


    let reply;


    if (
        text.includes("hello") ||
        text.includes("hi") ||
        text.includes("hey")
    ) {

        reply =
            "Hello! 👋 How can I help you today?";

    }


    else if (
        text.includes("how are you")
    ) {

        reply =
            "I'm doing great! 🤖 Thank you for asking.";

    }


    else if (
        text.includes("your name") ||
        text.includes("who are you")
    ) {

        reply =
            "I am your Speech Recognition Chatbot. 🤖";

    }


    else if (
        text.includes("speech")
    ) {

        reply =
            "Speech recognition converts your spoken words into text using your browser.";

    }


    else if (
        text.includes("ai") ||
        text.includes(
            "artificial intelligence"
        )
    ) {

        reply =
            "Artificial Intelligence helps computers perform tasks that normally require human intelligence.";

    }


    else if (
        text.includes("python")
    ) {

        reply =
            "Python is a popular programming language used for AI, web development and data science.";

    }


    else if (
        text.includes("cloud")
    ) {

        reply =
            "Cloud computing provides computing services such as storage, servers and applications through the internet.";

    }


    else if (
        text.includes("thank") ||
        text.includes("thanks")
    ) {

        reply =
            "You're welcome! 😊";

    }


    else if (
        text.includes("bye") ||
        text.includes("goodbye")
    ) {

        reply =
            "Goodbye! 👋 Have a wonderful day.";

    }


    else {

        reply =
            "I heard you say: \"" +
            message +
            "\". Your message was successfully recognized! 🎤";

    }


    addBotMessage(reply);

    speak(reply);

}


/* =====================================
   TEXT TO SPEECH
===================================== */

function speak(text) {

    if (
        !("speechSynthesis" in window)
    ) {

        return;

    }


    speechSynthesis.cancel();


    const speech =
        new SpeechSynthesisUtterance(
            text
        );


    speech.lang =
        "en-US";

    speech.rate =
        1;

    speech.pitch =
        1;


    speechSynthesis.speak(
        speech
    );

}


/* =====================================
   CLEAR CHAT
===================================== */

clearButton.addEventListener(
    "click",
    function() {

        chatBox.innerHTML = `

            <div class="message bot">

                <div class="icon">
                    🤖
                </div>

                <div class="bubble">

                    Chat cleared! 🧹

                    <br><br>

                    Click the microphone 🎤
                    and start speaking.

                </div>

            </div>

        `;


        statusText.textContent =
            "🟢 Ready to listen";

    }
);


/* =====================================
   ESCAPE HTML
===================================== */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

}


/* =====================================
   AUTO SCROLL
===================================== */

function scrollChat() {

    chatBox.scrollTop =
        chatBox.scrollHeight;

}
```
