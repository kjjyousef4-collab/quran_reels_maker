/* ============================================
   QURAN REELS MAKER - Full Client-Side App
   ============================================ */
'use strict';

// ── API Keys ──
const PIXABAY_KEY = '34128042-b8f7a9ec238f6a9e676371552';
const PEXELS_KEY = 'ml2IGQQY9oL1xEcMvg2OKeiBOnRMyWXXHOkRLByTukIuVL9dev3FGbad';

// ── mp4-muxer (loaded dynamically) ──
let Mp4Muxer = null;

// ── Background categories (clean short queries for best API results) ──
const BG_CATEGORIES = {
    natural: {
        key: 'طبيعية',
        items: [
            { key: 'جبال', queries: ['mountain landscape', 'mountain peaks', 'snowy mountains', 'mountain sunrise', 'mountain valley', 'alps landscape'] },
            { key: 'بحر ومحيط', queries: ['ocean waves', 'sea horizon', 'calm sea', 'blue ocean', 'sea sunset', 'tropical sea'] },
            { key: 'سماء وليل', queries: ['night sky stars', 'milky way', 'starry night', 'aurora borealis', 'night galaxy', 'dark sky stars'] },
            { key: 'شروق وغروب', queries: ['sunrise landscape', 'sunset clouds', 'golden sunset', 'sunrise horizon', 'dramatic sunset', 'orange sky'] },
            { key: 'غابات وشلالات', queries: ['forest waterfall', 'green forest', 'tropical jungle', 'autumn forest', 'misty forest', 'tall trees'] },
            { key: 'مطر وغيوم', queries: ['rain clouds', 'storm sky', 'dramatic clouds', 'dark clouds', 'lightning storm', 'moody sky'] },
            { key: 'صحراء', queries: ['desert dunes', 'sahara desert', 'sand dunes sunset', 'desert landscape', 'golden desert', 'desert night'] },
            { key: 'فضاء ونجوم', queries: ['nebula space', 'galaxy stars', 'deep space', 'cosmos universe', 'planet earth', 'space nebula'] },
            { key: 'تحت الماء', queries: ['underwater coral', 'ocean reef', 'deep sea', 'underwater sunlight', 'blue underwater', 'coral reef'] },
            { key: 'أزهار وورود', queries: ['flower garden', 'roses bloom', 'cherry blossom', 'lavender field', 'spring flowers', 'wild flowers'] }
        ]
    },
    holy: {
        key: 'أماكن مقدسة',
        items: [
            { key: 'الكعبة', queries: ['kaaba makkah', 'kaaba night', 'kaaba aerial', 'makkah kaaba', 'holy kaaba', 'kaaba pilgrimage'] },
            { key: 'المسجد الحرام', queries: ['masjid haram', 'makkah mosque', 'haram makkah', 'grand mosque makkah', 'mecca mosque', 'masjid al haram'] },
            { key: 'المسجد النبوي', queries: ['masjid nabawi', 'medina mosque', 'prophet mosque', 'green dome medina', 'nabawi night', 'medina city'] },
            { key: 'مساجد', queries: ['mosque architecture', 'mosque interior', 'mosque dome', 'blue mosque', 'mosque minaret', 'beautiful mosque'] },
            { key: 'زخارف إسلامية', queries: ['islamic pattern', 'islamic geometric', 'arabesque art', 'islamic tile', 'islamic mosaic', 'islamic ornament'] },
            { key: 'خط عربي', queries: ['arabic calligraphy', 'islamic calligraphy', 'quran calligraphy', 'arabic art', 'gold calligraphy', 'islamic writing'] }
        ]
    },
    abstract: {
        key: 'مجردة وفنية',
        items: [
            { key: 'تدرجات ضوئية', queries: ['abstract light', 'bokeh lights', 'light particles', 'golden bokeh', 'abstract gradient', 'light rays'] },
            { key: 'دخان وضباب', queries: ['smoke dark', 'fog mist', 'incense smoke', 'dark smoke', 'smoke background', 'mystical fog'] },
            { key: 'نسيج ذهبي', queries: ['gold texture', 'dark gold', 'gold marble', 'luxury texture', 'black gold', 'golden abstract'] },
            { key: 'شموع وأنوار', queries: ['candle flame', 'lantern dark', 'bokeh gold', 'candle light', 'warm light', 'ramadan lantern'] }
        ]
    }
};
// Fallback flat queries
const IMG_QUERIES_FALLBACK = [
    'mosque architecture', 'islamic pattern', 'kaaba makkah',
    'nature landscape', 'sky clouds', 'ocean calm',
    'mountain peaks', 'sunset horizon', 'night sky stars'
];

// ── Quality ──
const QUALITY = {
    fast: { w: 360, h: 640, fps: 15, vbr: 800000, abr: 64000 },
    medium: { w: 480, h: 854, fps: 24, vbr: 1500000, abr: 128000 },
    high: { w: 720, h: 1280, fps: 24, vbr: 3000000, abr: 128000 },
    fullhd: { w: 1080, h: 1920, fps: 30, vbr: 6000000, abr: 192000 },
    uhd: { w: 2160, h: 3840, fps: 30, vbr: 15000000, abr: 256000 }
};

// ── ALL 50 Verified Reciters from everyayah.com (tested ✅) ──
// Categories: 🕋 Haram | 🇸🇦 Saudi/Gulf | 🇪🇬 Egyptian | 🌍 Other
const RECITERS = [
    // ─── 🕋 أئمة الحرم المكي والمدني ───
    { name: '🕋 عبد الرحمن السديس', id: 'Abdurrahmaan_As-Sudais_192kbps' },
    { name: '🕋 سعود الشريم', id: 'Saood_ash-Shuraym_128kbps' },
    { name: '🕋 ماهر المعيقلي', id: 'MaherAlMuaiqly128kbps' },
    { name: '🕋 علي الحذيفي', id: 'Hudhaify_128kbps' },
    { name: '🕋 محمد أيوب', id: 'Muhammad_Ayyoub_128kbps' },
    { name: '🕋 عبدالله عواد الجهني', id: 'Abdullaah_3awwaad_Al-Juhaynee_128kbps' },
    { name: '🕋 صلاح البدير', id: 'Salah_Al_Budair_128kbps' },
    { name: '🕋 إبراهيم الأخضر', id: 'Ibrahim_Akhdar_32kbps' },
    { name: '🕋 علي جابر', id: 'Ali_Jaber_64kbps' },
    { name: '🕋 محسن القاسم', id: 'Muhsin_Al_Qasim_192kbps' },
    { name: '🕋 عبدالله بصفر', id: 'Abdullah_Basfar_192kbps' },
    { name: '🕋 صلاح بو خاطر', id: 'Salaah_AbdulRahman_Bukhatir_128kbps' },
    // ─── 🇸🇦 قراء سعوديون وخليجيون ───
    { name: '🇸🇦 مشاري راشد العفاسي', id: 'Alafasy_128kbps' },
    { name: '🇸🇦 سعد الغامدي', id: 'Ghamadi_40kbps' },
    { name: '🇸🇦 ناصر القطامي', id: 'Nasser_Alqatami_128kbps' },
    { name: '🇸🇦 ياسر الدوسري', id: 'Yasser_Ad-Dussary_128kbps' },
    { name: '🇸🇦 أبو بكر الشاطري', id: 'Abu_Bakr_Ash-Shaatree_128kbps' },
    { name: '🇸🇦 هاني الرفاعي', id: 'Hani_Rifai_192kbps' },
    { name: '🇸🇦 فارس عباد', id: 'Fares_Abbad_64kbps' },
    { name: '🇸🇦 خالد القحطاني', id: 'Khaalid_Abdullaah_al-Qahtaanee_192kbps' },
    { name: '🇸🇦 عبدالله مطرود', id: 'Abdullah_Matroud_128kbps' },
    { name: '🇸🇦 ياسر سلامة', id: 'Yaser_Salamah_128kbps' },
    { name: '🇸🇦 أحمد العجمي', id: 'Ahmed_ibn_Ali_al-Ajamy_128kbps_ketaballah.net' },
    { name: '🇸🇦 أكرم العلاقمي', id: 'Akram_AlAlaqimy_128kbps' },
    { name: '🇸🇦 سهل ياسين', id: 'Sahl_Yassin_128kbps' },
    { name: '🇸🇦 محمد عبد الكريم', id: 'Muhammad_AbdulKareem_128kbps' },
    { name: '🇸🇦 خليفة الطنيجي', id: 'khalefa_al_tunaiji_64kbps' },
    // ─── 🇪🇬 قراء مصريون ───
    { name: '🇪🇬 عبد الباسط عبد الصمد - مجوّد', id: 'Abdul_Basit_Mujawwad_128kbps' },
    { name: '🇪🇬 عبد الباسط عبد الصمد - مرتّل', id: 'Abdul_Basit_Murattal_192kbps' },
    { name: '🇪🇬 محمد صديق المنشاوي - مجوّد', id: 'Minshawy_Mujawwad_192kbps' },
    { name: '🇪🇬 محمد صديق المنشاوي - مرتّل', id: 'Minshawy_Murattal_128kbps' },
    { name: '🇪🇬 محمد صديق المنشاوي - معلّم', id: 'Minshawy_Teacher_128kbps' },
    { name: '🇪🇬 محمود خليل الحصري', id: 'Husary_128kbps' },
    { name: '🇪🇬 محمود خليل الحصري - مجوّد', id: 'Husary_128kbps_Mujawwad' },
    { name: '🇪🇬 محمود خليل الحصري - معلّم', id: 'Husary_Muallim_128kbps' },
    { name: '🇪🇬 محمد الطبلاوي', id: 'Mohammad_al_Tablaway_128kbps' },
    { name: '🇪🇬 مصطفى إسماعيل', id: 'Mustafa_Ismail_48kbps' },
    { name: '🇪🇬 أحمد نعينع', id: 'Ahmed_Neana_128kbps' },
    { name: '🇪🇬 محمد جبريل', id: 'Muhammad_Jibreel_128kbps' },
    { name: '🇪🇬 محمود علي البنا', id: 'mahmoud_ali_al_banna_32kbps' },
    { name: '🇪🇬 علي الحجاج السويسي', id: 'Ali_Hajjaj_AlSuesy_128kbps' },
    { name: '🇪🇬 عبد الباسط - عبد الصمد', id: 'AbdulSamad_64kbps_QuranExplorer.Com' },
    // ─── 🌍 قراء آخرون ───
    { name: '🌍 نبيل الرفاعي', id: 'Nabil_Rifa3i_48kbps' },
    { name: '🌍 أيمن سويد', id: 'Ayman_Sowaid_64kbps' },
    { name: '🌍 كريم منصوري', id: 'Karim_Mansoori_40kbps' },
    { name: '🌍 عزيز عليلي', id: 'aziz_alili_128kbps' },
    { name: '🌍 شهريار پرهیزگار', id: 'Parhizgar_48kbps' }
];

// ── Surah names ──
const SURAH_NAMES = [
    'الفاتحة', 'البقرة', 'آل عمران', 'النساء', 'المائدة', 'الأنعام', 'الأعراف', 'الأنفال',
    'التوبة', 'يونس', 'هود', 'يوسف', 'الرعد', 'إبراهيم', 'الحجر', 'النحل',
    'الإسراء', 'الكهف', 'مريم', 'طه', 'الأنبياء', 'الحج', 'المؤمنون', 'النور',
    'الفرقان', 'الشعراء', 'النمل', 'القصص', 'العنكبوت', 'الروم', 'لقمان', 'السجدة',
    'الأحزاب', 'سبأ', 'فاطر', 'يس', 'الصافات', 'ص', 'الزمر', 'غافر',
    'فصلت', 'الشورى', 'الزخرف', 'الدخان', 'الجاثية', 'الأحقاف', 'محمد', 'الفتح',
    'الحجرات', 'ق', 'الذاريات', 'الطور', 'النجم', 'القمر', 'الرحمن', 'الواقعة',
    'الحديد', 'المجادلة', 'الحشر', 'الممتحنة', 'الصف', 'الجمعة', 'المنافقون', 'التغابن',
    'الطلاق', 'التحريم', 'الملك', 'القلم', 'الحاقة', 'المعارج', 'نوح', 'الجن',
    'المزمل', 'المدثر', 'القيامة', 'الإنسان', 'المرسلات', 'النبأ', 'النازعات', 'عبس',
    'التكوير', 'الانفطار', 'المطففين', 'الانشقاق', 'البروج', 'الطارق', 'الأعلى', 'الغاشية',
    'الفجر', 'البلد', 'الشمس', 'الليل', 'الضحى', 'الشرح', 'التين', 'العلق',
    'القدر', 'البينة', 'الزلزلة', 'العاديات', 'القارعة', 'التكاثر', 'العصر', 'الهمزة',
    'الفيل', 'قريش', 'الماعون', 'الكوثر', 'الكافرون', 'النصر', 'المسد', 'الإخلاص',
    'الفلق', 'الناس'
];

const SURAH_AYAH_COUNTS = [
    7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128,
    111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30,
    73, 54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29,
    18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18,
    12, 12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42,
    29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21, 11, 8, 8, 19,
    5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6
];

/* ── STATE ── */
let cancelled = false;
let isGenerating = false;
let audioCtx = null;

/* ────────────────────────────────────────
   THEME SYSTEM (Fixed Dark Mode)
   ──────────────────────────────────────── */

function initThemeSystem() {
    // Fixed dark theme
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'ar');
}

/* ────────────────────────────────────────
   END THEME SYSTEM
   ──────────────────────────────────────── */

/* ── BASMALA DETECTION (Unicode-safe) ── */
// Strip ALL Arabic diacritics & normalize Alef variants for safe comparison
function normAr(s) {
    return s
        .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7-\u06E8\u06EA-\u06ED\u08D3-\u08E1\u08E3-\u08FF\uFE70-\uFE7F]/g, '')
        .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627') // آأإٱ → ا
        .replace(/\u0629/g, '\u0647') // ة → ه
        .replace(/\s+/g, ' ')
        .trim();
}
const BASMALA_NORM = normAr('بسم الله الرحمن الرحيم');

function stripBasmala(text) {
    const nt = normAr(text);
    if (nt.startsWith(BASMALA_NORM)) {
        // Find how many chars of original text correspond to the Basmala
        // Try progressively longer substrings until normalized substring matches
        for (let i = BASMALA_NORM.length; i <= text.length; i++) {
            if (normAr(text.substring(0, i)) === BASMALA_NORM) {
                const rest = text.substring(i).trim();
                return rest || text;
            }
        }
    }
    return text;
}
function isBasmalaText(text) {
    return normAr(text) === BASMALA_NORM;
}

/* ── CINEMATIC PARTICLE ENGINE — Geometric + Dust + Parallax ── */
function initParticles() {
    const c = document.getElementById('particleCanvas');
    if (!c) return;
    const ctx = c.getContext('2d');
    let w, h;
    const isMobile = window.matchMedia('(max-width:768px)').matches;
    let mx = 0, my = 0;

    function resize() { w = c.width = window.innerWidth; h = c.height = window.innerHeight; }
    resize(); window.addEventListener('resize', resize);

    // Parallax mouse tracking
    document.addEventListener('mousemove', e => { mx = (e.clientX / w - 0.5) * 2; my = (e.clientY / h - 0.5) * 2; });

    // Dust particles
    const dustCount = isMobile ? 25 : 50;
    const dust = [];
    for (let i = 0; i < dustCount; i++) {
        dust.push({
            x: Math.random() * w, y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15,
            r: Math.random() * 1.5 + 0.3,
            a: Math.random() * 0.3 + 0.05,
            depth: Math.random() * 0.5 + 0.5,
            col: ['212,175,55', '59,130,246', '139,92,246'][Math.floor(Math.random() * 3)]
        });
    }

    // Islamic geometric shapes
    const geoCount = isMobile ? 3 : 6;
    const shapes = [];
    for (let i = 0; i < geoCount; i++) {
        shapes.push({
            x: Math.random() * w, y: Math.random() * h,
            size: Math.random() * 30 + 20,
            rot: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.003,
            sides: Math.random() > 0.5 ? 8 : 6,
            a: Math.random() * 0.04 + 0.015,
            depth: Math.random() * 0.3 + 0.7,
            vy: (Math.random() - 0.5) * 0.12
        });
    }

    function drawStar(cx, cy, r, n, rot) {
        ctx.beginPath();
        for (let i = 0; i < n * 2; i++) {
            const angle = rot + (i * Math.PI / n);
            const radius = i % 2 === 0 ? r : r * 0.5;
            const px = cx + Math.cos(angle) * radius;
            const py = cy + Math.sin(angle) * radius;
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
    }

    function frame() {
        ctx.clearRect(0, 0, w, h);

        // Draw geometric shapes
        for (const s of shapes) {
            s.rot += s.rotSpeed;
            s.y += s.vy;
            if (s.y < -60) s.y = h + 60;
            if (s.y > h + 60) s.y = -60;
            const px = s.x + mx * 12 * s.depth;
            const py = s.y + my * 8 * s.depth;
            ctx.strokeStyle = 'rgba(212,175,55,' + s.a + ')';
            ctx.lineWidth = 0.8;
            if (s.sides === 8) {
                drawStar(px, py, s.size, 8, s.rot);
            } else {
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const ang = s.rot + i * Math.PI / 3;
                    const x2 = px + Math.cos(ang) * s.size;
                    const y2 = py + Math.sin(ang) * s.size;
                    i === 0 ? ctx.moveTo(x2, y2) : ctx.lineTo(x2, y2);
                }
                ctx.closePath();
            }
            ctx.stroke();
        }

        // Draw dust
        for (const p of dust) {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
            const px = p.x + mx * 6 * p.depth;
            const py = p.y + my * 4 * p.depth;
            ctx.beginPath();
            ctx.arc(px, py, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + p.col + ',' + p.a + ')';
            ctx.fill();
        }

        // Subtle connections (only desktop, limited)
        if (!isMobile) {
            for (let i = 0; i < dust.length; i++) {
                for (let j = i + 1; j < Math.min(i + 8, dust.length); j++) {
                    const dx = dust[i].x - dust[j].x;
                    const dy = dust[i].y - dust[j].y;
                    const d = dx * dx + dy * dy;
                    if (d < 14400) {
                        ctx.beginPath();
                        ctx.moveTo(dust[i].x + mx * 6 * dust[i].depth, dust[i].y + my * 4 * dust[i].depth);
                        ctx.lineTo(dust[j].x + mx * 6 * dust[j].depth, dust[j].y + my * 4 * dust[j].depth);
                        ctx.strokeStyle = 'rgba(212,175,55,' + (0.04 * (1 - Math.sqrt(d) / 120)) + ')';
                        ctx.stroke();
                    }
                }
            }
        }
        requestAnimationFrame(frame);
    }
    frame();
}

/* ── DOM ── */
const $ = (id) => document.getElementById(id);

/* ── INIT ── */
async function init() {
    // Initialize theme
    initThemeSystem();

    initParticles();
    initSplashScreen();
    initVisitorCounter();
    initRotatingVerses();
    initScrollReveal();

    // Preload mp4-muxer
    try {
        Mp4Muxer = await import('https://cdn.jsdelivr.net/npm/mp4-muxer@5.1.3/+esm');
    } catch (e) { /* fallback later */ }

    const recSel = $('reciterSelect');

    // Populate Reciters (Static names for now)
    RECITERS.forEach((r, i) => { const o = document.createElement('option'); o.value = i; o.textContent = r.name; recSel.appendChild(o); });

    initSurahSelect();

    updateAyahLimits();
    setupShareLinks();
    setupBgSelectors();
    setupTypographyControls();
    $('surahSelect').addEventListener('change', updateAyahLimits);
    $('ayahStart').addEventListener('input', checkWarn);
    $('ayahEnd').addEventListener('input', checkWarn);
    $('generateBtn').addEventListener('click', handleGenerate);
    $('cancelBtn').addEventListener('click', () => { cancelled = true; });
}

/* ── SPLASH SCREEN ── */
function initSplashScreen() {
    const splash = $('splashScreen');
    if (!splash) return;
    // Auto-hide after animation completes
    setTimeout(() => {
        splash.remove();
    }, 3500);
}

/* ── VISITOR COUNTER (Firebase Firestore — handled in index.html) ── */
function initVisitorCounter() {
    // Counter is handled by Firebase module script in index.html
}

/* ── ROTATING QURANIC VERSES ── */
function initRotatingVerses() {
    const box = document.getElementById('rotatingVerseBox');
    if (!box) return;
    const items = box.querySelectorAll('.x-rv-item');
    if (items.length < 2) return;
    let current = 0;

    setInterval(() => {
        items[current].classList.remove('x-rv-active');
        current = (current + 1) % items.length;
        items[current].classList.add('x-rv-active');
    }, 4000);
}

/* ── SCROLL REVEAL ANIMATIONS ── */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-up-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.fade-up').forEach(el => {
        observer.observe(el);
    });
}

function initSurahSelect() {
    const surSel = $('surahSelect');
    const oldVal = surSel.value;
    surSel.innerHTML = '';

    SURAH_NAMES.forEach((n, i) => {
        const o = document.createElement('option');
        o.value = i + 1;
        o.textContent = (i + 1) + '. ' + n;
        surSel.appendChild(o);
    });

    if (oldVal) surSel.value = oldVal;
}

function setupBgSelectors() {
    const catSel = $('bgCategory');
    const oldVal = catSel.value;
    catSel.innerHTML = '';

    // Add 'random' option
    const rOpt = document.createElement('option');
    rOpt.value = 'random';
    rOpt.textContent = '🎲 عشوائي';
    catSel.appendChild(rOpt);

    // Add categories
    for (const [key, cat] of Object.entries(BG_CATEGORIES)) {
        const o = document.createElement('option');
        o.value = key;
        o.textContent = cat.key;
        catSel.appendChild(o);
    }

    catSel.addEventListener('change', () => updateBgSubItems());
    if (oldVal && BG_CATEGORIES[oldVal]) catSel.value = oldVal; // Restore selection if valid

    updateBgSubItems();
}

function updateBgSubItems() {
    const catSel = $('bgCategory');
    const subSel = $('bgSubItem');
    const oldSubVal = subSel.value;
    subSel.innerHTML = '';

    const key = catSel.value;
    if (key === 'random') {
        const o = document.createElement('option');
        o.value = 'all';
        o.textContent = 'كل الخلفيات';
        subSel.appendChild(o);
        return;
    }

    const cat = BG_CATEGORIES[key];
    if (!cat) return;

    cat.items.forEach((item, i) => {
        const o = document.createElement('option');
        o.value = i;
        o.textContent = item.key;
        subSel.appendChild(o);
    });

    // Restore selection if possible, otherwise default to first
    if (oldSubVal) {
        // Simple check if index is valid
        if (oldSubVal < cat.items.length) subSel.value = oldSubVal;
    }
}

function getSelectedBgQueries() {
    const catKey = $('bgCategory').value;
    if (catKey === 'random') return IMG_QUERIES_FALLBACK;
    const cat = BG_CATEGORIES[catKey];
    if (!cat) return IMG_QUERIES_FALLBACK;
    const subIdx = parseInt($('bgSubItem').value, 10);
    if (isNaN(subIdx) || !cat.items[subIdx]) {
        // Return all queries from this category
        return cat.items.flatMap(item => item.queries);
    }
    return cat.items[subIdx].queries;
}

/* ── TYPOGRAPHY CONTROLS ── */
function setupTypographyControls() {
    const fontSizeEl = $('fontSize');
    const fontColorEl = $('fontColor');
    if (fontSizeEl) fontSizeEl.addEventListener('input', () => { $('fontSizeVal').textContent = fontSizeEl.value; });
    // Color presets
    document.querySelectorAll('.color-swatch').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-swatch').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (fontColorEl) fontColorEl.value = btn.dataset.color;
        });
    });
    if (fontColorEl) fontColorEl.addEventListener('input', () => {
        document.querySelectorAll('.color-swatch').forEach(b => b.classList.remove('active'));
    });
}

function getTypoSettings() {
    return {
        fontFamily: ($('fontType') ? $('fontType').value : 'Amiri') + ',serif',
        fontColor: $('fontColor') ? $('fontColor').value : '#ffffff',
        fontSize: $('fontSize') ? parseInt($('fontSize').value, 10) : 28,
        lineSpacing: 1.65  // Fixed line spacing
    };
}

function updateAyahLimits() {
    const s = parseInt($('surahSelect').value, 10);
    const mx = SURAH_AYAH_COUNTS[s - 1];
    $('ayahStart').max = mx; $('ayahEnd').max = mx;
    if (parseInt($('ayahStart').value, 10) > mx) $('ayahStart').value = 1;
    if (parseInt($('ayahEnd').value, 10) > mx) $('ayahEnd').value = Math.min(3, mx);
    checkWarn();
}

// Device detection — 3 tiers for best performance
const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.innerWidth < 768;
const isOldPhone = isMobile && (
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
    (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
    window.innerWidth <= 400
);

function checkWarn() {
    const cnt = (parseInt($('ayahEnd').value, 10) || 1) - (parseInt($('ayahStart').value, 10) || 1) + 1;
    if (isMobile && cnt > 5) {
        $('ayahWarning').style.display = 'flex';
        $('ayahWarningText').textContent = `📱 تنبيه: ${cnt} آية على الهاتف — سيتم تقليل الجودة تلقائياً لمنع التوقف.`;
    } else if (cnt > 30) {
        $('ayahWarning').style.display = 'flex';
        $('ayahWarningText').textContent = `تحذير: ${cnt} آية — قد يستغرق وقتاً طويلاً.`;
    }
    else $('ayahWarning').style.display = 'none';
}

function setupShareLinks() {
    const u = encodeURIComponent(location.href), t = encodeURIComponent('صانع ريلز القرآن الكريم 🕌');
    const s = $('shareWhatsApp'); if (s) s.href = 'https://wa.me/?text=' + t + '%20' + u;
    const f = $('shareFacebook'); if (f) f.href = 'https://www.facebook.com/sharer/sharer.php?u=' + u;
    const tw = $('shareTwitter'); if (tw) tw.href = 'https://twitter.com/intent/tweet?text=' + t + '&url=' + u;
    const tg = $('shareTelegram'); if (tg) tg.href = 'https://t.me/share/url?url=' + u + '&text=' + t;
    const li = $('shareLinkedIn'); if (li) li.href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + u;
    const gm = $('shareGmail'); if (gm) gm.href = 'https://mail.google.com/mail/?view=cm&fs=1&su=' + t + '&body=' + u;
}

/* ── VALIDATION ── */
function validate() {
    const s = parseInt($('surahSelect').value, 10), a = parseInt($('ayahStart').value, 10), b = parseInt($('ayahEnd').value, 10);
    const mx = SURAH_AYAH_COUNTS[s - 1];
    const surahName = SURAH_NAMES[s - 1];

    if (!s || isNaN(a) || isNaN(b)) return 'يرجى ملء جميع الحقول.';
    if (a < 1) return 'آية البداية يجب أن تكون 1 على الأقل.';
    if (b < a) return 'آية النهاية يجب أن تكون ≥ آية البداية.';
    if (b > mx) return `سورة ${surahName} فيها ${mx} آية فقط.`;
    return null;
}

/* ── QURAN TEXT API ── */
const txtCache = {};
async function fetchText(surah, ayah) {
    const k = surah + ':' + ayah;
    if (txtCache[k]) return txtCache[k];
    try { const v = localStorage.getItem('ay_' + k); if (v) { txtCache[k] = v; return v; } } catch (e) { }
    const r = await fetch('https://api.alquran.cloud/v1/ayah/' + k + '/quran-simple');
    if (!r.ok) throw new Error('فشل تحميل نص الآية ' + k);
    const j = await r.json();
    if (j.code !== 200 || !j.data) throw new Error('فشل تحميل نص الآية ' + k);
    txtCache[k] = j.data.text;
    try { localStorage.setItem('ay_' + k, j.data.text); } catch (e) { }
    return j.data.text;
}

/* ── AUDIO API ── */
function pad(n, l) { let s = '' + n; while (s.length < l) s = '0' + s; return s; }

async function fetchAudio(recIdx, surah, ayah) {
    const rec = RECITERS[recIdx];
    const url = 'https://everyayah.com/data/' + rec.id + '/' + pad(surah, 3) + pad(ayah, 3) + '.mp3';
    const r = await fetch(url);
    if (!r.ok) throw new Error('فشل تحميل صوت الآية ' + surah + ':' + ayah + ' — القارئ: ' + rec.name);
    return await r.arrayBuffer();
}

function getAudioCtx() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); return audioCtx; }
async function decodeAudioBuf(ab) { return await getAudioCtx().decodeAudioData(ab.slice(0)); }

/* ── IMAGE PROVIDERS ── */
function loadImg(url) {
    return new Promise(r => {
        const img = new Image(); img.crossOrigin = 'anonymous';
        img.onload = () => r(img); img.onerror = () => r(null); img.src = url;
    });
}

// Pre-approved Safe Nature/Islamic Images (Fallback)
const SAFE_FALLBACK_IMAGES = [
    'https://images.pexels.com/photos/1252869/pexels-photo-1252869.jpeg?auto=compress&cs=tinysrgb&h=1280',
    'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&h=1280',
    'https://images.pexels.com/photos/2086622/pexels-photo-2086622.jpeg?auto=compress&cs=tinysrgb&h=1280',
    'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&h=1280',
    'https://images.pexels.com/photos/2236674/pexels-photo-2236674.jpeg?auto=compress&cs=tinysrgb&h=1280',
    'https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?auto=compress&cs=tinysrgb&h=1280',
    'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&h=1280'
];

// Global image dedup set — reset per generation
const usedImageIds = new Set();

async function fetchImage(forcedQuery) {
    // Safe fallback terms
    const SAFE_FALLBACK_TERMS = [
        'mountain landscape', 'desert sunset', 'mosque architecture',
        'islamic pattern', 'ocean waves', 'forest sunrise',
        'waterfall river', 'dramatic clouds', 'golden light abstract',
        'islamic geometric dark'
    ];

    let baseQ;
    if (forcedQuery) {
        baseQ = forcedQuery;
    } else {
        const userQueries = getSelectedBgQueries();
        if (userQueries && userQueries.length) {
            baseQ = userQueries[Math.floor(Math.random() * userQueries.length)];
        } else {
            baseQ = SAFE_FALLBACK_TERMS[Math.floor(Math.random() * SAFE_FALLBACK_TERMS.length)];
        }
    }

    // DO NOT append STRICT_FILTERS to query — it confuses APIs.
    // Filters are applied only via tag/alt validation below.
    const q = baseQ;

    // Helper to check tags for forbidden terms
    const isSafeTags = (tagsStr) => {
        if (!tagsStr) return true;
        const t = tagsStr.toLowerCase();
        return !/\b(woman|girl|female|lady|sex|model|face|people|person|man|boy|body|hair|skin|fashion|love|couple|wedding|party|music|dance|concert|christian|selfie|crowd|baby|family|child|kid|student|teacher|fitness|sport|swim|nurse|doctor|portrait)\b/i.test(t);
    };

    // PERFORMANCE: Use API metadata for dimension check (no download needed)
    const isLandscapeMeta = (w, h) => w && h && w >= h;

    // Helper: pick from pool avoiding duplicates
    const pickUnique = (pool, idFn) => {
        const available = pool.filter(item => !usedImageIds.has(idFn(item)));
        if (available.length) {
            const pick = available[Math.floor(Math.random() * available.length)];
            usedImageIds.add(idFn(pick));
            return pick;
        }
        // If all are used, pick any
        if (pool.length) return pool[Math.floor(Math.random() * pool.length)];
        return null;
    };

    // 1) Pixabay — Clean query, no STRICT_FILTERS in URL
    try {
        const pg = Math.floor(Math.random() * 5) + 1;
        const safeQ = encodeURIComponent(q);
        const catKey = $('bgCategory') ? $('bgCategory').value : 'random';
        const holyTerms = ['kaaba', 'masjid', 'mosque', 'islamic', 'makkah', 'medina', 'calligraphy', 'arabesque', 'minaret'];
        const isHoly = holyTerms.some(t => baseQ.toLowerCase().includes(t));
        const isAbstract = catKey === 'abstract' || baseQ.toLowerCase().includes('abstract') || baseQ.toLowerCase().includes('bokeh') || baseQ.toLowerCase().includes('smoke') || baseQ.toLowerCase().includes('gold texture');
        const pixCat = isHoly ? 'buildings' : isAbstract ? 'backgrounds' : 'nature';
        const u = 'https://pixabay.com/api/?key=' + PIXABAY_KEY + '&q=' + safeQ + '&image_type=photo&orientation=horizontal&safesearch=true&category=' + pixCat + '&per_page=30&page=' + pg;

        const r = await fetch(u);
        if (r.ok) {
            const j = await r.json();
            if (j.hits && j.hits.length) {
                const pool = j.hits.filter(h => isSafeTags(h.tags) && isLandscapeMeta(h.imageWidth, h.imageHeight));
                const pick = pickUnique(pool, h => 'px_' + h.id);
                if (pick) {
                    const img = await loadImg(pick.largeImageURL || pick.webformatURL);
                    if (img) return img;
                }
            }
        }
    } catch (e) { console.error('Pixabay err:', e); }

    // 2) Pexels — Clean query
    try {
        const safeQ = encodeURIComponent(q);
        const u = 'https://api.pexels.com/v1/search?query=' + safeQ + '&orientation=landscape&per_page=30&page=' + (Math.floor(Math.random() * 5) + 1);
        const r = await fetch(u, { headers: { 'Authorization': PEXELS_KEY } });
        if (r.ok) {
            const j = await r.json();
            if (j.photos && j.photos.length) {
                const pool = j.photos.filter(p => isSafeTags(p.alt) && isLandscapeMeta(p.width, p.height));
                const pick = pickUnique(pool, p => 'pe_' + p.id);
                if (pick) {
                    const img = await loadImg(pick.src.large2x || pick.src.large || pick.src.original);
                    if (img) return img;
                }
            }
        }
    } catch (e) { console.error('Pexels err:', e); }

    // 3) Openverse — Fallback API
    try {
        const safeQ = encodeURIComponent(q);
        const u = 'https://api.openverse.org/v1/images/?q=' + safeQ + '&page_size=30';
        const r = await fetch(u);
        if (r.ok) {
            const j = await r.json();
            if (j.results && j.results.length) {
                const pool = j.results.filter(p => {
                    const t = Array.isArray(p.tags) ? p.tags.map(x => x.name).join(' ') : (p.tags || '');
                    return isSafeTags(t) && isSafeTags(p.title) && isLandscapeMeta(p.width, p.height);
                });
                const pick = pickUnique(pool, p => 'ov_' + p.id);
                if (pick) {
                    const img = await loadImg(pick.url || pick.thumbnail);
                    if (img) return img;
                }
            }
        }
    } catch (e) { console.error('Openverse err:', e); }

    // 4) FINAL SAFETY FALLBACK
    try {
        console.warn('All APIs failed/unsafe. Using SAFE FALLBACK.');
        const fallbackUrl = SAFE_FALLBACK_IMAGES[Math.floor(Math.random() * SAFE_FALLBACK_IMAGES.length)];
        return await loadImg(fallbackUrl);
    } catch (e) { return null; }
}

/* ── PROCEDURAL BG FALLBACK ── */
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

function drawProcBg(ctx, w, h, progress, seed) {
    const h1 = (seed * 60 + progress * 30) % 360, h2 = (h1 + 120) % 360;
    const g = ctx.createLinearGradient(0, 0, w * 0.5, h);
    g.addColorStop(0, 'hsl(' + h1 + ',40%,15%)'); g.addColorStop(0.5, 'hsl(' + ((h1 + h2) / 2) + ',30%,10%)'); g.addColorStop(1, 'hsl(' + h2 + ',40%,12%)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    const rng = mulberry32(seed); ctx.fillStyle = 'rgba(255,255,255,0.5)';
    for (let i = 0; i < 60; i++) { const x = rng() * w, y = rng() * h, r = rng() * 2 + 0.5; ctx.globalAlpha = Math.max(0, Math.min(1, 0.3 + Math.sin(progress * Math.PI * 2 + i) * 0.3)); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
    ctx.globalAlpha = 1;
}

/* ── CANVAS DRAWING ── */
/* ── CINEMATIC CAMERA ENGINE ── */
const CAMERA_MOVES = [
    { name: 'pan_right', zoomStart: 1.1, zoomEnd: 1.1, panX: -0.05, panY: 0 },
    { name: 'pan_left', zoomStart: 1.1, zoomEnd: 1.1, panX: 0.05, panY: 0 },
    { name: 'zoom_in', zoomStart: 1.0, zoomEnd: 1.25, panX: 0, panY: 0 },
    { name: 'zoom_out', zoomStart: 1.25, zoomEnd: 1.0, panX: 0, panY: 0 },
    { name: 'dolly_zoom', zoomStart: 1.1, zoomEnd: 1.3, panX: 0.03, panY: 0.02 }, // Subtle movement
    { name: 'static', zoomStart: 1.0, zoomEnd: 1.0, panX: 0, panY: 0 } // For dramatic stills
];

function easeInOutQuad(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

function drawKenBurns(ctx, img, w, h, progress, seed) {
    if (!img) { drawProcBg(ctx, w, h, progress, seed); return; }

    // Deterministic movement based on image index (seed)
    const moveIdx = seed % CAMERA_MOVES.length;
    const move = CAMERA_MOVES[moveIdx];

    // Smooth easing
    const t = easeInOutQuad(progress);

    // Calculate Zoom
    const currentZoom = move.zoomStart + (move.zoomEnd - move.zoomStart) * t;

    // Calculate Pan (from center)
    // Pan ranges are percentage of dimensions
    // e.g. panX = 0.05 means moving 5% of width
    const maxPx = w * 0.1;
    const maxPy = h * 0.1;

    // Directional panning
    // For pan_right: start at -panX, end at +panX? Or just move continuously?
    // Let's implement simple continuous movement
    // panX > 0 means moving RIGHT (image moves LEFT)
    const totalPanX = move.panX * w;
    const totalPanY = move.panY * h;

    const currentPanX = -totalPanX / 2 + totalPanX * t;
    const currentPanY = -totalPanY / 2 + totalPanY * t;

    // Dimensions
    const ir = img.width / img.height;
    const cr = w / h;

    let dW, dH;

    // Cover logic
    if (ir > cr) {
        dH = h * currentZoom;
        dW = dH * ir;
    } else {
        dW = w * currentZoom;
        dH = dW / ir;
    }

    // Center point
    const cx = w / 2;
    const cy = h / 2;

    // Draw
    ctx.drawImage(
        img,
        cx - dW / 2 + currentPanX,
        cy - dH / 2 + currentPanY,
        dW,
        dH
    );
}

function wrapText(ctx, text, maxW) {
    const words = text.split(' '); const lines = []; let cur = '';
    for (const w of words) { const t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }
    if (cur) lines.push(cur); return lines;
}

function drawFrame(ctx, w, h, fs, ayahs, imgs, time) {
    const typo = getTypoSettings();
    let el = 0, idx = 0, prog = 0;
    for (let i = 0; i < ayahs.length; i++) { if (time < el + ayahs[i].dur) { idx = i; prog = (time - el) / ayahs[i].dur; break; } el += ayahs[i].dur; if (i === ayahs.length - 1) { idx = i; prog = 1; } }
    ctx.clearRect(0, 0, w, h);
    drawKenBurns(ctx, imgs[idx], w, h, prog, idx);
    // Enhanced crossfade with longer duration for smoother transitions
    const fadeDuration = 0.15;  // 15% of verse duration for fade
    if (prog < fadeDuration && idx > 0) {
        ctx.globalAlpha = 1 - prog / fadeDuration;
        drawKenBurns(ctx, imgs[idx - 1], w, h, 1, idx - 1);
        ctx.globalAlpha = 1;
    }
    // overlay
    ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fillRect(0, 0, w, h);
    // deco frame
    const s = 40 * fs, m = 20 * fs; ctx.strokeStyle = 'rgba(212,175,55,0.3)'; ctx.lineWidth = 2 * fs;
    ctx.beginPath(); ctx.moveTo(w - m, m + s); ctx.lineTo(w - m, m); ctx.lineTo(w - m - s, m); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(m, m + s); ctx.lineTo(m, m); ctx.lineTo(m + s, m); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w - m, h - m - s); ctx.lineTo(w - m, h - m); ctx.lineTo(w - m - s, h - m); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(m, h - m - s); ctx.lineTo(m, h - m); ctx.lineTo(m + s, h - m); ctx.stroke();

    // Display text with verse number (if exists)
    const curAyah = ayahs[idx];
    const displayText = curAyah.displayNum !== null && curAyah.displayNum !== undefined
        ? curAyah.text + ' ﴿' + curAyah.displayNum + '﴾'
        : curAyah.text;

    // text with typography settings
    const fz = Math.round(typo.fontSize * fs);
    ctx.font = '700 ' + fz + 'px "' + typo.fontFamily.split(',')[0] + '",' + typo.fontFamily.split(',').slice(1).join(',');
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = 'rtl';
    const lines = wrapText(ctx, displayText, w * 0.82);
    const lh = fz * typo.lineSpacing;
    const th = lines.length * lh;
    const sy = (h - th) / 2 + lh / 2;
    // Shadow from font color
    ctx.shadowColor = typo.fontColor + '80'; ctx.shadowBlur = 15 * fs;
    ctx.fillStyle = typo.fontColor;
    for (let i = 0; i < lines.length; i++) ctx.fillText(lines[i], w / 2, sy + i * lh);
    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
    // label (surah name + verse number)
    const surahNames = SURAH_NAMES;
    const lz = Math.round(13 * fs); ctx.font = lz + 'px "Tajawal",sans-serif'; ctx.fillStyle = 'rgba(212,175,55,0.7)'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    const labelText = surahNames[curAyah.surah - 1] + ' - آية ' + curAyah.displayNum;
    ctx.fillText(labelText, w / 2, 25 * fs);
}

/* ── PROGRESS UI ── */
function showProg() { $('progressSection').style.display = 'block'; $('errorBox').style.display = 'none'; $('successBox').style.display = 'none'; }
function hideProg() { $('progressSection').style.display = 'none'; }
function updProg(pct, st, eta) {
    $('progressBar').style.width = pct + '%'; $('progressPercent').textContent = Math.round(pct) + '%';
    if (st) $('progressStatus').textContent = st;
    $('progressETA').textContent = eta > 0 ? 'الوقت المتبقي: ~' + Math.ceil(eta) + ' ثانية' : '';
}
function showErr(m) { $('errorBox').style.display = 'flex'; $('errorText').textContent = m; $('successBox').style.display = 'none'; }
function showOk(blob) {
    const u = URL.createObjectURL(blob); $('downloadLink').href = u; $('downloadLink').download = 'quran-reel-' + Date.now() + '.mp4';
    $('successBox').style.display = 'flex'; $('errorBox').style.display = 'none';
}
function setGen(v) { isGenerating = v; $('generateBtn').disabled = v; v ? $('generateBtn').classList.add('loading') : $('generateBtn').classList.remove('loading'); }
function yieldUI() { return new Promise(r => setTimeout(r, isOldPhone ? 32 : isMobile ? 16 : 0)); }

/* ── MAIN GENERATE ── */
async function handleGenerate() {
    if (isGenerating) return;
    const err = validate(); if (err) { showErr(err); return; }
    cancelled = false; setGen(true); showProg();
    $('previewPlaceholder').style.display = 'none';

    const surah = parseInt($('surahSelect').value, 10), start = parseInt($('ayahStart').value, 10), end = parseInt($('ayahEnd').value, 10);
    const recIdx = parseInt($('reciterSelect').value, 10);
    let q = $('qualitySelect').value;

    // AUTO-DOWNGRADE: old phones → fast (360p), mobile → medium (480p)
    if (isOldPhone && q !== 'fast') {
        q = 'fast';
        updProg(0, '📱 وضع الأداء: جودة خفيفة لضمان عدم التوقف');
        await yieldUI();
    } else if (isMobile && (q === 'fullhd' || q === 'uhd' || q === 'high')) {
        q = 'medium';
        updProg(0, '📱 تم تقليل الجودة تلقائياً لأداء أفضل على الهاتف');
        await yieldUI();
    }
    const prof = QUALITY[q];

    // Add +1 verse ONLY if starting from verse 1 (to compensate for Basmala)
    const maxAyah = SURAH_AYAH_COUNTS[surah - 1];
    const realEnd = start === 1 ? Math.min(end + 1, maxAyah) : end;
    const total = realEnd - start + 1;

    // Time estimation warning
    const qualityMultiplier = { fast: 1, medium: 1.5, high: 2.5, fullhd: 4, uhd: 8 };
    const estMinutes = Math.ceil((total * 10 * (qualityMultiplier[q] || 1)) / 60);
    updProg(0, `⏱️ الوقت المتوقع: ~${estMinutes} دقيقة — كل المعالجة على جهازك`);
    await yieldUI();

    try {
        const ayahs = [];

        // Phase 1: fetch verse data — Special numbering for verse 1
        for (let a = start; a <= realEnd; a++) {
            if (cancelled) throw '__CANCEL__';
            updProg((a - start) / total * 20, 'تحميل الآية ' + a + ' من ' + realEnd + '...');
            const text = await fetchText(surah, a);
            const raw = await fetchAudio(recIdx, surah, a);
            const buf = await decodeAudioBuf(raw);

            // Special case: ONLY if user selected verse 1 as start
            let displayNum = a;
            if (start === 1) {
                // If starting from verse 1: verse 1 has no number, verse 2 starts at 1
                if (a === 1) {
                    displayNum = null;  // No number for verse 1
                } else {
                    displayNum = a - 1;  // Verse 2→1, Verse 3→2, etc.
                }
            }
            // Otherwise, normal numbering (displayNum = a)

            ayahs.push({ text, raw, buf, dur: buf.duration, surah, ayah: a, displayNum });
            await yieldUI();
        }
        if (cancelled) throw '__CANCEL__';

        // Phase 2: images — fewer on mobile to save memory
        updProg(20, 'تحميل الصور...');
        usedImageIds.clear();
        const totalScenes = ayahs.length;
        const uniqueCount = Math.min(totalScenes, isOldPhone ? 2 : isMobile ? 3 : 6);
        const categoryQueries = getSelectedBgQueries();
        const uniqueImgs = await Promise.all(
            Array.from({ length: uniqueCount }, (_, i) => {
                const q2 = categoryQueries && categoryQueries.length
                    ? categoryQueries[i % categoryQueries.length]
                    : null;
                return fetchImage(q2);
            })
        );
        // Distribute images across scenes (round-robin reuse)
        const imgs = ayahs.map((_, i) => uniqueImgs[i % uniqueCount]);
        updProg(30, 'الصور جاهزة ✓');
        if (cancelled) throw '__CANCEL__';

        // Phase 3: play live audio preview during render
        updProg(30, 'إنشاء الفيديو...');
        let liveAudioSrc = null;
        try {
            const ac = getAudioCtx();
            let totalSamp = 0; for (const a of ayahs) totalSamp += a.buf.length;
            const merged = ac.createBuffer(1, totalSamp, ayahs[0].buf.sampleRate);
            let off = 0; for (const a of ayahs) { merged.getChannelData(0).set(a.buf.getChannelData(0), off); off += a.buf.length; }
            liveAudioSrc = ac.createBufferSource(); liveAudioSrc.buffer = merged;
            liveAudioSrc.connect(ac.destination); liveAudioSrc.start(0);
        } catch (e) { /* silent fail on audio preview */ }

        const blob = await renderAndEncode(ayahs, imgs, prof);
        try { if (liveAudioSrc) liveAudioSrc.stop(); } catch (e) { }
        // Free raw audio buffers to release memory
        for (const a of ayahs) { a.raw = null; a.buf = null; }
        if (cancelled) throw '__CANCEL__';
        hideProg(); showOk(blob);
    } catch (e) {
        hideProg();
        if (e === '__CANCEL__' || e.message === '__CANCEL__') showErr('تم إلغاء العملية.');
        else showErr(e.message || 'حدث خطأ غير متوقع.');
    } finally { setGen(false); }
}

/* ── RENDER & ENCODE ── */
async function renderAndEncode(ayahs, imgs, prof) {
    const w = prof.w, h = prof.h, fps = prof.fps, fs = w / 480;
    const recC = $('recordCanvas'); recC.width = w; recC.height = h;
    const prevC = $('previewCanvas'); prevC.width = w; prevC.height = h;
    const rCtx = recC.getContext('2d', { willReadFrequently: true }), pCtx = prevC.getContext('2d');
    let totalDur = 0; for (const a of ayahs) totalDur += a.dur;
    const totalFrames = Math.ceil(totalDur * fps);

    // Merge audio PCM
    let totalSamp = 0; for (const a of ayahs) totalSamp += a.buf.length;
    const merged = new Float32Array(totalSamp); let off = 0;
    for (const a of ayahs) { merged.set(a.buf.getChannelData(0), off); off += a.buf.length; }
    const sr = ayahs[0].buf.sampleRate;

    // Try WebCodecs
    if (typeof VideoEncoder !== 'undefined' && Mp4Muxer) {
        try { return await encodeWebCodecs(rCtx, pCtx, w, h, fps, fs, ayahs, imgs, merged, sr, totalFrames, prof); }
        catch (e) { /* fall through */ }
    }

    // Fallback: MediaRecorder + FFmpeg.wasm
    return await encodeFallback(rCtx, pCtx, w, h, fps, fs, ayahs, imgs, merged, sr, totalDur, totalFrames, prof);
}

/* ── WEBCODECS ENCODER ── */
async function encodeWebCodecs(rCtx, pCtx, w, h, fps, fs, ayahs, imgs, merged, sr, totalFrames, prof) {
    const { Muxer, ArrayBufferTarget } = Mp4Muxer;
    const fi = 1000000 / fps; // frame interval in µs

    // Check AudioEncoder AAC support
    let hasAAC = false;
    if (typeof AudioEncoder !== 'undefined') {
        try { const s = await AudioEncoder.isConfigSupported({ codec: 'mp4a.40.2', sampleRate: sr, numberOfChannels: 1, bitrate: prof.abr }); hasAAC = !!s.supported; } catch (e) { }
    }

    const muxCfg = { target: new ArrayBufferTarget(), video: { codec: 'avc', width: w, height: h }, fastStart: 'in-memory' };
    if (hasAAC) muxCfg.audio = { codec: 'aac', numberOfChannels: 1, sampleRate: sr };
    const muxer = new Muxer(muxCfg);

    // Video encoder
    const vEnc = new VideoEncoder({
        output: (ch, meta) => muxer.addVideoChunk(ch, meta),
        error: (e) => { throw e; }
    });

    // Pick appropriate codec level
    let codec = 'avc1.42001f'; // Baseline L3.1
    if (w >= 720) codec = 'avc1.42002a'; // Baseline L4.2
    try {
        const s = await VideoEncoder.isConfigSupported({ codec, width: w, height: h, bitrate: prof.vbr, framerate: fps });
        if (!s.supported) codec = 'avc1.42001e';
    } catch (e) { codec = 'avc1.42001e'; }

    vEnc.configure({ codec, width: w, height: h, bitrate: prof.vbr, framerate: fps, avc: { format: 'avc' } });

    // Audio encoder
    let aEnc = null;
    if (hasAAC) {
        aEnc = new AudioEncoder({ output: (ch, meta) => muxer.addAudioChunk(ch, meta), error: (e) => { throw e; } });
        aEnc.configure({ codec: 'mp4a.40.2', sampleRate: sr, numberOfChannels: 1, bitrate: prof.abr });
    }

    const t0 = performance.now();
    const yieldEvery = isOldPhone ? 2 : isMobile ? 4 : 12;
    const previewEvery = isOldPhone ? 32 : isMobile ? 16 : 8;
    for (let f = 0; f < totalFrames; f++) {
        if (cancelled) { vEnc.close(); if (aEnc) aEnc.close(); throw '__CANCEL__'; }
        drawFrame(rCtx, w, h, fs, ayahs, imgs, f / fps);
        if (f % previewEvery === 0) pCtx.drawImage($('recordCanvas'), 0, 0, pCtx.canvas.width, pCtx.canvas.height);
        const vf = new VideoFrame($('recordCanvas'), { timestamp: Math.round(f * fi) });
        vEnc.encode(vf, { keyFrame: f % (fps * 2) === 0 }); vf.close();
        // Flush encoder periodically to prevent backpressure buildup
        if (f % 30 === 29) { await vEnc.flush(); }
        if (f % yieldEvery === 0) {
            const el = (performance.now() - t0) / 1000, left = totalFrames - f, spd = f > 0 ? f / el : fps;
            updProg(35 + (f / totalFrames) * 55, 'تصدير: إطار ' + f + '/' + totalFrames, left / spd);
            await yieldUI();
        }
    }

    // Audio
    if (aEnc) {
        updProg(90, 'معالجة الصوت...');
        const chunk = sr; // 1s chunks
        for (let o = 0; o < merged.length; o += chunk) {
            if (cancelled) { aEnc.close(); vEnc.close(); throw '__CANCEL__'; }
            const sl = merged.slice(o, Math.min(o + chunk, merged.length));
            const ad = new AudioData({ format: 'f32', sampleRate: sr, numberOfFrames: sl.length, numberOfChannels: 1, timestamp: Math.round((o / sr) * 1e6), data: sl });
            aEnc.encode(ad); ad.close(); await yieldUI();
        }
        await aEnc.flush(); aEnc.close();
    }
    await vEnc.flush(); vEnc.close();
    muxer.finalize();

    updProg(98, 'إنهاء الملف...');
    let blob = new Blob([muxer.target.buffer], { type: 'video/mp4' });

    // If no AAC encoder, merge audio via FFmpeg
    if (!hasAAC) {
        updProg(95, 'دمج الصوت...');
        try { blob = await mergeAudioFFmpeg(blob, ayahs); } catch (e) { /* video-only */ }
    }
    updProg(100, 'تم!', 0);
    return blob;
}

/* ── FALLBACK ENCODER ── */
async function encodeFallback(rCtx, pCtx, w, h, fps, fs, ayahs, imgs, merged, sr, totalDur, totalFrames, prof) {
    if (typeof MediaRecorder === 'undefined') throw new Error('متصفحك لا يدعم تصدير الفيديو. يرجى استخدام Chrome أو Edge.');

    const recC = $('recordCanvas');
    const stream = recC.captureStream(fps);
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    const abuf = ac.createBuffer(1, merged.length, sr);
    abuf.getChannelData(0).set(merged);
    const dest = ac.createMediaStreamDestination();
    const src = ac.createBufferSource(); src.buffer = abuf; src.connect(dest); src.connect(ac.destination);

    const combined = new MediaStream();
    stream.getVideoTracks().forEach(t => combined.addTrack(t));
    dest.stream.getAudioTracks().forEach(t => combined.addTrack(t));

    let mime = 'video/webm;codecs=vp9,opus';
    if (!MediaRecorder.isTypeSupported(mime)) mime = 'video/webm;codecs=vp8,opus';
    if (!MediaRecorder.isTypeSupported(mime)) mime = 'video/webm';

    const chunks = []; const rec = new MediaRecorder(combined, { mimeType: mime, videoBitsPerSecond: prof.vbr });
    rec.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
    const done = new Promise(r => { rec.onstop = r; });
    rec.start(100); src.start(0);

    const t0 = performance.now();
    const yieldEvery = isOldPhone ? 2 : isMobile ? 4 : 12;
    const previewEvery = isOldPhone ? 32 : isMobile ? 16 : 8;
    for (let f = 0; f < totalFrames; f++) {
        if (cancelled) { rec.stop(); src.stop(); ac.close(); throw '__CANCEL__'; }
        drawFrame(rCtx, w, h, fs, ayahs, imgs, f / fps);
        if (f % previewEvery === 0) pCtx.drawImage(recC, 0, 0, pCtx.canvas.width, pCtx.canvas.height);
        if (f % yieldEvery === 0) { const el = (performance.now() - t0) / 1000, left = totalFrames - f, spd = f > 0 ? f / el : fps; updProg(35 + (f / totalFrames) * 40, 'تسجيل: إطار ' + f + '/' + totalFrames, left / spd); }
        await new Promise(r => requestAnimationFrame(r));
    }
    src.stop(); rec.stop(); await done; ac.close();
    if (cancelled) throw '__CANCEL__';

    updProg(75, 'تحويل إلى MP4...');
    const webm = new Blob(chunks, { type: 'video/webm' });
    const mp4 = await convertToMp4(webm);
    updProg(100, 'تم!', 0);
    return mp4;
}

/* ── FFMPEG CONVERSION ── */
async function convertToMp4(webmBlob) {
    try {
        // Try ffmpeg.wasm 0.10.x (no SharedArrayBuffer needed)
        await loadScript('https://unpkg.com/@ffmpeg/ffmpeg@0.10.1/dist/ffmpeg.min.js');
        const ffmpeg = window.FFmpeg.createFFmpeg({ log: false });
        await ffmpeg.load();
        const data = new Uint8Array(await webmBlob.arrayBuffer());
        ffmpeg.FS('writeFile', 'input.webm', data);
        await ffmpeg.run('-i', 'input.webm', '-c:v', 'libx264', '-profile:v', 'baseline', '-pix_fmt', 'yuv420p',
            '-preset', 'fast', '-crf', '23', '-c:a', 'aac', '-b:a', '128k', '-ar', '44100', '-ac', '2',
            '-movflags', '+faststart', '-y', 'output.mp4');
        const out = ffmpeg.FS('readFile', 'output.mp4');
        return new Blob([out.buffer], { type: 'video/mp4' });
    } catch (e) {
        throw new Error('⚠️ فشل تحويل الفيديو إلى MP4.\n\nيرجى استخدام Google Chrome أو Microsoft Edge للحصول على أفضل أداء.\n\nتلميح: يمكنك تجربة تقليل الجودة أو عدد الآيات.');
    }
}

async function mergeAudioFFmpeg(videoBlob, ayahs) {
    await loadScript('https://unpkg.com/@ffmpeg/ffmpeg@0.10.1/dist/ffmpeg.min.js');
    const ffmpeg = window.FFmpeg.createFFmpeg({ log: false });
    await ffmpeg.load();
    ffmpeg.FS('writeFile', 'video.mp4', new Uint8Array(await videoBlob.arrayBuffer()));
    let concat = '';
    for (let i = 0; i < ayahs.length; i++) {
        if (!ayahs[i].raw || ayahs[i].raw.byteLength === 0) continue; // skip silent Basmala
        const fn = 'a' + i + '.mp3';
        ffmpeg.FS('writeFile', fn, new Uint8Array(ayahs[i].raw));
        concat += "file '" + fn + "'\n";
    }
    ffmpeg.FS('writeFile', 'list.txt', new TextEncoder().encode(concat));
    await ffmpeg.run('-f', 'concat', '-safe', '0', '-i', 'list.txt', '-c:a', 'aac', '-b:a', '128k', '-ar', '44100', '-ac', '2', '-y', 'audio.m4a');
    await ffmpeg.run('-i', 'video.mp4', '-i', 'audio.m4a', '-c:v', 'copy', '-c:a', 'copy', '-movflags', '+faststart', '-y', 'final.mp4');
    const out = ffmpeg.FS('readFile', 'final.mp4');
    return new Blob([out.buffer], { type: 'video/mp4' });
}

function loadScript(src) {
    return new Promise((res, rej) => {
        if (document.querySelector('script[src="' + src + '"]')) { res(); return; }
        const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('فشل تحميل ' + src)); document.head.appendChild(s);
    });
}

/* ── STARTUP ── */
init();
