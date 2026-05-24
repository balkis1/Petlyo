// ─── Scoring ────────────────────────────────────────────────────────────────

function scoreSitter(sitter, petData) {
  const traits = petData.traits || [];
  const env = petData.environment || [];

  let traitScore = 70;
  if (traits.length > 0) {
    const total = traits.reduce((sum, t) => sum + (sitter.traitScores[t] ?? 60), 0);
    traitScore = total / traits.length;
  }

  let envScore = 70;
  if (env.length > 0) {
    const met = env.filter(e => sitter.environmentTags.includes(e)).length;
    envScore = (met / env.length) * 100;
  }

  const raw = Math.round(0.6 * traitScore + 0.4 * envScore);
  return Math.min(99, Math.max(58, raw));
}

// ─── Compatibility Breakdown ─────────────────────────────────────────────────

function computeCompatibilityBreakdown(sitter, petData) {
  const traits = petData.traits || [];
  const env = petData.environment || [];

  // Environment fit: % of env requirements the sitter meets
  let envFit = 75;
  if (env.length > 0) {
    const met = env.filter(e => sitter.environmentTags.includes(e)).length;
    envFit = Math.round((met / env.length) * 100);
  }

  // Energy match: high-energy/playful pets want active sitters; calm pets want the inverse
  let energyMatch = 72;
  const energyWanted = traits.some(t => ['highEnergy', 'playful'].includes(t));
  const calmNeeded = traits.some(t => ['senior', 'anxious', 'shy', 'separationAnxiety'].includes(t));
  if (energyWanted && !calmNeeded) {
    energyMatch = Math.round((sitter.traitScores.highEnergy + sitter.traitScores.playful) / 2);
  } else if (calmNeeded && !energyWanted) {
    energyMatch = Math.round(100 - sitter.traitScores.highEnergy * 0.45);
  }

  // Routine alignment: homeAllDay bonus + experience years + env requirement penalty
  let routine = 58;
  if (sitter.homeAllDay) routine += 22;
  routine += Math.min(18, sitter.yearsExperience * 2);
  if (env.includes('sitter home all day')) {
    routine += sitter.homeAllDay ? 10 : -18;
  }

  // Experience with type: weighted average trait score + experience years bonus
  let expScore = 65;
  if (traits.length > 0) {
    const avgTrait = traits.reduce((s, t) => s + (sitter.traitScores[t] ?? 60), 0) / traits.length;
    expScore = Math.round(avgTrait * 0.72 + (sitter.yearsExperience / 12) * 28);
  }

  return {
    environment: clamp(envFit, 40, 99),
    energy:      clamp(energyMatch, 40, 99),
    routine:     clamp(routine, 40, 99),
    experience:  clamp(expScore, 40, 99)
  };
}

function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

// ─── Insight Generator ───────────────────────────────────────────────────────

function generateInsight(petData) {
  const name = petData.petName || 'Your pet';
  const traits = petData.traits || [];
  const env = petData.environment || [];
  const parts = [];

  // Opening sentence — personality
  if (traits.includes('anxious') && traits.includes('shy')) {
    parts.push(`${name} is a gentle, sensitive soul who experiences the world with heightened awareness — new situations and loud environments can be overwhelming for them.`);
  } else if (traits.includes('rescueTrauma')) {
    parts.push(`${name} has shown incredible resilience. As a rescue, they need a patient sitter who understands that trust is earned slowly and that predictability is the greatest kindness.`);
  } else if (traits.includes('senior')) {
    parts.push(`${name} is in their golden years and deserves gentle, attentive care from someone who understands the pace and needs of older pets.`);
  } else if (traits.includes('separationAnxiety')) {
    parts.push(`${name} forms deep bonds and genuinely struggles when left alone. They need a sitter who can offer consistent presence and calm, reassuring energy throughout the day.`);
  } else if (traits.includes('anxious')) {
    parts.push(`${name} is a sensitive pet who feels things deeply — a calm, predictable environment and a consistent routine are what allow them to truly relax and feel safe.`);
  } else if (traits.includes('shy')) {
    parts.push(`${name} is a gentle introvert who needs time and patience to come out of their shell. A sitter who won't rush the process makes all the difference.`);
  } else if (traits.includes('highEnergy') && traits.includes('playful')) {
    parts.push(`${name} is an absolute bundle of energy and joy who needs a sitter who can genuinely match their enthusiasm — long walks, play sessions, and outdoor adventures are non-negotiable.`);
  } else if (traits.includes('social')) {
    parts.push(`${name} is a confident, social pet who thrives on interaction and loves meeting new dogs. A lively, dog-friendly environment is where they truly shine.`);
  } else if (traits.includes('playful')) {
    parts.push(`${name} is a joyful, playful spirit who lives for fun and engagement. Boredom is their worst enemy — an active, attentive sitter is key.`);
  } else {
    parts.push(`${name} has a lovely, balanced personality that makes them adaptable to a range of caring environments — with the right sitter, they'll thrive.`);
  }

  // Middle — environment needs
  if (env.includes('calm/quiet') && env.includes('sitter home all day')) {
    parts.push(`They do best in a calm, quiet home where their sitter is present throughout the day — consistency is the foundation of their comfort.`);
  } else if (env.includes('sitter home all day')) {
    parts.push(`Having their sitter home throughout the day is important to ${name}'s sense of security and routine.`);
  } else if (env.includes('garden access') && env.includes('dog-friendly')) {
    parts.push(`Outdoor space and a dog-friendly environment will help ${name} feel stimulated, social, and at home.`);
  } else if (env.includes('garden access')) {
    parts.push(`Access to a garden or outdoor space will help ${name} burn energy and feel free to explore.`);
  } else if (env.includes('calm/quiet')) {
    parts.push(`A calm, low-stimulation environment will help ${name} settle in quickly and feel genuinely safe.`);
  }

  if (env.includes('only pet')) {
    parts.push(`${name} will be most comfortable as the sole pet in the home, receiving their sitter's full and undivided attention.`);
  }

  // Closing — what we've optimised for
  if (traits.includes('separationAnxiety') || traits.includes('anxious')) {
    parts.push(`We've prioritised sitters with proven experience handling anxious pets and who offer a stable, structured daily environment.`);
  } else if (traits.includes('rescueTrauma')) {
    parts.push(`We've matched ${name} with sitters who have specific hands-on experience with rescue and trauma-sensitive animals.`);
  } else if (traits.includes('senior')) {
    parts.push(`We've highlighted sitters with senior pet experience, including those comfortable with medication schedules and gentle mobility needs.`);
  } else if (traits.includes('highEnergy') || traits.includes('playful')) {
    parts.push(`We've found sitters with genuinely active lifestyles and the outdoor space to keep ${name} happy, exercised, and stimulated.`);
  } else {
    parts.push(`The sitters below have been ranked based on how closely their home environment, routine, and personal experience align with ${name}'s full profile.`);
  }

  return parts.join(' ');
}

// ─── Per-sitter Reason ───────────────────────────────────────────────────────

function generateSitterReason(sitter, petData) {
  const traits = petData.traits || [];
  const env = petData.environment || [];
  const name = petData.petName || 'your pet';
  const firstName = sitter.name.split(' ')[0];

  // Find trait with highest compatibility score
  let bestTrait = null;
  let bestScore = 0;
  traits.forEach(t => {
    const s = sitter.traitScores[t] ?? 0;
    if (s > bestScore) { bestScore = s; bestTrait = t; }
  });

  const envMet = env.filter(e => sitter.environmentTags.includes(e));
  const reasons = [];

  // Primary reason from best trait
  if (bestTrait === 'anxious' || bestTrait === 'separationAnxiety') {
    if (sitter.homeAllDay && sitter.otherPets === 'None') {
      reasons.push(`${firstName}'s sole-pet, full-time-home environment gives ${name} the undivided, distraction-free presence they need to feel truly settled`);
    } else if (sitter.yearsExperience >= 10) {
      reasons.push(`${firstName}'s ${sitter.yearsExperience} years of professional experience — including clinical work with anxious animals — means ${name}'s sensitivities are in expert hands`);
    } else {
      reasons.push(`${firstName} specialises in anxious and sensitive pets, providing the stable, predictable routine that ${name} depends on`);
    }
  } else if (bestTrait === 'rescueTrauma') {
    reasons.push(`${firstName}'s rescue background makes them uniquely equipped to give ${name} the patience and structure they need to feel safe`);
  } else if (bestTrait === 'senior') {
    reasons.push(`With ${sitter.yearsExperience} years of experience — including senior and medical care — ${firstName} understands ${name}'s gentle, attentive needs`);
  } else if (bestTrait === 'highEnergy' || bestTrait === 'playful') {
    reasons.push(`${firstName}'s active lifestyle and ${sitter.environmentType.toLowerCase()} are exactly what ${name} needs to stay happy and well-exercised`);
  } else if (bestTrait === 'social') {
    reasons.push(`${firstName}'s social, dog-friendly home gives ${name} the interaction and stimulation they love`);
  } else if (bestTrait === 'shy') {
    reasons.push(`${firstName} has experience with shy pets and gives them the time and quiet space to open up at their own pace`);
  } else {
    reasons.push(`${firstName}'s ${sitter.yearsExperience} years of experience and warm, welcoming home are a natural fit for ${name}`);
  }

  // Secondary reason from environment
  if (envMet.includes('only pet')) {
    reasons.push(`${name} would be the sole pet in their care`);
  } else if (envMet.includes('sitter home all day')) {
    reasons.push(`they're home all day to provide constant companionship`);
  } else if (envMet.includes('garden access')) {
    reasons.push(`their garden gives ${name} the outdoor freedom they need`);
  } else if (envMet.includes('calm/quiet')) {
    reasons.push(`their calm, quiet home suits ${name}'s sensitive temperament`);
  }

  return reasons.join(' — and ') + '.';
}

// ─── Main Export ─────────────────────────────────────────────────────────────

function getTopMatches(petData) {
  const scored = SITTERS.map(sitter => ({
    ...sitter,
    matchScore: scoreSitter(sitter, petData),
    matchReason: generateSitterReason(sitter, petData),
    breakdown: computeCompatibilityBreakdown(sitter, petData)
  }));

  scored.sort((a, b) => b.matchScore - a.matchScore);
  return scored.slice(0, 3);
}
