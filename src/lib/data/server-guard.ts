import 'server-only';
// This file establishes the server-only boundary for src/lib/data/.
// Every file in this directory must include `import 'server-only'` at the top.
// This causes a build error if any file here is accidentally imported by a client component.
