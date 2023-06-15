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
//import { ICountry } from "./Interfaces/interfaces";
class CountryObject {
    constructor(name, official, nativeNameOfficial, nativeNameCommon, cca2, currencieName, currencieSymbol, capitale, region, subregion, language, latlng, islandlocked, borders, area, flag, population, gini, carside, startOfWeek, capitalLocation) {
        this.name = name;
        this.official = official;
        this.nativeNameOfficial = nativeNameOfficial;
        this.nativeNameCommon = nativeNameCommon;
        this.cca2 = cca2;
        this.currencieName = currencieName;
        this.currencieSymbol = currencieSymbol;
        this.capitale = capitale;
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
    }
}
const countriesTab = [];
function fetchACountry(countryToFetch) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = `https://restcountries.com/v3.1/name/${countryToFetch}`;
        try {
            const response = yield fetch(url);
            if (response.ok) {
                const countries = yield response.json();
                if (countries && countries.length > 0) {
                    const country = countries[0];
                    let currentCountry = new CountryObject(country.name.common, country.name.official, "", "", country.cca2, "", "", country.capital, country.region, country.subregion, "", [], country.landlocked, [], country.area, country.flag, country.population, 0, country.car.side, country.startOfWeek, []);
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
                    country.latlng.forEach((value) => {
                        currentCountry.latlng.push(value);
                    });
                    country.borders.forEach((countryCode) => {
                        currentCountry.borders.push(countryCode);
                    });
                    for (const giniKey in country.gini) {
                        if (country.gini.hasOwnProperty(giniKey)) {
                            const gini = country.gini[giniKey];
                            currentCountry.gini = gini;
                            break;
                        }
                    }
                    country.capitalInfo.latlng.forEach((info) => {
                        currentCountry.capitalLocation.push(info);
                    });
                    countriesTab.push(currentCountry);
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
        contriesToFetch.forEach((country) => __awaiter(this, void 0, void 0, function* () {
            yield fetchACountry(country);
            console.log(countriesTab);
        }));
    });
}
displayCountriesInfo();
