'use strict';
var c,
	cx,
	width,
	height,
	points,
	count,
	Mute = false,
	single=true,
	stop=false,
	player,
	speed = 15,
	score,
	result,
	numPoints,
	smoke,
	gravity = 0.10,
	thrust = 0.4,
	animationFrameId,
	tau = Math.PI * 2,
	sectionWidth = 20,
	dis = 0,
	block = true,
	timer,
	caveHeight,
	groundHeight,
	distance,
	resetSwitch = document.getElementsByClassName('reset'),
	startMessage = document.getElementById('start'),
	startButton = document.getElementById('startBtn'),
	gameOverMessage = document.getElementById('gameover'),
	dir = document.getElementById('dir'),
	mute = document.getElementById('button');
resetSwitch.onclick = function(e) {
	e.preventDefault();
	init();
	loop();
};
startButton.onclick = function(e) {
	e.preventDefault();
	startMessage.innerHTML = '';
	dir.innerHTML = "";
	loop();
	oB.singLoop('game');
	oB.cancel('start');
};
mute.onclick = function() {
	oB.muteToggle();
	Mute = !Mute;
};
function rand(min, max) {
	return Math.random() * (max - min) + min;
};
var SmokeParticle = function() {
	function SmokeParticle(x, y) {
		this.x = x;
		this.y = y;
		this.radius = rand(2, 6);
		if(block) {
			this.dx = rand(-0.5, 0.5);
			this.dy = rand(1, 4);
		} else {
			this.dy = rand(-0.5, 0.5);
			this.dx = rand(1, 4);
		}
		this.age = 0;
		this.lifeSpan = rand(20, 60);
		this.colours = newColours();
	};
	SmokeParticle.prototype.draw = function draw() {
		cx.beginPath();
		cx.arc(this.x, this.y, this.radius, 0, tau);
		cx.fillStyle = 'rgba(' + this.colours.r + ',' + this.colours.g + ',' + this.colours.b + ', 1)';
		cx.fill();
	};
	SmokeParticle.prototype.step = function step() {
		if(block) {
			this.dy += gravity * 2;
			var groundY = groundYatX(this.x) + caveHeight;
			if(this.y >= groundY + dis) {
				this.dy *= -1;
				if(rand(0, 1) > 0.5) {
					this.dx += 3;
				} else {
					this.dx -= 3;
				}
			}
			this.x += this.dx;
			this.y += this.dy;
		} else {
			this.dx += gravity * 2;
			if(rand(0, 1) > 0.5) {
				this.dy += 0.1;
			} else {
				this.dy -= 0.1;
			}
			this.x -= this.dx;
			this.y += this.dy;
		}
		this.age++;
	};
	return SmokeParticle;
}();
var addSmokeParticle = function(n){
	var num = n;
	if(block) {
		for(var n = 0; n < num; n++) {
			var xDiff = rand(0, 1);
			var yDiff = 0;
			smoke.push(new SmokeParticle(player.x + xDiff, player.y + player.radius + yDiff));
		}
	} else {
		for(var n = 0; n < num; n++) {
			var yDiff = rand(0, 1);
			var xDiff = 0;
			smoke.push(new SmokeParticle(player.x - player.radius, player.y + yDiff));
		}
	}
};
//player
var Player = function() {
	function Player(x, y) {
		this.x = x;
		this.y = y;
		this.dy = 0;
		this.radius = 15;
		this.colours = newColours();
	};
	Player.prototype.draw = function draw() {
		cx.beginPath();
		cx.arc(this.x, this.y, this.radius, 0, tau);
		cx.fillStyle = 'rgba(' + this.colours.r + ',' + this.colours.g + ',' + this.colours.b + ', 1)';
		cx.fill();
	};
	Player.prototype.step = function step() {
		this.y += this.dy;
		this.dy += gravity;
	};
	Player.prototype.boost = function boost() {
		if(block) {
			addSmokeParticle(50);
			oB.sing('boost');
			this.dy -= thrust;
		} else {
			addSmokeParticle(10);
		}
	};
	return Player;
}();
var Point = function() {
	function Point(x, y) {
		this.radius = 2;
		this.colours = newColours();
		this.x = x;
		this.y = y;
	};
	Point.prototype.draw = function draw() {
		// Roof:                                
		cx.beginPath();
		cx.arc(this.x, this.y - dis, this.radius, 0, tau);
		cx.fillStyle = 'rgba(' + this.colours.r + ',' + this.colours.g + ',' + this.colours.b + ', 1)';
		cx.fill();
		// Ground:
		cx.beginPath();
		cx.arc(this.x, this.y + caveHeight + dis, this.radius, 0, tau);
		cx.fillStyle = 'rgba(' + this.colours.r + ',' + this.colours.g + ',' + this.colours.b + ', 1)';
		cx.fill();
	};
	return Point;
}();
var drawLines = function() {
	for(var p = 0; p < points.length; p++) {
		if(p < points.length - 1) {
			var point = points[p];
			var nextPoint = points[p + 1];
			var colours = newColours();
			// Roof:
			cx.beginPath();
			cx.moveTo(point.x, point.y - dis);
			cx.lineTo(nextPoint.x, nextPoint.y - dis);
			cx.lineWidth = 1;
			cx.strokeStyle = 'rgba(' + colours.r + ',' + colours.g + ',' + colours.b + ', 1)';
			cx.stroke();
			// Ground:
			cx.beginPath();
			cx.moveTo(point.x, point.y + caveHeight + dis);
			cx.lineTo(nextPoint.x, nextPoint.y + caveHeight + dis);
			cx.lineWidth = 1;
			cx.strokeStyle = 'rgba(' + colours.r + ',' + colours.g + ',' + colours.b + ', 1)';
			cx.stroke();
		}
	}
};
var newColours = function(){
	var r = Math.floor(rand(0, 128));
	var g = Math.floor(rand(0, 64));
	var b = Math.floor(rand(128, 255));
	return {
		r: r,
		g: g,
		b: b
	};
};
var groundYatX = function(x){
	for(var p = 0; p < points.length; p++) {
		var point = points[p];
		if(x < point.x + sectionWidth && x > point.x - sectionWidth) { //敏感地带
			return point.y;
		}
	}
};
var gameOver = function(){
	window.cancelAnimationFrame(animationFrameId);
	gameOverMessage.innerHTML = '<h1>Game Over</h1><h2>Distance: ' + Math.floor(distance / 10) + '</h2>';
};
var checkCollision = function(){
	var groundY = groundYatX(player.x);
	if(player.y - player.radius <= groundY - dis || player.y + player.radius >= groundY + caveHeight + dis) {
		single=false;
		stop=true;
		oB.cancel('game');
		oB.cancel('thrust');
		gameOver();
		oB.sing('die');
		checkScore();
	}
};
var checkScore = function(){//生成localtorage
	if(!localStorage.highScore){
		localStorage.highScore = 0;
		result=0;
	}else{
		result=localStorage.highScore;
		if(localStorage.highScore < score){
		   localStorage.highScore = score;
	    }
	}	
}
//背景animation
var recalcMovement = function() {
	for(var i = 0; i < Starfield.length - 1; i++) {
		var newX = Starfield[i].x - deltaX;
		if(newX < 0) {
			newX += COORDINATE_LENGTH
		}
		if(newX > COORDINATE_LENGTH) {
			newX -= COORDINATE_LENGTH
		}
		Starfield[i].x = newX;
	}
};
var drawing = function() {
	cx.clearRect(0, 0, width, height);
	cx.fillStyle = "black";
	cx.fillRect(0, 0, width, height);
	for(var i = 0; i < Starfield.length; i++) {
		var coords = Starfield[i].mapXYToCanvasCoordinates(width, height);
		cx.fillStyle = Starfield[i].color;
		if(i % 9 !== 0) {
			cx.fillRect(coords.x, coords.y, Starfield[i].size, Starfield[i].size);
		} else {
			if(Starfield[i].size > 2) {
				Starfield[i].size = 0.8;
			} else {
				Starfield[i].size += 0.02;
			}
			cx.fillRect(coords.x, coords.y, Starfield[i].size, Starfield[i].size);
		}
	}
};
var loop =function(){
	if(block) {
		distance++;
	} else {
		distance += 5;
	}
	var details = document.getElementById('details');
	var groundY = groundYatX(player.x);
	score = Math.floor(distance / 10);
	details.innerHTML = 'highScore: '+result+'  Distance: ' + score;
	animationFrameId = window.requestAnimationFrame(loop); //调取动画    
	cx.clearRect(0, 0, width, height);
	document.onkeydown = function(ev) {
		if(ev.keyCode == 32) {
			if(!stop){
				player.boost();
			}			
			player.dy = -rand(2, 4);
		}
		if(ev.keyCode == 37) {
			block = true;
			speed = 15;
			oB.cancel('thrust');
			deltaX = 10;
			if(!stop){
				single=true;
			}			
		}
		if(ev.keyCode == 38) {
			dis++;
		}
		if(ev.keyCode == 39) {
			block = false;
			speed = 30;
			deltaX = 100;
			if(single){
				oB.singLoop('thrust');
			}
			single=false;
		}
		if(ev.keyCode == 40) {
			dis--;
		}
	};
	document.onkeyup = function(ev) {
		if(ev.keyCode == 32) {
			addSmokeParticle(50);
		}
	};
	if(!block) {
		player.boost();
	}
	if(points.length === 0 || points[points.length - 1].x <= width - sectionWidth) {
		var x = width;
		var yTemp = noise.simplex2(count, count); //noise函数获取随机数(柏林噪音)
		count += 0.05;
		var y = yTemp * 50 + groundHeight;
		points.push(new Point(x, y));
		if(points.length > numPoints) {
			points.shift();
		}
	}
	drawing();
	recalcMovement();
	for(var p = 0; p < points.length; p++) {
		var point = points[p];
		point.x -= speed;
		point.draw();
	}
	drawLines();
	player.step();
	player.draw();
	for(var s = 0; s < smoke.length; s++) {
		var smokeParticle = smoke[s];
		smokeParticle.step();
		smokeParticle.draw();
		if(smokeParticle.age >= smokeParticle.lifeSpan) {
			smoke.shift();
		}
	}
	checkCollision();
}
var init = function(){
	checkScore();
	oB.singLoop('start');
	c = document.querySelector('canvas');
	width = c.width = window.innerWidth;
	height = c.height = window.innerHeight;
	cx = c.getContext('2d');
	window.addEventListener('resize', function() {
		width = c.width = window.innerWidth;
		height = c.height = window.innerHeight;
	}, false);
	count = 0;
	distance = 0;
	caveHeight = height / 3;
	groundHeight = (height - caveHeight) / 2;
	points = [];
	smoke = [];
	gameOverMessage.innerHTML = '';
	numPoints = Math.ceil(width * 2 / sectionWidth);
	player = new Player(width / 2, height / 4);
}
init();




