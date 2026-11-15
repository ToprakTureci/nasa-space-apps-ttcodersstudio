(() => {
  'use strict';

  function linearAqi(conc, breakpoints) {
    for (const [cLow, cHigh, iLow, iHigh] of breakpoints) {
      if (conc <= cHigh) return Math.round(((iHigh - iLow) / (cHigh - cLow)) * (conc - cLow) + iLow);
    }
    return 400;
  }

  function computeAqi(pm25, pm10, no2, o3) {
    const pm25Bp = [[0, 12, 0, 50], [12.1, 35.4, 51, 100], [35.5, 55.4, 101, 150], [55.5, 150.4, 151, 200], [150.5, 250.4, 201, 300]];
    const pm10Bp = [[0, 54, 0, 50], [55, 154, 51, 100], [155, 254, 101, 150], [255, 354, 151, 200], [355, 424, 201, 300]];
    return Math.max(
      linearAqi(Math.max(0, pm25), pm25Bp),
      linearAqi(Math.max(0, pm10), pm10Bp),
      Math.round(Math.min(180, Math.max(0, o3 * 0.55))),
      Math.round(Math.min(180, Math.max(0, no2 * 0.65)))
    );
  }

  // 5 KADEMELİ HAVA KALİTESİ
  function classifyAqi(aqi, lang = 'tr') {
    let stage, color, label, badge, desc, synthTag;
    if (aqi <= 30) {
      stage = 'stage1'; color = '#10B981';
      label = { tr: 'MÜKEMMEL', en: 'EXCELLENT', de: 'EXZELLENT', fr: 'EXCELLENT', cs: 'VÝBORNÉ' }[lang] || 'EXCELLENT';
      badge = { tr: 'EVRE 1 // MÜKEMMEL BİYOSFER', en: 'STAGE 1 // PRISTINE BIOSPHERE', de: 'STUFE 1 // PERFEKT', fr: 'ÉTAPE 1 // PARFAITE', cs: 'FÁZE 1 // DOKONALÁ' }[lang] || 'STAGE 1';
      desc = { tr: 'Gür zümrüt doku • Zirve O₂ üretimi', en: 'Lush emerald foliage • Peak O2', de: 'Üppiges Laub • Spitzen-O2', fr: 'Feuillage émeraude • Pic O2', cs: 'Svěží listí • Špičkový O2' }[lang] || 'Peak O2';
      synthTag = 'C LYDIAN // PENTATONIC CHIMES';
    } else if (aqi <= 60) {
      stage = 'stage2'; color = '#34D399';
      label = { tr: 'DENGELİ', en: 'BALANCED', de: 'AUSGEGLICHEN', fr: 'ÉQUILIBRÉ', cs: 'VYVÁŽENÉ' }[lang] || 'BALANCED';
      badge = { tr: 'EVRE 2 // DENGELİ EKOSİSTEM', en: 'STAGE 2 // BALANCED', de: 'STUFE 2 // AUSGEGLICHEN', fr: 'ÉTAPE 2 // ÉQUILIBRÉ', cs: 'FÁZE 2 // VYVÁŽENÝ' }[lang] || 'STAGE 2';
      desc = { tr: 'Doğal yeşil kanopi • Kalimba nabzı', en: 'Natural canopy • Gentle pulse', de: 'Natürliche Baumkrone', fr: 'Canopée naturelle', cs: 'Přirozená koruna' }[lang] || 'Balanced';
      synthTag = 'C MAJ9 // WARM KALIMBA PULSE';
    } else if (aqi <= 100) {
      stage = 'stage3'; color = '#F59E0B';
      label = { tr: 'HAFİF STRES', en: 'MILD STRESS', de: 'LEICHTER STRESS', fr: 'STRESS MODÉRÉ', cs: 'MÍRNÝ STRES' }[lang] || 'MILD STRESS';
      badge = { tr: 'EVRE 3 // KLOROFİL KAYBI', en: 'STAGE 3 // CHLOROPHYLL LOSS', de: 'STUFE 3 // CHLOROPHYLLVERLUST', fr: 'ÉTAPE 3 // STRESS', cs: 'FÁZE 3 // ZTRÁTA' }[lang] || 'STAGE 3';
      desc = { tr: 'Kehribar yapraklar • İlk dökülme', en: 'Amber foliage • Early shedding', de: 'Bernsteinlaub • Erster Fall', fr: 'Feuilles ambrées', cs: 'Jantarové listí' }[lang] || 'Early shedding';
      synthTag = 'D DORIAN // LFO TREMOLO PAD';
    } else if (aqi <= 175) {
      stage = 'stage4'; color = '#F97316';
      label = { tr: 'YÜKSEK STRES', en: 'HIGH STRESS', de: 'HOHER STRESS', fr: 'STRESS ÉLEVÉ', cs: 'VYSOKÝ STRES' }[lang] || 'HIGH STRESS';
      badge = { tr: 'EVRE 4 // YOĞUN DÖKÜLME', en: 'STAGE 4 // HEAVY SHEDDING', de: 'STUFE 4 // STARKER FALL', fr: 'ÉTAPE 4 // CHUTE', cs: 'FÁZE 4 // SILNÝ OPAD' }[lang] || 'STAGE 4';
      desc = { tr: 'Ağır yaprak dökümü • Sert rüzgar', en: 'Heavy leaf shedding • Gusty wind', de: 'Starker Blattfall • Wind', fr: 'Chute massive • Vent', cs: 'Silný opad • Vítr' }[lang] || 'Heavy shedding';
      synthTag = 'E PHRYGIAN // HEARTBEAT SUB';
    } else {
      stage = 'stage5'; color = '#EF4444';
      label = { tr: 'KRİTİK ALARM', en: 'CRITICAL ALARM', de: 'KRITISCHER ALARM', fr: 'ALARME CRITIQUE', cs: 'KRITICKÝ POPLACH' }[lang] || 'CRITICAL ALARM';
      badge = { tr: 'EVRE 5 // KRİTİK BİYOSFER ALARMI', en: 'STAGE 5 // CRITICAL ALARM', de: 'STUFE 5 // ALARM', fr: 'ÉTAPE 5 // ALARME', cs: 'FÁZE 5 // POPLACH' }[lang] || 'STAGE 5';
      desc = { tr: 'Çatlamış kuru iskelet • Yoğun PM2.5', en: 'Bare fractured wood • Toxic PM2.5', de: 'Kahler Baum • Giftiger Staub', fr: 'Arbre nu • PM2.5 toxique', cs: 'Holý strom • Toxický prach' }[lang] || 'Toxic PM2.5';
      synthTag = 'CINEMATIC SUB DRONE // SONAR ALERT';
    }
    return { stage, color, label, badge, desc, synthTag };
  }

  // BAĞIMSIZ YANGIN RİSKİ (NASA EONET + FWI)
  function calculateFireRisk(temp, hum, pm10, lang = 'tr', isNasaActiveFire = false) {
    let risk = 10;
    if (temp > 20) risk += (temp - 20) * 2.8;
    if (hum < 60) risk += (60 - hum) * 1.2;
    risk += Math.min(25, pm10 * 0.2);
    if (isNasaActiveFire) risk = Math.max(risk, 88);
    risk = Math.round(Math.min(100, Math.max(5, risk)));

    let status, color, badge, desc, synthTag;
    if (risk < 35) {
      color = '#10B981';
      status = { tr: 'DÜŞÜK RİSK', en: 'LOW RISK', de: 'GERINGES RISIKO', fr: 'FAIBLE RISQUE', cs: 'NÍZKÉ RIZIKO' }[lang] || 'LOW RISK';
      badge = { tr: 'TERMAL DENGEDE // YANGIN YOK', en: 'THERMAL BALANCE // SAFE', de: 'THERMISCH STABIL', fr: 'ÉQUILIBRE THERMIQUE', cs: 'TEPELNÁ ROVNOVÁHA' }[lang] || 'SAFE';
      desc = { tr: 'Nemli toprak • Serin orman örtüsü', en: 'Moist soil • Cool forest canopy', de: 'Feuchter Boden • Kühl', fr: 'Sol humide • Frais', cs: 'Vlhká půda • Chladno' }[lang] || 'Cool forest';
      synthTag = 'COOL FOREST BREEZE';
    } else if (risk < 60) {
      color = '#F59E0B';
      status = { tr: 'ORTA RİSK', en: 'MODERATE RISK', de: 'MÄSSIGES RISIKO', fr: 'RISQUE MODÉRÉ', cs: 'STŘEDNÍ RIZIKO' }[lang] || 'MODERATE RISK';
      badge = { tr: 'DİKKAT // KURAKLIK VE ISI', en: 'WARNING // ARIDITY', de: 'WARNUNG // TROCKENHEIT', fr: 'ATTENTION // SÉCHERESSE', cs: 'VAROVÁNÍ // SUCHO' }[lang] || 'WARNING';
      desc = { tr: 'Düşük bağıl nem • Kuruyan örtü', en: 'Low humidity • Dry foliage', de: 'Trockenes Gras • Hitze', fr: 'Végétation sèche', cs: 'Suchá vegetace' }[lang] || 'Dry foliage';
      synthTag = 'HEAT HAZE // DRY WIND';
    } else {
      color = '#FF5722';
      status = { tr: 'AKTİF YANGIN ALARMI', en: 'ACTIVE WILDFIRE ALARM', de: 'AKTIVER WALDBRAND', fr: 'FEU DE FORÊT ACTIF', cs: 'AKTIVNÍ POŽÁR' }[lang] || 'WILDFIRE ALARM';
      badge = isNasaActiveFire ? 'NASA EONET // AKTİF YANGIN' : ({ tr: 'KRİTİK // YANGIN TEHLİKESİ', en: 'CRITICAL // ACTIVE FIRE', de: 'KRITISCH // FEUER', fr: 'CRITIQUE // INCENDIE', cs: 'KRITICKÉ // POŽÁR' }[lang] || 'ACTIVE FIRE');
      desc = { tr: 'AĞAÇ YANIYOR! Yoğun kor ve kıvılcım', en: 'TREE BURNING! Flying embers', de: 'BAUM BRENNT! Glut & Flammen', fr: 'L’ARBRE BRÛLE ! Flammes', cs: 'STROM HOŘÍ! Plameny' }[lang] || 'Tree burning';
      synthTag = 'WILDFIRE ROAR // WOOD CRACKLES';
    }
    return { risk, status, color, badge, desc, synthTag };
  }

  // IŞIK KİRLİLİĞİ MODELİ (BORTLE ÖLÇEĞİ 1–9)
  function calculateLightPollution(metrics, lang = 'tr') {
    const urbanScore = (metrics.no2 * 1.45) + (Math.max(0, metrics.co - 150) * 0.14) + (metrics.pm25 * 0.45);
    const percent = Math.round(Math.min(100, Math.max(4, urbanScore)));
    const bortle = Math.min(9, Math.max(1, Math.round(1 + (percent / 100) * 8)));

    let status, color, badge, desc, synthTag;
    if (bortle <= 3) {
      color = '#38BDF8';
      status = { tr: 'KARANLIK GÖKYÜZÜ', en: 'DARK SKY', de: 'DUNKLER HIMMEL', fr: 'CIEL NOIR', cs: 'TMAVÁ OBLOHA' }[lang] || 'DARK SKY';
      badge = `BORTLE ${bortle} // ${status}`;
      desc = { tr: 'Samanyolu net • Ateş böcekleri dans ediyor', en: 'Milky Way visible • Fireflies active', de: 'Milchstraße klar • Glühwürmchen', fr: 'Voie lactée claire • Lucioles', cs: 'Mléčná dráha jasná • Světlušky' }[lang] || 'Milky Way visible';
      synthTag = 'STARLIGHT HARP // DEEP NIGHT AMBIENT';
    } else if (bortle <= 6) {
      color = '#F59E0B';
      status = { tr: 'KENTSEL PARLAMA', en: 'URBAN SKYGLOW', de: 'STADTLICHTGLOCKE', fr: 'HALO LUMINEUX', cs: 'MĚSTSKÁ ZÁŘE' }[lang] || 'URBAN SKYGLOW';
      badge = `BORTLE ${bortle} // ${status}`;
      desc = { tr: 'Ufukta ışık kubbesi • Yıldızlar sönük', en: 'Horizon skyglow • Dimmed stars', de: 'Lichtkuppel • Verblasste Sterne', fr: 'Halo urbain • Étoiles pâles', cs: 'Světelná kopule • Slabé hvězdy' }[lang] || 'Horizon skyglow';
      synthTag = 'TWILIGHT NEON PULSE';
    } else {
      color = '#F43F5E';
      status = { tr: 'AŞIRI IŞIK KİRLİLİĞİ', en: 'SEVERE LIGHT POLLUTION', de: 'EXTREME LICHTVERSCHMUTZUNG', fr: 'POLLUTION LUMINEUSE', cs: 'SILNÉ SVĚTELNÉ ZNEČIŠTĚNÍ' }[lang] || 'SEVERE LIGHT POLLUTION';
      badge = `BORTLE ${bortle} // ${status}`;
      desc = { tr: 'Yıldızlar kayboldu • Biyolojik ritim bozuk', en: 'Zero stars • Disrupted circadian cycle', de: 'Keine Sterne • Gestörter Rhythmus', fr: 'Zéro étoile • Rythme perturbé', cs: 'Žádné hvězdy • Narušený rytmus' }[lang] || 'Zero stars';
      synthTag = 'CITY GLARE // 60HZ NEON HUM';
    }

    return { bortle, percent, status, color, badge, desc, synthTag };
  }

  // NASA POWER UYDU VERİSİ (Gerçek NASA Langley API)
  async function fetchNasaPower(lat, lng) {
    try {
      const end = new Date(Date.now() - 4 * 86400000);
      const start = new Date(end.getTime() - 4 * 86400000);
      const fmt = d => d.toISOString().slice(0, 10).replace(/-/g, '');
      const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=ALLSKY_SFC_SW_DWN,T2M,RH2M&community=RE&longitude=${lng.toFixed(3)}&latitude=${lat.toFixed(3)}&start=${fmt(start)}&end=${fmt(end)}&format=JSON`;

      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(t);
      if (!res.ok) return null;

      const json = await res.json();
      const params = json?.properties?.parameter;
      if (!params) return null;

      const getLatestValid = obj => {
        const vals = Object.values(obj || {}).filter(v => v !== -999 && v != null);
        return vals.length ? vals[vals.length - 1] : null;
      };

      return {
        solar: getLatestValid(params.ALLSKY_SFC_SW_DWN),
        nasaTemp: getLatestValid(params.T2M),
        nasaHum: getLatestValid(params.RH2M)
      };
    } catch {
      return null;
    }
  }

  // NASA EONET GERÇEK AKTİF ORMAN YANGINLARI API
  async function fetchNasaWildfires() {
    try {
      const res = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events?category=wildfires&status=open&limit=25');
      if (!res.ok) return [];
      const data = await res.json();
      return (data.events || []).map(ev => {
        const geom = ev.geometry?.[ev.geometry.length - 1];
        if (!geom || !Array.isArray(geom.coordinates)) return null;
        return {
          id: ev.id,
          title: ev.title,
          date: geom.date,
          lng: geom.coordinates[0],
          lat: geom.coordinates[1]
        };
      }).filter(Boolean);
    } catch {
      return [];
    }
  }

  async function fetchTelemetry(lat, lng, fallbackData) {
    try {
      const airUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&current=european_aqi,us_aqi,pm10,pm2_5,nitrogen_dioxide,ozone,carbon_monoxide`;
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&current=temperature_2m,relative_humidity_2m`;

      const [resAir, resWeather, nasaPower] = await Promise.all([
        fetch(airUrl),
        fetch(weatherUrl),
        fetchNasaPower(lat, lng)
      ]);

      if (!resAir.ok || !resWeather.ok) throw new Error('API Error');

      const dataAir = (await resAir.json())?.current;
      const dataWeather = (await resWeather.json())?.current;

      const pm25 = Number((dataAir?.pm_2_5 ?? dataAir?.pm2_5 ?? 7.2).toFixed(1));
      const pm10 = Number((dataAir?.pm10 ?? pm25 * 1.6).toFixed(1));
      const no2 = Number((dataAir?.nitrogen_dioxide ?? 9.5).toFixed(1));
      const o3 = Number((dataAir?.ozone ?? 50.0).toFixed(1));
      const co = Number((dataAir?.carbon_monoxide ?? 220.0).toFixed(1));
      const temp = Number((dataWeather?.temperature_2m ?? nasaPower?.nasaTemp ?? 24.5).toFixed(1));
      const hum = Number((dataWeather?.relative_humidity_2m ?? nasaPower?.nasaHum ?? 45).toFixed(0));
      const solar = Number((nasaPower?.solar ?? 4.8).toFixed(2));

      const aqi = dataAir?.us_aqi != null ? Math.round(dataAir.us_aqi) : computeAqi(pm25, pm10, no2, o3);
      const eaqi = Math.round(dataAir?.european_aqi ?? aqi * 0.6);

      return {
        metrics: { pm25, pm10, no2, o3, solar, co, temp, hum, aqi, eaqi },
        source: nasaPower?.solar != null ? 'NASA POWER + OPEN-METEO' : 'OPEN-METEO SATELLITE'
      };
    } catch {
      if (fallbackData) {
        return {
          metrics: { ...fallbackData, solar: 4.5, co: 210, temp: 22.0, hum: 50, aqi: computeAqi(fallbackData.pm25, fallbackData.pm10, fallbackData.no2, fallbackData.o3) },
          source: 'OFFLINE ARCHIVE'
        };
      }
      return {
        metrics: { pm25: 14.2, pm10: 26.5, no2: 18.0, o3: 65.0, solar: 4.9, co: 240, temp: 28.0, hum: 38, aqi: 56, eaqi: 35 },
        source: 'ATMOSPHERE MODEL'
      };
    }
  }

  function calculateHistorical(live, year, lat) {
    if (year >= 2026) return { metrics: { ...live }, deltaPm25: 0 };
    const progress = Math.min(1, Math.max(0, (year - 1750) / (2026 - 1750)));
    const anthroCurve = Math.pow(progress, 2.15);
    const dustFactor = Math.abs(lat) > 14 && Math.abs(lat) < 34 ? 1.55 : 1.0;
    const preInd = { pm25: Math.min(live.pm25, 3.2 * dustFactor), pm10: Math.min(live.pm10, 7.8 * dustFactor), no2: Math.min(live.no2, 1.4), o3: Math.min(live.o3, 28.0) };
    const pm25 = Number((preInd.pm25 + (live.pm25 - preInd.pm25) * anthroCurve).toFixed(1));
    const pm10 = Number((preInd.pm10 + (live.pm10 - preInd.pm10) * anthroCurve).toFixed(1));
    const no2 = Number((preInd.no2 + (live.no2 - preInd.no2) * anthroCurve).toFixed(1));
    const o3 = Number((preInd.o3 + (live.o3 - preInd.o3) * anthroCurve).toFixed(1));
    const aqi = computeAqi(pm25, pm10, no2, o3);
    const deltaPm25 = live.pm25 > 0.5 ? Math.round(((pm25 - live.pm25) / live.pm25) * 100) : 0;
    return { metrics: { ...live, pm25, pm10, no2, o3, eaqi: Math.round(aqi * 0.62), aqi }, deltaPm25 };
  }

  async function reverseGeocode(lat, lng, lang = 'tr') {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=${lang}`);
      if (!res.ok) throw new Error();
      const d = await res.json();
      const a = d.address || {};
      const p = a.city || a.town || a.province || a.state || a.country;
      return p ? { name: `${p}${a.country && p !== a.country ? ', ' + a.country : ''}` } : { name: `Sector (${lat.toFixed(1)}°, ${lng.toFixed(1)}°)` };
    } catch {
      return { name: `Sector (${lat.toFixed(1)}°, ${lng.toFixed(1)}°)` };
    }
  }

  window.AeroTelemetryApi = {
    fetchTelemetry,
    fetchNasaWildfires,
    calculateHistorical,
    classifyAqi,
    calculateFireRisk,
    calculateLightPollution,
    reverseGeocode
  };
})();
