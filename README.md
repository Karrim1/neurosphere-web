# NeuroSphere Web Prototype

This is a minimal React project demonstrating the NeuroSphere chat interface.

## Installation

1. Ensure Node.js and npm are installed on your system.
2. Run `npm install` in the project directory to install dependencies and dev dependencies. Note that additional dependencies like webpack and Babel are already specified in `package.json`.

## Usage

To build the project and run it locally:

```bash
# Install dependencies
npm install

# Build the project (creates a dist/ directory with bundle.js)
npm run build

# Serve the files using any static server. For example:
# npx serve dist
```

Alternatively, you can integrate the `src` and `public` folders into an existing React tooling setup.

## Features

- Adjustable verbosity (low/medium/high) that controls response length.
- Adjustable reasoning effort (minimal/medium/high) that controls detail.
- Commands `/generate sql <query>` and `/generate python add <a> <b>` for simple code generation.
- Simple emotion detection based on keywords.

This prototype uses only React and basic inline CSS; no external UI libraries are required.
