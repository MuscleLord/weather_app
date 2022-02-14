const fetch = require("node-fetch");

const { WEATHER_API_KEY } = process.env;

exports.handler = async (event, context) => {
	const params = JSON.parse(event.body);
	const { text, units, lang } = params;
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&lang=${lang}&units=${units}&appid=${WEATHER_API_KEY}`;
	const encodedUrl = encodeURI(url);
	try {
		const dataStream = await fetch(encodedUrl);
		const jsonData = await dataStream.json();
		return {
			statusCode: 200,
			body: JSON.stringify(jsonData)
		};
	} catch (err) {
		return { statusCode: 422, body: err.stack };
	}
};
