mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/streets-v12', // style URL
	center: coordinates[0].split(","), // starting position [lng, lat]
	zoom: 9, // starting zoom
});


map.addControl(new mapboxgl.NavigationControl(), 'top-right');

new mapboxgl.Marker({color:"#FF385C"})
  .setLngLat(coordinates[0].split(","))
  .setPopup(new mapboxgl.Popup({offset:25}).setHTML(`<h3>${title}</h3><p>Exact location after booking</p>`))
  .addTo(map);