/*
------------PLAN D'ACTION POUR CE ROBOT------------
- Recupérer une liste de tous les animaux avec leur noms latin. ✅
- Créer un objet dans lequel ranger chaque groupe d'informaation sur les animaux ❌
- Faire tourner le robot sur cette liste afain de récupérer chaque animal indépendanment ❌
- Ranger tous les animaux en base de donnée Mongo ❌
- Lancer le robot tous les 1er du mois ❌
---------------------------------------------------
*/

import { plantsLatinNames } from "./Tables/tables.js";

class PlantObject {
  constructor(
    public basisOfRecord: string,
    public scientificName: string,
    public kingdom: string,
    public phylum: string,
    public order: string,
    public family: string,
    public genus: string,
    public species: string,
    public genericName: string,
    public specificEpithet: string,
    public decimalLongitude: number,
    public decimalLatitude: number,
    public continent: string,
    public year: number,
    public month: number,
    public day: number,
    public eventDate: string,
    public animalImageInfo: Object,
    public locationCountryName: Object,
    public preciseLocationWithinCountry: Object,
    public animalClass: string,
    public country: string,
    public taxonId: string
  ) {}
}

const animalsTab: PlantObject[] = [];

async function fetchPlants(animalToFetch: string) {
  let url = `https://api.gbif.org/v1/occurrence/search?mediaType=StillImage&q=${animalToFetch}`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      const plants = await response.json();
      if (plants && plants.results && plants.results.length > 0) {
        for (let i: number = 0; i <= plants.results.length; i++) {
          const plant = plants.results[i];
          let currentPlant = new PlantObject(
            plant.basisOfRecord,
            plant.scientificName,
            plant.kingdom,
            plant.phylum,
            plant.order,
            plant.family,
            plant.genus,
            plant.species,
            plant.genericName,
            plant.specificEpithet,
            plant.decimalLongitude,
            plant.decimalLatitude,
            plant.continent,
            plant.year,
            plant.month,
            plant.day,
            plant.eventDate,
            "",
            plant.gadm.level0,
            plant.gadm.level3,
            plant.class,
            plant.country,
            plant.taxonID
          );

          plant.media.forEach((currentImageInfo: string) => {
            currentPlant.animalImageInfo = currentImageInfo;
          });

          animalsTab.push(currentPlant);
        }
      }
    }
  } catch (error) {
    console.error(
      `An error occured when fetching data from an animal : ${error}`
    );
  }
}

async function displayAnimalsInfo() {
  plantsLatinNames.forEach(async (animalToFetch: string) => {
    await fetchPlants(animalToFetch);
    console.log(animalsTab);
  });
}

displayAnimalsInfo();
