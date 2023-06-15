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
import { animalsLatinNames } from "./Tables/tables.js";
class AnimalObject {
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
function fetchAnimals(animalToFetch) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = `https://api.gbif.org/v1/occurrence/search?mediaType=StillImage&q=${animalToFetch}`;
        try {
            const response = yield fetch(url);
            if (response.ok) {
                const animals = yield response.json();
                if (animals && animals.results && animals.results.length > 0) {
                    for (let i = 0; i <= animals.results.length; i++) {
                        const animal = animals.results[i];
                        let currentAnimal = new AnimalObject(animal.basisOfRecord, animal.scientificName, animal.kingdom, animal.phylum, animal.order, animal.family, animal.genus, animal.species, animal.genericName, animal.specificEpithet, animal.decimalLongitude, animal.decimalLatitude, animal.continent, animal.year, animal.month, animal.day, animal.eventDate, "", animal.gadm.level0, animal.gadm.level3, animal.class, animal.country, animal.taxonID);
                        animal.media.forEach((currentImageInfo) => {
                            currentAnimal.animalImageInfo = currentImageInfo;
                        });
                        animalsTab.push(currentAnimal);
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
        animalsLatinNames.forEach((animalToFetch) => __awaiter(this, void 0, void 0, function* () {
            yield fetchAnimals(animalToFetch);
            console.log(animalsTab);
        }));
    });
}
displayAnimalsInfo();
