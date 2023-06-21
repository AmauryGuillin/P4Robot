/*
------------PLAN D'ACTION POUR CE ROBOT------------
- Recupérer une liste de tous les pays. ✅
- Créer un objet dans lequel ranger chaque pays ✅
- Faire tourner le robot sur cette liste afain de récupérer chaque pays indépendanment ✅
- Ranger tous les pays en base de donnée Mongo ❌
- Lancer le robot tous les 1er du mois ❌
---------------------------------------------------
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { contriesToFetch } from "./Tables/tables.js";
import mongoose from "mongoose";
const CountrySchema = new mongoose.Schema({
    name: String,
    official: String,
    nativeNameOfficial: String,
    cca2: String,
    currencieName: String,
    currencieSymbol: String,
    capital: String,
    region: String,
    subregion: String,
    language: String,
    latlng: [Number],
    islandlocked: Boolean,
    borders: [String],
    area: Number,
    flag: String,
    population: Number,
    gini: Number,
    carside: String,
    startOfWeek: String,
    capitalLocation: [Number],
    capitalMainDescription: String,
    capitalTemperature: Number,
    capitalHumidity: Number,
    capitalPressure: Number,
    capitalWindSpeed: Number,
    capitalWindDirection: Number,
    capitalCouldPercentage: Number,
});
class CountryObject {
    constructor(name, official, nativeNameOfficial, nativeNameCommon, cca2, currencieName, currencieSymbol, capital, region, subregion, language, latlng, islandlocked, borders, area, flag, population, gini, carside, startOfWeek, capitalLocation, 
    //meteo part
    capitalMainDescription, capitalTemperature, capitalHumidity, capitalPressure, capitalWindSpeed, capitalWindDirection, capitalCloudPercentage) {
        this.name = name;
        this.official = official;
        this.nativeNameOfficial = nativeNameOfficial;
        this.nativeNameCommon = nativeNameCommon;
        this.cca2 = cca2;
        this.currencieName = currencieName;
        this.currencieSymbol = currencieSymbol;
        this.capital = capital;
        this.region = region;
        this.subregion = subregion;
        this.language = language;
        this.latlng = latlng;
        this.islandlocked = islandlocked;
        this.borders = borders;
        this.area = area;
        this.flag = flag;
        this.population = population;
        this.gini = gini;
        this.carside = carside;
        this.startOfWeek = startOfWeek;
        this.capitalLocation = capitalLocation;
        this.capitalMainDescription = capitalMainDescription;
        this.capitalTemperature = capitalTemperature;
        this.capitalHumidity = capitalHumidity;
        this.capitalPressure = capitalPressure;
        this.capitalWindSpeed = capitalWindSpeed;
        this.capitalWindDirection = capitalWindDirection;
        this.capitalCloudPercentage = capitalCloudPercentage;
    }
}
const countriesToStore = mongoose.model("Countries", CountrySchema);
//const countriesTab: CountryObject[] = [];
function fetchACountry(countryToFetch) {
    return __awaiter(this, void 0, void 0, function* () {
        let currentCountry = new CountryObject("", "", "", "", "", "", "", "", "", "", "", [], false, [], 0, "", 0, 0, "", "", [], "", 0, 0, 0, 0, 0, 0);
        const url = `https://restcountries.com/v3.1/name/${countryToFetch}`;
        try {
            const response = yield fetch(url);
            if (response.ok) {
                const countries = yield response.json();
                if (countries && countries.length > 0) {
                    yield mongoose.connect("mongodb://127.0.0.1:27017/test");
                    const country = countries[0];
                    currentCountry.name = country.name.common;
                    currentCountry.official = country.name.official;
                    currentCountry.cca2 = country.cca2;
                    currentCountry.capital = country.capital[0];
                    currentCountry.region = country.region;
                    currentCountry.subregion = country.subregion;
                    currentCountry.islandlocked = country.landlocked;
                    currentCountry.area = country.area;
                    currentCountry.flag = country.flag;
                    currentCountry.population = country.population;
                    currentCountry.carside = country.car.side;
                    currentCountry.startOfWeek = country.startOfWeek;
                    for (const nativeNameKey in country.name.nativeName) {
                        if (country.name.nativeName.hasOwnProperty(nativeNameKey)) {
                            const nativeName = country.name.nativeName[nativeNameKey];
                            currentCountry.nativeNameOfficial = nativeName.official;
                            currentCountry.nativeNameCommon = nativeName.common;
                            break;
                        }
                    }
                    for (const currencyKey in country.currencies) {
                        if (country.currencies.hasOwnProperty(currencyKey)) {
                            const currency = country.currencies[currencyKey];
                            currentCountry.currencieName = currency.name;
                            currentCountry.currencieSymbol = currency.symbol;
                            break;
                        }
                    }
                    for (const languageKey in country.languages) {
                        if (country.languages.hasOwnProperty(languageKey)) {
                            const language = country.languages[languageKey];
                            currentCountry.language = language;
                            break;
                        }
                    }
                    for (const giniKey in country.gini) {
                        if (country.gini.hasOwnProperty(giniKey)) {
                            const gini = country.gini[giniKey];
                            currentCountry.gini = gini;
                            break;
                        }
                    }
                    currentCountry.capitalLocation.push(country.capitalInfo.latlng[0]);
                    currentCountry.capitalLocation.push(country.capitalInfo.latlng[1]);
                    currentCountry.latlng.push(country.latlng[0]);
                    currentCountry.latlng.push(country.latlng[1]);
                    country.borders.forEach((countryCode) => {
                        currentCountry.borders.push(countryCode);
                    });
                    const apiKey = "f0ec6d4846a480ebbdb11409e8119ca9";
                    const capitalLongitude = currentCountry.capitalLocation[1];
                    const capitalLattitude = currentCountry.capitalLocation[0];
                    const urlMeto = `https://api.openweathermap.org/data/2.5/weather?lat=${capitalLattitude}&lon=${capitalLongitude}&appid=${apiKey}`;
                    const responseMeteo = yield fetch(urlMeto);
                    if (responseMeteo.ok) {
                        const currentMeteo = yield responseMeteo.json();
                        if (responseMeteo) {
                            currentCountry.capitalMainDescription =
                                currentMeteo.weather[0].description;
                            (currentCountry.capitalTemperature = currentMeteo.main.temp - 273),
                                15;
                            currentCountry.capitalHumidity = currentMeteo.main.humidity;
                            currentCountry.capitalPressure = currentMeteo.main.pressure;
                            currentCountry.capitalWindSpeed = currentMeteo.wind.speed;
                            currentCountry.capitalWindDirection = currentMeteo.wind.deg;
                            currentCountry.capitalCloudPercentage = currentMeteo.clouds.all;
                        }
                    }
                    let countryToAdd = new countriesToStore({
                        name: currentCountry.name,
                        official: currentCountry.official,
                        nativeNameOfficial: currentCountry.nativeNameOfficial,
                        cca2: currentCountry.cca2,
                        currencieName: currentCountry.currencieName,
                        currencieSymbol: currentCountry.currencieSymbol,
                        capital: currentCountry.capital,
                        region: currentCountry.region,
                        subregion: currentCountry.subregion,
                        language: currentCountry.language,
                        latlng: currentCountry.latlng,
                        islandlocked: currentCountry.islandlocked,
                        borders: currentCountry.borders,
                        area: currentCountry.area,
                        flag: currentCountry.flag,
                        population: currentCountry.population,
                        gini: currentCountry.gini,
                        carside: currentCountry.carside,
                        startOfWeek: currentCountry.startOfWeek,
                        capitalLocation: currentCountry.capitalLocation,
                        capitalMainDescription: currentCountry.capitalMainDescription,
                        capitalTemperature: currentCountry.capitalTemperature,
                        capitalHumidity: currentCountry.capitalHumidity,
                        capitalPressure: currentCountry.capitalPressure,
                        capitalWindSpeed: currentCountry.capitalWindSpeed,
                        capitalWindDirection: currentCountry.capitalWindDirection,
                        capitalCouldPercentage: currentCountry.capitalCloudPercentage,
                    });
                    //countriesTab.push(currentCountry);
                    yield countryToAdd.save();
                }
            }
        }
        catch (error) {
            console.log(`An error occured when fetching data from a country : ${error}`);
        }
    });
}
function displayCountriesInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`RobotCountries powered ON`);
        contriesToFetch.forEach((country) => __awaiter(this, void 0, void 0, function* () {
            yield fetchACountry(country);
            //console.log(countriesTab);
        }));
        //await fetchACountry("France");
        console.log(`RobotCountries powered OFF`);
        mongoose.disconnect();
    });
}
displayCountriesInfo();
