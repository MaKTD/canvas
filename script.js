var doc = document;

var size = doc.getElementById('sizeSelect');
var newColor = doc.getElementById('color');
var canvas = doc.getElementById('canv');
var ctx = canvas.getContext('2d');
var xCoord = doc.getElementById('xCoord');
var yCoord = doc.getElementById('yCoord');
var tools = ['brush', 'rectangle'];
var activeTool = '';


var system = {
	width: canvas.getAttribute('width'),
	height: canvas.getAttribute('height'),
	currentColor: newColor.value,
	currentTool: '',
	brushSize : size.value
};

//рендер Системы
var renderSystem = function (obj, elem, action) {
	obj[elem] = action;
};

//Получение коодинат
var getCoordinates = function (evt) {
	let mas = {};
	let x = evt.offsetX;
	let y = evt.offsetY;

	mas = {x : x, y : y};
	xCoord.innerText = x;
	yCoord.innerText = y;

	return mas;
};

//Изменение размера кисти
var switchSize = function (list) {
	return list.value;
};

//Изменение размера кисти
var switchColor = function (colorInput) {
	return colorInput.value;
};

//Изменение инструмента
var switchTool = function (button) {
	if (button.id == 'brush') {
		return 'brush'
	} else if (button.id == 'notbrush') {
		return 'not_brush'
	} else if (button.id == 'notbrush2') {
		return 'not_brush_2'
	}
};

//Мышинные события (клики)
var mouseActionsClick = function (evt) {
	if (evt.target.classList.contains('toolButton') == true) {
		renderSystem (system, 'currentTool', switchTool (evt.target));
	} else if (evt.target.id == 'sizeSelect') {
		renderSystem (system, 'brushSize', switchSize (evt.target));
	} else if (evt.target.id == 'color') {
		renderSystem (system, 'currentColor', switchColor (evt.target));
	}

};


//НЕПОСРЕДСТВЕННО РИСОВАНИЕ

var startDraw = function (evt) {
	if (system.currentTool == 'brush') {
		drawLines (evt);
	}
};

var endDraw = function (evt) {
	canvas.onmousemove = null;
};

var drawLines = function (evt) {
	canvas.onmousemove = function (evt) {
		ctx.beginPath ();
		ctx.fillStyle = system.currentColor;
		ctx.fillRect (xCoord.innerText, yCoord.innerText, system.brushSize, system.brushSize);
	}
};

canvas.addEventListener ('mousemove', getCoordinates); //активация получения координат
doc.addEventListener ('click', mouseActionsClick); //активация кликов
canvas.addEventListener ('mousedown', startDraw);
canvas.addEventListener ('mouseup', endDraw);