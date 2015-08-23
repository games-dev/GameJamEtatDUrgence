
define([], function()
{
  var Settings = {}

  Settings.DEFAULT_SPEED = 1
  Settings.DEFAULT_FRICTION = 0.98
  Settings.DEFAULT_FRICTION_COLLISION = 0.9

  Settings.MIN_SIZE = 10
  Settings.MAX_SIZE = 20
  Settings.SIZE_DEAD = 1
  Settings.SIZE_DELTA = 1

  Settings.SCROLL_SPEED = 0.0001

  Settings.DEFAULT_TARGET_SCALE = 0.1
  Settings.DEFAULT_AVOID_SCALE = 0.1
  Settings.DEFAULT_GLOBAL_SCALE = 0.0001
  Settings.DEFAULT_NEAR_SCALE = 0.0001
  Settings.DEFAULT_GRID_SCALE = 0.2

  Settings.LETTER_FONT_SCALE = 1.5
  Settings.BULL_OUTLINE = 2
  Settings.BULL_COLLISION_BIAS = 0.75

  return Settings
})
