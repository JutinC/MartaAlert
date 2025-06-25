require('dotenv').config();
const axios = require('axios');
const API_KEY = process.env.MARTA_API_KEY;

const fetchMarta = async () => {
    try {
      const response = await axios.get(`https://developerservices.itsmarta.com:18096/itsmarta/railrealtimearrivals/developerservices/traindata?apiKey=${API_KEY}`);
      const posts = response.data;
      console.log('First Title:', posts[0].DESTINATION);
  
    } catch (err) {
      console.error('Error fetching posts:', err.message);
    }
};

// fetchPosts();
fetchMarta();