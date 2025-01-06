export const mqttConfig = {
  // Use secure WebSocket connection
  url: 'ws://127.0.0.1:9001/mqtt',
  options: {
    username: 'alex',
    password: 'idw666',
    clean: true, // Clean session
    connectTimeout: 4000, // Timeout period
    clientId: `mqtt_client_${Math.random().toString(16).substring(2, 8)}`,
    // Add more options as needed for your MQTT broker
  }
};