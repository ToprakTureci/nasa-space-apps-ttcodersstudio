(() => {
  'use strict';

  const STATIONS = [
    {
      id: 'reykjavik',
      name: 'İzlanda - Reykjavik',
      shortName: 'Reykjavik, İzlanda',
      region: 'KUZEY ATLANTİK REFERANS',
      lat: 64.1466,
      lng: -21.9426,
      fallback: { pm25: 4.1, pm10: 8.6, no2: 5.2, o3: 54.0, eaqi: 16 }
    },
    {
      id: 'amazon',
      name: 'Amazon Havzası',
      shortName: 'Amazon Havzası, Brezilya',
      region: 'BİYOSFER KARBON YUTAĞI',
      lat: -3.4653,
      lng: -62.2159,
      fallback: { pm25: 5.4, pm10: 9.8, no2: 2.8, o3: 32.0, eaqi: 18 }
    },
    {
      id: 'denizli',
      name: 'Denizli - Türkiye',
      shortName: 'Denizli, Türkiye',
      region: 'ANADOLU TELEMETRİ MERKEZİ',
      lat: 37.7765,
      lng: 29.0864,
      fallback: { pm25: 13.8, pm10: 25.4, no2: 18.6, o3: 68.0, eaqi: 36 }
    },
    {
      id: 'tokyo',
      name: 'Tokyo - Japonya',
      shortName: 'Tokyo, Japonya',
      region: 'PASİFİK METROPOL KUŞAĞI',
      lat: 35.6762,
      lng: 139.6503,
      fallback: { pm25: 19.6, pm10: 34.2, no2: 36.4, o3: 74.0, eaqi: 54 }
    },
    {
      id: 'delhi',
      name: 'Yeni Delhi - Hindistan',
      shortName: 'Yeni Delhi, Hindistan',
      region: 'YÜKSEK AEROSOL YOĞUNLUĞU',
      lat: 28.6139,
      lng: 77.2090,
      fallback: { pm25: 112.4, pm10: 186.0, no2: 64.8, o3: 92.0, eaqi: 118 }
    }
  ];

  const RANDOM_EXPLORE_POINTS = [
    { name: 'Zürih, İsviçre', region: 'ALP İKLİM KUŞAĞI', lat: 47.3769, lng: 8.5417, fallback: { pm25: 7.5, pm10: 14.2, no2: 15.0, o3: 61.0, eaqi: 24 } },
    { name: 'Kahire, Mısır', region: 'SAHRA TOZ KORİDORU', lat: 30.0444, lng: 31.2357, fallback: { pm25: 48.2, pm10: 118.4, no2: 44.1, o3: 82.0, eaqi: 86 } },
    { name: 'Santiago, Şili', region: 'AND HAVZASI', lat: -33.4489, lng: -70.6693, fallback: { pm25: 29.4, pm10: 56.8, no2: 39.0, o3: 64.0, eaqi: 62 } },
    { name: 'Oslo, Norveç', region: 'İSKANDİNAVYA GÖZLEM', lat: 59.9139, lng: 10.7522, fallback: { pm25: 5.8, pm10: 11.4, no2: 12.1, o3: 52.0, eaqi: 19 } },
    { name: 'Seul, Güney Kore', region: 'DOĞU ASYA İSTASYONU', lat: 37.5665, lng: 126.9780, fallback: { pm25: 26.5, pm10: 44.0, no2: 34.5, o3: 69.0, eaqi: 58 } },
    { name: 'Nairobi, Kenya', region: 'DOĞU AFRİKA PLATOSU', lat: -1.2921, lng: 36.8219, fallback: { pm25: 17.2, pm10: 32.5, no2: 20.4, o3: 58.0, eaqi: 42 } },
    { name: 'Vancouver, Kanada', region: 'KUZEY PASİFİK KIYISI', lat: 49.2827, lng: -123.1207, fallback: { pm25: 6.2, pm10: 12.0, no2: 14.8, o3: 48.0, eaqi: 21 } },
    { name: 'Lahor, Pakistan', region: 'İNDUS HAVZASI', lat: 31.5204, lng: 74.3587, fallback: { pm25: 138.0, pm10: 214.0, no2: 58.0, o3: 86.0, eaqi: 134 } },
    { name: 'Punta Arenas, Şili', region: 'GÜNEY OKYANUSU SINIRI', lat: -53.1638, lng: -70.9171, fallback: { pm25: 3.2, pm10: 7.1, no2: 3.1, o3: 44.0, eaqi: 12 } }
  ];

  const CACHE_STORAGE_KEY = 'aerojukebox_telemetry_cache_v1';

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
    stage: 'good'
  };

  const dom = {
    tabMonitor: document.getElementById('tabMonitor'),
    tabTeam: document.getElementById('tabTeam'),
    monitorView: document.getElementById('monitorView'),
    teamView: document.getElementById('teamView'),
    closeTeamBtn: document.getElementById('closeTeamBtn'),
    voiceToggleBtn: document.getElementById('voiceToggleBtn'),
    voiceToggleState: document.getElementById('voiceToggleState'),
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
    biosphereStage: document.getElementById('biosphereStage'),
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

  function clamp(val, min, max) {
    return Math.min(max, Math.max(min, val));
  }

  function normalizeLng(lng) {
    return ((((lng + 180) % 360) + 360) % 360) - 180;
  }

  function formatCoords(lat, lng) {
    const latHem = lat >= 0 ? 'N' : 'S';
    const lngHem = lng >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(4)}° ${latHem}, ${Math.abs(lng).toFixed(4)}° ${lngHem}`;
  }

  function linearAqi(conc, breakpoints) {
    for (const [cLow, cHigh, iLow, iHigh] of breakpoints) {
      if (conc <= cHigh) {
        return Math.round(((iHigh - iLow) / (cHigh - cLow)) * (conc - cLow) + iLow);
      }
    }
    return 400;
  }

  function computeAqiFromPollutants(pm25, pm10, no2, o3) {
    const pm25Bp = [
      [0, 12.0, 0, 50],
      [12.1, 35.4, 51, 100],
      [35.5, 55.4, 101, 150],
      [55.5, 150.4, 151, 200],
      [150.5, 250.4, 201, 300],
      [250.5, 500.4, 301, 500]
    ];
    const pm10Bp = [
      [0, 54, 0, 50],
      [55, 154, 51, 100],
      [155, 254, 101, 150],
      [255, 354, 151, 200],
      [355, 424, 201, 300],
      [425, 604, 301, 500]
    ];
    const aqiPm25 = linearAqi(Math.max(0, pm25), pm25Bp);
    const aqiPm10 = linearAqi(Math.max(0, pm10), pm10Bp);
    const aqiO3 = Math.round(clamp(o3 * 0.55, 0, 180));
    const aqiNo2 = Math.round(clamp(no2 * 0.65, 0, 180));
    return Math.max(aqiPm25, aqiPm10, aqiO3, aqiNo2);
  }

  function classifyAqi(aqi) {
    if (aqi <= 50) {
      return {
        stage: 'good',
        label: 'İYİ',
        color: '#10B981',
        badge: 'EVRE 1 // DENGELİ BİYOSFER',
        desc: 'Canlı yaprak dokusu • Yüksek O₂ salınımı • Berrak atmosfer',
        synthTag: 'HARMONİK MAJÖR 9 // BERRAK UZAY AMBİYANSI'
      };
    }
    if (aqi <= 150) {
      return {
        stage: 'moderate',
        label: 'ORTA',
        color: '#F59E0B',
        badge: 'EVRE 2 // STRES ALTINDA EKOSİSTEM',
        desc: 'Klorofil kaybı • Dökülen yapraklar • Hafif aerosol pusu',
        synthTag: 'MİNÖR / SÜSPANSİYON AKOR // RÜZGAR TÜRBÜLANS MODU'
      };
    }
    return {
      stage: 'hazardous',
      label: 'TEHLİKELİ',
      color: '#EF4444',
      badge: 'EVRE 3 // KRİTİK BİYOSFER ALARMI',
      desc: 'Yaprak dökümü tamamlandı • Yoğun PM2.5 dumanı ve toksik stres',
      synthTag: 'DİSONANT BAS + PARTİKÜL PARAZİTİ // KRİTİK ALARM'
    };
  }

  /* Offline Cache & Geospatial Fallback Model */
  function readCache() {
    try {
      const raw = localStorage.getItem(CACHE_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function writeCache(key, payload) {
    try {
      const cache = readCache();
      cache[key] = { ...payload, timestamp: Date.now() };
      const keys = Object.keys(cache);
      if (keys.length > 40) {
        delete cache[keys[0]];
      }
      localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(cache));
    } catch {
      // Storage unavailable
    }
  }

  function inferMaritimeOrRegionName(lat, lng) {
    if (lat > 66.5) return { name: 'Arktik Gözlem Bölgesi', region: 'KUTUP ATMOSFERİ' };
    if (lat < -60) return { name: 'Antarktika Okyanus Kuşağı', region: 'GÜNEY KUTUP BÖLGESİ' };
    if (lng >= 26 && lng <= 45 && lat >= 36 && lat <= 42) return { name: 'Anadolu Gözlem Noktası', region: 'TÜRKİYE / AVRASYA' };
    if (lng > -65 && lng < -10 && lat > 0 && lat < 60) return { name: 'Kuzey Atlantik Okyanusu', region: 'DENİZEL REFERANS HAVA' };
    if (lng > -65 && lng < 15 && lat <= 0 && lat > -60) return { name: 'Güney Atlantik Okyanusu', region: 'OKYANUS ATMOSFERİ' };
    if ((lng <= -75 || lng >= 135) && lat > -55 && lat < 60) return { name: 'Büyük Okyanus (Pasifik)', region: 'AÇIK OKYANUS TELEMETRİSİ' };
    if (lng >= 40 && lng <= 110 && lat < 15 && lat > -55) return { name: 'Hint Okyanusu', region: 'TROPIK DENİZEL KATMAN' };
    if (lng >= -15 && lng <= 35 && lat >= 15 && lat <= 35) return { name: 'Sahra / Kuzey Afrika Kuşağı', region: 'ARİD TOZ KUŞAĞI' };
    if (lng >= -10 && lng <= 40 && lat > 35 && lat <= 66) return { name: 'Avrupa Kıta Gözlemi', region: 'KARASAL TELEMETRİ' };
    if (lng >= 65 && lng <= 140 && lat >= 18 && lat <= 55) return { name: 'Asya Kıta Gözlemi', region: 'YÜKSEK YOĞUNLUKLU KUŞAK' };
    if (lng >= -135 && lng <= -55 && lat >= 15 && lat <= 65) return { name: 'Kuzey Amerika Gözlemi', region: 'KARASAL TELEMETRİ' };
    if (lng >= -82 && lng <= -34 && lat >= -55 && lat < 15) return { name: 'Güney Amerika Havzası', region: 'EKVATORAL / TROPİK KUŞAK' };
    return { name: `Küresel Sektör (${lat.toFixed(1)}°, ${lng.toFixed(1)}°) `, region: 'UZAY TELEMETRİ NOKTASI' };
  }

  function buildDeterministicFallback(lat, lng) {
    const absLat = Math.abs(lat);
    const seed = Math.abs(Math.sin(lat * 12.9898 + lng * 78.233) * 43758.5453) % 1;
    const isOceanic =
      (lng > -62 && lng < -15 && lat > -50 && lat < 55) ||
      (lng < -125 || lng > 155) ||
      (lng > 45 && lng < 105 && lat < 5);

    if (isOceanic) {
      const pm25 = Number((3.4 + seed * 3.8).toFixed(1));
      const pm10 = Number((7.5 + seed * 6.5).toFixed(1));
      const no2 = Number((1.6 + seed * 2.4).toFixed(1));
      const o3 = Number((36 + seed * 18).toFixed(1));
      const aqi = computeAqiFromPollutants(pm25, pm10, no2, o3);
      return { pm25, pm10, no2, o3, eaqi: Math.round(aqi * 0.6), aqi };
    }

    const urbanBelt = absLat > 20 && absLat < 45 ? 1.55 : 0.9;
    const pm25 = Number((8 + seed * 26 * urbanBelt).toFixed(1));
    const pm10 = Number((pm25 * 1.75 + 6).toFixed(1));
    const no2 = Number((7 + seed * 28 * urbanBelt).toFixed(1));
    const o3 = Number((44 + seed * 36).toFixed(1));
    const aqi = computeAqiFromPollutants(pm25, pm10, no2, o3);
    return { pm25, pm10, no2, o3, eaqi: Math.round(aqi * 0.65), aqi };
  }

  async function reverseGeocode(lat, lng) {
    const geoFallback = inferMaritimeOrRegionName(lat, lng);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    try {
      const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&localityLanguage=tr`;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) return geoFallback;
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision;
      const country = data.countryName;
      if (city && country) {
        return { name: `${city}, ${country}`, region: 'UYDU KONUM DOĞRULANDI' };
      }
      if (country) {
        return { name: country, region: 'BÖLGESEL TELEMETRİ' };
      }
      if (data.localityInfo && Array.isArray(data.localityInfo.informative) && data.localityInfo.informative.length > 0) {
        const marine = data.localityInfo.informative[0].name;
        if (marine) return { name: marine, region: 'DENİZEL / AÇIK ALAN' };
      }
      return geoFallback;
    } catch {
      clearTimeout(timer);
      return geoFallback;
    }
  }

  async function fetchAirQualityTelemetry(lat, lng, presetStation = null) {
    const cacheKey = `${lat.toFixed(2)}_${lng.toFixed(2)}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5500);

    try {
      const apiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&current=european_aqi,us_aqi,pm10,pm2_5,nitrogen_dioxide,ozone`;
      const res = await fetch(apiUrl, { signal: controller.signal });
      clearTimeout(timer);

      if (!res.ok) throw new Error('API Error');
      const payload = await res.json();
      const cur = payload && payload.current;

      if (!cur || (cur.pm2_5 === null && cur.pm10 === null && cur.european_aqi === null)) {
        throw new Error('Empty ocean or grid point');
      }

      const pm25 = Number((cur.pm2_5 ?? 6.5).toFixed(1));
      const pm10 = Number((cur.pm10 ?? pm25 * 1.6).toFixed(1));
      const no2 = Number((cur.nitrogen_dioxide ?? 8.0).toFixed(1));
      const o3 = Number((cur.ozone ?? 48.0).toFixed(1));
      const eaqi = Math.round(cur.european_aqi ?? computeAqiFromPollutants(pm25, pm10, no2, o3) * 0.6);
      const aqi = cur.us_aqi != null ? Math.round(cur.us_aqi) : computeAqiFromPollutants(pm25, pm10, no2, o3);

      const metrics = { pm25, pm10, no2, o3, eaqi, aqi };
      writeCache(cacheKey, metrics);
      return { metrics, source: 'CANLI UYDU // OPEN-METEO API' };
    } catch {
      clearTimeout(timer);

      if (presetStation && presetStation.fallback) {
        const f = presetStation.fallback;
        const aqi = computeAqiFromPollutants(f.pm25, f.pm10, f.no2, f.o3);
        return {
          metrics: { ...f, aqi },
          source: 'ÇEVRİMDIŞI REFERANS VERİSİ'
        };
      }

      const cache = readCache();
      if (cache[cacheKey]) {
        return {
          metrics: cache[cacheKey],
          source: 'YEREL TELEMETRİ ÖNBELLEĞİ'
        };
      }

      return {
        metrics: buildDeterministicFallback(lat, lng),
        source: 'ÇEVRİMDIŞI ATMOSFER MODELİ'
      };
    }
  }

  /* Historical Comparison Model (1750 -> 2026) */
  function calculateEraMetrics(live, year, lat) {
    if (year >= 2026) {
      return { metrics: { ...live }, deltaPm25: 0 };
    }

    const progress = clamp((year - 1750) / (2026 - 1750), 0, 1);
    const anthroCurve = Math.pow(progress, 2.15);

    const dustFactor = Math.abs(lat) > 14 && Math.abs(lat) < 34 ? 1.55 : 1.0;
    const preIndustrial = {
      pm25: Math.min(live.pm25, 3.2 * dustFactor),
      pm10: Math.min(live.pm10, 7.8 * dustFactor),
      no2: Math.min(live.no2, 1.4),
      o3: Math.min(live.o3, 28.0)
    };

    const pm25 = Number((preIndustrial.pm25 + (live.pm25 - preIndustrial.pm25) * anthroCurve).toFixed(1));
    const pm10 = Number((preIndustrial.pm10 + (live.pm10 - preIndustrial.pm10) * anthroCurve).toFixed(1));
    const no2 = Number((preIndustrial.no2 + (live.no2 - preIndustrial.no2) * anthroCurve).toFixed(1));
    const o3 = Number((preIndustrial.o3 + (live.o3 - preIndustrial.o3) * anthroCurve).toFixed(1));
    const aqi = computeAqiFromPollutants(pm25, pm10, no2, o3);
    const eaqi = Math.round(aqi * 0.62);

    const deltaPm25 = live.pm25 > 0.5 ? Math.round(((pm25 - live.pm25) / live.pm25) * 100) : 0;
    return {
      metrics: { pm25, pm10, no2, o3, eaqi, aqi },
      deltaPm25
    };
  }

  /* Web Audio API Multi-Layer Sonification Engine */
  class AeroAudioEngine {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.dryGain = null;
      this.wetGain = null;
      this.reverbNode = null;
      this.compressor = null;
      this.analyser = null;
      this.padFilter = null;
      this.padOscs = [];
      this.padVoiceGains = [];
      this.subOsc = null;
      this.subGain = null;
      this.windSource = null;
      this.windFilter = null;
      this.windGain = null;
      this.staticSource = null;
      this.staticFilter = null;
      this.staticGain = null;
      this.lfoOsc = null;
      this.lfoGain = null;
      this.chimeInterval = null;
      this.currentMetrics = { aqi: 42, pm25: 12, pm10: 24, no2: 18, o3: 60 };
      this.isInitialized = false;
      this.isPlaying = false;
      this.volume = 0.72;
      this.muted = false;
    }

    init() {
      if (this.isInitialized) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.value = -14;
      this.compressor.knee.value = 18;
      this.compressor.ratio.value = 6;
      this.compressor.attack.value = 0.01;
      this.compressor.release.value = 0.25;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0;

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.84;

      this.dryGain = this.ctx.createGain();
      this.dryGain.gain.value = 0.72;

      this.wetGain = this.ctx.createGain();
      this.wetGain.gain.value = 0.42;

      this.reverbNode = this.ctx.createConvolver();
      this.reverbNode.buffer = this.createSpaceImpulse(2.8, 2.4);

      this.padFilter = this.ctx.createBiquadFilter();
      this.padFilter.type = 'lowpass';
      this.padFilter.frequency.value = 950;
      this.padFilter.Q.value = 1.1;

      const baseChord = [130.81, 196.0, 246.94, 329.63];
      baseChord.forEach((freq, idx) => {
        const oscA = this.ctx.createOscillator();
        const oscB = this.ctx.createOscillator();
        const voiceGain = this.ctx.createGain();

        oscA.type = idx === 0 ? 'triangle' : 'sine';
        oscB.type = 'triangle';
        oscA.frequency.value = freq;
        oscB.frequency.value = freq;
        oscB.detune.value = idx % 2 === 0 ? 4.5 : -4.5;

        voiceGain.gain.value = idx === 0 ? 0.16 : 0.1;

        oscA.connect(voiceGain);
        oscB.connect(voiceGain);
        voiceGain.connect(this.padFilter);

        oscA.start();
        oscB.start();

        this.padOscs.push({ oscA, oscB });
        this.padVoiceGains.push(voiceGain);
      });

      this.subOsc = this.ctx.createOscillator();
      this.subOsc.type = 'sine';
      this.subOsc.frequency.value = 65.41;
      this.subGain = this.ctx.createGain();
      this.subGain.gain.value = 0.16;
      this.subOsc.connect(this.subGain);
      this.subGain.connect(this.padFilter);
      this.subOsc.start();

      this.lfoOsc = this.ctx.createOscillator();
      this.lfoOsc.type = 'sine';
      this.lfoOsc.frequency.value = 0.09;
      this.lfoGain = this.ctx.createGain();
      this.lfoGain.gain.value = 220;
      this.lfoOsc.connect(this.lfoGain);
      this.lfoGain.connect(this.padFilter.frequency);
      this.lfoOsc.start();

      this.padFilter.connect(this.dryGain);
      this.padFilter.connect(this.reverbNode);

      /* Atmospheric Wind Layer (Pink Noise) */
      const pinkBuffer = this.createPinkNoiseBuffer(4.0);
      this.windSource = this.ctx.createBufferSource();
      this.windSource.buffer = pinkBuffer;
      this.windSource.loop = true;

      this.windFilter = this.ctx.createBiquadFilter();
      this.windFilter.type = 'bandpass';
      this.windFilter.frequency.value = 720;
      this.windFilter.Q.value = 1.6;

      this.windGain = this.ctx.createGain();
      this.windGain.gain.value = 0.08;

      this.windSource.connect(this.windFilter);
      this.windFilter.connect(this.windGain);
      this.windGain.connect(this.dryGain);
      this.windGain.connect(this.reverbNode);
      this.windSource.start();

      /* Particulate Static / Radio Interference Layer */
      const crackleBuffer = this.createCrackleNoiseBuffer(3.0);
      this.staticSource = this.ctx.createBufferSource();
      this.staticSource.buffer = crackleBuffer;
      this.staticSource.loop = true;

      this.staticFilter = this.ctx.createBiquadFilter();
      this.staticFilter.type = 'bandpass';
      this.staticFilter.frequency.value = 2400;
      this.staticFilter.Q.value = 2.2;

      this.staticGain = this.ctx.createGain();
      this.staticGain.gain.value = 0.0;

      this.staticSource.connect(this.staticFilter);
      this.staticFilter.connect(this.staticGain);
      this.staticGain.connect(this.dryGain);
      this.staticSource.start();

      this.reverbNode.connect(this.wetGain);
      this.dryGain.connect(this.masterGain);
      this.wetGain.connect(this.masterGain);

      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      this.isInitialized = true;
      this.updateSonification(this.currentMetrics);
    }

    createSpaceImpulse(duration, decay) {
      const rate = this.ctx.sampleRate;
      const length = Math.floor(rate * duration);
      const impulse = this.ctx.createBuffer(2, length, rate);
      for (let ch = 0; ch < 2; ch++) {
        const data = impulse.getChannelData(ch);
        for (let i = 0; i < length; i++) {
          const env = Math.pow(1 - i / length, decay);
          data[i] = (Math.random() * 2 - 1) * env * 0.65;
        }
      }
      return impulse;
    }

    createPinkNoiseBuffer(seconds) {
      const size = Math.floor(this.ctx.sampleRate * seconds);
      const buffer = this.ctx.createBuffer(1, size, this.ctx.sampleRate);
      const out = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < size; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        out[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
        b6 = white * 0.115926;
      }
      return buffer;
    }

    createCrackleNoiseBuffer(seconds) {
      const size = Math.floor(this.ctx.sampleRate * seconds);
      const buffer = this.ctx.createBuffer(1, size, this.ctx.sampleRate);
      const out = buffer.getChannelData(0);
      for (let i = 0; i < size; i++) {
        const rnd = Math.random();
        out[i] = rnd > 0.985 ? (Math.random() * 2 - 1) * 0.85 : (Math.random() * 2 - 1) * 0.04;
      }
      return buffer;
    }

    async start() {
      this.init();
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      this.isPlaying = true;
      const now = this.ctx.currentTime;
      const targetGain = this.muted ? 0 : this.volume * 0.72;
      this.masterGain.gain.setTargetAtTime(targetGain, now, 0.35);
      this.startChimeScheduler();
      this.updateSonification(this.currentMetrics);
    }

    stop() {
      if (!this.isInitialized) return;
      this.isPlaying = false;
      const now = this.ctx.currentTime;
      this.masterGain.gain.setTargetAtTime(0, now, 0.25);
      this.stopChimeScheduler();
    }

    setVolume(val) {
      this.volume = clamp(val, 0, 1);
      if (!this.isInitialized || !this.isPlaying) return;
      const target = this.muted ? 0 : this.volume * 0.72;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.08);
    }

    setMuted(muted) {
      this.muted = muted;
      if (!this.isInitialized || !this.isPlaying) return;
      const target = this.muted ? 0 : this.volume * 0.72;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.08);
    }

    updateSonification(metrics) {
      this.currentMetrics = metrics;
      if (!this.isInitialized) return;

      const now = this.ctx.currentTime;
      const aqi = metrics.aqi ?? 35;
      const pm25 = metrics.pm25 ?? 10;
      const no2 = metrics.no2 ?? 12;

      let chord;
      let subFreq;
      let cutoff;
      let windFreq;
      let windLevel;
      let detuneSpread;

      if (aqi <= 50) {
        chord = [130.81, 196.0, 246.94, 329.63]; // Cmaj9 peaceful space pad
        subFreq = 65.41;
        cutoff = 1150;
        windFreq = 860;
        windLevel = 0.065;
        detuneSpread = 4.5;
      } else if (aqi <= 150) {
        chord = [130.81, 174.61, 233.08, 311.13]; // Cm11 unresolved tension
        subFreq = 65.41;
        cutoff = 720;
        windFreq = 540;
        windLevel = 0.11;
        detuneSpread = 12;
      } else {
        chord = [123.47, 138.59, 185.0, 277.18]; // Dissonant tritone / minor 2nd cluster
        subFreq = 58.27;
        cutoff = 420;
        windFreq = 320;
        windLevel = 0.16;
        detuneSpread = 22;
      }

      this.padOscs.forEach((voice, idx) => {
        const freq = chord[idx] || 196;
        voice.oscA.frequency.setTargetAtTime(freq, now, 0.75);
        voice.oscB.frequency.setTargetAtTime(freq, now, 0.75);
        voice.oscB.detune.setTargetAtTime(idx % 2 === 0 ? detuneSpread : -detuneSpread, now, 0.6);
      });

      this.subOsc.frequency.setTargetAtTime(subFreq, now, 0.75);
      const subPresence = clamp(0.14 + (no2 / 140) * 0.18, 0.12, 0.34);
      this.subGain.gain.setTargetAtTime(subPresence, now, 0.6);

      this.padFilter.frequency.setTargetAtTime(cutoff, now, 0.75);
      this.windFilter.frequency.setTargetAtTime(windFreq, now, 0.75);
      this.windGain.gain.setTargetAtTime(windLevel, now, 0.6);

      const staticLevel = pm25 > 16 ? clamp(((pm25 - 16) / 145) * 0.24, 0, 0.26) : 0.004;
      this.staticGain.gain.setTargetAtTime(staticLevel, now, 0.5);
    }

    startChimeScheduler() {
      this.stopChimeScheduler();
      this.triggerBioPulse();
      this.chimeInterval = setInterval(() => {
        if (this.isPlaying) {
          this.triggerBioPulse();
        }
      }, 2400);
    }

    stopChimeScheduler() {
      if (this.chimeInterval) {
        clearInterval(this.chimeInterval);
        this.chimeInterval = null;
      }
    }

    triggerBioPulse() {
      if (!this.isInitialized || !this.isPlaying) return;
      const now = this.ctx.currentTime;
      const aqi = this.currentMetrics.aqi ?? 35;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      let notes;
      let attack = 0.04;
      let release = 2.2;
      let peak = 0.065;

      if (aqi <= 50) {
        notes = [523.25, 659.25, 783.99, 987.77, 1174.66];
        osc.type = 'sine';
      } else if (aqi <= 150) {
        notes = [392.0, 466.16, 523.25, 622.25];
        osc.type = 'triangle';
        release = 1.6;
        peak = 0.05;
      } else {
        notes = [185.0, 207.65, 277.18, 369.99];
        osc.type = 'sawtooth';
        attack = 0.015;
        release = 0.9;
        peak = 0.035;
      }

      const chosen = notes[Math.floor(Math.random() * notes.length)];
      osc.frequency.setValueAtTime(chosen, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(peak, now + attack);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + release);

      const noteFilter = this.ctx.createBiquadFilter();
      noteFilter.type = 'lowpass';
      noteFilter.frequency.value = aqi > 150 ? 950 : 2800;

      osc.connect(noteFilter);
      noteFilter.connect(gain);
      gain.connect(this.reverbNode);
      gain.connect(this.dryGain);

      osc.start(now);
      osc.stop(now + release + 0.1);
    }

    getAnalyser() {
      return this.analyser;
    }
  }

  const audioEngine = new AeroAudioEngine();

  /* Leaflet Map & Radar Marker */
  let map;
  let activeRadarMarker;

  function createRadarIcon() {
    return L.divIcon({
      className: '',
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      html: `
        <div class="radar-marker-wrapper">
          <div class="radar-ring"></div>
          <div class="radar-ring-secondary"></div>
          <div class="radar-core"></div>
        </div>
      `
    });
  }

  function addTelemetryGraticule() {
    const gridStyle = {
      color: '#1E2D45',
      weight: 0.7,
      opacity: 0.45,
      interactive: false
    };

    for (let lat = -75; lat <= 75; lat += 15) {
      L.polyline([[lat, -180], [lat, 180]], gridStyle).addTo(map);
    }
    for (let lng = -180; lng <= 180; lng += 30) {
      L.polyline([[-85, lng], [85, lng]], gridStyle).addTo(map);
    }
  }

  function initMap() {
    map = L.map('worldMap', {
      center: [state.lat, state.lng],
      zoom: 4,
      minZoom: 2,
      maxZoom: 16,
      zoomControl: false,
      worldCopyJump: true
    });

    const darkBaseLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      {
        maxNativeZoom: 16,
        maxZoom: 18,
        zIndex: 200,
        className: 'esri-dark-tiles',
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
      }
    ).addTo(map);

    const darkLabelsLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
      {
        maxNativeZoom: 16,
        maxZoom: 18,
        zIndex: 201,
        className: 'esri-label-tiles'
      }
    ).addTo(map);

    let tileErrorCount = 0;
    let fallbackActivated = false;
    darkBaseLayer.on('tileerror', () => {
      tileErrorCount += 1;
      if (tileErrorCount >= 4 && !fallbackActivated) {
        fallbackActivated = true;
        map.removeLayer(darkBaseLayer);
        map.removeLayer(darkLabelsLayer);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          className: 'osm-dark-inverted',
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
      }
    });

    addTelemetryGraticule();

    STATIONS.forEach((station) => {
      const markerIcon = L.divIcon({
        className: '',
        iconSize: [12, 12],
        iconAnchor: [6, 6],
        html: '<div class="station-pin"></div>'
      });

      const pin = L.marker([station.lat, station.lng], { icon: markerIcon }).addTo(map);
      pin.bindTooltip(station.name, { direction: 'top', offset: [0, -6], className: 'telemetry-tooltip' });
      pin.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        selectPresetStation(station.id);
      });
    });

    activeRadarMarker = L.marker([state.lat, state.lng], {
      icon: createRadarIcon(),
      interactive: false,
      zIndexOffset: 500
    }).addTo(map);

    map.on('click', (e) => {
      const lat = clamp(e.latlng.lat, -85, 85);
      const lng = normalizeLng(e.latlng.lng);
      selectCustomCoordinate(lat, lng);
    });

    dom.zoomInBtn.addEventListener('click', () => map.zoomIn());
    dom.zoomOutBtn.addEventListener('click', () => map.zoomOut());
    dom.resetMapBtn.addEventListener('click', () => map.setView([24, 15], 2, { animate: true }));
  }

  /* Biosphere Canvas Particle System */
  const biosphereParticles = [];
  let biosphereCtx = null;

  function resizeCanvasHiDpi(canvas) {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor(rect.width * dpr));
    const height = Math.max(1, Math.floor(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    return { width: rect.width, height: rect.height, dpr };
  }

  function spawnParticle(stage, w, h) {
    if (stage === 'good') {
      return {
        x: w * (0.22 + Math.random() * 0.56),
        y: h * (0.35 + Math.random() * 0.45),
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(0.35 + Math.random() * 0.65),
        size: 1.5 + Math.random() * 2.4,
        alpha: 0.25 + Math.random() * 0.65,
        angle: Math.random() * Math.PI * 2,
        type: 'oxygen'
      };
    }
    if (stage === 'moderate') {
      return {
        x: w * (0.24 + Math.random() * 0.52),
        y: h * (0.18 + Math.random() * 0.32),
        vx: 0.45 + (Math.random() - 0.2) * 0.6,
        vy: 0.55 + Math.random() * 0.75,
        size: 3.2 + Math.random() * 2.6,
        alpha: 0.5 + Math.random() * 0.4,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.06,
        type: 'leaf'
      };
    }
    return {
      x: Math.random() * w,
      y: h * (0.12 + Math.random() * 0.78),
      vx: 1.1 + Math.random() * 1.9,
      vy: (Math.random() - 0.5) * 0.45,
      size: 2 + Math.random() * 4.2,
      alpha: 0.2 + Math.random() * 0.45,
      isToxic: Math.random() > 0.68,
      type: 'smog'
    };
  }

  function animateBiosphereParticles() {
    const { width, height, dpr } = resizeCanvasHiDpi(dom.biosphereCanvas);
    if (!biosphereCtx) {
      biosphereCtx = dom.biosphereCanvas.getContext('2d');
    }
    biosphereCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    biosphereCtx.clearRect(0, 0, width, height);

    const targetCount = state.stage === 'good' ? 24 : state.stage === 'moderate' ? 20 : 48;

    while (biosphereParticles.length < targetCount) {
      biosphereParticles.push(spawnParticle(state.stage, width, height));
    }
    if (biosphereParticles.length > targetCount) {
      biosphereParticles.length = targetCount;
    }

    for (let i = 0; i < biosphereParticles.length; i++) {
      const p = biosphereParticles[i];
      const expectedType = state.stage === 'good' ? 'oxygen' : state.stage === 'moderate' ? 'leaf' : 'smog';
      if (p.type !== expectedType) {
        biosphereParticles[i] = spawnParticle(state.stage, width, height);
        continue;
      }

      p.x += p.vx;
      p.y += p.vy;

      if (p.type === 'oxygen') {
        p.x += Math.sin(p.angle) * 0.22;
        p.angle += 0.04;
        if (p.y < height * 0.08) {
          biosphereParticles[i] = spawnParticle('good', width, height);
          continue;
        }
        biosphereCtx.beginPath();
        biosphereCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        biosphereCtx.fillStyle = `rgba(52, 211, 153, ${p.alpha})`;
        biosphereCtx.shadowColor = '#10B981';
        biosphereCtx.shadowBlur = 8;
        biosphereCtx.fill();
        biosphereCtx.shadowBlur = 0;
      } else if (p.type === 'leaf') {
        p.angle += p.spin;
        p.x += Math.sin(p.angle * 1.4) * 0.35;
        if (p.y > height * 0.9 || p.x > width + 12) {
          biosphereParticles[i] = spawnParticle('moderate', width, height);
          continue;
        }
        biosphereCtx.save();
        biosphereCtx.translate(p.x, p.y);
        biosphereCtx.rotate(p.angle);
        biosphereCtx.fillStyle = `rgba(245, 158, 11, ${p.alpha})`;
        biosphereCtx.beginPath();
        biosphereCtx.ellipse(0, 0, p.size, p.size * 0.52, 0, 0, Math.PI * 2);
        biosphereCtx.fill();
        biosphereCtx.restore();
      } else {
        if (p.x > width + 16 || p.y < 0 || p.y > height) {
          biosphereParticles[i] = spawnParticle('hazardous', width, height);
          biosphereParticles[i].x = -10;
          continue;
        }
        biosphereCtx.beginPath();
        biosphereCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        biosphereCtx.fillStyle = p.isToxic
          ? `rgba(239, 68, 68, ${p.alpha * 0.65})`
          : `rgba(148, 163, 184, ${p.alpha * 0.55})`;
        biosphereCtx.fill();
      }
    }

    requestAnimationFrame(animateBiosphereParticles);
  }

  /* Jukebox Spectrum & Waveform Visualizer */
  let vizCtx = null;
  let vizPhase = 0;

  function renderAudioVisualizer() {
    const { width, height, dpr } = resizeCanvasHiDpi(dom.visualizerCanvas);
    if (!vizCtx) {
      vizCtx = dom.visualizerCanvas.getContext('2d');
    }
    vizCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    vizCtx.clearRect(0, 0, width, height);

    const aqiColor = getComputedStyle(document.documentElement).getPropertyValue('--aqi-color').trim() || '#00D2FF';
    const analyser = audioEngine.getAnalyser();

    if (state.isPlaying && analyser) {
      const freqLen = analyser.frequencyBinCount;
      const freqData = new Uint8Array(freqLen);
      const timeData = new Uint8Array(freqLen);
      analyser.getByteFrequencyData(freqData);
      analyser.getByteTimeDomainData(timeData);

      const barCount = 36;
      const gap = 3;
      const barWidth = Math.max(2, (width - gap * (barCount - 1)) / barCount);

      for (let i = 0; i < barCount; i++) {
        const binIdx = Math.floor((i / barCount) * (freqLen * 0.72));
        const val = freqData[binIdx] / 255;
        const barH = Math.max(3, val * (height - 8));
        const x = i * (barWidth + gap);
        const y = height - barH - 2;

        const grad = vizCtx.createLinearGradient(0, y, 0, height);
        grad.addColorStop(0, '#00D2FF');
        grad.addColorStop(1, aqiColor);
        vizCtx.fillStyle = grad;
        vizCtx.fillRect(x, y, barWidth, barH);
      }

      vizCtx.beginPath();
      vizCtx.strokeStyle = 'rgba(241, 245, 249, 0.72)';
      vizCtx.lineWidth = 1.3;
      for (let i = 0; i < freqLen; i++) {
        const x = (i / (freqLen - 1)) * width;
        const y = (timeData[i] / 255) * height;
        if (i === 0) vizCtx.moveTo(x, y);
        else vizCtx.lineTo(x, y);
      }
      vizCtx.stroke();
    } else {
      vizPhase += 0.035;
      vizCtx.beginPath();
      vizCtx.strokeStyle = 'rgba(0, 210, 255, 0.42)';
      vizCtx.lineWidth = 1.4;
      for (let x = 0; x <= width; x += 3) {
        const y = height / 2 + Math.sin(x * 0.04 + vizPhase) * 4.5 + Math.cos(x * 0.09 - vizPhase) * 2;
        if (x === 0) vizCtx.moveTo(x, y);
        else vizCtx.lineTo(x, y);
      }
      vizCtx.stroke();
    }

    requestAnimationFrame(renderAudioVisualizer);
  }

  /* Speech Synthesis Accessibility */
  function speakTelemetry(force = false) {
    if (!state.voiceEnabled && !force) return;
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const m = state.activeMetrics;
    const status = classifyAqi(m.aqi);
    const eraPrefix = state.timelineYear < 2026 ? `${state.timelineYear} yılı simülasyonu. ` : '';
    const text = `${eraPrefix}Konum: ${state.locationName}. Hava Kalitesi İndeksi ${m.aqi}. Durum: ${status.label}. P M 2.5 değeri ${m.pm25} mikrogram.`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR';
    utterance.rate = 1.02;

    const voices = window.speechSynthesis.getVoices();
    const trVoice = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('tr'));
    if (trVoice) utterance.voice = trVoice;

    window.speechSynthesis.speak(utterance);
  }

  /* UI Synchronization */
  function renderTelemetry() {
    const m = state.activeMetrics;
    const info = classifyAqi(m.aqi);
    state.stage = info.stage;

    document.documentElement.style.setProperty('--aqi-color', info.color);

    const coordStr = formatCoords(state.lat, state.lng);
    dom.mapCoordReadout.textContent = coordStr;
    dom.locationCoords.textContent = coordStr;
    dom.locationName.textContent = state.locationName;
    dom.locationRegion.textContent = state.locationRegion;
    dom.dataSourceBadge.textContent = state.timelineYear < 2026
      ? `TARİHSEL MODEL // ${state.timelineYear}`
      : state.dataSource;

    dom.aqiValue.textContent = m.aqi;
    dom.aqiCategory.textContent = info.label;
    dom.aqiSubMetric.textContent = `European AQI: ${m.eaqi}`;
    dom.aqiMeterFill.style.width = `${clamp((m.aqi / 220) * 100, 6, 100)}%`;

    dom.biosphereStage.classList.remove('stage-good', 'stage-moderate', 'stage-hazardous');
    dom.biosphereStage.classList.add(`stage-${info.stage}`);
    dom.biosphereStageLabel.textContent = info.badge;
    dom.biosphereStageDesc.textContent = info.desc;

    dom.valPm25.textContent = m.pm25.toFixed(1);
    dom.barPm25.style.width = `${clamp((m.pm25 / 150) * 100, 4, 100)}%`;

    dom.valPm10.textContent = m.pm10.toFixed(1);
    dom.barPm10.style.width = `${clamp((m.pm10 / 220) * 100, 4, 100)}%`;

    dom.valNo2.textContent = m.no2.toFixed(1);
    dom.barNo2.style.width = `${clamp((m.no2 / 100) * 100, 4, 100)}%`;

    dom.valO3.textContent = m.o3.toFixed(1);
    dom.barO3.style.width = `${clamp((m.o3 / 140) * 100, 4, 100)}%`;

    dom.jukeboxTitle.textContent = state.locationName;
    dom.jukeboxStatus.textContent = `AQI ${m.aqi} • ${info.label}`;
    dom.sonificationModeText.textContent = state.isPlaying
      ? `AKTİF // ${info.synthTag}`
      : `HAZIR // ${info.synthTag}`;

    audioEngine.updateSonification(m);
  }

  function applyTimelineAndRender(speak = false) {
    const year = state.timelineYear;
    dom.timelineYearBadge.textContent = year;
    dom.timelineSlider.value = year;

    dom.eraTicks.forEach((tick) => {
      tick.classList.toggle('active', Number(tick.dataset.year) === year);
    });

    const { metrics, deltaPm25 } = calculateEraMetrics(state.liveMetrics, year, state.lat);
    state.activeMetrics = metrics;

    if (year >= 2026) {
      dom.timelineModeLabel.textContent = 'Güncel Uydu Verisi (2026)';
      dom.timelineDeltaBadge.classList.add('hidden');
    } else if (year <= 1780) {
      dom.timelineModeLabel.textContent = 'Sanayi Öncesi Doğal Referans';
      dom.timelineDeltaBadge.textContent = `PM2.5 ${deltaPm25}%`;
      dom.timelineDeltaBadge.classList.remove('hidden');
    } else {
      dom.timelineModeLabel.textContent = `Tarihsel Atmosfer Projeksiyonu (${year})`;
      dom.timelineDeltaBadge.textContent = `PM2.5 ${deltaPm25}%`;
      dom.timelineDeltaBadge.classList.remove('hidden');
    }

    renderTelemetry();
    if (speak) speakTelemetry();
  }

  function highlightActiveStationButton(stationId) {
    state.activeStationId = stationId;
    dom.presetBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.station === stationId);
    });
  }

  async function selectPresetStation(stationId) {
    const station = STATIONS.find((s) => s.id === stationId);
    if (!station) return;

    highlightActiveStationButton(station.id);
    state.lat = station.lat;
    state.lng = station.lng;
    state.locationName = station.shortName;
    state.locationRegion = station.region;
    state.dataSource = 'UYDU BAĞLANTISI KURULUYOR...';

    if (map && activeRadarMarker) {
      activeRadarMarker.setLatLng([station.lat, station.lng]);
      map.flyTo([station.lat, station.lng], 5, { duration: 1.1 });
    }

    renderTelemetry();

    const { metrics, source } = await fetchAirQualityTelemetry(station.lat, station.lng, station);
    state.liveMetrics = metrics;
    state.dataSource = source;
    applyTimelineAndRender(true);
  }

  async function selectCustomCoordinate(lat, lng, presetMeta = null) {
    highlightActiveStationButton(null);
    state.lat = lat;
    state.lng = lng;
    state.locationName = presetMeta ? presetMeta.name : 'Koordinat Taranıyor...';
    state.locationRegion = presetMeta ? presetMeta.region : 'ÖZEL TELEMETRİ NOKTASI';
    state.dataSource = 'UYDU SORGULANIYOR...';

    if (map && activeRadarMarker) {
      activeRadarMarker.setLatLng([lat, lng]);
    }

    renderTelemetry();

    const [geoInfo, telemetryResult] = await Promise.all([
      presetMeta ? Promise.resolve(presetMeta) : reverseGeocode(lat, lng),
      fetchAirQualityTelemetry(lat, lng, presetMeta)
    ]);

    state.locationName = geoInfo.name;
    state.locationRegion = geoInfo.region;
    state.liveMetrics = telemetryResult.metrics;
    state.dataSource = telemetryResult.source;
    applyTimelineAndRender(true);
  }

  function exploreRandomLocation() {
    const explorePool = [
      ...RANDOM_EXPLORE_POINTS,
      ...STATIONS.map((s) => ({
        name: s.shortName,
        region: s.region,
        lat: s.lat,
        lng: s.lng,
        fallback: s.fallback
      }))
    ];
    const filtered = explorePool.filter((p) => Math.abs(p.lat - state.lat) > 1 || Math.abs(p.lng - state.lng) > 1);
    const chosen = filtered[Math.floor(Math.random() * filtered.length)] || RANDOM_EXPLORE_POINTS[0];

    if (map) {
      map.flyTo([chosen.lat, chosen.lng], 5, { duration: 1.2 });
    }
    selectCustomCoordinate(chosen.lat, chosen.lng, chosen);
  }

  function cycleStation(direction) {
    const currentIndex = STATIONS.findIndex((s) => s.id === state.activeStationId);
    const baseIndex = currentIndex === -1 ? 0 : currentIndex;
    const nextIndex = (baseIndex + direction + STATIONS.length) % STATIONS.length;
    selectPresetStation(STATIONS[nextIndex].id);
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
      await audioEngine.start();
      state.isPlaying = true;
      dom.playPauseBtn.classList.add('playing');
      dom.playIcon.classList.add('hidden');
      dom.pauseIcon.classList.remove('hidden');
      dom.playBtnLabel.textContent = 'DURAKLAT';
    }
    renderTelemetry();
  }

  function toggleVoiceNarration() {
    state.voiceEnabled = !state.voiceEnabled;
    dom.voiceToggleBtn.setAttribute('aria-pressed', String(state.voiceEnabled));
    dom.voiceToggleState.textContent = state.voiceEnabled ? 'Açık' : 'Kapalı';
    if (state.voiceEnabled) {
      speakTelemetry(true);
    } else if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  function toggleMute() {
    state.isMuted = !state.isMuted;
    audioEngine.setMuted(state.isMuted);
    dom.volHighIcon.classList.toggle('hidden', state.isMuted);
    dom.volMuteIcon.classList.toggle('hidden', !state.isMuted);
  }

  function switchView(viewName) {
    const isTeam = viewName === 'team';
    dom.tabMonitor.classList.toggle('active', !isTeam);
    dom.tabMonitor.setAttribute('aria-selected', String(!isTeam));
    dom.tabTeam.classList.toggle('active', isTeam);
    dom.tabTeam.setAttribute('aria-selected', String(isTeam));
    dom.teamView.classList.toggle('hidden', !isTeam);
    if (!isTeam && map) {
      setTimeout(() => map.invalidateSize(), 60);
    }
  }

  function bindEvents() {
    dom.tabMonitor.addEventListener('click', () => switchView('monitor'));
    dom.tabTeam.addEventListener('click', () => switchView('team'));
    dom.closeTeamBtn.addEventListener('click', () => switchView('monitor'));

    dom.voiceToggleBtn.addEventListener('click', toggleVoiceNarration);

    dom.presetBtns.forEach((btn) => {
      btn.addEventListener('click', () => selectPresetStation(btn.dataset.station));
    });

    dom.timelineSlider.addEventListener('input', (e) => {
      state.timelineYear = Number(e.target.value);
      applyTimelineAndRender(false);
    });

    dom.timelineSlider.addEventListener('change', () => {
      if (state.voiceEnabled) speakTelemetry();
    });

    dom.eraTicks.forEach((tick) => {
      tick.addEventListener('click', () => {
        state.timelineYear = Number(tick.dataset.year);
        applyTimelineAndRender(true);
      });
    });

    dom.playPauseBtn.addEventListener('click', togglePlayback);
    dom.prevStationBtn.addEventListener('click', () => cycleStation(-1));
    dom.nextStationBtn.addEventListener('click', () => cycleStation(1));
    dom.randomLocBtn.addEventListener('click', exploreRandomLocation);

    dom.muteBtn.addEventListener('click', toggleMute);
    dom.volumeSlider.addEventListener('input', (e) => {
      const val = Number(e.target.value);
      state.volume = val / 100;
      dom.volumeValue.textContent = `${val}%`;
      if (state.isMuted && val > 0) toggleMute();
      audioEngine.setVolume(state.volume);
    });

    dom.shortcutsBtn.addEventListener('click', () => dom.shortcutsModal.classList.remove('hidden'));
    dom.closeShortcutsBtn.addEventListener('click', () => dom.shortcutsModal.classList.add('hidden'));
    dom.shortcutsModal.addEventListener('click', (e) => {
      if (e.target === dom.shortcutsModal) dom.shortcutsModal.classList.add('hidden');
    });

    document.addEventListener('keydown', (e) => {
      const tag = document.activeElement ? document.activeElement.tagName : '';
      const isSlider = tag === 'INPUT' && document.activeElement.type === 'range';
      if (tag === 'TEXTAREA' || (tag === 'INPUT' && !isSlider)) return;

      if (e.code === 'Escape') {
        if (!dom.shortcutsModal.classList.contains('hidden')) {
          dom.shortcutsModal.classList.add('hidden');
        } else if (!dom.teamView.classList.contains('hidden')) {
          switchView('monitor');
        }
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayback();
      } else if (e.code === 'ArrowRight' && !isSlider) {
        e.preventDefault();
        cycleStation(1);
      } else if (e.code === 'ArrowLeft' && !isSlider) {
        e.preventDefault();
        cycleStation(-1);
      } else if (e.key === 'r' || e.key === 'R') {
        exploreRandomLocation();
      } else if (e.key === 'v' || e.key === 'V') {
        toggleVoiceNarration();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
    });
  }

  function bootstrap() {
    initMap();
    bindEvents();
    animateBiosphereParticles();
    renderAudioVisualizer();
    selectPresetStation('denizli');
  }

  document.addEventListener('DOMContentLoaded', bootstrap);
})();
