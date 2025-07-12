require('dotenv').config();
const twilio = require('twilio');
require('dotenv').config();
const axios = require('axios');
const API_KEY = process.env.MARTA_API_KEY;

const fetchMarta = async () => {
    try {
        const response = await axios.get(`https://developerservices.itsmarta.com:18096/itsmarta/railrealtimearrivals/developerservices/traindata?apiKey=${API_KEY}`);
        const posts = response.data;
        const arrival = "MIDTOWN STATION";
        const trainArrivalData = [];
        const printList = [];

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
        console.log(printString);


    } catch (err) {
      console.error('Error fetching posts:', err.message);
    }
};

const sendWhatsApp = async () => {
    const accountSid = process.env.ACCOUNTSID;
    const authToken = process.env.AUTHTOKEN;
    const client = require('twilio')(accountSid, authToken);

    client.messages
    .create({
        from: 'whatsapp:+14155238886',
        contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
        contentVariables: '{"1":"12/1","2":"3pm"}',
        to: 'whatsapp:+14849053260'
    })

}
fetchMarta();
sendWhatsApp();