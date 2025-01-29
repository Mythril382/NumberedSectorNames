/* Entire thing taken from the Random Mindustry mod. */
let lastLetter = null;

let vowels = Seq.with(
    "a", "e", "i", "o", "u"
);

let consonants = Seq.with(
    "b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"
);

let vowelsAvoid = ObjectMap.of(
    "a", Seq.with("j", "q", "x", "z"),
    "e", Seq.with("j", "q", "x", "z"),
    "i", Seq.with("j", "q", "x", "z"),
    "o", Seq.with("j", "q", "x", "z"),
    "u", Seq.with("j", "q", "x", "z")
);

let consonantsAvoid = ObjectMap.of(
    "c", Seq.with("e", "i"),
    "g", Seq.with("e", "i"),
    "h", Seq.with("u"),
    "j", Seq.with("e", "i"),
    "k", Seq.with("e"),
    "q", Seq.with("e", "i"),
    "v", Seq.with("o", "u"),
    "w", Seq.with("i"),
    "y", Seq.with("i"),
    "z", Seq.with("a")
);

let initialTmp = Seq.with(
    "cvc", "vcv", "cv", "vc", "c", "v"
);

let consonantTmp = Seq.with(
    "vcv", "vc", "v"
);

let vowelTmp = Seq.with(
    "cvc", "cv", "c"
);

let difficultyPrefix = Seq.with(
    Seq.with("Wasted", "Weak", "Pointless", "Dead"),
    Seq.with("Moderate", "Understandable", "Armored", "Rebuilt"),
    Seq.with("Enforced", "Powered", "Crazy"),
    Seq.with("Reinforced", "Insane"),
    Seq.with("Feared", "Absolute", "Absolutely Insane")
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

function generateSyllable(r){
    let tmp;
    if(consonant(lastLetter)){
        tmp = consonantTmp.random(r);
    }else if(vowel(lastLetter)){
        tmp = vowelTmp.random(r);
    }else{
        tmp = initialTmp.random(r);
    }
    let out = "";
    for(let i = 0; i < tmp.length; i++){
        let letter;
        if(tmp.charAt(i) == "c"){
            let picked = consonants.copy();
            if(lastLetter != null && consonantsAvoid.containsKey(lastLetter)){
                picked.removeAll(consonantsAvoid.get(lastLetter));
            }
            letter = picked.random(r);
        }else{
            let picked = vowels.copy();
            if(lastLetter != null && vowelsAvoid.containsKey(lastLetter)){
                picked.removeAll(vowelsAvoid.get(lastLetter));
            }
            letter = picked.random(r);
        }
        out += letter;
        lastLetter = letter;
    }
    return out;
}

function uppercaseFirst(str){
    return str.substring(0, 1).toUpperCase() + str.substring(1);
}

function generateWord(size, r){
    let out = "";
    for(let i = 0; i < size; i++) out += generateSyllable(r);
    lastLetter = null;
    return uppercaseFirst(out);
}

function generateName(sector){
    let r = new Rand(sector.id);
    let out = "";
    let difficulty = "";
    if(r.chance(0.5)){
        difficulty = difficultyPrefix.get(sector.threat / 0.25).random(r);
    }
    let suffix = sector.hasEnemyBase() ? attackSuffix.random(r) : survivalSuffix.random(r);
    let word = generateWord(r.random(1, 5), r);
    let wordType = r.random(1);
    if(wordType >= 0.66){
        out += difficulty + " " + suffix + " of " + word;
    }else if(wordType >= 0.33){
        out += difficulty + " " + word + " " + suffix;
    }else{
        out += word + " the " + difficulty + " " + suffix;
    }
    sector.setName(out + " [darkgray](" + sector.id + ")");
}

Events.on(ClientLoadEvent, e => {
    Vars.content.planets().each(p => p.sectors.each(s => s.preset == null, generateName));
});
