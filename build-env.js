/**
 * Vercel Build Script
 * Runs during Vercel deployment build step.
 * Reads environment variables from Vercel and generates the local env.js file.
 */
const fs = require('fs');

const tmdbKey = process.env.TMDB_API_KEY || 'YOUR_TMDB_API_KEY_HERE';
const geminiKey = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE';

const fileContent = `/**
 * Generated dynamically by Vercel build-env script.
 */
export const ENV = {
  TMDB_API_KEY: '${tmdbKey}',
  GEMINI_API_KEY: '${geminiKey}'
};
`;

try {
  fs.writeFileSync('env.js', fileContent);
  console.log('Vercel Build: env.js generated successfully from Vercel variables.');
} catch (error) {
  console.error('Vercel Build: Failed to write env.js', error);
  process.exit(1);
}
