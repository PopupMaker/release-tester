# Changelog

## Unreleased

## v1.0.22 - 2025-10-07

### Changed
- **Google Drive Upload**: Updated google drive action to set permissions for the file and generate a direct link to the file.


## v1.1.0-beta.3 - 2025-10-04

### Added
- Google Drive upload integration for release packages
- Enhanced Slack notifications with changelog content and Google Drive download links
- Separate success/failure Slack notification jobs for better messaging
- Google Drive link sharing for team distribution

## v1.1.0-beta.2 - 2025-10-03

### Fixed
- Checkout repository before edd-release-sync action to enable changelog extraction


## v1.1.0-beta.1 - 2025-10-03

### Added
- Beta release workflow testing with `edd-release-sync@v0.2.0`
- Pre-release detection and EDD beta version validation
- Changelog extraction testing from CHANGELOG.md

### Changed
- Updated workflow to use new `edd-release-sync@v0.2.0` action
- Integrated `is_prerelease` and `changelog` parameters

## v1.0.21 - 2025-09-30

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


## [1.0.0] - 2024-01-01

### Added
- 🧪 Initial test plugin for validating release workflows
- ✅ EDD webhook integration testing
- 📢 Slack notification validation
- 🚀 GitHub Actions release workflow testing
- 📦 Minimal plugin structure for testing purposes

### Testing Features
- Release workflow validation across all plugin types
- EDD store integration and webhook delivery testing
- Slack notification formatting and delivery validation
- Package creation and GitHub release automation testing

---

**Note**: This is a test plugin for development workflow validation only. Not intended for production use.