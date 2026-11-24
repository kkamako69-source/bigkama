/**
 * PUNCHI BATTLE — authentification de démonstration désactivée.
 * Cette archive ne possède pas de backend d'identité.
 * Ne jamais stocker un mot de passe ou son hash dans localStorage.
 * L'authentification réelle est préparée séparément dans le dépôt punchi-battle.
 */
const Auth = {
    currentUser: null,
    init() {
        this.currentUser = null;
        this.updateUI();
    },
    register() {
        return { success: false, error: "Inscription désactivée dans cette archive. N'entre aucun vrai mot de passe. Consulte la version principale Punchi Battle." };
    },
    login() {
        return { success: false, error: "Connexion désactivée dans cette archive. Aucun compte réel n'est géré ici." };
    },
    logout() {
        if (typeof Storage !== "undefined") Storage.remove("session");
        this.currentUser = null;
        this.updateUI();
        if (typeof Router !== "undefined") Router.navigate("accueil");
    },
    updateProfile() {
        return { success: false, error: "La gestion des profils nécessite le backend de la version principale." };
    },
    isLoggedIn() { return false; },
    updateUI() {
        const container = document.getElementById("header-actions");
        if (!container) return;
        container.textContent = "";
        const notice = document.createElement("span");
        notice.className = "demo-auth-notice";
        notice.textContent = "Mode démo · Comptes désactivés";
        notice.setAttribute("role", "status");
        container.appendChild(notice);
    }
};
function toggleUserMenu() {}
function updateHeaderAuth() { Auth.init(); }
