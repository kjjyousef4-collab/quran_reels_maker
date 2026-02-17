// ═══════════════════════════════════════════════════════════
// Share Buttons Functionality
// ═══════════════════════════════════════════════════════════

function initializeShareButtons() {
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent('صانع ريلز القرآن الكريم');
    const description = encodeURIComponent('أنشئ ريلز احترافية من آيات القرآن الكريم مع صور خلفية مميزة');

    // WhatsApp - كل الأزرار (10 groups)
    document.querySelectorAll('.x-wa').forEach(btn => {
        btn.href = `https://wa.me/?text=${pageTitle}%20-%20${description}%0A${pageUrl}`;
    });

    // Facebook
    document.querySelectorAll('.x-fb').forEach(btn => {
        btn.href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
    });

    // Twitter
    document.querySelectorAll('.x-tw').forEach(btn => {
        btn.href = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
    });

    // Telegram
    document.querySelectorAll('.x-tg').forEach(btn => {
        btn.href = `https://t.me/share/url?url=${pageUrl}&text=${pageTitle}`;
    });

    // LinkedIn
    document.querySelectorAll('.x-li').forEach(btn => {
        btn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
    });

    // Gmail
    const subject = encodeURIComponent('صانع ريلز القرآن الكريم');
    const body = encodeURIComponent(`${description}\n\nزور الموقع: ${decodeURIComponent(pageUrl)}`);
    document.querySelectorAll('.x-gm').forEach(btn => {
        btn.href = `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`;
    });

    console.log('✅ Share buttons initialized for all groups!');
}

// Initialize share buttons when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeShareButtons);
} else {
    initializeShareButtons();
}
