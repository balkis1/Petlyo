// ── Petlyo i18n — EN / DE ────────────────────────────────────────────────────

const TRANSLATIONS = {
  en: {
    // Nav
    'nav.symptoms':'Symptom Check','nav.sitters':'For Sitters','nav.cta':'Get started',
    // Hero
    'hero.label':'AI-powered pet matching',
    'hero.title':"Find the perfect sitter for your pet's unique personality",
    'hero.sub':"Answer a few questions about your pet and we'll match them with sitters who genuinely understand their needs — no guesswork, no generic searches.",
    'hero.cta':'Match my pet','hero.demo':'See how it works',
    'hero.proof':'Trusted by 2,400+ pet owners · 140+ verified sitters',
    // Stats
    'stats.pets':'Pets matched','stats.sitters':'Verified sitters',
    'stats.satisfaction':'Owner satisfaction','stats.rating':'Average rating',
    // How it works
    'how.label':'The process','how.title':'Four steps to the perfect match',
    'how.sub':'We take the guesswork out of finding a sitter — because every pet is different.',
    'how.s1.title':'Tell us about your pet','how.s1.desc':'Name, species, personality traits, and the environment they do best in.',
    'how.s2.title':'We analyse the match','how.s2.desc':"Our algorithm scores every sitter against your pet's specific needs and temperament.",
    'how.s3.title':'Review your top sitters','how.s3.desc':'See ranked results with a compatibility score and a clear reason for each match.',
    'how.s4.title':'Book with confidence','how.s4.desc':'Read their full profile, check the compatibility breakdown, and reach out directly.',
    // Features
    'feat.label':'Why Petlyo','feat.title':'Built around your pet, not a search box',
    'feat.sub':"Generic pet-sitting platforms don't account for personality. We do.",
    'feat.1.title':'Personality-first matching','feat.1.desc':'Our algorithm weighs traits like anxiety, energy level, and trauma history — not just location and price.',
    'feat.2.title':'Verified sitters','feat.2.desc':'Every sitter is vetted for experience, reviewed by owners, and assessed for specialist capability.',
    'feat.3.title':'Compatibility breakdown','feat.3.desc':'See exactly why a sitter was matched — environment fit, energy match, routine alignment, and experience.',
    'feat.4.title':'Peace of mind','feat.4.desc':"We match your pet with sitters who have been there before — whether that's separation anxiety or senior care.",
    // Testimonials
    'test.label':'What owners say','test.title':'Real pets. Real matches.',
    'test.sub':"Over 2,400 matches made — here's what owners have to say.",
    'test.1.quote':'"Petlyo matched Biscuit with the most patient sitter. She understood his separation anxiety from day one — no adjustment period needed at all."',
    'test.2.quote':'"Our rescue cat has trauma triggers. The AI insight described her perfectly — the sitter we found was the right fit before the very first visit."',
    'test.3.quote':'"The compatibility breakdown told us exactly why each sitter was ranked. That level of transparency is something no other platform comes close to."',
    // CTA
    'cta.title':'Ready to find the right match?','cta.sub':'It takes about 3 minutes. No account needed.','cta.btn':'Match my pet →',
    // Onboarding
    'onb.s1.title':"Let's start with the basics",'onb.s1.sub':'Tell us a little about your pet so we can find the right match.',
    'onb.s2.title':'How would you describe your pet?','onb.s2.sub':'Select all that apply — we use these to find sitters who truly understand your pet.',
    'onb.s3.title':'What does your pet need in a home?','onb.s3.sub':"Select the environment conditions that matter most for your pet's wellbeing.",
    'onb.s4.title':'Routine & stay details','onb.s4.sub':'Help your sitter understand what a normal day looks like for your pet.',
    'onb.s5.title':'Almost there — just your details','onb.s5.sub':"We'll use this to send you your match results. No spam, ever.",
    'onb.privacy.title':'Your data is safe','onb.privacy.desc':'We only use your details to connect you with sitters. We never sell your data or share it without your consent.',
    'onb.back':'← Back','onb.continue':'Continue','onb.find':'Find my matches',
    // Labels
    'lbl.petName':"Pet's name",'lbl.species':'Species','lbl.breed':'Breed','lbl.age':'Age (years)',
    'lbl.city':'Your city','lbl.feeding':'Feeding schedule','lbl.exercise':'Exercise needs',
    'lbl.medication':'Medication or medical needs','lbl.stayStart':'Stay start date','lbl.stayEnd':'Stay end date',
    'lbl.notes':'Any extra notes for your sitter?','lbl.ownerName':'Your name','lbl.ownerEmail':'Email address',
    // Trait cards
    'trait.anxious':'Anxious','trait.anxious.desc':'Gets stressed in new situations or environments',
    'trait.social':'Social','trait.social.desc':'Loves meeting other animals and people',
    'trait.highEnergy':'High Energy','trait.highEnergy.desc':'Needs lots of exercise and stimulation daily',
    'trait.shy':'Shy','trait.shy.desc':'Takes time to warm up to new people and places',
    'trait.senior':'Senior','trait.senior.desc':'Older pet with a slower pace and gentle needs',
    'trait.separation':'Separation Anxiety','trait.separation.desc':'Struggles when left alone, needs company',
    'trait.rescue':'Rescue / Trauma','trait.rescue.desc':'Has a difficult past, needs patience and structure',
    'trait.playful':'Playful','trait.playful.desc':'Always up for games, toys, and adventures',
    // Environment cards
    'env.only':'Only Pet','env.only.desc':'Best as the only animal in the home',
    'env.garden':'Garden Access','env.garden.desc':'Needs access to outdoor space to run and explore',
    'env.calm':'Calm & Quiet','env.calm.desc':'Sensitive to noise, activity, and busy environments',
    'env.homeall':'Sitter Home All Day','env.homeall.desc':'Needs constant company and supervision throughout the day',
    'env.dog':'Dog-Friendly','env.dog.desc':'Does well around other dogs in the home',
    'env.nokids':'No Small Children','env.nokids.desc':'More comfortable in an adult-only household',
    // Matching page
    'match.title':'Finding the perfect match','match.sub':'Analysing your pet\'s profile against 140+ sitters…',
    // Results
    'results.top3':'Your top 3 matches','results.insight':'✦ AI Match Insight',
    'results.passport':'🪪 Pet Passport','results.live':'📡 Live Updates',
    'results.refine':'Refine','results.startover':'Start over',
    // Sitter detail
    'sitter.home':'🏡 Home & Environment','sitter.compat':'📊 Compatibility Breakdown',
    'sitter.env':'Environment fit','sitter.energy':'Energy match',
    'sitter.routine':'Routine alignment','sitter.exp':'Experience with type',
    'sitter.factEnv':'Environment type','sitter.factPets':'Other pets',
    'sitter.factHome':'Home all day','sitter.factYears':'Years experience',
    'sitter.book':'Ready to book with this sitter?','sitter.request':'Request a stay →',
    // Symptom checker
    'sym.title':'Is My Pet OK?',
    'sym.sub':'Describe what you\'re seeing — our AI gives instant, personalised advice based on your pet\'s species, breed, and age. Free, no sign-up needed.',
    'sym.species':'Species','sym.breed':'Breed','sym.age':'Age',
    'sym.symptomsLabel':'What symptoms are you noticing?',
    'sym.submit':'Get instant advice →','sym.again':'Check another symptom',
    'sym.help':'Need professional help?',
    'sym.findVet':'Find a vet near you','sym.findVet.sub':'Search on Google Maps',
    'sym.chatVet':'Chat with a vet online','sym.chatVet.sub':'AI-assisted · Free · No wait time',
    'sym.emergency':'Emergency vet near you','sym.emergency.sub':'Open 24/7 emergency clinics',
    'sym.disclaimer':'⚠️ This is AI-generated guidance for informational purposes only. Always consult a licensed veterinarian for medical decisions.',
    // Sitter portal
    'portal.title':'Become a Petlyo Sitter',
    'portal.sub':'Join 140+ verified sitters. Get matched with pets that fit your lifestyle, experience, and home — not random requests.',
    'portal.perk1':'AI matches you to compatible pets','portal.perk2':'You set your own availability',
    'portal.perk3':'Build your reputation with reviews','portal.perk4':'Set your own rates',
    'portal.formTitle':'Create your sitter profile',
    'portal.apply':'Apply to join →',
    'portal.success.title':'Application received!',
    'portal.success.sub':'We\'ll review your profile and get back to you within 48 hours. Welcome to the Petlyo family!',
    'portal.success.btn':'Back to Petlyo',
    // Passport
    'pp.personality':'Personality','pp.care':'Care Guide','pp.notes':'Notes for sitter',
    'pp.feeding':'Feeding','pp.exercise':'Exercise','pp.medication':'Medication','pp.env':'Environment',
    'pp.copy':'🔗 Copy link','pp.share':'Share passport',
    // Live stay
    'stay.title':'🐾 Live Stay Updates','stay.report':'✦ AI Daily Report',
    'stay.mood':'Today\'s mood','stay.checkin':'📸 Request check-in from sitter',
    // Vet chat
    'vet.status':'Online now · Free consultation',
    'vet.greeting':'Hi! I\'m Dr. Sarah 👋 Tell me what\'s going on with your pet — symptoms, how long it\'s been happening, and any other details you\'ve noticed. I\'m here to help.',
    // Chat panel
    'chat.title':'Petlyo AI','chat.sub':'Pet care assistant',
    'chat.greeting':'Hi! I\'m Petlyo AI 🐾 Ask me anything about pet care, sitter matching, or how Petlyo works.',
    // Request modal
    'req.title':'Request sent!',
    'req.body':'Your stay request has been sent. Your sitter will respond within 24 hours to confirm availability for your dates.',
    'req.btn':'Done',
  },

  de: {
    // Nav
    'nav.symptoms':'Symptom-Check','nav.sitters':'Für Sitter','nav.cta':'Jetzt starten',
    // Hero
    'hero.label':'KI-gestütztes Tier-Matching',
    'hero.title':'Den perfekten Sitter für die einzigartige Persönlichkeit deines Tieres finden',
    'hero.sub':'Beantworte ein paar Fragen zu deinem Tier und wir matchen es mit Sittern, die seine Bedürfnisse wirklich verstehen — kein Rätselraten, keine generischen Suchen.',
    'hero.cta':'Mein Tier matchen','hero.demo':"So funktioniert's",
    'hero.proof':'Vertraut von 2.400+ Tierbesitzern · 140+ verifizierte Sitter',
    // Stats
    'stats.pets':'Gematchte Tiere','stats.sitters':'Verifizierte Sitter',
    'stats.satisfaction':'Besitzerzufriedenheit','stats.rating':'Durchschnittsbewertung',
    // How it works
    'how.label':'Der Prozess','how.title':'Vier Schritte zum perfekten Match',
    'how.sub':'Wir nehmen das Rätselraten aus der Sittersuche — denn jedes Tier ist anders.',
    'how.s1.title':'Erzähl uns von deinem Tier','how.s1.desc':'Name, Art, Persönlichkeitsmerkmale und die Umgebung, in der es am besten gedeiht.',
    'how.s2.title':'Wir analysieren das Match','how.s2.desc':'Unser Algorithmus bewertet jeden Sitter anhand der spezifischen Bedürfnisse und des Temperaments deines Tieres.',
    'how.s3.title':'Deine Top-Sitter ansehen','how.s3.desc':'Sieh dir die Rangliste mit Kompatibilitätswert und einer klaren Begründung für jedes Match an.',
    'how.s4.title':'Mit Vertrauen buchen','how.s4.desc':'Lies das vollständige Profil, prüfe die Kompatibilitätsaufschlüsselung und kontaktiere direkt.',
    // Features
    'feat.label':'Warum Petlyo','feat.title':'Rund um dein Tier gebaut, nicht um eine Suchmaske',
    'feat.sub':'Andere Plattformen berücksichtigen keine Persönlichkeit. Wir schon.',
    'feat.1.title':'Persönlichkeits-Matching','feat.1.desc':'Unser Algorithmus berücksichtigt Angst, Energielevel und Traumageschichte — nicht nur Standort und Preis.',
    'feat.2.title':'Verifizierte Sitter','feat.2.desc':'Jeder Sitter wird auf Erfahrung geprüft, von Besitzern bewertet und auf Spezialkompetenz eingeschätzt.',
    'feat.3.title':'Kompatibilitätsaufschlüsselung','feat.3.desc':'Sieh genau, warum ein Sitter gematcht wurde — Umgebungsfit, Energiematch, Routineausrichtung und Erfahrung.',
    'feat.4.title':'Sorglos zurücklehnen','feat.4.desc':'Wir matchen dein Tier mit Sittern, die solche Situationen kennen — ob Trennungsangst oder Seniorenpflege.',
    // Testimonials
    'test.label':'Was Besitzer sagen','test.title':'Echte Tiere. Echte Matches.',
    'test.sub':'Über 2.400 Matches vermittelt — das sagen unsere Besitzer.',
    'test.1.quote':'„Petlyo hat Biscuit mit der geduldigsten Sitterin gematcht. Sie verstand seine Trennungsangst vom ersten Tag an — keine Eingewöhnungszeit nötig."',
    'test.2.quote':'„Unsere Rettungskatze hat Trauma-Auslöser. Die KI-Analyse beschrieb sie perfekt — der Sitter passte schon vor dem ersten Besuch."',
    'test.3.quote':'„Die Kompatibilitätsaufschlüsselung zeigte uns genau, warum jeder Sitter eingestuft wurde. Diese Transparenz erreicht keine andere Plattform."',
    // CTA
    'cta.title':'Bereit, den richtigen Match zu finden?','cta.sub':'Dauert etwa 3 Minuten. Kein Konto erforderlich.','cta.btn':'Mein Tier matchen →',
    // Onboarding
    'onb.s1.title':'Fangen wir mit den Basics an','onb.s1.sub':'Erzähl uns ein wenig von deinem Tier, damit wir den richtigen Match finden können.',
    'onb.s2.title':'Wie würdest du dein Tier beschreiben?','onb.s2.sub':'Wähle alles Zutreffende — wir nutzen dies, um Sitter zu finden, die dein Tier wirklich verstehen.',
    'onb.s3.title':'Was braucht dein Tier in einem Zuhause?','onb.s3.sub':'Wähle die Umgebungsbedingungen, die für das Wohlbefinden deines Tieres am wichtigsten sind.',
    'onb.s4.title':'Routine & Aufenthaltsdetails','onb.s4.sub':'Hilf deinem Sitter zu verstehen, wie ein normaler Tag für dein Tier aussieht.',
    'onb.s5.title':'Fast geschafft — nur noch deine Daten','onb.s5.sub':'Wir nutzen dies, um dir deine Match-Ergebnisse zu senden. Kein Spam, versprochen.',
    'onb.privacy.title':'Deine Daten sind sicher','onb.privacy.desc':'Wir nutzen deine Daten nur, um dich mit Sittern zu verbinden. Wir verkaufen oder teilen deine Daten niemals ohne deine Zustimmung.',
    'onb.back':'← Zurück','onb.continue':'Weiter','onb.find':'Meine Matches finden',
    // Labels
    'lbl.petName':'Name des Tieres','lbl.species':'Tierart','lbl.breed':'Rasse','lbl.age':'Alter (Jahre)',
    'lbl.city':'Deine Stadt','lbl.feeding':'Fütterungsplan','lbl.exercise':'Bewegungsbedarf',
    'lbl.medication':'Medikamente oder medizinische Bedürfnisse','lbl.stayStart':'Aufenthaltsbeginn','lbl.stayEnd':'Aufenthaltsende',
    'lbl.notes':'Zusätzliche Hinweise für deinen Sitter?','lbl.ownerName':'Dein Name','lbl.ownerEmail':'E-Mail-Adresse',
    // Traits
    'trait.anxious':'Ängstlich','trait.anxious.desc':'Wird in neuen Situationen oder Umgebungen gestresst',
    'trait.social':'Sozial','trait.social.desc':'Liebt es, andere Tiere und Menschen kennenzulernen',
    'trait.highEnergy':'Viel Energie','trait.highEnergy.desc':'Braucht täglich viel Bewegung und Stimulation',
    'trait.shy':'Schüchtern','trait.shy.desc':'Braucht Zeit, um sich an neue Menschen und Orte zu gewöhnen',
    'trait.senior':'Senior','trait.senior.desc':'Älteres Tier mit langsamem Tempo und sanften Bedürfnissen',
    'trait.separation':'Trennungsangst','trait.separation.desc':'Hat Probleme allein zu sein, braucht Gesellschaft',
    'trait.rescue':'Rettungstier / Trauma','trait.rescue.desc':'Hat eine schwierige Vergangenheit, braucht Geduld und Struktur',
    'trait.playful':'Verspielt','trait.playful.desc':'Immer bereit für Spiele, Spielzeug und Abenteuer',
    // Environment
    'env.only':'Einziges Haustier','env.only.desc':'Am besten als einziges Tier im Haushalt',
    'env.garden':'Gartenzugang','env.garden.desc':'Braucht Zugang zu Außenbereichen zum Laufen und Erkunden',
    'env.calm':'Ruhig & Still','env.calm.desc':'Empfindlich gegenüber Lärm, Aktivität und lauten Umgebungen',
    'env.homeall':'Sitter den ganzen Tag zuhause','env.homeall.desc':'Braucht ständige Gesellschaft und Aufsicht den ganzen Tag',
    'env.dog':'Hundefreundlich','env.dog.desc':'Kommt gut mit anderen Hunden im Haushalt zurecht',
    'env.nokids':'Keine Kleinkinder','env.nokids.desc':'Wohler in einem Haushalt ohne kleine Kinder',
    // Matching
    'match.title':'Finde den perfekten Match','match.sub':'Analysiere dein Tierprofil mit über 140 Sittern…',
    // Results
    'results.top3':'Deine Top 3 Matches','results.insight':'✦ KI-Match-Einblick',
    'results.passport':'🪪 Tierausweis','results.live':'📡 Live-Updates',
    'results.refine':'Verfeinern','results.startover':'Neu starten',
    // Sitter detail
    'sitter.home':'🏡 Zuhause & Umgebung','sitter.compat':'📊 Kompatibilitätsaufschlüsselung',
    'sitter.env':'Umgebungsfit','sitter.energy':'Energiematch',
    'sitter.routine':'Routineausrichtung','sitter.exp':'Erfahrung mit Tierart',
    'sitter.factEnv':'Umgebungstyp','sitter.factPets':'Andere Tiere',
    'sitter.factHome':'Den ganzen Tag zuhause','sitter.factYears':'Jahre Erfahrung',
    'sitter.book':'Bereit, mit diesem Sitter zu buchen?','sitter.request':'Aufenthalt anfragen →',
    // Symptom checker
    'sym.title':'Ist mein Tier OK?',
    'sym.sub':'Beschreibe, was du siehst — unsere KI gibt sofort personalisierten Rat basierend auf Art, Rasse und Alter deines Tieres. Kostenlos, kein Konto nötig.',
    'sym.species':'Tierart','sym.breed':'Rasse','sym.age':'Alter',
    'sym.symptomsLabel':'Welche Symptome stellst du fest?',
    'sym.submit':'Sofortigen Rat erhalten →','sym.again':'Weiteres Symptom prüfen',
    'sym.help':'Brauchst du professionelle Hilfe?',
    'sym.findVet':'Tierarzt in deiner Nähe finden','sym.findVet.sub':'Auf Google Maps suchen',
    'sym.chatVet':'Online mit einem Tierarzt chatten','sym.chatVet.sub':'KI-gestützt · Kostenlos · Keine Wartezeit',
    'sym.emergency':'Notfalltierarzt in der Nähe','sym.emergency.sub':'Rund um die Uhr geöffnete Notfallkliniken',
    'sym.disclaimer':'⚠️ Dies ist eine KI-generierte Orientierungshilfe und dient nur zu Informationszwecken. Konsultiere immer einen zugelassenen Tierarzt für medizinische Entscheidungen.',
    // Sitter portal
    'portal.title':'Werde ein Petlyo-Sitter',
    'portal.sub':'Schließ dich 140+ verifizierten Sittern an. Werde mit Tieren gematcht, die zu deinem Lebensstil, deiner Erfahrung und deinem Zuhause passen.',
    'portal.perk1':'KI matcht dich mit kompatiblen Tieren','portal.perk2':'Du legst deine eigene Verfügbarkeit fest',
    'portal.perk3':'Bau deinen Ruf mit Bewertungen auf','portal.perk4':'Lege deine eigenen Preise fest',
    'portal.formTitle':'Erstelle dein Sitter-Profil',
    'portal.apply':'Bewerben →',
    'portal.success.title':'Bewerbung erhalten!',
    'portal.success.sub':'Wir prüfen dein Profil und melden uns innerhalb von 48 Stunden. Willkommen in der Petlyo-Familie!',
    'portal.success.btn':'Zurück zu Petlyo',
    // Passport
    'pp.personality':'Persönlichkeit','pp.care':'Pflegeanleitung','pp.notes':'Hinweise für den Sitter',
    'pp.feeding':'Fütterung','pp.exercise':'Bewegung','pp.medication':'Medikamente','pp.env':'Umgebung',
    'pp.copy':'🔗 Link kopieren','pp.share':'Ausweis teilen',
    // Live stay
    'stay.title':'🐾 Live-Aufenthalt-Updates','stay.report':'✦ KI-Tagesbericht',
    'stay.mood':'Heutige Stimmung','stay.checkin':'📸 Check-in vom Sitter anfordern',
    // Vet chat
    'vet.status':'Jetzt online · Kostenlose Beratung',
    'vet.greeting':'Hallo! Ich bin Dr. Sarah 👋 Erzähl mir, was mit deinem Tier los ist — Symptome, wie lange es schon anhält und andere Details. Ich bin für dich da.',
    // Chat panel
    'chat.title':'Petlyo KI','chat.sub':'Tierbetreuungsassistent',
    'chat.greeting':'Hallo! Ich bin Petlyo KI 🐾 Frag mich alles über Tierpflege, Sitter-Matching oder wie Petlyo funktioniert.',
    // Request modal
    'req.title':'Anfrage gesendet!',
    'req.body':'Deine Aufenthaltsanfrage wurde gesendet. Dein Sitter antwortet innerhalb von 24 Stunden, um die Verfügbarkeit zu bestätigen.',
    'req.btn':'Fertig',
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function setText(sel, val) {
  if (!val) return;
  document.querySelectorAll(sel).forEach(el => { el.textContent = val; });
}
function setPlaceholder(id, val) {
  if (!val) return;
  const el = document.getElementById(id);
  if (el) el.placeholder = val;
}

// ── Main apply function ───────────────────────────────────────────────────────
function applyLang(lang) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // data-i18n elements (landing page)
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });

  // ── Onboarding ────────────────────────────────────────────────────────────
  setText('#step-1 .step-heading', t['onb.s1.title']);
  setText('#step-1 .step-sub',     t['onb.s1.sub']);
  setText('#step-2 .step-heading', t['onb.s2.title']);
  setText('#step-2 .step-sub',     t['onb.s2.sub']);
  setText('#step-3 .step-heading', t['onb.s3.title']);
  setText('#step-3 .step-sub',     t['onb.s3.sub']);
  setText('#step-4 .step-heading', t['onb.s4.title']);
  setText('#step-4 .step-sub',     t['onb.s4.sub']);
  setText('#step-5 .step-heading', t['onb.s5.title']);
  setText('#step-5 .step-sub',     t['onb.s5.sub']);
  setText('.privacy-box-title',    t['onb.privacy.title']);
  setText('.privacy-box-desc',     t['onb.privacy.desc']);
  setText('#btn-prev',             t['onb.back']);

  // Trait cards
  const traitMap = [
    ['anxious','anxious'],['social','social'],['highEnergy','highEnergy'],
    ['shy','shy'],['senior','senior'],['separationAnxiety','separation'],
    ['rescueTrauma','rescue'],['playful','playful'],
  ];
  traitMap.forEach(([val, key]) => {
    const card = document.querySelector(`[data-value="${val}"]`);
    if (card) {
      const title = card.querySelector('.card-title');
      const desc  = card.querySelector('.card-desc');
      if (title) title.textContent = t[`trait.${key}`] || title.textContent;
      if (desc)  desc.textContent  = t[`trait.${key}.desc`] || desc.textContent;
    }
  });

  // Environment cards
  const envMap = [
    ['only pet','only'],['garden access','garden'],['calm/quiet','calm'],
    ['sitter home all day','homeall'],['dog-friendly','dog'],['no small children','nokids'],
  ];
  envMap.forEach(([val, key]) => {
    const card = document.querySelector(`[data-value="${val}"]`);
    if (card) {
      const title = card.querySelector('.card-title');
      const desc  = card.querySelector('.card-desc');
      if (title) title.textContent = t[`env.${key}`] || title.textContent;
      if (desc)  desc.textContent  = t[`env.${key}.desc`] || desc.textContent;
    }
  });

  // Form labels (onboarding)
  const labelMap = {
    'input-petName':'lbl.petName','input-species':'lbl.species','input-breed':'lbl.breed',
    'input-age':'lbl.age','input-city':'lbl.city','input-feeding':'lbl.feeding',
    'input-exercise':'lbl.exercise','input-medication':'lbl.medication',
    'input-stayStart':'lbl.stayStart','input-stayEnd':'lbl.stayEnd',
    'input-notes':'lbl.notes','input-ownerName':'lbl.ownerName','input-ownerEmail':'lbl.ownerEmail',
  };
  Object.entries(labelMap).forEach(([id, key]) => {
    const lbl = document.querySelector(`label[for="${id}"]`);
    if (lbl) lbl.firstChild.textContent = t[key] + ' ';
  });

  // Matching page
  setText('.matching-title', t['match.title']);
  setText('.matching-sub',   t['match.sub']);

  // Results page buttons
  setText('#btn-passport',  t['results.passport']);
  setText('#btn-live-stay', t['results.live']);
  setText('#btn-refine',    t['results.refine']);
  setText('#btn-start-over',t['results.startover']);
  setText('.results-section-title', t['results.top3']);
  setText('.insight-label', t['results.insight']);

  // Sitter detail
  document.querySelectorAll('.detail-card-title').forEach((el, i) => {
    if (i === 0) el.textContent = t['sitter.home'];
    if (i === 1) el.textContent = t['sitter.compat'];
  });
  document.querySelectorAll('.fact-label').forEach((el, i) => {
    const keys = ['sitter.factEnv','sitter.factPets','sitter.factHome','sitter.factYears'];
    if (t[keys[i]]) el.textContent = t[keys[i]];
  });
  document.querySelectorAll('.compat-label').forEach((el, i) => {
    const keys = ['sitter.env','sitter.energy','sitter.routine','sitter.exp'];
    if (t[keys[i]]) el.textContent = t[keys[i]];
  });
  setText('#sitter-detail-section h3', t['sitter.book']);
  setText('#btn-request-stay',         t['sitter.request']);

  // Symptom checker
  setText('.symptom-title',    t['sym.title']);
  setText('.symptom-subtitle', t['sym.sub']);
  document.querySelectorAll('.sym-label').forEach(el => {
    const txt = el.textContent.trim();
    if (txt.startsWith('Species'))   el.textContent = t['sym.species'];
    if (txt.startsWith('Breed'))     el.textContent = t['sym.breed'] + ' ';
    if (txt.startsWith('Age'))       el.textContent = t['sym.age'];
    if (txt.includes('symptoms'))    el.textContent = t['sym.symptomsLabel'];
  });
  setText('#sym-btn-text',         t['sym.submit']);
  setText('#sym-again',            t['sym.again']);
  setText('.vet-resources-title',  t['sym.help']);
  document.querySelectorAll('.vet-resource-card, #btn-vet-chat').forEach((card, i) => {
    const name = card.querySelector('.vrc-name');
    const sub  = card.querySelector('.vrc-sub');
    if (i === 0 && name) { name.textContent = t['sym.findVet']; if(sub) sub.textContent = t['sym.findVet.sub']; }
    if (i === 1 && name) { name.textContent = t['sym.chatVet']; if(sub) sub.textContent = t['sym.chatVet.sub']; }
    if (i === 2 && name) { name.textContent = t['sym.emergency']; if(sub) sub.textContent = t['sym.emergency.sub']; }
  });
  setText('.symptom-disclaimer', t['sym.disclaimer']);

  // Sitter portal
  setText('.portal-title',       t['portal.title']);
  setText('.portal-subtitle',    t['portal.sub']);
  document.querySelectorAll('.portal-perk span:last-child').forEach((el, i) => {
    const keys = ['portal.perk1','portal.perk2','portal.perk3','portal.perk4'];
    if (t[keys[i]]) el.textContent = t[keys[i]];
  });
  setText('.portal-form-title',  t['portal.formTitle']);
  setText('#portal-success h2',  t['portal.success.title']);
  setText('#portal-success p',   t['portal.success.sub']);
  const successBtn = document.querySelector('#portal-success .btn-primary');
  if (successBtn) successBtn.textContent = t['portal.success.btn'];
  document.querySelectorAll('#portal-form .sym-submit').forEach(el => { el.textContent = t['portal.apply']; });

  // Passport modal
  document.querySelectorAll('.passport-section-title').forEach((el, i) => {
    if (i === 0) el.textContent = t['pp.personality'];
    if (i === 1) el.textContent = t['pp.care'];
    if (i === 2) el.textContent = t['pp.notes'];
  });
  document.querySelectorAll('.pci-label').forEach(el => {
    const txt = el.textContent.trim();
    if (txt === 'Feeding' || txt === 'Fütterung')     el.textContent = t['pp.feeding'];
    if (txt === 'Exercise' || txt === 'Bewegung')     el.textContent = t['pp.exercise'];
    if (txt === 'Medication' || txt === 'Medikamente') el.textContent = t['pp.medication'];
    if (txt === 'Environment' || txt === 'Umgebung')  el.textContent = t['pp.env'];
  });
  setText('#pp-copy',  t['pp.copy']);
  setText('#pp-share', t['pp.share']);

  // Live stay modal
  setText('.stay-modal-title',  t['stay.title']);
  setText('.stay-report-label', t['stay.report']);
  setText('.stay-mood-label',   t['stay.mood']);
  setText('#btn-checkin',       t['stay.checkin']);

  // Vet chat
  setText('.vet-chat-status', t['vet.status']);

  // Chat panel
  setText('.chat-title',    t['chat.title']);
  setText('.chat-subtitle', t['chat.sub']);

  // Request modal
  setText('#modal-title',    t['req.title']);
  setText('#modal-close-btn',t['req.btn']);

  // Language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  window.currentLang = lang;
  document.documentElement.lang = lang;
  localStorage.setItem('lang', lang);
}

// ── Boot ──────────────────────────────────────────────────────────────────────
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});

applyLang(localStorage.getItem('lang') || 'en');
