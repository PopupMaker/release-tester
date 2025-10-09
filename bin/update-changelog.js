#!/usr/bin/env node
/**
 * Update CHANGELOG.md and readme.txt with release version
 *
 * Usage: node bin/update-changelog.js <version> [--allow-empty]
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const version = args.find(arg => !arg.startsWith('--'));
const allowEmpty = args.includes('--allow-empty');

// Support both standard (1.0.0) and beta (1.0.0-beta.1) versions.
if (!version || !/^\d+\.\d+\.\d+(-beta\.\d+)?$/.test(version)) {
	console.error('❌ Invalid version. Usage: node bin/update-changelog.js 1.0.20 or 1.0.20-beta.1');
	process.exit(1);
}

const releaseDate = new Date().toISOString().split('T')[0];
const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
const readmePath = path.join(process.cwd(), 'readme.txt');

// Update CHANGELOG.md
if (!fs.existsSync(changelogPath)) {
	console.error('❌ CHANGELOG.md not found');
	process.exit(1);
}

let changelog = fs.readFileSync(changelogPath, 'utf8');
const unreleasedStart = changelog.indexOf('## Unreleased');

if (unreleasedStart === -1) {
	console.error('❌ Could not find Unreleased section in CHANGELOG.md');
	process.exit(1);
}

// Find next version section (supports both ## v1.0.0 and ## [1.0.0] formats)
const afterUnreleased = changelog.substring(unreleasedStart + '## Unreleased'.length);
const nextVersionMatch = afterUnreleased.match(/\n## (?:v|\[)/);

if (!nextVersionMatch) {
	console.error('❌ Could not find existing version section in CHANGELOG.md');
	process.exit(1);
}

const nextVersionStart = unreleasedStart + '## Unreleased'.length + nextVersionMatch.index;

const unreleasedContent = changelog
	.substring(unreleasedStart + '## Unreleased\n\n'.length, nextVersionStart)
	.trim();

if (!unreleasedContent && !allowEmpty) {
	console.error('❌ No unreleased changes found');
	console.error('   Use --allow-empty to create release without changelog entries');
	process.exit(1);
}

// Use placeholder for empty releases.
const changelogEntry = unreleasedContent || '- Minor updates and improvements';

// Update CHANGELOG.md
changelog = changelog.substring(0, unreleasedStart) +
	`## Unreleased\n\n## v${version} - ${releaseDate}\n\n${changelogEntry}\n\n` +
	changelog.substring(nextVersionStart);

fs.writeFileSync(changelogPath, changelog, 'utf8');
console.log(`✅ Updated CHANGELOG.md${!unreleasedContent ? ' (with placeholder)' : ''}`);

// Update readme.txt
if (fs.existsSync(readmePath)) {
	const readme = fs.readFileSync(readmePath, 'utf8');
	const changelogMatch = readme.match(/(== Changelog ==\n\n)(= \d+\.\d+\.\d+(-beta\.\d+)?[^\n]*=)/s);
	
	if (changelogMatch) {
		const newEntry = `= ${version} =\n${changelogEntry}\n\n`;
		const updated = readme.replace(changelogMatch[0], `${changelogMatch[1]}${newEntry}${changelogMatch[2]}`);
		fs.writeFileSync(readmePath, updated, 'utf8');
		console.log(`✅ Updated readme.txt${!unreleasedContent ? ' (with placeholder)' : ''}`);
	}
}

console.log(`\n✅ Changelog updated for v${version}`);
