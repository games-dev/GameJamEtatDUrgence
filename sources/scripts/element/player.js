
define(['lib/pixi', 'gui/phylactere', 'manager', 'settings', 'gui/letter', 'base/point'], function(PIXI, Phylactere, Manager, Settings, Letter, Point){
  var Player = function ()
  {
    Phylactere.call(this)


    this.Init = function ()
    {
      this.x = Manager.mouse.x
      this.y = Manager.mouse.y
      this.isPlayer = true
      this.SetDarkness(1)
      this.SetSize(40)
      // this.avoidScale = 0
      this.friction = 0.8
      this.targetScale = 1
      Manager.AddBoid(this)

      for (var i = 0; i < this.boidList.length; ++i)
      {
        this.boidList[i].SetDarkness(1)
      }
    }

    this.Absorb = function (collider, boid)
    {
    }

    this.Update = function ()
    {
			// Move to mouse
			this.target.x = Manager.mouse.x
			this.target.y = Manager.mouse.y

      //
      this.UpdateTargets()
    }

  }

  Player.prototype = Object.create(Phylactere.prototype)
  Player.prototype.constructor = Player

  return Player
})
