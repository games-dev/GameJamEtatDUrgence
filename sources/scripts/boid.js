

var Boid = {}

Boid.GetNewInstance = function (name) {

	var boid = PIXI.Sprite.fromFrame(name || Settings.GetRandomCharacter());
	var seed = Math.random();

	boid.isPlayer = false;

	boid.position.set(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
	boid.anchor.set(0.5, 1)
	boid.scale.set(0.4 + 0.1 * seed)
	boid.initialScale = boid.scale.x
	boid.size = (0.5 + 0.5 * seed) * 32
	boid.target = Tool.vec2(window.innerWidth / 2, window.innerHeight / 2)
	// boid.target = Tool.vec2(Math.random() * window.innerWidth, Math.random() * window.innerHeight)

	var velocityAngle = Math.random() * Math.PI * 2
	boid.velocity = Tool.vec2(Math.cos(velocityAngle), Math.sin(velocityAngle))

	boid.speed = Settings.DEFAULT_SPEED
	boid.friction = Settings.DEFAULT_FRICTION// + Math.random() * 0.05
	boid.frictionCollision = Settings.DEFAULT_FRICTION_COLLISION

	boid.targetScale = Settings.DEFAULT_TARGET_SCALE// + Math.random() * 0.1
	boid.avoidScale = Settings.DEFAULT_AVOID_SCALE// + Math.random() * 1
	boid.nearScale = Settings.DEFAULT_NEAR_SCALE
	boid.globalScale = Settings.DEFAULT_GLOBAL_SCALE
	boid.keyboardScale = Settings.DEFAULT_KEYBOARD_SCALE

	boid.speedWithSize = boid.speed / Math.max(1, boid.size);

	boid.move = function(moveX, moveY)
	{
		this.velocity.x += moveX
		this.velocity.y += moveY

		var dist = 0.004 * Tool.distanceVec(this, this.target);

		this.x += this.velocity.x * boid.speedWithSize / (1 + dist)
		this.y += this.velocity.y * boid.speedWithSize / (1 + dist)

		this.velocity.x *= this.friction
		this.velocity.y *= this.friction

		this.scale.set(Math.max(0.1, this.initialScale - dist * 0.1));

		// if ((this.velocity.x * boid.speedWithSize > 5 && this.scale.x > 1)  || (this.velocity.x * boid.speedWithSize < -5 && this.scale.x < 1)) {
			// this.scale.x *= -1;
		// }
		// if (this.velocity.x * boid.speedWithSize < -1) {
		// 	this.scale.x = this.initialScale;
		// } else if (this.velocity.x * boid.speedWithSize > 1) {
		// 	this.scale.x = -this.initialScale;
		// }

		this.rotation = Math.atan2(this.target.y - this.y, this.target.x - this.x) - Tool.PIHalf;
	}

	boid.rumble = function ()
	{
		var randomAngle = Math.random() * Math.PI * 2
		this.velocity.x += Math.cos(randomAngle)
		this.velocity.y += Math.sin(randomAngle)
	}

	return boid;
}