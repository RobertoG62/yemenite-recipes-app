// Bilingual policy pages.
// Shares the 'lang' localStorage key with the main app so the reader's choice
// carries across. Wrapped in try/catch: private windows and blocked site data
// make localStorage throw, and that must never break the page.
(function () {
    'use strict';
    var KEY = 'lang';
    var DEFAULT = 'he';

    function read() {
        try {
            var v = localStorage.getItem(KEY);
            return (v === 'he' || v === 'en') ? v : null;
        } catch (e) { return null; }
    }
    function write(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

    var lang = read() || DEFAULT;

    // Translations may contain <br>. Build real text nodes instead of assigning
    // innerHTML, so attribute content is never parsed as markup.
    function setText(el, text) {
        while (el.firstChild) el.removeChild(el.firstChild);
        text.split(/<br\s*\/?>/i).forEach(function (part, i) {
            if (i > 0) el.appendChild(document.createElement('br'));
            el.appendChild(document.createTextNode(part));
        });
    }

    function apply() {
        var html = document.documentElement;
        html.lang = lang;
        html.dir = (lang === 'he') ? 'rtl' : 'ltr';

        var label = document.getElementById('langLabel');
        if (label) label.textContent = (lang === 'he') ? 'HE' : 'EN';

        var btn = document.getElementById('langToggle');
        // WCAG 2.5.3 Label in Name: the accessible name must contain the
        // visible text, which is 'HE' or 'EN'.
        if (btn) btn.setAttribute('aria-label',
            lang === 'he' ? 'HE — החלף לאנגלית' : 'EN — switch to Hebrew');

        document.querySelectorAll('[data-en]').forEach(function (el) {
            var t = el.getAttribute('data-' + lang);
            if (t) setText(el, t);
        });

        var title = document.querySelector('title[data-en]');
        if (title) document.title = title.getAttribute('data-' + lang) || document.title;
    }

    document.addEventListener('DOMContentLoaded', function () {
        var btn = document.getElementById('langToggle');
        if (btn) btn.addEventListener('click', function () {
            lang = (lang === 'he') ? 'en' : 'he';
            write(lang);
            apply();
        });
        apply();
    });
})();
