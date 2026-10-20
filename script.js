// Extend Math.random
Math._rng = [0x80000000, 1103515245, 12345, Math.floor(Math.random() * 1e10)];
Math.randSetSeed = s => Math._rng[3] = s;
Math.rand = function() {
    Math._rng[3] = (Math._rng[1] * Math._rng[3] + Math._rng[2]) % Math._rng[0];
    let
        r = Math._rng[3] / Math._rng[0],
        args = Array.from(arguments);
    if (args.length === 0) {
        return r;
    }
    let
        arr = typeof args[0] === 'object' ? args.shift() : null,
        max = typeof args[0] === 'number' ? args.shift() : 1,
        min = typeof args[0] === 'number' ? args.shift() : 0,
        int = typeof args[args.length - 1] === 'boolean' ? args.pop() : false,
        w = args[0],
        sd = args[1] || 3.5;
    if (arr) {
        return arr[Math.rand(
            arr.length,
            w === 'ziph'
                ? arr.map((a, i) => 1 / (i + 1))
                : w,
            true
        )];
    }
    if (w === 'norm') {
        Math._rng[3] = (Math._rng[1] * Math._rng[3] + Math._rng[2]) % Math._rng[0];
        do {
            r =
                Math.sqrt(-2 * Math.log(Math._rng[3] / Math._rng[0])) *
                Math.cos(2 * Math.PI * r);
            r = (r + sd) / (sd * 2);
        } while (r < 0 || r >= 1);
    } else if (typeof w === 'object') {
        for (let i = 1; i < w.length; i++) {
            w[i] += w[i - 1];
        }
        r *= w[w.length - 1];
        let
            i = w.findIndex(w => r < w),
            l = w[i - 1] || 0,
            u = w[i];
        r = (i + ((r - l) / (u - l))) / w.length;
    }
    r = Math.min(min, max) + (r * Math.abs(max - min));
    return int ? Math.floor(r) : r;
};

// List of which letters are allowed to follow each other
const LETTERS = {
        start: [
            'a','e','i','o','u','b','br','c','cr','ch','d','dr','f','fr','g','gr','h','j','k',
            'l','m','n','p','pr','ph','r','s','st','sh','sp','t','th','tr','v','w','y','z','qu','cl'
        ],
        end: [
            'a','e','ee','o','u','b','c','ch','d','f','ff','g','h','k',
            'l','ll','m','n','p','ph','r','s','ss','st','sh','t','th','w','y','z'
        ],
        middle: {
            'a': [
                'i','u','b','br','c','cr','ch','d','dd','dr','f','ff','fr','g','gg','gr','j','k',
                'l','ll','m','n','p','pp','pr','ph','r','s','ss','st','sh','sp','t','tt','th','tr','v','w','y','z','x','qu','cl'
            ],
            'e': [
                'a','i','o','u','b','br','c','cr','ch','d','dd','dr','f','ff','fr','g','gg','gr','j','k',
                'l','ll','m','n','p','pp','pr','ph','r','s','ss','st','sh','sp','t','tt','th','tr','v','w','y','z','x','qu','cl'
            ],
            'ee': [
                'b','br','c','cr','ch','d','dr','f','fr','g','gg','gr','j','k',
                'l','m','n','p','pp','pr','ph','r','s','st','sh','sp','t','th','tr','v','w','y','z','qu','cl'
            ],
            'i': [
                'a','e','o','u','b','br','c','cr','ch','d','dd','dr','f','ff','fr','g','gg','gr','k',
                'l','ll','m','n','p','pp','pr','ph','r','s','ss','st','sh','sp','t','tt','th','tr','v','z','x','qu','cl'
            ],
            'o': [
                'a','e','i','u','b','br','c','cr','ch','d','dd','dr','f','ff','fr','g','gg','gr','h','j','k',
                'l','ll','m','n','p','pp','pr','ph','r','s','ss','st','sh','sp','t','tt','th','tr','v','w','y','z','x','qu','cl'
            ],
            'oo': [
                'b','br','c','cr','ch','d','dr','f','fr','g','gr','h','j','k',
                'l','m','n','p','pr','ph','r','s','ss','st','sh','sp','t','tt','th','tr','v','w','y','z','qu','cl'
            ],
            'u': [
                'a','e','i','o','b','br','c','cr','ch','d','dd','dr','f','ff','fr','g','gg','gr','h','j','k',
                'l','ll','m','n','p','pp','pr','ph','r','s','ss','st','sh','sp','t','tt','th','tr','w','y','z','qu','cl'
            ],
            'b': [
                'a','e','ee','i','o','oo','u','y','a','e','i','o','u'
            ],
            'br': [
                'a','e','ee','i','o','oo','u','a','e','i','o','u'
            ],
            'c': [
                'a','e','ee','i','o','oo','u','y','a','e','i','o','u'
            ],
            'cl': [
                'a','e','ee','i','o','oo','u','a','e','i','o','u'
            ],
            'cr': [
                'a','e','ee','i','o','oo','u','y','a','e','i','o','u'
            ],
            'ch': [
                'a','e','ee','i','o','oo','u','y','a','e','i','o','u'
            ],
            'd': [
                'a','e','ee','i','o','oo','u','y','a','e','i','o','u'
            ],
            'dd': [
                'a','e','i','o','u'
            ],
            'dr': [
                'a','e','ee','i','o','oo','u','y','a','e','i','o','u'
            ],
            'f': [
                'a','e','ee','i','o','oo','u','y','a','e','i','o','u'
            ],
            'ff': [
                'a','e','i','o','u'
            ],
            'fr': [
                'a','e','ee','i','o','oo','u','y','a','e','i','o','u'
            ],
            'g': [
                'a','e','ee','i','o','oo','u','a','e','i','o','u'
            ],
            'gg': [
                'a','e','i','o','u'
            ],
            'gr': [
                'a','e','ee','i','o','oo','u','a','e','i','o','u'
            ],
            'h': [
                'a','e','ee','i','o','oo','u','a','e','i','o','u'
            ],
            'j': [
                'a','e','ee','i','o','oo','u','a','e','i','o','u'
            ],
            'k': [
                'a','e','ee','i','o','oo','u','y','a','e','i','o','u'
            ],
            'l': [
                'a','e','ee','i','o','oo','u','y','a','e','i','o','u'
            ],
            'll': [
                'a','e','i','o','u'
            ],
            'm': [
                'a','e','ee','i','o','oo','u','y','a','e','i','o','u'
            ],
            'n': [
                'a','e','ee','i','o','oo','u','y','a','e','i','o','u'
            ],
            'p': [
                'a','e','ee','i','o','oo','u','y','a','e','i','o','u'
            ],
            'pp': [
                'a','e','i','o','u','y'
            ],
            'ph': [
                'a','e','ee','i','o','oo','u','a','e','i','o','u'
            ],
            'pr': [
                'a','e','ee','i','o','oo','u','y','a','e','i','o','u'
            ],
            'r': [
                'a','e','ee','i','o','oo','u','y','a','e','i','o','u'
            ],
            's': [
                'a','e','ee','i','o','oo','u','y','a','e','i','o','u'
            ],
            'sp': [
                'a','e','ee','i','o','oo','u','y','a','e','i','o','u'
            ],
            'st': [
                'a','e','ee','i','o','oo','u','y','a','e','i','o','u'
            ],
            'sh': [
                'a','e','ee','i','o','oo','u','y','a','e','i','o','u'
            ],
            'ss': [
                'a','e','i','o','u'
            ],
            't': [
                'a','e','ee','i','o','oo','u','y','a','e','i','o','u'
            ],
            'th': [
                'a','e','ee','i','o','oo','u','y','a','e','i','o','u'
            ],
            'tr': [
                'a','e','ee','i','o','oo','u','y','a','e','i','o','u'
            ],
            'tt': [
                'a','e','ee','i','o','u'
            ],
            'v': [
                'a','e','ee','i','o','oo','u','a','e','i','o','u'
            ],
            'w': [
                'a','e','ee','i','o','oo','u','a','e','i','o','u'
            ],
            'y': [
                'a','e','ee','i','o','oo','u','a','e','i','o','u'
            ],
            'z': [
                'a','e','ee','i','o','oo','u','y','a','e','i','o','u'
            ],
            'x': [
                'a','e','ee','i','o','oo','u','a','e','i','o','u'
            ],
            'qu': [
                'a','e','ee','i','o','a','e','i','o'
            ]
        }
};

function generateWord() {
    let
        length = Math.rand([3, 4, 5, 6, 7, 8, 9], 'ziph'),
        word = Math.rand(LETTERS.start),
        currentLetter = word;
    while (true) {
        currentLetter = Math.rand(LETTERS.middle[currentLetter]);
        word += currentLetter;
        if (word.length >= length) {
            if (LETTERS.end.includes(currentLetter)) {
                return word;
            }
            let endRoute = LETTERS
                .middle[currentLetter]
                .filter(l => LETTERS.end.includes(l))
            if (endRoute.length) {
                return word + Math.rand(endRoute);
            }
        }
    }
}

function generatePoem(seed) {
    if (seed) {
        Math.randSetSeed(parseInt(seed.toLowerCase(), 36));
    }
    const SEED = Math._rng[3];
    let lexicon = [];
    for (let i = 0; i < 50; i++) {
        lexicon.push(generateWord());
    }
    
    // Allow short words to be generally more common
    lexicon.sort((a, b) => Math.rand() < 0.8 ? a.length - b.length : 1);
    
    // Add title
    document.body.innerHTML =
        '<h1>' +
        new Array(Math.rand(4, 1, true))
            .fill('')
            .map(t => Math.rand(lexicon))
            .join(' ') +
        '</h1>';

    let
        str = [],
        pLen = 15 + (Math.rand() * 30);
    for (let i = 0; i < pLen; i++) {
        str.push('')
        // Prevent the same word twice in row
        do {
            str[str.length - 1] = Math.rand(lexicon, 'ziph');
        } while (str[str.length - 1] === str[str.length - 2]);
    }
    str = addPunc(str);
    str = str.join(' ');
    str = addAccents(str);
    document.body.innerHTML += `
        ${ str }
        <div class="controls">
            <button onclick="generatePoem()">
                ${ Math.rand(lexicon) }?
            </button>
            <input
                class="seed"
                onfocus="event.target.select()"
                onblur="generatePoem(event.target.value)"
                autocomplete="off"
                spellcheck="false"
                onkeydown="event.key === 'Enter' ? generatePoem(event.target.value) : ''"
                value="${ SEED.toString(36).toUpperCase() }"
            />
        </div>
    `;
}

// Randomly add punction and formatting
function addPunc(str) {
    for (let i = 0; i < str.length - 2; i++) {
        const R = Math.rand();
        if (R < 0.3) {
            let punc = Math.rand(
                ['.', ',', '?', '!', ' —'],
                [ 15,    10,     4,     2,     1]
            );
            str[i] += punc;
            if ('.!?'.indexOf(punc) > -1) {
                str[i + 1] = str[i + 1][0].toUpperCase() + str[i + 1].substr(1);
                str[i] += new Array(R < 0.1 ? 2 : R < 0.2 ? 1 : 0)
                    .fill('<br/>')
                    .join('');
            }
        }
    }
    str[0] = str[0][0].toUpperCase() + str[0].substr(1);
    str[str.length - 1] += Math.rand(['.', '?', '!'], 'ziph');
    return str;
}

// Randomly select from types of accents,
// then randomly apply to string
function addAccents(str) {
    let allAccs = [
        'ŵŷêîûôâ',
        'čňǔřǐěǎšğž',
        'óíéúáśźćń',
        'õĩẽũãñ',
        'òìèùà',
        'öïëüä',
        'ōīēūā',
        'țșķļņ',
        'øħł',
        'įęşç',
        'ėġżċ',
        'ůå'
    ];
    let accs = [];
    if (Math.rand() < 0.8) {
        accs.push(Math.rand(allAccs));
        if (Math.random() < 0.5) {
            accs.push(Math.rand(allAccs));
        }
        accs = accs
            .map(a => a.split(''))
            .flat()
            .sort(() => Math.rand() < 0.5 ? -1 : 1);
        accs
            .slice(Math.min(accs.length, Math.rand(1, 4, true)) * -1)
            .map(a => [latinize(a), a])
            .forEach(a =>
                str = str.replaceAll(a[0], () => Math.rand() < 0.2 ? a[1] : a[0])
            );
    }
    return str;
}

function latinize(str) {
    return str
        .replace(/ŵ/g, 'w')
        .replace(/[èéêëěẽēėę]/g, 'e')
        .replace(/ř/g, 'r')
        .replace(/[țťþ]/g, 't')
        .replace(/ŷ/g, 'y')
        .replace(/[ùúûüǔũūűů]/g, 'u')
        .replace(/[ìíîïǐĩīıį]/g, 'i')
        .replace(/œ/g, 'oe')
        .replace(/æ/g, 'ae')
        .replace(/[òóôöǒøõō]/g, 'o')
        .replace(/[àáâäǎãåā]/g, 'a')
        .replace(/[ßşșśš]/g, 's')
        .replace(/[ďð]/g, 'd')
        .replace(/[ğġ]/g, 'g')
        .replace(/ħ/g, 'h')
        .replace(/ķ/g, 'k')
        .replace(/[łļľ]/g, 'l')
        .replace(/[źžż]/g, 'z')
        .replace(/[çćčċ]/g, 'c')
        .replace(/[ñńņň]/g, 'n')
}

generatePoem();
