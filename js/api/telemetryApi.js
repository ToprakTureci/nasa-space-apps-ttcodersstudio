/**
 * AeroJukebox — 8 Parametreli Hava & Yangın Riski ve Çok Dilli Çeviri API
 */
(() => {
  'use strict';

  function linearAqi(conc, breakpoints) {
    for (const [cLow, cHigh, iLow, iHigh] of breakpoints) {
      if (conc <= cHigh) {
        return Math.round(((iHigh - iLow) / (cHigh - cLow)) * (conc - cLow) + iLow);
      }
    }
    return 400;
  }

  function computeAqi(pm25, pm10, no2, o3) {
    const pm25Bp = [[0, 12, 0, 50], [12.1, 35.4, 51, 100], [35.5, 55.4, 101, 150], [55.5, 150.4, 151, 200], [150.5, 250.4, 201, 300]];
    const pm10Bp = [[0, 54, 0, 50], [55, 154, 51, 100], [155, 254, 101, 150], [255, 354, 151, 200], [355, 424, 201, 300]];
    const aqiPm25 = linearAqi(Math.max(0, pm25), pm25Bp);
    const aqiPm10 = linearAqi(Math.max(0, pm10), pm10Bp);
    const aqiO3 = Math.round(Math.min(180, Math.max(0, o3 * 0.55)));
    const aqiNo2 = Math.round(Math.min(180, Math.max(0, no2 * 0.65)));
    return Math.max(aqiPm25, aqiPm10, aqiO3, aqiNo2);
  }

  function classifyAqi(aqi, lang = 'tr') {
    let stage, color, label, badge, desc, synthTag;

    if (aqi <= 30) {
      stage = 'stage1'; color = '#10B981';
      label = { tr: 'MÜKEMMEL', en: 'EXCELLENT', de: 'EXZELLENT', fr: 'EXCELLENT', cs: 'VÝBORNÉ' }[lang];
      badge = { tr: 'EVRE 1 // MÜKEMMEL BİYOSFER', en: 'STAGE 1 // PRISTINE BIOSPHERE', de: 'STUFE 1 // PERFEKTE BIOSPHÄRE', fr: 'ÉTAPE 1 // BIOSPHÈRE PARFAITE', cs: 'FÁZE 1 // DOKONALÁ BIOSFÉRA' }[lang];
      desc = { tr: 'Gür zümrüt doku • Zirve O₂ üretimi • Çiçeklenme', en: 'Lush emerald foliage • Peak O2 output • Blossoming', de: 'Üppiges Smaragdlaub • Spitzen-O2 • Blüte', fr: 'Feuillage émeraude • Pic d’O2 • Floraison', cs: 'Svěží smaragdové listí • Špičkový O2 • Kvetení' }[lang];
      synthTag = 'C LYDIAN // PENTATONIC CHIMES';
    } else if (aqi <= 60) {
      stage = 'stage2'; color = '#34D399';
      label = { tr: 'DENGELİ', en: 'BALANCED', de: 'AUSGEGLICHEN', fr: 'ÉQUILIBRÉ', cs: 'VYVÁŽENÉ' }[lang];
      badge = { tr: 'EVRE 2 // DENGELİ EKOSİSTEM', en: 'STAGE 2 // BALANCED ECOSYSTEM', de: 'STUFE 2 // AUSGEGLICHEN', fr: 'ÉTAPE 2 // ÉCOSYSTÈME ÉQUILIBRÉ', cs: 'FÁZE 2 // VYVÁŽENÝ EKOSYSTÉM' }[lang];
      desc = { tr: 'Doğal yeşil kanopi • Dengeli fotosentez', en: 'Natural canopy • Steady photosynthesis', de: 'Natürliche Baumkrone • Stabile Photosynthese', fr: 'Canopée naturelle • Photosynthèse stable', cs: 'Přirozená koruna • Stabilní fotosyntéza' }[lang];
      synthTag = 'C MAJ9 // AMBIENT SPACE PAD';
    } else if (aqi <= 100) {
      stage = 'stage3'; color = '#F59E0B';
      label = { tr: 'HAFİF STRES', en: 'MILD STRESS', de: 'LEICHTER STRESS', fr: 'STRESS MODÉRÉ', cs: 'MÍRNÝ STRES' }[lang];
      badge = { tr: 'EVRE 3 // HAFİF STRES & SARARMA', en: 'STAGE 3 // CHLOROPHYLL LOSS', de: 'STUFE 3 // CHLOROPHYLLVERLUST', fr: 'ÉTAPE 3 // PERTE DE CHLOROPHYLLE', cs: 'FÁZE 3 // ZTRÁTA CHLOROFYLU' }[lang];
      desc = { tr: 'Klorofil kaybı • Kehribar yapraklar • İlk dökülme', en: 'Chlorophyll decline • Amber foliage • Early shedding', de: 'Chlorophyllrückgang • Bernsteinfarben', fr: 'Baisse de chlorophylle • Feuilles ambrées', cs: 'Pokles chlorofylu • Jantarové listí' }[lang];
      synthTag = 'D DORIAN // SUSPENSION CHORD';
    } else if (aqi <= 175) {
      stage = 'stage4'; color = '#F97316';
      label = { tr: 'YÜKSEK STRES', en: 'HIGH STRESS', de: 'HOHER STRESS', fr: 'STRESS ÉLEVÉ', cs: 'VYSOKÝ STRES' }[lang];
      badge = { tr: 'EVRE 4 // YÜKSEK BİYOSFER STRESİ', en: 'STAGE 4 // HEAVY CANOPY LOSS', de: 'STUFE 4 // SCHWERER BLATTFALL', fr: 'ÉTAPE 4 // CHUTE DE FEUILLES', cs: 'FÁZE 4 // TĚŽKÝ OPAD LISTŮ' }[lang];
      desc = { tr: 'Ağır yaprak dökümü • Sert rüzgar ve pus', en: 'Heavy leaf shedding • Gusty wind & haze', de: 'Starker Blattfall • Wind & Dunst', fr: 'Chute massive • Vent et brume polluée', cs: 'Silný opad listů • Nárazový vítr a opar' }[lang];
      synthTag = 'E MINOR // WIND TURBULENCE';
    } else {
      stage = 'stage5'; color = '#EF4444';
      label = { tr: 'KRİTİK ALARM', en: 'CRITICAL ALARM', de: 'KRITISCHER ALARM', fr: 'ALARME CRITIQUE', cs: 'KRITICKÝ POPLACH' }[lang];
      badge = { tr: 'EVRE 5 // KRİTİK BİYOSFER ALARMI', en: 'STAGE 5 // CRITICAL ALARM', de: 'STUFE 5 // BIOSPHÄRENALARM', fr: 'ÉTAPE 5 // ALARME BIOSPHÈRE', cs: 'FÁZE 5 // KRITICKÝ POPLACH' }[lang];
      desc = { tr: 'Tüm yapraklar döküldü • Çatlamış kuru iskelet • Yoğun PM2.5', en: 'Full defoliation • Fractured bare wood • Toxic PM2.5', de: 'Kahler Baum • Risse im Holz • Giftiger Staub', fr: 'Arbre dénudé • Bois craquelé • PM2.5 toxique', cs: 'Holý strom • Popraskané dřevo • Toxický prach' }[lang];
      synthTag = 'TRITONE DISCORD // GEIGER CRACKLE';
    }

    return { stage, color, label, badge, desc, synthTag };
  }

  function calculateFireRisk(temp, hum, pm10, lang = 'tr') {
    let risk = 10;
    if (temp > 20) risk += (temp - 20) * 2.8;
    if (hum < 60) risk += (60 - hum) * 1.2;
    risk += Math.min(25, pm10 * 0.2);
    risk = Math.round(Math.min(100, Math.max(5, risk)));

    let status, color, badge, desc, synthTag;
    if (risk < 35) {
      color = '#10B981';
      status = { tr: 'DÜŞÜK RİSK', en: 'LOW RISK', de: 'GERINGES RISIKO', fr: 'FAIBLE RISQUE', cs: 'NÍZKÉ RIZIKO' }[lang];
      badge = { tr: 'TERMAL DENGEDE // YANGIN YOK', en: 'THERMAL BALANCE // NO FIRE', de: 'THERMISCHES GLEICHGEWICHT', fr: 'ÉQUILIBRE THERMIQUE', cs: 'TEPELNÁ ROVNOVÁHA' }[lang];
      desc = { tr: 'Nemli toprak • Serin orman örtüsü • Güvenli', en: 'Moist soil • Cool forest canopy • Safe', de: 'Feuchter Boden • Kühles Blätterdach', fr: 'Sol humide • Forêt fraîche • Sûr', cs: 'Vlhká půda • Chladný les • Bezpečno' }[lang];
      synthTag = 'COOL FOREST BREEZE';
    } else if (risk < 60) {
      color = '#F59E0B';
      status = { tr: 'ORTA RİSK', en: 'MODERATE RISK', de: 'MÄSSIGES RISIKO', fr: 'RISQUE MODÉRÉ', cs: 'STŘEDNÍ RIZIKO' }[lang];
      badge = { tr: 'DİKKAT // KURAKLIK VE ISI', en: 'WARNING // ARIDITY & HEAT', de: 'WARNUNG // TROCKENHEIT', fr: 'ATTENTION // CHALEUR ET SÉCHERESSE', cs: 'VAROVÁNÍ // SUCHO A TEPLO' }[lang];
      desc = { tr: 'Düşük bağıl nem • Kuruyan otsu örtü • Yangın riski', en: 'Low humidity • Dry foliage • Wildfire potential', de: 'Geringe Luftfeuchte • Trockenes Gras', fr: 'Faible humidité • Végétation sèche', cs: 'Nízká vlhkost • Suchá vegetace' }[lang];
      synthTag = 'HEAT HAZE // DRY WIND DRONE';
    } else {
      color = '#FF5722';
      status = { tr: 'AKTİF YANGIN ALARMI', en: 'ACTIVE WILDFIRE ALARM', de: 'AKTIVER WALDBRAND', fr: 'FEU DE FORÊT ACTIF', cs: 'AKTIVNÍ POŽÁR' }[lang];
      badge = { tr: 'KRİTİK // AKTİF YANGIN TEHLİKESİ', en: 'CRITICAL // ACTIVE FIRE HAZARD', de: 'KRITISCH // HOHE BRANDGEFAHR', fr: 'CRITIQUE // DANGER D’INCENDIE', cs: 'KRITICKÉ // NEBEZPEČÍ POŽÁRU' }[lang];
      desc = { tr: 'AĞAÇ YANIYOR! Yoğun kor ve kıvılcım • Ekstrem sıcak', en: 'TREE BURNING! Flying embers & flames • Extreme heat', de: 'BAUM BRENNT! Glut und Flammen', fr: 'L’ARBRE BRÛLE ! Braises et flammes', cs: 'STROM HOŘÍ! Létající jiskry a plameny' }[lang];
      synthTag = 'FIRE ROAR // EMBER CRACKLES';
    }

    return { risk, status, color, badge, desc, synthTag };
  }

  async function fetchTelemetry(lat, lng, fallbackData) {
    try {
      const airUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&current=european_aqi,us_aqi,pm10,pm2_5,nitrogen_dioxide,ozone,sulphur_dioxide,carbon_monoxide`;
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&current=temperature_2m,relative_humidity_2m`;

      const [resAir, resWeather] = await Promise.all([fetch(airUrl), fetch(weatherUrl)]);
      if (!resAir.ok || !resWeather.ok) throw new Error('API Error');

      const dataAir = (await resAir.json())?.current;
      const dataWeather = (await resWeather.json())?.current;

      const pm25 = Number((dataAir?.pm2_5 ?? 7.2).toFixed(1));
      const pm10 = Number((dataAir?.pm10 ?? pm25 * 1.6).toFixed(1));
      const no2 = Number((dataAir?.nitrogen_dioxide ?? 9.5).toFixed(1));
      const o3 = Number((dataAir?.ozone ?? 50.0).toFixed(1));
      const so2 = Number((dataAir?.sulphur_dioxide ?? 4.2).toFixed(1));
      const co = Number((dataAir?.carbon_monoxide ?? 220.0).toFixed(1));
      const temp = Number((dataWeather?.temperature_2m ?? 24.5).toFixed(1));
      const hum = Number((dataWeather?.relative_humidity_2m ?? 45).toFixed(0));

      const aqi = dataAir?.us_aqi != null ? Math.round(dataAir.us_aqi) : computeAqi(pm25, pm10, no2, o3);
      const eaqi = Math.round(dataAir?.european_aqi ?? aqi * 0.6);

      return {
        metrics: { pm25, pm10, no2, o3, so2, co, temp, hum, aqi, eaqi },
        source: 'OPEN-METEO SATELLITE API'
      };
    } catch {
      if (fallbackData) {
        return {
          metrics: {
            ...fallbackData,
            so2: 3.5, co: 210, temp: 22.0, hum: 50,
            aqi: computeAqi(fallbackData.pm25, fallbackData.pm10, fallbackData.no2, fallbackData.o3)
          },
          source: 'OFFLINE TELEMETRY ARCHIVE'
        };
      }
      return {
        metrics: { pm25: 14.2, pm10: 26.5, no2: 18.0, o3: 65.0, so2: 5.1, co: 240, temp: 28.0, hum: 38, aqi: 56, eaqi: 35 },
        source: 'DETERMINISTIC ATMOSPHERE MODEL'
      };
    }
  }

  function calculateHistorical(live, year, lat) {
    if (year >= 2026) return { metrics: { ...live }, deltaPm25: 0 };
    const progress = Math.min(1, Math.max(0, (year - 1750) / (2026 - 1750)));
    const anthroCurve = Math.pow(progress, 2.15);
    const dustFactor = Math.abs(lat) > 14 && Math.abs(lat) < 34 ? 1.55 : 1.0;
    const preInd = {
      pm25: Math.min(live.pm25, 3.2 * dustFactor),
      pm10: Math.min(live.pm10, 7.8 * dustFactor),
      no2: Math.min(live.no2, 1.4),
      o3: Math.min(live.o3, 28.0)
    };
    const pm25 = Number((preInd.pm25 + (live.pm25 - preInd.pm25) * anthroCurve).toFixed(1));
    const pm10 = Number((preInd.pm10 + (live.pm10 - preInd.pm10) * anthroCurve).toFixed(1));
    const no2 = Number((preInd.no2 + (live.no2 - preInd.no2) * anthroCurve).toFixed(1));
    const o3 = Number((preInd.o3 + (live.o3 - preInd.o3) * anthroCurve).toFixed(1));
    const aqi = computeAqi(pm25, pm10, no2, o3);
    const eaqi = Math.round(aqi * 0.62);
    const deltaPm25 = live.pm25 > 0.5 ? Math.round(((pm25 - live.pm25) / live.pm25) * 100) : 0;
    return { metrics: { ...live, pm25, pm10, no2, o3, eaqi, aqi }, deltaPm25 };
  }

  async function reverseGeocode(lat, lng, lang = 'tr') {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=${lang}`);
      if (!res.ok) throw new Error();
      const d = await res.json();
      const a = d.address || {};
      const p = a.city || a.town || a.province || a.state || a.country;
      return p ? { name: `${p}${a.country && p !== a.country ? ', ' + a.country : ''}`, region: 'SATELLITE POSITION' }
               : { name: `Sector (${lat.toFixed(1)}°, ${lng.toFixed(1)}°)`, region: 'OPEN FIELD' };
    } catch {
      return { name: `Sector (${lat.toFixed(1)}°, ${lng.toFixed(1)}°)`, region: 'TELEMETRY POINT' };
    }
  }

  window.AeroTelemetryApi = {
    fetchTelemetry,
    calculateHistorical,
    classifyAqi,
    calculateFireRisk,
    reverseGeocode
  };
})();
