let citys = [];
let firstCity;
const urlLocation = (location, codePostal) => {
  let url = `https://api-adresse.data.gouv.fr/search/?q=${location}&postcode=${codePostal}`;

  fetch(url)
    .then((response) =>
      response.json().then((data) => {
        console.log(data);
        document.querySelector("#address").textContent = data.query;
        document.querySelector("#postalCode").textContent =
          data.filters.postcode;
        document.querySelector("#city").textContent =
          data.features[0].properties.city;
        document.querySelector("#street").textContent =
          data.features[0].properties.street;
        document.querySelector("#region").textContent =
          data.features[0].properties.context;
        let lat = data.features[0].geometry.coordinates[1];
        let lon = data.features[0].geometry.coordinates[0];
        initMap([lat, lon]);
        if (citys.length >= 2) {
          const distance = Math.sqrt(
            (citys[0][0] - citys[0][1]) ** 2 + (citys[1][0] - citys[1][1]) ** 2
          );
          document.querySelector(
            "#distance"
          ).textContent = `The distance as the crow flies is ${Math.floor(
            distance
          )}km`;
        }
      })
    )
    .catch((error) => console.log("Error : " + error));
};

const searchAddress = document.querySelector("#searchAddress");
const searchPostalCode = document.querySelector("#searchPostalCode");
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  urlLocation(searchAddress.value, searchPostalCode.value);
  searchAddress.value = "";
  searchPostalCode.value = "";
});

let myCard;
let marker;
function initMap(coor) {
  if (myCard) {
    myCard.setView(coor, 11);
    marker = L.marker(coor).addTo(myCard);
    citys.push(coor);
  } else {
    myCard = L.map("map").setView(coor, 11);
    L.tileLayer("https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png", {
      attribution:
        'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
      minZoom: 1,
      maxZoom: 20,
    }).addTo(myCard);
    marker = L.marker(coor).addTo(myCard);
    citys.push(coor);
  }
}
