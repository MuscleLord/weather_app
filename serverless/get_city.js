const fetch = require("node-fetch");

const { GEO_CITY_TOKEN } = process.env;

exports.handler = async (event, context) => {
	const params = JSON.parse(event.body);
	const { lat, lon } = params;
	const url = `https://eu1.locationiq.com/v1/reverse.php?key=${GEO_CITY_TOKEN}&lat=${lat}&lon=${lon}&format=json`;
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
