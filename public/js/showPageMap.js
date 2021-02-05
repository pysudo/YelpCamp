mapboxgl.accessToken = accessToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

const marker = new mapboxgl.Marker()
    .setLngLat(coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25, draggable: true })
            .setHTML("<h3><%= campground.title %></h3><p><%= campground.location %></p>")
    )
    .addTo(map);
