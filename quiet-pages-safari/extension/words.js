// Built-in word lists, grouped into tiers you can switch on and off.
//
// How entries match:
//   "hell"   -> the whole word and its plural (hells). "hello" and "shell" are safe.
//   "piss+"  -> also -ed, -ing, -er, -y endings (pissed, pissing).
//   "*shit"  -> any word that CONTAINS it (bullshit, shitty, ...).
//   "oh my god" -> a phrase; any spacing between the words works.
// Add your own words in the extension popup instead of editing this file.

var QP_TIERS = {
  mild: {
    label: "Mild (damn, hell, crap)",
    on: true,
    words: ["*damn", "*dammit", "hell", "crap+", "frigging", "freaking"]
  },
  moderate: {
    label: "Moderate (sh*t, a**, b*tch, ...)",
    on: true,
    words: [
      "*shit", "ass", "assed", "*asshole", "dumbass", "jackass", "badass", "smartass", "kickass",
      "*bitch", "bastard", "piss+", "dick", "dickhead", "prick", "bollocks",
      "bugger+", "*douche", "whore", "slut", "cock", "tits", "arse", "arsed", "arsehole"
    ]
  },
  strong: {
    label: "Strong (f-word, c-word, ...)",
    on: true,
    words: ["*fuck", "*fuk", "*cunt", "*twat", "*wanker", "*motherf"]
  },
  religious: {
    label: "Using God's name as a swear word",
    on: false,
    words: [
      "*goddamn", "*goddam", "god damn", "god dammit", "god almighty", "oh my god", "my god",
      "oh god", "for god's sake", "for god sake", "jesus christ", "jesus h christ", "christ almighty",
      "oh jesus", "sweet jesus", "for christ's sake", "omg"
    ]
  }
};

// Words that would match a rule above but are ordinary words.
var QP_DEFAULT_ALLOW = ["scunthorpe", "cockpit", "cocktail", "cockatoo", "cockroach", "peacock", "hellenic"];
