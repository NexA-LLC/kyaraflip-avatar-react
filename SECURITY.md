# Security Policy

## Supported Versions

Security fixes are handled on the default branch first. Consumers should install
the latest published package or the latest commit from the public repository.

## Reporting a Vulnerability

Please report suspected vulnerabilities privately instead of opening a public
issue with exploit details.

- Email: security@nexa-llc.com
- Repository: https://github.com/NexA-LLC/kyaraflip-avatar-react

Include the affected version or commit, reproduction steps, expected impact, and
whether the issue affects runtime rendering, package publishing, dependencies, or
bundled assets.

## Scope

In scope:

- Unsafe React or SVG rendering behavior.
- Dependency or build-chain vulnerabilities that affect consumers.
- Problems in generated package output under `dist/`.
- Supply-chain risks in release or package metadata.

Out of scope:

- Vulnerabilities in applications that consume this package incorrectly.
- Issues caused only by arbitrary remote `imageUrl` values supplied by an app.
- Reports without enough detail to reproduce or reason about impact.

## Maintainer Notes

- Keep runtime behavior local and deterministic unless a future feature clearly
  documents a network dependency.
- Avoid adding runtime dependencies unless they materially reduce risk or
  complexity.
- Run `pnpm run check` and `pnpm run build` before publishing or cutting a
  release.
- Review committed `dist/` files whenever source or exports change.
