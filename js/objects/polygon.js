class Polygon extends Entity{
	constructor(points, color){
		super(OBJECT_POLYGON, new GVector2f(), new GVector2f(), {fillColor: color});
		this.points 		= points;
		this.movingPoint	= -1;
		if(points.length < 3){
			Logger.warn(getMessage(MSG_POLYGON_WITH_TOO_LESS_POINTS));
			Scene.remove(this);
		}

		Entity.findMinAndMax(this.points, this.position, this.size);
	}


	doubleClickIn(x, y){
		if(!this.clickInBoundingBox(x, y)){
			return false;
		}

		this.points.forEach(function(e, i){
			if(new GVector2f(x, y).dist(e) < SELECTOR_SIZE){
				this.points.splice(i, 1);
				Entity.findMinAndMax(this.points, this.position, this.size);
			}
		}, this);

		if(this.points.length < 3){
			Scene.remove(this);
		}

		return true;
	}

	clickIn(x, y) {
		if (!this.clickInBoundingBox(x, y)){
			return false;
		}

		this.movingPoint = -1;
		var vec = new GVector2f(x, y);
		this.points.forEach(function(e,i, points){
			if(this.movingPoint >= 0){
				return true;
			}
			if(vec.dist(e) < SELECTOR_SIZE){
				this.movingPoint = i;
			}
			else if(i < points.length && vec.dist((e.x + (points[(i + 1) % points.length].x) >> 1),
													  (e.y + (points[(i + 1) % points.length].y) >> 1)) < SELECTOR_SIZE){
				this.movingPoint = parseFloat(i) + 0.5;
			}
		}, this);

		if(this.movingPoint >= 0){
			return true;
		}

		return Polygon.determineClick(this.points, x, y);
	}

	static determineClick(points, x, y){
		for(var i=0 ; i<points.length ; i++){
			var big = i + 1;
			var less = i - 1;
			if(i === 0){
				less = points.length - 1;
			}
			if(i === points.length - 1){
				big = 0;
			}

			var vec1 = points[i].getClone().sub(points[less]);
			var vec2 = points[big].getClone().sub(points[i]);
			var toMouse = new GVector2f(x, y).sub(points[i]);
			if(angleBetween(vec1, vec2) < angleBetween(vec1, toMouse)){
				return false;
			}
		}

		return true;
	}

	draw(ctx = context){
		doPolygon({
			shadow: this.moving && !this.locked,
			points: this.points,
			fillColor: this.fillColor,
			borderColor: this.borderColor,
			borderWidth: this.borderWidth,
			radius: this.radius,
			ctx: ctx
		});
		if(this.selected){
			drawBorder(ctx, this, {});
			for(var i=0 ; i<this.points.length ; i++){
				var min = i - 1;
				if(i === 0){
					min = this.points.length - 1;
				}
				drawSelectArc(ctx, this.points[i].x, this.points[i].y);
				drawSelectArc(ctx, (this.points[i].x + this.points[min].x) >> 1, (this.points[i].y + this.points[min].y) >> 1);
			}
		}

	}
}