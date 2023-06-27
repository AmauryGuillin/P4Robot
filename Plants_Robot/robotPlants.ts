/*
------------PLAN D'ACTION POUR CE ROBOT------------
- Recupérer une liste de tous les animaux avec leur noms latin. ✅
- Créer un objet dans lequel ranger chaque groupe d'informaation sur les animaux ✅
- Faire tourner le robot sur cette liste afain de récupérer chaque animal indépendanment ✅
- Ranger tous les animaux en base de donnée Mongo ✅
- Lancer le robot tous les 1er du mois ❌
---------------------------------------------------
*/

import { plantsLatinNames } from "../Tables/tables.js";
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
const fetchingLimit = 10000;

async function fetchPlants(plantToFetch: string) {
  let url = `https://api.gbif.org/v1/occurrence/search?mediaType=StillImage&q=${plantToFetch}&limit=${fetchingLimit}`;
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
              const existingPlantItem = await plantModel.findOne({
                scientificName: plant.scientificName,
                eventDate: plant.eventDate,
              });
              let currentPlant = createPlantObject(plant);
              if (existingPlantItem) {
                await saveAnExistingPlant(existingPlantItem, currentPlant);
                console.log(`Plant "${plant.scientificName}" has been updated`);
              } else {
                await savePlantObject(currentPlant);
                console.log(`Plant "${plant.scientificName}" has been added`);
              }
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

async function saveAnExistingPlant(
  existingPlantItem: mongoose.Document<
    unknown,
    {},
    {
      basisOfRecord?: string | undefined;
      scientificName?: string | undefined;
      kingdom?: string | undefined;
      phylum?: string | undefined;
      order?: string | undefined;
      family?: string | undefined;
      genus?: string | undefined;
      species?: string | undefined;
      genericName?: string | undefined;
      specificEpithet?: string | undefined;
      decimalLongitude?: number | undefined;
      decimalLatitude?: number | undefined;
      continent?: string | undefined;
      year?: number | undefined;
      month?: number | undefined;
      day?: number | undefined;
      eventDate?: string | undefined;
      animalImageInfo?: any;
      locationCountryName?: any;
      preciseLocationWithinCountry?: any;
      animalClass?: string | undefined;
      country?: string | undefined;
      taxonId?: string | undefined;
    }
  > &
    Omit<
      {
        basisOfRecord?: string | undefined;
        scientificName?: string | undefined;
        kingdom?: string | undefined;
        phylum?: string | undefined;
        order?: string | undefined;
        family?: string | undefined;
        genus?: string | undefined;
        species?: string | undefined;
        genericName?: string | undefined;
        specificEpithet?: string | undefined;
        decimalLongitude?: number | undefined;
        decimalLatitude?: number | undefined;
        continent?: string | undefined;
        year?: number | undefined;
        month?: number | undefined;
        day?: number | undefined;
        eventDate?: string | undefined;
        animalImageInfo?: any;
        locationCountryName?: any;
        preciseLocationWithinCountry?: any;
        animalClass?: string | undefined;
        country?: string | undefined;
        taxonId?: string | undefined;
      } & { _id: mongoose.Types.ObjectId },
      never
    >,
  currentPlant: PlantObject
) {
  existingPlantItem.basisOfRecord = currentPlant.basisOfRecord;
  existingPlantItem.scientificName = currentPlant.scientificName;
  existingPlantItem.kingdom = currentPlant.kingdom;
  existingPlantItem.phylum = currentPlant.phylum;
  existingPlantItem.order = currentPlant.order;
  existingPlantItem.family = currentPlant.family;
  existingPlantItem.genus = currentPlant.genus;
  existingPlantItem.genericName = currentPlant.genericName;
  existingPlantItem.specificEpithet = currentPlant.specificEpithet;
  existingPlantItem.decimalLatitude = currentPlant.decimalLatitude;
  existingPlantItem.decimalLongitude = currentPlant.decimalLongitude;
  existingPlantItem.continent = currentPlant.continent;
  existingPlantItem.year = currentPlant.year;
  existingPlantItem.month = currentPlant.month;
  existingPlantItem.day = currentPlant.day;
  existingPlantItem.eventDate = currentPlant.eventDate;
  existingPlantItem.animalImageInfo = currentPlant.animalImageInfo;
  existingPlantItem.locationCountryName = currentPlant.locationCountryName;
  existingPlantItem.preciseLocationWithinCountry =
    currentPlant.preciseLocationWithinCountry;
  existingPlantItem.animalClass = currentPlant.animalClass;
  existingPlantItem.country = currentPlant.country;
  existingPlantItem.taxonId = currentPlant.taxonId;
  await existingPlantItem.save();
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
