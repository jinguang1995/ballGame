    var COORDINATE_LENGTH = 50000;
	var Star = function (x, y, size, color) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.color = color;
	};
	//获取在canvas中的位置
	Star.prototype.mapXYToCanvasCoordinates = function (canvasWidth, canvasHeight) {
		var canvasX = Math.round((this.x / COORDINATE_LENGTH) * canvasWidth);
		var canvasY = Math.round((this.y / COORDINATE_LENGTH) * canvasHeight);
		return {
			x: canvasX,
			y: canvasY
		}
	};
	var StarFactory = {
	    getRandomStar: function () {
			var x = Math.floor(Math.random() * (COORDINATE_LENGTH + 1));
			var y = Math.floor(Math.random() * (COORDINATE_LENGTH + 1));
			
			var size = this._getWeightedRandomSize();//大小
			
			var color = this._getWeightedRandomColor();//随机弄一个color
			
			var tintedColor = this._applyRandomShade(color);//透明度
			
			return new Star(x, y, size, this._getRGBColorString(tintedColor));
		},

		_getWeightedRandomSize: function () {
			var list = [1, 1.5, 2];
			var weight = [0.8, 0.15, 0.05];
			return this._getWeightedRandom(list, weight);//通过数组获取list[i]
		},

		_getWeightedRandomColor: function () {
			var list = [
				{'r': 255, 'g': 189, 'b': 111},
				{'r': 255, 'g': 221, 'b': 180},
				{'r': 255, 'g': 244, 'b': 232},
				{'r': 251, 'g': 248, 'b': 255},
				{'r': 202, 'g': 216, 'b': 255},
				{'r': 170, 'g': 191, 'b': 255},
				{'r': 155, 'g': 176, 'b': 255}
			];
			var weight = [0.05, 0.05, 0.05, 0.7, 0.05, 0.05, 0.05];
			return this._getWeightedRandom(list, weight);
		},

		_getRandomShade: function () {
			var list = [0.4, 0.6, 1];
			var weight = [0.5, 0.3, 0.2];
			return this._getWeightedRandom(list, weight);
		},

		_applyRandomShade: function (color) {//color为{'r': ,'g': ,'b': }
			var shade = this._getRandomShade();
			if (shade !== 1) { // skip processing full brightness stars
				color['r'] = Math.floor(color['r'] * shade);
				color['g'] = Math.floor(color['g'] * shade);
				color['b'] = Math.floor(color['b'] * shade);
			}
			return color;//返回新的color
		},

        //通过color获取颜色字符串
		_getRGBColorString: function (color) {
			return 'rgb(' + color['r'] + ',' + color['g'] + ',' + color['b'] + ')';
		},

		// http://codetheory.in/weighted-biased-random-number-generation-with-javascript-based-on-probability/
		//获取加权随机数
		_getWeightedRandom: function (list, weight) {

			var rand = function (min, max) {
				return Math.random() * (max - min) + min;
			};
            //weight数组的和             reduce方法从第一位加到最后一位性能比for更高
			var total_weight = weight.reduce(function (prev, cur) {
				return prev + cur;
			});
            //获取（0~weight数组和）之间随机数以便比较
			var random_num = rand(0, total_weight);
			var weight_sum = 0;
            for (var i = 0; i < list.length; i++) {
				weight_sum += weight[i];
				weight_sum = +weight_sum.toFixed(2);

				if (random_num <= weight_sum) {
					return list[i];
				}
			}
		}
	};
	var deltaX = 8;
	var Starfield = [];
	for (var i = 0; i < 500; i++) {
			Starfield.push(StarFactory.getRandomStar());
	}