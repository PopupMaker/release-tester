#!/usr/bin/env node
/**
 * Prepare a new release by updating versions and changelog
 *
 * Usage: node bin/prepare-release.js <version>
 */

const { execSync } = require('child_process');
const path = require('path');

const version = process.argv[2];
if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
	console.error('❌ Invalid version. Usage: node bin/prepare-release.js 1.0.20');
	process.exit(1);
}

console.log(`\n🚀 Preparing release v${version}...\n`);

try {
	// Update changelog
	console.log('📝 Updating CHANGELOG.md and readme.txt...');
	execSync(`node "${path.join(__dirname, 'update-changelog.js')}" ${version}`, { stdio: 'inherit' });

	// Update versions
	console.log('\n🔢 Updating version numbers...');
	execSync(`node "${path.join(__dirname, 'update-versions.js')}" ${version}`, { stdio: 'inherit' });

	console.log(`\n✅ Release v${version} prepared successfully!`);
	console.log(`\nNext steps:`);
	console.log(`  1. Review changes: git diff`);
	console.log(`  2. Commit changes: git add . && git commit -m "Release v${version}"`);
	console.log(`  3. Create tag: git tag v${version}`);
	console.log(`  4. Push: git push && git push --tags`);

} catch (error) {
	console.error(`\n❌ Release preparation failed: ${error.message}`);
	process.exit(1);
}
