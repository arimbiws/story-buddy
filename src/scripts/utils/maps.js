import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Set default icon untuk Leaflet
const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

const renderMap = (stories = []) => {
  const mapContainer = document.getElementById("map");
  if (!mapContainer) return;

  // Reset jika sudah ada map sebelumnya
  if (mapContainer._leaflet_id) {
    mapContainer._leaflet_id = null;
  }

  // Inisialisasi map
  const map = L.map("map").setView([-2.5489, 118.0149], 5);

  const defaultLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
  const satellite = L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png");

  defaultLayer.addTo(map);
  // L.control.layers({ Default: defaultLayer, Satellite: satellite }).addTo(map);

  // Tambahkan marker untuk setiap story
  const markers = [];

  const storyLayer = L.layerGroup();
  stories.forEach((story) => {
    if (story.lat && story.lon) {
      const marker = L.marker([story.lat, story.lon]);
      marker.bindPopup(`<b>${story.name}</b><br>${story.description}`);
      storyLayer.addLayer(marker);
      markers.push([story.lat, story.lon]);
    }
  });

  storyLayer.addTo(map);

  L.control.layers({ Default: defaultLayer, Satellite: satellite }, { "Lokasi Cerita": storyLayer }).addTo(map);

  if (markers.length > 0) {
    map.fitBounds(markers);
  }

  window.focusStoryOnMap = (lat, lon, name) => {
    map.setView([lat, lon], 10, { animate: true });
    L.popup().setLatLng([lat, lon]).setContent(`<b>${name}</b>`).openOn(map);
  };

  return map;
};

export default renderMap;
