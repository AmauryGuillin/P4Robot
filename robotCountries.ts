/* 
------------PLAN D'ACTION POUR CE ROBOT------------
- Recupérer une liste de tous les pays. ✅
- Créer un objet dans lequel ranger chaque pays ✅
- Faire tourner le robot sur cette liste afain de récupérer chaque pays indépendanment ✅
- Ranger tous les pays en base de donnée Mongo ✅
- Lancer le robot tous les 1er du mois ❌
---------------------------------------------------
*/

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
  constructor(
    public name: string,
    public official: string,
    public nativeNameOfficial: string,
    public nativeNameCommon: string,
    public cca2: string,
    public currencieName: string,
    public currencieSymbol: string,
    public capital: string,
    public region: string,
    public subregion: string,
    public language: string,
    public latlng: number[],
    public islandlocked: boolean,
    public borders: string[],
    public area: number,
    public flag: string,
    public population: number,
    public gini: number,
    public carside: string,
    public startOfWeek: string,
    public capitalLocation: number[],
    //meteo part
    public capitalMainDescription: string,
    public capitalTemperature: number,
    public capitalHumidity: number,
    public capitalPressure: number,
    public capitalWindSpeed: number,
    public capitalWindDirection: number,
    public capitalCloudPercentage: number
  ) {}
}

const countriesToStore = mongoose.model("Countries", CountrySchema);

//const countriesTab: CountryObject[] = [];

async function fetchACountry(countryToFetch: string) {
  let currentCountry = new CountryObject(
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    [],
    false,
    [],
    0,
    "",
    0,
    0,
    "",
    "",
    [],
    "",
    0,
    0,
    0,
    0,
    0,
    0
  );

  const url = `https://restcountries.com/v3.1/name/${countryToFetch}`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      const countries = await response.json();
      if (countries && countries.length > 0) {
        await mongoose.connect("mongodb://127.0.0.1:27017/test");
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

        if (country.borders) {
          country.borders.forEach((countryCode: string) => {
            currentCountry.borders.push(countryCode);
          });
        }

        const apiKey: string = "f0ec6d4846a480ebbdb11409e8119ca9";
        const capitalLongitude: number = currentCountry.capitalLocation[1];
        const capitalLattitude: number = currentCountry.capitalLocation[0];
        const urlMeto: string = `https://api.openweathermap.org/data/2.5/weather?lat=${capitalLattitude}&lon=${capitalLongitude}&appid=${apiKey}`;

        const responseMeteo = await fetch(urlMeto);
        if (responseMeteo.ok) {
          const currentMeteo = await responseMeteo.json();
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
        await countryToAdd.save();
        mongoose.disconnect();
      }
    }
  } catch (error) {
    console.log(
      `An error occured when fetching data from a country : ${error}`
    );
  }
}

async function displayCountriesInfo() {
  console.log(`RobotCountries powered ON`);
  contriesToFetch.forEach(async (country: string) => {
    await fetchACountry(country);
    //console.log(countriesTab);
  });
  //await fetchACountry("New Zealand");
  console.log(`RobotCountries powered OFF`);
}

displayCountriesInfo();
