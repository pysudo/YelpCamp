mapboxgl.accessToken = accessToken;
const map = new mapboxgl.Map({
    container: 'showPageMap',
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

// Map control for navigation 
const navControls = new mapboxgl.NavigationControl({visualizePitch: true});
map.addControl(navControls, 'top-left');

const marker = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h3> ${campground.title} </h3> <p> ${campground.location} </p>`)
    )
    .addTo(map);
