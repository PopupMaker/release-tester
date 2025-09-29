# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Popup Maker Release Tester** - a minimal WordPress test plugin designed exclusively for validating release workflows, EDD integration, and Slack notification systems. This is NOT a production plugin.

### Purpose
- ✅ Validate GitHub Actions release workflows
- 🔗 Test EDD webhook integration with store
- 📢 Verify Slack notification delivery
- 📦 Confirm package creation and distribution
- 🧪 Provide isolated testing environment for release automation

## Development Commands

### Release Testing
Since this is a test plugin with no build process, testing focuses on release workflow validation:

```bash
# Create a test release (triggers GitHub Actions)
git tag v1.0.1
git push origin v1.0.1

# Monitor workflow in GitHub Actions tab
# Check EDD webhook delivery in store logs
# Verify Slack notification receipt
```

### No Build Process
This test plugin intentionally has no build process:
- `npm run build` - Returns message (no build needed)
- `npm run build:production` - Returns message (no build needed)

## Architecture Overview

### Plugin Structure
```
popup-maker-release-tester/
├── popup-maker-release-tester.php    # Main plugin file with config
├── bootstrap.php                      # Prerequisites check & initialization
├── inc/entry--bootstrap.php           # Minimal entry point validation
├── .github/workflows/release.yml      # Complete release automation workflow
├── package.json                       # NPM config (no actual scripts)
└── CHANGELOG.md                       # Version history for testing
```

### Key Configuration Values
- **EDD Product ID**: `483326` (🧪 Popup Maker Release Tester)
- **Text Domain**: `popup-maker-release-tester`
- **Min PHP**: 7.4.0
- **Min WordPress**: 6.4.0
- **Min Popup Maker**: 1.21.0
- **Price**: $0.00 (Free test product)

### Prerequisites System
The plugin implements defensive prerequisite checking:
1. PHP version validation (7.4+)
2. WordPress version validation (6.4+)
3. Popup Maker core dependency check
4. Graceful error handling with admin notices

## Release Workflow Testing

### GitHub Actions Workflow
The `.github/workflows/release.yml` provides comprehensive testing:

**Jobs Structure:**
1. **Build** - Creates test package with proper exclusions
2. **GitHub Release** - Publishes pre-release with test markers
3. **EDD Webhook** - Sends test webhook with `test_mode: true`
4. **Slack Notification** - Delivers test notification with 🧪 prefix
5. **Summary** - Generates test results summary

### Test Release Process
1. **Tag Creation**: `git tag v1.0.x && git push origin v1.0.x`
2. **Automatic Workflow**: GitHub Actions triggers on tag push
3. **Package Creation**: ZIP with development files excluded
4. **Release Publishing**: Pre-release with test indicators
5. **Integration Testing**: EDD webhook + Slack notification
6. **Validation**: Manual checklist verification

### Validation Checklist
- [ ] GitHub workflow completes successfully
- [ ] Release package created with correct structure
- [ ] GitHub release published with 🧪 test indicators
- [ ] EDD webhook delivers with `test_mode: true`
- [ ] Slack notification received with test prefix
- [ ] Test product updated in EDD store
- [ ] Download links functional

## Integration Details

### EDD Webhook Payload
Test webhook includes special markers:
```json
{
  "plugin": "popup-maker-release-tester",
  "version": "1.0.x",
  "test_mode": true,
  "test_timestamp": "2024-01-01T12:00:00Z"
}
```

### Slack Notifications
Test notifications include:
- 🧪 prefix in title
- Test release identification
- Status indicators for each workflow step
- #testing hashtags

## WordPress Integration

### Admin Notices
The plugin shows a dismissible warning notice:
```
🧪 Popup Maker Release Tester: This is a test plugin for validating release workflows. Not for production use.
```

### Debug Logging
When `WP_DEBUG_LOG` is enabled, initialization is logged:
```
Popup Maker Release Tester initialized - Version: 1.0.x
```

## Security Considerations

- ✅ No sensitive data or credentials stored
- ✅ WordPress security best practices followed
- ✅ Input validation on all admin interactions
- ✅ Proper capability checks for admin functions
- ✅ Safe defensive coding patterns

## Common Testing Scenarios

### Successful Release Flow
All workflow steps complete → Package uploaded → EDD webhook delivered → Slack notification sent with success indicators

### Failure Testing
- Build failures stop workflow with Slack notification
- EDD webhook failures marked in Slack status
- Slack delivery failures logged in workflow

## Important Notes

- This plugin is **ONLY for testing** - never use in production
- EDD Product ID `483326` is specifically configured for testing
- All releases are marked as pre-releases with test indicators
- Test mode flags prevent confusion with real product releases
- Workflow secrets (EDD_WEBHOOK_URL, SLACK_WEBHOOK_URL) required for full testing