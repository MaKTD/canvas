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
	} else if (button.id == 'pencel') {
		return 'pencel'
	} else if (button.id == 'rubber') {
		return 'rubber'
	} else if (button.id == 'line') {
		return 'line'
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
	} else if (system.currentTool == 'fill') {
		console.log('hi');
	} else if (system.currentTool == 'pencel') {
		pencelLines(evt);
	} else if (system.currentTool == 'rubber') {
		rubber(evt);
	} else if (system.currentTool == 'line') {
		endLine();
		
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


var pencelLines = function (evt) {
	let lastPointx;
	let lastPointy;
	canvas.onmousemove = function(evt) {
		ctx.beginPath();
		ctx.strokeStyle = system.currentColor;
		ctx.lineWidth = system.brushSize;
		ctx.moveTo(lastPointx, lastPointy);
		ctx.lineTo(evt.offsetX, evt.offsetY);
		ctx.stroke();
		lastPointx = event.offsetX;
		lastPointy = event.offsetY;
	}

};

var rubber = function (evt) {
	canvas.onmousemove = function (evt) {
		ctx.beginPath ();
		ctx.fillStyle = 'white';
		ctx.arc(xCoord.innerText, yCoord.innerText, system.brushSize, 0, 360, false);
		ctx.fill();
	}
}

var startLine = function(evt) {
	let arr = [xCoord.innerText, yCoord.innerText];
	return arr




};

var endLine = function (evt) {
	let point = startLine();
	canvas.onclick = function (evt) {
		console.log(point);
		ctx.beginPath();
		ctx.strokeStyle = system.currentColor;
		ctx.lineWidth = system.brushSize;
		ctx.moveTo(evt.offsetX, evt.offsetY);
		ctx.lineTo(point[0], point[1]);
		ctx.stroke(); 
	}

};


// Заливка
/**
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
**/



canvas.addEventListener ('mousemove', getCoordinates); //активация получения координат
doc.addEventListener ('click', mouseActionsClick); //активация кликов
colorChangeBut.addEventListener("input", addColor);
canvas.addEventListener ('mousedown', startDraw);
canvas.addEventListener ('mouseup', endDraw);



// var ClickMode = {
//     Paint: 0,
//     Fill: 1
// };
// var mouseDown = false;
// var currentMode = ClickMode.Paint;
// var ctx = $('#canvas').get(0).getContext('2d');
// ctx.lineWidth = 3;
// var lastPoint = {x: 0, y: 0};

// $('#canvas').mousedown(function(event){
//     if (currentMode == ClickMode.Paint)
//     {
//         mouseDown = true;
//         lastPoint.x = event.offsetX;
//         lastPoint.y = event.offsetY;
//     }
//     else
//         floodFill(event.offsetX, event.offsetY, 147, 147);
//     return false;
// }).mousemove(function(event){
//     if (mouseDown)
//     {
//         ctx.beginPath();
//         ctx.moveTo(lastPoint.x, lastPoint.y);
//         ctx.lineTo(event.offsetX, event.offsetY);
//         ctx.stroke();
        
//         lastPoint.x = event.offsetX;
//         lastPoint.y = event.offsetY;
//     }
// }).mouseup(function(){
//     mouseDown = false;
//     return false
// });