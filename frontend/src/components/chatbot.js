import React, { useState } from 'react';
import axios from 'axios';
import { IoMdSend } from 'react-icons/io';
import { BiBot, BiUser } from 'react-icons/bi';
import './chatBot.css';

// Style objects (update with your existing styles)
const stylecard = {
  maxWidth: '35rem',
  border: '1px solid black',
  paddingLeft: '0px',
  paddingRight: '0px',
  borderRadius: '30px',
  boxShadow: '0 16px 20px 0 rgba(0, 0, 0, 0.4)',
};

const styleHeader = {
  height: '4.5rem',
  borderBottom: '1px solid black',
  borderRadius: '30px 30px 0px 0px',
  backgroundColor: 'rgb(250, 151, 93)',
};

const styleBody = {
  paddingTop: '10px',
  height: '28rem',
  overflowY: 'auto',
  overflowX: 'hidden',
};

const styleFooter = {
  borderTop: '1px solid black',
  borderRadius: '0px 0px 30px 30px',
  backgroundColor: 'rgb(250, 151, 93)',
};

const Chatbot = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [botTyping, setBotTyping] = useState(false);  // New state for bot typing status
  const [suggestions, setSuggestions] = useState([]);

  // Handle sending message and receiving response
  const handleSend = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add user's message to chat history
    const newChat = { sender: 'user', message: userInput };
    setChatHistory([...chatHistory, newChat]);

    setBotTyping(true);  // Show bot typing message

    try {
      const response = await axios.post('http://localhost:3000/api/ask', { userInput });
      const { answer, suggestions } = response.data.response;  // Destructure answer and suggestions

      // Update the chat history with the bot's answer
      const botResponse = { sender: 'bot', message: answer };
      setChatHistory([...chatHistory, newChat, botResponse]);

      // Update suggestions state
      setSuggestions(suggestions || []);  // Make sure suggestions is an empty array if undefined
    } catch (error) {
      console.error('Chatbot error:', error);
    }

    setUserInput('');
    setBotTyping(false);  // Hide bot typing message after response
  };

  const handleSuggestionClick = (suggestion) => {
    setUserInput(suggestion);  // Set user input to the clicked suggestion
    handleSend({ preventDefault: () => {} });  // Trigger handleSend without form submission
  };

  return (
    <div>
      <div className="chat-container">
        <div className="row justify-content-center">
          <div className="card" style={stylecard}>
            {/* Header */}
            <div className="cardHeader text-white" style={styleHeader}>
              <h1 style={{ marginBottom: '0px' }}>AI Assistant</h1>
              {botTyping && <h6>Bot Typing...</h6>}
            </div>

            {/* Body */}
            <div className="cardBody" id="messageArea" style={styleBody}>
              <div className="row msgarea">
                {chatHistory.map((message, key) => (
                  <div key={key}>
                    {message.sender === 'bot' ? (
                      <div className="msgalignstart">
                        <BiBot className="botIcon" />
                        <h5 className="botmsg">{message.message}</h5>  {/* Render answer here */}
                      </div>
                    ) : (
                      <div className="msgalignend">
                        <h5 className="usermsg">{message.message}</h5>
                        <BiUser className="userIcon" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="cardFooter text-white" style={styleFooter}>
              <div className="row">
                <form style={{ display: 'flex', width: '100%' }} onSubmit={handleSend}>
                  <div className="col-10" style={{ paddingRight: '0px' }}>
                    <input
                      onChange={(e) => setUserInput(e.target.value)}
                      value={userInput}
                      type="text"
                      className="msginp"
                      placeholder="Type your message..."
                    />
                  </div>
                  <div className="col-2 cola">
                    <button type="submit" className="circleBtn">
                      <IoMdSend className="sendBtn" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* Display Suggestions */}
        {suggestions.length > 0 && (
          <div className="suggestions">
            <h4>Suggestions:</h4>
            <ul>
              {suggestions.map((suggestion, index) => (
                <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                  {suggestion}  {/* Render suggestion text */}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
