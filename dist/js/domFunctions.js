export const setPlaceholderText = () => {
	const input = document.getElementById("searchBar__text");
	window.innerWidth < 400
		? (input.placeholder = "Stad")
		: (input.placeholder = "Stad eller Land");
};

export const addSpinner = (element) => {
	animateButton(element);
	setTimeout(animateButton, 1000, element);
};

const animateButton = (element) => {
	element.classList.toggle("none");
	element.nextElementSibling.classList.toggle("block");
	element.nextElementSibling.classList.toggle("none");
};

export const displayError = (headerMsg, srMsg) => {
	updateWeatherLocationHeader(headerMsg);
	updateScreenReaderConfirmation(srMsg);
};

export const displayApiError = (statusCode) => {
	const properMsg = toProperCase(statusCode.message);
	updateWeatherLocationHeader(properMsg);
	updateScreenReaderConfirmation(`${properMsg}. Please try again`);
};

const toProperCase = (text) => {
	const words = text.split(" ");
	const properWords = words.map((word) => {
		return word.charAt(0).toUpperCase() + word.slice(1);
	});
	return properWords.join(" ");
};

export const updateWeatherLocationHeader = (messages) => {
	const message =
		typeof messages === "string" ? messages : messages.getPosName();
	const h1 = document.getElementById("currentForecast__location");
	const h2 = document.getElementById("currentForecast__city");
	if (message.indexOf("Lat:") !== -1 && message.indexOf("Lon:") !== -1) {
		const msgArray = message.split(" ");
		const mapArray = msgArray.map((msg) => {
			return msg.replace(":", ": ");
		});
		const lat =
			mapArray[0].indexOf("-") === -1
				? mapArray[0].slice(0, 10)
				: mapArray[0].slice(0, 11);
		const lon =
			mapArray[1].indexOf("-") === -1
				? mapArray[1].slice(0, 10)
				: mapArray[1].slice(0, 11);
		h1.textContent = `${lat} • ${lon}`;
		h2.textContent = messages.getName();
	} else {
		if (typeof messages === "string") {
			h1.textContent = "";
			h2.textContent = message;
		} else {
			h1.textContent = message;
			h2.textContent = messages.getName();
		}
	}
};

export const updateScreenReaderConfirmation = (message) => {
	document.getElementById("confirmation").textContent = message;
};

export const updateDisplay = (weatherJson, locationObj) => {
	fadeDisplay();
	clearDisplay();

	const weatherClass = getWeatherClass(weatherJson.current.weather[0].icon);
	setBGImage(weatherClass);
	const screenReaderWeather = buildScreenReaderWeather(
		weatherJson,
		locationObj
	);
	updateScreenReaderConfirmation(screenReaderWeather);
	updateWeatherLocationHeader(locationObj);

	//current condition
	const ccArray = createCurrentConditionsDivs(
		weatherJson,
		locationObj.getUnit()
	);
	displayCurrentConditions(ccArray);
	//sixday forecast
	displaySixDayForecast(weatherJson);
	setFocusOnSearch();

	fadeDisplay();
};

const fadeDisplay = () => {
	const cc = document.getElementById("currentForecast");
	cc.classList.toggle("zero-vis");
	cc.classList.toggle("fade-in");
	const sixDay = document.getElementById("dailyForecast");
	sixDay.classList.toggle("zero-vis");
	sixDay.classList.toggle("fade-in");
};

const clearDisplay = () => {
	const currentConditions = document.getElementById(
		"currentForecast__conditions"
	);
	deleteContents(currentConditions);
	const sixDayForecast = document.getElementById("dailyForecast__contents");
	deleteContents(sixDayForecast);
};

const deleteContents = (parentElement) => {
	let child = parentElement.lastElementChild;
	while (child) {
		parentElement.removeChild(child);
		child = parentElement.lastElementChild;
	}
};

const getWeatherClass = (icon) => {
	const firstTwoChars = icon.slice(0, 2);
	const lastChar = icon.slice(2);
	const weatherLookup = {
		"09": "snow",
		10: "rain",
		11: "rain",
		13: "snow",
		50: "fog"
	};
	let weatherClass;
	if (weatherLookup[firstTwoChars]) {
		weatherClass = weatherLookup[firstTwoChars];
	} else if (lastChar === "d") {
		weatherClass = "clouds";
	} else {
		weatherClass = "night";
	}
	return weatherClass;
};

const setBGImage = (weatherClass) => {
	document.documentElement.classList.add(weatherClass);
	document.documentElement.classList.forEach((img) => {
		if (img !== weatherClass) document.documentElement.classList.remove(img);
	});
};

const buildScreenReaderWeather = (weatherJson, locationObj) => {
	const location = locationObj.getName();
	const unit = locationObj.getUnit();
	const tempUnit = unit === "imperial" ? "F" : "C";
	return `${weatherJson.current.weather[0].description} and ${roundNum(
		weatherJson.current.temp
	)}°${tempUnit} in ${location}`;
};

const setFocusOnSearch = () => {
	document.getElementById("searchBar__text").focus();
};

const createCurrentConditionsDivs = (weatherObj, unit) => {
	const currentWeather = weatherObj.current;
	const cDailyWeather = weatherObj.daily[0];
	const cInfo = currentWeather.weather[0];
	const tempUnit = unit === "imperial" ? "F" : "C";
	const windUnit = unit === "imperial" ? "mph" : "m/s";
	const icon = createMainImgDiv(cInfo.icon, cInfo.description);
	const temp = createElem(
		"div",
		"temp",
		`${
			unit === "imperial"
				? roundNum(currentWeather.temp)
				: roundNum(currentWeather.temp * 10) / 10
		}°`,
		tempUnit
	);
	const properDesc = toProperCase(cInfo.description);
	const desc = createElem("div", "desc", properDesc);
	const feels = createElem(
		"div",
		"feels",
		`Känsla ${roundNum(currentWeather.feels_like)}°`
	);
	const maxTemp = createElem(
		"div",
		"maxtemp",
		`H ${roundNum(cDailyWeather.temp.max)}°`
	);
	const minTemp = createElem(
		"div",
		"mintemp",
		`L ${roundNum(cDailyWeather.temp.min)}°`
	);
	const humidity = createElem(
		"div",
		"humidity",
		`Fuktighet ${currentWeather.humidity}%`
	);
	const wind = createElem(
		"div",
		"wind",
		`Vind ${currentWeather.wind_speed} ${windUnit}`
	);
	//make sure the temp fontsize make room for more characters when its cold
	if (`${roundNum(currentWeather.temp * 10) / 10}`.length >= 4) {
		temp.style.fontSize = "6rem";
	}

	console.log(
		roundNum(currentWeather.temp * 10) / 10,
		`${roundNum(currentWeather.temp * 10) / 10}`.length
	);
	return [icon, temp, desc, feels, maxTemp, minTemp, humidity, wind];
};

const createMainImgDiv = (icon, altText) => {
	const iconDiv = createElem("div", "icon");
	iconDiv.id = "icon";
	const faIcon = translateIconToFontAwesome(icon);
	faIcon.ariaHidden = true;
	faIcon.title = altText;
	iconDiv.appendChild(faIcon);
	return iconDiv;
};

const createElem = (elemType, divClassName, divText, unit) => {
	const div = document.createElement(elemType);
	div.className = divClassName;
	if (divText) {
		div.textContent = divText;
	}
	if (divClassName === "temp") {
		const unitDiv = document.createElement("div");
		unitDiv.classList.add("unit");
		unitDiv.textContent = unit;
		div.appendChild(unitDiv);
	}
	return div;
};

const translateIconToFontAwesome = (icon) => {
	const i = document.createElement("i");
	const firstTwoChars = icon.slice(0, 2);
	const lastChar = icon.slice(2);
	switch (firstTwoChars) {
		case "01":
			if (lastChar === "d") {
				i.classList.add("far", "fa-sun"); // fa-solid or far
			} else {
				i.classList.add("far", "fa-moon");
			}
			break;
		case "02":
			if (lastChar === "d") {
				i.classList.add("fas", "fa-cloud-sun"); // fa-solid or far
			} else {
				i.classList.add("fas", "fa-cloud-moon");
			}
			break;
		case "03":
			i.classList.add("fas", "fa-cloud");
			break;
		case "04":
			i.classList.add("fas", "fa-cloud-meatball"); // fa-solid or far
			break;
		case "09":
			i.classList.add("fas", "fa-cloud-rain"); // fa-solid or far
			break;
		case "10":
			if (lastChar === "d") {
				i.classList.add("fas", "fa-cloud-sun-rain"); // fa-solid or far
			} else {
				i.classList.add("fas", "fa-cloud-moon-rain");
			}
			break;
		case "11":
			i.classList.add("fas", "fa-poo-storm"); // fa-solid or far
			break;
		case "13":
			i.classList.add("fas", "fa-snowflake"); // fa-solid or far
			break;
		case "50":
			i.classList.add("fas", "fa-smog"); // fa-solid or far
			break;
		default:
			i.classList.add("far", "fa-question-circle"); // fa-solid or far
	}
	return i;
};

const displayCurrentConditions = (currentConditionsArray) => {
	const ccContainer = document.getElementById("currentForecast__conditions");
	currentConditionsArray.forEach((cc) => {
		ccContainer.appendChild(cc);
	});
};

const displaySixDayForecast = (weatherJson) => {
	for (let i = 1; i <= 6; i++) {
		const dfArray = creatDailyForecastDivs(weatherJson.daily[i]);
		displayDailyForecast(dfArray);
	}
};

const creatDailyForecastDivs = (dayWeather) => {
	const dayAbbreviationText = getDayAbbreviation(dayWeather.dt);
	const dayAbbreviation = createElem(
		"p",
		"dayAbbreviation",
		dayAbbreviationText
	);
	const dwArr = dayWeather.weather[0];
	const dayIcon = creatDailyForecastIcon(dwArr.icon, dwArr.description);
	const dayHigh = createElem(
		"p",
		"dayHigh",
		`H ${roundNum(dayWeather.temp.max)}°`
	);
	const dayLow = createElem(
		"p",
		"dayLow",
		`L ${roundNum(dayWeather.temp.min)}°`
	);
	return [dayAbbreviation, dayIcon, dayHigh, dayLow];
};

const getDayAbbreviation = (data) => {
	const dateObj = new Date(data * 1000);
	const utcString = dateObj.toUTCString();
	let dayName = utcString.slice(0, 3).toUpperCase();

	switch (dayName) {
		case "MON":
			dayName = "MÅN";
			break;
		case "TUE":
			dayName = "TIS";
			break;
		case "WED":
			dayName = "ONS";
			break;
		case "THU":
			dayName = "TOR";
			break;
		case "FRI":
			dayName = "FRE";
			break;
		case "SAT":
			dayName = "LÖR";
			break;
		case "SUN":
			dayName = "SÖN";
			break;
		default:
			dayName = "NIL";
	}
	return dayName;
};

const creatDailyForecastIcon = (icon, altText) => {
	const img = document.createElement("img");
	if (window.innerWidth < 768 || window.innerHeight < 1025) {
		img.src = `https://openweathermap.org/img/wn/${icon}.png`;
	} else {
		img.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
	}
	img.alt = altText;

	return img;
};

const displayDailyForecast = (dfArray) => {
	const dayDiv = createElem("div", "forecastDay");
	dfArray.forEach((el) => {
		dayDiv.appendChild(el);
	});
	const dailyForecastContainer = document.getElementById(
		"dailyForecast__contents"
	);
	dailyForecastContainer.appendChild(dayDiv);
};

const roundNum = (weatherObj) => {
	return Math.round(Number(weatherObj));
};
