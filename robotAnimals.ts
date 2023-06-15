/* 
------------PLAN D'ACTION POUR CE ROBOT------------
- Recupérer une liste de tous les animaux avec leur noms latin. ✅
- Créer un objet dans lequel ranger chaque groupe d'informaation sur les animaux ❌
- Faire tourner le robot sur cette liste afain de récupérer chaque animal indépendanment ❌
- Ranger tous les animaux en base de donnée Mongo ❌
- Lancer le robot tous les 1er du mois ❌
---------------------------------------------------
*/

import { animalsLatinNames } from "./Tables/tables.js";

class AnimalObject {
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

const animalsTab: AnimalObject[] = [];

async function fetchAnimals(animalToFetch: string) {
  let url = `https://api.gbif.org/v1/occurrence/search?mediaType=StillImage&q=${animalToFetch}`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      const animals = await response.json();
      if (animals && animals.results && animals.results.length > 0) {
        for (let i: number = 0; i <= animals.results.length; i++) {
          const animal = animals.results[i];
          let currentAnimal = new AnimalObject(
            animal.basisOfRecord,
            animal.scientificName,
            animal.kingdom,
            animal.phylum,
            animal.order,
            animal.family,
            animal.genus,
            animal.species,
            animal.genericName,
            animal.specificEpithet,
            animal.decimalLongitude,
            animal.decimalLatitude,
            animal.continent,
            animal.year,
            animal.month,
            animal.day,
            animal.eventDate,
            "",
            animal.gadm.level0,
            animal.gadm.level3,
            animal.class,
            animal.country,
            animal.taxonID
          );

          animal.media.forEach((currentImageInfo: string) => {
            currentAnimal.animalImageInfo = currentImageInfo;
          });

          animalsTab.push(currentAnimal);
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
  animalsLatinNames.forEach(async (animalToFetch: string) => {
    await fetchAnimals(animalToFetch);
    console.log(animalsTab);
  });
}

displayAnimalsInfo();
