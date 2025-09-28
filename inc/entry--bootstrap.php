<?php
/**
 * Plugin entry point bootstrap.
 *
 * @package PopupMaker\ReleaseTester
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

// Minimal entry point - just ensure config is available.
if ( ! function_exists( 'popup_maker_release_tester_config' ) ) {
	wp_die( 'Popup Maker Release Tester configuration function not found.' );
}