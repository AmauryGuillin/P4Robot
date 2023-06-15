var issLocation = [];
var time = 0;
var timeRange = 5000;
//var periodicTraitement = setInterval(delayer, timeRange);

class issLocationObject {
  constructor(latitude, longitude, time) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.time = time;
  }
}

async function fetchIssLocation() {
  let url = `http://api.open-notify.org/iss-now.json`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      let location = await response.json();
      if (location) {
        let currentLocation = new issLocationObject();
        currentLocation.longitude = location.iss_position.longitude;
        currentLocation.latitude = location.iss_position.latitude;
        currentLocation.time = location.timestamp;
        issLocation.push(currentLocation);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function displayAPIInformation() {
  await fetchIssLocation();
  console.log(issLocation);
}

// function delayer() {
//   time++;
//   console.log(`Robot is working ! This is the call n°${time}`);
//   displayAPIInformation();
//   if (time >= 5) {
//     {
//       clearInterval(periodicTraitement);
//       process.exit();
//     }
//     console.log(
//       "**************************fin du process**************************"
//     );
//     console.log(
//       `******************** Resultat : ${JSON.stringify(issLocation)}`
//     );
//   }
// }

displayAPIInformation();
