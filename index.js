require('dotenv').config();
const twilio = require('twilio');
require('dotenv').config();
const axios = require('axios');
const { ReassignedNumberRequest } = require('twilio/lib/rest/lookups/v2/query');
const M_API_KEY = process.env.MARTA_API_KEY;
const W_API_KEY = process.env.WEATHER_API_KEY;

const fetchMarta = async (weather) => {
    try {
        const response = await axios.get(`https://developerservices.itsmarta.com:18096/itsmarta/railrealtimearrivals/developerservices/traindata?apiKey=${M_API_KEY}`);
        const posts = response.data;
        const arrival = "MIDTOWN STATION";
        const trainArrivalData = [];

        console.log(posts)
        for (let i = 0; i < posts.length; i++) {

            if (posts[i].WAITING_TIME == "Arriving") {
                continue
            }
            const spaceIndex = posts[i].WAITING_TIME.indexOf(" ");
            const waitingInteger = Number(posts[i].WAITING_TIME.substring(0, spaceIndex));

            if ((posts[i].STATION == arrival) && (waitingInteger > 5) && (posts[i].DESTINATION == "Doraville")) {
                trainArrivalData.push(posts[i]);
            }
        }

        printString = "🚆 Midtown Station arrivals: ";
        for (let i = 0; i < trainArrivalData.length; i++) {
            let nextArrival = trainArrivalData[i].NEXT_ARR.substring(0, 5);

            if (trainArrivalData[i].NEXT_ARR.charAt(0) == "0") {
                nextArrival = trainArrivalData[i].NEXT_ARR.substring(1, 5);
            }

            if (i < trainArrivalData.length - 1) {

                printString += trainArrivalData[i].WAITING_TIME + " (" 
                + nextArrival + "PM), ";
            } else {
                printString += "and " + trainArrivalData[i].WAITING_TIME + " (" 
                + nextArrival+ "PM).";
            }
        }
        printString += " The weather will be " + weather + " today.";
        console.log(printString);

        return printString;

    } catch (err) {
      console.error('Error fetching posts:', err.message);
    }
};

const sendWhatsApp = async (text) => {
    const accountSid = process.env.ACCOUNTSID;
    const authToken = process.env.AUTHTOKEN;
    const phoneNumber = process.env.PHONENUMBER;
    const contentSid = process.env.CONTENTSID;
    const client = require('twilio')(accountSid, authToken);
    console.log(text);
    client.messages
    .create({
        from: 'whatsapp:+14155238886',
        contentSid: contentSid,
        contentVariables: `{"1":"${text}"}`,
        to: phoneNumber
    })

}

fetchWeather = async () => {
    try {

        const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${W_API_KEY}&q=33.781738,-84.383018`);
        posts = response.data;

        // console.log(posts);

        weather = posts.current.condition.text;
        console.log(weather);


        return weather;

    } catch {
        console.log("Failed");
    }
}

const run = async () => {
    weather = await fetchWeather();
    message = await fetchMarta(weather);
    // // console.log(message);
    sendWhatsApp(message);
}

run();