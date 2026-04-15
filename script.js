// 1. Ρύθμιση Χάρτη
var map = L.map('gta-map', { 
    crs: L.CRS.Simple, 
    minZoom: -1.5, 
    maxZoom: 2, 
    zoomControl: false 
});

var bounds = [[-3500, -3000], [5000, 4500]];
L.imageOverlay('icons/map.jpg', bounds).addTo(map); 
map.fitBounds(bounds);

// 2. Groups (Επίπεδα)
var policeGroup = L.layerGroup().addTo(map);
var gangGroup = L.layerGroup().addTo(map);

// 3. Icons (Βεβαιώσου ότι τα αρχεία υπάρχουν στο φάκελο icons/)
var policeIcon = L.icon({ iconUrl: 'icons/police.jpg', iconSize: [28, 28], iconAnchor: [14, 14] });
var hospitalIcon = L.icon({ iconUrl: 'icons/hospital.jpg', iconSize: [28, 28], iconAnchor: [14, 14] });

// 4. Μετατροπή Συντεταγμένων GTA -> Leaflet
function gtaToMap(x, y) { return [y, x]; }

// 5. Λειτουργίες Sidebar & UI
function toggleMenu(id) {
    document.getElementById(id).classList.toggle('active');
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('hidden');
    
    // Ενημέρωση μεγέθους χάρτη μετά το animation
    setTimeout(() => {
        map.invalidateSize(); 
    }, 400);
}

function goToLoc(x, y) {
    map.flyTo(gtaToMap(x, y), 1, { duration: 1.5 });
}

function toggleLayer(checkboxId, layerGroup) {
    var cb = document.getElementById(checkboxId);
    if(cb.checked) {
        map.addLayer(layerGroup);
    } else {
        map.removeLayer(layerGroup);
    }
}

// 6. Προσθήκη Περιοχών (Zones)
function addGangZone(x, y, radius, color, name, desc) {
    L.circle(gtaToMap(x, y), { 
        color: color, 
        fillColor: color, 
        fillOpacity: 0.2, 
        radius: radius 
    }).addTo(gangGroup);

    L.circleMarker(gtaToMap(x, y), { 
        radius: 4, 
        color: '#fff', 
        fillColor: color, 
        fillOpacity: 1 
    }).bindPopup(`<b>${name}</b><br>${desc}`).addTo(gangGroup);
}

// --- ΔΕΔΟΜΕΝΑ (Data) ---
addGangZone(497, -2056, 100, "#a370ff", "Ballas", "Grove St."); 
addGangZone(416, -1736, 100, "#70ff70", "Families", "Forum Dr.");
addGangZone(635, -2120, 100, "#ff8c00", "Vagos", "Rancho.");

L.marker(gtaToMap(705.5, -1419.5), {icon: policeIcon}).bindPopup('Mission Row PD').addTo(policeGroup);
L.marker(gtaToMap(1125, -1772), {icon: hospitalIcon}).bindPopup('Pillbox Hospital').addTo(policeGroup);

// 7. Events (Mouse & Admin)
map.on('mousemove', function(e) {
    document.getElementById('coord-x').innerText = e.latlng.lng.toFixed(0);
    document.getElementById('coord-y').innerText = e.latlng.lat.toFixed(0);
});

map.on('contextmenu', function(e) {
    var x = e.latlng.lng.toFixed(2);
    var y = e.latlng.lat.toFixed(2);
    var markerSnippet = `L.marker(gtaToMap(${x}, ${y}), {icon: policeIcon}).addTo(policeGroup);`;
    var gangSnippet = `addGangZone(${x}, ${y}, 100, "#ff0000", "Name", "Desc");`;

    L.popup().setLatLng(e.latlng).setContent(`
        <div class="admin-popup">
            <strong>🛠️ ADMIN MENU</strong><br>
            Coords: ${x}, ${y}<br>
            <div class="admin-code">${markerSnippet}</div>
            <div class="admin-code">${gangSnippet}</div>
        </div>
    `).openOn(map);
});