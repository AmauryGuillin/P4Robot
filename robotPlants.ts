/*
------------PLAN D'ACTION POUR CE ROBOT------------
- Recupérer une liste de tous les animaux avec leur noms latin. ✅
- Créer un objet dans lequel ranger chaque groupe d'informaation sur les animaux ✅
- Faire tourner le robot sur cette liste afain de récupérer chaque animal indépendanment ✅
- Ranger tous les animaux en base de donnée Mongo ✅
- Lancer le robot tous les 1er du mois ❌
---------------------------------------------------
*/

import { plantsLatinNames } from "./Tables/tables.js";
import mongoose from "mongoose";

class PlantObject {
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

const plantSchema = new mongoose.Schema({
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

const plantModel = mongoose.model("Plants", plantSchema);

async function fetchPlants(plantToFetch: string) {
  let url = `https://api.gbif.org/v1/occurrence/search?mediaType=StillImage&q=${plantToFetch}`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      const plants = await response.json();
      if (plants && plants.results && plants.results.length > 0) {
        for (let i: number = 0; i <= plants.results.length; i++) {
          for (let i: number = 0; i <= plants.results.length; i++) {
            const plant = plants.results[i];
            if (
              plant &&
              plant.basisOfRecord != undefined &&
              plant.basisOfRecord === "HUMAN_OBSERVATION"
            ) {
              let currentPlant = createPlantObject(plant);
              await savePlantObject(currentPlant);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error(
      `An error occured when fetching data from the plant named ${plantToFetch} --> ${error}`
    );
  }
}

async function savePlantObject(currentPlant: PlantObject) {
  const currentAnimalStorage = new plantModel({
    basisOfRecord: currentPlant.basisOfRecord,
    scientificName: currentPlant.scientificName,
    kingdom: currentPlant.kingdom,
    phylum: currentPlant.phylum,
    order: currentPlant.order,
    family: currentPlant.family,
    genus: currentPlant.genus,
    species: currentPlant.species,
    genericName: currentPlant.genericName,
    specificEpithet: currentPlant.specificEpithet,
    decimalLongitude: currentPlant.decimalLongitude,
    decimalLatitude: currentPlant.decimalLatitude,
    continent: currentPlant.continent,
    year: currentPlant.year,
    month: currentPlant.month,
    day: currentPlant.day,
    eventDate: currentPlant.eventDate,
    animalImageInfo: currentPlant.animalImageInfo,
    locationCountryName: currentPlant.locationCountryName,
    preciseLocationWithinCountry: currentPlant.preciseLocationWithinCountry,
    animalClass: currentPlant.animalClass,
    country: currentPlant.country,
    taxonId: currentPlant.taxonId,
  });

  await currentAnimalStorage.save();
}

function createPlantObject(plant: any) {
  let currentPlant = new PlantObject();
  (currentPlant.basisOfRecord = plant.basisOfRecord),
    (currentPlant.scientificName = plant.scientificName),
    (currentPlant.kingdom = plant.kingdom),
    (currentPlant.phylum = plant.phylum),
    (currentPlant.order = plant.order),
    (currentPlant.family = plant.family),
    (currentPlant.genus = plant.genus),
    (currentPlant.species = plant.species),
    (currentPlant.genericName = plant.genericName),
    (currentPlant.specificEpithet = plant.specificEpithet),
    (currentPlant.decimalLongitude = plant.decimalLongitude),
    (currentPlant.decimalLatitude = plant.decimalLatitude),
    (currentPlant.continent = plant.continent),
    (currentPlant.year = plant.year),
    (currentPlant.month = plant.month),
    (currentPlant.day = plant.day),
    (currentPlant.eventDate = plant.eventDate),
    (currentPlant.locationCountryName = plant.gadm.level0),
    (currentPlant.preciseLocationWithinCountry = plant.gadm.level3),
    (currentPlant.animalClass = plant.class),
    (currentPlant.country = plant.country),
    (currentPlant.taxonId = plant.taxonID);
  plant.media.forEach((currentImageInfo: string) => {
    currentPlant.animalImageInfo = currentImageInfo;
  });
  return currentPlant;
}

async function displayAnimalsInfo() {
  const date = new Date();
  console.log(`RobotPlants powered ON (${date})`);
  try {
    mongoose.connect("mongodb://127.0.0.1:27017/test");
    for (const plant of plantsLatinNames) {
      await fetchPlants(plant);
    }
    mongoose.disconnect();
  } catch (error) {
    console.error(`An error occured while connecting to MongoDB: ${error}`);
  }
  console.log(`RobotPlants powered OFF (${date})`);
}

displayAnimalsInfo();
