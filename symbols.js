// Offline dream symbol guide — used when no BYOK key is set.
// Each entry: words that trigger it, then a core meaning and short notes per lens.
window.MDC_SYMBOLS = [
  { k: ["fall", "falling", "fell"], core: "Loss of control, insecurity, or letting go of something you have been gripping too tightly.",
    Jungian: "The ego losing its footing; the psyche asking you to come down to earth.", Biblical: "Humility after pride; a warning to steady your foundation.", Islamic: "Often read as a change in standing; seek steadiness and patience.", Emotional: "Anxiety about a situation that feels unsupported.", Creative: "A drop into the unknown: the start of a story, not the end." },
  { k: ["teeth", "tooth"], core: "Confidence, appearance, and how you are seen; losing teeth often means fear of losing power or words.",
    Jungian: "Anxiety about the persona, the face you show the world.", Biblical: "Strength and judgement; broken teeth can mean broken power.", Islamic: "Teeth are often linked with family members and their wellbeing.", Emotional: "Worry about saying the wrong thing, or ageing.", Creative: "A character who can no longer speak their truth." },
  { k: ["water", "sea", "ocean", "river", "flood", "wave", "waves"], core: "Emotion and the unconscious. Calm water means calm feelings; rough or rising water means overwhelm.",
    Jungian: "The collective unconscious itself; depth you have not yet explored.", Biblical: "Cleansing, renewal and the Spirit; floods can mean trial.", Islamic: "Clear water is often a sign of knowledge and provision.", Emotional: "How full your emotional cup is right now.", Creative: "A tide that carries the plot somewhere new." },
  { k: ["snake", "serpent", "snakes"], core: "Transformation, healing, hidden fear, or a person you do not trust.",
    Jungian: "Instinctive energy rising; shedding an old skin.", Biblical: "Temptation and deception, but also the bronze serpent of healing.", Islamic: "Often read as an enemy; its size can show the threat's strength.", Emotional: "An unease you have not named.", Creative: "The shapeshifter: someone in the story is not who they seem." },
  { k: ["house", "home", "room", "rooms"], core: "The self. Different rooms are different parts of your life; hidden rooms are unexplored potential.",
    Jungian: "The structure of the psyche; the cellar is the unconscious.", Biblical: "Your life and household; building on rock or sand.", Islamic: "The house is often the dreamer's own body or family.", Emotional: "How safe and settled you feel.", Creative: "A setting with secret doors waiting to be opened." },
  { k: ["door", "doors", "locked"], core: "Opportunity and transition. A locked door is a blocked path or a part of you kept closed.",
    Jungian: "A threshold between conscious and unconscious.", Biblical: "‘Knock and it shall be opened’: invitation and access.", Islamic: "Doors can mean a means of livelihood opening or closing.", Emotional: "Readiness, or reluctance, to face something new.", Creative: "The moment before the reveal." },
  { k: ["chase", "chased", "chasing", "running"], core: "Avoidance. What chases you is often a feeling or task you are running from.",
    Jungian: "The shadow pursuing you, asking to be faced.", Biblical: "Fleeing like Jonah from a calling.", Islamic: "Running from a fear; turn and seek refuge.", Emotional: "Stress that will not let you rest.", Creative: "Turn the chase around and let the hero face the pursuer." },
  { k: ["fly", "flying", "flight", "wings"], core: "Freedom, perspective, and rising above a problem.",
    Jungian: "Transcendence; or, if unstable, inflation of the ego.", Biblical: "Mounting up with wings like eagles: renewed strength.", Islamic: "Travel or a rise in status, depending on how it ends.", Emotional: "Relief, joy, release.", Creative: "A bird's-eye view that reframes the whole scene." },
  { k: ["death", "dying", "dead", "funeral"], core: "Endings and transformation, rarely literal. Something is finishing so something else can begin.",
    Jungian: "Death and rebirth of an attitude or life stage.", Biblical: "Dying to the old self; resurrection.", Islamic: "Often read as a long life or a change of state, not literal death.", Emotional: "Grief for a chapter that is closing.", Creative: "The end of act one." },
  { k: ["baby", "infant", "pregnant", "birth"], core: "New beginnings, a fresh idea, or vulnerability that needs care.",
    Jungian: "The divine child; new potential in the psyche.", Biblical: "Promise, blessing and new covenant.", Islamic: "Can signal provision, or new responsibility.", Emotional: "Something tender that needs protecting.", Creative: "An idea just born; nurture it." },
  { k: ["car", "driving", "vehicle", "bus", "train"], core: "Direction and control in waking life. Who is driving matters.",
    Jungian: "The ego's vehicle; a passenger seat means someone else steers.", Biblical: "Your path and calling.", Islamic: "The journey of life and its pace.", Emotional: "Whether you feel in charge of where things are heading.", Creative: "A road trip toward a destination you have not named yet." },
  { k: ["fire", "flames", "burning"], core: "Passion, anger, purification or destruction.",
    Jungian: "Libido and transformation; the alchemist's flame.", Biblical: "God's presence, refining, and judgement.", Islamic: "Can warn of conflict; light without smoke is gentler.", Emotional: "Something heated you are holding in.", Creative: "A forge where something new is shaped." },
  { k: ["exam", "test", "school", "late"], core: "Self-evaluation and fear of not being ready.",
    Jungian: "The psyche testing whether you have integrated a lesson.", Biblical: "Trials that prove faith.", Islamic: "A test from which patience brings reward.", Emotional: "Performance pressure.", Creative: "A trial the hero must pass." },
  { k: ["naked", "nude", "undressed"], core: "Exposure and vulnerability; fear of being seen as you are.",
    Jungian: "The persona slipping; authenticity breaking through.", Biblical: "Innocence or shame, as in Eden.", Islamic: "Often linked with something hidden becoming known.", Emotional: "Feeling unprepared or judged.", Creative: "A character stripped of every disguise." },
  { k: ["moon", "night", "stars", "star"], core: "Intuition, cycles, mystery and the feminine.",
    Jungian: "The anima and the unconscious realm.", Biblical: "Signs and seasons; God's faithful order.", Islamic: "The moon is often a guide or a respected figure.", Emotional: "Quiet reflection.", Creative: "A nocturne; perfect for this app." },
  { k: ["sun", "light", "dawn", "sunrise"], core: "Clarity, vitality and awareness.",
    Jungian: "Consciousness and the Self.", Biblical: "Righteousness and God's glory.", Islamic: "A ruler or a great blessing.", Emotional: "Hope returning.", Creative: "The final scene bathed in light." },
  { k: ["dog", "dogs", "puppy"], core: "Loyalty, friendship and protective instinct.",
    Jungian: "A guide between worlds; instinct you can trust.", Biblical: "Mixed: loyalty, but also scavenging and impurity.", Islamic: "Often read as a lesser enemy or an unworthy person.", Emotional: "Needing, or being, a faithful companion.", Creative: "A loyal sidekick." },
  { k: ["cat", "cats", "kitten"], core: "Independence, intuition and mystery.",
    Jungian: "The feminine instinct; self-possession.", Biblical: "Rarely mentioned; independence apart from the flock.", Islamic: "Often a thief or a sly person, or a household servant.", Emotional: "Wanting space on your own terms.", Creative: "A cryptic guide who knows more than they say." },
  { k: ["spider", "spiders", "web"], core: "Creativity and patience, or feeling trapped.",
    Jungian: "The devouring mother, or the weaver of fate.", Biblical: "Fragile trust: ‘a spider's web’.", Islamic: "A weak enemy; the spider sheltered the Prophet in the cave.", Emotional: "Feeling caught in a situation.", Creative: "A web of plot threads." },
  { k: ["blood", "bleeding"], core: "Life force, passion, or emotional wounds.",
    Jungian: "Vital energy; sacrifice.", Biblical: "Covenant, atonement and life.", Islamic: "Often linked with unlawful gain or a sin to cleanse.", Emotional: "Feeling drained.", Creative: "Stakes have just been raised." },
  { k: ["money", "gold", "coins", "treasure"], core: "Self-worth, value and power.",
    Jungian: "The treasure hard to attain: the Self.", Biblical: "Stewardship; where your treasure is, your heart is.", Islamic: "Can mean worry rather than wealth; gold can mean trial.", Emotional: "Feeling valued, or not.", Creative: "A quest object." },
  { k: ["wedding", "marriage", "ring"], core: "Union, commitment, merging parts of yourself.",
    Jungian: "The sacred marriage of opposites within.", Biblical: "Covenant; the wedding feast.", Islamic: "Joining, a new bond, or a change in circumstance.", Emotional: "Desire for commitment or fear of it.", Creative: "Two storylines joining." },
  { k: ["mirror", "reflection"], core: "Self-image and self-reflection.",
    Jungian: "Meeting the shadow or the true face.", Biblical: "Seeing ‘through a glass, darkly’.", Islamic: "Can relate to one's spouse, child or status.", Emotional: "How you judge yourself.", Creative: "A doorway to another world." },
  { k: ["forest", "woods", "trees", "tree"], core: "The unknown, growth and the unconscious.",
    Jungian: "Entering the unconscious; getting lost to be found.", Biblical: "The tree of life; being planted by streams.", Islamic: "Trees often represent people and their character.", Emotional: "Feeling lost, or needing quiet.", Creative: "The enchanted wood of fairy tales." },
  { k: ["stairs", "staircase", "ladder", "elevator", "lift"], core: "Progress between levels of awareness or status.",
    Jungian: "Ascent to consciousness, descent into the unconscious.", Biblical: "Jacob's ladder: heaven touching earth.", Islamic: "Rising in rank or in faith.", Emotional: "Climbing toward a goal, or slipping back.", Creative: "Each floor reveals a new chapter." },
  { k: ["bird", "birds", "owl", "crow", "raven"], core: "Messages, spirit and freedom.",
    Jungian: "Spirit, thought and intuition.", Biblical: "The dove of peace; ravens that feed Elijah.", Islamic: "Birds can be news, deeds or travellers.", Emotional: "Longing for freedom.", Creative: "A messenger arriving." },
  { k: ["storm", "thunder", "lightning", "rain"], core: "Turmoil, release and sudden change.",
    Jungian: "Emotional energy breaking through.", Biblical: "God's power; calming the storm.", Islamic: "Rain is mercy; storms can mean hardship.", Emotional: "Tension that needs to break.", Creative: "The climax before calm." },
  { k: ["lost", "maze", "labyrinth"], core: "Uncertainty about your direction.",
    Jungian: "The journey to the centre of the Self.", Biblical: "The lost sheep, sought and found.", Islamic: "Seek guidance; straying from the straight path.", Emotional: "Not knowing what comes next.", Creative: "The hero's wandering before the turning point." },
  { k: ["phone", "call", "message"], core: "Communication; trying to reach someone or be heard.",
    Jungian: "A message from the unconscious.", Biblical: "A calling.", Islamic: "News arriving.", Emotional: "Fear of disconnection.", Creative: "A call to adventure." },
  { k: ["hair", "haircut", "bald"], core: "Strength, identity and how you present yourself.",
    Jungian: "Thoughts and vitality.", Biblical: "Samson's strength.", Islamic: "Long hair can mean wealth or honour.", Emotional: "Self-image.", Creative: "A transformation scene." }
];

window.MDC_lookupSymbols = function (text, lens) {
  const words = (text || "").toLowerCase().match(/[a-z']+/g) || [];
  const hits = [];
  for (const entry of window.MDC_SYMBOLS) {
    if (entry.k.some((k) => words.includes(k)) && !hits.includes(entry)) hits.push(entry);
  }
  return hits.map((e) => ({ name: e.k[0], core: e.core, lens: e[lens] || "" }));
};

