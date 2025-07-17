const http = require('http');

const chatData = [
  {
    chattype: "sender",
    message: "Hello there! 👋 It's nice to meet you!",
    prompt: [
      "🔍 Build AI chatbot",
      "💡 Using ChatBot",
      "❓ I have questions",
      "👀 Just browsing"
    ],
    isactive: true
  },
  {
      chattype: "sender",
      message: "🔍 Build AI chatbot",
      prompt: [
        "start building",
        "💡 Using ChatBot",
        "❓ I have questions",
        "👀 Just browsing" 
      ],
      isactive: true
    },
    {
      chattype: "sender",
      message: "💡 Using ChatBot",
      prompt: [
        "🔍 Build AI chatbot",
        "💡 Using ChatBot",
        "❓ I have questions",
        "👀 Just browsing"
      ],
      isactive: true
    },
    {
      chattype: "sender",
      message: "❓ I have questions",
      prompt: [
        "🔍 Is my pack still Active",
        "💡 Can I buy Items",
        "❓ I have questions",
        "Sure! I can help you with that. What would you like to know?",
      ],
      isactive: true
    },
    {
      chattype: "sender",
      message: "👀 Just browsing",
      prompt: [
        "🔍 Build AI chatbot",
        "💡 Using ChatBot",
        "❓ I have questions",
        "👀 Just browsing"
      ],
      isactive: true
    },
  {
    chattype: "receiver",
    message: "Hi! I want to know more about building an AI chatbot.",
    prompt: null,
    isactive: false
  },
  {
    chattype: "sender",
    message: "Sure! I can help you with that. What would you like to know?",
    prompt: [
      "How to get started?",
      "Pricing details",
      "Show me examples"
    ],
    isactive: false
  },
  {
    chattype: "receiver",
    message: "How do I get started?",
    prompt: null,
    isactive: false
  },
  {
    chattype: "sender",
    message: "To get started, you need to set up your development environment.",
    prompt: [
      "Install Node.js",
      "Create React app",
      "Learn React basics"
    ],
    isactive: false
  },
  {
    chattype: "receiver",
    message: "I have installed Node.js. What's next?",
    prompt: null,
    isactive: false
  },
  {
    chattype: "sender",
    message: "Great! Now create a new React app using the command: npx create-react-app chatbot.",
    prompt: [
      "Run npm start",
      "Edit App.js",
      "Add components"
    ],
    isactive: false
  },
  {
    chattype: "receiver",
    message: "How do I add components?",
    prompt: null,
    isactive: false
  },
  {
    chattype: "sender",
    message: "You create components as separate files and import them into your main app.",
    prompt: [
      "Create Chatbot.js",
      "Create Chatbot.css",
      "Import in App.js"
    ],
    isactive: false
  },
  {
    chattype: "receiver",
    message: "Thanks! Can I customize the styles?",
    prompt: null,
    isactive: false
  },
  {
    chattype: "sender",
    message: "Yes, you can edit the CSS files to change colors, sizes, and layout.",
    prompt: [
      "Change header color",
      "Change button styles",
      "Adjust layout"
    ],
    isactive: false
  },
  {
    chattype: "receiver",
    message: "Can I add more buttons?",
    prompt: null,
    isactive: false
  },
  {
    chattype: "sender",
    message: "Absolutely! Just add more button elements in the Chatbot component.",
    prompt: [
      "Add button in Chatbot.js",
      "Style new buttons",
      "Handle button clicks"
    ],
    isactive: false
  }
];

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/messages') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(JSON.stringify(chatData,null,2));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(3001, () => {
  console.log('Server running on port 3001');
});
