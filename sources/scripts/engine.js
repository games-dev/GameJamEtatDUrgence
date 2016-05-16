
	var Engine = function ()
	{
		this.particleContainer;
		this.boidList;
		this.player;

		this.vectorNear;
		this.vectorAvoid;
		this.vectorGlobal;
		this.vectorTarget;
		this.vectorKeyboard;

		this.init = function ()
		{
			this.particleContainer = new PIXI.ParticleContainer(10000, { scale: true, position: true, rotation: true, uvs: true, alpha: true });
			this.boidList = [];

			this.vectorNear = Tool.vec2(0,0);
			this.vectorAvoid = Tool.vec2(0,0);
			this.vectorGlobal = Tool.vec2(0,0);
			this.vectorTarget = Tool.vec2(0,0);
			this.vectorKeyboard = Tool.vec2(0,0);

			for (var i = 0; i < 100; i++)
			{
				var boid = Boid.GetNewInstance();
				this.boidList.push(boid);
				this.particleContainer.addChild(boid);
			}

			this.player = Boid.GetNewInstance('Nini');
			this.player.isPlayer = true;
			this.player.anchor.y = 0.75
			this.player.position.set(Tool.GetCenter().x, Tool.GetCenter().y);

			this.boidList.push(this.player);
			this.particleContainer.addChild(this.player);
		}

		function depthCompare(a, b) {  
			if (Tool.distanceVec(a, a.target) > Tool.distanceVec(b, b.target))
				return -1;
			else
				return 1;
		}

		this.update = function ()
		{
			this.vectorKeyboard.x = this.vectorKeyboard.y = 0

			if (Keyboard.A.down || Keyboard.Q.down) {
				this.vectorKeyboard.x = 1
			} else if (Keyboard.D.down) {
				this.vectorKeyboard.x = -1
			}

			if (Keyboard.W.down || Keyboard.Z.down) {
				this.vectorKeyboard.y = 1
			} else if (Keyboard.S.down) {
				this.vectorKeyboard.y = -1
			}

			for (var current = 0; current < this.boidList.length; ++current)
			{
				var boid = this.boidList[current]

				if (boid.isPlayer) {
					continue;
				}

				this.vectorNear.x = this.vectorNear.y = 0
				this.vectorGlobal.x = this.vectorGlobal.y = 0
				this.vectorAvoid.x = this.vectorAvoid.y = 0
				this.vectorTarget.x = boid.target.x - boid.x
				this.vectorTarget.y = boid.target.y - boid.y
				// this.vectorTarget.x = Mouse.x - boid.x
				// this.vectorTarget.y = Mouse.y - boid.y

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
				this.vectorKeyboard.x *= boid.keyboardScale
				this.vectorKeyboard.y *= boid.keyboardScale

				// Apply to Boid
				boid.move(
					this.vectorTarget.x + this.vectorNear.x + this.vectorGlobal.x + this.vectorAvoid.x + this.vectorKeyboard.x,
					this.vectorTarget.y + this.vectorNear.y + this.vectorGlobal.y + this.vectorAvoid.y + this.vectorKeyboard.y)
			}

			this.particleContainer.children.sort(depthCompare);
		}
	}