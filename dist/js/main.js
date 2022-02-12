import {
	setLocationObject,
	getHomeLocation,
	getWeatherFromCoords,
	getCoordsFromApi,
	cleanText
} from "./dataFunctions.js";
import CurrentLocation from "./CurrenLocation.js";
import {
	setPlaceholderText,
	addSpinner,
	displayError,
	displayApiError,
	updateDisplay,
	updateScreenReaderConfirmation,
	updateWeatherLocationHeader
} from "./domFunctions.js";
const currentLoc = new CurrentLocation();

const initApp = () => {
	const geoButton = document.getElementById("getLocation");
	geoButton.addEventListener("click", getGeoWeather);
	const homeButton = document.getElementById("home");
	homeButton.addEventListener("click", loadWeather);
	const saveButton = document.getElementById("saveLocation");
	saveButton.addEventListener("click", savedLocation);
	const unitButton = document.getElementById("unit");
	unitButton.addEventListener("click", setUnitPref);
	const refreshButton = document.getElementById("refresh");
	refreshButton.addEventListener("click", refreshWeather);
	const locationEntry = document.getElementById("searchBar__form");
	locationEntry.addEventListener("submit", submitNewLocation);
	//set up
	setPlaceholderText();
	//load weather
	loadWeather();
	console.log("App Initiated");
};

document.addEventListener("DOMContentLoaded", initApp);

const getGeoWeather = (event) => {
	if (event) {
		if (event.type === "click") {
			// add spinner
			const mapIcon = document.querySelector(".fa-map-marker-alt");
			addSpinner(mapIcon);
			console.log("get location clicked");
		}
	}
	if (navigator.geolocation) {
		//geoError();

		//this is instead of browser location
		console.log("success");
		const myCoordsObj = {
			name: "Lat:59.3076596 Long:14.1106624",
			lat: 59.3076596,
			lon: 14.1106624
		};
		setLocationObject(currentLoc, myCoordsObj);
		updateDataAndDisplay(currentLoc);
	}
	//navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
};

const geoError = (errObj) => {
	const errMsg = errObj.message ? errObj.message : "GeoLocation not supported";
	displayError(errMsg, errMsg);
};

const geoSuccess = (position) => {
	const myCoordsObj = {
		lat: position.coords.latitude,
		lon: position.coords.longitude,
		name: `Lat:${position.coords.latitude} Long:${position.coords.longitude}`
	};
	setLocationObject(currentLoc, myCoordsObj);
	//console.log(currentLoc);
	//update data and display
	updateDataAndDisplay(currentLoc);
};

const loadWeather = (event) => {
	const savedLocation = getHomeLocation();
	if (!savedLocation && !event) return getGeoWeather();
	if (!savedLocation && event.type === "click") {
		displayError(
			"No Home Location Saved",
			"Sorry, Please save your home location first"
		);
	} else if (savedLocation && !event) {
		displayHomeLocationWeather(savedLocation);
	} else {
		const homeIcon = document.querySelector(".fa-home");
		addSpinner(homeIcon);
		displayHomeLocationWeather(savedLocation);
	}
};

const displayHomeLocationWeather = (home) => {
	if (typeof home === "string") {
		const locationJson = JSON.parse(home);
		const myCoordsObj = {
			lat: locationJson.lat,
			lon: locationJson.lon,
			name: locationJson.name,
			unit: locationJson.unit
		};
		setLocationObject(currentLoc, myCoordsObj);
		updateDataAndDisplay(currentLoc);
	}
};

const savedLocation = () => {
	if (currentLoc.getLat() && currentLoc.getLon()) {
		const saveIcon = document.querySelector(".fa-save");
		addSpinner(saveIcon);
		const location = {
			name: currentLoc.getName(),
			lat: currentLoc.getLat(),
			lon: currentLoc.getLon(),
			unit: currentLoc.getUnit(),
			lang: currentLoc.getLang()
		};
		localStorage.setItem("defaultWeatherLocation", JSON.stringify(location));
		updateScreenReaderConfirmation(
			`Saved ${currentLoc.getName()} as home location`
		);
	}
};

const setUnitPref = () => {
	const unitIcon = document.querySelector(".fa-ruler");
	addSpinner(unitIcon);
	currentLoc.toggleUnit();
	updateDataAndDisplay(currentLoc);
};

const refreshWeather = () => {
	const refreshIcon = document.querySelector(".fa-sync-alt");
	addSpinner(refreshIcon);
	updateDataAndDisplay(currentLoc);
};

const submitNewLocation = async (event) => {
	event.preventDefault();
	const text = document.getElementById("searchBar__text").value;
	const entryText = cleanText(text);
	if (!entryText.length) return;
	const locationIcon = document.querySelector(".fa-search");
	addSpinner(locationIcon);
	const coordsData = await getCoordsFromApi(
		entryText,
		currentLoc.getUnit(),
		currentLoc.getLang()
	);

	if (coordsData) {
		if (coordsData.cod === 200) {
			// success
			// work with api data
			const myCoordsObj = {
				lat: coordsData.coord.lat,
				lon: coordsData.coord.lon,
				name: coordsData.sys.country
					? `${coordsData.name}, ${coordsData.sys.country}`
					: coordsData.name
			};
			setLocationObject(currentLoc, myCoordsObj);
			updateDataAndDisplay(currentLoc);
		} else {
			displayApiError(coordsData);
		}
	} else {
		displayError("Connection Error", "Connection Error");
	}
};

const updateDataAndDisplay = async (locationObj) => {
	//console.log(locationObj);
	//	updateWeatherLocationHeader(locationObj._name);
	const weatherJson = await getWeatherFromCoords(locationObj);

	console.log(weatherJson);
	//this is instead of browser location
	const myCoordsObj = {
		lat: weatherJson.lat,
		lon: weatherJson.lon,
		name: `Lat:${weatherJson.lat} Long:${weatherJson.lon}`
	};
	setLocationObject(currentLoc, myCoordsObj);

	if (weatherJson) updateDisplay(weatherJson, locationObj);
};
