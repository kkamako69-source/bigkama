/**
 * PUNCHI BATTLE - Système de stockage
 * LocalStorage avec fallback et sécurité
 */

const Storage = {
    prefix: 'pb_',
    
    set(key, value) {
        try {
            const data = JSON.stringify(value);
            localStorage.setItem(this.prefix + key, data);
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    },
    
    get(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(this.prefix + key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    },
    
    remove(key) {
        localStorage.removeItem(this.prefix + key);
    },
    
    clear() {
        Object.keys(localStorage)
            .filter(k => k.startsWith(this.prefix))
            .forEach(k => localStorage.removeItem(k));
    }
};

// Données initiales
const DEFAULT_DATA = {
    users: [
        {
            id: 'user_001',
            username: 'ShadowPrime',
            email: 'shadow@punchibattle.com',
            password: 'hashed_password',
            avatar: 'SP',
            displayName: 'Shadow Prime',
            bio: 'Fondateur de Punchi Battle. Hardcore depuis 2010.',
            style: 'hardcore',
            joined: '2024-01-15',
            stats: {
                battles: 156,
                wins: 89,
                votesGiven: 2340,
                votesReceived: 12500,
                streak: 12,
                bestRank: 1
            },
            achievements: ['founder', 'legend', 'veteran'],
            followers: 1250,
            following: 89,
            isVerified: true,
            isPremium: true,
            settings: {
                notifications: true,
                private: false,
                theme: 'dark'
            }
        }
    ],
    
    currentTheme: {
        id: 'theme_001',
        title: 'La Trahison',
        description: 'Les loyautés testées, les masques tombés.',
        startDate: '2026-04-01',
        endDate: '2026-04-02',
        totalEntries: 142,
        totalVotes: 8234
    },
    
    themes: [
        { id: 'theme_001', title: 'La Trahison', active: true },
        { id: 'theme_002', title: 'L\'Ambition', active: false },
        { id: 'theme_003', title: 'La Rue', active: false },
        { id: 'theme_004', title: 'L\'Amour Perdu', active: false },
        { id: 'theme_005', title: 'La Victoire', active: false },
        { id: 'theme_006', title: 'La Solitude', active: false }
    ],
    
    punchlines: [
        {
            id: 1,
            authorId: 'user_002',
            authorName: 'NightWolf',
            authorAvatar: 'N',
            themeId: 'theme_001',
            text: 'J\'ai serré des mains qui cachaient des couteaux, maintenant je serre les miens pour pas étouffer.',
            style: 'hardcore',
            votes: 127,
            timestamp: Date.now() - 120000,
            comments: 23,
            isWinner: false
        },
        {
            id: 2,
            authorId: 'user_003',
            authorName: 'LyricKiller',
            authorAvatar: 'L',
            themeId: 'theme_001',
            text: 'Ils parlaient d\'amour mais visaient mon dos, je leur ai montré que j\'avais des yeux derrière la tête.',
            style: 'conscious',
            votes: 98,
            timestamp: Date.now() - 300000,
            comments: 15,
            isWinner: false
        },
        {
            id: 3,
            authorId: 'user_004',
            authorName: 'StreetPoet',
            authorAvatar: 'S',
            themeId: 'theme_001',
            text: 'La loyauté coûte cher, les traîtres sont gratuits. Moi je suis en premium, eux en version d\'essai.',
            style: 'trap',
            votes: 156,
            timestamp: Date.now() - 480000,
            comments: 31,
            isWinner: false
        }
    ],
    
    rankings: {
        daily: [
            { rank: 1, userId: 'user_001', name: 'ShadowPrime', wins: 12, votes: 4500, trend: 'up' },
            { rank: 2, userId: 'user_005', name: 'Morningstarr', wins: 9, votes: 3200, trend: 'stable' },
            { rank: 3, userId: 'user_006', name: 'BigThug', wins: 8, votes: 2900, trend: 'up' }
        ],
        weekly: [],
        monthly: [],
        allTime: []
    }
};

// Initialisation
function initStorage() {
    if (!Storage.get('initialized')) {
        Storage.set('users', DEFAULT_DATA.users);
        Storage.set('currentTheme', DEFAULT_DATA.currentTheme);
        Storage.set('themes', DEFAULT_DATA.themes);
        Storage.set('punchlines', DEFAULT_DATA.punchlines);
        Storage.set('rankings', DEFAULT_DATA.rankings);
        Storage.set('initialized', true);
        Storage.set('session', null);
    }
}

initStorage();
