# Security policy

## Scope

This repository is a public project. Treat credentials, session tokens, personal data and private media as sensitive.

## Reporting a vulnerability

Do not publish secrets, exploit details or personal data in a public issue. Use GitHub's private vulnerability reporting feature from the Security tab when it is enabled for this repository. If it is unavailable, ask the repository maintainer for a private reporting channel before sharing technical details.

## Safe testing

- Do not test against accounts, sites or data that you do not own or have permission to test.
- Never commit API secret keys, database passwords, service-role keys, private tokens or environment files.
- Front-end code may contain only deliberately public publishable keys; row-level security must enforce access to protected data.
- A successful static check is not proof that authentication, authorization or deployment is production-ready.
