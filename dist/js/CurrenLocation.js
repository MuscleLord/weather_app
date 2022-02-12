export default class CurrentLocation {
	constructor() {
		this._name = "Current Location";
		this._lat = null;
		this._lon = null;
		this._unit = "metric";
		this._lang = "sv";
		this._posname = null;
	}

	//getters
	getName() {
		return this._name;
	}
	getLat() {
		return this._lat;
	}
	getLon() {
		return this._lon;
	}
	getUnit() {
		return this._unit;
	}
	getLang() {
		return this._lang;
	}
	getPosName() {
		return this._posname;
	}

	//setters
	setName(name) {
		this._name = name;
	}
	setLat(lat) {
		this._lat = lat;
	}
	setLon(lon) {
		this._lon = lon;
	}
	setUnit(unit) {
		this._unit = unit;
	}
	setLang(lang) {
		this._lang = lang;
	}
	setPosName(posName) {
		this._posname = posName;
	}

	toggleUnit() {
		this._unit = this._unit === "imperial" ? "metric" : "imperial";
	}
}
