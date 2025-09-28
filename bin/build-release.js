#!/usr/bin/env node

/**
 * Simple release builder for test plugin
 *
 * Creates a clean ZIP package for distribution
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);
const zipNameIndex = args.indexOf('--zip-name');
const zipName = zipNameIndex !== -1 && args[zipNameIndex + 1] ? args[zipNameIndex + 1] : 'popup-maker-release-tester.zip';

console.log('🧪 Building test plugin release package...');
console.log(`📦 Package name: ${zipName}`);

try {
    // Files to include in the release
    const includeFiles = [
        'popup-maker-release-tester.php',
        'bootstrap.php',
        'inc/entry--bootstrap.php',
        'package.json',
        'README.md',
        'CHANGELOG.md'
    ];

    // Create ZIP with specific files
    const fileList = includeFiles.join(' ');
    execSync(`zip -r "${zipName}" ${fileList}`, { stdio: 'inherit' });

    console.log('✅ Test plugin package created successfully!');

    // Verify the package
    if (fs.existsSync(zipName)) {
        const stats = fs.statSync(zipName);
        console.log(`📊 Package size: ${(stats.size / 1024).toFixed(2)} KB`);
    }

} catch (error) {
    console.error('❌ Failed to create test plugin package:', error.message);
    process.exit(1);
}