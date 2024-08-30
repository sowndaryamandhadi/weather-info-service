
const http = require('http');
const axios = require('axios');

const API_KEY = '56e10d7e3d5da81350d92bebab6bc8ba';
const BASE_URL = 'http://api.weatherstack.com/current';

// Function to get weather data
const getWeatherData = async (location) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        access_key: API_KEY,
        query: location,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

// Create an HTTP server
const server = http.createServer(async (req, res) => {
  if (req.method === 'GET') {
    const urlParams = new URL(req.url, `http://${req.headers.host}`);
    const location = urlParams.searchParams.get('location');

    if (location) {
      const weatherData = await getWeatherData(location);

      if (weatherData && weatherData.current) {

        // Display the weather information in a human-readable format in the terminal
        console.log(`Weather information for ${weatherData.location.name}, ${weatherData.location.country}:`);
        console.log(`Temperature        : ${weatherData.current.temperature}°C`);
        console.log(`Weather Description: ${weatherData.current.weather_descriptions[0]}`);
        console.log(`Wind Speed         : ${weatherData.current.wind_speed} km/h`);
        console.log(`Humidity           : ${weatherData.current.humidity}%`);

        // Send a simple confirmation response to the client
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`Weather data for ${weatherData.location.name} has been printed in the terminal.`);
      } else {
        console.log('Weather data not found');
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Weather data not found');
      }
    } else {
      console.log('No location provided');
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Please provide a location');
    }
  } else {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method not allowed');
  }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// check weather information in Browser http://localhost:3000/?location= Enter City Name

