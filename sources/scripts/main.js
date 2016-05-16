
var renderer, engine, stage, background, width, height, timeStart, timeElapsed;

window.onload = function () 
{
	width = window.innerWidth;
	height = window.innerHeight;
	renderer = PIXI.autoDetectRenderer(width, height);
	document.body.appendChild(renderer.view);

	stage = new PIXI.Container();
	background = new PIXI.Graphics();
	background.beginFill(0x000000, 1);
	background.drawRect(0, 0, width, height);
	background.endFill();
	// background.beginFill(0xA4C94A, 1);
	// background.drawCircle(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 4);
	// background.endFill();
	stage.addChild(background);

	var assetToLoad = [ '../images/characters.png', '../images/characters.json' ]
	for (var i = 0; i < assetToLoad.length; ++i) { PIXI.loader.add(assetToLoad[i]) }
	PIXI.loader.once('complete', init).load();
}

function init () 
{
	timeStart = new Date() / 1000.0;
	timeElapsed = 0;

  stage.interactive = true
  stage.on('mousedown', Mouse.onClic).on('touchstart', Mouse.onClic)
  stage.on('mousemove', Mouse.onMove).on('touchmove', Mouse.onMove)
  document.addEventListener('keydown', Keyboard.onKeyDown)
  document.addEventListener('keyup', Keyboard.onKeyUp)

	engine = new Engine();
	engine.init();
	stage.addChild(engine.particleContainer);

	animate();
}

function animate () 
{
	timeElapsed = new Date() / 1000.0 - timeStart;

	engine.update();

	renderer.render(stage);
	requestAnimationFrame( animate );
}