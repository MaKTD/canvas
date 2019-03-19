var doc = document;

var colorChangeBut = doc.querySelector('.add-color-but');
var download = doc.getElementById('download');
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
	} else if (button.id == 'rectangle') {
		return 'rectangle'
	} else if (button.id == 'circle') {
		return 'circle'
	} else if (button.id == 'txt') {
		return 'txt'
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
	}
};


//НЕПОСРЕДСТВЕННО РИСОВАНИЕ
var startDraw = function (evt) {
	if (system.currentTool == 'brush') {
		drawLines (evt);
	} else if (system.currentTool == 'fill') {
		fillPoligon(evt);
		console.log(colorConverter(system.currentColor));
	} else if (system.currentTool == 'pencel') {
		pencelLines(evt);
	} else if (system.currentTool == 'rubber') {
		rubber(evt);
	} else if (system.currentTool == 'line') {
		endLine();
	} else if (system.currentTool == 'rectangle') {
		reactangle(evt);
	} else if (system.currentTool == 'circle') {
		circle(evt);
	} else if (system.currentTool == 'txt') {
		canvas.oncontextmenu = function () {return false};
		canvasText(evt);
	}
};

var endDraw = function (evt) {
	canvas.onmousemove = null;
};


// кисть 
var drawLines = function (evt) {
	canvas.onmousemove = function (evt) {
		ctx.beginPath ();
		ctx.fillStyle = system.currentColor;
		ctx.arc(xCoord.innerText, yCoord.innerText, system.brushSize, 0, 360, false);
		ctx.fill();
	}
};

// карандаш
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

// Резинка
var rubber = function (evt) {
	canvas.onmousemove = function (evt) {
		ctx.beginPath ();
		ctx.fillStyle = 'white';
		ctx.arc(xCoord.innerText, yCoord.innerText, system.brushSize, 0, 360, false);
		ctx.fill();
	}
}

// прямая линия 
var startLine = function(evt) {
	let arr = [xCoord.innerText, yCoord.innerText];
	return arr
};
var endLine = function (evt) {
	let point = startLine();
	canvas.onclick = function (evt) {
		ctx.beginPath();
		ctx.strokeStyle = system.currentColor;
		ctx.lineWidth = system.brushSize;
		ctx.moveTo(evt.offsetX, evt.offsetY);
		ctx.lineTo(point[0], point[1]);
		ctx.stroke();
		point = [];
	}

};

// прямоугольник 
var reactangle = function (evt) {
	let point = startLine();
	canvas.onclick = function (evt) {
		ctx.beginPath();
		ctx.strokeStyle = system.currentColor;
		ctx.lineWidth = system.brushSize;
		ctx.rect(point[0], point[1], (evt.offsetX - point[0]), (evt.offsetY - point[1]));
		ctx.stroke();
		point = [];
	}
};

// окружность 
var circle = function (evt) {
	let point = startLine();
	canvas.onclick = function (evt) {
		ctx.beginPath();
		console.log(point);
		ctx.strokeStyle = system.currentColor;
		ctx.lineWidth = system.brushSize;
		ctx.arc(point[0], point[1], (Math.sqrt(Math.pow((evt.offsetX - point[0]), 2) + Math.pow((evt.offsetY - point[1]), 2))) , 0, 2*Math.PI);
		ctx.stroke();
		point = [];
	}
};


// сохранение

var getImage = function (canva) {
	let imageData = canva.toDataURL();
	let image = new Image();
	image.src = imageData;
	return image
};
var saveImage = function(img) {
	let link = doc.createElement("a");
	link.setAttribute("href", img.src);
	link.setAttribute("download", "canvasImage");
	link.click();
};
var saveCanv = function () {
	let image = getImage(canvas);
	saveImage(image);
};

// текст
var txtEditorCreating = function (evt) {
	let input = doc.createElement("input");
	input.setAttribute('type', 'text');
	input.classList.add('text');
	input.setAttribute("style", "top: " + evt.offsetY + "px" + "; " + "left: " + evt.offsetX + "px" + "; " + "font:" + system.brushSize + "px " + "Arial, serif;" + "color: " + system.currentColor + ";");
	var wrap = doc.getElementsByClassName('canv-wrapper').item(0);
	wrap.appendChild(input);
};
var txtEditorDeleting = function (evt) {
	let input = doc.getElementsByClassName('text').item(0);
	input.remove();	

};
var textDrawing = function (evt) {
	if (evt.which == 3) {
		txtEditorCreating(evt);
	} else if (evt.which == 1) {
		input = doc.getElementsByClassName('text').item(0);
		ctx.beginPath();
		ctx.font = system.brushSize + "px" + " Arial";
		ctx.fillText(input.value, evt.offsetX, evt.offsetY);
		txtEditorDeleting(evt);
	}
};
var canvasText = function (evt) {
	let wind = doc.getElementsByClassName('canv-wrapper').item(0);
	wind.oncontextmenu = function () {return false};
	canvas.addEventListener('mousedown', textDrawing(evt));
};



// Заливка
var getColorAtPixel = function(imageData, x, y) {
	const {width, data} = imageData;
	return {
	    r: data[4 * (width * y + x) + 0],
	    g: data[4 * (width * y + x) + 1],
	    b: data[4 * (width * y + x) + 2],
	    a: data[4 * (width * y + x) + 3]
	  }
	};

var setColorAtPixel = function(imageData, color, x, y) {
	const {width, data} = imageData;

	data[4 * (width * y + x) + 0] = color.r & 0xff;
	data[4 * (width * y + x) + 1] = color.g & 0xff;
	data[4 * (width * y + x) + 2] = color.b & 0xff;
	data[4 * (width * y + x) + 3] = color.a & 0xff;

};

var colorMatch = function(a, b) {
	return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a
};


var floodFill = function(imageData, newColor, x, y) {
	const {width, height, data} = imageData;
	const stack = [];
	const baseColor = getColorAtPixel(imageData, x, y);
	let operator = {x, y};

	if (colorMatch(baseColor, newColor)) {
		return
	}
	stack.push({x: operator.x, y: operator.y}); // первональная точка

	// берем точку
	while (stack.length) {
	  operator = stack.pop();
	  let contiguousDown = true;// первональное сравнение по верху
	  let contiguousUp = true;// первональное сравнение по верху
	  let contiguousLeft = false;
	  let contiguousRight = false;

	// идем в смежную точку
	while (contiguousUp && operator.y >= 0) {
	  operator.y--;
	  contiguousUp = colorMatch(getColorAtPixel(imageData, operator.x, operator.y), baseColor);
	}

	// идем в низ с заливкой
	while (contiguousDown && operator.y < height) {
	  setColorAtPixel(imageData, newColor, operator.x, operator.y);

	// проверяем левые точки
	if (operator.x - 1 >= 0 && colorMatch(getColorAtPixel(imageData, operator.x - 1, operator.y), baseColor)) {
	  if (!contiguousLeft) {
	    contiguousLeft = true;
	    stack.push({x: operator.x - 1, y: operator.y}); // добавляем в стек на проверку
	  }
	} else {
	  contiguousLeft = false;
	}

	// проверяем правые точки
	if (operator.x + 1 < width && colorMatch(getColorAtPixel(imageData, operator.x + 1, operator.y), baseColor)) {
	  if (!contiguousRight) {
	    stack.push({x: operator.x + 1, y: operator.y}); // добавляем в стек на проверку
	    contiguousRight = true;
	  }
	} else {
	  contiguousRight = false;
	}
	operator.y++;
	contiguousDown = colorMatch(getColorAtPixel(imageData, operator.x, operator.y), baseColor);
	}
	}

};

var colorConverter = function (color) {
	if (color == "black") {
		return {r: 0x00, g: 0x00, b: 0x00, a: 0xFF}
	} else if (color == "grey") {
		return {r: 0x80, g: 0x80, b: 0x80, a: 0xFF}
	} else if (color == "silver") {
		return {r: 192, g: 192, b: 192, a: 0xFF}
	} else if (color == "red") {
		return {r: 0xFF, g: 0x00, b: 0x00, a: 0xFF}
	} else if (color == 'orange') {
		return {r: 0xFF, g: 0x80, b: 0x00, a: 0xFF}
	} else if (color == 'yellow') {
		return {r: 0xFF, g: 0xFF, b: 0x00, a: 0xFF}
	} else if (color == 'green') {
		return {r: 0x00, g: 0xFF, b: 0x00, a: 0xFF}
	} else if (color == 'blue') {
		return {r: 0x00, g: 0x00, b: 0xFF, a: 0xFF}
	} else if (color == 'navy') {
		return {r: 0, g: 0, b: 128, a: 0xFF}
	} else if (color == 'aqua') {
		return {r: 0, g: 255, b: 255, a: 0xFF}
	} else if (color == 'teal') {
		return {r: 0, g: 128, b: 128, a: 0xFF}
	} else if (color == 'purple') {
		return {r: 128, g: 0, b: 128, a: 0xFF}
	} else if (color == 'white') {
		return {r: 255, g: 255, b: 255, a: 0xFF}
	} else if (color == 'olive') {
		return {r: 128, g: 128, b: 0, a: 0xFF}
	} else if (color == 'maroon') {
		return {r: 128, g: 0, b: 0, a: 0xFF}
	} else {
		var match = color.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
		return {r: match[1], g: match[2], b: match[3], a: 0xFF}
	}
};
var fillImageData = function(evt,col) {
	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var rect = canvas.getBoundingClientRect();
	const x = Math.round(event.clientX - rect.left);
	const y = Math.round(event.clientY - rect.top);
	floodFill(imageData, col, x, y);
	ctx.putImageData(imageData, 0, 0);
};

var fillPoligon = function (evt, color) {
	var col = colorConverter(system.currentColor);
	// var col = {r: 255, g: 0, b: 255, a: 0xff};
	console.log(col);
	canvas.addEventListener('click', fillImageData(evt, col));
};





canvas.addEventListener ('mousemove', getCoordinates); //активация получения координат
doc.addEventListener ('click', mouseActionsClick); //активация кликов
colorChangeBut.addEventListener("input", addColor);
canvas.addEventListener ('mousedown', startDraw);
canvas.addEventListener ('mouseup', endDraw);
download.addEventListener ('click', saveCanv);



 