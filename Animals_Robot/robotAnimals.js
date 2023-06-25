/*
------------PLAN D'ACTION POUR CE ROBOT------------
- Recupérer une liste de tous les animaux avec leur noms latin. ✅
- Créer un objet dans lequel ranger chaque groupe d'informaation sur les animaux ✅
- Faire tourner le robot sur cette liste afain de récupérer chaque animal indépendanment ✅
- Ranger tous les animaux en base de donnée Mongo ✅
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
import { animalsLatinNames } from "../Tables/tables.js";
import mongoose from "mongoose";
mongoose.connection.setMaxListeners(0);
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
const animalSchema = new mongoose.Schema({
    basisOfRecord: String,
    scientificName: String,
    kingdom: String,
    phylum: String,
    order: String,
    family: String,
    genus: String,
    species: String,
    genericName: String,
    specificEpithet: String,
    decimalLongitude: Number,
    decimalLatitude: Number,
    continent: String,
    year: Number,
    month: Number,
    day: Number,
    eventDate: String,
    animalImageInfo: Object,
    locationCountryName: Object,
    preciseLocationWithinCountry: Object,
    animalClass: String,
    country: String,
    taxonId: String,
});
const animalModel = mongoose.model("Animals", animalSchema);
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
                        if (animal &&
                            animal.basisOfRecord != undefined &&
                            animal.basisOfRecord === "HUMAN_OBSERVATION") {
                            const existingAnimalItem = yield animalModel.findOne({
                                scientificName: animal.scientificName,
                            });
                            let currentAnimal = createAnimalObject(animal);
                            if (existingAnimalItem) {
                                yield saveAnExistingAnimal(existingAnimalItem, currentAnimal);
                                console.log(`Animal "${animal.scientificName}" has been updated`);
                            }
                            else {
                                yield saveAnimalObject(currentAnimal);
                                console.log(`Animal "${animal.scientificName}" has been added`);
                            }
                        }
                    }
                }
            }
        }
        catch (error) {
            console.error(`An error occured when fetching data from the animal named ${animalToFetch} --> ${error}`);
        }
    });
}
function saveAnExistingAnimal(existingAnimalItem, currentAnimal) {
    return __awaiter(this, void 0, void 0, function* () {
        existingAnimalItem.basisOfRecord = currentAnimal.basisOfRecord;
        existingAnimalItem.scientificName = currentAnimal.scientificName;
        existingAnimalItem.kingdom = currentAnimal.kingdom;
        existingAnimalItem.phylum = currentAnimal.phylum;
        existingAnimalItem.order = currentAnimal.order;
        existingAnimalItem.family = currentAnimal.family;
        existingAnimalItem.genus = currentAnimal.genus;
        existingAnimalItem.genericName = currentAnimal.genericName;
        existingAnimalItem.specificEpithet = currentAnimal.specificEpithet;
        existingAnimalItem.decimalLatitude = currentAnimal.decimalLatitude;
        existingAnimalItem.decimalLongitude = currentAnimal.decimalLongitude;
        existingAnimalItem.continent = currentAnimal.continent;
        existingAnimalItem.year = currentAnimal.year;
        existingAnimalItem.month = currentAnimal.month;
        existingAnimalItem.day = currentAnimal.day;
        existingAnimalItem.eventDate = currentAnimal.eventDate;
        existingAnimalItem.animalImageInfo = currentAnimal.animalImageInfo;
        existingAnimalItem.locationCountryName = currentAnimal.locationCountryName;
        existingAnimalItem.preciseLocationWithinCountry =
            currentAnimal.preciseLocationWithinCountry;
        existingAnimalItem.animalClass = currentAnimal.animalClass;
        existingAnimalItem.country = currentAnimal.country;
        existingAnimalItem.taxonId = currentAnimal.taxonId;
        yield existingAnimalItem.save();
    });
}
function saveAnimalObject(currentAnimal) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentAnimalStorage = new animalModel({
            basisOfRecord: currentAnimal.basisOfRecord,
            scientificName: currentAnimal.scientificName,
            kingdom: currentAnimal.kingdom,
            phylum: currentAnimal.phylum,
            order: currentAnimal.order,
            family: currentAnimal.family,
            genus: currentAnimal.genus,
            species: currentAnimal.species,
            genericName: currentAnimal.genericName,
            specificEpithet: currentAnimal.specificEpithet,
            decimalLongitude: currentAnimal.decimalLongitude,
            decimalLatitude: currentAnimal.decimalLatitude,
            continent: currentAnimal.continent,
            year: currentAnimal.year,
            month: currentAnimal.month,
            day: currentAnimal.day,
            eventDate: currentAnimal.eventDate,
            animalImageInfo: currentAnimal.animalImageInfo,
            locationCountryName: currentAnimal.locationCountryName,
            preciseLocationWithinCountry: currentAnimal.preciseLocationWithinCountry,
            animalClass: currentAnimal.animalClass,
            country: currentAnimal.country,
            taxonId: currentAnimal.taxonId,
        });
        yield currentAnimalStorage.save();
    });
}
function createAnimalObject(animal) {
    let currentAnimal = new AnimalObject();
    (currentAnimal.basisOfRecord = animal.basisOfRecord),
        (currentAnimal.scientificName = animal.scientificName),
        (currentAnimal.kingdom = animal.kingdom),
        (currentAnimal.phylum = animal.phylum),
        (currentAnimal.order = animal.order),
        (currentAnimal.family = animal.family),
        (currentAnimal.genus = animal.genus),
        (currentAnimal.species = animal.species),
        (currentAnimal.genericName = animal.genericName),
        (currentAnimal.specificEpithet = animal.specificEpithet),
        (currentAnimal.decimalLongitude = animal.decimalLongitude),
        (currentAnimal.decimalLatitude = animal.decimalLatitude),
        (currentAnimal.continent = animal.continent),
        (currentAnimal.year = animal.year),
        (currentAnimal.month = animal.month),
        (currentAnimal.day = animal.day),
        (currentAnimal.eventDate = animal.eventDate),
        (currentAnimal.locationCountryName = animal.gadm.level0),
        (currentAnimal.preciseLocationWithinCountry = animal.gadm.level3),
        (currentAnimal.animalClass = animal.class),
        (currentAnimal.country = animal.country),
        (currentAnimal.taxonId = animal.taxonID);
    animal.media.forEach((currentImageInfo) => {
        currentAnimal.animalImageInfo = currentImageInfo;
    });
    return currentAnimal;
}
function displayAnimalsInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const date = new Date();
        console.log(`RobotAnimals powered ON (${date})`);
        try {
            mongoose.connect("mongodb://127.0.0.1:27017/test");
            for (const animalToFetch of animalsLatinNames) {
                yield fetchAnimals(animalToFetch);
            }
            mongoose.disconnect();
        }
        catch (error) {
            console.error(`An error occurred while connecting to MongoDB: ${error}`);
        }
        console.log(`RobotAnimals powered OFF (${date})`);
    });
}
displayAnimalsInfo();
