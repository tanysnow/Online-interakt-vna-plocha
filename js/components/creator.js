/*
	compatible:  14.9.2016
*/
class objectCreator{
	constructor(){
		this._object 		= false;
		this._fillColor 	= DEFAULT_FILL_COLOR;
		this._borderColor 	= DEFAULT_BORDER_COLOR;
		this._borderWidth 	= DEFAULT_BORDER_WIDTH;
		this._operation 	= OPERATION_DRAW_PATH;//OPERATION_DRAW_RECT;
		this._lineWidth 	= DEFAULT_BORDER_WIDTH;
		this._fontSize		= DEFAULT_FONT_SIZE;
		this._fontColor		= DEFAULT_FONT_COLOR;
		this._lineType		= DEFAULT_LINE_TYPE;
		this._lineStyle		= DEFAULT_LINE_STYLE;
		this._brushSize		= DEFAULT_BRUSH_SIZE;
		this._brushType		= DEFAULT_BRUSH_TYPE;
		this._brushColor	= DEFAULT_BRUSH_COLOR;
		this._radius		= DEFAULT_RADIUS;
		this._items 		= null;
		this._controllPress	= false;
		this._allLayers		= false;
		this._view			= null;
		this._lastOperation = this._operation;
		this._visibleView	= true;
		this._allowedItems 	= ["_fillColor", "_borderColor", "_borderWidth", "_operation", 
							   "_lineWidth", "_fontSize", "_fontColor", "_lineType", "_lineStyle", 
							   "_brushSize", "_brushType", "_brushColor", "_radius"];
		
		Logger.log(getMessage(MSG_OBJECT_CREATED, this.constructor.name), LOGGER_COMPONENT_CREATE);
	}

	onMouseMove(pos, movX, movY){
		updateSelectedObjectView(this._object);
		if(isFunction(this._object.updateCreatingPosition)){
			this._object.updateCreatingPosition(pos);
		}
	}

	get view(){
		return this._view;
	}

	get controllPress(){
		return this._controllPress;
	}

	get allLAyers(){
		return this._allLayers;
	}

	set visibleView(val){this._visibleView = val;}
	/**
	 * Nastaví view pre creator
	 *
	 * @param val - view ktorý sa má priradiť
	 */
	set view(val){
		this._view = val;

		if(this._items !== null){
			this.init();
		}
	}


	/**
	 * Načíta dáta pre CreatorView
	 *
	 * @param data - objekt ktorý vznikol s parsovaním načítaneho súboru s dátami pre CreatorView
	 */
	init(data = false){
		if(this._items === null && data !== false){
			this._items = data;
		}

		if(this._view !== null){
			this._view.init();
		}
	}


	/**
	 * Vytvorí dočasný objekt ktorý sa má vytvoriť a uloží sa do Creatora
	 *
	 * @param position - pozícia kde sa má objaviť objekt
	 */
	createObject(position, target = null){
		switch(this._operation){
			case OPERATION_DRAW_RECT:
				this._object = new Rect(position, new GVector2f(), this._fillColor);
				break;
			case OPERATION_DRAW_ARC:
				this._object = new Arc(position, new GVector2f(), this._fillColor);
				break;
			case OPERATION_DRAW_LINE:
				this._object = new Line([position, position.getClone()], 
										this._lineWidth, 
										this._borderColor, 
										target);
				break;
			case OPERATION_DRAW_JOIN:
				this._object = new Join(position);
				break;
			case OPERATION_DRAW_IMAGE:
				this._object = new ImageObject(position, new GVector2f());
				break;
		}
		selectedObjects.clearAndAdd(this._object);//TODO toto nesposobuje to rýchle pohybocanie objektt???
	}


	/**
	 * Dokončí vytváranie objektu
	 */
	finishCreating(){
		if(this._object.name === OBJECT_IMAGE){
			loadImage(e => {
				this._object.image = e;
				Project.scene.addToScene(this._object);
				this._object = false;
			});
		}
		else{
			Project.scene.addToScene(this._object);
			this._object = false;
		}
	}

	toggleArea(){
		if(this._operation !== OPERATION_AREA){
			if(this._operation !== OPERATION_RUBBER){
				this._lastOperation = this._operation;
			}
			this.operation = OPERATION_AREA;
		}
		else{
			this.operation = this._lastOperation;
		}
	}

	/**
	 * Prepne medzy vymazávaním a pôvodným nástrojom
	 */
	toggleRubber(){
		if(this._operation !== OPERATION_RUBBER){
			if(this._operation !== OPERATION_AREA){
				this._lastOperation = this._operation;
			}
			this.operation = OPERATION_RUBBER;
		}
		else{
			this.operation = this._lastOperation;
		}
	}


	/**
	 * Načíta všetky dáta potrebné pre creator s jedného objektu
	 *
	 * @param content
	 */
	fromObject(content){
		each(content, function(e, i){
			if(isIn(i, this._allowedItems)){
				this.setOpt(i, e);
			}
		}, this);
	}


	/**
	 * Uloží Creator to jedného objektu
	 */
	toObject(){
		var result = {};
		each(this, (e, i) => result[i] = e);
		return result;
	}


	/**
	 * Nakreslí akuálne vytváraný objekt a takisto aj view ak existuje
	 */
	draw(){
		if(this._object){
			this._object.draw();
		}

		if(this._view !== null && this._items !== null && this._visibleView){
			this._view.draw();
		}

	}

	/**
	 * Vytvorý objekt bud s objektu alebo s JSON stringu a vloží ho do scény
	 *
	 * @param obj - objekt alebo JSON string s dátami potrebnými pre vytvorenie objektu
	 * @returns {obj} - vráci novo vytvorený objekt alebo NULL ak sa vytvorenie nepodarí
	 */
	create(obj){
		var result = Entity.create(obj, false);
		if(result){
			//console.log("pridava sa nový objekt do vrstvy ", result.layer, result, obj);
			Project.scene.addToScene(result, result.layer, false);
			draw();
		}
		return result;
	}


	/**
	 * Nastavý vlastnosť creatora na určitú hodnotu
	 *
	 * @param key
	 * @param val
	 */
	setOpt(key, val){
		if(isObject(key)){
			each(key, (e, i) => this.setOpt(i, e));
			return;
		}
		if(key[0] != "_"){
			key = "_" + key;
		}


		//console.log("key: ", key, " vaĺ: ", val, "normal: ", this[key]);

		if(this[key] == val){
			return false;
		}

		var redrawPaint = isIn(key, "_brushColor", "_brushSize", "_brushType") && this[key] != val;

		this[key] = val;


		if(key === "_brushType"){
			if(val === "line"){
				Paints.action = PAINT_ACTION_LINE;
			}
			else if(val === "fur"){
				Paints.action = PAINT_ACTION_FUR;
			}
			else{
				Paints.selectedImage = val;
				Paints.action = PAINT_ACTION_BRUSH;
			}
		}

		Events.creatorChange(key, val);

		/*
		 * Ak sa zmení vlastnosť štetca musí prekresliť štetec aby sa mohlo rovno malovať
		 */
		redrawPaint && Paints.rePaintImage(this.brushSize, this.brushColor);

		if(isDefined(this._view)){
			/*
			 * Ak s zmení nejaká farba musí sa prekresliť aj view zobtrazujúci aktuálnu farbu
			 */
			if(isIn(key, "_fillColor", "_borderColor", "_fontColor", "_color", "_brushColor")){
				this._view.init();
			}
			/*
			 * tak isto to platí aj pre typ štetca
			 */
			else if(isIn(key, "_brushSize", "_brushType")){
				this._view.init();
			}

		}

	}

	/**
	 * Zistí či bolo kliknuté na CreatorViewer alebo nie
	 *
	 * @param x
	 * @param y
	 * @returns {*} - vráti TRUE alebo FALSE
	 */
	clickIn(x, y, doAct = true){
		return isDefined(this._view) && this._visibleView ? this._view.clickIn(x, y, doAct) : false;
	}

	get items(){return this._items;}
	get object(){return this._object;}

	get radius(){return this._radius;}
	get color(){return this._fillColor;}
	get lineType(){return this._lineType;}
	get fontSize(){return this._fontSize;}
	get fillColor(){return this._fillColor;}
	get fontColor(){return this._fontColor;}
	get operation(){return this._operation;}
	get lineWidth(){return this._lineWidth;}
	get lineStyle(){return this._lineStyle;}
	get brushSize(){return this._brushSize;}
	get brushType(){return this._brushType;}
	get brushColor(){return this._brushColor;}
	get borderColor(){return this._borderColor;}
	get borderWidth(){return this._borderWidth;}

	set object(val){this._object = val;}
	set operation(val){this._operation = val; this._view.changeOperation();}
}