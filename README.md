# 🧪 Popup Maker Release Tester

**Minimal test plugin for validating Popup Maker release workflows, EDD integration, and Slack notification systems.**

⚠️ **FOR TESTING ONLY** - This plugin is designed exclusively for development workflow validation.

## Purpose

This test plugin validates the complete release automation pipeline:

- ✅ **GitHub Actions Workflows** - Package creation, releases, artifact management
- 🔗 **EDD Webhook Integration** - Store updates, product synchronization
- 📢 **Slack Notifications** - Release announcements, status updates
- 📦 **Package Distribution** - ZIP creation, download links, checksums

## Test Product Details

- **EDD Product ID**: `483326`
- **Product Name**: 🧪 Popup Maker Release Tester
- **Price**: $0.00 (Free for testing)
- **Type**: Software with licensing
- **Status**: Test product only

## Installation

1. Download the latest release from [GitHub Releases](https://github.com/PopupMaker/release-tester/releases)
2. Upload to WordPress via Plugins → Add New → Upload Plugin
3. Activate the plugin
4. Admin notice will confirm test mode activation

## Validation Features

### Release Workflow Testing
- Package creation with proper structure
- GitHub release creation with formatted descriptions
- Artifact upload and checksum validation
- Release notes extraction and formatting

### EDD Integration Testing
- Webhook payload delivery and validation
- Product update synchronization
- Download link management
- Test mode indicators in webhook data

### Slack Notification Testing
- Formatted release announcements
- Success/failure status indicators
- Test release identification (🧪 prefix)
- Proper channel delivery

## Usage

### Creating Test Releases

1. Tag a new version: `git tag v1.0.1`
2. Push the tag: `git push origin v1.0.1`
3. GitHub Actions automatically triggers release workflow
4. Monitor workflow execution in Actions tab
5. Verify EDD webhook delivery in store logs
6. Check Slack for release notification

### Validation Checklist

- [ ] GitHub workflow completes successfully
- [ ] Release package created with correct structure
- [ ] GitHub release published with test indicators
- [ ] EDD webhook delivers with test markers
- [ ] Slack notification received with 🧪 prefix
- [ ] Test product updated in EDD store
- [ ] Download links functional

## Development

### Requirements
- PHP >= 7.4
- WordPress >= 6.4
- Popup Maker >= 1.21.0

### File Structure
```
popup-maker-release-tester/
├── popup-maker-release-tester.php    # Main plugin file
├── bootstrap.php                      # Initialization
├── inc/entry--bootstrap.php           # Entry point
├── .github/workflows/release.yml      # Release automation
├── package.json                       # NPM configuration
├── CHANGELOG.md                       # Version history
└── README.md                          # This file
```

### Configuration

The plugin automatically:
- Shows admin notice confirming test mode
- Logs initialization events (when WP_DEBUG_LOG enabled)
- Validates prerequisites (PHP, WordPress, Popup Maker)
- Provides minimal functionality for testing

## Testing Scenarios

### Successful Release Flow
1. All workflow steps complete ✅
2. Package created and uploaded ✅
3. EDD webhook delivers successfully ✅
4. Slack notification sent with success indicators ✅

### Failure Scenarios
1. Build failure - workflow stops, Slack notified ❌
2. EDD webhook failure - marked in Slack status ❌
3. Slack delivery failure - logged in workflow ❌

## Contributing

This is a testing tool for the Popup Maker development team.

### Making Changes
1. Fork the repository
2. Create feature branch: `git checkout -b test-feature`
3. Make minimal changes needed for testing
4. Commit with descriptive messages
5. Push and create pull request

### Testing Updates
1. Update version in main plugin file
2. Add entry to CHANGELOG.md
3. Create new tag to trigger release
4. Validate all systems work correctly

## Security

This plugin:
- ✅ Contains no sensitive data or credentials
- ✅ Uses WordPress security best practices
- ✅ Validates all user inputs
- ✅ Requires proper WordPress capabilities
- ✅ Follows defensive coding patterns

## Support

For issues with this test plugin:
1. Check GitHub Actions logs for workflow failures
2. Verify EDD webhook configuration in store settings
3. Confirm Slack webhook URL is correctly configured
4. Review test product status in EDD dashboard

## License

GPL v2 or later - Same as WordPress

---

**🧪 Test Release System - Code Atlantic Development Team**