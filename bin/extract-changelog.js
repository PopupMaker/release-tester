#!/usr/bin/env node

/**
 * Simple changelog extractor for test plugin
 *
 * Extracts changelog content for a specific version
 */

const fs = require('fs');
const path = require('path');

// Get version from command line
const version = process.argv[2];

if (!version) {
    console.error('Usage: node extract-changelog.js <version>');
    process.exit(1);
}

console.log(`🔍 Extracting changelog for version: ${version}`);

try {
    const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');

    if (!fs.existsSync(changelogPath)) {
        console.log('📝 No CHANGELOG.md found, using default content');
        process.exit(0);
    }

    const changelogContent = fs.readFileSync(changelogPath, 'utf8');

    // Simple extraction - just return the first version section
    const lines = changelogContent.split('\n');
    let extracting = false;
    let content = [];

    for (const line of lines) {
        if (line.startsWith('## [') && line.includes(version)) {
            extracting = true;
            continue;
        }

        if (extracting && line.startsWith('## [') && !line.includes(version)) {
            break;
        }

        if (extracting) {
            content.push(line);
        }
    }

    if (content.length > 0) {
        // Remove empty lines at start and end
        while (content.length > 0 && content[0].trim() === '') {
            content.shift();
        }
        while (content.length > 0 && content[content.length - 1].trim() === '') {
            content.pop();
        }

        console.log(content.join('\n'));
    } else {
        console.log('⚠️ No content found for version', version);
    }

} catch (error) {
    console.error('❌ Failed to extract changelog:', error.message);
    process.exit(1);
}