/**
 * PUNCHI BATTLE - Router SPA
 * Navigation sans rechargement de page
 */

const Router = {
    currentPage: 'accueil',
    routes: {
        'accueil': { title: 'Accueil', file: 'pages/accueil.html' },
        'battles': { title: 'Battles', file: 'pages/battles.html' },
        'classement': { title: 'Classement', file: 'pages/classement.html' },
        'profil': { title: 'Profil', file: 'pages/profil.html' },
        'login': { title: 'Connexion', file: 'auth/login.html', auth: false },
        'register': { title: 'Inscription', file: 'auth/register.html', auth: false }
    },
    
    init() {
        // Gestion du hash
        window.addEventListener('hashchange', () => this.handleRoute());
        
        // Premier chargement
        const hash = window.location.hash.slice(1) || 'accueil';
        this.navigate(hash);
        
        // Clics sur liens
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-page]')) {
                e.preventDefault();
                const page = e.target.dataset.page;
                this.navigate(page);
            }
        });
    },
    
    navigate(page) {
        window.location.hash = page;
        this.handleRoute();
    },
    
    async handleRoute() {
        const hash = window.location.hash.slice(1) || 'accueil';
        const [page, ...params] = hash.split('/');
        
        const route = this.routes[page];
        if (!route) {
            this.navigate('accueil');
            return;
        }
        
        // Vérification auth
        if (route.auth !== false && !Auth.isLoggedIn() && page !== 'accueil') {
            this.navigate('login');
            return;
        }
        
        // Redirection si déjà connecté sur auth pages
        if (route.auth === false && Auth.isLoggedIn()) {
            this.navigate('accueil');
            return;
        }
        
        this.currentPage = page;
        
        // Mise à jour nav active
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === page);
        });
        
        // Chargement contenu
        await this.loadContent(route.file, params);
        
        // Mise à jour titre
        document.title = `${route.title} | Punchi Battle`;
        
        // Scroll top
        window.scrollTo(0, 0);
    },
    
    async loadContent(file, params) {
        const container = document.getElementById('app-container');
        
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error('Page non trouvée');
            
            const html = await response.text();
            container.innerHTML = html;
            
            // Exécuter scripts de la page
            this.executeScripts(container);
            
            // Callback post-chargement
            if (window.pageInit) {
                window.pageInit(params);
                window.pageInit = null;
            }
            
        } catch (error) {
            container.innerHTML = `
                <div style="text-align: center; padding: 5rem;">
                    <h1>⚠️ Erreur de chargement</h1>
                    <p>Impossible de charger la page ${file}</p>
                    <button onclick="Router.navigate('accueil')" class="btn-login" style="margin-top: 2rem;">
                        Retour à l'accueil
                    </button>
                </div>
            `;
        }
    },
    
    executeScripts(container) {
        const scripts = container.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            newScript.appendChild(document.createTextNode(oldScript.innerHTML));
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });
    }
};

// Démarrage
document.addEventListener('DOMContentLoaded', () => {
    Router.init();
});
