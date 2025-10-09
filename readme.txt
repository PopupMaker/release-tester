=== Popup Maker Release Tester ===
Contributors: codeatlantic, danieliser
Tags: testing, development, releases
Requires at least: 6.4
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 1.0.36.5
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Simple test plugin for validating GitHub webhook integration with EDD Release Manager.

== Description ==

This plugin exists solely for testing the EDD Release Manager's webhook integration. It provides a minimal plugin that can be updated via GitHub releases to validate the automated release workflow.

**This is a development tool - not for production use.**

== Installation ==

1. Install via EDD Release Manager webhook automation
2. Plugin updates automatically when GitHub releases are published

== Changelog ==

= 1.0.36 =
🧪 Test release for workflow validation

= 1.1.0-beta.5 =
- Minor updates and improvements

= 1.0.35 =
🧪 Test release for workflow validation

= 1.0.34 =
🧪 Test release for workflow validation

= 1.0.33 =
🧪 Test release for workflow validation

= 1.0.32 =
🧪 Test release for workflow validation

= 1.0.31 =
🧪 Test release for workflow validation

= 1.0.30 =
🧪 Test release for workflow validation

= 1.0.29 =
🧪 Test release for workflow validation

= 1.0.28 =
🧪 Test release for workflow validation

= 1.0.27 =
🧪 Test release for workflow validation

= 1.0.26 =
🧪 Test release for workflow validation

= 1.0.22 =
### Changed
- **Google Drive Upload**: Updated google drive action to set permissions for the file and generate a direct link to the file.

= 1.0.21 =
### Added
- 📝 Complete release management script system
- 🔧 `bin/update-changelog.js` - Automatically moves unreleased changes to versioned sections
- 🔢 `bin/update-versions.js` - Updates version numbers across all plugin files
- 🚀 `bin/prepare-release.js` - Orchestrates complete release preparation workflow

### Changed
- 🔄 Made GitHub Action fully reusable and generic
- 🆔 Use `EDD_PRODUCT_ID` secret instead of hardcoded value
- 📦 Auto-detect plugin slug/file from repository name
- 🧪 Remove test-specific hardcoding for production use

### Improved
- Workflow can be copied to any WordPress plugin repository
- Requires only 3 secrets: `EDD_WEBHOOK_URL`, `EDD_WEBHOOK_TOKEN`, `EDD_PRODUCT_ID`
- Auto-generates readme URL from `release_url` (no explicit parameter needed)
- CHANGELOG.md changes automatically sync to readme.txt on release

= 1.0.17 =
* Final verification test of complete asset_api_url workflow
* Confirms Git Updater dropdown selection persistence
* Prepares for EDD Software Licensing SDK integration

= 1.0.16 =
* End-to-end validation with EDD Release Manager v1.0.11
* Tests complete asset_api_url and download_url workflow
* Verifies Git Updater Asset File dropdown selection with API URL

= 1.0.15 =
* Complete fix for Git Updater Asset File dropdown selection
* Webhook now receives both asset_api_url (for dropdown) and download_url (for file download)
* GitHub Actions workflow fetches GitHub API asset URL via gh api command
* EDD Release Manager stores correct API URL in git_file_asset field

= 1.0.14 =
* Test release for EDD Release Manager v1.0.8
* Fixes Asset File dropdown to use GitHub API URL instead of filename
* Validates workflow ZIP exclusion to prevent nested release artifacts
* Tests complete end-to-end integration with Git Updater UI

= 1.0.13 =
* Test release for EDD Release Manager v1.0.7
* Validates Asset File dropdown fix (git_file_asset now uses filename instead of URL)
* Ensures Git Updater UI correctly selects release asset instead of "Release Source Code"

= 1.0.9 =
* Test release validating full EDD Release Manager workflow
* Verifies changelog extraction from readme.txt
* Validates GitHub raw URL generation for private repos
* Tests EDD Git Download Updater integration

= 1.0.8 =
* Fixed workflow release_url output construction
* Added EDD_PRODUCT_ID validation and graceful failure

= 1.0.7 =
* Made GitHub Action workflow completely generic and reusable
* Removed all test-specific language and hardcoded values
* Auto-generates changelog from CHANGELOG.md

= 1.0.4 =
* Test release for EDD Release Manager v1.0.4 validation

= 1.0.3 =
* Test release for git download integration

= 1.0.2 =
* Initial test version

= 1.0.1 =
* Initial release

== Upgrade Notice ==

= 1.0.13 =
Testing EDD Release Manager v1.0.7 - fixes Asset File dropdown selection in Git Updater UI.

= 1.0.9 =
Full workflow validation release! Tests complete integration between GitHub Actions, EDD Release Manager, and Git Download Updater with private repository support.

= 1.0.8 =
Critical workflow fixes for release URL generation and product ID validation.

= 1.0.7 =
Workflow improvements making it fully generic and reusable across all WordPress plugin repositories.
= 1.0.18 =
* 🎉 Added EDD Software Licensing SDK integration
* Full license activation and automatic update support
* Tests complete GitHub → EDD → Customer update workflow
* Ready for production license verification

= 1.0.19 =
* Removed old ZIP files from repository
* Clean release package without nested artifacts

= 1.0.20 =
* 💚 Added Developer Encouragement System - Random positive messages in admin!
* Because developers need love too
* Spreads positivity one admin notice at a time
* 15 different encouraging messages
