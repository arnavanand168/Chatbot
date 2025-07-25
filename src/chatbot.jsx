import React, { useState, useEffect, useRef } from "react";
import "./chatbot.css";
// import ThumbsUp from "./assets/like.png";
// import ThumbsDown from "./assets/dislike.png";
import AirtelLogo from './assets/airtellogo.jpg';
import axios from "axios";

// function QueryResolvedBot({ onUp, onDown }) {
//   return (
//     <div className="chatbot-message sender">
//       <span className="chatbot-avatar-circle">
//         <img src={AirtelLogo} alt="Airtel" className="chatbot-avatar-img" />
//       </span>
//       <div>
//         <div className="chatbot-bubble">
//           Was I able to resolve your query?
//           <div className="chatbot-query-resolved-inline">
//             <button className="thumbs-up" aria-label="Thumbs Up" onClick={onUp}>
//               <img src={ThumbsUp} alt="Like" className="chatbot-like" />
//             </button>
//             <button className="thumbs-down" aria-label="Thumbs Down" onClick={onDown}>
//               <img src={ThumbsDown} alt="Dislike" className="chatbot-like" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
function QueryResolvedBot({ onUp, onDown }) {
  return (
    <div className="chatbot-message sender">
      <span className="chatbot-avatar-circle">
        <img src={AirtelLogo} alt="Airtel" className="chatbot-avatar-img" />
      </span>
      <div>
        <div className="chatbot-bubble">
          Was I able to resolve your query?
          <div className="chatbot-query-resolved-inline" style={{ marginTop: 8 }}>
            <button 
              className="chatbot-yes-btn" 
              aria-label="Yes"
              onClick={onUp}
              style={{
                padding: '6px 16px',
                marginRight: '8px',
                borderRadius: '12px',
                border: '1px solid #4caf50',
                backgroundColor: '#4caf50',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Yes
            </button>
            <button 
              className="chatbot-no-btn" 
              aria-label="No"
              onClick={onDown}
              style={{
                padding: '6px 16px',
                borderRadius: '12px',
                border: '1px solid #f44336',
                backgroundColor: '#f44336',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              No
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
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/messages")
      .then(res => setApiData(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (apiData.length) {
      const firstMessage = apiData.find(msg => msg.id === "mainmenu") || apiData[0];
      setConversation([firstMessage]);
    }
  }, [apiData]);

  const findMessageById = (id) => apiData.find(msg => msg.id === id);

  const handleRestart = () => {
    const firstMessage = apiData.find(msg => msg.id === "mainmenu") || apiData[0];
    setConversation([firstMessage]);
  };

  const handlePromptClick = (nextId, label) => {
    if (label === "Restart Conversation") {
      handleRestart();
      return;
    }

    if (label === "Back to main menu") {
      const mainMenuMsg = apiData.find(msg => msg.id === "mainmenu") || apiData[0];
      setConversation(prev => [...prev, { chattype: "receiver", message: label, prompt: null, isactive: false }, mainMenuMsg]);
      return;
    }

    setConversation(prev => [
      ...prev,
      {
        chattype: "receiver",
        message: label,
        prompt: null,
        isactive: false,
      },
    ]);

    const nextMessage = findMessageById(nextId);
    if (nextMessage) {
      setTimeout(() => {
        setConversation(prev => {
          const updated = [...prev, nextMessage];
          if (!nextMessage.prompt) {
            updated[updated.length - 1] = {
              ...nextMessage,
              prompt: [{ label: "Back to main menu", nextId: "mainmenu" }]
            };
          }
          const prompts = updated[updated.length - 1].prompt || [];
          const isEndConversation = 
            prompts.length === 2 &&
            prompts.some(p => p.label === "Back to main menu") &&
            prompts.some(p => p.label.startsWith("Back to ") && p.label !== "Back to main menu");

          if (!nextMessage.prompt || nextMessage.isTerminal || isEndConversation) {
            updated.push({ chattype: "queryresolved" });
          }
          return updated;
        });
      }, 300);
    }
  };

  const handleInputChange = e => setInput(e.target.value);

  const handleSendMessage = e => {
    e.preventDefault();
    if (!input.trim()) return;

    setConversation(prev => [
      ...prev,
      {
        chattype: "receiver",
        message: input.trim(),
        prompt: null,
        isactive: false,
      },
      { chattype: "queryresolved" }
    ]);
    setInput("");
  };

  const handleToggle = () => setOpen(prev => !prev);

  const handleThumbsUp = () => {
    setConversation(prev => [
      ...prev,
      {
        chattype: "sender",
        message: "Thank you for using Airtel, we are happy to help",
        prompt: [{ label: "Restart Conversation", nextId: "mainmenu" }],
        isactive: true,
      }
    ]);
  };

  const handleThumbsDown = () => {
  const notResolvedMsg = apiData.find(msg => msg.id === "notresolved");
  if (notResolvedMsg) {
    setConversation(prev => [...prev, notResolvedMsg]);
  }
};

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  return (
    <>
      <button id="chatbot-toggler" onClick={handleToggle}>
        {!open ? (
          <i className="fa fa-commenting-o" style={{ color: "#fff", fontSize: 24 }}></i>
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
                return <QueryResolvedBot key={idx} onUp={handleThumbsUp} onDown={handleThumbsDown} />;
              }
              if (msg.chattype === "sender") {
                return (
                  <React.Fragment key={idx}>
                    <div className="chatbot-message sender">
                      <span className="chatbot-avatar-circle">
                        <img src={AirtelLogo} alt="Airtel" className="chatbot-avatar-img" />
                      </span>
                      <div className="sender-bubble-options">
                        <div className="chatbot-bubble">{msg.message}</div>
                        {msg.prompt && (
                          <div className="chatbot-options">
                            {msg.prompt.map((p, i) => (
                              <button key={i} onClick={() => handlePromptClick(p.nextId, p.label)}>
                                <div className="prompt-msg">{p.label}</div>
                                </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </React.Fragment>
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
              <input
                type="text"
                placeholder="Type your query here..."
                value={input}
                onChange={handleInputChange}
                className="airtel-input"
              />
              <button type="button" className="airtel-mic">
                <i className="fa fa-microphone" style={{ color: "#000" }} />
              </button>
              <button type="submit" className="airtel-send">
                <i className="fa fa-location-arrow" style={{ color: "#000" }} />
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
