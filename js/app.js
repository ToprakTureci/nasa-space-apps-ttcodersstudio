/**
 * AeroJukebox — Ana Kontrol ve Orkestrasyon Modülü
 */
(() => {
  'use strict';

  const STATIONS = [
    { id: 'reykjavik', name: 'İzlanda - Reykjavik', shortName: 'Reykjavik, İzlanda', region: 'KUZEY ATLANTİK REFERANS', lat: 64.1466, lng: -21.9426, fallback: { pm25: 4.1, pm10: 8.6, no2: 5.2, o3: 54.0, eaqi: 16 } },
    { id: 'amazon', name: 'Amazon Havzası', shortName: 'Amazon Havzası, Brezilya', region: 'BİYOSFER KARBON YUTAĞI', lat: -3.4653, lng: -62.2159, fallback: { pm25: 5.4, pm10: 9.8, no2: 2.8, o3: 32.0, eaqi: 18 } },
    { id: 'denizli', name: 'Denizli - Türkiye', shortName: 'Denizli, Türkiye', region: 'ANADOLU TELEMETRİ MERKEZİ', lat: 37.7765, lng: 29.0864, fallback: { pm25: 13.8, pm10: 25.4, no2: 18.6, o3: 68.0, eaqi: 36 } },
    { id: 'tokyo', name: 'Tokyo - Japonya', shortName: 'Tokyo, Japonya', region: 'PASİFİK METROPOL KUŞAĞI', lat: 35.6762, lng: 139.6503, fallback: { pm25: 19.6, pm10: 34.2, no2: 36.4, o3: 74.0, eaqi: 54 } },
    { id: 'delhi', name: 'Yeni Delhi - Hindistan', shortName: 'Yeni Delhi, Hindistan', region: 'YÜKSEK AEROSOL YOĞUNLUĞU', lat: 28.6139, lng: 77.2090, fallback: { pm25: 112.4, pm10: 186.0, no2: 64.8, o3: 92.0, eaqi: 118 } }
  ];

  const RANDOM_POINTS = [
    { name: 'Zürih, İsviçre', region: 'ALP İKLİM KUŞAĞI', lat: 47.3769, lng: 8.5417 },
    { name: 'Kahire, Mısır', region: 'SAHRA TOZ KORİDORU', lat: 30.0444, lng: 31.2357 },
    { name: 'Santiago, Şili', region: 'AND HAVZASI', lat: -33.4489, lng: -70.6693 },
    { name: 'Oslo, Norveç', region: 'İSKANDİNAVYA GÖZLEM', lat: 59.9139, lng: 10.7522 },
    { name: 'Seul, Güney Kore', region: 'DOĞU ASYA İSTASYONU', lat: 37.5665, lng: 126.9780 }
  ];

  const state = {
    lat: 37.7765,
    lng: 29.0864,
    locationName: 'Denizli, Türkiye',
    locationRegion: 'ANADOLU TELEMETRİ MERKEZİ',
    activeStationId: 'denizli',
    timelineYear: 2026,
    liveMetrics: { pm25: 13.8, pm10: 25.4, no2: 18.6, o3: 68.0, eaqi: 36, aqi: 55 },
    activeMetrics: { pm25: 13.8, pm10: 25.4, no2: 18.6, o3: 68.0, eaqi: 36, aqi: 55 },
    dataSource: 'OPEN-METEO UYDU VERİSİ',
    isPlaying: false,
    isMuted: false,
    volume: 0.72,
    voiceEnabled: false,
    stage: 'good',
    reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };

  const dom = {
    tabMonitor: document.getElementById('tabMonitor'),
    tabTeam: document.getElementById('tabTeam'),
    teamView: document.getElementById('teamView'),
    closeTeamBtn: document.getElementById('closeTeamBtn'),
    voiceToggleBtn: document.getElementById('voiceToggleBtn'),
    voiceToggleState: document.getElementById('voiceToggleState'),
    contrastBtn: document.getElementById('contrastBtn'),
    searchForm: document.getElementById('searchForm'),
    citySearchInput: document.getElementById('citySearchInput'),
    mapCoordReadout: document.getElementById('mapCoordReadout'),
    zoomInBtn: document.getElementById('zoomInBtn'),
    zoomOutBtn: document.getElementById('zoomOutBtn'),
    resetMapBtn: document.getElementById('resetMapBtn'),
    timelineSlider: document.getElementById('timelineSlider'),
    timelineYearBadge: document.getElementById('timelineYearBadge'),
    timelineModeLabel: document.getElementById('timelineModeLabel'),
    timelineDeltaBadge: document.getElementById('timelineDeltaBadge'),
    eraTicks: document.querySelectorAll('.era-tick'),
    presetBtns: document.querySelectorAll('.preset-btn'),
    locationName: document.getElementById('locationName'),
    locationRegion: document.getElementById('locationRegion'),
    locationCoords: document.getElementById('locationCoords'),
    dataSourceBadge: document.getElementById('dataSourceBadge'),
    aqiValue: document.getElementById('aqiValue'),
    aqiCategory: document.getElementById('aqiCategory'),
    aqiMeterFill: document.getElementById('aqiMeterFill'),
    aqiSubMetric: document.getElementById('aqiSubMetric'),
    biosphereStageLabel: document.getElementById('biosphereStageLabel'),
    biosphereStageDesc: document.getElementById('biosphereStageDesc'),
    biosphereCanvas: document.getElementById('biosphereCanvas'),
    valPm25: document.getElementById('valPm25'),
    barPm25: document.getElementById('barPm25'),
    valPm10: document.getElementById('valPm10'),
    barPm10: document.getElementById('barPm10'),
    valNo2: document.getElementById('valNo2'),
    barNo2: document.getElementById('barNo2'),
    valO3: document.getElementById('valO3'),
    barO3: document.getElementById('barO3'),
    playPauseBtn: document.getElementById('playPauseBtn'),
    playIcon: document.getElementById('playIcon'),
    pauseIcon: document.getElementById('pauseIcon'),
    playBtnLabel: document.getElementById('playBtnLabel'),
    prevStationBtn: document.getElementById('prevStationBtn'),
    nextStationBtn: document.getElementById('nextStationBtn'),
    randomLocBtn: document.getElementById('randomLocBtn'),
    jukeboxTitle: document.getElementById('jukeboxTitle'),
    jukeboxStatus: document.getElementById('jukeboxStatus'),
    sonificationModeText: document.getElementById('sonificationModeText'),
    visualizerCanvas: document.getElementById('visualizerCanvas'),
    muteBtn: document.getElementById('muteBtn'),
    volHighIcon: document.getElementById('volHighIcon'),
    volMuteIcon: document.getElementById('volMuteIcon'),
    volumeSlider: document.getElementById('volumeSlider'),
    volumeValue: document.getElementById('volumeValue'),
    shortcutsBtn: document.getElementById('shortcutsBtn'),
    shortcutsModal: document.getElementById('shortcutsModal'),
    closeShortcutsBtn: document.getElementById('closeShortcutsBtn')
  };

  // Modül Örnekleri
  const treeRenderer = new window.AeroTreeRenderer();
  const particleSystem = new window.AeroParticleSystem();
  const audioEngine = new window.AeroAudioEngine();
  let mapManager = null;

  function formatCoords(lat, lng) {
    const latH = lat >= 0 ? 'N' : 'S';
    const lngH = lng >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(4)}° ${latH}, ${Math.abs(lng).toFixed(4)}° ${lngH}`;
  }

  function speakTelemetry() {
    if (!state.voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const m = state.activeMetrics;
    const info = window.AeroTelemetryApi.classifyAqi(m.aqi);
    const text = `${state.locationName}. Hava Kalitesi İndeksi ${m.aqi}. Durum: ${info.label}. PM 2.5 değeri ${m.pm25}. ${info.desc}`;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'tr-TR';
    window.speechSynthesis.speak(u);
  }

  function renderTelemetry() {
    const m = state.activeMetrics;
    const info = window.AeroTelemetryApi.classifyAqi(m.aqi);
    state.stage = info.stage;

    document.documentElement.style.setProperty('--aqi-color', info.color);

    const coordStr = formatCoords(state.lat, state.lng);
    dom.mapCoordReadout.textContent = coordStr;
    dom.locationCoords.textContent = coordStr;
    dom.locationName.textContent = state.locationName;
    dom.locationRegion.textContent = state.locationRegion;
    dom.dataSourceBadge.textContent = state.timelineYear < 2026 ? `TARİHSEL MODEL // ${state.timelineYear}` : state.dataSource;

    dom.aqiValue.textContent = m.aqi;
    dom.aqiCategory.textContent = info.label;
    dom.aqiSubMetric.textContent = `European AQI: ${m.eaqi}`;
    dom.aqiMeterFill.style.width = `${Math.min(100, Math.max(6, (m.aqi / 220) * 100))}%`;

    dom.biosphereStageLabel.textContent = info.badge;
    dom.biosphereStageDesc.textContent = info.desc;

    dom.valPm25.textContent = m.pm25.toFixed(1);
    dom.barPm25.style.width = `${Math.min(100, (m.pm25 / 150) * 100)}%`;
    dom.valPm10.textContent = m.pm10.toFixed(1);
    dom.barPm10.style.width = `${Math.min(100, (m.pm10 / 220) * 100)}%`;
    dom.valNo2.textContent = m.no2.toFixed(1);
    dom.barNo2.style.width = `${Math.min(100, (m.no2 / 100) * 100)}%`;
    dom.valO3.textContent = m.o3.toFixed(1);
    dom.barO3.style.width = `${Math.min(100, (m.o3 / 140) * 100)}%`;

    dom.jukeboxTitle.textContent = state.locationName;
    dom.jukeboxStatus.textContent = `AQI ${m.aqi} • ${info.label}`;
    dom.sonificationModeText.textContent = state.isPlaying
      ? `AKTİF // ${info.synthTag}`
      : `HAZIR // ${info.synthTag}`;

    audioEngine.updateSonification(m, state.stage, state.isMuted, state.volume);
  }

  function applyTimelineAndRender(speak = false) {
    const year = state.timelineYear;
    dom.timelineYearBadge.textContent = year;
    dom.timelineSlider.value = year;

    dom.eraTicks.forEach(tick => {
      tick.classList.toggle('active', Number(tick.dataset.year) === year);
    });

    const { metrics, deltaPm25 } = window.AeroTelemetryApi.calculateHistorical(state.liveMetrics, year, state.lat);
    state.activeMetrics = metrics;

    if (year >= 2026) {
      dom.timelineModeLabel.textContent = 'Güncel Uydu Verisi (2026)';
      dom.timelineDeltaBadge.classList.add('hidden');
    } else {
      dom.timelineModeLabel.textContent = `Tarihsel Atmosfer Simülasyonu (${year})`;
      dom.timelineDeltaBadge.textContent = `PM2.5 ${deltaPm25}%`;
      dom.timelineDeltaBadge.classList.remove('hidden');
    }

    renderTelemetry();
    if (speak) speakTelemetry();
  }

  async function selectPresetStation(stationId) {
    const station = STATIONS.find(s => s.id === stationId);
    if (!station) return;
    state.activeStationId = stationId;
    dom.presetBtns.forEach(b => b.classList.toggle('active', b.dataset.station === stationId));

    state.lat = station.lat;
    state.lng = station.lng;
    state.locationName = station.shortName;
    state.locationRegion = station.region;

    if (mapManager) mapManager.flyTo(station.lat, station.lng, 5);

    renderTelemetry();
    const { metrics, source } = await window.AeroTelemetryApi.fetchAirQuality(station.lat, station.lng, station.fallback);
    state.liveMetrics = metrics;
    state.dataSource = source;
    applyTimelineAndRender(true);
  }

  async function selectCustomCoordinate(lat, lng, meta = null) {
    dom.presetBtns.forEach(b => b.classList.remove('active'));
    state.lat = lat;
    state.lng = lng;
    state.locationName = meta ? meta.name : 'Koordinat Taranıyor...';
    state.locationRegion = meta ? meta.region : 'ÖZEL TELEMETRİ NOKTASI';

    if (mapManager) mapManager.setRadarPosition(lat, lng);
    renderTelemetry();

    const [geo, tel] = await Promise.all([
      meta ? Promise.resolve(meta) : window.AeroTelemetryApi.reverseGeocode(lat, lng),
      window.AeroTelemetryApi.fetchAirQuality(lat, lng, null)
    ]);

    state.locationName = geo.name;
    state.locationRegion = geo.region;
    state.liveMetrics = tel.metrics;
    state.dataSource = tel.source;
    applyTimelineAndRender(true);
  }

  async function togglePlayback() {
    if (state.isPlaying) {
      audioEngine.stop();
      state.isPlaying = false;
      dom.playPauseBtn.classList.remove('playing');
      dom.playIcon.classList.remove('hidden');
      dom.pauseIcon.classList.add('hidden');
      dom.playBtnLabel.textContent = 'SESİ BAŞLAT';
    } else {
      await audioEngine.start(state.volume, state.activeMetrics, state.stage, state.isMuted);
      state.isPlaying = true;
      dom.playPauseBtn.classList.add('playing');
      dom.playIcon.classList.add('hidden');
      dom.pauseIcon.classList.remove('hidden');
      dom.playBtnLabel.textContent = 'DURAKLAT';
    }
    renderTelemetry();
  }

  // Animasyon Döngüsü
  function mainLoop() {
    const canvas = dom.biosphereCanvas;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width || canvas.height !== rect.height) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    const w = canvas.width;
    const h = canvas.height;

    // 1. Prosedürel Fraktal Biyosfer Ağacı
    treeRenderer.render(ctx, w, h, state.stage, state.reduceMotion);

    // 2. Fizik Tabanlı Parçacık Sistemi (O2, Yaprak Dökümü, Smog)
    particleSystem.updateAndRender(ctx, w, h, state.stage, state.reduceMotion);

    // 3. Jukebox Spektrum / Osiloskop Çizimi
    renderVisualizer();

    requestAnimationFrame(mainLoop);
  }

  let vizPhase = 0;
  function renderVisualizer() {
    const vc = dom.visualizerCanvas;
    const vctx = vc.getContext('2d');
    const rect = vc.getBoundingClientRect();
    if (vc.width !== rect.width || vc.height !== rect.height) {
      vc.width = rect.width;
      vc.height = rect.height;
    }
    const w = vc.width;
    const h = vc.height;
    vctx.clearRect(0, 0, w, h);

    const aqiColor = getComputedStyle(document.documentElement).getPropertyValue('--aqi-color').trim() || '#00D2FF';
    const analyser = audioEngine.getAnalyser();

    if (state.isPlaying && analyser) {
      const len = analyser.frequencyBinCount;
      const data = new Uint8Array(len);
      analyser.getByteFrequencyData(data);

      const bars = 28;
      const barW = (w / bars) - 2;
      for (let i = 0; i < bars; i++) {
        const val = data[i * 2] / 255;
        const bh = Math.max(3, val * (h - 6));
        vctx.fillStyle = aqiColor;
        vctx.fillRect(i * (barW + 2) + 2, h - bh - 2, barW, bh);
      }
    } else {
      vizPhase += 0.04;
      vctx.beginPath();
      vctx.strokeStyle = state.isPlaying ? aqiColor : 'rgba(0, 210, 255, 0.4)';
      vctx.lineWidth = 1.6;
      for (let x = 0; x <= w; x += 3) {
        const amp = state.isPlaying ? 8 : 4;
        const y = h / 2 + Math.sin(x * 0.05 + vizPhase) * amp;
        x === 0 ? vctx.moveTo(x, y) : vctx.lineTo(x, y);
      }
      vctx.stroke();
    }
  }

  function bindEvents() {
    // Sekmeler
    dom.tabMonitor.addEventListener('click', () => {
      dom.tabMonitor.classList.add('active');
      dom.tabTeam.classList.remove('active');
      dom.teamView.classList.add('hidden');
      if (mapManager) mapManager.invalidate();
    });
    dom.tabTeam.addEventListener('click', () => {
      dom.tabTeam.classList.add('active');
      dom.tabMonitor.classList.remove('active');
      dom.teamView.classList.remove('hidden');
    });
    dom.closeTeamBtn.addEventListener('click', () => dom.tabMonitor.click());

    // Şehir Arama
    dom.searchForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const q = dom.citySearchInput.value.trim();
      if (!q) return;
      try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=tr&format=json`);
        const data = await res.json();
        if (data.results?.length) {
          const r = data.results[0];
          mapManager.flyTo(r.latitude, r.longitude, 6);
          selectCustomCoordinate(r.latitude, r.longitude, { name: `${r.name}${r.country ? ', ' + r.country : ''}`, region: 'ŞEHİR TELEMETRİSİ' });
        }
      } catch {}
    });

    // Harita Kontrolleri
    dom.zoomInBtn.addEventListener('click', () => mapManager.zoomIn());
    dom.zoomOutBtn.addEventListener('click', () => mapManager.zoomOut());
    dom.resetMapBtn.addEventListener('click', () => mapManager.resetView());

    // Kontrast & Sesli Okuma
    dom.contrastBtn.addEventListener('click', () => {
      const active = document.body.classList.toggle('high-contrast');
      dom.contrastBtn.setAttribute('aria-pressed', String(active));
    });

    dom.voiceToggleBtn.addEventListener('click', () => {
      state.voiceEnabled = !state.voiceEnabled;
      dom.voiceToggleBtn.setAttribute('aria-pressed', String(state.voiceEnabled));
      dom.voiceToggleState.textContent = state.voiceEnabled ? 'Açık' : 'Kapalı';
      if (state.voiceEnabled) speakTelemetry();
      else if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    });

    // Zaman Çizelgesi
    dom.timelineSlider.addEventListener('input', e => {
      state.timelineYear = Number(e.target.value);
      applyTimelineAndRender(false);
    });
    dom.eraTicks.forEach(tick => {
      tick.addEventListener('click', () => {
        state.timelineYear = Number(tick.dataset.year);
        applyTimelineAndRender(true);
      });
    });

    // Jukebox
    dom.playPauseBtn.addEventListener('click', togglePlayback);
    dom.muteBtn.addEventListener('click', () => {
      state.isMuted = !state.isMuted;
      dom.volHighIcon.classList.toggle('hidden', state.isMuted);
      dom.volMuteIcon.classList.toggle('hidden', !state.isMuted);
      audioEngine.setVolume(state.volume, state.isMuted);
    });
    dom.volumeSlider.addEventListener('input', e => {
      const v = Number(e.target.value) / 100;
      state.volume = v;
      dom.volumeValue.textContent = `${Math.round(v * 100)}%`;
      audioEngine.setVolume(v, state.isMuted);
    });

    dom.randomLocBtn.addEventListener('click', () => {
      const pt = RANDOM_POINTS[Math.floor(Math.random() * RANDOM_POINTS.length)];
      mapManager.flyTo(pt.lat, pt.lng, 5);
      selectCustomCoordinate(pt.lat, pt.lng, pt);
    });

    dom.prevStationBtn.addEventListener('click', () => {
      const idx = STATIONS.findIndex(s => s.id === state.activeStationId);
      const next = (idx - 1 + STATIONS.length) % STATIONS.length;
      selectPresetStation(STATIONS[next].id);
    });
    dom.nextStationBtn.addEventListener('click', () => {
      const idx = STATIONS.findIndex(s => s.id === state.activeStationId);
      const next = (idx + 1) % STATIONS.length;
      selectPresetStation(STATIONS[next].id);
    });

    dom.presetBtns.forEach(b => b.addEventListener('click', () => selectPresetStation(b.dataset.station)));

    dom.shortcutsBtn.addEventListener('click', () => dom.shortcutsModal.classList.remove('hidden'));
    dom.closeShortcutsBtn.addEventListener('click', () => dom.shortcutsModal.classList.add('hidden'));

    // Klavye Kısayolları
    document.addEventListener('keydown', e => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (e.code === 'Space') { e.preventDefault(); togglePlayback(); }
      else if (e.key === 'v' || e.key === 'V') dom.voiceToggleBtn.click();
      else if (e.key === 'r' || e.key === 'R') dom.randomLocBtn.click();
      else if (e.key === 'm' || e.key === 'M') dom.muteBtn.click();
      else if (e.code === 'ArrowRight') dom.nextStationBtn.click();
      else if (e.code === 'ArrowLeft') dom.prevStationBtn.click();
      else if (e.code === 'Escape') dom.shortcutsModal.classList.add('hidden');
    });
  }

  function bootstrap() {
    mapManager = new window.AeroMapManager('worldMap', selectCustomCoordinate, selectPresetStation);
    mapManager.init(state.lat, state.lng, STATIONS);
    bindEvents();
    requestAnimationFrame(mainLoop);
    selectPresetStation('denizli');
  }

  document.addEventListener('DOMContentLoaded', bootstrap);
})();