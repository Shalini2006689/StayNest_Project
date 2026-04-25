// const mapContainer = document.getElementById("map");

// if (
//   mapContainer &&
//   typeof maptilersdk !== "undefined" &&
//   typeof mapToken !== "undefined" &&
//   Array.isArray(coordinates)
// ) {
//   maptilersdk.config.apiKey = mapToken;

//   const map = new maptilersdk.Map({
//     container: "map",
//     style: maptilersdk.MapStyle.STREETS,
//     center: coordinates,
//     zoom: 9,
//   });

//   new maptilersdk.Marker({ color: "#fe424d" })
//     .setLngLat(coordinates)
//     .addTo(map);
// }