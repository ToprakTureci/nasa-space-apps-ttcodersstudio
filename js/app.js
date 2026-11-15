(() => {
  'use strict';

  const DEFAULT_GEMINI_API_KEY = '';

  const I18N = {
    tr: {
      tourBtn: 'Rehber', aiBtn: 'AeroAI', voiceOn: 'Açık', voiceOff: 'Kapalı',
      airMode: 'Hava Kalitesi', fireMode: 'Yangın Riski', lightMode: 'Işık Kirliliği', voiceLabel: 'Sesli',
      tabMonitor: 'Monitör', tabTeam: 'Ekip', mapHint: 'Anlık NASA + uydu telemetrisi için tıklayın',
      mapAirTag: 'HAVA KALİTESİ RADARI', mapAirTitle: 'Küresel Atmosfer Analizi',
      mapFireTag: 'NASA EONET // AKTİF YANGINLAR', mapFireTitle: 'Küresel Orman Yangını Radarı',
      mapLightTag: 'NASA GIBS // VIIRS BLACK MARBLE', mapLightTitle: 'Gece Işık Kirliliği Haritası',
      obsPoint: 'GÖZLEM NOKTASI', timelineTag: 'TARİHSEL SİMÜLATÖR', referenceStations: 'REFERANS İSTASYONLAR',
      mainAqiLabel: 'HAVA KALİTESİ (AQI)', mainFireLabel: 'YANGIN RİSKİ (FWI)', mainLightLabel: 'IŞIK KİRLİLİĞİ (BORTLE)',
      mPm25: 'İnce Partikül', mPm10: 'Kaba Partikül', mNo2: 'Azot Dioksit', mO3: 'Ozon',
      mSolar: 'NASA Işınım', mCo: 'Karbonmonoksit', mTemp: 'Sıcaklık', mHum: 'Bağıl Nem',
      closeTeamBtn: 'Monitöre Dön ✕', teamTag: 'NASA SPACE APPS CHALLENGE 2026 // DENİZLİ',
      teamHeading: 'AeroJukebox Geliştirici Ekibi',
      teamLead: 'Gerçek zamanlı NASA uydu telemetrisini çok duyulu ekosistem simülasyonuna ve Web Audio sonifikasyonuna dönüştürmek üzere geliştirilmiştir.',
      m1Role: 'Yazılım Geliştirici & Sistem Mimarisi', m1Desc: 'Gerçek zamanlı Open-Meteo & NASA veri boru hattı ve çekirdek mimari.',
      m2Role: 'GUI Planlayıcı & Arayüz Tasarımcısı', m2Desc: 'Uzay telemetri arayüzü tasarımı ve dinamik Biyosfer Ağacı görsel sistemi.',
      m3Role: 'Ses Sorumlusu & Sonification Tasarımı', m3Desc: 'Web Audio API harmonik akor sentezi ve ses manzarası mühendisliği.',
      m4Role: 'Proje Sunumu & Bilimsel İçerik', m4Desc: 'Atmosferik kirletici eşiklerinin kurgulanması ve bilimsel anlatım.',
      m5Role: 'Yazılım & Teknik', m5Desc: 'Yazılım mimarisi, telemetri veri optimizasyonu ve teknik entegrasyon.',
      refTitle: 'BİLİMSEL VERİ VE NASA UYDU KAYNAKLARI',
      src1Detail: 'Gerçek zamanlı aktif küresel orman yangını olay verileri',
      src2Detail: 'NASA Suomi NPP uydusu gece ışık kirliliği katmanı',
      src3Detail: 'Uydu güneş radyasyonu, yüzey sıcaklığı ve iklim verileri',
      src4Detail: 'Gerçek zamanlı PM2.5, PM10, NO₂, O₃, CO ve nem verileri',
      playBtn: 'SESİ BAŞLAT', pauseBtn: 'DURAKLAT', randomBtn: 'Rastgele Konum',
      shortcutsTitle: 'Klavye Kısayolları', scPlay: 'Sesi Oynat / Duraklat', scMode: 'Mod Değiştir (Hava / Yangın / Işık)',
      scStation: 'Önceki / Sonraki İstasyon', scRandom: 'Rastgele Konum Keşfet', scVoice: 'Sesli Rehberi Aç/Kapat',
      scMute: 'Sesi Kapat / Aç', scTour: 'İnteraktif Rehberi Başlat (H)',
      aiChipAir: '🌫️ Detaylı Durum Analizi', aiChipSound: '🎵 Müzik & Sonifikasyon Analizi', aiChipHealth: '🫁 Sağlık & Yaşam Tavsiyesi'
    },
    en: {
      tourBtn: 'Tour Guide', aiBtn: 'AeroAI', voiceOn: 'On', voiceOff: 'Off',
      airMode: 'Air Quality', fireMode: 'Wildfire Risk', lightMode: 'Light Pollution', voiceLabel: 'Voice',
      tabMonitor: 'Monitor', tabTeam: 'Team', mapHint: 'Click map for live NASA + satellite telemetry',
      mapAirTag: 'AIR QUALITY RADAR', mapAirTitle: 'Global Atmospheric Analysis',
      mapFireTag: 'NASA EONET // ACTIVE WILDFIRES', mapFireTitle: 'Global Wildfire Tracker',
      mapLightTag: 'NASA GIBS // VIIRS BLACK MARBLE', mapLightTitle: 'Night Light Pollution Map',
      obsPoint: 'OBSERVATION POINT', timelineTag: 'HISTORICAL SIMULATOR', referenceStations: 'REFERENCE STATIONS',
      mainAqiLabel: 'AIR QUALITY (AQI)', mainFireLabel: 'WILDFIRE RISK (FWI)', mainLightLabel: 'LIGHT POLLUTION (BORTLE)',
      mPm25: 'Fine Particles', mPm10: 'Coarse Dust', mNo2: 'Nitrogen Dioxide', mO3: 'Ozone',
      mSolar: 'NASA Solar', mCo: 'Carbon Monoxide', mTemp: 'Temperature', mHum: 'Humidity',
      closeTeamBtn: 'Back to Monitor ✕', teamTag: 'NASA SPACE APPS CHALLENGE 2026 // DENIZLI',
      teamHeading: 'AeroJukebox Developer Team',
      teamLead: 'Built to transform real-time NASA telemetry into multi-sensory biosphere simulation and Web Audio sonification.',
      m1Role: 'Software Developer & System Architecture', m1Desc: 'Real-time Open-Meteo & NASA data pipeline and core architecture.',
      m2Role: 'GUI Planner & Interface Designer', m2Desc: 'Space telemetry UI design and dynamic Biosphere Tree visual system.',
      m3Role: 'Sound Lead & Sonification Design', m3Desc: 'Web Audio API harmonic synthesis and soundscape engineering.',
      m4Role: 'Project Presentation & Scientific Content', m4Desc: 'Pollutant thresholds and scientific storytelling.',
      m5Role: 'Software & Technical Integration', m5Desc: 'Software architecture, telemetry optimization, and technical integration.',
      refTitle: 'SCIENTIFIC & NASA SATELLITE SOURCES',
      src1Detail: 'Real-time active global wildfire event coordinates',
      src2Detail: 'NASA Suomi NPP VIIRS Black Marble night-lights layer',
      src3Detail: 'Satellite solar irradiance, temperature, and climate assimilation',
      src4Detail: 'Real-time PM2.5, PM10, NO₂, O₃, CO, and humidity telemetry',
      playBtn: 'START AUDIO', pauseBtn: 'PAUSE', randomBtn: 'Random Location',
      shortcutsTitle: 'Keyboard Shortcuts', scPlay: 'Play / Pause Audio', scMode: 'Cycle Mode (Air / Fire / Light)',
      scStation: 'Previous / Next Station', scRandom: 'Random Location', scVoice: 'Toggle Voice',
      scMute: 'Mute Audio', scTour: 'Start Tour (H)',
      aiChipAir: '🌫️ Detailed Status Analysis', aiChipSound: '🎵 Music & Sonification', aiChipHealth: '🫁 Health & Advice'
    },
    de: {
      tourBtn: 'Anleitung', aiBtn: 'AeroAI', voiceOn: 'Ein', voiceOff: 'Aus',
      airMode: 'Luftqualität', fireMode: 'Brandgefahr', lightMode: 'Lichtverschmutzung', voiceLabel: 'Sprache',
      tabMonitor: 'Monitor', tabTeam: 'Team', mapHint: 'Klicken für NASA-Telemetrie',
      mapAirTag: 'LUFTQUALITÄTS-RADAR', mapAirTitle: 'Globale Atmosphärenanalyse',
      mapFireTag: 'NASA EONET // WALDBRÄNDE', mapFireTitle: 'Aktive Waldbrände',
      mapLightTag: 'NASA GIBS // VIIRS NACHTLICHTER', mapLightTitle: 'Lichtverschmutzungskarte',
      obsPoint: 'BEOBACHTUNGSPUNKT', timelineTag: 'HISTORISCHER SIMULATOR', referenceStations: 'REFERENZSTATIONEN',
      mainAqiLabel: 'LUFTQUALITÄT (AQI)', mainFireLabel: 'BRANDRISIKO (FWI)', mainLightLabel: 'LICHTVERSCHMUTZUNG',
      mPm25: 'Feinstaub', mPm10: 'Grober Staub', mNo2: 'Stickstoffdioxid', mO3: 'Ozon',
      mSolar: 'NASA Solar', mCo: 'Kohlenmonoxid', mTemp: 'Temperatur', mHum: 'Feuchte',
      closeTeamBtn: 'Zurück ✕', teamTag: 'NASA SPACE APPS 2026 // DENIZLI',
      teamHeading: 'AeroJukebox Team', teamLead: 'Entwickelt für multisensorische NASA-Telemetrie und Sonifikation.',
      m1Role: 'Software & Architektur', m1Desc: 'Open-Meteo & NASA Datenpipeline.',
      m2Role: 'GUI & Interface-Design', m2Desc: 'Weltraum-UI & Biosphärenbaum.',
      m3Role: 'Audio & Sonifikation', m3Desc: 'Web Audio Synthese & Klangdesign.',
      m4Role: 'Wissenschaft & Präsentation', m4Desc: 'Schadstoffmodelle & Klimakommunikation.',
      m5Role: 'Software & Technik', m5Desc: 'Systemoptimierung & Integration.',
      refTitle: 'NASA & WISSENSCHAFTLICHE QUELLEN',
      src1Detail: 'Aktive globale Waldbrandereignisse', src2Detail: 'NASA VIIRS Nachtlichter-Satellitenkarte',
      src3Detail: 'Satelliten-Sonneneinstrahlung & Klima', src4Detail: 'Echtzeit-Luftqualitätsdaten',
      playBtn: 'AUDIO STARTEN', pauseBtn: 'PAUSE', randomBtn: 'Zufälliger Ort',
      shortcutsTitle: 'Tastaturkürzel', scPlay: 'Audio Play/Pause', scMode: 'Modus wechseln',
      scStation: 'Station wechseln', scRandom: 'Zufälliger Ort', scVoice: 'Sprache umschalten',
      scMute: 'Stumm', scTour: 'Anleitung (H)',
      aiChipAir: '🌫️ Statusanalyse', aiChipSound: '🎵 Klanganalyse', aiChipHealth: '🫁 Gesundheitstipps'
    },
    fr: {
      tourBtn: 'Guide', aiBtn: 'AeroAI', voiceOn: 'Activé', voiceOff: 'Désactivé',
      airMode: 'Qualité de l’air', fireMode: 'Incendies', lightMode: 'Pollution Lumineuse', voiceLabel: 'Vocal',
      tabMonitor: 'Moniteur', tabTeam: 'Équipe', mapHint: 'Cliquez pour la télémétrie NASA',
      mapAirTag: 'RADAR QUALITÉ DE L’AIR', mapAirTitle: 'Analyse Atmosphérique',
      mapFireTag: 'NASA EONET // FEUX ACTIFS', mapFireTitle: 'Radar des Feux de Forêt',
      mapLightTag: 'NASA GIBS // VIIRS NOCTURNE', mapLightTitle: 'Carte de Pollution Lumineuse',
      obsPoint: 'OBSERVATION', timelineTag: 'SIMULATEUR HISTORIQUE', referenceStations: 'STATIONS',
      mainAqiLabel: 'QUALITÉ AIR (AQI)', mainFireLabel: 'RISQUE FEU (FWI)', mainLightLabel: 'POLLUTION LUMINEUSE',
      mPm25: 'PM2.5', mPm10: 'PM10', mNo2: 'NO₂', mO3: 'Ozone',
      mSolar: 'NASA Solaire', mCo: 'CO', mTemp: 'Température', mHum: 'Humidité',
      closeTeamBtn: 'Retour ✕', teamTag: 'NASA SPACE APPS 2026 // DENIZLI',
      teamHeading: 'Équipe AeroJukebox', teamLead: 'Télémétrie NASA et sonification Web Audio.',
      m1Role: 'Développeur & Architecture', m1Desc: 'Pipeline Open-Meteo & NASA.',
      m2Role: 'GUI & Interface', m2Desc: 'Design spatial & arbre de la biosphère.',
      m3Role: 'Audio & Sonification', m3Desc: 'Synthèse harmonique Web Audio.',
      m4Role: 'Contenu Scientifique', m4Desc: 'Seuils atmosphériques & narration.',
      m5Role: 'Logiciel & Technique', m5Desc: 'Optimisation & intégration technique.',
      refTitle: 'SOURCES NASA & SCIENTIFIQUES',
      src1Detail: 'Incendies mondiaux en direct', src2Detail: 'Couche nocturne NASA VIIRS',
      src3Detail: 'Rayonnement solaire satellite', src4Detail: 'Données atmosphériques en direct',
      playBtn: 'LANCER AUDIO', pauseBtn: 'PAUSE', randomBtn: 'Lieu Aléatoire',
      shortcutsTitle: 'Raccourcis', scPlay: 'Lecture/Pause', scMode: 'Changer Mode',
      scStation: 'Changer Station', scRandom: 'Lieu Aléatoire', scVoice: 'Voix On/Off',
      scMute: 'Muet', scTour: 'Guide (H)',
      aiChipAir: '🌫️ Analyse détaillée', aiChipSound: '🎵 Analyse sonore', aiChipHealth: '🫁 Conseils santé'
    },
    cs: {
      tourBtn: 'Nápověda', aiBtn: 'AeroAI', voiceOn: 'Zapnuto', voiceOff: 'Vypnuto',
      airMode: 'Kvalita ovzduší', fireMode: 'Požáry', lightMode: 'Světelné znečištění', voiceLabel: 'Hlas',
      tabMonitor: 'Monitor', tabTeam: 'Tým', mapHint: 'Klikněte pro živá data NASA',
      mapAirTag: 'RADAR OVZDUŠÍ', mapAirTitle: 'Globální analýza atmosféry',
      mapFireTag: 'NASA EONET // AKTIVNÍ POŽÁRY', mapFireTitle: 'Globální radar požárů',
      mapLightTag: 'NASA GIBS // VIIRS NOC', mapLightTitle: 'Mapa světelného znečištění',
      obsPoint: 'POZOROVACÍ BOD', timelineTag: 'HISTORICKÝ SIMULÁTOR', referenceStations: 'STANICE',
      mainAqiLabel: 'KVALITA OVZDUŠÍ', mainFireLabel: 'RIZIKO POŽÁRU', mainLightLabel: 'SVĚTELNÉ ZNEČIŠTĚNÍ',
      mPm25: 'Jemný prach', mPm10: 'Hrubý prach', mNo2: 'NO₂', mO3: 'Ozón',
      mSolar: 'NASA Slunce', mCo: 'CO', mTemp: 'Teplota', mHum: 'Vlhkost',
      closeTeamBtn: 'Zpět ✕', teamTag: 'NASA SPACE APPS 2026 // DENIZLI',
      teamHeading: 'Tým AeroJukebox', teamLead: 'Převod satelitních dat NASA do zvuku Web Audio.',
      m1Role: 'Vývojář & Architektura', m1Desc: 'Datový kanál Open-Meteo & NASA.',
      m2Role: 'GUI & Návrh rozhraní', m2Desc: 'Vesmírné UI a strom biosféry.',
      m3Role: 'Zvuk & Sonifikace', m3Desc: 'Harmonická syntéza Web Audio.',
      m4Role: 'Vědecký obsah', m4Desc: 'Prahové hodnoty a vědecká dokumentace.',
      m5Role: 'Software & Technika', m5Desc: 'Optimalizace dat a technická integrace.',
      refTitle: 'VĚDECKÉ A NASA ZDROJE',
      src1Detail: 'Aktivní globální požáry v reálném čase', src2Detail: 'Noční světla NASA VIIRS Black Marble',
      src3Detail: 'Satelitní sluneční záření a klima', src4Detail: 'Živá data ovzduší',
      playBtn: 'SPUSTIT ZVUK', pauseBtn: 'PAUZA', randomBtn: 'Náhodné Místo',
      shortcutsTitle: 'Zkratky', scPlay: 'Přehrát/Pozastavit', scMode: 'Přepnout Režim',
      scStation: 'Přepnout Stanici', scRandom: 'Náhodné Místo', scVoice: 'Hlas On/Off',
      scMute: 'Ztlumit', scTour: 'Průvodce (H)',
      aiChipAir: '🌫️ Detailní analýza', aiChipSound: '🎵 Zvuková analýza', aiChipHealth: '🫁 Zdraví'
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
    { name: 'Atacama Desert, Chile', lat: -23.8634, lng: -69.1328 }
  ];

  const state = {
    lang: 'tr',
    theme: 'dark',
    mode: 'air',
    lat: 37.7765,
    lng: 29.0864,
    locationName: 'Denizli, Türkiye',
    activeStationId: 'denizli',
    isNasaActiveFire: false,
    timelineYear: 2026,
    liveMetrics: { pm25: 13.8, pm10: 25.4, no2: 18.6, o3: 68.0, solar: 4.9, co: 220, temp: 26.0, hum: 42, eaqi: 36, aqi: 55 },
    activeMetrics: { pm25: 13.8, pm10: 25.4, no2: 18.6, o3: 68.0, solar: 4.9, co: 220, temp: 26.0, hum: 42, eaqi: 36, aqi: 55 },
    dataSource: 'NASA POWER + OPEN-METEO',
    isPlaying: false,
    isMuted: false,
    volume: 0.85,
    voiceEnabled: false,
    stage: 'stage2',
    fireRisk: 25,
    bortle: 4,
    reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };

  const dom = {
    splashScreen: document.getElementById('splashScreen'),
    splashProgressBar: document.getElementById('splashProgressBar'),
    langSelect: document.getElementById('langSelect'),
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    themeIcon: document.getElementById('themeIcon'),
    modeAirBtn: document.getElementById('modeAirBtn'),
    modeFireBtn: document.getElementById('modeFireBtn'),
    modeLightBtn: document.getElementById('modeLightBtn'),
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
    locationRegion: document.querySelector('.region-tag'),
    aqiValue: document.getElementById('aqiValue'),
    aqiCategory: document.getElementById('aqiCategory'),
    aqiMeterFill: document.getElementById('aqiMeterFill'),
    aqiSubMetric: document.getElementById('aqiSubMetric'),
    biosphereStageLabel: document.getElementById('biosphereStageLabel'),
    biosphereStageDesc: document.getElementById('biosphereStageDesc'),
    biosphereCanvas: document.getElementById('biosphereCanvas'),
    valPm25: document.getElementById('valPm25'), barPm25: document.getElementById('barPm25'),
    valPm10: document.getElementById('valPm10'), barPm10: document.getElementById('barPm10'),
    valNo2: document.getElementById('valNo2'), barNo2: document.getElementById('barNo2'),
    valO3: document.getElementById('valO3'), barO3: document.getElementById('barO3'),
    valSolar: document.getElementById('valSolar'), barSolar: document.getElementById('barSolar'),
    valCo: document.getElementById('valCo'), barCo: document.getElementById('barCo'),
    valTemp: document.getElementById('valTemp'), barTemp: document.getElementById('barTemp'),
    valHum: document.getElementById('valHum'), barHum: document.getElementById('barHum'),
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
    closeShortcutsBtn: document.getElementById('closeShortcutsBtn'),
    tourStartBtn: document.getElementById('tourStartBtn'),
    aiToggleBtn: document.getElementById('aiToggleBtn'),
    aiModal: document.getElementById('aiModal'),
    closeAiBtn: document.getElementById('closeAiBtn'),
    aiKeyBtn: document.getElementById('aiKeyBtn'),
    aiKeyPanel: document.getElementById('aiKeyPanel'),
    aiKeyInput: document.getElementById('aiKeyInput'),
    aiKeySaveBtn: document.getElementById('aiKeySaveBtn'),
    aiEngineBadge: document.getElementById('aiEngineBadge'),
    aiChatBox: document.getElementById('aiChatBox'),
    aiChatForm: document.getElementById('aiChatForm'),
    aiInput: document.getElementById('aiInput')
  };

  const treeRenderer = new window.AeroTreeRenderer();
  const particleSystem = new window.AeroParticleSystem();
  const audioEngine = new window.AeroAudioEngine();
  let mapManager = null;

  function formatCoords(lat, lng) {
    return `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`;
  }

  function applyLanguage(lang) {
    state.lang = lang;
    const dict = I18N[lang] || I18N.en;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key]) el.textContent = dict[key];
    });

    if (dom.locationRegion) dom.locationRegion.textContent = dict.obsPoint;
    if (dom.mapHintText) dom.mapHintText.textContent = dict.mapHint;
    if (dom.voiceToggleState) dom.voiceToggleState.textContent = state.voiceEnabled ? dict.voiceOn : dict.voiceOff;
    if (dom.playBtnLabel) dom.playBtnLabel.textContent = state.isPlaying ? dict.pauseBtn : dict.playBtn;
    if (window.AeroTour) window.AeroTour.setLang(lang);

    dom.citySearchInput.placeholder = {
      tr: 'Şehir ara (ör. Denizli, Paris)...', en: 'Search city (e.g. London)...',
      de: 'Stadt suchen (Berlin)...', fr: 'Rechercher ville (Lyon)...', cs: 'Hledat město (Praha)...'
    }[lang] || 'Search city...';

    setMode(state.mode);
    renderTelemetry();
  }

  function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    const isLight = state.theme === 'light';
    document.body.classList.toggle('light-theme', isLight);
    dom.themeIcon.textContent = isLight ? '🌙' : '☀️';
    if (mapManager) mapManager.setTheme(state.theme);
  }

  function speakTelemetry() {
    if (!state.voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const m = state.activeMetrics;
    const lang = state.lang;
    let text;

    if (state.mode === 'fire') {
      const fire = window.AeroTelemetryApi.calculateFireRisk(m.temp, m.hum, m.pm10, lang, state.isNasaActiveFire);
      text = `${state.locationName}. ${fire.status}. ${fire.desc}.`;
    } else if (state.mode === 'light') {
      const light = window.AeroTelemetryApi.calculateLightPollution(m, lang);
      text = `${state.locationName}. Bortle ${light.bortle}. ${light.status}. ${light.desc}.`;
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
    const fireInfo = window.AeroTelemetryApi.calculateFireRisk(m.temp, m.hum, m.pm10, lang, state.isNasaActiveFire);
    const lightInfo = window.AeroTelemetryApi.calculateLightPollution(m, lang);

    state.stage = airInfo.stage;
    state.fireRisk = fireInfo.risk;
    state.bortle = lightInfo.bortle;

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
    } else if (state.mode === 'light') {
      document.documentElement.style.setProperty('--aqi-color', lightInfo.color);
      dom.mainMetricLabel.textContent = dict.mainLightLabel;
      dom.aqiValue.textContent = `B${lightInfo.bortle}`;
      dom.aqiCategory.textContent = lightInfo.status;
      dom.aqiSubMetric.textContent = `Skyglow: %${lightInfo.percent} • VIIRS`;
      dom.aqiMeterFill.style.width = `${lightInfo.percent}%`;
      dom.biosphereStageLabel.textContent = lightInfo.badge;
      dom.biosphereStageDesc.textContent = lightInfo.desc;
      dom.jukeboxStatus.textContent = `Bortle ${lightInfo.bortle} • %${lightInfo.percent}`;
      dom.sonificationModeText.textContent = lightInfo.synthTag;
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

    dom.valPm25.textContent = m.pm25.toFixed(1);
    dom.barPm25.style.width = `${Math.min(100, (m.pm25 / 150) * 100)}%`;
    dom.valPm10.textContent = m.pm10.toFixed(1);
    dom.barPm10.style.width = `${Math.min(100, (m.pm10 / 220) * 100)}%`;
    dom.valNo2.textContent = m.no2.toFixed(1);
    dom.barNo2.style.width = `${Math.min(100, (m.no2 / 100) * 100)}%`;
    dom.valO3.textContent = m.o3.toFixed(1);
    dom.barO3.style.width = `${Math.min(100, (m.o3 / 140) * 100)}%`;
    dom.valSolar.textContent = (m.solar ?? 4.8).toFixed(2);
    dom.barSolar.style.width = `${Math.min(100, ((m.solar ?? 4.8) / 8) * 100)}%`;
    dom.valCo.textContent = m.co.toFixed(0);
    dom.barCo.style.width = `${Math.min(100, (m.co / 800) * 100)}%`;
    dom.valTemp.textContent = m.temp.toFixed(1);
    dom.barTemp.style.width = `${Math.min(100, Math.max(0, (m.temp + 10) * 2))}%`;
    dom.valHum.textContent = m.hum.toFixed(0);
    dom.barHum.style.width = `${m.hum}%`;

    dom.jukeboxTitle.textContent = state.locationName;
    audioEngine.updateSonification(state.mode, m, state.stage, state.fireRisk, state.bortle, state.isMuted, state.volume);
  }

  function setMode(newMode) {
    state.mode = newMode;
    const dict = I18N[state.lang] || I18N.tr;

    dom.modeAirBtn.classList.toggle('active', newMode === 'air');
    dom.modeAirBtn.setAttribute('aria-pressed', String(newMode === 'air'));
    dom.modeFireBtn.classList.toggle('active', newMode === 'fire');
    dom.modeFireBtn.setAttribute('aria-pressed', String(newMode === 'fire'));
    dom.modeLightBtn.classList.toggle('active', newMode === 'light');
    dom.modeLightBtn.setAttribute('aria-pressed', String(newMode === 'light'));

    if (newMode === 'fire') {
      dom.mapModeTag.textContent = dict.mapFireTag;
      dom.mapModeTitle.textContent = dict.mapFireTitle;
    } else if (newMode === 'light') {
      dom.mapModeTag.textContent = dict.mapLightTag;
      dom.mapModeTitle.textContent = dict.mapLightTitle;
    } else {
      dom.mapModeTag.textContent = dict.mapAirTag;
      dom.mapModeTitle.textContent = dict.mapAirTitle;
    }

    if (mapManager) mapManager.setMapMode(newMode);
    renderTelemetry();
  }

  function applyTimelineAndRender(speak = false) {
    const year = state.timelineYear;
    dom.timelineYearBadge.textContent = year;
    dom.timelineSlider.value = year;

    dom.eraTicks.forEach(tick => tick.classList.toggle('active', Number(tick.dataset.year) === year));

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
    state.isNasaActiveFire = false;
    dom.presetBtns.forEach(b => b.classList.toggle('active', b.dataset.station === stationId));

    state.lat = station.lat; state.lng = station.lng; state.locationName = station.name;
    if (mapManager) mapManager.flyTo(station.lat, station.lng, 5);
    renderTelemetry();

    const { metrics, source } = await window.AeroTelemetryApi.fetchTelemetry(station.lat, station.lng, station.fallback);
    state.liveMetrics = metrics; state.dataSource = source;
    applyTimelineAndRender(true);
  }

  async function selectCustomCoordinate(lat, lng, meta = null, isNasaFire = false) {
    dom.presetBtns.forEach(b => b.classList.remove('active'));
    state.lat = lat; state.lng = lng;
    state.isNasaActiveFire = isNasaFire;
    state.locationName = meta ? meta.name : 'Scanning...';

    if (mapManager) mapManager.setRadarPosition(lat, lng);
    renderTelemetry();

    const [geo, tel] = await Promise.all([
      meta ? Promise.resolve(meta) : window.AeroTelemetryApi.reverseGeocode(lat, lng, state.lang),
      window.AeroTelemetryApi.fetchTelemetry(lat, lng, null)
    ]);

    state.locationName = geo.name;
    state.liveMetrics = tel.metrics;
    state.dataSource = isNasaFire ? 'NASA EONET + POWER' : tel.source;
    applyTimelineAndRender(true);
  }

  function handleSelectNasaFire(fireEvent) {
    if (mapManager) mapManager.flyTo(fireEvent.lat, fireEvent.lng, 7);
    selectCustomCoordinate(fireEvent.lat, fireEvent.lng, { name: `🔥 ${fireEvent.title}` }, true);
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
      await audioEngine.start(state.volume, state.mode, state.activeMetrics, state.stage, state.fireRisk, state.bortle, state.isMuted);
      state.isPlaying = true;
      dom.playPauseBtn.classList.add('playing');
      dom.playIcon.textContent = '⏸';
      dom.playBtnLabel.textContent = dict.pauseBtn;
    }
    renderTelemetry();
  }

  const aiChatHistory = [];

  function getActiveGeminiKey() {
    let stored = '';
    try { stored = localStorage.getItem('aero_gemini_key') || ''; } catch {}
    return stored || DEFAULT_GEMINI_API_KEY;
  }

  function updateAiKeyUI() {
    const key = getActiveGeminiKey();
    if (dom.aiEngineBadge) {
      dom.aiEngineBadge.textContent = key ? '✨ Gemini AI Bağlı' : 'API Anahtarı Girin (veya Çevrimdışı Mod)';
      dom.aiEngineBadge.style.color = key ? '#34D399' : '#F59E0B';
    }
    if (dom.aiKeyPanel && key) dom.aiKeyPanel.classList.add('hidden');
  }

  async function callGeminiAI(userPrompt) {
    const apiKey = getActiveGeminiKey();
    const m = state.activeMetrics;
    const airInfo = window.AeroTelemetryApi.classifyAqi(m.aqi, state.lang);
    const fireInfo = window.AeroTelemetryApi.calculateFireRisk(m.temp, m.hum, m.pm10, state.lang, state.isNasaActiveFire);
    const lightInfo = window.AeroTelemetryApi.calculateLightPollution(m, state.lang);

    const snapshot = `
[NASA & OPEN-METEO LIVE TELEMETRY]
- Location: ${state.locationName} (${state.lat.toFixed(4)}°, ${state.lng.toFixed(4)}°)
- Active Mode: ${state.mode.toUpperCase()} | Year: ${state.timelineYear}
- Air Quality: US AQI ${m.aqi} (${airInfo.label}) | PM2.5=${m.pm25}, PM10=${m.pm10}, NO2=${m.no2}, O3=${m.o3}, CO=${m.co}
- NASA POWER Solar Irradiance: ${m.solar} kWh/m² | Temp=${m.temp}°C | Humidity=%${m.hum}
- Wildfire Risk (FWI): %${fireInfo.risk} (${fireInfo.status}) | NASA EONET Active Fire: ${state.isNasaActiveFire}
- Light Pollution (NASA VIIRS proxy): Bortle Class ${lightInfo.bortle}/9 (%${lightInfo.percent} - ${lightInfo.status})
`;

    if (!apiKey) {
      return { text: generateSmartFallback(userPrompt, m, airInfo, fireInfo, lightInfo), source: '📡 Çevrimdışı Analiz (Canlı Gemini için 🔑)' };
    }

    const systemPrompt = `You are AeroAI, NASA Space Apps 2026 AeroJukebox AI Assistant.
Respond strictly in language "${state.lang}".
Handle greetings/identity warmly, politely reject off-topic non-Earth questions, and give deep, specific, non-repetitive analyses tailored to Air, Wildfire, Light Pollution (Bortle/VIIRS), Health, or Audio Sonification.
${snapshot}`;

    aiChatHistory.push({ role: 'user', parts: [{ text: userPrompt }] });
    if (aiChatHistory.length > 10) aiChatHistory.splice(0, aiChatHistory.length - 10);

    for (const model of ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash']) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ systemInstruction: { parts: [{ text: systemPrompt }] }, contents: aiChatHistory, generationConfig: { temperature: 0.75, maxOutputTokens: 900 } })
        });
        if (res.status === 400 || res.status === 403) {
          aiChatHistory.pop();
          return { text: '⚠️ Geçersiz Gemini API Anahtarı! 🔑 simgesinden kontrol edin.', source: '⚠️ API Hatası' };
        }
        if (!res.ok) continue;
        const data = await res.json();
        const txt = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (txt) {
          aiChatHistory.push({ role: 'model', parts: [{ text: txt }] });
          return { text: txt, source: `✨ Google Gemini (${model})` };
        }
      } catch {}
    }
    aiChatHistory.pop();
    return { text: generateSmartFallback(userPrompt, m, airInfo, fireInfo, lightInfo), source: '📡 Yedek Analiz' };
  }

  function generateSmartFallback(prompt, m, airInfo, fireInfo, lightInfo) {
    const q = prompt.toLowerCase();
    if (/^(selam|merhaba|hi|hello|hallo|bonjour|ahoj)\b/.test(q)) {
      return `Merhaba! 👋 Ben **AeroAI**. Şu an **${state.locationName}** için NASA POWER, EONET ve VIIRS verilerini takip ediyorum. Hava, yangın, ışık kirliliği veya sesler hakkında sorabilirsin!`;
    }
    if (/(kimsin|who are you|wer bist|qui es|kdo jsi)/.test(q)) {
      return `Ben **AeroAI**, NASA Space Apps 2026 AeroJukebox projesinin yapay zeka asistanıyım. Verileri bilimsel olarak yorumlar ve sonifikasyonu açıklarım.`;
    }
    if (/(ses|müzik|akor|nota|sound|music|audio)/.test(q)) {
      const tag = state.mode === 'fire' ? fireInfo.synthTag : state.mode === 'light' ? lightInfo.synthTag : airInfo.synthTag;
      return `🎵 **Akustik & Sonifikasyon Analizi (${state.locationName}):**\n• **Aktif Profil:** \`${tag}\`\n• Ses motoru şu an **Compressor + 2.2x Boost** ile çalışıyor. Temiz havada ve karanlık gökyüzünde kristal arp/çanlar; kirlilikte derin sub-bas; yangında odun çıtırtıları; ışık kirliliğinde ise 60Hz şehir neon uğultusu üretilir.`;
    }
    if (/(sağlık|spor|maske|health|outdoor)/.test(q)) {
      return `🫁 **Sağlık & Yaşam Önerisi (${state.locationName}):**\n• AQI **${m.aqi}** (${airInfo.label}), Güneş Işınımı **${m.solar} kWh/m²**, Işık Kirliliği **Bortle ${lightInfo.bortle}**.\n• ${m.aqi <= 50 ? 'Açık hava egzersizi için ideal.' : 'Hassas gruplar dışarıda ağır efordan kaçınmalı.'} ${lightInfo.bortle >= 7 ? 'Yüksek gece ışığı uyku ritmini etkileyebilir.' : ''}`;
    }
    if (/(tarif|yemek|maç|futbol|fıkra|matematik|recipe|football)/.test(q)) {
      return `🛡️ Ben **AeroAI**; yalnızca Dünya bilimleri, NASA uydu verileri, hava/yangın/ışık kirliliği ve sonifikasyon konularında yanıt veririm.`;
    }
    if (state.mode === 'light') {
      return `🌌 **Işık Kirliliği Analizi (${state.locationName}):**\n• **Bortle Sınıfı:** ${lightInfo.bortle}/9 (**%${lightInfo.percent}** - ${lightInfo.status})\n• **NASA VIIRS Etkisi:** ${lightInfo.desc}`;
    }
    if (state.mode === 'fire') {
      return `🔥 **Yangın & NASA EONET Analizi (${state.locationName}):**\n• **Yangın Riski:** %${fireInfo.risk} (${fireInfo.status})\n• **NASA Işınım & İklim:** Güneş Işınımı **${m.solar} kWh/m²**, Sıcaklık **${m.temp}°C**, Nem **%${m.hum}**.`;
    }
    return `🌫️ **Atmosfer Analizi (${state.locationName}):**\n• **AQI:** ${m.aqi} (${airInfo.label}) | PM2.5: **${m.pm25}**, NO₂: **${m.no2}**, O₃: **${m.o3}** µg/m³ | NASA Solar: **${m.solar} kWh/m²**.`;
  }

  function appendAiMessage(role, text, sourceTag = '') {
    if (!dom.aiChatBox) return;
    const msg = document.createElement('div');
    msg.className = `ai-message ${role}`;
    msg.innerHTML = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`(.*?)`/g, '<code>$1</code>').replace(/\n/g, '<br>')
      + (sourceTag ? `<div class="ai-source-tag">${sourceTag}</div>` : '');
    dom.aiChatBox.appendChild(msg);
    dom.aiChatBox.scrollTop = dom.aiChatBox.scrollHeight;
  }

  async function handleAiSubmit(e) {
    if (e) e.preventDefault();
    const q = dom.aiInput.value.trim();
    if (!q) return;
    appendAiMessage('user', q);
    dom.aiInput.value = '';
    const loader = document.createElement('div');
    loader.className = 'ai-message bot loading';
    loader.textContent = 'AeroAI NASA verilerini analiz ediyor...';
    dom.aiChatBox.appendChild(loader);
    dom.aiChatBox.scrollTop = dom.aiChatBox.scrollHeight;
    const res = await callGeminiAI(q);
    loader.remove();
    appendAiMessage('bot', res.text, res.source);
  }

  function mainLoop() {
    const canvas = dom.biosphereCanvas;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width || canvas.height !== rect.height) {
      canvas.width = rect.width; canvas.height = rect.height;
    }
    treeRenderer.render(ctx, canvas.width, canvas.height, state.mode, state.stage, state.fireRisk, state.bortle, state.reduceMotion);
    particleSystem.updateAndRender(ctx, canvas.width, canvas.height, state.mode, state.stage, state.fireRisk, state.bortle, state.reduceMotion);
    renderVisualizer();
    requestAnimationFrame(mainLoop);
  }

  let vizPhase = 0;
  function renderVisualizer() {
    const vc = dom.visualizerCanvas;
    const vctx = vc.getContext('2d');
    const rect = vc.getBoundingClientRect();
    if (vc.width !== rect.width || vc.height !== rect.height) { vc.width = rect.width; vc.height = rect.height; }
    const w = vc.width, h = vc.height;
    vctx.clearRect(0, 0, w, h);

    const aqiColor = getComputedStyle(document.documentElement).getPropertyValue('--aqi-color').trim() || '#00D2FF';
    const analyser = audioEngine.getAnalyser();

    if (state.isPlaying && analyser) {
      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);
      const bars = 26, barW = (w / bars) - 2;
      for (let i = 0; i < bars; i++) {
        const bh = Math.max(3, (data[i * 2] / 255) * (h - 4));
        vctx.fillStyle = aqiColor;
        vctx.fillRect(i * (barW + 2) + 2, h - bh, barW, bh);
      }
    } else {
      vizPhase += 0.04;
      vctx.beginPath();
      vctx.strokeStyle = state.isPlaying ? aqiColor : 'rgba(0, 210, 255, 0.4)';
      vctx.lineWidth = 1.5;
      for (let x = 0; x <= w; x += 4) {
        const y = h / 2 + Math.sin(x * 0.05 + vizPhase) * (state.isPlaying ? 7 : 3);
        x === 0 ? vctx.moveTo(x, y) : vctx.lineTo(x, y);
      }
      vctx.stroke();
    }
  }

  function bindEvents() {
    dom.langSelect.addEventListener('change', e => applyLanguage(e.target.value));
    dom.themeToggleBtn.addEventListener('click', toggleTheme);

    updateAiKeyUI();
    if (dom.aiToggleBtn) dom.aiToggleBtn.addEventListener('click', () => { updateAiKeyUI(); dom.aiModal.classList.remove('hidden'); });
    if (dom.closeAiBtn) dom.closeAiBtn.addEventListener('click', () => dom.aiModal.classList.add('hidden'));
    if (dom.aiKeyBtn && dom.aiKeyPanel) {
      dom.aiKeyBtn.addEventListener('click', () => {
        dom.aiKeyPanel.classList.toggle('hidden');
        if (!dom.aiKeyPanel.classList.contains('hidden')) { dom.aiKeyInput.value = getActiveGeminiKey(); dom.aiKeyInput.focus(); }
      });
    }
    if (dom.aiKeySaveBtn && dom.aiKeyInput) {
      dom.aiKeySaveBtn.addEventListener('click', () => {
        const k = dom.aiKeyInput.value.trim();
        try { localStorage.setItem('aero_gemini_key', k); } catch {}
        updateAiKeyUI();
        appendAiMessage('bot', k ? '✅ Google Gemini API anahtarı kaydedildi!' : 'API anahtarı temizlendi.');
      });
    }
    if (dom.aiChatForm) dom.aiChatForm.addEventListener('submit', handleAiSubmit);

    document.querySelectorAll('.ai-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const type = chip.dataset.prompt;
        const pMap = {
          air: `${state.locationName} (${state.mode}) için NASA ve atmosfer verilerine göre detaylı analiz yap.`,
          sound: `AeroJukebox şu an çaldığı müzik ve frekanslarla ${state.locationName} verisini sese nasıl dönüştürüyor?`,
          health: `${state.locationName} mevcut koşullarına göre detaylı insan sağlığı ve yaşam tavsiyesi ver.`
        };
        dom.aiInput.value = pMap[type] || chip.textContent;
        handleAiSubmit();
      });
    });

    if (dom.tourStartBtn && !dom.tourStartBtn.dataset.tourBound) {
      dom.tourStartBtn.dataset.tourBound = '1';
      dom.tourStartBtn.addEventListener('click', () => { if (window.AeroTour) window.AeroTour.start(state.lang); });
    }

    dom.modeAirBtn.addEventListener('click', () => setMode('air'));
    dom.modeFireBtn.addEventListener('click', () => setMode('fire'));
    dom.modeLightBtn.addEventListener('click', () => setMode('light'));

    dom.tabMonitor.addEventListener('click', () => {
      dom.tabMonitor.classList.add('active'); dom.tabTeam.classList.remove('active');
      dom.teamView.classList.add('hidden'); if (mapManager) mapManager.invalidate();
    });
    dom.tabTeam.addEventListener('click', () => {
      dom.tabTeam.classList.add('active'); dom.tabMonitor.classList.remove('active');
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
      const dict = I18N[state.lang] || I18N.tr;
      dom.voiceToggleBtn.setAttribute('aria-pressed', String(state.voiceEnabled));
      dom.voiceToggleState.textContent = state.voiceEnabled ? dict.voiceOn : dict.voiceOff;
      if (state.voiceEnabled) speakTelemetry();
      else if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    });

    dom.timelineSlider.addEventListener('input', e => { state.timelineYear = Number(e.target.value); applyTimelineAndRender(false); });
    dom.eraTicks.forEach(t => t.addEventListener('click', () => { state.timelineYear = Number(t.dataset.year); applyTimelineAndRender(true); }));

    dom.playPauseBtn.addEventListener('click', togglePlayback);
    dom.muteBtn.addEventListener('click', () => {
      state.isMuted = !state.isMuted; dom.muteBtn.textContent = state.isMuted ? '🔇' : '🔊';
      audioEngine.setVolume(state.volume, state.isMuted);
    });
    dom.volumeSlider.addEventListener('input', e => {
      state.volume = Number(e.target.value) / 100; dom.volumeValue.textContent = `${e.target.value}%`;
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
      else if (e.key === 'f' || e.key === 'F') {
        const order = ['air', 'fire', 'light'];
        setMode(order[(order.indexOf(state.mode) + 1) % order.length]);
      }
      else if (e.key === 'v' || e.key === 'V') dom.voiceToggleBtn.click();
      else if (e.key === 'r' || e.key === 'R') dom.randomLocBtn.click();
      else if (e.key === 'm' || e.key === 'M') dom.muteBtn.click();
      else if (e.key === 'h' || e.key === 'H' || e.key === '?') { if (window.AeroTour) window.AeroTour.start(state.lang); }
      else if (e.code === 'ArrowRight') dom.nextStationBtn.click();
      else if (e.code === 'ArrowLeft') dom.prevStationBtn.click();
      else if (e.code === 'Escape') {
        dom.shortcutsModal.classList.add('hidden');
        if (dom.aiModal) dom.aiModal.classList.add('hidden');
        if (window.AeroTour) window.AeroTour.end();
      }
    });
  }

  function handleSplashDismiss() {
    let p = 15;
    const interval = setInterval(() => {
      p += 25;
      if (dom.splashProgressBar) dom.splashProgressBar.style.width = `${p}%`;
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          dom.splashScreen.classList.add('fade-out');
          try {
            if (!localStorage.getItem('aerojukebox_tour_done') && window.AeroTour) {
              setTimeout(() => window.AeroTour.start(state.lang), 600);
            }
          } catch {}
        }, 300);
      }
    }, 100);
  }

  async function bootstrap() {
    handleSplashDismiss();
    mapManager = new window.AeroMapManager('worldMap', selectCustomCoordinate, selectPresetStation, handleSelectNasaFire);
    mapManager.init(state.lat, state.lng, STATIONS);
    bindEvents();
    applyLanguage('tr');
    requestAnimationFrame(mainLoop);
    selectPresetStation('denizli');

    const fires = await window.AeroTelemetryApi.fetchNasaWildfires();
    if (mapManager && fires.length) mapManager.setWildfires(fires);
  }

  document.addEventListener('DOMContentLoaded', bootstrap);
})();
