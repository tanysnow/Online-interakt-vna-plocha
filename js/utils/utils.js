/*
	compatible:	strictMode, Array.isArray 14.9.2016
*/

glob.testCompatibility = function(){
	var ca = document.createElement("canvas");
	var co = ca.getContext("2d");

	var isUndefined = function(object, key){
		if(typeof object[key] === "undefined"){
			alert("objekt " + object + " neobsahuje atribut " + key);
		}
	};
	isUndefined(co, "canvas");
	isUndefined(co, "currentTransform");//
	isUndefined(co, "direction");//
	isUndefined(co, "fillStyle");
	isUndefined(co, "filter");//
	isUndefined(co, "font");
	isUndefined(co, "globalAlpha");
	isUndefined(co, "globalCompositeOperation");
	isUndefined(co, "imageSmoothingEnabled");//
	isUndefined(co, "imageSmoothingQuality");//
	isUndefined(co, "lineCap");
	isUndefined(co, "lineDashOffset");//
	isUndefined(co, "lineJoin");
	isUndefined(co, "lineWidth");
	isUndefined(co, "miterLimit");
	isUndefined(co, "shadowBlur");
	isUndefined(co, "shadowColor");
	isUndefined(co, "shadowOffsetX");
	isUndefined(co, "shadowOffsetY");
	isUndefined(co, "strokeStyle");
	isUndefined(co, "textAlign");
	isUndefined(co, "textBaseline");

	isUndefined(co, "addHitRegion");//
	isUndefined(co, "arc");
	isUndefined(co, "arcTo");
	isUndefined(co, "asyncDrawXULElement");//
	isUndefined(co, "beginPath");
	isUndefined(co, "bezierCurveTo");
	isUndefined(co, "clearHitRegions");//
	isUndefined(co, "clearRect");
	isUndefined(co, "clip");
	isUndefined(co, "closePath");
	isUndefined(co, "createImageData");
	isUndefined(co, "createLinearGradient");
	isUndefined(co, "createPattern");
	isUndefined(co, "createRadialGradient");
	isUndefined(co, "drawFocusIfNeeded");//
	isUndefined(co, "drawImage");
	isUndefined(co, "drawWidgetAsOnScreen");//
	isUndefined(co, "drawWindow");//
	isUndefined(co, "ellipse");//
	isUndefined(co, "fill");
	isUndefined(co, "fillRect");
	isUndefined(co, "fillText");
	isUndefined(co, "getImageData");
	isUndefined(co, "getLineDash");//
	isUndefined(co, "isPointInPath");
	isUndefined(co, "isPointInStroke");//
	isUndefined(co, "lineTo");
	isUndefined(co, "measureText");
	isUndefined(co, "moveTo");
	isUndefined(co, "putImageData");
	isUndefined(co, "quadraticCurveTo");
	isUndefined(co, "rect");
	isUndefined(co, "removeHitRegion");//
	isUndefined(co, "resetTransform");//
	isUndefined(co, "restore");
	isUndefined(co, "rotate");
	isUndefined(co, "save");
	isUndefined(co, "scale");
	isUndefined(co, "scrollPathIntoView");//
	isUndefined(co, "setLineDash");//
	isUndefined(co, "setTransform");
	isUndefined(co, "stroke");
	isUndefined(co, "strokeRect");
	isUndefined(co, "strokeText");
	isUndefined(co, "transform");
	isUndefined(co, "translate");
	
	isUndefined(window, "performance");
};

glob.showKey = function(key){
	if(Options.showKeys){
		var char = "";

		switch(key){
			case KEY_DELETE :
				char = "DEL";
				break;
			case KEY_L_CTRL :
				char = "CTRL";
				break;
			case KEY_L_ALT :
				char = "ALT";
				break;
			case KEY_SHIFT :
				char = "SHIFT";
				break;
			case KEY_ARROW_UP :
				char = "▲";
				break;
			case KEY_ARROW_LEFT :
				char = "◀";
				break;
			case KEY_ARROW_DOWN :
				char = "▼";
				break;
			case KEY_ARROW_RIGHT :
				char = "▶";
				break;
			case KEY_ENTER :
				char = 	"⏎";
				break;
			case KEY_TABULATOR :
				char = 	"TAB";
				break;
			case KEY_ESCAPE :
				char = 	"ESC";
				break;
			default: 
				char = String.fromCharCode(key);
		}

		var element = G.createElement("div", {}, char);
		setTimeout(() => element.remove(), 2000);
		G("#keysViewerHolder").append(element);
	}
}

class Animation{
	static init(loop){
		Animation._running = false;
		Animation._loop = loop;
		Animation._counter = 0;
	}

	static _mainLoop(timestamp){
		Animation._loop(timestamp);
		
		if(Animation._running){
			requestAnimationFrame(Animation._mainLoop);
		}
	}

	static stop(){
		Animation._running = false;
	
	}
	static start(){
		Animation._running = true;

		var test = (time) => {
			Animation._mainLoop(time);
		};
		requestAnimationFrame(test);
	}
}

glob.queryString = function(){
	var query_string = {};
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0 ; i<vars.length ; i++) {
		var pair = vars[i].split("=");
		if(typeof query_string[pair[0]] === "undefined") {
			query_string[pair[0]] = decodeURIComponent(pair[1]);
		}
		else if(typeof query_string[pair[0]] === "string") {
			var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
			query_string[pair[0]] = arr;
		}
		else{
			query_string[pair[0]].push(decodeURIComponent(pair[1]));
		}
	}
	return query_string;
}

function isIn(obj, data){
	//return arguments.some((e, i) => i && e === obj);
	var i;
	if(isArray(data)){
		for(i=0 ; i<data.length ; i++){
			if(data[i] == obj){
				return true;
			}
		}
	}
	else{
		for(i=1 ; i<arguments.length ; i++){
			if(arguments[i] === obj){
				return true;
			}
		}
	}

	return false;
}

glob.roughSizeOfObject = function(object) {
	var objectList = [];
	var stack = [object];
	var bytes = 0;

	while (stack.length) {
		var value = stack.pop();
		if(isBoolean(value)){
			bytes += 4;
		}
		else if(isString(value)){
			bytes += value.length << 1;
		}
		else if(isNumber(value)){
			bytes += 8;
		}
		else if(isObject(value) && objectList.indexOf( value ) === -1){
			objectList.push(value);
			for(var i in value){
				if(value.hasOwnProperty(i)){
					stack.push(value[i]);
				}
			}
		}
	}
	return bytes;
};

var isUndefined 	= e => typeof e === KEYWORD_UNDEFINED,
	isDefined 		= e => typeof e !== KEYWORD_UNDEFINED,
	isFunction 		= e => typeof e === KEYWORD_FUNCTION,
	isNumber		= e => typeof e === KEYWORD_NUMBER,
	isString		= e => typeof e === KEYWORD_STRING,
	isObject		= e => typeof e === KEYWORD_OBJECT,
	isBoolean		= e => typeof e === KEYWORD_BOOLEAN,
	isArray			= e => Array.isArray(e),
	isNull			= e => e === null,
	isEmptyObject   = e => e && Object.keys(e).length === 0 && e.constructor === Object,
	isEmptyArray    = e => isArray(e) && e.length === 0,
	getLength		= function(obj){var counter = 0; each(obj, e => counter++); return counter;},
	isSharing		= () => typeof Sharer !== "undefined" && Sharer.isSharing,
	isInt 			= e => Number(e) === e && e % 1 === 0,
	isFloat 		= e => Number(e) === e && e % 1 !== 0,
	callIfFunc 		= e => isFunction(e) ? e() : false,
	angleBetween 	= (a, b) => Math.atan2(b.y, b.x) - Math.atan2(a.y, a.x),
	getClassOf 		= Function.prototype.call.bind(Object.prototype.toString),
	nvl				= (obj1, obj2) => obj1 ? obj1 : obj2,
	getLastElement	= el => isArray(el) && el.length ? el[el.length - 1] : false,
	round 			= (num, val = DEFAULT_ROUND_VAL) => val === 1 ? num : Math.floor(num / val) * val;


glob.toHHMMSS = function(time, decimals = 0) {
    var sec_num = parseInt(time, 10) / 1000;
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10){ hours   = "0" + hours;}
    if (minutes < 10){ minutes = "0" + minutes;}
    if (seconds < 10){
    	seconds = "0" + seconds.toFixed(decimals);
    }
    else {
    	seconds = seconds.toFixed(decimals);
    }
    return hours + ':' + minutes + ':' + seconds;
};

function each(obj, func, thisArg = false){
	var i;
	if(Array.isArray(obj)){
		if(thisArg){
			for(i=0 ; i<obj.length ; i++){
				func.call(thisArg, obj[i], i, obj);
			}
		}
		else{
			for(i=0 ; i<obj.length ; i++){
				func(obj[i], i, obj);
			}
		}
	}
	else{
		if(thisArg){
			for(i in obj){
				if(obj.hasOwnProperty(i)){
					func.call(thisArg, obj[i], i, obj);
				}
			}
		}
		else{
			for(i in obj){
				if(obj.hasOwnProperty(i)){
					func(obj[i], i, obj);
				}
			}
		}
	}
}

glob.loadPage = function(url){
	var tag = document.createElement('script');

	tag.src = url;
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
};

glob.eachFiltered = function(obj, func1, func2, thisArg = false){
	each(obj, (e, i, arr) => func1(e, i, arr) && func2(e, i, arr), thisArg);
};

var Movement = {
	move: function(o, x, y, moveChildrens = true){
		if(isDefined(o.locked) && o.locked){
			return;
		}


		if(isDefined(o.selectedConnector) && Creator.operation == OPERATION_DRAW_JOIN && o.selectedConnector){

		}
		else if(o.name === OBJECT_AREA){
			o.move(x, y);
		}
		else if(isDefined(o.moveType)){
			if(Creator.operation == OPERATION_DRAW_LINE && Menu.isToolActive()){

			}
			else{
				var oldPos = o.position.getClone();
				var oldSize = o.size.getClone();
				switch(o.moveType){
					case 0:
						o.position.y += y;
						o.size.y -= y;
						break;
					case 1:
						o.size.x += x;
						break;
					case 2:
						o.size.y += y;
						break;
					case 3:
						o.position.x += x;
						o.size.x -= x;
						break;
					case 4:
						o.position.add(x, y);
						if(moveChildrens){
							o.eachChildren(e => {
								e.moveType = 4;
								Movement.move(e, x, y, false);
								e.moveType = -1;
							});
						}
						break;
					case 5:
						if(!o.minSize || o.size.x + x >= o.minSize.x){
							o.size.x += x;
						}
						if(!o.minSize || o.size.y + y >= o.minSize.y){
							o.size.y += y;
						}
						break;
				}
			}
		}
		else if(isDefined(o.movingPoint)){
			var intVal = 0;
			if(o.movingPoint < 0){//ak sa hýbe celým objektom
				o.points.forEach(a => a.add(x, y));
			}
			else if(isInt(o.movingPoint)){//ak sa kliklo na bod zlomu tak sa bodom hýbe
				if(o.movingPoint === 0){
					o.targetA = "";
				}
				else if(o.movingPoint === o.points.length - 1){
					o.targetB = "";
				}
				o.points[o.movingPoint].add(x, y);
			}
			else{//ináč sa vytvára nový bod
				intVal = parseInt(o.movingPoint) + 1;
				o.points.splice(intVal, 0, o.points[intVal - 1].getClone().add(o.points[(intVal % o.points.length)]).br(1));
				o.movingPoint = intVal;
			}
			Entity.findMinAndMax(o.points, o.position, o.size);
		}
		else{
			o.position.add(x, y);
			if(moveChildrens){
				o.eachChildren(e => e.position.add(x, y));
			}
		}

		Events.objectMove(o);
	}
};

function setCursor(val){
	canvas.style.cursor = val;
}

function closeDialog(){
	//$("#modalWindow > div").each((e) => $(e).hide());

	$("#modalWindow > div").each(function(){
		$(this).hide();
	});
	$("#colorPalete").undelegate();
	$("#modalWindow").hide();
	$("canvas").removeClass("blur");
}

function getText(text, position, size, func, thisArg){
	var T, x = $(document.createElement("INPUT"));

	if (arguments.length > 1){
		T = thisArg;
	}

	x.attr({
		type: "text",
		value: text,
		id: "staticInput"
	}).css({
		left: position.x + 'px',
		top: position.y + 'px',
		width: size.x,
		height: size.y,
		fontSize: size.y * 0.6
	}).blur(function(){
		func.call(T, x.val());
		x.remove();
		draw();
	}).keyup(function(e){
		if(e.keyCode == KEY_ENTER){
			x.onblur = false;
			func.call(T, x.val());
			x.remove();
			draw();
		}
	}).appendTo("body");
	x.select().focus();
}

function getFormattedDate(ms = Date.now()) {
	var date = new Date(ms);
	return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " " + date.getMilliseconds();
}

glob.setCookie = function(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	document.cookie = cname + "=" + cvalue + ";expires="+ d.toUTCString();
};

glob.getCookie = function(cname) {
	var name = cname + "=",
		ca = document.cookie.split(';'),
		i, c;
	for(i = 0; i <ca.length; i++) {
		c = ca[i];
		while (c.charAt(0) == ' '){
			c = c.substring(1);
		}
		if (c.indexOf(name) === 0){
			return c.substring(name.length,c.length);
		}
	}
	return "";
};

function drawBorder(ctx, o, selectors = {tc: 1, bc: 1, cl: 1, cr: 1, br: 1}){
	if(!o.selected && o.name != "Paint"){
		return;
	}
	doRect({
		position: o.position,
		size: o.size,
		borderWidth: DEFAULT_BORDER_WIDTH << 1,
		lineDash:  [15, 5],
		ctx: ctx
	});

	if(selectors.hasOwnProperty("tc")){
		drawSelectArc(ctx, o.position.x + (o.size.x >> 1), o.position.y);
	}
	if(selectors.hasOwnProperty("cl")){
		drawSelectArc(ctx, o.position.x, o.position.y + (o.size.y >> 1));
	}
	if(selectors.hasOwnProperty("bc")){
		drawSelectArc(ctx, o.position.x + (o.size.x >> 1), o.position.y + o.size.y);
	}
	if(selectors.hasOwnProperty("cr")){
		drawSelectArc(ctx, o.position.x + o.size.x, o.position.y + (o.size.y >> 1));
	}

	if(selectors.hasOwnProperty("br")){
		drawSelectArc(ctx, o.position.x + o.size.x, o.position.y + o.size.y);
	}
}

glob.rectRectCollision = function(minA, sizeA, minB, sizeB){
	var ax = minA.x;
	var ay = minA.y;
	var bx = minB.x;
	var by = minB.y;
	var aw = sizeA.x;
	var ah = sizeA.y;
	var bw = sizeB.x;
	var bh = sizeB.y;

	return (bx + bw > ax) && (by + bh > ay) && (bx < ax + aw) && (by < ay + ah);
};

function objectToArray(obj){
	var result = [];
	each(obj, e => result[result.length] = e);
	return result;
}

function updateSelectedObjectView(object){
	/*
	 var container = $("#cont_select_obj");
	 container.find("#posX").text(object.position.x);
	 container.find("#posY").text(object.position.y);
	 container.find("#sizeX").text(object.size.x);
	 container.find("#sizeY").text(object.size.y);
	 container.find("#color").css("backgroundColor", object.color).text(object.color);
	 */
}

function drawConnector(vec, obj, ctx){
	vec = vec.getClone().mul(obj.size);
	doArc({
		x: obj.position.x + vec.x,
		y: obj.position.y + vec.y,
		fillColor: CONNECTOR_COLOR,
		center: true,
		width: CONNECTOR_WIDTH,
		height: CONNECTOR_HEIGHT,
		ctx: ctx
	});
}

function drawSelectArc(ctx, x, y, color = SELECTOR_COLOR, size = SELECTOR_SIZE << 1, dots = true){
	doArc({
		x: x,
		y: y,
		center: true,
		width: size,
		height: size,
		fillColor: color,
		borderWidth: DEFAULT_BORDER_WIDTH << 1,
		lineDash:  dots ? [15, 5] : [],
		borderColor: SELECTOR_BORDER_COLOR,
		ctx: ctx
	});
}

glob.showObject = function(obj){
	if(!isObject(obj)){
		console.log("parameter nieje objekt");
		return;
	}
	var type;
	for(var i in obj){
		if(obj.hasOwnProperty(i)){
			var postfix = "";
			type = typeof obj[i];
			type = type === "object" && isArray(obj[i]) ? "array" : type;

			if(type === "array"){
				postfix = " -> " + obj[i].length;
			}
			else if(type === "string" || type === "number" || type === "boolean"){
				postfix = " -> " + obj[i];
			}
			console.log(i + ": [" + type + "]" + postfix);
		}
	}
};

glob.getMousePos = function(canvasDom, mouseEvent) {
	var rect = canvasDom.getBoundingClientRect();
	return {
		x: mouseEvent["touches"][0].clientX - rect.left,
		y: mouseEvent["touches"][0].clientY - rect.top
	};
};

class EventTimer{
	constructor(event, time){
		this._event = event;
		this._time = time;
		this._timeOut = false;
		this._lastTime = Date.now();
	}

	_callEvent(inst = this){
		inst._event();
		if(inst._timeOut){
			clearTimeout(inst._timeOut);
			inst._timeOut = false;
		}
		inst._lastTime = Date.now();
	}

	_setTimeOut(diff){
		if(this._timeOut){
			return;
		}
		this._timeOut = setTimeout(() => this._callEvent(this) , this._time - diff);
	}

	callIfCan(){
		var diff = Date.now() - this._lastTime;
		diff > this._time ? this._callEvent() : this._setTimeOut(diff);
	}
}

/*
function setConstants(data){
	var constants = {};
	var setConstant = (key, val) => {
		key = key.toUpperCase();
		constants[key] = val;
		Object.defineProperty(window, key, { value : val, writable: false });
	};
	each(data, (e, i) => {
		if(typeof e === "object"){
			each(e, (ee, ii) => {
				if(typeof ee === "object"){
					each(ee, (eee, iii) => {
						if(typeof eee === "object"){
							each(eee, (eeee, iiii) => {
								setConstant(i + "_" + ii + "_" + iii + "_" + iiii, eeee);
							});
						}
						else{
							setConstant(i + "_" + ii + "_" + iii, eee);
						}
					});
				}
				else{
					setConstant(i + "_" + ii, ee);
				}
			});
		}
		else{
			setConstant(i, e);
		}
	});
	return constants;
}
*/

/**************************************************************************************
POLYFILLS
**************************************************************************************/

/*****************
MOJE
*****************/
if(!String.prototype.startsWith){
	String.prototype.startsWith = function(char){
		var s = String(this);
		if(s.length === 0){
			return false;
		}
		return s.charAt(0) === char;
	};
}
/*****************
DEFAULTNE
*****************/

// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {

  Array.prototype.forEach = function(callback, thisArg) {

    var T, k;

    if (this === null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling toObject() passing the
    // |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get() internal
    // method of O with the argument "length".
    // 3. Let len be toUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If isCallable(callback) is false, throw a TypeError exception. 
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let
    // T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //    This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty
      //    internal method of O with argument Pk.
      //    This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal
        // method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as
        // the this value and argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}

// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement, fromIndex) {

    var k;

    // 1. Let o be the result of calling ToObject passing
    //    the this value as the argument.
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }

    var o = Object(this);

    // 2. Let lenValue be the result of calling the Get
    //    internal method of o with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = o.length >>> 0;

    // 4. If len is 0, return -1.
    if (len === 0) {
      return -1;
    }

    // 5. If argument fromIndex was passed let n be
    //    ToInteger(fromIndex); else let n be 0.
    var n = +fromIndex || 0;

    if (Math.abs(n) === Infinity) {
      n = 0;
    }

    // 6. If n >= len, return -1.
    if (n >= len) {
      return -1;
    }

    // 7. If n >= 0, then Let k be n.
    // 8. Else, n<0, Let k be len - abs(n).
    //    If k is less than 0, then let k be 0.
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    // 9. Repeat, while k < len
    while (k < len) {
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the
      //    HasProperty internal method of o with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      //    i.  Let elementK be the result of calling the Get
      //        internal method of o with the argument ToString(k).
      //   ii.  Let same be the result of applying the
      //        Strict Equality Comparison Algorithm to
      //        searchElement and elementK.
      //  iii.  If same is true, return k.
      if (k in o && o[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}

if (!Date.now) {
  Date.now = function now() {
    return new Date().getTime();
  };
}

if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP ? this : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    if (this.prototype) {
      // Function.prototype doesn't have a prototype property
      fNOP.prototype = this.prototype; 
    }
    fBound.prototype = new fNOP();

    return fBound;
  };
}

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = (function() {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function(obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}

if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}
