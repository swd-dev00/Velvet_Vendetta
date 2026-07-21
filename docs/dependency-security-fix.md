# Dependency vulnerability remediation

The dependency manifest pins or overrides patched versions for all eight reported high-severity advisories.

## Enforced versions

- `vite`: `7.3.6`
- vulnerable `rollup@4.52.5` -> `4.62.2`
- vulnerable `picomatch@4.0.3` -> `4.0.5`
- vulnerable `drizzle-orm@0.39.3` -> `0.45.2`
- vulnerable `path-to-regexp@0.1.12` -> `0.1.13`
- vulnerable `ws@8.18.0` -> `8.21.0`

## Verification

A clean install from the updated manifest resolved:

- Vite `7.3.6`
- Rollup `4.62.2`
- Picomatch `4.0.5`
- Drizzle ORM: not installed
- path-to-regexp: not installed
- ws: not installed

`npm audit --audit-level=high` completed with **0 vulnerabilities**.
