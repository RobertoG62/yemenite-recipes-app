const i18n = (() => {
    let currentLang = 'he';

    const translations = {
        he: {
            meta: {
                title: 'המטבח התימני — מתכונים אותנטיים',
                description: 'המטבח התימני — מתכונים תימניים אותנטיים, כולם כשרים.'
            },
            header: {
                logo: 'המטבח התימני',
                backToRecipes: 'חזרה למתכונים'
            },
            hero: {
                title: 'המטבח התימני',
                subtitle: 'מתכונים אותנטיים מהשולחן היהודי-תימני',
                searchPlaceholder: 'חיפוש מתכון...'
            },
            categories: {
                all: 'הכל',
                'ג׳חנון ומאפי שבת': 'ג׳חנון ומאפי שבת',
                'מרקים ותבשילים': 'מרקים ותבשילים',
                'בשרים ועוף': 'בשרים ועוף',
                'סחוג, חילבה ותבלינים': 'סחוג, חילבה ותבלינים',
                'קינוחים וקהווה': 'קינוחים וקהווה'
            },
            difficulty: {
                'קל': 'קל',
                'בינוני': 'בינוני',
                'מאתגר': 'מאתגר'
            },
            detail: {
                prepTime: 'זמן הכנה',
                cookTime: 'זמן בישול',
                servings: 'מנות',
                difficulty: 'רמת קושי',
                kosher: 'כשרות',
                ingredients: 'מצרכים',
                instructions: 'הוראות הכנה',
                categories: 'קטגוריות',
                whatsappShare: 'שלח רשימת קניות ב-WhatsApp',
                minutes: 'דקות'
            },
            search: {
                noResults: 'לא נמצאו מתכונים',
                tryAgain: 'נסו לשנות את מילות החיפוש או לבחור קטגוריה אחרת',
                clearFilters: 'נקה חיפוש',
                resultsCount: 'נמצאו {count} מתכונים'
            },
            loading: 'טוען מתכונים...',
            footer: {
                tagline: 'המטבח התימני — מתכונים תימניים אותנטיים, כולם כשרים',
                backToHub: 'לעוד מתכוני עולם — חזרה לרכזת המתכונים'
            }
        },
        en: {
            meta: {
                title: 'Yemenite Cuisine — Authentic Recipes',
                description: 'Yemenite Cuisine — 50 authentic Yemenite recipes, all kosher, in English.'
            },
            header: {
                logo: 'Yemenite Cuisine',
                backToRecipes: 'Back to Recipes'
            },
            hero: {
                title: 'Yemenite Cuisine',
                subtitle: 'Authentic recipes from the Yemenite-Jewish table',
                searchPlaceholder: 'Search recipe...'
            },
            categories: {
                all: 'All',
                'ג׳חנון ומאפי שבת': 'Jachnun & Sabbath Breads',
                'מרקים ותבשילים': 'Soups & Stews',
                'בשרים ועוף': 'Meats & Poultry',
                'סחוג, חילבה ותבלינים': 'Zhug, Hilbeh & Spices',
                'קינוחים וקהווה': 'Sweets & Coffee',
                'Jachnun & Sabbath Breads': 'Jachnun & Sabbath Breads',
                'Soups & Stews': 'Soups & Stews',
                'Meats & Poultry': 'Meats & Poultry',
                'Zhug, Hilbeh & Spices': 'Zhug, Hilbeh & Spices',
                'Sweets & Coffee': 'Sweets & Coffee'
            },
            difficulty: {
                'קל': 'Easy',
                'בינוני': 'Medium',
                'מאתגר': 'Hard',
                'Easy': 'Easy',
                'Medium': 'Medium',
                'Hard': 'Hard'
            },
            detail: {
                prepTime: 'Prep Time',
                cookTime: 'Cook Time',
                servings: 'Servings',
                difficulty: 'Difficulty',
                kosher: 'Kosher',
                ingredients: 'Ingredients',
                instructions: 'Instructions',
                categories: 'Categories',
                whatsappShare: 'Share shopping list on WhatsApp',
                minutes: 'minutes'
            },
            search: {
                noResults: 'No recipes found',
                tryAgain: 'Try different search terms or select another category',
                clearFilters: 'Clear search',
                resultsCount: 'Found {count} recipes'
            },
            loading: 'Loading recipes...',
            footer: {
                tagline: 'Yemenite Cuisine — Authentic kosher Yemenite recipes',
                backToHub: 'More world recipes — Back to Recipe Hub'
            }
        }
    };

    function t(key) {
        const keys = key.split('.');
        let value = translations[currentLang];

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                console.warn(`Translation key not found: ${key}`);
                return key;
            }
        }

        return value || key;
    }

    function setLanguage(lang) {
        if (!translations[lang]) {
            console.error(`Language not supported: ${lang}`);
            return;
        }
        currentLang = lang;
    }

    function getLanguage() {
        return currentLang;
    }

    function detectLanguage() {
        const saved = localStorage.getItem('lang');
        if (saved && translations[saved]) {
            return saved;
        }

        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('he')) return 'he';
        return 'en';
    }

    function init() {
        const detectedLang = detectLanguage();
        setLanguage(detectedLang);
        return detectedLang;
    }

    return {
        t,
        setLanguage,
        getLanguage,
        detectLanguage,
        init
    };
})();
