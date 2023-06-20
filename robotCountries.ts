/* 
------------PLAN D'ACTION POUR CE ROBOT------------
- Recupérer une liste de tous les pays. ✅
- Créer un objet dans lequel ranger chaque pays ✅
- Faire tourner le robot sur cette liste afain de récupérer chaque pays indépendanment ✅
- Ranger tous les pays en base de donnée Mongo ❌
- Lancer le robot tous les 1er du mois ❌
---------------------------------------------------
*/

import { contriesToFetch } from "./Tables/tables.js";

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

const countriesTab: CountryObject[] = [];

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
        const country = countries[0];

        currentCountry.name = country.name.common;
        currentCountry.official = country.name.official;
        currentCountry.cca2 = country.cca2;
        currentCountry.capital = country.capital;
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

        country.latlng.forEach((value: number) => {
          currentCountry.latlng.push(value);
        });

        country.borders.forEach((countryCode: string) => {
          currentCountry.borders.push(countryCode);
        });

        for (const giniKey in country.gini) {
          if (country.gini.hasOwnProperty(giniKey)) {
            const gini = country.gini[giniKey];
            currentCountry.gini = gini;
            break;
          }
        }

        country.capitalInfo.latlng.forEach((info: number) => {
          currentCountry.capitalLocation.push(info);
        });

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
        countriesTab.push(currentCountry);
      }
    }
  } catch (error) {
    console.log(
      `An error occured when fetching data from a country : ${error}`
    );
  }
}

async function displayCountriesInfo() {
  contriesToFetch.forEach(async (country: string) => {
    await fetchACountry(country);
    console.log(countriesTab);
  });
}

displayCountriesInfo();
