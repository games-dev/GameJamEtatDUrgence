
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
	stage.addChild(background);

	init();
}

function init () 
{
	timeStart = new Date() / 1000.0;
	timeElapsed = 0;

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