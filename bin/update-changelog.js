#!/usr/bin/env node
/**
 * Update CHANGELOG.md and readme.txt with release version
 *
 * Usage: node bin/update-changelog.js <version>
 */

const fs = require('fs');
const path = require('path');

const version = process.argv[2];
if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
	console.error('❌ Invalid version. Usage: node bin/update-changelog.js 1.0.20');
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

if (!unreleasedContent) {
	console.error('❌ No unreleased changes found');
	process.exit(1);
}

// Update CHANGELOG.md
changelog = changelog.substring(0, unreleasedStart) +
	`## Unreleased\n\n## v${version} - ${releaseDate}\n\n${unreleasedContent}\n\n` +
	changelog.substring(nextVersionStart);

fs.writeFileSync(changelogPath, changelog, 'utf8');
console.log(`✅ Updated CHANGELOG.md`);

// Update readme.txt
if (fs.existsSync(readmePath)) {
	const readme = fs.readFileSync(readmePath, 'utf8');
	const changelogMatch = readme.match(/(== Changelog ==\n\n)(= \d+\.\d+\.\d+[^\n]*=)/s);
	
	if (changelogMatch) {
		const newEntry = `= ${version} =\n${unreleasedContent}\n\n`;
		const updated = readme.replace(changelogMatch[0], `${changelogMatch[1]}${newEntry}${changelogMatch[2]}`);
		fs.writeFileSync(readmePath, updated, 'utf8');
		console.log(`✅ Updated readme.txt`);
	}
}

console.log(`\n✅ Changelog updated for v${version}`);
