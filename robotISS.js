/*
------------PLAN D'ACTION POUR CE ROBOT------------
- Créer un objet dans lequel ranger mes données ✅
- Récupérer les donées de l'ISS et les ranger dans mon objet ✅
- Stocker mon objet en base de donnée Mongo ✅
- Lancer le robot toutes les 10 minutes ❌
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
import mongoose from "mongoose";
const issLocationSchema = new mongoose.Schema({
    longitude: String,
    latitude: String,
    timestamp: Number,
});
const issLocation = mongoose.model("issLocation", issLocationSchema);
function fetchIssLocation() {
    return __awaiter(this, void 0, void 0, function* () {
        let url = `http://api.open-notify.org/iss-now.json`;
        try {
            const response = yield fetch(url);
            if (response.ok) {
                const location = yield response.json();
                if (location) {
                    yield mongoose.connect("mongodb://127.0.0.1:27017/HamTerro");
                    let currentLocation = new issLocation({
                        longitude: location.iss_position.longitude,
                        latitude: location.iss_position.latitude,
                        timestamp: location.timestamp,
                    });
                    yield currentLocation.save();
                    yield mongoose.disconnect();
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
function displayAPIISSInformation() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`RobotISS powered ON`);
        yield fetchIssLocation();
        console.log(`RobotISS powered OFF`);
    });
}
displayAPIISSInformation();