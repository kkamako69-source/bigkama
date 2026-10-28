# Punchi Battle — dépôt `bigkama`

Prototype web de **Punchi Battle**, une arène de battles de punchlines.

## Contenu
- `index.html` : point d’entrée du prototype.
- `accueil.html`, `battles.html`, `classement.html`, `profil.html` : pages de l’interface.
- `login.html`, `register.html` : écrans de connexion et d’inscription.
- `js/`, `pages/`, `auth/` : modules et éléments complémentaires.
- Plusieurs fichiers à la racine semblent être des versions historiques ; les comparer avant de les supprimer.

## Démarrage
Ouvre `index.html` dans un navigateur pour une première vérification visuelle. Les fonctions qui nécessitent un serveur ne peuvent pas être considérées comme opérationnelles sur la seule base de cette ouverture locale.

## Points bloquants avant une mise en production
- L’index charge `js/auth.js` comme script du navigateur, mais le fichier actuellement présent utilise Node.js/Express, `require()` et `module.exports`. Cette intégration doit être séparée entre client et serveur.
- `js/storage.js` contient un stockage de démonstration incomplet.
- Le fichier d’authentification contient une clé JWT d’exemple codée en dur (`your_jwt_secret`). Elle ne doit jamais être utilisée en production ; un secret doit être fourni côté serveur par variable d’environnement.
- Ne pas utiliser de vrais mots de passe ni de données personnelles avant l’implémentation et la vérification d’un backend sécurisé.

## Priorités de maintenance
1. Définir l’architecture client/serveur et supprimer les doublons seulement après comparaison.
2. Mettre en place l’authentification serveur et le stockage persistant.
3. Tester navigation, connexion, inscription, profils, battles et classement sur mobile et ordinateur.
4. Documenter le déploiement et vérifier les contrôles de sécurité avant de publier.

> État documenté : prototype à auditer, pas une confirmation que toutes les fonctions sont opérationnelles.
