#!/usr/bin/env node
/**
 * Update version numbers across plugin files
 *
 * Usage: node bin/update-versions.js <version>
 */

const fs = require('fs');
const path = require('path');

const version = process.argv[2];
if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
	console.error('❌ Invalid version. Usage: node bin/update-versions.js 1.0.20');
	process.exit(1);
}

const files = [
	{
		path: 'popup-maker-release-tester.php',
		patterns: [
			{ regex: /Version:\s*[\d.]+/, replacement: `Version: ${version}` },
			{ regex: /define\(\s*'PMRT_VERSION',\s*'[\d.]+'\s*\);/, replacement: `define( 'PMRT_VERSION', '${version}' );` },
			{ regex: /'version'\s*=>\s*'[\d.]+'/, replacement: `'version' => '${version}'` }
		]
	},
	{
		path: 'readme.txt',
		patterns: [
			{ regex: /Stable tag:\s*[\d.]+/, replacement: `Stable tag: ${version}` }
		]
	}
];

let filesUpdated = 0;

files.forEach(file => {
	const filePath = path.join(process.cwd(), file.path);

	if (!fs.existsSync(filePath)) {
		console.warn(`⚠️  File not found: ${file.path}`);
		return;
	}

	let content = fs.readFileSync(filePath, 'utf8');
	let modified = false;

	file.patterns.forEach(pattern => {
		if (pattern.regex.test(content)) {
			content = content.replace(pattern.regex, pattern.replacement);
			modified = true;
		}
	});

	if (modified) {
		fs.writeFileSync(filePath, content, 'utf8');
		console.log(`✅ Updated ${file.path}`);
		filesUpdated++;
	}
});

if (filesUpdated === 0) {
	console.error('❌ No files were updated');
	process.exit(1);
}

console.log(`\n✅ Version updated to ${version} in ${filesUpdated} file(s)`);
