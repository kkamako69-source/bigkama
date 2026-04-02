/**
 * PUNCHI BATTLE - Système d'authentification
 * Inscription, connexion, session, profil
 */

const Auth = {
    currentUser: null,
    
    init() {
        const session = Storage.get('session');
        if (session && session.expires > Date.now()) {
            this.currentUser = session.user;
        }
        this.updateUI();
    },
    
    register(userData) {
        const users = Storage.get('users', []);
        
        // Vérifications
        if (users.find(u => u.email === userData.email)) {
            return { success: false, error: 'Email déjà utilisé' };
        }
        if (users.find(u => u.username === userData.username)) {
            return { success: false, error: 'Pseudo déjà pris' };
        }
        if (userData.password.length < 6) {
            return { success: false, error: 'Mot de passe trop court (6 caractères min)' };
        }
        
        // Création utilisateur
        const newUser = {
            id: 'user_' + Date.now(),
            username: userData.username,
            email: userData.email,
            password: this.hashPassword(userData.password),
            avatar: userData.username.substring(0, 2).toUpperCase(),
            displayName: userData.displayName || userData.username,
            bio: '',
            style: userData.style || 'hardcore',
            joined: new Date().toISOString().split('T')[0],
            stats: {
                battles: 0,
                wins: 0,
                votesGiven: 0,
                votesReceived: 0,
                streak: 0,
                bestRank: null
            },
            achievements: ['newcomer'],
            followers: 0,
            following: 0,
            isVerified: false,
            isPremium: false,
            settings: {
                notifications: true,
                private: false,
                theme: 'dark'
            }
        };
        
        users.push(newUser);
        Storage.set('users', users);
        
        // Connexion automatique
        this.login(userData.email, userData.password);
        
        return { success: true, user: newUser };
    },
    
    login(email, password) {
        const users = Storage.get('users', []);
        const user = users.find(u => u.email === email && u.password === this.hashPassword(password));
        
        if (!user) {
            return { success: false, error: 'Email ou mot de passe incorrect' };
        }
        
        // Créer session
        const session = {
            user: { ...user, password: undefined },
            expires: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 jours
        };
        
        Storage.set('session', session);
        this.currentUser = session.user;
        this.updateUI();
        
        return { success: true, user: this.currentUser };
    },
    
    logout() {
        Storage.remove('session');
        this.currentUser = null;
        this.updateUI();
        Router.navigate('accueil');
    },
    
    updateProfile(updates) {
        if (!this.currentUser) return { success: false, error: 'Non connecté' };
        
        const users = Storage.get('users', []);
        const index = users.findIndex(u => u.id === this.currentUser.id);
        
        if (index === -1) return { success: false, error: 'Utilisateur non trouvé' };
        
        // Mise à jour
        users[index] = { ...users[index], ...updates };
        Storage.set('users', users);
        
        // Mettre à jour session
        this.currentUser = { ...this.currentUser, ...updates };
        Storage.set('session', {
            user: this.currentUser,
            expires: Date.now() + (7 * 24 * 60 * 60 * 1000)
        });
        
        this.updateUI();
        return { success: true, user: this.currentUser };
    },
    
    hashPassword(password) {
        // Simple hash (à remplacer par bcrypt côté serveur)
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return 'pb_' + Math.abs(hash).toString(16);
    },
    
    isLoggedIn() {
        return !!this.currentUser;
    },
    
    updateUI() {
        const container = document.getElementById('header-actions');
        if (!container) return;
        
        if (this.currentUser) {
            container.innerHTML = `
                <button class="user-menu" onclick="toggleUserMenu()">
                    <div class="user-avatar">${this.currentUser.avatar}</div>
                    <div class="user-info">
                        <span class="user-name">${this.currentUser.displayName}</span>
                        <span class="user-rank">⭐ ${this.currentUser.stats.wins} wins</span>
                    </div>
                </button>
                <div class="user-dropdown" id="user-dropdown" style="display: none;">
                    <a href="#profil">Mon Profil</a>
                    <a href="#parametres">Paramètres</a>
                    <hr>
                    <a href="#" onclick="Auth.logout(); return false;">Déconnexion</a>
                </div>
            `;
        } else {
            container.innerHTML = `
                <a href="#login" class="btn-login">Connexion</a>
            `;
        }
    }
};

function toggleUserMenu() {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
}

function updateHeaderAuth() {
    Auth.init();
}
