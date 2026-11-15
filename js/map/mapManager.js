(() => {
  'use strict';

  class MapManager {
    constructor(mapContainerId, onSelectCoord, onSelectStation, onSelectFire) {
      this.mapContainerId = mapContainerId || 'worldMap';
      this.map = null;
      this.radarMarker = null;
      this.baseLayer = null;
      this.labelsLayer = null;
      this.lightLayer = null;
      this.fireLayerGroup = null;
      this.currentMode = 'air';
      this.currentTheme = 'dark';
      this.stations = [];
      this.wildfires = [];
      this.onSelectCoord = onSelectCoord;
      this.onSelectStation = onSelectStation;
      this.onSelectFire = onSelectFire;
    }

    init(lat, lng, stations) {
      this.stations = stations || [];
      this.map = L.map(this.mapContainerId, {
        center: [lat, lng],
        zoom: 4,
        minZoom: 2,
        maxZoom: 16,
        zoomControl: false,
        worldCopyJump: true
      });

      this.fireLayerGroup = L.layerGroup().addTo(this.map);
      this.updateLayer();

      // Referans İstasyon Pinleri
      this.stations.forEach(st => {
        const pin = L.marker([st.lat, st.lng], {
          icon: L.divIcon({
            className: '',
            iconSize: [16, 16],
            iconAnchor: [8, 8],
            html: '<div class="station-pin"></div>'
          })
        }).addTo(this.map);

        pin.bindTooltip(st.name, { direction: 'top', className: 'telemetry-tooltip' });
        pin.on('click', e => {
          L.DomEvent.stopPropagation(e);
          if (this.onSelectStation) this.onSelectStation(st.id);
        });
      });

      // Dinamik Taranan Konum Radar İşaretçisi
      this.radarMarker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: '',
          iconSize: [44, 44],
          iconAnchor: [22, 22],
          html: '<div class="radar-marker-wrapper"><div class="radar-ring"></div><div class="radar-core"></div></div>'
        }),
        interactive: false,
        zIndexOffset: 600
      }).addTo(this.map);

      this.map.on('click', e => {
        const clat = Math.min(85, Math.max(-85, e.latlng.lat));
        const clng = ((((e.latlng.lng + 180) % 360) + 360) % 360) - 180;
        if (this.onSelectCoord) this.onSelectCoord(clat, clng);
      });
    }

    setWildfires(fires) {
      this.wildfires = fires || [];
      this.renderWildfireMarkers();
    }

    renderWildfireMarkers() {
      if (!this.fireLayerGroup) return;
      this.fireLayerGroup.clearLayers();
      if (this.currentMode !== 'fire') return;

      this.wildfires.forEach(f => {
        const icon = L.divIcon({
          className: '',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
          html: '<div class="nasa-fire-pin" title="NASA EONET Active Wildfire">🔥</div>'
        });
        const m = L.marker([f.lat, f.lng], { icon }).addTo(this.fireLayerGroup);
        m.bindTooltip(`NASA EONET: ${f.title}`, { direction: 'top', className: 'telemetry-tooltip' });
        m.on('click', e => {
          L.DomEvent.stopPropagation(e);
          if (this.onSelectFire) this.onSelectFire(f);
        });
      });
    }

    setMapMode(mode) {
      this.currentMode = mode;
      this.updateLayer();
      this.renderWildfireMarkers();
    }

    setTheme(theme) {
      this.currentTheme = theme;
      this.updateLayer();
    }

    updateLayer() {
      if (!this.map) return;
      if (this.baseLayer) this.map.removeLayer(this.baseLayer);
      if (this.labelsLayer) this.map.removeLayer(this.labelsLayer);
      if (this.lightLayer) {
        this.map.removeLayer(this.lightLayer);
        this.lightLayer = null;
      }

      // Işık kirliliği modunda gece ışıkları net görünsün diye taban her zaman koyu tutulur
      const isLightTheme = this.currentTheme === 'light' && this.currentMode !== 'light';

      const baseTileUrl = isLightTheme
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
        : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';

      const labelTileUrl = isLightTheme
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}'
        : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}';

      const tileClass = this.currentMode === 'fire' ? 'map-single-color-fire' : 'map-single-color-clean';

      this.baseLayer = L.tileLayer(baseTileUrl, {
        maxZoom: 16,
        className: tileClass,
        attribution: '&copy; Esri &mdash; NASA EIC'
      }).addTo(this.map);

      // IŞIK KİRLİLİĞİ MODU: RESMİ NASA GIBS VIIRS BLACK MARBLE GECE IŞIKLARI
      if (this.currentMode === 'light') {
        this.lightLayer = L.tileLayer(
          'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_CityLights_2012/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg',
          {
            maxNativeZoom: 8,
            maxZoom: 16,
            zIndex: 350,
            className: 'map-tiles-nightlights',
            attribution: '&copy; NASA GIBS VIIRS Black Marble'
          }
        ).addTo(this.map);
      }

      this.labelsLayer = L.tileLayer(labelTileUrl, {
        maxZoom: 16,
        zIndex: 450,
        className: 'map-labels-clean'
      }).addTo(this.map);
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
    invalidate() { if (this.map) setTimeout(() => this.map.invalidateSize(), 60); }
  }

  window.AeroMapManager = MapManager;
})();
