<?php
/**
 * Plugin Name:       Popup Maker Release Tester
 * Plugin URI:        https://github.com/PopupMaker/release-tester
 * Description:       🧪 Minimal test plugin for validating release workflows, EDD integration, and Slack notification systems. FOR TESTING ONLY.
 * Version: 1.0.34
 * Requires PHP:      7.4
 * Requires at least: 6.4
 * Requires Plugins:  popup-maker
 * Author:            Code Atlantic (Testing)
 * Author URI:        https://code-atlantic.com
 * License:           GPL2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       popup-maker-release-tester
 * Domain Path:       /languages/
 *
 * @package     PopupMaker\ReleaseTester
 * @author      Code Atlantic LLC
 * @copyright   Copyright (c) 2024, Code Atlantic LLC
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

/**
 * Define plugin's global configuration.
 *
 * @return array Plugin configuration
 * @since 1.0.0
 */
function popup_maker_release_tester_config() {
	static $config;

	if ( ! isset( $config ) ) {
		$config = [
			'name'          => 'Popup Maker Release Tester',
			'slug'          => 'popup-maker-release-tester',
			'version' => '1.1.0-beta.2',
			'option_prefix' => 'popup_maker_release_tester',
			// Test EDD Product ID (🧪 Popup Maker Release Tester).
			'edd_id'        => 483326,
			'text_domain'   => 'popup-maker-release-tester',
			'fullname'      => 'Popup Maker Release Tester',
			'min_php_ver'   => '7.4.0',
			'min_wp_ver'    => '6.4.0',
			'min_core_ver'  => '1.21.0',
			'file'          => __FILE__,
			'basename'      => plugin_basename( __FILE__ ),
			'path'          => plugin_dir_path( __FILE__ ),
			'url'           => plugin_dir_url( __FILE__ ),
		];
	}

	return $config;
}

// EDD Software Licensing integration.
define( 'PMRT_STORE_URL', 'https://wppopupmaker.com' );
define( 'PMRT_ITEM_ID', 483326 ); // Popup Maker Release Tester product ID.
define( 'PMRT_ITEM_NAME', 'Popup Maker Release Tester' );

// Load EDD Software Licensing updater.
if ( ! class_exists( 'EDD_SL_Plugin_Updater' ) ) {
	require_once __DIR__ . '/includes/EDD_SL_Plugin_Updater.php';
}

/**
 * Initialize EDD Software Licensing updater.
 *
 * @since 1.0.18
 */
function pmrt_plugin_updater() {
	// To support auto-updates, this needs to run during the wp_version_check cron job for privileged users.
	$doing_cron = defined( 'DOING_CRON' ) && DOING_CRON;
	if ( ! current_user_can( 'manage_options' ) && ! $doing_cron ) {
		return;
	}

	// Retrieve license key from the DB.
	$license_key = trim( get_option( 'pmrt_license_key' ) );

	// Setup the updater.
	new EDD_SL_Plugin_Updater(
		PMRT_STORE_URL,
		__FILE__,
		array(
			'version' => '1.0.34',
			'license' => $license_key,
			'item_id' => PMRT_ITEM_ID,
			'author'  => 'Code Atlantic',
			'beta'    => false,
		)
	);
}
add_action( 'init', 'pmrt_plugin_updater' );

/**
 * Plugin functions loader.
 */
require_once __DIR__ . '/inc/entry--bootstrap.php';

/**
 * Register autoloader, check prerequisites & initiate plugin.
 */
require_once __DIR__ . '/bootstrap.php';
// Load the encouragement system - because developers need love! 💚
require_once __DIR__ . '/includes/class-encouragement.php';
\PopupMaker\ReleaseTester\Encouragement::init();
