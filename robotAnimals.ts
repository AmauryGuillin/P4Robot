/* 
------------PLAN D'ACTION POUR CE ROBOT------------
- Recupérer une liste de tous les animaux avec leur noms latin. ✅
- Créer un objet dans lequel ranger chaque groupe d'informaation sur les animaux ✅
- Faire tourner le robot sur cette liste afain de récupérer chaque animal indépendanment ✅
- Ranger tous les animaux en base de donnée Mongo ✅
- Lancer le robot tous les 1er du mois ❌
---------------------------------------------------
*/

import { animalsLatinNames } from "./Tables/tables.js";
import mongoose, { mongo } from "mongoose";

mongoose.connection.setMaxListeners(0);

class AnimalObject {
  constructor(
    public basisOfRecord?: string,
    public scientificName?: string,
    public kingdom?: string,
    public phylum?: string,
    public order?: string,
    public family?: string,
    public genus?: string,
    public species?: string,
    public genericName?: string,
    public specificEpithet?: string,
    public decimalLongitude?: number,
    public decimalLatitude?: number,
    public continent?: string,
    public year?: number,
    public month?: number,
    public day?: number,
    public eventDate?: string,
    public animalImageInfo?: Object,
    public locationCountryName?: Object,
    public preciseLocationWithinCountry?: Object,
    public animalClass?: string,
    public country?: string,
    public taxonId?: string
  ) {}
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

async function fetchAnimals(animalToFetch: string) {
  let url = `https://api.gbif.org/v1/occurrence/search?mediaType=StillImage&q=${animalToFetch}`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      const animals = await response.json();
      if (animals && animals.results && animals.results.length > 0) {
        for (let i: number = 0; i <= animals.results.length; i++) {
          const animal = animals.results[i];
          if (
            animal &&
            animal.basisOfRecord != undefined &&
            animal.basisOfRecord === "HUMAN_OBSERVATION"
          ) {
            let currentAnimal = createAnimalObject(animal);
            await saveAnimalObject(currentAnimal);
          }
        }
      }
    }
  } catch (error) {
    console.error(
      `An error occured when fetching data from the animal named ${animalToFetch} --> ${error}`
    );
  }
}

async function saveAnimalObject(currentAnimal: AnimalObject) {
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

  await currentAnimalStorage.save();
}

function createAnimalObject(animal: any) {
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
  animal.media.forEach((currentImageInfo: string) => {
    currentAnimal.animalImageInfo = currentImageInfo;
  });
  return currentAnimal;
}

async function displayAnimalsInfo() {
  console.log(`RobotAnimals powered ON`);
  try {
    mongoose.connect("mongodb://127.0.0.1:27017/test");
    for (const animalToFetch of animalsLatinNames) {
      await fetchAnimals(animalToFetch);
    }
    console.log(`RobotAnimals powered OFF`);
    mongoose.disconnect();
  } catch (error) {
    console.error(`An error occurred while connecting to MongoDB: ${error}`);
  }
}

displayAnimalsInfo();
