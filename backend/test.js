const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const url = require('url');

// Create an Express app
const app = express();

// Create an HTTP server that will handle WebSocket connections
const server = http.createServer(app);

// Initialize WebSocket server with the HTTP server
const wss = new WebSocket.Server({ server });
let intervalids=[]
// Define a simple broadcast mechanism for different query parameters (subdomain)
wss.on('connection', (ws, req) => {
  // Extract the query parameters from the URL
  const queryParams = url.parse(req.url, true).query;
  const subdomain = queryParams.subdomain || 'default'; // Default to 'default' if no subdomain is provided
  const userid = queryParams.userid
  console.log(`Connection from subdomain: ${subdomain}`);

  // Define an interval that sends a message every 10 seconds

    // Send a different message based on the subdomain query parameter
    let message = '';

    if (subdomain === 'chat') {
        const intervalId = setInterval(() => {
      message = 'Chat subdomain: Stay connected!';
      ws.send(JSON.stringify({ message }));
      console.log(userid)
        }, 1000);
        intervalids[userid]=[intervalId]
    } else if (subdomain === 'news') {
        const intervalId = setInterval(() => {
            message = 'news subdomain: Stay connected!';
            ws.send(JSON.stringify({ message }));
            console.log(userid)
              }, 2000);
              intervalids[userid]=[intervalId]
    } else {
        const intervalId = setInterval(() => {
            message = 'Shit subdomain: Stay connected!';
            ws.send(JSON.stringify({ message }));
            console.log(userid)
              }, 500);
              intervalids[userid]=[intervalId]
    }

    // Send the message to the client


  // Listen for messages from the client
  ws.on('message', (message) => {
    console.log(`Received message from ${subdomain}: ${message}`);
  });

  // Handle connection close (clear the interval)
  ws.on('close', () => {
    console.log(`Connection closed for subdomain: ${subdomain}`);
    
    clearInterval(intervalids[userid][0]); // Clean up the interval when the connection closes
  });

  // Optionally handle errors
  ws.on('error', (error) => {
    console.log(`Error with WebSocket connection: ${error.message}`);
  });
});

// Start the HTTP server to listen for requests
server.listen(8080, () => {
  console.log('Server is running on ws://localhost:8080');
});
