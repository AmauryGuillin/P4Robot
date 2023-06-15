/*
------------PLAN D'ACTION POUR CE ROBOT------------
- Recupérer une liste de tous les animaux avec leur noms latin. ✅
- Créer un objet dans lequel ranger chaque groupe d'informaation sur les animaux ❌
- Faire tourner le robot sur cette liste afain de récupérer chaque animal indépendanment ❌
- Ranger tous les animaux en base de donnée Mongo ❌
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
import { plantsLatinNames } from "./Tables/tables.js";
class PlantObject {
    constructor(basisOfRecord, scientificName, kingdom, phylum, order, family, genus, species, genericName, specificEpithet, decimalLongitude, decimalLatitude, continent, year, month, day, eventDate, animalImageInfo, locationCountryName, preciseLocationWithinCountry, animalClass, country, taxonId) {
        this.basisOfRecord = basisOfRecord;
        this.scientificName = scientificName;
        this.kingdom = kingdom;
        this.phylum = phylum;
        this.order = order;
        this.family = family;
        this.genus = genus;
        this.species = species;
        this.genericName = genericName;
        this.specificEpithet = specificEpithet;
        this.decimalLongitude = decimalLongitude;
        this.decimalLatitude = decimalLatitude;
        this.continent = continent;
        this.year = year;
        this.month = month;
        this.day = day;
        this.eventDate = eventDate;
        this.animalImageInfo = animalImageInfo;
        this.locationCountryName = locationCountryName;
        this.preciseLocationWithinCountry = preciseLocationWithinCountry;
        this.animalClass = animalClass;
        this.country = country;
        this.taxonId = taxonId;
    }
}
const animalsTab = [];
function fetchPlants(animalToFetch) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = `https://api.gbif.org/v1/occurrence/search?mediaType=StillImage&q=${animalToFetch}`;
        try {
            const response = yield fetch(url);
            if (response.ok) {
                const plants = yield response.json();
                if (plants && plants.results && plants.results.length > 0) {
                    for (let i = 0; i <= plants.results.length; i++) {
                        const plant = plants.results[i];
                        let currentPlant = new PlantObject(plant.basisOfRecord, plant.scientificName, plant.kingdom, plant.phylum, plant.order, plant.family, plant.genus, plant.species, plant.genericName, plant.specificEpithet, plant.decimalLongitude, plant.decimalLatitude, plant.continent, plant.year, plant.month, plant.day, plant.eventDate, "", plant.gadm.level0, plant.gadm.level3, plant.class, plant.country, plant.taxonID);
                        plant.media.forEach((currentImageInfo) => {
                            currentPlant.animalImageInfo = currentImageInfo;
                        });
                        animalsTab.push(currentPlant);
                    }
                }
            }
        }
        catch (error) {
            console.error(`An error occured when fetching data from an animal : ${error}`);
        }
    });
}
function displayAnimalsInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        plantsLatinNames.forEach((animalToFetch) => __awaiter(this, void 0, void 0, function* () {
            yield fetchPlants(animalToFetch);
            console.log(animalsTab);
        }));
    });
}
displayAnimalsInfo();
