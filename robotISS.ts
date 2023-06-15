/* 
------------PLAN D'ACTION POUR CE ROBOT------------
- Créer un objet dans lequel ranger mes données ✅
- Récupérer les donées de l'ISS et les ranger dans mon objet ✅
- Stocker mon objet en base de donnée Mongo ❌
- Lancer le robot toutes les 5 minutes ❌
---------------------------------------------------
*/

import { IssJsonObject } from "./Interfaces/interfaces.js";

class IssLocationObject {
  constructor(
    public longitude: string,
    public latitude: string,
    public time: number
  ) {}
}

var issLocationArray: IssLocationObject[] = [];

async function fetchIssLocation() {
  let url = `http://api.open-notify.org/iss-now.json`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      const location: IssJsonObject = await response.json();
      if (location) {
        let currentLocation = new IssLocationObject("", "", 0);
        currentLocation.longitude = location.iss_position.longitude;
        currentLocation.latitude = location.iss_position.latitude;
        currentLocation.time = location.timestamp;
        issLocationArray.push(currentLocation);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function displayAPIISSInformation() {
  await fetchIssLocation();
  console.log(issLocationArray);
}

displayAPIISSInformation();
