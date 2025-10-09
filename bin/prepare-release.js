#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Release preparation script for Popup Maker Release Tester
 *
 * Workflow:
 * 1. Calculate next version (or use provided version)
 * 2. Update version in plugin files
 * 3. Update changelog
 * 4. Commit changes
 * 5. Create tag
 * 6. Push changes
 *
 * Usage:
 *   node bin/prepare-release.js [version] [options]
 *
 * Options:
 *   --major      Increment major version
 *   --minor      Increment minor version
 *   --patch      Increment patch version [default]
 *   --beta       Create beta release (auto-increments beta.1, beta.2, etc.)
 *   --dry-run    Show what would be done
 *   --auto       Skip confirmations
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Parse arguments.
const args = process.argv.slice(2);
const flags = {
	major: args.includes('--major'),
	minor: args.includes('--minor'),
	patch: args.includes('--patch') || (!args.includes('--major') && !args.includes('--minor') && !args.includes('--beta')),
	beta: args.includes('--beta'),
	dryRun: args.includes('--dry-run'),
	auto: args.includes('--auto'),
};

// Version from argument.
const versionArg = args.find(arg => !arg.startsWith('--'));

// Colors.
const colors = {
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	cyan: '\x1b[36m',
	reset: '\x1b[0m',
	bold: '\x1b[1m',
};

function color(c, text) {
	return `${colors[c]}${text}${colors.reset}`;
}

function log(msg) {
	console.log(msg);
}

function success(msg) {
	console.log(color('green', `✅ ${msg}`));
}

function error(msg) {
	console.error(color('red', `❌ ${msg}`));
	process.exit(1);
}

function warn(msg) {
	console.log(color('yellow', `⚠️  ${msg}`));
}

function exec(cmd, options = {}) {
	if (flags.dryRun) {
		log(color('blue', `[DRY RUN] ${cmd}`));
		return '';
	}
	try {
		return execSync(cmd, { encoding: 'utf8', stdio: options.silent ? 'pipe' : 'inherit', ...options });
	} catch (e) {
		if (!options.ignoreError) {
			error(`Command failed: ${cmd}\n${e.message}`);
		}
		return '';
	}
}

// Read current version from plugin file.
function getCurrentVersion() {
	const pluginFile = path.join(__dirname, '../popup-maker-release-tester.php');
	const content = fs.readFileSync(pluginFile, 'utf8');
	const match = content.match(/Version:\s*([^\s]+)/);
	if (!match) {
		error('Could not find version in plugin file');
	}
	return match[1];
}

// Get all git tags to find existing beta versions.
function getExistingBetas(baseVersion) {
	try {
		const tags = exec('git tag', { silent: true, ignoreError: true }).trim().split('\n');
		const betaPattern = new RegExp(`^v?${baseVersion.replace(/\./g, '\\.')}-beta\\.(\\d+)$`);
		const betaNumbers = tags
			.map(tag => {
				const match = tag.match(betaPattern);
				return match ? parseInt(match[1], 10) : null;
			})
			.filter(num => num !== null);
		return betaNumbers.length > 0 ? Math.max(...betaNumbers) : 0;
	} catch (e) {
		return 0;
	}
}

// Calculate next version.
function getNextVersion(current) {
	// Parse current version to handle beta versions.
	const betaMatch = current.match(/^(\d+\.\d+\.\d+)-beta\.(\d+)$/);
	const baseVersion = betaMatch ? betaMatch[1] : current;
	const parts = baseVersion.split('.').map(Number);

	// Beta release logic.
	if (flags.beta) {
		// Determine base version for beta.
		let targetBase;
		if (flags.major) {
			targetBase = `${parts[0] + 1}.0.0`;
		} else if (flags.minor) {
			targetBase = `${parts[0]}.${parts[1] + 1}.0`;
		} else {
			// Default: use current version as base for beta.
			targetBase = baseVersion;
		}

		// Find highest existing beta for this base version.
		const existingBetaNum = getExistingBetas(targetBase);
		const nextBetaNum = existingBetaNum + 1;

		return `${targetBase}-beta.${nextBetaNum}`;
	}

	// Standard release logic.
	if (flags.major) {
		return `${parts[0] + 1}.0.0`;
	}
	if (flags.minor) {
		return `${parts[0]}.${parts[1] + 1}.0`;
	}
	return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
}

// Main workflow.
function main() {
	const releaseType = flags.beta ? '🧪 Beta Release' : 'Release';
	log(color('bold', `🚀 Popup Maker Release Tester - ${releaseType} Preparation\n`));

	// Get current version.
	const currentVersion = getCurrentVersion();
	log(`Current version: ${color('cyan', currentVersion)}`);

	// Determine new version.
	const newVersion = versionArg || getNextVersion(currentVersion);
	log(`New version: ${color('green', newVersion)}\n`);

	if (flags.beta) {
		log(color('yellow', '🧪 Beta release mode - lightweight workflow\n'));
	}

	// Confirm.
	if (!flags.auto && !flags.dryRun) {
		const flowType = flags.beta ? 'create a beta release' : 'create a release';
		warn(`This will ${flowType}. Continue? (Ctrl+C to cancel)`);
		exec('read -p "Press Enter to continue..."', { shell: '/bin/bash' });
	}

	// Update changelog.
	log(color('bold', '\n📝 Updating CHANGELOG.md and readme.txt...'));
	const changelogFlags = flags.beta ? '--allow-empty' : '';
	exec(`node bin/update-changelog.js ${newVersion} ${changelogFlags}`);

	// Update versions.
	log(color('bold', '\n✍️  Updating version numbers...'));
	exec(`node bin/update-versions.js ${newVersion}`);

	// Commit changes.
	log(color('bold', '\n💾 Committing changes...'));
	exec('git add -A');
	const commitMsg = flags.beta ? `Beta release v${newVersion}` : `Release v${newVersion}`;
	exec(`git commit -m "${commitMsg}"`);

	// Create tag.
	log(color('bold', '\n🏷️  Creating tag...'));
	const tagMsg = flags.beta ? `Beta release v${newVersion}` : `Release v${newVersion}`;
	exec(`git tag -a v${newVersion} -m "${tagMsg}"`);

	// Push changes.
	log(color('bold', '\n⬆️  Pushing changes...'));
	exec('git push origin develop');
	exec(`git push origin v${newVersion}`);

	const emoji = flags.beta ? '🧪' : '🎉';
	success(`\n${emoji} ${flags.beta ? 'Beta' : 'Release'} v${newVersion} complete!`);
}

// Run.
try {
	main();
} catch (e) {
	error(e.message);
}
