let maxSyllables = 3;

let consonants = Seq.with(
    "b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"
);

let vowels = Seq.with(
    "a", "e", "i", "o", "u"
);

let initialOnsets = Seq.with(
    "b", "d", "f", "g", "h", "j", "c", "l", "m", "n", "p", "r", "s", "t", "v", "w", "y", "z", "th", "sh", "ch",
    "pl", "bl", "cl", "gl", "pr", "br", "tr", "dr", "cr", "gr", "tw", "qu", "pw",
    "fl", "sl", "thl", "schl", "fr", "thr", "shr", "wh", "sw", "thw", "voi",
    "pu", "pew", "beau", "tu", "tew", "du", "dew", "mu", "mew", "new", "nu", "few", "fu", "view", "thew", "sui", "zeu", "hu", "hew", "lu", "lew",
    "st", "sp", "sk",
    "sm", "sn",
    "sph", "sth",
    "spl", "scl", "spr", "str", "scr", "squ", "spu", "spew", "stu", "stew", "skew",
    "smew", "smu", "snew", "snu",
    "sphr"
);

let medialOnsets = Seq.with(
    "b", "d", "f", "g", "h", "j", "c", "l", "m", "n", "p", "r", "s", "t", "v", "w", "y", "z", "th", "sh", "ch",
    "pl", "bl", "cl", "gl", "pr", "br", "tr", "dr", "cr", "gr",
    "fl", "sl", "fr", "thr", "shr", "sw",
    "st", "sp", "sk",
    "sm", "sn",
    "sph", "sth",
    "spl", "spr", "str", "scr"
);

let difficultyPrefix = Seq.with(
    Seq.with("Wasted", "Weak", "Pointless", "Pathetic"),
    Seq.with("Moderate", "Understandable", "Armored", "Rebuilt"),
    Seq.with("Enforced", "Powered", "Crazy"),
    Seq.with("Reinforced", "Insane"),
    Seq.with("Feared", "Absolute", "Absolutely Insane")
);

let nuclei = Seq.with(
    "a", "e", "i", "o", "u", "ow", "ou", "ie", "igh", "oi", "oo", "ea", "ee"
);

let nucleiOnset = Seq.with(
    "ie", "igh", "ay", "eer", "air", "ure"
);

let nucleiCoda = Seq.with(
    "ou", "oo", "ea", "ee"
);

let codas = Seq.with(
    "b", "d", "f", "g", "c", "l", "m", "n", "p", "r", "s", "t", "v", "y", "z", "ng", "th", "sh", "ch",
    "lp", "lb", "lt", "ld", "lch", "lge", "lk",
    "rp", "rb", "rt", "rd", "rch", "rge", "rk", "rg", "rgue",
    "lf", "lve", "lth", "lse", "lls", "lsh",
    "rf", "rve", "rth", "rce", "rs", "rsh",
    "lm", "ln",
    "rm", "rn", "rl",
    "mp", "nt", "nd", "nch", "nge", "nk",
    "mph", "mes", "mth", "nf", "nth", "nce", "nze", "ngs", "ngth",
    "ft", "sp", "st", "sk", "shed",
    "zed", "thed",
    "fth", "fths",
    "pt", "kt",
    "pts", "kts",
    "pth", "pse", "bbs", "ts", "dth", "dze", "x", "ggs",
    "lmd", "lpt", "lps", "lfth", "ltz", "lst", "lct", "lx",
    "rmed", "rmth", "rpt", "rpse", "rned", "rtz", "rst", "rld", "rct", "rks",
    "mpt", "mpse", "ntz", "ndth", "nct", "nx", "ngth",
    "ndths",
    "mt", "md", "nged",
    "xth", "xt",
    "xths", "xthed", "xts"
);

let bridges = Seq.with(
    "b", "c", "d", "ph", "ck", "l", "m", "n", "p", "s", "t", "v", "z"
);

let survivalSuffix = Seq.with(
    "Valleys",
    "Mountains",
    "Area",
    "Land",
    "Wastes",
    "Range",
    "Flats"
);

let attackSuffix = Seq.with(
    "Control Point",
    "Outpost",
    "Defense",
    "Base",
    "Settlement",
    "Headquarters",
    "Station"
);

function consonant(l){
    return consonants.contains(l != null ? l : "");
}

function vowel(l){
    return vowels.contains(l != null ? l : "");
}

function generateSyllable(rand, first, last){
    let out = "";
    
    let onsets = first ? initialOnsets : medialOnsets;
    
    let nextFloat = rand.nextFloat();
    if(first && last){
        if(nextFloat < 0.1){
            out += onsets.random(rand);
            out += nucleiOnset.random(rand);
        }else if(nextFloat < 0.2){
            out += nucleiCoda.random(rand);
            out += codas.random(rand);
        }else{
            out += onsets.random(rand);
            out += nuclei.random(rand);
            out += codas.random(rand);
        }
    }else if(nextFloat < 0.1 || !last){
        out += onsets.random(rand);
        out += nucleiOnset.random(rand);
    }else if(nextFloat < 0.2 && !last){
        out += nucleiCoda.random(rand);
        out += codas.random(rand);
    }else{
        out += onsets.random(rand);
        out += nuclei.random(rand);
        out += codas.random(rand);
    }
    
    return out;
}

function generate(rand){
    let out = "";
    
    let syllables = rand.random(1, maxSyllables);
    for(let i = 0; i < syllables; i++){
        out += generateSyllable(rand, i == 0, i == syllables - 1);
    }
    
    return out.substring(0, 1).toUpperCase() + out.substring(1);
}

function generateName(sector){
    let rand = new Rand(sector.id);
    let out = "";
    let difficulty = "";
    if(rand.chance(0.5)){
        difficulty = difficultyPrefix.get(Mathf.clamp(Math.floor(sector.threat / 0.25), 0, difficultyPrefix.size - 1)).random(rand);
    }
    let suffix = sector.hasEnemyBase() ? attackSuffix.random(rand) : survivalSuffix.random(rand);
    let word = generate(rand);
    let wordType = rand.random(1);
    if(wordType >= 0.66){
        if(difficulty.length > 0){
            out += difficulty + " " + suffix + " of " + word;
        }else{
            out += suffix + " of " + word;
        }
    }else if(wordType >= 0.33){
        if(difficulty.length > 0){
            out += difficulty + " " + word + " " + suffix;
        }else{
            out += word + " " + suffix;
        }
    }else{
        if(difficulty.length > 0){
            out += word + " the " + difficulty + " " + suffix;
        }else{
            out += word + " the " + suffix;
        }
    }
    sector.setName(out);
}

Events.on(ClientLoadEvent, e => {
    Vars.content.planets().each(p => p.sectors.each(s => s.preset == null, generateName));
});
