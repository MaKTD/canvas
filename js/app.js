var doc = document;



var colorChangeBut = doc.querySelector('.add-color-but');
var templ = doc.querySelector('.add-color-template').content;
var defaultColors = doc.getElementsByClassName('def-color-button');
var size = doc.getElementById('sizeSelect');
var canvas = doc.getElementById('canv');
var canvWidth = canvas.getAttribute('width');
var canvHeight = canvas.getAttribute('height');
var xCoord = doc.getElementById('xCoord');
var yCoord = doc.getElementById('yCoord');
var ctx = canvas.getContext('2d');


var system = {
	width: canvas.getAttribute('width'),
	height: canvas.getAttribute('height'),
	currentColor: 'black',
	previousColor: 'black',
	currentTool: 'brush',
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

//Изменение инструмента
var switchTool = function (button) {
	if (button.id == 'brush') {
		return 'brush'
	} else if (button.id == 'fill') {
		return 'fill'
	}
};


// добавление цветов 
var addColor = function (evt) {
	let newColor = templ.cloneNode(true);
	let newBut = newColor.querySelector('.def-color-button');
	newBut.classList.add(evt.target.value);
	newBut.style.backgroundColor = evt.target.value;
	doc.querySelector('.color-wrapper').appendChild(newBut);
}


//Мышинные события (клики)
var mouseActionsClick = function (evt) {
	if (evt.target.classList.contains('toolButton') == true) {
		renderSystem (system, 'currentTool', switchTool (evt.target));
	} else if (evt.target.id == 'sizeSelect') {
		renderSystem (system, 'brushSize', switchSize (evt.target));
	} else if (evt.target.classList.contains('def-color-button')) {
		system.previousColor = system.currentColor;
		renderSystem (system, 'currentColor', evt.target.style.backgroundColor);
		console.log(system.currentColor);
	} 
};

//НЕПОСРЕДСТВЕННО РИСОВАНИЕ
var startDraw = function (evt) {
	if (system.currentTool == 'brush') {
		drawLines (evt);
	} if (system.currentTool == 'fill') {
		floodFill(evt.offsetX, evt.offsetY, 5, 5);
	}
};

var endDraw = function (evt) {
	canvas.onmousemove = null;
};


var drawLines = function (evt) {
	canvas.onmousemove = function (evt) {
		ctx.beginPath ();
		ctx.fillStyle = system.currentColor;
		ctx.arc(xCoord.innerText, yCoord.innerText, system.brushSize, 0, 360, false);
		ctx.fill();
	}
};

// Заливка

function floodFill(x, y, color, borderColor){
    var imageData = ctx.getImageData(0, 0, 800, 500);
    var width = imageData.width;
    var height = imageData.height;
    var stack = [[x, y]];
    var pixel;
    var point = 0;
    while (stack.length > 0)
    {   
        pixel = stack.pop();
        if (pixel[0] < 0 || pixel[0] >= width)
            continue;
        if (pixel[1] < 0 || pixel[1] >= height)
            continue;
        
        // Alpha
        point = pixel[1] * 4 * width + pixel[0] * 4 + 3;
        
        // Если это не рамка и ещё не закрасили
        if (imageData.data[point] != borderColor && imageData.data[point] != color)
        {
            // Закрашиваем
            imageData.data[point] = color;
            console.log(imageData.data[point])
            
            // Ставим соседей в стек на проверку
            stack.push([
                pixel[0] - 1,
                pixel[1]
            ]);
            stack.push([
                pixel[0] + 1,
                pixel[1]
            ]);
            stack.push([
                pixel[0],
                pixel[1] - 1
            ]);
            stack.push([
                pixel[0],
                pixel[1] + 1
            ]);
        }
    }
    ctx.putImageData(imageData, 0, 0);
}




canvas.addEventListener ('mousemove', getCoordinates); //активация получения координат
doc.addEventListener ('click', mouseActionsClick); //активация кликов
colorChangeBut.addEventListener("input", addColor);
canvas.addEventListener ('mousedown', startDraw);
canvas.addEventListener ('mouseup', endDraw);