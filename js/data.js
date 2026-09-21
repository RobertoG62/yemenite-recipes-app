/* ======================================
   Data Layer — Fetch, Search, Filter
   ====================================== */

const RecipeData = (() => {
    const state = {
        currentLang: 'he',
        recipes: [],
        filteredRecipes: [],
        searchQuery: '',
        activeCategory: '',
        categories: [],
        isLoaded: false,
    };

    async function fetchRecipes(lang) {
        const language = lang || state.currentLang || 'he';
        const response = await fetch(`data/recipes-${language}.json`);
        if (!response.ok) throw new Error(`Failed to load recipes-${language}.json`);
        const data = await response.json();
        state.recipes = data.recipes;
        state.filteredRecipes = [...state.recipes];
        state.categories = [i18n.t('categories.all'), ...new Set(state.recipes.map(r => r.category))];
        state.isLoaded = true;
        return state;
    }

    async function switchLanguage(lang) {
        state.currentLang = lang;
        await fetchRecipes(lang);
        return state;
    }

    function filterRecipes(query, category) {
        state.searchQuery = (query || '').trim();
        const allLabel = i18n.t('categories.all');
        state.activeCategory = category || allLabel;

        state.filteredRecipes = state.recipes.filter(recipe => {
            const matchesCategory = state.activeCategory === allLabel || recipe.category === state.activeCategory;
            if (!matchesCategory) return false;
            if (!state.searchQuery) return true;

            const q = state.searchQuery.toLowerCase();
            return (
                recipe.title.toLowerCase().includes(q) ||
                recipe.description.toLowerCase().includes(q) ||
                recipe.ingredients.some(ing => ing.name.toLowerCase().includes(q)) ||
                recipe.tags.some(tag => tag.toLowerCase().includes(q))
            );
        });

        return state.filteredRecipes;
    }

    function getRecipeById(id) {
        return state.recipes.find(r => r.id === id) || null;
    }

    function getState() {
        return state;
    }

    return { fetchRecipes, switchLanguage, filterRecipes, getRecipeById, getState };
})();
