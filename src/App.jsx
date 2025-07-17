import React from "react";
import Chatbot from "./chatbot";
import "./chatbot.css";
import 'font-awesome/css/font-awesome.min.css';
function App() {
  return (
    <div>
      <button id="chatbot-toggler"/> 
      <Chatbot />
    </div>
  );
}

export default App;
