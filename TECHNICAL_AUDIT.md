# Audit technique — dépôt bigkama

Date : 21 novembre 2026. Inspection en lecture du dépôt `main`.

## Résultat

Le dépôt contient des fragments HTML, une première version de Punchi Battle et plusieurs essais d'architecture. Il ne doit pas être considéré comme une version de production avant correction des chargements JavaScript.

## Problèmes constatés et corrections appliquées

1. **Corrigé le 21 novembre 2026 :** `index.html` charge maintenant les modules racine `storage.js`, `auth.js` et `router.js`. Les anciens `js/auth.js` et `js/router.js` ne sont plus chargés par la page d'accueil. Ils restent des essais historiques.
2. L'ancien `js/router.js` contient des imports Vue et des composants `.vue` absents du dépôt ; il ne doit pas être réactivé sans ajouter une vraie configuration de build et les composants.
3. L'ancien `js/storage.js` est un squelette. Le fichier racine `storage.js` reste un stockage `localStorage` de démonstration, pas une base de données distante.
4. Les pages racine `accueil.html`, `battles.html`, `classement.html`, `login.html`, `register.html` et `profil.html` sont des fragments chargés par le routeur racine ; elles ne sont pas destinées à être servies individuellement comme pages complètes.
5. Le routeur racine a été ajusté pour utiliser les vrais chemins des fragments et permettre aux pages de battle et classement d'être consultées sans compte.

## Recommandation

Ne pas mélanger les fichiers Express/Vue et le front-end statique. Choisir une seule voie :
- soit un front-end statique vanilla avec API distante clairement définie ;
- soit une application Vue avec `package.json`, composants présents, build et déploiement configurés.

La voie de migration recommandée pour la suite est de reprendre le prototype principal dans `punchi-battle` et de conserver `bigkama` comme archive de travail jusqu'à comparaison visuelle et fonctionnelle.

## Sécurité

- Le fichier racine `auth.js` utilise actuellement un stockage local et un hachage de démonstration très simple. L'avis visible sur le site interdit donc d'y saisir un vrai mot de passe ou un mot de passe réutilisé. Ce n'est pas une authentification de production.
- Le dossier `js/` contient un ancien serveur Express avec une valeur de secret JWT d'exemple codée en dur (`your_jwt_secret`). Ne jamais déployer cet essai tel quel. Pour une future authentification, utiliser Supabase Auth ou un backend avec Argon2id/bcrypt approprié, secrets en variables d'environnement, sessions sûres et contrôle d'accès serveur.
- Les valeurs de profil affichées dans l'en-tête sont désormais échappées avant injection HTML, mais cela ne transforme pas le système local en backend sécurisé.
