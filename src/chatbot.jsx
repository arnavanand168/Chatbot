import React, { useState, useEffect, useRef } from "react";
import "./chatbot.css";
import ThumbsUp from "./assets/like.png";
import ThumbsDown from "./assets/dislike.png";
import AirtelLogo from './assets/airtellogo.jpg';
import axios from "axios";

function QueryResolvedBot({ onUp, onDown }) {
  return (
    <div className="chatbot-message sender">
      <span className="chatbot-avatar-circle">
      <img src={AirtelLogo} alt="Airtel" className="chatbot-avatar-img" />
      </span>
      <div>
        <div className="chatbot-bubble">
          Is your Query Resolved?
          <div className="chatbot-query-resolved-inline">
            <button className="thumbs-up" aria-label="Thumbs Up" onClick={onUp}>
              <img src={ThumbsUp} alt="Like" className="chatbot-like" />
            </button>
            <button className="thumbs-down" aria-label="Thumbs Down" onClick={onDown}>
              <img src={ThumbsDown} alt="Dislike" className="chatbot-like" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Chatbot() {
  const [conversation, setConversation] = useState([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(true);
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3001/messages")
  .then(res => setApiData(res.data))
  .catch(err => { console.error(err); });

  }, []);
  
  useEffect(() => {
    if (apiData && apiData.length > 0) {
      setConversation([apiData[0]]);
    }
  }, [apiData]);
  

  const findSenderByPrompt = (promptText) => {
    return apiData.find(
      (msg) => msg.chattype === "sender" && msg.message === promptText
    );
  };

  const handlePromptClick = (promptText) => {
    if (promptText === "Restart Conversation") {
      handleRestart();
      return;
    }
  
    setConversation((prev) => [
      ...prev,
      {
        chattype: "receiver",
        message: promptText,
        prompt: null,
        isactive: false,
      },
    ]);
  
    const nextSender = findSenderByPrompt(promptText);
  
    if (nextSender) {
      setTimeout(() => {
        setConversation((prev) => {
          const updated = [...prev, nextSender];
          if (!nextSender.prompt || nextSender.prompt.length === 0) {
            updated.push({ chattype: "queryresolved" });
          }
          return updated;
        });
      }, 300);
    } else {
      setTimeout(() => {
        setConversation((prev) => [
          ...prev,
          { chattype: "queryresolved" }
        ]);
      }, 300);
    }
  };
  
  
  const handleInputChange = (e) => setInput(e.target.value);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    setConversation((prev) => [
      ...prev,
      {
        chattype: "receiver",
        message: input,
        prompt: null,
        isactive: false,
      },
      { chattype: "queryresolved" }
    ]);
    setInput("");
  };

  const handleToggle = () => setOpen((prev) => !prev);

  const handleThumbsUp = () => {
    setConversation((prev) => [
      ...prev,
      {
        chattype: "sender",
        message: "Thank you for using Airtel, we are happy to help",
        prompt: ["Restart Conversation"],
        isactive: true,
      },
    ]);
  };

  const handleThumbsDown = () => {
    if (apiData && apiData.length > 0) {
    setConversation((prev) => [...prev, apiData[0]]);
    }
  };

  const handleRestart = () => {
    if (apiData && apiData.length > 0) {
      setConversation([apiData[0]]);
    }
  };

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  return (
    <>
      <button id="chatbot-toggler" onClick={handleToggle}>
        {!open ? (
          <i className="fa fa-commenting-o" aria-hidden="true" style={{color: "#ffffff", fontSize: "24px"}}></i>
        ) : (
          <span className="chatbot-toggler-close">×</span>
        )}
      </button>
      {open && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="head-title">
              <div className="chatbot-title">airtel chat</div>
              <div className="chatbot-status">get help 24X7</div>
            </div>
            <button className="chatbot-close" onClick={handleToggle}>×</button>
          </div>

          <div className="chatbot-messages">
            {conversation.map((msg, idx) => {
              if (msg.chattype === "queryresolved") {
                return (
                  <QueryResolvedBot
                    key={idx}
                    onUp={handleThumbsUp}
                    onDown={handleThumbsDown}
                  />
                );
              }
              if (msg.chattype === "sender") {
                return (
                  <div key={idx} className="chatbot-message sender">
                    <span className="chatbot-avatar-circle"> <img src={AirtelLogo} alt="Airtel" className="chatbot-avatar-img" /> </span>
                    <div className="sender-bubble-options">
                      <div className="chatbot-bubble">{msg.message}</div>
                      {msg.prompt && (
                        <div className="chatbot-options">
                          {msg.prompt.map((prompt, i) => (
                            <button
                              key={i}
                              onClick={() => handlePromptClick(prompt)}
                              style={
                                prompt === "Restart Conversation"
                                  ? { fontSize: "13px", padding: "6px 12px", marginTop: "6px" }
                                  : {}
                              }
                            >
                              <div className="prompt-msg">{prompt}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
              if (msg.chattype === "receiver") {
                return (
                  <div key={idx} className="chatbot-message receiver">
                    <div>
                      <div className="chatbot-bubble-receiver">{msg.message}</div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
            <div ref={messagesEndRef} />
          </div>
    <div className="send-message-section">
          <form className="airtel-chat-input" onSubmit={handleSendMessage}>
            <input type="text"
    placeholder="Type your query here..."
    value={input}
    onChange={handleInputChange}
    className="airtel-input"
  />
  <button type="button" className="airtel-mic">
    <i className="fa fa-microphone" aria-hidden="true" style={{color: "#000000"}}></i>
  </button>
  <button type="submit" className="airtel-send">
  <i class="fa fa-location-arrow" aria-hidden="true" style={{color: "#000000"}}></i>
  </button>
</form>
</div>

          <div className="chatbot-footer">
            Powered by <span className="chatbot-powered">Airtel</span>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
