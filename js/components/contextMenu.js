class ContextMenuManager{
	constructor(position, titles = [], parent = false, key = "undefined"){
		this._position 			= position;
		this._subMenu 			= false;
		this._parent 			= parent;
		this._key 				= key;
		this._textColor 		= CONTEXT_MENU_FONT_COLOR;
		this._selectedObject 	= parent ? parent._selectedObject : selectedObjects.movedObject;
		this._titles 			= titles;

		//TODO toto prerobiť do JSON suboru
		if(this._titles.length == 0){
			if(selectedObjects.movedObject){
				if(isIn(selectedObjects.movedObject.name, OBJECT_RECT, OBJECT_POLYGON, OBJECT_ARC, OBJECT_LINE, OBJECT_TABLE, OBJECT_IMAGE, OBJECT_TEXT))
					this._addFields("delete", "locked", "makeCopy", "changeLayer", "changeOpacity");

				if(isIn(selectedObjects.movedObject.name, OBJECT_RECT, OBJECT_POLYGON, OBJECT_TEXT, OBJECT_ARC))
					this._addFields("changeFillColor", "changeBorderColor");

				if(isIn(selectedObjects.movedObject.name, OBJECT_RECT, OBJECT_POLYGON, OBJECT_TEXT, OBJECT_LINE))
					this._addFields("radius");

				if(selectedObjects.movedObject.name == OBJECT_LINE)
					this._addFields("joinType", "lineCap", "lineStyle", "lineType", "lineWidth", "arrowEndType", "arrowStartType");
				else if(selectedObjects.movedObject.name == OBJECT_TABLE)
					this._addFields("editTable");
				else if(selectedObjects.movedObject.name == OBJECT_TEXT)
					this._addFields("verticalTextAlign", "horizontalTextAlign");
				else if(selectedObjects.movedObject.name == OBJECT_IMAGE)
					this._addFields("changeImage");
				else if(selectedObjects.movedObject.name == "LayerViewer"){
					this._addFields("visible", "lockLayer", "showPaint");
					if(!selectedObjects.movedObject.locked)
						this._addFields("deleteLayer", "renameLayer", "clearLayer");
				}
			}
			else
				this._addFields("clearWorkspace");
		}
		context.font = (30 - CONTEXT_MENU_OFFSET) + "pt " + DEFAULT_FONT;

		var hasExtension = false;

		if(titles.length)
			titles.forEach(function(e, i, arr){
				if(e["type"] == INPUT_TYPE_RADIO){
					hasExtension = true;
					arr[i]["value"] = this._selectedObject["_" + this._key] == e["name"];
				}

				if(e["type"] == INPUT_TYPE_CHECKBOX){
					hasExtension = true;
					if(e["key"] == "locked")
						arr[i]["value"] = selectedObjects.movedObject.locked;
					else if(e["key"] == "visible")
						arr[i]["value"] = selectedObjects.movedObject.visible;
					else if(e["key"] == "showPaint")
						arr[i]["value"] = selectedObjects.movedObject.showPaint;
				}
			}, this);

		this._menuWidth = getMaxWidth(this._titles.map(e => e["label"])) + (CONTEXT_MENU_OFFSET << 1);

		if(hasExtension)
			this._menuWidth += 30;

		this._size = new GVector2f(this._menuWidth, this._titles.length * CONTEXT_MENU_LINE_HEIGHT);
		Logger.log("Bol vytvorený objekt " + this.constructor.name, LOGGER_COMPONENT_CREATE);
	};

	get position(){
		return this._position;
	};

	_addFields(){
		var res;
		objectToArray(arguments).forEach(function(e){
			res = ContextMenuManager.items[e];
			res["key"] = e;
			this._titles.push(res);
		}, this);
	};

	clickInBoundingBox(x, y){
		return x + SELECTOR_SIZE > this._position.x && x - SELECTOR_SIZE < this._position.x + this._menuWidth &&
			   y + SELECTOR_SIZE > this._position.y && y - SELECTOR_SIZE < this._position.y + this._titles.length * CONTEXT_MENU_LINE_HEIGHT;
	};

	draw(){
		if(this._position.x + this._menuWidth > canvas.width)
			this._position.x = canvas.width - this._menuWidth;

		if(this._position.y + this._titles.length * CONTEXT_MENU_LINE_HEIGHT >canvas.height)
			this._position.y = canvas.height - this._titles.length * CONTEXT_MENU_LINE_HEIGHT;

		var count 		= 0,
			pX 			= this._position.x,
			pY 			= this._position.y,
			menuWidth 	= this._menuWidth,
			posY 		= pY,
			checkSize 	= 20,
			offset 		= (CONTEXT_MENU_LINE_HEIGHT - checkSize) >> 1;

		doRect({
			position:[pX, pY],
			width: this._menuWidth,
			height: Object.keys(this._titles).length * CONTEXT_MENU_LINE_HEIGHT,
			radius: MENU_RADIUS,
			borderColor: this.borderColor,
			borderWidth: this.borderWidth,
			fillColor: "rgb(153, 217, 234)",
			shadow: true,
			draw: true
		});
		each(this._titles, function(e){
			context.fillStyle = DEFAULT_FONT_COLOR;
			posY = pY + count * CONTEXT_MENU_LINE_HEIGHT;
			if(count++)
				doLine({points: [pX, posY, pX + menuWidth, posY], draw: true});


			if(this._subMenu && e["key"] == this._subMenu._key)
				fillText(e["label"], pX, posY,  30 - CONTEXT_MENU_OFFSET, this._textColor);
			else
				fillText(e["label"], pX, posY,  30 - CONTEXT_MENU_OFFSET, this._textColor, [CONTEXT_MENU_OFFSET, 0]);

			if(e["type"] == INPUT_TYPE_CHECKBOX)
				doRect({
					x: pX + menuWidth - offset - checkSize,
					y: posY + offset,
					size: checkSize,
					radius: 5,
					borderColor: this.borderColor,
					borderWidth: this.borderWidth,
					fillColor: e["value"] ? CHECKBOX_COLOR_TRUE : CHECKBOX_COLOR_FALSE,
					draw: true
				});
			else if(e["type"] == INPUT_TYPE_RADIO)
				doArc({
					x: pX + menuWidth - offset - checkSize,
					y: posY + offset,
					size: checkSize,
					borderColor: DEFAULT_FONT_COLOR,
					fillColor: DEFAULT_FONT_COLOR,
					draw: !e["value"],
					fill: e["value"]
				});
			else if(e["type"] == "widthValue")
				doLine({
					points: [pX + menuWidth - (checkSize << 2), posY + (CONTEXT_MENU_LINE_HEIGHT >> 1),
							 pX + menuWidth - offset, posY + (CONTEXT_MENU_LINE_HEIGHT >> 1)],
					borderWidth: e["name"]
				});
		}, this);
	
		if(this._subMenu)
			this._subMenu.draw();
	};

	_doClickAct(opt) {
		var act = opt.key;


		Logger.log("Klikol v contextMenu na položku " + act, LOGGER_CONTEXT_CLICK);
		switch (act) {
			case "changeFillColor":
				pickUpColor(color => Entity.changeAttr(this._selectedObject, ATTRIBUTE_FILL_COLOR, color), this);
				actContextMenu = false;
				break;
			case "changeBorderColor":
				pickUpColor(color => Entity.changeAttr(this._selectedObject, ATTRIBUTE_BORDER_COLOR, color), this);
				actContextMenu = false;
				break;
			case "delete":
				if (this._selectedObject)
					Scene.remove(this._selectedObject);
				actContextMenu = false;
				break;
			case "locked":
				this._selectedObject.locked = !this._selectedObject.locked;
				ContextMenuManager.items["locked"].value = this._selectedObject.locked;
				actContextMenu = false;
				break;
			case "clearWorkspace":
				Scene.cleanUp();
				actContextMenu = false;
				break;
			case "removeRow":
				this._selectedObject.removeRow(this._parent.position.y);
				actContextMenu = false;
				break;
			case "removeColumn":
				this._selectedObject.removeColumn(this._parent.position.x);
				actContextMenu = false;
				break;
			case "addRowBelow":
				this._selectedObject.addRow(this._parent.position.y, "below");
				actContextMenu = false;
				break;
			case "addRowAbove":
				this._selectedObject.addRow(this._parent.position.y, "above");
				actContextMenu = false;
				break;
			case "addColumnToRight":
				this._selectedObject.addColumn(this._parent.position.x, "right");
				actContextMenu = false;
				break;
			case "addColumnToLeft":
				this._selectedObject.addColumn(this._parent.position.x, "left");
				actContextMenu = false;
				break;
			case "clearRow":
				this._selectedObject.clear(this._parent.position.y, "row");
				actContextMenu = false;
				break;
			case "clearColumn":
				this._selectedObject.clear(this._parent.position.x, "column");
				actContextMenu = false;
				break;
			case "clearTable":
				this._selectedObject.clear(null, "table");
				actContextMenu = false;
				break;
			case "showPaint":
				this._selectedObject.toggleVisibilityOfPaint(this._position.y);
				actContextMenu = false;
				break;
			case "visible":
				this._selectedObject.toggleVisibilityOfLayer(this._position.y);
				actContextMenu = false;
				break;
			case "clearLayer":
				this._selectedObject.clearLayer(this.position.y);
				actContextMenu = false;
				break;
			case "renameLayer":
				this._selectedObject.renameLayer(this.position.y);
				actContextMenu = false;
				break;
			case "makeCopy":
				var obj = Entity.create(this._selectedObject);
				obj.position.add(this._selectedObject.size);
				Scene.addToScene(obj);
				actContextMenu = false;
				break;
			default:
				if(opt.group == "roundRadius"){
					Entity.changeAttr(this._selectedObject, ATTRIBUTE_RADIUS, opt.name);
					actContextMenu = false;
				}
				else if(opt.group == "lineCapValue"){
					this._selectedObject.lineCap = opt.name;
					actContextMenu = false;
				}
				else if(opt.group == "joinTypeValue"){
					this._selectedObject.joinType = opt.name;
					actContextMenu = false;
				}
				else if(opt.group == "lineStyleValue"){
					this._selectedObject.lineStyle = opt.name;
					actContextMenu = false;
				}
				else if(opt.group == "widthValue"){
					Entity.changeAttr(this._selectedObject, ATTRIBUTE_BORDER_WIDTH, opt.name);
					//this._selectedObject.borderWidth = opt.name;
					actContextMenu = false;
				}
				else if(opt.group == "arrowEndType"){
					this._selectedObject.arrowEndType = opt.name;
					actContextMenu = false;
				}
				else if(opt.group == "arrowStartType"){
					this._selectedObject.arrowStartType = opt.name;
					actContextMenu = false;
				}
				else if(opt.group == "valignValue"){
					this._selectedObject.verticalTextAlign = opt.name;
					actContextMenu = false;
				}
				else if(opt.group == "halignValue"){
					this._selectedObject.horizontalTextAlign = opt.name;
					actContextMenu = false;
				}

		}
	}

	clickIn(x, y){
		if(!this.clickInBoundingBox(x, y))
			return this._subMenu ? this._subMenu.clickIn(x, y) : false;

		var i = parseInt((y - this._position.y) / CONTEXT_MENU_LINE_HEIGHT);

		if(isDefined(this._titles[i]) && this._titles[i].hasOwnProperty("fields")){
			var pos = this._position.getClone().add(this._menuWidth, i * CONTEXT_MENU_LINE_HEIGHT);
			if(pos.x + this._menuWidth > canvas.width)
				pos.x -= this._menuWidth << 1;
			this._subMenu = new ContextMenuManager(pos, objectToArray(this._titles[i]["fields"]), this, this._titles[i]["key"]);
		}
		else
			this._subMenu = false;

		this._doClickAct(this._titles[i]);

		return true;

	};
}