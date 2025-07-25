const http = require('http');

const chatData = [
  {
    id: "mainmenu",
    chattype: "sender",
    message: "Welcome! How can I assist you today?",
    prompt: [
      { label: "🛠️ Product Support", nextId: "productSupport_start" },
      { label: "💳 Billing Help", nextId: "billingHelp_start" },
      { label: "💻 Technical Issues", nextId: "technicalIssues_start" },
      { label: "ℹ️ General Info", nextId: "generalInfo_start" }
    ],
    isactive: true
  },
  {
    id: "productSupport_start",
    chattype: "sender",
    message: "Product Support — How can I help you?",
    prompt: [
      { label: "Warranty Information", nextId: "productSupport_warranty" },
      { label: "Return Policy", nextId: "productSupport_return" },
      { label: "Product Manuals", nextId: "productSupport_manuals" },
      { label: "Back to main menu", nextId: "mainmenu" }
    ],
    isactive: true
  },
  {
    id: "productSupport_warranty",
    chattype: "sender",
    message: "Our products come with a 1-year warranty. Anything else?",
    prompt: [
      { label: "Back to Product Support", nextId: "productSupport_start" },
      { label: "Back to main menu", nextId: "mainmenu" }
    ],
    isactive: false
  },
  {
    id: "productSupport_return",
    chattype: "sender",
    message: "You can return products within 30 days with a receipt.",
    prompt: [
      { label: "Back to Product Support", nextId: "productSupport_start" },
      { label: "Back to main menu", nextId: "mainmenu" }
    ],
    isactive: false
  },
  {
    id: "productSupport_manuals",
    chattype: "sender",
    message: "Product manuals are available on our website under Support.",
    prompt: [
      { label: "Back to Product Support", nextId: "productSupport_start" },
      { label: "Back to main menu", nextId: "mainmenu" }
    ],
    isactive: false
  },
  {
    id: "productSupport_end",
    chattype: "sender",
    message: "Is there anything else I can assist you with in Product Support?",
    prompt: null,
    isactive: false,
    isTerminal: true
  },
  {
    id: "billingHelp_start",
    chattype: "sender",
    message: "Billing Help — Choose a topic:",
    prompt: [
      { label: "View Invoice", nextId: "billingHelp_invoice" },
      { label: "Payment Options", nextId: "billingHelp_payment" },
      { label: "Refunds", nextId: "billingHelp_refunds" },
      { label: "Back to main menu", nextId: "mainmenu" }
    ],
    isactive: true
  },
  {
    id: "billingHelp_invoice",
    chattype: "sender",
    message: "Invoices are available for download in your account dashboard.",
    prompt: [
      { label: "Back to Billing Help", nextId: "billingHelp_start" },
      { label: "Back to main menu", nextId: "mainmenu" }
    ],
    isactive: false
  },
  {
    id: "billingHelp_payment",
    chattype: "sender",
    message: "We accept credit cards, PayPal, and bank transfers.",
    prompt: [
      { label: "Back to Billing Help", nextId: "billingHelp_start" },
      { label: "Back to main menu", nextId: "mainmenu" }
    ],
    isactive: false
  },
  {
    id: "billingHelp_refunds",
    chattype: "sender",
    message: "Refunds are processed within 5-7 business days.",
    prompt: [
      { label: "Back to Billing Help", nextId: "billingHelp_start" },
      { label: "Back to main menu", nextId: "mainmenu" }
    ],
    isactive: false
  },
  {
    id: "billingHelp_end",
    chattype: "sender",
    message: "Do you have any other billing questions?",
    prompt: null,
    isactive: false,
    isTerminal: true
  },
  {
    id: "technicalIssues_start",
    chattype: "sender",
    message: "Technical Issues — Please select:",
    prompt: [
      { label: "Connectivity Problems", nextId: "techConnectivity" },
      { label: "App Crashes", nextId: "techAppCrashes" },
      { label: "Feature Requests", nextId: "techFeatureRequests" },
      { label: "Back to main menu", nextId: "mainmenu" }
    ],
    isactive: true
  },
  {
    id: "techConnectivity",
    chattype: "sender",
    message: "Try restarting your router and checking cables.",
    prompt: [
      { label: "Back to Technical Issues", nextId: "technicalIssues_start" },
      { label: "Back to main menu", nextId: "mainmenu" }
    ],
    isactive: false
  },
  {
    id: "techAppCrashes",
    chattype: "sender",
    message: "Please update the app to the latest version.",
    prompt: [
      { label: "Back to Technical Issues", nextId: "technicalIssues_start" },
      { label: "Back to main menu", nextId: "mainmenu" }
    ],
    isactive: false
  },
  {
    id: "techFeatureRequests",
    chattype: "sender",
    message: "We welcome your feedback! Please submit requests on our website.",
    prompt: [
      { label: "Back to Technical Issues", nextId: "technicalIssues_start" },
      { label: "Back to main menu", nextId: "mainmenu" }
    ],
    isactive: false
  },
  {
    id: "technicalIssues_end",
    chattype: "sender",
    message: "Is your technical problem resolved?",
    prompt: null,
    isactive: false,
    isTerminal: true
  },

  {
    id: "generalInfo_start",
    chattype: "sender",
    message: "General Info — What would you like to know?",
    prompt: [
      { label: "Company History", nextId: "generalInfo_history" },
      { label: "Careers", nextId: "generalInfo_careers" },
      { label: "Contact Information", nextId: "generalInfo_contact" },
      { label: "Back to main menu", nextId: "mainmenu" }
    ],
    isactive: true
  },
  {
    id: "generalInfo_history",
    chattype: "sender",
    message: "Our company was founded in 1990 and has grown globally.",
    prompt: [
      { label: "Back to General Info", nextId: "generalInfo_start" },
      { label: "Back to main menu", nextId: "mainmenu" }
    ],
    isactive: false
  },
  {
    id: "generalInfo_careers",
    chattype: "sender",
    message: "We are hiring! Check our careers page for openings.",
    prompt: [
      { label: "Back to General Info", nextId: "generalInfo_start" },
      { label: "Back to main menu", nextId: "mainmenu" }
    ],
    isactive: false
  },
  {
    id: "generalInfo_contact",
    chattype: "sender",
    message: "Contact us at contact@example.com or call 555-1234.",
    prompt: [
      { label: "Back to General Info", nextId: "generalInfo_start" },
      { label: "Back to main menu", nextId: "mainmenu" }
    ],
    isactive: false
  },
  {
    id: "generalInfo_end",
    chattype: "sender",
    message: "Is your question answered?",
    prompt: null,
    isactive: false,
    isTerminal: true
  }, 
  {
    id: "notresolved",
    chattype: "sender",
    message: "Sorry to hear that. Let's Rewind. What do you need help with?",
    prompt: [
      { label: "🛠️ Product Support", nextId: "productSupport_start" },
      { label: "💳 Billing Help", nextId: "billingHelp_start" },
      { label: "💻 Technical Issues", nextId: "technicalIssues_start" },
      { label: "ℹ️ General Info", nextId: "generalInfo_start" }
    ],
    isactive: true
  },
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
