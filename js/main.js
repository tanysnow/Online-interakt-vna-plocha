/*
	compatible:	indexOf, canvas, canvasText, JSON parsing 14.9.2016
*/
var initTime 		= window["performance"].now(),
	movedObject 	= false,
	Scene 			= new SceneManager(),
	Creator 		= new objectCreator(),
	Input 			= new InputManager(),
	selectedObjects = new ObjectsManager(),
	Menu 			= new MenuManager(),
	actContextMenu 	= false,
	Logger 			= new LogManager(),
	Listeners		= new ListenersManager(),
	//EventHistory 	= new EventSaver(),
	Content			= new ContentManager(),
	FPS				= 60,
	Files			= new FileManager(),
	Project			= new ProjectManager("Gabriel Csollei"),
	Paints			= new PaintManager(),
	Task 			= null,
	Events 			= typeof EventManager !== KEYWORD_UNDEFINED ? new EventManager() : null,
	SelectedText	= null,
	Gui 			= new GuiManager(),
	Options 		= new OptionsManager(),
	drawEvent 		= new EventTimer(realDraw, 1000 / 60),
	Panel			= null,
	draw 			= () => drawEvent.callIfCan(),
	components, drawMousePos, Layers, canvas, context, chatViewer, timeLine;

function setUpComponents(){
	components =  {
		draw : window.location.hash.indexOf(COMPONENT_DRAW) >= 0 || typeof Watcher !== "undefined",
		share : window.location.hash.indexOf(COMPONENT_SHARE) >= 0 || typeof Watcher !== "undefined",
		watch : window.location.hash.indexOf(COMPONENT_WATCH) >= 0 || typeof Watcher !== "undefined",
		tools : window.location.hash.indexOf(COMPONENT_TOOLS) >= 0 || typeof Watcher !== "undefined",
		save : window.location.hash.indexOf(COMPONENT_SAVE) >= 0 || typeof Watcher !== "undefined",
		load : window.location.hash.indexOf(COMPONENT_LOAD) >= 0 || typeof Watcher !== "undefined",
		screen : window.location.hash.indexOf(COMPONENT_SCREEN) >= 0 || typeof Watcher !== "undefined",
		content : window.location.hash.indexOf(COMPONENT_CONTENT) >= 0 || typeof Watcher !== "undefined",
		edit : window.location.hash.indexOf(COMPONENT_EDIT) >= 0 || typeof Watcher !== "undefined",
		layers : window.location.hash.indexOf(COMPONENT_LAYERS) >= 0 || typeof Watcher !== "undefined",
		task : window.location.hash.indexOf(COMPONENT_TASK) >= 0 || typeof Watcher !== "undefined"
	}
}

var Components = {
	draw	: () => isDefined(components) && isDefined(components["draw"]) && components["draw"] === true,
	share	: () => isDefined(components) && isDefined(components["share"]) && components["share"] === true,
	watch	: () => isDefined(components) && isDefined(components["watch"]) && components["watch"] === true,
	tools	: () => isDefined(components) && isDefined(components["tools"]) && components["tools"] === true,
	save	: () => isDefined(components) && isDefined(components["save"]) && components["save"] === true,
	load	: () => isDefined(components) && isDefined(components["load"]) && components["load"] === true,
	screen	: () => isDefined(components) && isDefined(components["screen"]) && components["screen"] === true,
	content	: () => isDefined(components) && isDefined(components["content"]) && components["content"] === true,
	layers	: () => isDefined(components) && isDefined(components["layers"]) && components["layers"] === true,
	task	: () => isDefined(components) && isDefined(components["task"]) && components["task"] === true,
	edit	: () => isDefined(components) && isDefined(components["edit"]) && components["edit"] === true
};

function sendMessage(message){
	if(typeof Watcher !== "undefined")
		Watcher.sendMessage(message, Project.autor);

	if(typeof Sharer !== "undefined" && Sharer.isSharing)
		Sharer.sendMessage(message, Project.autor);

	//chatViewer.recieveMessage(message, Project.autor);
	Panel.recieveMessage(message, Project.autor);
}

function ajax(url, options, dataType){
	if(isFunction(options)){
		options = {success: options};
		if(isString(dataType))
			options["dataType"] = dataType;
	}
	else if(!isObject(options))
		options = {};

	options["method"] = options["method"] || "GET";
	options["async"] = options["async"] || true;

	var start = 0;
	var xhttp = window.XMLHttpRequest ?  new XMLHttpRequest() :  new ActiveXObject("Microsoft.XMLHTTP");

	if(isFunction(options["abort"]))
		xhttp.onabort = options["abort"];
	if(isFunction(options["error"]))
		xhttp.onerror = options["error"];
	if(isFunction(options["progress"]))
		xhttp.onprogress = options["progress"];
	if(isFunction(options["timeout"]))
		xhttp.ontimeout = options["timeout"];
	if(isFunction(options["loadEnd"]))
		xhttp.onloadend = () => options["loadEnd"]((window["performance"].now() - start));
	if(isFunction(options["loadStart"]))
		xhttp.onloadstart = function(){
			options["loadStart"]();
			start = window["performance"].now();
		};
	if(isFunction(options["success"])){
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200 && isFunction(options["success"])){
				switch(options["dataType"]){
					case "json" :
						options["success"](JSON.parse(xhttp.responseText));
						break;
					case "html" :
						options["success"](new DOMParser().parseFromString(xhttp.responseText, FORMAT_FILE_XML));
						break;
					case "xml" :
						options["success"](new DOMParser().parseFromString(xhttp.responseText, FORMAT_FILE_XML));
						break;
					default :
						options["success"](xhttp.responseText)
				}
			}
		};
	}
	xhttp.open(options["method"], url, options["async"]);
	xhttp.send();
}

$.getJSON(FOLDER_JSON + "/context.json", data => ContextMenuManager.items = data);
$.getJSON(FOLDER_JSON + "/attributes.json", data => Entity.attr = data);


function init(){
	Scene.addToScene(new Rect(new GVector2f(800, 50), new GVector2f(100, 100), "#ff0000"));

	Scene.addToScene(new Line([new GVector2f(10, 400), new GVector2f(300, 450)], 5, "#66CCCC"));

	Scene.addToScene(new Arc(new GVector2f(600, 300), new GVector2f(50, 50), "#66CCCC"));

	Scene.addToScene(new Rect(new GVector2f(800, 50), new GVector2f(100, 100), "#ff0000"));
	Scene.addToScene(new Rect(new GVector2f(250, 250), new GVector2f(100, 100), "#00ff00"));

	Scene.addToScene(new Polygon([new GVector2f(1200, 100), new GVector2f(1150, 150), new GVector2f(1250, 150)], "#ff69b4"));
	Scene.addToScene(new Table(new GVector2f(800, 250), new GVector2f(200, 800), [["meno", "vek"], ["gabo", 21], ["maros", 35]]), "test2");

	loadImage(e => Scene.addToScene(new ImageObject(new GVector2f(300, 400), new GVector2f(300, 400), e)));



	var methods = {
		getArea: {
			name: "getArea",
			retType: "number",
			access: ACCESS_PUBLIC,
			args: "void"
		},
		getPosition:{
			name: "getPosition",
			retType: "GVector2f",
			access: ACCESS_PROTECTED,
			args: "void"
		}
	};

	var attrs = {
		x : {
			name: "x",
			access: ACCESS_PROTECTED,
			type: "number"
		},
		y : {
			name: "y",
			access: ACCESS_PROTECTED,
			type: "number"
		},
		width : {
			name: "width",
			access: ACCESS_PROTECTED,
			type: "number"
		},
		height : {
			name: "height",
			access: ACCESS_PROTECTED,
			type: "number"
		}
	};
	Scene.addToScene(new Class(new GVector2f(500, 150), new GVector2f(250, 250), "Rectange", attrs, methods));

	draw();
}

var loading = function(){

	/////DOLEZITE!!!
	Listeners.hashChange();

	canvas = document.getElementById("myCanvas");
	initCanvasSize();
	context = canvas.getContext("2d");

	$.getJSON(FOLDER_JSON + "/menu.json",function(data){
		Menu.init(data);
		$.getJSON(FOLDER_JSON + "/creator.json", data => {
			Creator.init(data);
			Paints.rePaintImage(Creator.brushSize, Creator.brushColor);
			draw();
		});
	});
	Panel = new PanelManager();

	Scene.createLayer();
	Scene.createLayer("rightMenu", "gui");
	Scene.createLayer("test2");

	Options.init();
	context.shadowColor = DEFAULT_SHADOW_COLOR;
	Input.initListeners(canvas);

	if(typeof Sharer !== "undefined")
		chatViewer = new ChatViewer(Project.title + "'s chat", Project.autor, sendMessage);

	Layers = new LayersViewer();
	Scene.addToScene(Layers, "rightMenu");
	Creator.view = new CreatorViewer(new GVector2f(Menu.position.x + (Menu.size.x + MENU_OFFSET) * 9 - MENU_OFFSET, Menu.position.y - MENU_OFFSET));

	console.log("stranka sa nacítala za: ", (window["performance"].now() - initTime) + " ms");
	draw();
};

$(function(){
		loading();
});

function realDraw(){
	if(typeof Watcher !== KEYWORD_UNDEFINED && !Watcher.connected)
		return;

	drawMousePos = new Date().getMilliseconds();
	if(!isObject(context))
		return Logger.notif("context počas kreslenia nieje definovaný");
	resetCanvas();

	if(Options.grid)
		drawGrid();

	Scene.draw();
	Creator.draw();
	Menu.draw();
	if(actContextMenu)
		actContextMenu.draw();
	Logger.log("kreslí sa všetko", LOGGER_DRAW);
	if(typeof timeLine !== KEYWORD_UNDEFINED && timeLine)
		timeLine.draw();

	context.font = "30px Comic Sans MS";
	context.fillStyle = "red";
	context.fillText("draw(ms): " + (new Date().getMilliseconds() - drawMousePos), window.innerWidth - 100, 15);
}