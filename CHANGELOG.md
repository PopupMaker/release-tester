# Changelog

## Unreleased

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