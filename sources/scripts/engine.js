
	var Engine = function ()
	{
		this.particleContainer;
		this.boidList;

		this.vectorNear;
		this.vectorAvoid;
		this.vectorGlobal;
		this.vectorTarget;

		this.init = function ()
		{
			this.particleContainer = new PIXI.ParticleContainer(10000, { scale: true, position: true, rotation: true, uvs: true, alpha: true });
			this.boidList = [];

			this.vectorNear = Tool.vec2(0,0);
			this.vectorAvoid = Tool.vec2(0,0);
			this.vectorGlobal = Tool.vec2(0,0);
			this.vectorTarget = Tool.vec2(0,0);


			for (var i = 0; i < 50; i++)
			{
				var boid = PIXI.Sprite.fromImage('../images/toto.png');
				var seed = Math.random();

				boid.anchor.set(0.5, 1)
				boid.scale.set(0.25 + 0.25 * seed)
				boid.size = (0.5 + 0.5 * seed) * 96
				boid.target = Tool.vec2(window.innerWidth / 2, window.innerHeight / 2)

				var velocityAngle = Math.random() * Math.PI * 2
				boid.velocity = Tool.vec2(Math.cos(velocityAngle), Math.sin(velocityAngle))

				boid.speed = Settings.DEFAULT_SPEED
				boid.friction = Settings.DEFAULT_FRICTION + Math.random() * 0.05
				boid.frictionCollision = Settings.DEFAULT_FRICTION_COLLISION

				boid.targetScale = Settings.DEFAULT_TARGET_SCALE + Math.random() * 0.1
				boid.avoidScale = Settings.DEFAULT_AVOID_SCALE + Math.random() * 1
				boid.nearScale = Settings.DEFAULT_NEAR_SCALE
				boid.globalScale = Settings.DEFAULT_GLOBAL_SCALE

				boid.index = i;

				var self = boid;

				boid.move = function(moveX, moveY)
				{
					this.velocity.x += moveX
					this.velocity.y += moveY

					this.x += this.velocity.x * this.speed / Math.max(1, this.size)
					this.y += this.velocity.y * this.speed / Math.max(1, this.size)

					this.velocity.x *= this.friction
					this.velocity.y *= this.friction
				}

				boid.rumble = function ()
				{
					var randomAngle = Math.random() * Math.PI * 2
					this.velocity.x += Math.cos(randomAngle)
					this.velocity.y += Math.sin(randomAngle)
				}

				this.boidList.push(boid);
				this.particleContainer.addChild(boid);
			}
		}

		function depthCompare(a, b) {  
			if (a.y < b.y)
				return -1;
			if (a.y > b.y)
				return 1;
			return 0;
		}

		this.update = function ()
		{
			for (var current = 0; current < this.boidList.length; ++current)
			{
				var boid = this.boidList[current]

				this.vectorNear.x = this.vectorNear.y = 0
				this.vectorGlobal.x = this.vectorGlobal.y = 0
				this.vectorAvoid.x = this.vectorAvoid.y = 0
				this.vectorTarget.x = boid.target.x - boid.x
				this.vectorTarget.y = boid.target.y - boid.y

				var globalCount = 0
				var nearCount = 0
				for (var other = 0; other < this.boidList.length; ++other) {
					if (current != other) {
						var boidOther = this.boidList[other]

						// Avoid
						var distance = Tool.distance(boid.x, boid.y, boidOther.x, boidOther.y)
						var dist = distance - (boid.size + boidOther.size)
						if (dist < Settings.COLLISION_BIAS)
						{
							var avoidX = boid.x - boidOther.x
							var avoidY = boid.y - boidOther.y
							var angle = Math.atan2(avoidY, avoidX)
							this.vectorAvoid.x += Math.cos(angle) * Math.max(distance, boid.size + boidOther.size)
							this.vectorAvoid.y += Math.sin(angle) * Math.max(distance, boid.size + boidOther.size)
						}
						// Follow Near
						if (dist < 30)
						{
							this.vectorNear.x += boidOther.velocity.x
							this.vectorNear.y += boidOther.velocity.y
							++nearCount
						}
						// Follow Global
						this.vectorGlobal.x += boidOther.x
						this.vectorGlobal.y += boidOther.y
						++globalCount
					}
				}

				if (globalCount != 0) {
					this.vectorGlobal.x = (this.vectorGlobal.x / globalCount - boid.x) * boid.globalScale
					this.vectorGlobal.y = (this.vectorGlobal.y / globalCount - boid.y) * boid.globalScale
				}

				if (nearCount != 0) {
					this.vectorNear.x = (this.vectorNear.x / nearCount - boid.x) * boid.nearScale
					this.vectorNear.y = (this.vectorNear.y / nearCount - boid.y) * boid.nearScale
				}

				// Scale them
				this.vectorAvoid.x *= boid.avoidScale
				this.vectorAvoid.y *= boid.avoidScale
				this.vectorTarget.x *= boid.targetScale
				this.vectorTarget.y *= boid.targetScale

				// Apply to Boid
				boid.move(
					this.vectorTarget.x + this.vectorNear.x + this.vectorGlobal.x + this.vectorAvoid.x,
					this.vectorTarget.y + this.vectorNear.y + this.vectorGlobal.y + this.vectorAvoid.y)
			}

			this.particleContainer.children.sort(depthCompare);
		}
	}