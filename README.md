# Punchi Battle — dépôt historique `bigkama`

Ce dépôt conserve une ancienne maquette de **Punchi Battle**. Le prototype principal est développé séparément dans [`punchi-battle`](https://github.com/kkamako69-source/punchi-battle).

## Rôle de cette archive

- `index.html` : point d’entrée de la maquette historique.
- `accueil.html`, `battles.html`, `classement.html`, `profil.html` : fragments de l’interface.
- `login.html`, `register.html` : anciens écrans conservés pour documenter l’évolution du projet.
- `storage.js`, `auth.js`, `router.js` à la racine : modules de démonstration.
- `js/` et `auth/` : essais historiques, notamment des fichiers serveur/Vue qui ne sont pas chargés par le point d’entrée statique.

## Sécurité des comptes

**L’inscription et la connexion sont désactivées dans cette archive.** Une ancienne version stockait localement des mots de passe sous forme de hachage faible, ce qui n’est pas adapté à une authentification réelle. Le nouveau module `auth.js` refuse maintenant toute création de compte et toute connexion locale. Les anciennes données enregistrées dans un navigateur ne sont pas automatiquement supprimées.

Ne saisis aucun vrai mot de passe, adresse e-mail ou donnée personnelle dans cette archive. La version principale `punchi-battle` dispose maintenant d’un backend Supabase Auth préparé et d’un schéma PostgreSQL avec RLS ; son interface publique reste toutefois en mode démonstration tant que les tests d’intégration ne sont pas terminés.

## Démarrage et contrôles

Ouvre `index.html` pour consulter la maquette. Les interactions de démonstration peuvent être conservées localement ; cela ne crée aucun compte public et ne garantit pas l’intégrité d’un vote.

```sh
python tools/check_site.py
node tools/check_inline_js.cjs
```

GitHub Actions exécute les contrôles sur les commits et pull requests. CodeQL analyse le JavaScript, et Dependabot propose chaque semaine les mises à jour des GitHub Actions.

## Documents

- [Audit technique](TECHNICAL_AUDIT.md)
- [Conditions de la démo](conditions.html)
- [Notice de confidentialité](confidentialite.html)
- [Politique de sécurité](SECURITY.md)

> Statut : archive de conception et de comparaison, pas un service d’authentification ou une plateforme de concours en production.
