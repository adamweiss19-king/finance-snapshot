# Finance Snapshot

Finance Snapshot is a lightweight personal-finance planning app built with React and Vite. It helps you model cash flow, project year-end net worth, and experiment with demo financial profiles.

## Features

- Load realistic demo profiles (age-based) to prefill income, assets, debt, and spending
- Edit and manage Income, Assets, Debt, Spending, and Contributions via manager components
- Year-end projections for net worth, runway calculation, and visual summaries
- Tailwind CSS for rapid styling and responsive layout

## Tech Stack

- React 19
- Vite (dev server & build)
- Tailwind CSS
- ESLint (basic rules)

## Prerequisites

- Node.js 18+ (recommended)
- npm (or yarn / pnpm)

## Quick Start

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run the linter:

```bash
npm run lint
```

## Available Scripts

- `dev` - starts Vite dev server with HMR
- `build` - builds production assets with Vite
- `preview` - previews production build locally
- `lint` - runs ESLint

## Project Structure (key files)

```
src/
	App.jsx                  # Main application layout and math engine
	main.jsx                 # React entry
	index.css                # Tailwind + base styles
	components/
		IncomeManager.jsx
		AssetManager.jsx
		DebtManager.jsx
		SpendingManager.jsx
		AssetContributionManager.jsx
		DebtContributionManager.jsx
		ActionChecklist.jsx
	utils/
		demoProfiles.jsx       # Seed/demo profile data used by the "Load Profile" buttons
public/                    # Static assets
package.json               # Scripts and dependencies
README.md
```

## Usage

- Open `http://localhost:5173` after running `npm run dev`.
- Use the top "Test Data Templates" buttons to load example profiles (25, 40, 50 years).
- Edit values in the managers to see live recalculation of allocations, runway, and projections.
- To change the seed/demo profiles, edit `src/utils/demoProfiles.jsx`.

## Troubleshooting

- If you see an error about an undefined setter like `setDebtAllocationData`, ensure `debtAllocationData` state is declared in `src/App.jsx`. (A recent fix added `const [debtAllocationData, setDebtAllocationData] = useState([]);`.)
- If the dev server fails to start, check your Node version and that dependencies are installed.

## Contributing

- Fork the repo, create a feature branch, and open a PR. Run the linter before submitting changes:

```bash
npm run lint
```

## License

This project is unlicensed by default. Add a `LICENSE` file (for example, `MIT`) if you want to make it open source.

## Contact

- Maintainer: You (local project)
- For questions, open an issue or edit the README directly and submit a PR.
