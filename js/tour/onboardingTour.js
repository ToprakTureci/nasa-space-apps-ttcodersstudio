/**
 * AeroJukebox — İnteraktif Spotlight Başlangıç Rehberi (Onboarding Tour)
 * 5 Dilde (TR, EN, DE, FR, CS) 3 Radar Modunu ve tüm panelleri aydınlatıp tanıtır.
 */
(() => {
  'use strict';

  const TOUR_I18N = {
    tr: {
      btnLabel: 'Rehber', prev: '◀ Önceki', next: 'Sonraki ▶', finish: 'Anladım, Keşfet 🚀',
      steps: [
        { target: '.mode-switch-group', title: '1. Üç Bağımsız Radar Modu', text: 'Buradan "Hava Kalitesi", "Yangın Riski" (NASA EONET aktif yangınları) ve "Işık Kirliliği" (NASA VIIRS Gece Işıkları) modları arasında geçiş yapabilirsiniz.' },
        { target: '.map-viewport-wrapper', title: '2. Küresel Harita & Arama', text: 'Haritada dünyanın herhangi bir noktasına tıklayarak NASA + uydu verisi alabilir veya arama çubuğundan istediğiniz şehre uçabilirsiniz.' },
        { target: '.timeline-module', title: '3. Tarihsel Simülatör (1750 - 2026)', text: 'Kaydırıcıyı kullanarak sanayi devrimi öncesi (1750) doğal atmosfer ile günümüz kirlilik değerlerini karşılaştırın.' },
        { target: '#biosphereStage', title: '4. Yaşayan Biyosfer Ağacı', text: 'Ağaç; havaya göre 5 evrede yaprak döker, yangın modunda gerçek alevlerle yanar, ışık kirliliği modunda ise yıldızlı gecede ateş böcekleri veya yapay şehir ışığı gösterir!' },
        { target: '.telemetry-cards-grid', title: '5. 8 NASA & Atmosfer Sensörü', text: 'PM2.5, PM10, NO₂, Ozon, NASA POWER Güneş Işınımı (SOLAR), CO, Sıcaklık ve Nem değerlerini anlık takip edin.' },
        { target: '.jukebox-bar', title: '6. AeroJukebox (Veriden Sese)', text: 'Sesi Başlat butonuna basın! Temiz havada C Lydian akorlarını, kötü havada derin bası, yangında çıtırtıları, karanlık gecede ise yıldız arpını dinleyin.' }
      ]
    },
    en: {
      btnLabel: 'Tour Guide', prev: '◀ Back', next: 'Next ▶', finish: 'Got It, Explore 🚀',
      steps: [
        { target: '.mode-switch-group', title: '1. Three Radar Modes', text: 'Switch independently between "Air Quality", "Wildfire Risk" (with live NASA EONET fires), and "Light Pollution" (NASA VIIRS Night Lights).' },
        { target: '.map-viewport-wrapper', title: '2. Global Map & Search', text: 'Click anywhere on Earth for live NASA + satellite telemetry, or search any city in the bar above.' },
        { target: '.timeline-module', title: '3. Historical Simulator (1750 - 2026)', text: 'Time-travel using the slider to compare pre-industrial 1750 baseline atmosphere against 2026 levels.' },
        { target: '#biosphereStage', title: '4. Living Biosphere Tree', text: 'Reacts in 5 stages to air quality, burns with real flames in Wildfire mode, and shows starry fireflies vs city glare in Light Pollution mode!' },
        { target: '.telemetry-cards-grid', title: '5. 8 NASA & Atmosphere Sensors', text: 'Monitor PM2.5, PM10, NO₂, Ozone, NASA POWER Solar Irradiance, CO, Temperature, and Humidity.' },
        { target: '.jukebox-bar', title: '6. AeroJukebox Sonification', text: 'Press Start Audio! Listen to C Lydian chimes in clean air, cinematic bass in smog, wood crackles in wildfires, and starlight harp in dark skies.' }
      ]
    },
    de: {
      btnLabel: 'Anleitung', prev: '◀ Zurück', next: 'Weiter ▶', finish: 'Verstanden 🚀',
      steps: [
        { target: '.mode-switch-group', title: '1. Drei Radarmodi', text: 'Wechseln Sie zwischen Luftqualität, Brandgefahr (NASA EONET) und Lichtverschmutzung (NASA VIIRS).' },
        { target: '.map-viewport-wrapper', title: '2. Globale Karte & Suche', text: 'Klicken Sie auf einen beliebigen Ort für Live-NASA-Telemetrie oder suchen Sie eine Stadt.' },
        { target: '.timeline-module', title: '3. Historischer Simulator', text: 'Vergleichen Sie die vorindustrielle Atmosphäre von 1750 mit heutigen Werten.' },
        { target: '#biosphereStage', title: '4. Lebendiger Biosphärenbaum', text: 'Reagiert in 5 Stufen auf Luft, brennt im Brandmodus und zeigt Glühwürmchen oder Stadtlicht im Nachtmodus!' },
        { target: '.telemetry-cards-grid', title: '5. 8 NASA- & Umweltsensoren', text: 'Verfolgen Sie Feinstaub, Gase, NASA-Solarstrahlung, Temperatur und Luftfeuchte.' },
        { target: '.jukebox-bar', title: '6. AeroJukebox Klanglandschaft', text: 'Starten Sie das Audio für harmonische Akkorde, tiefen Bass, Feuerknistern oder Sternenklänge.' }
      ]
    },
    fr: {
      btnLabel: 'Guide', prev: '◀ Précédent', next: 'Suivant ▶', finish: 'Explorer 🚀',
      steps: [
        { target: '.mode-switch-group', title: '1. Trois Modes Radar', text: 'Basculez entre Qualité de l’air, Incendies (NASA EONET) et Pollution Lumineuse (NASA VIIRS).' },
        { target: '.map-viewport-wrapper', title: '2. Carte & Recherche', text: 'Cliquez sur le globe ou cherchez une ville pour la télémétrie NASA en direct.' },
        { target: '.timeline-module', title: '3. Simulateur Historique', text: 'Comparez l’atmosphère de 1750 aux niveaux modernes de 2026.' },
        { target: '#biosphereStage', title: '4. Arbre de la Biosphère', text: 'Évolue en 5 étapes, s’embrase en mode incendie et révèle lucioles ou halo urbain la nuit!' },
        { target: '.telemetry-cards-grid', title: '5. 8 Capteurs NASA', text: 'Suivez PM2.5, PM10, NO₂, Ozone, Rayonnement Solaire NASA, CO, Température et Humidité.' },
        { target: '.jukebox-bar', title: '6. Sonification AeroJukebox', text: 'Lancez l’audio pour écouter les données spatiales traduites en musique.' }
      ]
    },
    cs: {
      btnLabel: 'Nápověda', prev: '◀ Zpět', next: 'Další ▶', finish: 'Rozumím 🚀',
      steps: [
        { target: '.mode-switch-group', title: '1. Tři režimy radaru', text: 'Přepínejte mezi kvalitou ovzduší, požáry (NASA EONET) a světelným znečištěním (NASA VIIRS).' },
        { target: '.map-viewport-wrapper', title: '2. Globální mapa a hledání', text: 'Klikněte kamkoli na mapu nebo vyhledejte město pro živá data NASA.' },
        { target: '.timeline-module', title: '3. Historický simulátor', text: 'Porovnejte atmosféru roku 1750 se současností.' },
        { target: '#biosphereStage', title: '4. Živý strom biosféry', text: 'Reaguje v 5 fázích, hoří při požáru a v noci ukazuje světlušky nebo městskou záři!' },
        { target: '.telemetry-cards-grid', title: '5. 8 Senzorů NASA', text: 'Sledujte prachové částice, plyny, sluneční záření NASA, teplotu a vlhkost.' },
        { target: '.jukebox-bar', title: '6. Sonifikace AeroJukebox', text: 'Spusťte zvuk a poslouchejte data přeložená do hudby.' }
      ]
    }
  };

  class OnboardingTour {
    constructor() {
      this.currentStep = 0;
      this.lang = 'tr';
      this.isActive = false;
      this.spotlightEl = null;
      this.cardEl = null;
      this.init();
    }

    init() {
      this.spotlightEl = document.createElement('div');
      this.spotlightEl.className = 'tour-spotlight hidden';
      document.body.appendChild(this.spotlightEl);

      this.cardEl = document.createElement('div');
      this.cardEl.className = 'tour-card hidden';
      this.cardEl.innerHTML = `
        <div class="tour-card-header">
          <span class="tour-step-pill">1 / 6</span>
          <button type="button" class="tour-skip-btn" title="Kapat">✕</button>
        </div>
        <h3 class="tour-title"></h3>
        <p class="tour-desc"></p>
        <div class="tour-actions">
          <button type="button" class="tour-btn tour-prev-btn">Önceki</button>
          <button type="button" class="tour-btn primary tour-next-btn">Sonraki</button>
        </div>
      `;
      document.body.appendChild(this.cardEl);

      this.cardEl.querySelector('.tour-prev-btn').addEventListener('click', () => this.prev());
      this.cardEl.querySelector('.tour-next-btn').addEventListener('click', () => this.next());
      this.cardEl.querySelector('.tour-skip-btn').addEventListener('click', () => this.end());
      window.addEventListener('resize', () => { if (this.isActive) this.positionStep(); });

      this.ensureLaunchButton();
    }

    ensureLaunchButton() {
      let btn = document.getElementById('tourStartBtn');
      if (!btn) {
        const targetContainer = document.querySelector('.header-right') || document.querySelector('.top-header');
        if (targetContainer) {
          btn = document.createElement('button');
          btn.id = 'tourStartBtn';
          btn.className = 'tour-launch-btn';
          btn.type = 'button';
          btn.innerHTML = '<span>❓</span> <strong class="tour-btn-text">Rehber</strong>';
          targetContainer.prepend(btn);
        }
      }
      if (btn && !btn.dataset.tourBound) {
        btn.dataset.tourBound = '1';
        btn.addEventListener('click', () => this.start(this.lang));
      }
    }

    setLang(lang) {
      this.lang = TOUR_I18N[lang] ? lang : 'tr';
      const dict = TOUR_I18N[this.lang] || TOUR_I18N.tr;
      const btnText = document.querySelector('.tour-btn-text');
      if (btnText) btnText.textContent = dict.btnLabel;
      if (this.isActive) this.renderStep();
    }

    start(lang = 'tr') {
      this.setLang(lang);
      this.currentStep = 0;
      this.isActive = true;
      this.spotlightEl.classList.remove('hidden');
      this.cardEl.classList.remove('hidden');
      this.renderStep();
    }

    renderStep() {
      const dict = TOUR_I18N[this.lang] || TOUR_I18N.tr;
      const step = dict.steps[this.currentStep];
      if (!step) return this.end();

      this.cardEl.querySelector('.tour-step-pill').textContent = `${this.currentStep + 1} / ${dict.steps.length}`;
      this.cardEl.querySelector('.tour-title').textContent = step.title;
      this.cardEl.querySelector('.tour-desc').textContent = step.text;

      const prevBtn = this.cardEl.querySelector('.tour-prev-btn');
      const nextBtn = this.cardEl.querySelector('.tour-next-btn');

      prevBtn.textContent = dict.prev;
      prevBtn.style.visibility = this.currentStep === 0 ? 'hidden' : 'visible';
      nextBtn.textContent = this.currentStep === dict.steps.length - 1 ? dict.finish : dict.next;

      this.positionStep();
    }

    positionStep() {
      const dict = TOUR_I18N[this.lang] || TOUR_I18N.tr;
      const step = dict.steps[this.currentStep];
      const target = document.querySelector(step.target);
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const pad = 6;

      this.spotlightEl.style.top = `${Math.max(0, rect.top - pad)}px`;
      this.spotlightEl.style.left = `${Math.max(0, rect.left - pad)}px`;
      this.spotlightEl.style.width = `${rect.width + pad * 2}px`;
      this.spotlightEl.style.height = `${rect.height + pad * 2}px`;

      const cardW = 340;
      const cardH = 200;
      if (window.innerWidth <= 768) {
        this.cardEl.style.top = 'auto';
        this.cardEl.style.bottom = '16px';
        this.cardEl.style.left = '50%';
        this.cardEl.style.transform = 'translateX(-50%)';
      } else {
        this.cardEl.style.transform = 'none';
        let top = rect.bottom + 14;
        let left = rect.left + (rect.width - cardW) / 2;
        if (top + cardH > window.innerHeight) top = rect.top - cardH - 14;
        if (left < 14) left = 14;
        if (left + cardW > window.innerWidth - 14) left = window.innerWidth - cardW - 14;
        this.cardEl.style.top = `${Math.max(14, top)}px`;
        this.cardEl.style.left = `${left}px`;
      }
    }

    next() {
      const dict = TOUR_I18N[this.lang] || TOUR_I18N.tr;
      if (this.currentStep < dict.steps.length - 1) {
        this.currentStep++;
        this.renderStep();
      } else {
        this.end();
      }
    }

    prev() {
      if (this.currentStep > 0) {
        this.currentStep--;
        this.renderStep();
      }
    }

    end() {
      this.isActive = false;
      this.spotlightEl.classList.add('hidden');
      this.cardEl.classList.add('hidden');
      try { localStorage.setItem('aerojukebox_tour_done', '1'); } catch {}
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    window.AeroTour = new OnboardingTour();
  });
})();
