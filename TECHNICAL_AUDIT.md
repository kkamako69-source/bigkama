# Audit technique — dépôt bigkama

Date : 21 novembre 2026. Inspection en lecture du dépôt `main`.

## Résultat

Le dépôt contient des fragments HTML, une première version de Punchi Battle et plusieurs essais d'architecture. Il ne doit pas être considéré comme une version de production avant correction des chargements JavaScript.

## Blocages reproduits à partir du code

1. `index.html` charge `js/auth.js` comme script navigateur. Or ce fichier utilise `require('express')`, `require('jsonwebtoken')`, `require('bcrypt')` et `module.exports`. Ces symboles sont propres à un environnement Node.js/CommonJS et ne sont pas disponibles dans un script HTML classique.
2. `index.html` charge `js/router.js` comme script classique. Ce fichier contient des imports ES modules de Vue et de composants `.vue`, mais le dépôt ne contient pas ces composants ni de configuration de build dans sa racine.
3. `js/storage.js` est un squelette et déclare un objet de données de démonstration vide, alors que la version racine `storage.js` contient une autre implémentation LocalStorage.
4. Plusieurs pages (`accueil.html`, `battles.html`, `classement.html`, `login.html`, `register.html`, `profil.html`) sont des fragments destinés à être injectés dans un conteneur, et non des documents HTML complets. Le routeur doit être cohérent avec cette architecture.

## Recommandation

Ne pas mélanger les fichiers Express/Vue et le front-end statique. Choisir une seule voie :
- soit un front-end statique vanilla avec API distante clairement définie ;
- soit une application Vue avec `package.json`, composants présents, build et déploiement configurés.

La voie de migration recommandée pour la suite est de reprendre le prototype principal dans `punchi-battle` et de conserver `bigkama` comme archive de travail jusqu'à comparaison visuelle et fonctionnelle.

## Sécurité

Le code Express contient une valeur de secret JWT d'exemple codée en dur (`your_jwt_secret`). Ne pas déployer ce fichier tel quel. Utiliser une variable d'environnement côté serveur et ne jamais déplacer ce secret dans le navigateur.
