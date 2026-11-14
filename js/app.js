/**
 * AeroJukebox — Ana Koordinatör: 5 Dil, Açık/Koyu Tema, Splash Ekranı & İki Mod
 */
(() => {
  'use strict';

  // 5 DİLLİ METİN SÖZLÜĞÜ (i18n)
  const I18N = {
    tr: {
      airMode: 'Hava Kalitesi', fireMode: 'Yangın Riski', voiceLabel: 'Sesli',
      tabMonitor: 'Monitör', tabTeam: 'Ekip', mapHint: 'Anlık telemetri için haritaya tıklayın',
      timelineTag: 'TARİHSEL SİMÜLATÖR', referenceStations: 'REFERANS İSTASYONLAR',
      mainAqiLabel: 'HAVA KALİTESİ (AQI)', mainFireLabel: 'YANGIN RİSKİ (FWI)',
      mPm25: 'İnce Partikül', mPm10: 'Kaba Partikül', mNo2: 'Azot Dioksit', mO3: 'Ozon',
      mSo2: 'Kükürt Dioksit', mCo: 'Karbonmonoksit', mTemp: 'Sıcaklık', mHum: 'Bağıl Nem',
      closeTeamBtn: 'Monitöre Dön ✕', teamHeading: 'AeroJukebox Geliştirici Ekibi',
      teamLead: 'Gerçek zamanlı uydu telemetrisini çok duyulu ekosistem simülasyonuna ve Web Audio sonifikasyonuna dönüştürmek üzere geliştirilmiştir.',
      refTitle: 'BİLİMSEL VERİ VE UYDU KAYNAKLARI', playBtn: 'SESİ BAŞLAT', pauseBtn: 'DURAKLAT',
      randomBtn: 'Rastgele Konum', shortcutsTitle: 'Klavye Kısayolları',
      scPlay: 'Sesi Oynat / Duraklat', scMode: 'Hava / Yangın Modunu Değiştir',
      scStation: 'Önceki / Sonraki İstasyon', scRandom: 'Rastgele Konum Keşfet',
      scVoice: 'Sesli Rehberi Aç/Kapat', scMute: 'Sesi Kapat / Aç'
    },
    en: {
      airMode: 'Air Quality', fireMode: 'Wildfire Risk', voiceLabel: 'Voice',
      tabMonitor: 'Monitor', tabTeam: 'Team', mapHint: 'Click anywhere on map for live telemetry',
      timelineTag: 'HISTORICAL SIMULATOR', referenceStations: 'REFERENCE STATIONS',
      mainAqiLabel: 'AIR QUALITY (AQI)', mainFireLabel: 'WILDFIRE RISK (FWI)',
      mPm25: 'Fine Particles', mPm10: 'Coarse Dust', mNo2: 'Nitrogen Dioxide', mO3: 'Ozone',
      mSo2: 'Sulfur Dioxide', mCo: 'Carbon Monoxide', mTemp: 'Temperature', mHum: 'Humidity',
      closeTeamBtn: 'Back to Monitor ✕', teamHeading: 'AeroJukebox Developer Team',
      teamLead: 'Designed to transform real-time Earth telemetry into multi-sensory biosphere simulation and Web Audio sonification.',
      refTitle: 'SCIENTIFIC DATA & SATELLITE MISSIONS', playBtn: 'START AUDIO', pauseBtn: 'PAUSE',
      randomBtn: 'Random Location', shortcutsTitle: 'Keyboard Shortcuts',
      scPlay: 'Play / Pause Sonification', scMode: 'Toggle Air / Wildfire Mode',
      scStation: 'Previous / Next Station', scRandom: 'Explore Random Location',
      scVoice: 'Toggle Voice Narration', scMute: 'Mute / Unmute Audio'
    },
    de: {
      airMode: 'Luftqualität', fireMode: 'Brandgefahr', voiceLabel: 'Sprache',
      tabMonitor: 'Monitor', tabTeam: 'Team', mapHint: 'Klicken Sie auf die Karte für Live-Telemetrie',
      timelineTag: 'HISTORISCHER SIMULATOR', referenceStations: 'REFERENZSTATIONEN',
      mainAqiLabel: 'LUFTQUALITÄT (AQI)', mainFireLabel: 'BRANDRISIKO (FWI)',
      mPm25: 'Feinstaub', mPm10: 'Grober Staub', mNo2: 'Stickstoffdioxid', mO3: 'Ozon',
      mSo2: 'Schwefeldioxid', mCo: 'Kohlenmonoxid', mTemp: 'Temperatur', mHum: 'Luftfeuchte',
      closeTeamBtn: 'Zurück zum Monitor ✕', teamHeading: 'AeroJukebox Entwicklungsteam',
      teamLead: 'Entwickelt, um Echtzeit-Satellitendaten in multisensorische Simulationen und Web Audio Sonifikation zu übersetzen.',
      refTitle: 'WISSENSCHAFTLICHE DATENQUELLEN', playBtn: 'AUDIO STARTEN', pauseBtn: 'PAUSE',
      randomBtn: 'Zufälliger Ort', shortcutsTitle: 'Tastaturkürzel',
      scPlay: 'Audio abspielen / pausieren', scMode: 'Luft- / Brandmodus wechseln',
      scStation: 'Vorherige / Nächste Station', scRandom: 'Zufälligen Ort erkunden',
      scVoice: 'Sprachausgabe umschalten', scMute: 'Stummschalten'
    },
    fr: {
      airMode: 'Qualité de l’air', fireMode: 'Risque d’incendie', voiceLabel: 'Vocal',
      tabMonitor: 'Moniteur', tabTeam: 'Équipe', mapHint: 'Cliquez sur la carte pour la télémétrie en direct',
      timelineTag: 'SIMULATEUR HISTORIQUE', referenceStations: 'STATIONS DE RÉFÉRENCE',
      mainAqiLabel: 'QUALITÉ DE L’AIR (AQI)', mainFireLabel: 'RISQUE DE FEU (FWI)',
      mPm25: 'Particules Fines', mPm10: 'Poussières', mNo2: 'Dioxyde d’Azote', mO3: 'Ozone',
      mSo2: 'Dioxyde de Soufre', mCo: 'Monoxyde de Carbone', mTemp: 'Température', mHum: 'Humidité',
      closeTeamBtn: 'Retour au Moniteur ✕', teamHeading: 'Équipe de Développement AeroJukebox',
      teamLead: 'Conçu pour transformer les données satellitaires en temps réel en sonification Web Audio.',
      refTitle: 'SOURCES SCIENTIFIQUES & SATELLITES', playBtn: 'LANCER L’AUDIO', pauseBtn: 'PAUSE',
      randomBtn: 'Lieu Aléatoire', shortcutsTitle: 'Raccourcis Clavier',
      scPlay: 'Lecture / Pause Audio', scMode: 'Changer Mode Air / Feu',
      scStation: 'Station Précédente / Suivante', scRandom: 'Explorer Lieu Aléatoire',
      scVoice: 'Activer / Désactiver la Voix', scMute: 'Couper le Son'
    },
    cs: {
      airMode: 'Kvalita ovzduší', fireMode: 'Riziko požáru', voiceLabel: 'Hlas',
      tabMonitor: 'Monitor', tabTeam: 'Tým', mapHint: 'Kliknutím na mapu získáte živou telemetrii',
      timelineTag: 'HISTORICKÝ SIMULÁTOR', referenceStations: 'REFERENČNÍ STANICE',
      mainAqiLabel: 'KVALITA OVZDUŠÍ (AQI)', mainFireLabel: 'RIZIKO POŽÁRU (FWI)',
      mPm25: 'Jemný prach', mPm10: 'Hrubý prach', mNo2: 'Oxid dusičitý', mO3: 'Ozón',
      mSo2: 'Oxid siřičitý', mCo: 'Oxid uhelnatý', mTemp: 'Teplota', mHum: 'Vlhkost',
      closeTeamBtn: 'Zpět na Monitor ✕', teamHeading: 'Vývojářský tým AeroJukebox',
      teamLead: 'Navrženo pro převod satelitních telemetrických dat do multi-smyslové sonifikace Web Audio.',
      refTitle: 'VĚDECKÉ A SATELITNÍ ZDROJE', playBtn: 'SPUSTIT ZVUK', pauseBtn: 'PAUZA',
      randomBtn: 'Náhodné Místo', shortcutsTitle: 'Klávesové zkratky',
      scPlay: 'Přehrát / Pozastavit Zvuk', scMode: 'Přepnout Režim Vzduch / Požár',
      scStation: 'Předchozí / Další Stanice', scRandom: 'Prozkoumat Náhodné Místo',
      scVoice: 'Přepnout Hlasový Výstup', scMute: 'Ztlumit Zvuk'
    }
  };

  const STATIONS = [
    { id: 'reykjavik', name: 'Reykjavik, İzlanda', lat: 64.1466, lng: -21.9426, fallback: { pm25: 4.1, pm10: 8.6, no2: 5.2, o3: 54.0, eaqi: 16 } },
    { id: 'amazon', name: 'Amazon Basin, Brazil', lat: -3.4653, lng: -62.2159, fallback: { pm25: 5.4, pm10: 9.8, no2: 2.8, o3: 32.0, eaqi: 18 } },
    { id: 'denizli', name: 'Denizli, Türkiye', lat: 37.7765, lng: 29.0864, fallback: { pm25: 13.8, pm10: 25.4, no2: 18.6, o3: 68.0, eaqi: 36 } },
    { id: 'tokyo', name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503, fallback: { pm25: 19.6, pm10: 34.2, no2: 36.4, o3: 74.0, eaqi: 54 } },
    { id: 'delhi', name: 'New Delhi, India', lat: 28.6139, lng: 77.2090, fallback: { pm25: 112.4, pm10: 186.0, no2: 64.8, o3: 92.0, eaqi: 118 } }
  ];

  const RANDOM_POINTS = [
    { name: 'Zürich, Switzerland', lat: 47.3769, lng: 8.5417 },
    { name: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357 },
    { name: 'Santiago, Chile', lat: -33.4489, lng: -70.6693 },
    { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 }
  ];

  const state = {
    lang: 'tr',
    theme: 'dark',
    mode: 'air', // 'air' | 'fire'
    lat: 37.7765,
    lng: 29.0864,
    locationName: 'Denizli, Türkiye',
    activeStationId: 'denizli',
    timelineYear: 2026,
    liveMetrics: { pm25: 13.8, pm10: 25.4, no2: 18.6, o3: 68.0, so2: 4.8, co: 220, temp: 26.0, hum: 42, eaqi: 36, aqi: 55 },
    activeMetrics: { pm25: 13.8, pm10: 25.4, no2: 18.6, o3: 68.0, so2: 4.8, co: 220, temp: 26.0, hum: 42, eaqi: 36, aqi: 55 },
    dataSource: 'SATELLITE CONNECTED',
    isPlaying: false,
    isMuted: false,
    volume: 0.72,
    voiceEnabled: false,
    stage: 'stage2',
    fireRisk: 25,
    reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };

  const dom = {
    splashScreen: document.getElementById('splashScreen'),
    splashProgressBar: document.getElementById('splashProgressBar'),
    splashStatusText: document.getElementById('splashStatusText'),
    langSelect: document.getElementById('langSelect'),
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    themeIcon: document.getElementById('themeIcon'),
    modeAirBtn: document.getElementById('modeAirBtn'),
    modeFireBtn: document.getElementById('modeFireBtn'),
    mapModeTag: document.getElementById('mapModeTag'),
    mapModeTitle: document.getElementById('mapModeTitle'),
    mapHintText: document.getElementById('mapHintText'),
    mainMetricLabel: document.getElementById('mainMetricLabel'),
    tabMonitor: document.getElementById('tabMonitor'),
    tabTeam: document.getElementById('tabTeam'),
    teamView: document.getElementById('teamView'),
    closeTeamBtn: document.getElementById('closeTeamBtn'),
    voiceToggleBtn: document.getElementById('voiceToggleBtn'),
    voiceToggleState: document.getElementById('voiceToggleState'),
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
    valSo2: document.getElementById('valSo2'),
    barSo2: document.getElementById('barSo2'),
    valCo: document.getElementById('valCo'),
    barCo: document.getElementById('barCo'),
    valTemp: document.getElementById('valTemp'),
    barTemp: document.getElementById('barTemp'),
    valHum: document.getElementById('valHum'),
    barHum: document.getElementById('barHum'),
    playPauseBtn: document.getElementById('playPauseBtn'),
    playIcon: document.getElementById('playIcon'),
    playBtnLabel: document.getElementById('playBtnLabel'),
    prevStationBtn: document.getElementById('prevStationBtn'),
    nextStationBtn: document.getElementById('nextStationBtn'),
    randomLocBtn: document.getElementById('randomLocBtn'),
    jukeboxTitle: document.getElementById('jukeboxTitle'),
    jukeboxStatus: document.getElementById('jukeboxStatus'),
    sonificationModeText: document.getElementById('sonificationModeText'),
    visualizerCanvas: document.getElementById('visualizerCanvas'),
    muteBtn: document.getElementById('muteBtn'),
    volumeSlider: document.getElementById('volumeSlider'),
    volumeValue: document.getElementById('volumeValue'),
    shortcutsBtn: document.getElementById('shortcutsBtn'),
    shortcutsModal: document.getElementById('shortcutsModal'),
    closeShortcutsBtn: document.getElementById('closeShortcutsBtn')
  };

  const treeRenderer = new window.AeroTreeRenderer();
  const particleSystem = new window.AeroParticleSystem();
  const audioEngine = new window.AeroAudioEngine();
  let mapManager = null;

  function formatCoords(lat, lng) {
    const latH = lat >= 0 ? 'N' : 'S';
    const lngH = lng >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(4)}° ${latH}, ${Math.abs(lng).toFixed(4)}° ${lngH}`;
  }

  // ÇOK DİLLİ METİN GÜNCELLEMESİ (i18n)
  function applyLanguage(lang) {
    state.lang = lang;
    const dict = I18N[lang] || I18N.en;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key]) el.textContent = dict[key];
    });

    dom.citySearchInput.placeholder = {
      tr: 'Şehir ara (ör. Denizli, Paris)...',
      en: 'Search city (e.g. London, Tokyo)...',
      de: 'Stadt suchen (z. B. Berlin, Wien)...',
      fr: 'Rechercher ville (ex. Lyon, Rome)...',
      cs: 'Hledat město (např. Praha, Brno)...'
    }[lang];

    renderTelemetry();
  }

  // TEMA DEĞİŞİMİ
  function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    const isLight = state.theme === 'light';
    document.body.classList.toggle('light-theme', isLight);
    dom.themeIcon.textContent = isLight ? '🌙' : '☀️';
    dom.themeToggleBtn.setAttribute('aria-pressed', String(isLight));
    if (mapManager) mapManager.setTheme(state.theme);
  }

  // SESLİ OKUMA (Seçili dilde konuşur)
  function speakTelemetry() {
    if (!state.voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const m = state.activeMetrics;
    const lang = state.lang;
    let text;

    if (state.mode === 'fire') {
      const fire = window.AeroTelemetryApi.calculateFireRisk(m.temp, m.hum, m.pm10, lang);
      text = `${state.locationName}. ${fire.status}. ${fire.desc}. Temp: ${m.temp}°C, Humidity: %${m.hum}.`;
    } else {
      const info = window.AeroTelemetryApi.classifyAqi(m.aqi, lang);
      text = `${state.locationName}. AQI: ${m.aqi}. ${info.label}. ${info.desc}.`;
    }

    const u = new SpeechSynthesisUtterance(text);
    const langCodes = { tr: 'tr-TR', en: 'en-US', de: 'de-DE', fr: 'fr-FR', cs: 'cs-CZ' };
    u.lang = langCodes[lang] || 'en-US';
    window.speechSynthesis.speak(u);
  }

  function renderTelemetry() {
    const m = state.activeMetrics;
    const lang = state.lang;
    const dict = I18N[lang] || I18N.tr;

    const airInfo = window.AeroTelemetryApi.classifyAqi(m.aqi, lang);
    const fireInfo = window.AeroTelemetryApi.calculateFireRisk(m.temp, m.hum, m.pm10, lang);

    state.stage = airInfo.stage;
    state.fireRisk = fireInfo.risk;

    const coordStr = formatCoords(state.lat, state.lng);
    dom.mapCoordReadout.textContent = coordStr;
    dom.locationCoords.textContent = coordStr;
    dom.locationName.textContent = state.locationName;
    dom.dataSourceBadge.textContent = state.timelineYear < 2026 ? `MODEL // ${state.timelineYear}` : state.dataSource;

    if (state.mode === 'fire') {
      document.documentElement.style.setProperty('--aqi-color', fireInfo.color);
      dom.mainMetricLabel.textContent = dict.mainFireLabel;
      dom.aqiValue.textContent = `%${fireInfo.risk}`;
      dom.aqiCategory.textContent = fireInfo.status;
      dom.aqiSubMetric.textContent = `${dict.mTemp}: ${m.temp}°C • ${dict.mHum}: %${m.hum}`;
      dom.aqiMeterFill.style.width = `${fireInfo.risk}%`;
      dom.biosphereStageLabel.textContent = fireInfo.badge;
      dom.biosphereStageDesc.textContent = fireInfo.desc;
      dom.jukeboxStatus.textContent = `${fireInfo.status} (%${fireInfo.risk})`;
      dom.sonificationModeText.textContent = fireInfo.synthTag;
    } else {
      document.documentElement.style.setProperty('--aqi-color', airInfo.color);
      dom.mainMetricLabel.textContent = dict.mainAqiLabel;
      dom.aqiValue.textContent = m.aqi;
      dom.aqiCategory.textContent = airInfo.label;
      dom.aqiSubMetric.textContent = `European AQI: ${m.eaqi}`;
      dom.aqiMeterFill.style.width = `${Math.min(100, Math.max(6, (m.aqi / 220) * 100))}%`;
      dom.biosphereStageLabel.textContent = airInfo.badge;
      dom.biosphereStageDesc.textContent = airInfo.desc;
      dom.jukeboxStatus.textContent = `AQI ${m.aqi} • ${airInfo.label}`;
      dom.sonificationModeText.textContent = airInfo.synthTag;
    }

    // 8 METRİK
    dom.valPm25.textContent = m.pm25.toFixed(1);
    dom.barPm25.style.width = `${Math.min(100, (m.pm25 / 150) * 100)}%`;
    dom.valPm10.textContent = m.pm10.toFixed(1);
    dom.barPm10.style.width = `${Math.min(100, (m.pm10 / 220) * 100)}%`;
    dom.valNo2.textContent = m.no2.toFixed(1);
    dom.barNo2.style.width = `${Math.min(100, (m.no2 / 100) * 100)}%`;
    dom.valO3.textContent = m.o3.toFixed(1);
    dom.barO3.style.width = `${Math.min(100, (m.o3 / 140) * 100)}%`;
    dom.valSo2.textContent = m.so2.toFixed(1);
    dom.barSo2.style.width = `${Math.min(100, (m.so2 / 50) * 100)}%`;
    dom.valCo.textContent = m.co.toFixed(0);
    dom.barCo.style.width = `${Math.min(100, (m.co / 800) * 100)}%`;
    dom.valTemp.textContent = m.temp.toFixed(1);
    dom.barTemp.style.width = `${Math.min(100, Math.max(0, (m.temp + 10) * 2))}%`;
    dom.valHum.textContent = m.hum.toFixed(0);
    dom.barHum.style.width = `${m.hum}%`;

    dom.jukeboxTitle.textContent = state.locationName;
    audioEngine.updateSonification(state.mode, m, state.stage, state.fireRisk, state.isMuted, state.volume);
  }

  function setMode(newMode) {
    state.mode = newMode;
    const isFire = newMode === 'fire';
    dom.modeAirBtn.classList.toggle('active', !isFire);
    dom.modeAirBtn.setAttribute('aria-pressed', String(!isFire));
    dom.modeFireBtn.classList.toggle('active', isFire);
    dom.modeFireBtn.setAttribute('aria-pressed', String(isFire));

    dom.mapModeTag.textContent = isFire ? 'TERMAL YANGIN RADARI // FIRMS' : 'HAVA KALİTESİ RADARI';
    dom.mapModeTitle.textContent = isFire ? 'Orman Yangını & Termal Risk' : 'Küresel Atmosfer Analizi';
    if (mapManager) mapManager.setMapMode(newMode);
    renderTelemetry();
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
      dom.timelineModeLabel.textContent = `2026 (${I18N[state.lang].airMode})`;
      dom.timelineDeltaBadge.classList.add('hidden');
    } else {
      dom.timelineModeLabel.textContent = `${year} Model`;
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
    state.locationName = station.name;

    if (mapManager) mapManager.flyTo(station.lat, station.lng, 5);
    renderTelemetry();

    const { metrics, source } = await window.AeroTelemetryApi.fetchTelemetry(station.lat, station.lng, station.fallback);
    state.liveMetrics = metrics;
    state.dataSource = source;
    applyTimelineAndRender(true);
  }

  async function selectCustomCoordinate(lat, lng, meta = null) {
    dom.presetBtns.forEach(b => b.classList.remove('active'));
    state.lat = lat;
    state.lng = lng;
    state.locationName = meta ? meta.name : 'Scanning...';

    if (mapManager) mapManager.setRadarPosition(lat, lng);
    renderTelemetry();

    const [geo, tel] = await Promise.all([
      meta ? Promise.resolve(meta) : window.AeroTelemetryApi.reverseGeocode(lat, lng, state.lang),
      window.AeroTelemetryApi.fetchTelemetry(lat, lng, null)
    ]);

    state.locationName = geo.name;
    state.liveMetrics = tel.metrics;
    state.dataSource = tel.source;
    applyTimelineAndRender(true);
  }

  async function togglePlayback() {
    const dict = I18N[state.lang] || I18N.tr;
    if (state.isPlaying) {
      audioEngine.stop();
      state.isPlaying = false;
      dom.playPauseBtn.classList.remove('playing');
      dom.playIcon.textContent = '▶';
      dom.playBtnLabel.textContent = dict.playBtn;
    } else {
      await audioEngine.start(state.volume, state.mode, state.activeMetrics, state.stage, state.fireRisk, state.isMuted);
      state.isPlaying = true;
      dom.playPauseBtn.classList.add('playing');
      dom.playIcon.textContent = '⏸';
      dom.playBtnLabel.textContent = dict.pauseBtn;
    }
    renderTelemetry();
  }

  function mainLoop() {
    const canvas = dom.biosphereCanvas;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width || canvas.height !== rect.height) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
    treeRenderer.render(ctx, canvas.width, canvas.height, state.mode, state.stage, state.fireRisk, state.reduceMotion);
    particleSystem.updateAndRender(ctx, canvas.width, canvas.height, state.mode, state.stage, state.fireRisk, state.reduceMotion);
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
    const w = vc.width, h = vc.height;
    vctx.clearRect(0, 0, w, h);

    const aqiColor = getComputedStyle(document.documentElement).getPropertyValue('--aqi-color').trim() || '#00D2FF';
    const analyser = audioEngine.getAnalyser();

    if (state.isPlaying && analyser) {
      const len = analyser.frequencyBinCount;
      const data = new Uint8Array(len);
      analyser.getByteFrequencyData(data);
      const bars = 26;
      const barW = (w / bars) - 2;
      for (let i = 0; i < bars; i++) {
        const val = data[i * 2] / 255;
        const bh = Math.max(3, val * (h - 4));
        vctx.fillStyle = aqiColor;
        vctx.fillRect(i * (barW + 2) + 2, h - bh, barW, bh);
      }
    } else {
      vizPhase += 0.04;
      vctx.beginPath();
      vctx.strokeStyle = state.isPlaying ? aqiColor : 'rgba(0, 210, 255, 0.4)';
      vctx.lineWidth = 1.5;
      for (let x = 0; x <= w; x += 4) {
        const amp = state.isPlaying ? 7 : 3;
        const y = h / 2 + Math.sin(x * 0.05 + vizPhase) * amp;
        x === 0 ? vctx.moveTo(x, y) : vctx.lineTo(x, y);
      }
      vctx.stroke();
    }
  }

  function bindEvents() {
    dom.langSelect.addEventListener('change', e => applyLanguage(e.target.value));
    dom.themeToggleBtn.addEventListener('click', toggleTheme);

    dom.modeAirBtn.addEventListener('click', () => setMode('air'));
    dom.modeFireBtn.addEventListener('click', () => setMode('fire'));

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

    dom.searchForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const q = dom.citySearchInput.value.trim();
      if (!q) return;
      try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=${state.lang}&format=json`);
        const data = await res.json();
        if (data.results?.length) {
          const r = data.results[0];
          mapManager.flyTo(r.latitude, r.longitude, 6);
          selectCustomCoordinate(r.latitude, r.longitude, { name: `${r.name}${r.country ? ', ' + r.country : ''}` });
        }
      } catch {}
    });

    dom.zoomInBtn.addEventListener('click', () => mapManager.zoomIn());
    dom.zoomOutBtn.addEventListener('click', () => mapManager.zoomOut());
    dom.resetMapBtn.addEventListener('click', () => mapManager.resetView());

    dom.voiceToggleBtn.addEventListener('click', () => {
      state.voiceEnabled = !state.voiceEnabled;
      dom.voiceToggleBtn.setAttribute('aria-pressed', String(state.voiceEnabled));
      dom.voiceToggleState.textContent = state.voiceEnabled ? 'Açık' : 'Kapalı';
      if (state.voiceEnabled) speakTelemetry();
      else if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    });

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

    dom.playPauseBtn.addEventListener('click', togglePlayback);
    dom.muteBtn.addEventListener('click', () => {
      state.isMuted = !state.isMuted;
      dom.muteBtn.textContent = state.isMuted ? '🔇' : '🔊';
      audioEngine.setVolume(state.volume, state.isMuted);
    });
    dom.volumeSlider.addEventListener('input', e => {
      state.volume = Number(e.target.value) / 100;
      dom.volumeValue.textContent = `${e.target.value}%`;
      audioEngine.setVolume(state.volume, state.isMuted);
    });

    dom.randomLocBtn.addEventListener('click', () => {
      const pt = RANDOM_POINTS[Math.floor(Math.random() * RANDOM_POINTS.length)];
      mapManager.flyTo(pt.lat, pt.lng, 5);
      selectCustomCoordinate(pt.lat, pt.lng, pt);
    });

    dom.prevStationBtn.addEventListener('click', () => {
      const idx = STATIONS.findIndex(s => s.id === state.activeStationId);
      selectPresetStation(STATIONS[(idx - 1 + STATIONS.length) % STATIONS.length].id);
    });
    dom.nextStationBtn.addEventListener('click', () => {
      const idx = STATIONS.findIndex(s => s.id === state.activeStationId);
      selectPresetStation(STATIONS[(idx + 1) % STATIONS.length].id);
    });

    dom.presetBtns.forEach(b => b.addEventListener('click', () => selectPresetStation(b.dataset.station)));

    dom.shortcutsBtn.addEventListener('click', () => dom.shortcutsModal.classList.remove('hidden'));
    dom.closeShortcutsBtn.addEventListener('click', () => dom.shortcutsModal.classList.add('hidden'));

    document.addEventListener('keydown', e => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (e.code === 'Space') { e.preventDefault(); togglePlayback(); }
      else if (e.key === 'f' || e.key === 'F') setMode(state.mode === 'air' ? 'fire' : 'air');
      else if (e.key === 'v' || e.key === 'V') dom.voiceToggleBtn.click();
      else if (e.key === 'r' || e.key === 'R') dom.randomLocBtn.click();
      else if (e.key === 'm' || e.key === 'M') dom.muteBtn.click();
      else if (e.code === 'ArrowRight') dom.nextStationBtn.click();
      else if (e.code === 'ArrowLeft') dom.prevStationBtn.click();
      else if (e.code === 'Escape') dom.shortcutsModal.classList.add('hidden');
    });
  }

  // SPLASH EKRANI KAPANIŞ AKIŞI
  function handleSplashDismiss() {
    let p = 15;
    const interval = setInterval(() => {
      p += 25;
      if (dom.splashProgressBar) dom.splashProgressBar.style.width = `${p}%`;
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          dom.splashScreen.classList.add('fade-out');
        }, 350);
      }
    }, 120);
  }

  function bootstrap() {
    handleSplashDismiss();
    mapManager = new window.AeroMapManager('worldMap', selectCustomCoordinate, selectPresetStation);
    mapManager.init(state.lat, state.lng, STATIONS);
    bindEvents();
    applyLanguage('tr');
    requestAnimationFrame(mainLoop);
    selectPresetStation('denizli');
  }

  document.addEventListener('DOMContentLoaded', bootstrap);
})();
