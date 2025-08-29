import React, { useEffect, useState } from "react";

const WebSocketComponent = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("wss://ta.utopiacafe.shop");

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = async (event) => {
      let parsedMessage;

      if (event.data instanceof Blob) {
        parsedMessage = await event.data.text();
      } else {
        try {
          parsedMessage = JSON.parse(event.data);
        } catch (error) {
          console.warn("Received non-JSON message:", event.data);
          parsedMessage = event.data;
        }
      }

      // Extract message content
      const messageContent = parsedMessage.process
        ? parsedMessage.process
        : parsedMessage;

      setMessages((prevMessages) => [...prevMessages, messageContent]);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md border border-gray-300">
      <h1 className="text-xl font-bold text-gray-700 mb-4">
        Messages from Server
      </h1>
      <ul className="list-disc list-inside space-y-2">
        {messages.map((msg, index) => (
          <li key={index} className="text-gray-600">
            {msg}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WebSocketComponent;
