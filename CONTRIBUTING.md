# Contributing Guide

Thank you for your interest in contributing to `nepal-district-map`! Contributions of all kinds are welcome — bug fixes, new features, documentation improvements, and more.

## Getting Started

### 1. Fork and clone

```bash
git clone https://github.com/palniraj/nepal-district-map.git
cd nepal-district-map
npm install
```

### 2. Build

```bash
npm run build
```

### 3. Watch mode (rebuilds on save)

```bash
npm run dev
```

### 4. Type check

```bash
npm run lint
```

## Project Structure

```
nepal-district-map/
├── src/
│   ├── NepalMap.tsx          # Main map component
│   ├── NepalMapLegend.tsx    # Legend companion component
│   ├── utils.ts              # Color scale and data utilities
│   ├── index.ts              # Main entry point
│   └── data/
│       ├── districts.ts      # SVG paths for all 77 districts
│       ├── provinces.ts      # Province colors and district mapping
│       ├── types.ts          # TypeScript interfaces
│       └── index.ts          # Data-only entry point
├── examples/
│   └── basic.tsx             # Usage examples
├── dist/                     # Built output (auto-generated, not committed)
└── package.json
```

## How to Contribute

### Reporting a Bug

1. Check [existing issues](https://github.com/palniraj/nepal-district-map/issues) first
2. Open a new issue with:
   - A clear title
   - Steps to reproduce
   - Expected vs actual behavior
   - Your React version and environment

### Suggesting a Feature

Open an issue with the `enhancement` label. Describe the use case and why it would benefit other users.

### Submitting a Pull Request

1. Create a branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. Make your changes

3. Make sure the build passes:
   ```bash
   npm run lint
   npm run build
   ```

4. Commit with a clear message following [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat: add zoom support
   fix: correct Sindhupalchok label position
   docs: add choropleth example
   ```

5. Push and open a Pull Request against `main`

## SVG Map Data

The district SVG paths in `src/data/districts.ts` are sourced from the official Nepal administrative boundary data. The `viewBox` is `0 0 1200 800`.

If you find a boundary inaccuracy, please open an issue with a reference source before submitting a fix.

## Code Style

- TypeScript strict mode is enabled — no `any` types
- All exported functions and props must have JSDoc comments
- Keep components pure and side-effect free where possible
- No new runtime dependencies — this package must stay zero-dependency

## Questions?

Feel free to reach out:

- Open a [GitHub issue](https://github.com/palniraj/nepal-district-map/issues)
- Connect on [LinkedIn](https://www.linkedin.com/in/niraj-pal/)

---

Thank you for helping make `nepal-district-map` better for everyone! 🙏
