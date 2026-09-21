/* ======================================
   UI Layer — DOM Rendering
   ====================================== */

const UI = (() => {
    // Yemenite cuisine categories with icons
    const CATEGORY_ICONS = {
        // Hebrew
        'הכל': 'fa-utensils',
        'ג׳חנון ומאפי שבת': 'fa-bread-slice',
        'מרקים ותבשילים': 'fa-bowl-rice',
        'בשרים ועוף': 'fa-drumstick-bite',
        'סחוג, חילבה ותבלינים': 'fa-mortar-pestle',
        'קינוחים וקהווה': 'fa-mug-hot',
        // English
        'All': 'fa-utensils',
        'Jachnun & Sabbath Breads': 'fa-bread-slice',
        'Soups & Stews': 'fa-bowl-rice',
        'Meats & Poultry': 'fa-drumstick-bite',
        'Zhug, Hilbeh & Spices': 'fa-mortar-pestle',
        'Sweets & Coffee': 'fa-mug-hot',
    };

    function buildWhatsAppUrl(recipe) {
        const ingredientLines = recipe.ingredients
            .map(ing => `▢ ${ing.quantity} ${ing.unit} ${ing.name}`)
            .join('\n');
        const recipeUrl = window.location.href;
        const listTitle = i18n.getLanguage() === 'he' ?
            `*רשימת קניות עבור: ${recipe.title}*` :
            `*Shopping list for: ${recipe.title}*`;
        const fullRecipe = i18n.getLanguage() === 'he' ? 'למתכון המלא:' : 'Full recipe:';
        const message = `${listTitle}\n\n${ingredientLines}\n\n${fullRecipe} ${recipeUrl}`;
        return `https://wa.me/?text=${encodeURIComponent(message)}`;
    }

    // Kashrut group. Every recipe here is kosher; the badge says which of the
    // three groups it belongs to, so a cook knows what it can be served with.
    const KOSHER_BADGES = {
        'בשרי':  { cls: 'badge-meat',  icon: 'fa-drumstick-bite' },
        'חלבי':  { cls: 'badge-dairy', icon: 'fa-cheese' },
        'פרווה': { cls: 'badge-parve', icon: 'fa-leaf' },
        'Meat':  { cls: 'badge-meat',  icon: 'fa-drumstick-bite' },
        'Dairy': { cls: 'badge-dairy', icon: 'fa-cheese' },
        'Parve': { cls: 'badge-parve', icon: 'fa-leaf' },
    };

    function getKosherBadge(kosherType) {
        return KOSHER_BADGES[kosherType] || KOSHER_BADGES['פרווה'];
    }

    function getDifficultyBadge(difficulty) {
        const map = {
            'קל': 'badge-easy',
            'בינוני': 'badge-medium',
            'מאתגר': 'badge-hard',
            'Easy': 'badge-easy',
            'Medium': 'badge-medium',
            'Hard': 'badge-hard',
        };
        return map[difficulty] || 'badge-medium';
    }

    function renderFilters(categories, activeCategory, onCategoryClick) {
        const container = document.getElementById('category-filters');
        container.innerHTML = categories.map(cat => `
            <button class="category-pill ${cat === activeCategory ? 'active' : ''}" data-category="${cat}">
                <i class="fas ${CATEGORY_ICONS[cat] || 'fa-tag'}"></i>
                <span>${cat}</span>
            </button>
        `).join('');

        container.querySelectorAll('.category-pill').forEach(btn => {
            btn.addEventListener('click', () => onCategoryClick(btn.dataset.category));
        });
    }

    function renderCards(recipes) {
        const grid = document.getElementById('recipe-grid');
        const empty = document.getElementById('empty-state');
        const loading = document.getElementById('loading-state');

        loading.classList.add('hidden');

        if (recipes.length === 0) {
            grid.classList.add('hidden');
            empty.classList.remove('hidden');
            return;
        }

        empty.classList.add('hidden');
        grid.classList.remove('hidden');
        grid.innerHTML = recipes.map(recipe => `
            <article class="recipe-card card-lift" data-id="${recipe.id}">
                <div class="recipe-card-image-wrapper">
                    <div class="img-placeholder"><i class="fas fa-utensils"></i></div>
                    <img
                        src="${recipe.image}"
                        alt="${recipe.title}"
                        class="recipe-card-image"
                        loading="lazy"
                    >
                </div>
                <div class="p-4">
                    <h3 class="font-bold text-lg mb-0.5 text-ye-charcoal">${recipe.title}</h3>
                    ${recipe.originalName ? `<p class="text-ye-primary-dark text-xs italic mb-2 font-playfair">${recipe.originalName}</p>` : ''}
                    <p class="text-ye-text-secondary text-sm line-clamp-2 mb-3">${recipe.description}</p>
                    <div class="flex items-center justify-between text-xs text-ye-text-secondary">
                        <div class="flex items-center gap-3">
                            <span><i class="far fa-clock ${i18n.getLanguage() === 'he' ? 'ml-1' : 'mr-1'}"></i>${recipe.prepTime + recipe.cookTime} ${i18n.getLanguage() === 'he' ? "דק'" : 'min'}</span>
                            <span><i class="fas fa-users ${i18n.getLanguage() === 'he' ? 'ml-1' : 'mr-1'}"></i>${recipe.servings} ${i18n.getLanguage() === 'he' ? 'מנות' : ''}</span>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <span class="kosher-badge ${getKosherBadge(recipe.kosherType).cls}">
                                <i class="fas ${getKosherBadge(recipe.kosherType).icon}"></i>
                                ${recipe.kosherType}
                            </span>
                            <span class="px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyBadge(recipe.difficulty)}">
                                ${recipe.difficulty}
                            </span>
                        </div>
                    </div>
                </div>
            </article>
        `).join('');

        // CSP blocks inline onload/onerror, so the fade-in is wired up here instead.
        // A cached image can finish loading before the listener attaches — hence the complete check.
        grid.querySelectorAll('.recipe-card-image').forEach(img => {
            if (img.complete && img.naturalWidth > 0) { img.classList.add('loaded'); return; }
            img.addEventListener('load', () => img.classList.add('loaded'));
            img.addEventListener('error', () => { img.style.display = 'none'; });
        });

        grid.querySelectorAll('.recipe-card').forEach(card => {
            card.addEventListener('click', () => {
                location.hash = `#/recipe/${card.dataset.id}`;
            });
        });
    }

    function renderResultCount(count, total) {
        const el = document.getElementById('result-count');
        if (count === total) {
            el.classList.add('hidden');
        } else {
            el.classList.remove('hidden');
            const text = i18n.getLanguage() === 'he' ?
                `${count} מתכונים מתוך ${total}` :
                `${count} of ${total} recipes`;
            el.textContent = text;
        }
    }

    function renderRecipeDetail(recipe) {
        const container = document.getElementById('recipe-view');
        container.innerHTML = `
            <div class="view-fade-in">
                <div class="recipe-hero" style="background-image: url('${recipe.image}')">
                    <div class="relative z-10 w-full p-6 md:p-10 max-w-4xl mx-auto">
                        <span class="inline-block px-3 py-1 rounded-full text-xs font-medium bg-ye-primary text-white mb-3">
                            <i class="fas ${CATEGORY_ICONS[recipe.category] || 'fa-tag'} ${i18n.getLanguage() === 'he' ? 'ml-1' : 'mr-1'}"></i>
                            ${recipe.category}
                        </span>
                        <h1 class="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                            ${recipe.title}
                        </h1>
                        ${recipe.originalName ? `<p class="text-ye-primary-light text-base md:text-lg italic font-playfair mt-1">${recipe.originalName}</p>` : ''}
                        <p class="text-gray-300 mt-2 text-base md:text-lg max-w-xl">${recipe.description}</p>
                    </div>
                </div>

                <div class="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
                    <div class="glass rounded-xl p-4 flex justify-center gap-0 mb-8">
                        <div class="meta-item">
                            <i class="far fa-clock text-ye-primary"></i>
                            <span class="font-bold text-ye-charcoal">${recipe.prepTime} ${i18n.t('detail.minutes')}</span>
                            <span class="text-xs text-ye-text-secondary">${i18n.t('detail.prepTime')}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-fire text-ye-primary"></i>
                            <span class="font-bold text-ye-charcoal">${recipe.cookTime} ${i18n.t('detail.minutes')}</span>
                            <span class="text-xs text-ye-text-secondary">${i18n.t('detail.cookTime')}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-users text-ye-primary"></i>
                            <span class="font-bold text-ye-charcoal">${recipe.servings}</span>
                            <span class="text-xs text-ye-text-secondary">${i18n.t('detail.servings')}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-gauge text-ye-primary"></i>
                            <span class="font-bold text-ye-charcoal">${recipe.difficulty}</span>
                            <span class="text-xs text-ye-text-secondary">${i18n.t('detail.difficulty')}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas ${getKosherBadge(recipe.kosherType).icon} text-ye-primary"></i>
                            <span class="font-bold text-ye-charcoal">${recipe.kosherType}</span>
                            <span class="text-xs text-ye-text-secondary">${i18n.t('detail.kosher')}</span>
                        </div>
                    </div>

                    <div class="glass gold-border-right rounded-xl p-6 mb-8">
                        <h2 class="font-bold text-xl mb-4 text-ye-charcoal flex items-center gap-2">
                            <i class="fas fa-list text-ye-primary"></i>
                            ${i18n.t('detail.ingredients')}
                            <span class="text-sm font-normal text-ye-text-secondary">(${recipe.ingredients.length})</span>
                        </h2>
                        <div>
                            ${recipe.ingredients.map(ing => `
                                <div class="ingredient-row">
                                    <span class="text-ye-primary"><i class="fas fa-check text-xs"></i></span>
                                    <span><strong>${ing.quantity} ${ing.unit}</strong> ${ing.name}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <a href="${buildWhatsAppUrl(recipe)}" target="_blank" rel="noopener noreferrer" class="whatsapp-share-btn">
                        <i class="fab fa-whatsapp ${i18n.getLanguage() === 'he' ? '' : 'mr-2'}"></i>
                        ${i18n.t('detail.whatsappShare')}
                    </a>

                    <div class="mb-8">
                        <h2 class="font-bold text-xl mb-6 text-ye-charcoal flex items-center gap-2">
                            <i class="fas fa-list-ol text-ye-primary"></i>
                            ${i18n.t('detail.instructions')}
                        </h2>
                        <div class="space-y-4">
                            ${recipe.instructions.map((step, i) => `
                                <div class="flex gap-4 items-start">
                                    <div class="step-number">${i + 1}</div>
                                    <p class="text-ye-charcoal pt-1 leading-relaxed">${step}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-2 mb-8">
                        ${recipe.tags.map(tag => `
                            <span class="tag-pill">
                                <i class="fas fa-hashtag text-xs"></i>
                                ${tag}
                            </span>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    function showHome() {
        document.getElementById('home-view').classList.remove('hidden');
        document.getElementById('recipe-view').classList.add('hidden');
        document.getElementById('back-btn').classList.add('hidden');
        document.getElementById('back-btn').classList.remove('flex');
    }

    function showRecipeView() {
        document.getElementById('home-view').classList.add('hidden');
        document.getElementById('recipe-view').classList.remove('hidden');
        document.getElementById('back-btn').classList.remove('hidden');
        document.getElementById('back-btn').classList.add('flex');
        window.scrollTo(0, 0);
    }

    function showLoading() {
        document.getElementById('loading-state').classList.remove('hidden');
        document.getElementById('recipe-grid').classList.add('hidden');
        document.getElementById('empty-state').classList.add('hidden');
    }

    return {
        renderFilters,
        renderCards,
        renderResultCount,
        renderRecipeDetail,
        showHome,
        showRecipeView,
        showLoading,
    };
})();
