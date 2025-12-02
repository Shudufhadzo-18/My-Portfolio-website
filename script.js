// toggle light code
const toggle = document.getElementById('toggleLight');
const body = document.querySelector('body');

toggle.addEventListener('click', function() {
    this.classList.toggle('bx-moon-star');
    const isLightMode = this.classList.toggle('bx-sun-bright');

    if (isLightMode) {
    
        body.style.background = '#1f242d';
    } else {
        body.style.background = 'black';

    }

    body.style.transition = '3s';
});// toggle light code end
//menu
   const menutoggle = document.getElementById('menu-toggle');
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.navbar a');

  // Toggle navbar when menu icon is clicked
  menutoggle.addEventListener('click', () => {
    navbar.classList.toggle('active');
  });

  // Close navbar when any link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('active');
    });
  });


// tab-section education code
document.querySelectorAll(".tab-link").forEach(link => {
  link.addEventListener("click", function () {
    openTab(this.getAttribute("data-tab"), this);
  });
});

function openTab(tabName, element) {
  var tabLinks = document.getElementsByClassName("tab-link");
  var tabContents = document.getElementsByClassName("tab-contents");

  for (let link of tabLinks) link.classList.remove("active-link");
  for (let content of tabContents) content.classList.remove("active-tab");

  document.getElementById(tabName).classList.add("active-tab");
  element.classList.add("active-link");
}
// tab-section education code
// animate skills bar
const form = document.getElementById("contact-form");
const messageDiv = document.getElementById("form-message");

form.addEventListener("submit", function(event) {
  event.preventDefault(); // prevent page reload

  // Create JSON object from form fields
  const data = {
    name: form.elements["name"].value,
    email: form.elements["email"].value,
    phone: form.elements["phone"].value,
    subject: form.elements["subject"].value,
    message: form.elements["message"].value
  };

  fetch(form.action, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (response.ok) {
      messageDiv.style.display = "block"; // show success
      form.reset(); // clear form
      setTimeout(() => {
        messageDiv.style.display = "none"; // hide after 5s
      }, 5000);
    } else {
      response.json().then(data => {
        if (data.errors) {
          alert("Error: " + data.errors.map(e => e.message).join(", "));
        } else {
          alert("Oops! There was a problem submitting your form");
        }
      });
    }
  })
  .catch(error => {
    alert("Oops! There was a problem submitting your form");
  });
});

//chatbot
// import bio context
 import { aboutMe } from "./aboutMe.js";
const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");

const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chatbot");
const API_KEY = "AIzaSyCe6e6oAlBDdGLsGILcvLfU75q2Y_6nAiY";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

const userData = {
    message:null
}
const initialInputHeight = messageInput.scrollHeight;
//create message element
const createMessageElement = (content,...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}
//bot response AI
const generateBotResponse =async (incomingMessageDiv) => {
  const messageElement = incomingMessageDiv.querySelector(".message-text");
    //request option
    const requestOption = {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body:JSON.stringify({
            contents:[{
                 parts: [{
      text: `${aboutMe}\n\nUser question: ${userData.message}`
    }]
            }]
        })
    }
    try{
        //FETCH bot response AI
    const response = await fetch(API_URL, requestOption);
    const data =  await response.json();
    if(!response.ok) throw new Error(data.error.message);
    //Extract and display bot text
    const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
    messageElement.innerText = apiResponseText;
    }
    catch(error){
     console.log(error);
     messageElement.innerText = error.message;
     messageElement.style.color = "#ff0000";

    } finally {
        incomingMessageDiv.classList.remove("thinking");
        chatBody.scrollTo({top: chatBody.scrollHeight, behavior: "smooth"});
    }
}
//Handle outgoing messages
const handleOutgoingMessage =(e) => {
    e.preventDefault();

    userData.message = messageInput.value.trim();
    messageInput.value = "";
    messageInput.dispatchEvent(new Event("input"))
    //display user message
const messageContent = `<div class="message-text"></div>`;

const outgoingMessageDiv =    createMessageElement(messageContent, "user-message")
outgoingMessageDiv.querySelector(".message-text").textContent = userData.message;
chatBody.appendChild(outgoingMessageDiv);
chatBody.scrollTo({top: chatBody.scrollHeight, behavior: "smooth"});

setTimeout(() => {
    //thunking indicator
const messageContent = `<i class='bx bx-bot'></i>
                <div class="message-text">
                    <div class="thinking-indicator">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>`;

const incomingMessageDiv = createMessageElement(messageContent, "bot-message", "thinking");
chatBody.appendChild(incomingMessageDiv);
chatBody.scrollTo({top: chatBody.scrollHeight, behavior: "smooth"});
generateBotResponse(incomingMessageDiv);
 },600);
}
//handle Enter key press for sending message
messageInput.addEventListener("keydown", (e) =>{
    const userMessage = e.target.value.trim();
    if(e.key == "Enter" && userMessage && !e.shiftKey && window.innnerWidth > 768){
        handleOutgoingMessage(e);

    }
    

})
//adjust input field
messageInput.addEventListener("input", () => {
    messageInput.style.height = `${initialInputHeight}px`;
    messageInput.style.height = `${messageInput.scrollHeight}px`;
    document.querySelector(".chat-form").style.borderRadius = messageInput.scrollHeight > initialInputHeight ? "15px":"32px";
})
sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e))


chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
 closeChatbot.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
// ✅ Quick prompts click
document.querySelectorAll(".prompt-btn").forEach(button => {
  button.addEventListener("click", () => {
    messageInput.value = button.textContent;
    handleOutgoingMessage(new Event("click")); // reuse same handler
  });
});
