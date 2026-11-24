# Audit technique — dépôt bigkama

Dernière revue : 24 novembre 2026.

## Résultat

Le dépôt contient une ancienne maquette Punchi Battle et plusieurs essais d’architecture. Il est désormais conservé comme archive de conception ; la version de travail principale est le dépôt `punchi-battle`.

## Corrections déjà appliquées

1. Le point d’entrée `index.html` charge les modules racine `storage.js`, `auth.js` et `router.js`. Les anciens modules dans `js/` ne doivent pas être réactivés sans les dépendances et le build correspondants.
2. Le routeur racine utilise les véritables chemins des fragments et laisse les pages de battles/classement consulter la démonstration.
3. Les valeurs de profil sont échappées avant insertion HTML dans l’en-tête.
4. Le contrôle HTML et l’analyse de syntaxe JavaScript sont intégrés à GitHub Actions ; CodeQL est planifié chaque semaine ; Dependabot suit les actions.
5. **24 novembre 2026 :** l’authentification locale a été désactivée. L’ancienne fonction utilisait un hash non cryptographique côté navigateur et persistait des comptes dans `localStorage`. Le nouvel `auth.js` ne lit plus les sessions locales, n’accepte plus les inscriptions/connexions, et ne stocke aucun nouveau mot de passe.
6. Les fausses entrées OAuth Google/X ont été retirées des écrans de connexion ; l’interface indique qu’elles ne sont pas configurées.
7. Une notice de confidentialité et des conditions de démonstration ont été ajoutées. Le consentement à une newsletter n’est plus coché par défaut ; aucun envoi d’e-mail n’est implémenté.

## Limites qui subsistent

- `storage.js` conserve encore les données fictives de l’ancienne maquette pour l’affichage. Ne pas les confondre avec des données réelles.
- Les anciennes données présentes dans le `localStorage` d’un navigateur ne sont pas effacées automatiquement. L’utilisateur peut nettoyer le stockage du site depuis son navigateur.
- Le dossier `js/` contient un ancien code serveur Express/Vue, y compris des exemples de secrets. Ne jamais le déployer directement. Aucun secret d’environnement ne doit être commité.
- Les pages d’authentification demeurent visibles à des fins de documentation mais les fonctions de compte renvoient maintenant un message de désactivation.

## Architecture recommandée

Conserver `bigkama` comme archive, et développer la version principale dans `punchi-battle` avec Supabase Auth, PostgreSQL et RLS. Avant de connecter les formulaires publics, ajouter des tests réels avec au moins deux comptes distincts et un visiteur anonyme, tester l’email de confirmation, les redirections et les règles de modération.

## Sécurité

Aucun vrai mot de passe, adresse e-mail ou secret ne doit être saisi dans cette archive. Ne jamais placer de clé Supabase secret/service-role dans le navigateur. Une clé publishable ne peut être exposée que si chaque table exposée est protégée par des policies RLS testées.
