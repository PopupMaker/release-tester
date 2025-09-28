<?php
/**
 * Plugin bootstrap file.
 *
 * @package PopupMaker\ReleaseTester
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

// Check prerequisites before initializing.
if ( ! function_exists( 'popup_maker_release_tester_check_prerequisites' ) ) {
	/**
	 * Check plugin prerequisites.
	 *
	 * @return bool True if all prerequisites are met.
	 */
	function popup_maker_release_tester_check_prerequisites() {
		$config = popup_maker_release_tester_config();

		// Check PHP version.
		if ( version_compare( PHP_VERSION, $config['min_php_ver'], '<' ) ) {
			add_action( 'admin_notices', function() use ( $config ) {
				echo '<div class="notice notice-error"><p>';
				printf(
					esc_html__( '%1$s requires PHP %2$s or higher. You are running PHP %3$s.', 'popup-maker-release-tester' ),
					esc_html( $config['name'] ),
					esc_html( $config['min_php_ver'] ),
					esc_html( PHP_VERSION )
				);
				echo '</p></div>';
			});
			return false;
		}

		// Check WordPress version.
		global $wp_version;
		if ( version_compare( $wp_version, $config['min_wp_ver'], '<' ) ) {
			add_action( 'admin_notices', function() use ( $config ) {
				global $wp_version;
				echo '<div class="notice notice-error"><p>';
				printf(
					esc_html__( '%1$s requires WordPress %2$s or higher. You are running WordPress %3$s.', 'popup-maker-release-tester' ),
					esc_html( $config['name'] ),
					esc_html( $config['min_wp_ver'] ),
					esc_html( $wp_version )
				);
				echo '</p></div>';
			});
			return false;
		}

		// Check if Popup Maker core is active.
		if ( ! function_exists( 'popmake' ) ) {
			add_action( 'admin_notices', function() use ( $config ) {
				echo '<div class="notice notice-error"><p>';
				printf(
					esc_html__( '%1$s requires Popup Maker to be installed and activated.', 'popup-maker-release-tester' ),
					esc_html( $config['name'] )
				);
				echo '</p></div>';
			});
			return false;
		}

		return true;
	}
}

// Initialize plugin if prerequisites are met.
if ( popup_maker_release_tester_check_prerequisites() ) {
	/**
	 * Initialize the test plugin.
	 */
	function popup_maker_release_tester_init() {
		// Add admin notice indicating this is a test plugin.
		add_action( 'admin_notices', function() {
			echo '<div class="notice notice-warning is-dismissible">';
			echo '<p><strong>🧪 Popup Maker Release Tester:</strong> ';
			echo esc_html__( 'This is a test plugin for validating release workflows. Not for production use.', 'popup-maker-release-tester' );
			echo '</p></div>';
		});

		// Log initialization for testing purposes.
		if ( defined( 'WP_DEBUG_LOG' ) && WP_DEBUG_LOG ) {
			error_log( 'Popup Maker Release Tester initialized - Version: ' . popup_maker_release_tester_config()['version'] );
		}
	}

	add_action( 'plugins_loaded', 'popup_maker_release_tester_init' );
}