var initTime 		= window.performance.now(),
	movedObject 	= false,
	Scene 			= new SceneManager(),
	Creator 		= new objectCreator(),
	Input 			= new InputManager(),
	selectedObjects = new ObjectsManager(),
	Menu 			= new MenuManager(),
	actContextMenu 	= false,
	Logger 			= new LogManager(),
	Listeners		= new ListenersManager(),
	canvas, context;

$.getJSON("js/json/menu.json", function(data){
	Menu.init(data);
	draw();
});

$.getJSON("js/json/context.json", data => ContextMenuManager.items = data);


$(function(){
	/**
	 * DOLEZITE!!!
	 */
	Scene.createLayer("default");
	Scene.createLayer("rightMenu");
	Scene.createLayer("test2");
	console.log("stranka sa nacítala za: ", (window.performance.now() - initTime) + " ms");
	canvas = document.getElementById("myCanvas");
	initCanvasSize();
	Entity._ides = [];

	context = canvas.getContext("2d");

	context.shadowColor = DEFAULT_SHADOW_COLOR;
	Input.initListeners(canvas);

	/**
	 * OSTATNE
	 */
	Scene.addToScene(new LayersViewer(), "rightMenu");
/*
 Scene.addToScene(new Rect(new GVector2f(800, 50), new GVector2f(100, 100), "#ff0000"));

	Scene.addToScene(new Line([new GVector2f(10, 400), new GVector2f(300, 450)], 5, "#66CCCC"));

	Scene.addToScene(new Arc(new GVector2f(600, 300), new GVector2f(50, 50), "#66CCCC"));

	Scene.addToScene(new Rect(new GVector2f(800, 50), new GVector2f(100, 100), "#ff0000"));
	Scene.addToScene(new Rect(new GVector2f(250, 250), new GVector2f(100, 100), "#00ff00"));

	Scene.addToScene(new Polygon([new GVector2f(1200, 100), new GVector2f(1150, 150), new GVector2f(1250, 150)], "#ff69b4"));
 Scene.addToScene(new Table(new GVector2f(800, 250), new GVector2f(200, 800), [["meno", "vek"], ["gabo", 21], ["maros", 35]]), "test2");


	var methods = {
		getArea: {
			name: "getArea",
			retType: "number",
			access: PUBLIC_ACCESS,
			args: "void"
		},
		getPosition:{
			name: "getPosition",
			retType: "GVector2f",
			access: PROTECTED_ACCESS,
			args: "void"
		}
	};

	var attrs = {
		x : {
			name: "x",
			access: PROTECTED_ACCESS,
			type: "number"
		},
		y : {
			name: "y",
			access: PROTECTED_ACCESS,
			type: "number"
		},
		width : {
			name: "width",
			access: PROTECTED_ACCESS,
			type: "number"
		},
		height : {
			name: "height",
			access: PROTECTED_ACCESS,
			type: "number"
		}
	};


	Scene.addToScene(new Class(new GVector2f(500, 150), new GVector2f(250, 250), "Rectange", attrs, methods));

*/
	draw();
});


function draw(){
	//var startDraw = window.performance.now();
	drawMousePos = new Date().getMilliseconds();
	resetCanvas();

	drawGrid(0.1, 10, 50);

	Scene.draw();
	Menu.draw();
	Creator.draw();
	if(actContextMenu)
		actContextMenu.draw();

	//console.log("nakreslilo sa za: ", (window.performance.now() - startDraw));
}