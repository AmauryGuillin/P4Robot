/* 
------------PLAN D'ACTION POUR CE ROBOT------------
- Créer un objet dans lequel ranger mes données ✅
- Récupérer les donées de l'ISS et les ranger dans mon objet ✅
- Stocker mon objet en base de donnée Mongo ✅
- Lancer le robot toutes les 10 minutes ❌
---------------------------------------------------
*/

import mongoose from "mongoose";
import { IssJsonObject } from "./Interfaces/interfaces.js";

const issLocationSchema = new mongoose.Schema({
  longitude: String,
  latitude: String,
  timestamp: Number,
  date: String,
  hour: String,
});

const issLocation = mongoose.model("issLocation", issLocationSchema);

async function fetchIssLocation() {
  let url = `http://api.open-notify.org/iss-now.json`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      const location: IssJsonObject = await response.json();
      if (location) {
        await mongoose.connect("mongodb://127.0.0.1:27017/HamTerro");
        const timestamp = Number(location.timestamp);
        let date = new Date(timestamp * 1000);
        let dateFormat = `${date.toLocaleDateString()}`;
        let HourFormat = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        let currentLocation = new issLocation({
          longitude: location.iss_position.longitude,
          latitude: location.iss_position.latitude,
          timestamp: location.timestamp,
          date: dateFormat,
          hour: HourFormat,
        });
        await currentLocation.save();
        await mongoose.disconnect();
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function displayAPIISSInformation() {
  console.log(`RobotISS powered ON`);
  await fetchIssLocation();
  console.log(`RobotISS powered OFF`);
}

displayAPIISSInformation();
