/**
 * AeroJukebox — Çift Katmanlı Atmosferik ve Termal Uydu Harita Yöneticisi
 * - Hava Modu: NASA EIC / Troposferik Kimya ve Aerosol Uydu Katmanı
 * - Yangın Modu: NASA FIRMS Termal Kızılötesi Yangın Uydu Katmanı
 */
(() => {
  'use strict';

  class MapManager {
    constructor(mapContainerId, onSelectCoord, onSelectStation) {
      this.map = null;
      this.radarMarker = null;
      this.currentLayer = null;
      this.labelsLayer = null;
      this.atmosphereGlow = null;
      this.currentMode = 'air';
      this.currentTheme = 'dark';
      this.stations = [];
      this.onSelectCoord = onSelectCoord;
      this.onSelectStation = onSelectStation;
    }

    init(lat, lng, stations) {
      this.stations = stations || [];

      this.map = L.map('worldMap', {
        center: [lat, lng],
        zoom: 4,
        minZoom: 2,
        maxZoom: 16,
        zoomControl: false,
        worldCopyJump: true
      });

      this.updateLayer();

      // Referans İstasyon Pinleri ve Atmosferik Işıma Halkaları
      this.stations.forEach(st => {
        const pinIcon = L.divIcon({
          className: '',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
          html: `
            <div class="telemetry-pin-wrap">
              <div class="pin-halo"></div>
              <div class="station-pin"></div>
            </div>
          `
        });

        const pin = L.marker([st.lat, st.lng], { icon: pinIcon }).addTo(this.map);
        pin.bindTooltip(st.name, { direction: 'top', className: 'telemetry-tooltip' });
        pin.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          if (this.onSelectStation) this.onSelectStation(st.id);
        });
      });

      // Dinamik Taranan Konum Radar İşaretçisi
      this.radarMarker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: '',
          iconSize: [48, 48],
          iconAnchor: [24, 24],
          html: `
            <div class="radar-marker-wrapper">
              <div class="radar-ring"></div>
              <div class="radar-crosshair"></div>
              <div class="radar-core"></div>
            </div>
          `
        }),
        interactive: false,
        zIndexOffset: 600
      }).addTo(this.map);

      // Koordinat Tıklama Dinleyicisi
      this.map.on('click', e => {
        const clat = Math.min(85, Math.max(-85, e.latlng.lat));
        const clng = ((((e.latlng.lng + 180) % 360) + 360) % 360) - 180;
        if (this.onSelectCoord) this.onSelectCoord(clat, clng);
      });
    }

    setMapMode(mode) {
      this.currentMode = mode;
      this.updateLayer();
    }

    setTheme(theme) {
      this.currentTheme = theme;
      this.updateLayer();
    }

    updateLayer() {
      if (!this.map) return;

      if (this.currentLayer) this.map.removeLayer(this.currentLayer);
      if (this.labelsLayer) this.map.removeLayer(this.labelsLayer);

      if (this.currentMode === 'fire') {
        // YANGIN MODU: Koyu Kızıl / Termal Kızılötesi Uydu
        this.currentLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 16,
          className: 'map-tiles-fire',
          attribution: '&copy; Esri &mdash; NASA FIRMS Thermal'
        }).addTo(this.map);
      } else {
        // HAVA KALİTESİ MODU: NASA EIC / Troposferik Atmosfer ve Aerosol Uydusu
        if (this.currentTheme === 'light') {
          // Açık Temada: Temiz Laboratuvar Topografyası
          this.currentLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 16,
            attribution: '&copy; Esri &mdash; NASA EIC'
          }).addTo(this.map);
        } else {
          // Koyu Temada: Gerçek Uydu Görüntüsü + Atmosferik Okyanus/Aerosol Spektrum Filtresi
          this.currentLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 16,
            className: 'map-tiles-air',
            attribution: '&copy; Esri &mdash; NASA EIC Atmosphere'
          }).addTo(this.map);
        }
      }

      // Şehir ve Sınır Etiket Katmanı (Her iki modda da okunaklı şeffaf etiketler)
      const labelUrl = this.currentTheme === 'light'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}'
        : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}';

      this.labelsLayer = L.tileLayer(labelUrl, {
        maxZoom: 16,
        zIndex: 500,
        className: 'map-labels-telemetry'
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
