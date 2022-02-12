const fetch = require("node-fetch");

const { API_KEY } = process.env;

exports.handler = async (event, context) => {
	const params = JSON.parse(event.body);
	const { lat, lon, units } = params;
	const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&lang=sv&exclude=minutely,hourly,alerts&appid=${API_KEY}`;
	const encodedUrl = encodeURI(url);
	try {
		const weatherStream = await fetch(encodedUrl);
		const weatherJson = await weatherStream.json();
		return {
			statusCode: 200,
			body: JSON.stringify(weatherJson)
		};
	} catch (err) {
		return { statusCode: 422, body: err.stack };
	}
};
