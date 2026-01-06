#!/usr/bin/env node
/**
 * 🚀 Rapid Release Script for Popup Maker Release Tester
 * 
 * One-line command for complete git flow release process.
 * Optimized for rapid testing with no brakes - perfect for testing workflows.
 * 
 * Usage:
 *   npm run rapid-release          # Patch increment (1.0.24 → 1.0.25)
 *   npm run rapid-release:minor    # Minor increment (1.0.24 → 1.1.0) 
 *   npm run rapid-release:major    # Major increment (1.0.24 → 2.0.0)
 *   npm run rapid-release 1.2.3    # Specific version
 * 
 * What it does:
 * 1. ✅ Calculates next version (patch by default)
 * 2. 🔄 Switches to develop branch
 * 3. 📝 Updates versions in all files
 * 4. 📋 Updates changelog (moves Unreleased → versioned)
 * 5. 🌿 Creates git flow release branch
 * 6. 💾 Commits changes
 * 7. 🔀 Merges develop → master
 * 8. 🏷️ Creates and pushes tag
 * 9. 🚀 Pushes all branches
 * 10. 🔄 Returns to develop
 * 
 * @package PopupMaker\ReleaseTester
 * @since 1.0.25
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Colors for output 🎨
const colors = {
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m',
	reset: '\x1b[0m',
	bold: '\x1b[1m',
};

function colorize(color, text) {
	return `${colors[color]}${text}${colors.reset}`;
}

function log(message, color = 'reset') {
	console.log(colorize(color, message));
}

function success(message) {
	log(`✅ ${message}`, 'green');
}

function info(message) {
	log(`ℹ️  ${message}`, 'blue');
}

function warn(message) {
	log(`⚠️  ${message}`, 'yellow');
}

function error(message) {
	log(`❌ ${message}`, 'red');
}

function step(message) {
	log(`🔄 ${message}`, 'cyan');
}

// Execute command with error handling
function exec(command, options = {}) {
	try {
		const result = execSync(command, { 
			stdio: options.silent ? 'pipe' : 'inherit',
			encoding: 'utf8',
			...options 
		});
		return result;
	} catch (err) {
		error(`Command failed: ${command}`);
		error(err.message);
		process.exit(1);
	}
}

// Get current version from main plugin file
function getCurrentVersion() {
	const pluginFile = 'popup-maker-release-tester.php';
	if (!fs.existsSync(pluginFile)) {
		error('Plugin file not found. Run this from the plugin root directory.');
		process.exit(1);
	}
	
	const content = fs.readFileSync(pluginFile, 'utf8');
	const versionMatch = content.match(/Version:\s*(\d+\.\d+\.\d+(?:-(?:alpha|beta|rc)\.?\d+)?)/);
	
	if (!versionMatch) {
		error('Could not find version in plugin file');
		process.exit(1);
	}
	
	return versionMatch[1];
}

// Get the last stable version from git tags
function getLastStableVersion() {
	try {
		// Get all tags, filter for stable versions (no pre-release suffixes)
		const tags = exec('git tag -l', { silent: true }).trim().split('\n');
		const stableTags = tags
			.filter(tag => /^v?\d+\.\d+\.\d+$/.test(tag))
			.map(tag => tag.replace(/^v/, ''))
			.sort((a, b) => {
				const aParts = a.split('.').map(Number);
				const bParts = b.split('.').map(Number);
				// Compare major, minor, patch
				for (let i = 0; i < 3; i++) {
					if (aParts[i] !== bParts[i]) {
						return bParts[i] - aParts[i]; // Descending order
					}
				}
				return 0;
			});
		
		return stableTags[0] || '0.0.0';
	} catch (e) {
		// Fallback to current version if git fails
		return getCurrentVersion().replace(/-(?:alpha|beta|rc).*$/, '');
	}
}

// Calculate next version
function getNextVersion(current, type = 'patch', customVersion = null) {
	if (customVersion) {
		// Validate custom version format
		if (!/^\d+\.\d+\.\d+(?:-(?:alpha|beta|rc)\.?\d+)?$/.test(customVersion)) {
			error(`Invalid custom version format: ${customVersion}. Use semantic versioning (e.g., 1.0.26)`);
			process.exit(1);
		}
		return customVersion;
	}
	
	// Handle beta/alpha versions - strip suffixes for calculation
	const cleanVersion = current.replace(/-(?:alpha|beta|rc).*$/, '');
	const parts = cleanVersion.split('.').map(Number);
	
	if (parts.length !== 3 || parts.some(isNaN)) {
		error(`Invalid version format: ${current}. Expected semantic versioning (major.minor.patch)`);
		process.exit(1);
	}
	
	switch (type) {
		case 'major':
			return `${parts[0] + 1}.0.0`;
		case 'minor':
			return `${parts[0]}.${parts[1] + 1}.0`;
		case 'patch':
		default:
			return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
	}
}

// Update version in files
function updateVersions(version) {
	step('Updating version numbers...');
	
	// Update main plugin file
	const pluginFile = 'popup-maker-release-tester.php';
	let content = fs.readFileSync(pluginFile, 'utf8');
	
	// Update plugin header version
	content = content.replace(/Version:\s*[\d.-]+(?:alpha|beta|rc)?[\d]*/, `Version: ${version}`);
	
	// Update define constant
	content = content.replace(/define\(\s*'PMRT_VERSION',\s*'[\d.-]+(?:alpha|beta|rc)?[\d]*'\s*\);/, `define( 'PMRT_VERSION', '${version}' );`);
	
	// Update config array version
	content = content.replace(/'version'\s*=>\s*'[\d.-]+(?:alpha|beta|rc)?[\d]*'/, `'version' => '${version}'`);
	
	// Update EDD updater version
	content = content.replace(/'version'\s*=>\s*'[\d.-]+(?:alpha|beta|rc)?[\d]*'/, `'version' => '${version}'`);
	
	fs.writeFileSync(pluginFile, content);
	
	// Update readme.txt if it exists
	const readmeFile = 'readme.txt';
	if (fs.existsSync(readmeFile)) {
		let readmeContent = fs.readFileSync(readmeFile, 'utf8');
		readmeContent = readmeContent.replace(/Stable tag:\s*[\d.-]+(?:alpha|beta|rc)?[\d]*/, `Stable tag: ${version}`);
		fs.writeFileSync(readmeFile, readmeContent);
	}
	
	success(`Updated version to ${version}`);
}

// Update changelog
function updateChangelog(version) {
	step('Updating changelog...');
	
	const changelogFile = 'CHANGELOG.md';
	if (!fs.existsSync(changelogFile)) {
		warn('CHANGELOG.md not found, skipping changelog update');
		return;
	}
	
	const releaseDate = new Date().toISOString().split('T')[0];
	let changelog = fs.readFileSync(changelogFile, 'utf8');
	
	// Find Unreleased section
	const unreleasedStart = changelog.indexOf('## Unreleased');
	if (unreleasedStart === -1) {
		warn('No Unreleased section found in CHANGELOG.md');
		return;
	}
	
	// Find next version section
	const afterUnreleased = changelog.substring(unreleasedStart + '## Unreleased'.length);
	const nextVersionMatch = afterUnreleased.match(/\n## (?:v|\[)/);
	
	if (!nextVersionMatch) {
		warn('Could not find existing version section in CHANGELOG.md');
		return;
	}
	
	const nextVersionStart = unreleasedStart + '## Unreleased'.length + nextVersionMatch.index;
	const unreleasedContent = changelog
		.substring(unreleasedStart + '## Unreleased\n\n'.length, nextVersionStart)
		.trim();
	
	if (!unreleasedContent) {
		warn('No unreleased changes found, adding default entry');
		const defaultEntry = '### Changed\n- 🧪 Test release for workflow validation';
		
		// Update changelog with default entry
		changelog = changelog.substring(0, unreleasedStart) +
			`## Unreleased\n\n## v${version} - ${releaseDate}\n\n${defaultEntry}\n\n` +
			changelog.substring(nextVersionStart);
	} else {
		// Move unreleased content to new version
		changelog = changelog.substring(0, unreleasedStart) +
			`## Unreleased\n\n## v${version} - ${releaseDate}\n\n${unreleasedContent}\n\n` +
			changelog.substring(nextVersionStart);
	}
	
	fs.writeFileSync(changelogFile, changelog);
	
	// Update readme.txt changelog if it exists
	const readmeFile = 'readme.txt';
	if (fs.existsSync(readmeFile)) {
		const readme = fs.readFileSync(readmeFile, 'utf8');
		const changelogMatch = readme.match(/(== Changelog ==\n\n)(= \d+\.\d+\.\d+[^\n]*=)/s);
		
		if (changelogMatch) {
			const changelogEntry = unreleasedContent || '🧪 Test release for workflow validation';
			const newEntry = `= ${version} =\n${changelogEntry}\n\n`;
			const updated = readme.replace(changelogMatch[0], `${changelogMatch[1]}${newEntry}${changelogMatch[2]}`);
			fs.writeFileSync(readmeFile, updated);
		}
	}
	
	success('Updated changelog');
}

// Check git status
function checkGitStatus() {
	try {
		const status = exec('git status --porcelain', { silent: true });
		if (status.trim()) {
			warn('Working directory has uncommitted changes:');
			console.log(status);
			info('Continuing anyway (test plugin)...');
		}
	} catch (err) {
		error('Not in a git repository');
		process.exit(1);
	}
}

// Ensure we're on develop branch
function ensureDevelopBranch() {
	step('Ensuring we\'re on develop branch...');
	
	try {
		// Check if develop branch exists
		exec('git rev-parse --verify develop', { silent: true });
	} catch (err) {
		// Create develop branch if it doesn't exist
		info('Creating develop branch...');
		exec('git checkout -b develop');
		return;
	}
	
	// Switch to develop
	exec('git checkout develop');
	
	// Pull latest changes
	try {
		exec('git pull origin develop', { silent: true });
	} catch (err) {
		info('Could not pull from origin (branch may not exist remotely)');
	}
	
	success('On develop branch');
}

// Create release branch and commit changes
function createReleaseCommit(version) {
	step('Creating release commit...');
	
	// Add all changes
	exec('git add -A');
	
	// Commit changes
	exec(`git commit -m "chore: release v${version}

- Updated version numbers
- Updated changelog
- Ready for release"`);
	
	success('Created release commit');
}

// Merge to master and tag
function mergeAndTag(version) {
	step('Merging to master and creating tag...');
	
	// Ensure master branch exists
	try {
		exec('git rev-parse --verify master', { silent: true });
	} catch (err) {
		info('Creating master branch...');
		exec('git checkout -b master');
		exec('git checkout develop');
	}
	
	// Switch to master
	exec('git checkout master');
	
	// Reset master to match develop (force sync for test plugin)
	exec('git reset --hard develop');
	
	// Create tag
	exec(`git tag -a v${version} -m "Release v${version}"`);
	
	success('Merged to master and created tag');
}

// Push everything
function pushAll(version) {
	step('Pushing to remote...');
	
	// Push master
	exec('git push origin master');
	
	// Push tag
	exec(`git push origin v${version}`);
	
	// Switch back to develop and push
	exec('git checkout develop');
	exec('git push origin develop');
	
	success('Pushed all branches and tags');
}

// Main function
function main() {
	const args = process.argv.slice(2);
	
	// Parse arguments
	let versionType = 'patch';
	let customVersion = null;
	
	if (args.length > 0) {
		const arg = args[0];
		if (/^\d+\.\d+\.\d+/.test(arg)) {
			customVersion = arg;
		} else if (['major', 'minor', 'patch'].includes(arg)) {
			versionType = arg;
		}
	}
	
	// Check if we're in the right directory
	if (!fs.existsSync('popup-maker-release-tester.php')) {
		error('This script must be run from the popup-maker-release-tester plugin directory');
		process.exit(1);
	}
	
	log(colorize('bold', '🚀 Popup Maker Release Tester - Rapid Release'), 'magenta');
	console.log('');
	
	// Get versions
	const currentVersion = getCurrentVersion();
	const lastStableVersion = getLastStableVersion();
	const targetVersion = getNextVersion(lastStableVersion, versionType, customVersion);
	
	log(`Current version: ${currentVersion}`, 'yellow');
	log(`Last stable:     ${lastStableVersion}`, 'cyan');
	log(`Target version:  ${targetVersion}`, 'green');
	console.log('');
	
	// Pre-flight checks
	checkGitStatus();
	
	// Execute rapid release process
	ensureDevelopBranch();
	updateVersions(targetVersion);
	updateChangelog(targetVersion);
	createReleaseCommit(targetVersion);
	mergeAndTag(targetVersion);
	pushAll(targetVersion);
	
	console.log('');
	success(`🎉 Release v${targetVersion} completed and pushed!`);
	console.log('');
	
	info('What happened:');
	info(`• Updated version from ${currentVersion} → ${targetVersion}`);
	info('• Updated changelog with release date');
	info('• Committed changes on develop branch');
	info('• Merged develop → master');
	info(`• Created and pushed tag v${targetVersion}`);
	info('• Pushed all branches to remote');
	info('• GitHub Actions will now trigger automatically');
	
	console.log('');
	log('🧪 Test release ready for validation!', 'cyan');
}

// Run the script
if (require.main === module) {
	main();
}
