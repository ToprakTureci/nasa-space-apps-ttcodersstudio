/**
 * AeroJukebox — Veri Akışı, Open-Meteo Uç Noktaları ve Tarihsel Model
 */
(() => {
  'use strict';

  const CACHE_KEY = 'aerojukebox_telemetry_cache_v3';

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

  function classifyAqi(aqi) {
    if (aqi <= 50) {
      return {
        stage: 'good',
        label: 'İYİ',
        color: '#10B981',
        badge: 'EVRE 1 // DENGELİ BİYOSFER',
        desc: 'Canlı yaprak dokusu • Yüksek O₂ salınımı • Berrak atmosfer',
        synthTag: 'SİNEMATİK MAJÖR 9 // C LYDIAN AMBİYANSI'
      };
    }
    if (aqi <= 150) {
      return {
        stage: 'moderate',
        label: 'ORTA',
        color: '#F59E0B',
        badge: 'EVRE 2 // STRES ALTINDA EKOSİSTEM',
        desc: 'Klorofil kaybı • Dökülen yapraklar • Hafif aerosol pusu',
        synthTag: 'D DORIAN SÜSPANSİYON // RÜZGAR TÜRBÜLANSI'
      };
    }
    return {
      stage: 'hazardous',
      label: 'TEHLİKELİ',
      color: '#EF4444',
      badge: 'EVRE 3 // KRİTİK BİYOSFER ALARMI',
      desc: 'Yapraklar kuruyup döküldü • Yoğun PM2.5 dumanı ve toksik stres',
      synthTag: 'DİSONANT TRITONE BAS // GEIGER PARTİKÜL PARAZİTİ'
    };
  }

  async function fetchAirQuality(lat, lng, fallbackData) {
    const cacheKey = `${lat.toFixed(2)}_${lng.toFixed(2)}`;
    try {
      const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&current=european_aqi,us_aqi,pm10,pm2_5,nitrogen_dioxide,ozone`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('API Error');
      const payload = await res.json();
      const cur = payload?.current;
      if (!cur || (cur.pm2_5 == null && cur.pm10 == null)) throw new Error('Empty');

      const pm25 = Number((cur.pm2_5 ?? 6.5).toFixed(1));
      const pm10 = Number((cur.pm10 ?? pm25 * 1.6).toFixed(1));
      const no2 = Number((cur.nitrogen_dioxide ?? 8.0).toFixed(1));
      const o3 = Number((cur.ozone ?? 48.0).toFixed(1));
      const eaqi = Math.round(cur.european_aqi ?? computeAqi(pm25, pm10, no2, o3) * 0.6);
      const aqi = cur.us_aqi != null ? Math.round(cur.us_aqi) : computeAqi(pm25, pm10, no2, o3);

      return { metrics: { pm25, pm10, no2, o3, eaqi, aqi }, source: 'CANLI UYDU // OPEN-METEO API' };
    } catch {
      if (fallbackData) {
        return {
          metrics: { ...fallbackData, aqi: computeAqi(fallbackData.pm25, fallbackData.pm10, fallbackData.no2, fallbackData.o3) },
          source: 'ÇEVRİMDIŞI REFERANS VERİSİ'
        };
      }
      const seed = Math.abs(Math.sin(lat * 12.9898 + lng * 78.233) * 43758.5453) % 1;
      const pm25 = Number((8 + seed * 30).toFixed(1));
      const pm10 = Number((pm25 * 1.7 + 6).toFixed(1));
      const no2 = Number((8 + seed * 25).toFixed(1));
      const o3 = Number((42 + seed * 32).toFixed(1));
      const aqi = computeAqi(pm25, pm10, no2, o3);
      return { metrics: { pm25, pm10, no2, o3, eaqi: Math.round(aqi * 0.65), aqi }, source: 'ÇEVRİMDIŞI ATMOSFER MODELİ' };
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
    return { metrics: { pm25, pm10, no2, o3, eaqi, aqi }, deltaPm25 };
  }

  async function reverseGeocode(lat, lng) {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=tr`);
      if (!res.ok) throw new Error();
      const d = await res.json();
      const a = d.address || {};
      const p = a.city || a.town || a.province || a.state || a.country;
      return p ? { name: `${p}${a.country && p !== a.country ? ', ' + a.country : ''}`, region: 'UYDU KONUM DOĞRULANDI' }
               : { name: `Sektör (${lat.toFixed(1)}°, ${lng.toFixed(1)}°)`, region: 'AÇIK ALAN TELEMETRİSİ' };
    } catch {
      return { name: `Sektör (${lat.toFixed(1)}°, ${lng.toFixed(1)}°)`, region: 'UZAY TELEMETRİ NOKTASI' };
    }
  }

  window.AeroTelemetryApi = {
    fetchAirQuality,
    calculateHistorical,
    classifyAqi,
    reverseGeocode
  };
})();