<?php
/**
 * Developer Encouragement System
 *
 * Because developers need love too! 💚
 *
 * @package PopupMaker\ReleaseTester
 * @since   1.0.20
 */

namespace PopupMaker\ReleaseTester;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

/**
 * Encouragement class - Spreads positivity to developers!
 */
class Encouragement {

	/**
	 * Initialize the encouragement system.
	 */
	public static function init() {
		add_action( 'admin_notices', array( __CLASS__, 'show_encouragement' ) );
	}

	/**
	 * Show random encouragement message.
	 */
	public static function show_encouragement() {
		// Only show occasionally (10% chance).
		if ( wp_rand( 1, 10 ) !== 1 ) {
			return;
		}

		$messages = array(
			'🚀 Your code is looking amazing today!',
			'💪 Keep crushing those bugs!',
			'⚡ You\'re shipping features like a boss!',
			'🎯 That last commit? *Chef\'s kiss*',
			'🔥 Your git history is a work of art!',
			'✨ The code gods smile upon you today!',
			'🎉 Another day, another epic deploy!',
			'💻 Console.log()? More like console.LEGENDARY()!',
			'🦄 Your code is so clean it sparkles!',
			'🎸 Rock on, code warrior!',
			'☕ Remember: Coffee in, bugs out!',
			'🧙 You\'re basically a code wizard!',
			'🌟 Production has never looked better!',
			'🎮 Achievement Unlocked: Awesome Developer',
			'🏆 MVP of the dev team right here!',
		);

		$message = $messages[ array_rand( $messages ) ];
		?>
		<div class="notice notice-success is-dismissible">
			<p><strong>Release Tester Says:</strong> <?php echo esc_html( $message ); ?></p>
		</div>
		<?php
	}
}
