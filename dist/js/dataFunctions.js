export const setLocationObject = (locationObj, coordsObj) => {
	const { lat, lon, name, unit, lang, posname } = coordsObj;
	locationObj.setLat(lat);
	locationObj.setLon(lon);
	locationObj.setName(name);
	if (unit) {
		locationObj.setUnit(unit);
	}
	if (lang) {
		locationObj.setLang(lang);
	}
	if (posname) {
		locationObj.setPosName(posname);
	}
};

export const getHomeLocation = () => {
	return localStorage.getItem("defaultWeatherLocation");
};

export const getWeatherFromCoords = async (locationObj) => {
	/* 	const lat = locationObj.getLat();
	const lon = locationObj.getLon();
	const unit = locationObj.getUnit();
	const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${unit}&lang=sv&exclude=minutely,hourly,alerts&appid=${API_KEY}`;
	const encodedUrl = encodeURI(url);

	try {
		const weatherStream = await fetch(encodedUrl);
		const weatherJson = await weatherStream.json();
		//console.log(jsonData);
		return weatherJson;
	} catch (err) {
		console.error(err.stack);
	} */

	const urlDataObj = {
		lat: locationObj.getLat(),
		lon: locationObj.getLon(),
		units: locationObj.getUnit()
	};
	try {
		const weatherStream = await fetch("./.netlify/functions/get_weather", {
			method: "POST",
			body: JSON.stringify(urlDataObj)
		});
		const weatherJson = await weatherStream.json();
		return weatherJson;
	} catch (err) {
		console.error(err.stack);
	}
};

export const getCoordsFromApi = async (entryText, units, lang) => {
	/* 	const regex = /^\d+$/g;
	const flag = regex.test(entryText) ? "zip" : "q"; // useless in sweden
	const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${entryText}&lang=${lang}&units=${units}&appid=${API_KEY}`;
	const encodedUrl = encodeURI(url);

	try {
		const dataStream = await fetch(encodedUrl);
		const jsonData = await dataStream.json();
		console.log(jsonData);
		return jsonData;
	} catch (err) {
		console.error(err.stack);
	}
 */

	const urlDataObj = {
		text: entryText,
		units: units,
		lang: lang
	};
	try {
		const dataStream = await fetch("./.netlify/functions/get_coords", {
			method: "POST",
			body: JSON.stringify(urlDataObj)
		});
		const jsonData = await dataStream.json();
		return jsonData;
	} catch (err) {
		console.error(err.stack);
	}
};

export const cleanText = (text) => {
	const regex = / {2,}/g;
	const entryText = text.replaceAll(regex, " ").trim();
	return entryText;
};
