/**
 * AeroJukebox — Leaflet Harita, Radar İşaretçisi ve İstasyon Yöneticisi
 */
(() => {
  'use strict';

  class MapManager {
    constructor(mapContainerId, onSelectCoord, onSelectStation) {
      this.map = null;
      this.radarMarker = null;
      this.onSelectCoord = onSelectCoord;
      this.onSelectStation = onSelectStation;
    }

    init(lat, lng, stations) {
      this.map = L.map('worldMap', {
        center: [lat, lng],
        zoom: 4,
        minZoom: 2,
        maxZoom: 16,
        zoomControl: false,
        worldCopyJump: true
      });

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16,
        attribution: '&copy; Esri &mdash; NASA Space Apps'
      }).addTo(this.map);

      // İstasyon Pinleri
      stations.forEach(st => {
        const pin = L.marker([st.lat, st.lng], {
          icon: L.divIcon({ className: '', iconSize: [12, 12], html: '<div class="station-pin"></div>' })
        }).addTo(this.map);
        pin.bindTooltip(st.name, { direction: 'top', className: 'telemetry-tooltip' });
        pin.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          if (this.onSelectStation) this.onSelectStation(st.id);
        });
      });

      // Dinamik Radar İşaretçisi
      this.radarMarker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: '',
          iconSize: [44, 44],
          iconAnchor: [22, 22],
          html: '<div class="radar-marker-wrapper"><div class="radar-ring"></div><div class="radar-core"></div></div>'
        }),
        interactive: false
      }).addTo(this.map);

      this.map.on('click', e => {
        const clat = Math.min(85, Math.max(-85, e.latlng.lat));
        const clng = ((((e.latlng.lng + 180) % 360) + 360) % 360) - 180;
        if (this.onSelectCoord) this.onSelectCoord(clat, clng);
      });
    }

    flyTo(lat, lng, zoom = 5) {
      if (this.radarMarker) this.radarMarker.setLatLng([lat, lng]);
      if (this.map) this.map.flyTo([lat, lng], zoom, { duration: 0.95 });
    }

    setRadarPosition(lat, lng) {
      if (this.radarMarker) this.radarMarker.setLatLng([lat, lng]);
    }

    zoomIn() { if (this.map) this.map.zoomIn(); }
    zoomOut() { if (this.map) this.map.zoomOut(); }
    resetView() { if (this.map) this.map.setView([24, 15], 2, { animate: true }); }
    invalidate() { if (this.map) setTimeout(() => this.map.invalidateSize(), 50); }
  }

  window.AeroMapManager = MapManager;
})();
