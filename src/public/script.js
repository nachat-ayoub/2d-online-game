const PLAYERS_COLORS = [
	"#11bf2b", // green
	"#114bbf", // blue
	"#5f11bf", // purple
	"#bf1d11", // red
	"#b9bf11", // yellow
];

const PLAYERS_MOVES = {
	left: "ArrowLeft", // Move left
	right: "ArrowRight", // Move right
	jump: "ArrowUp", // Jump
	shoot: "Space", // Shoot weapon/projectile

	// TODO: Features
	// down: "ArrowDown", // Crouch or move down through platforms
	// reload: "KeyR", // Reload weapon
	// interact: "KeyE", // Interact with objects (e.g., doors, pickups)
	// special: "KeyF", // Special ability (e.g., dash, shield, etc.)
	// pause: "Escape", // Pause or bring up the menu
};

/**
 * Generates a random integer between the specified minimum and maximum values, inclusive.
 * @param {number} min - The minimum value (inclusive).
 * @param {number} max - The maximum value (inclusive).
 * @returns {number} A random integer between `min` and `max`.
 */
function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Player {
	/**
	 * Creates an instance of the Player.
	 * @param {Game} game - The game instance.
	 */
	constructor(game) {
		this.game = game;
		this.width = 30;
		this.height = 50;
		this.x = 10;
		this.y = 0; // this.game.height - this.height;
		this.colorInd = randInt(0, PLAYERS_COLORS.length - 1);
		this.color = PLAYERS_COLORS[this.colorInd];
		this.speedY = 0;
		this.speedX = 0;
		this.activeKeys = new Set();
	}

	isGrounded() {
		// TODO: check for platforms if collision exists
		return !(this.y < this.game.height - this.height);
	}

	moveRight() {
		this.speedX = 2.5;
	}
	moveLeft() {
		this.speedX = -2.5;
	}
	jump() {
		if (this.isGrounded()) this.speedY = -6;
	}

	draw() {
		this.game.ctx.fillStyle = this.color;
		this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
	}

	update() {
		if (this.activeKeys.has(PLAYERS_MOVES.left)) {
			// console.log("move Left");
			this.moveLeft();
		}
		if (this.activeKeys.has(PLAYERS_MOVES.right)) {
			// console.log("move Right");
			this.moveRight();
		}

		if (
			!this.activeKeys.has(PLAYERS_MOVES.left) &&
			!this.activeKeys.has(PLAYERS_MOVES.right)
		) {
			// Gradually reduce speedX for smoother stop
			if (this.speedX !== 0) {
				// Apply deceleration based on direction
				const deceleration = 0.25; // Deceleration factor (adjust to your liking)

				// Smooth stop: reduce speed slowly
				if (Math.abs(this.speedX) <= deceleration) {
					this.speedX = 0; // Stop movement when speed is close to zero
				} else {
					this.speedX -= this.speedX > 0 ? deceleration : -deceleration;
				}
			}
		}

		if (this.activeKeys.has(PLAYERS_MOVES.jump)) {
			// console.log("move Jump");
			this.jump();
		}

		this.x += this.speedX;
		this.y += this.speedY;
		if (!this.isGrounded()) this.speedY += this.game.gravity;
		else {
			this.speedY = 0;
			if (this.y > this.game.height - this.height)
				this.y = this.game.height - this.height;
		}

		// console.log({
		// 	playerY: this.y,
		// 	expected: this.game.height - this.height,
		// });
	}
}

class Game {
	/**
	 * Creates an instance of the Game.
	 * @param {HTMLCanvasElement} canvas - The canvas element where the game will be rendered.
	 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context for the canvas.
	 */
	constructor(canvas, ctx) {
		this.canvas = canvas;
		this.ctx = ctx;
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.gravity = 0.25;
		/** @type {Player[]} - An array to store all players in the game. */
		this.players = [new Player(this)];

		this.canvas.tabIndex = 0;
		this.canvas.focus();

		// Handle player movement
		this.canvas.addEventListener("keydown", (e) => {
			// console.log("Key down:", e.key);
			this.players[0].activeKeys.add(e.key);
		});
		this.canvas.addEventListener("keyup", (e) => {
			// console.log("Key up:", e.key);
			this.players[0].activeKeys.delete(e.key);
		});
	}

	render() {
		this.ctx.fillStyle = "#f0756c";
		this.ctx.fillRect(0, 0, this.width, this.height);
		this.players.forEach((player) => {
			player.update();
			player.draw();
		});
	}
}

window.addEventListener("load", () => {
	/** @type {HTMLCanvasElement | null} */
	const canvas = document.querySelector("#canvas");

	const ctx = canvas.getContext("2d");
	canvas.width = 720;
	canvas.height = 405;
	const game = new Game(canvas, ctx);

	// game loop
	function animate() {
		game.render();
		requestAnimationFrame(animate);
	}

	animate();
});
