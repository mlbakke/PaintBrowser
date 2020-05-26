// CANVAS
const canvas = document.querySelector('#draw');
const ctx = canvas.getContext('2d');
// canvas widht and height
let w = canvas.width,
	h = canvas.height;

// FIT CANVAS TO WINDOW
function resize() {
	// save current painting
	let temp = ctx.getImageData(0, 0, w, h);
	canvas.width = window.innerWidth - 4;
	canvas.height = window.innerHeight - 38;
	(w = canvas.width), (h = canvas.height);
	//keep current painting when resizing window
	ctx.putImageData(temp, 0, 0);
}

window.addEventListener('load', resize);
window.addEventListener('resize', resize);

// TOOLBAR
// tool variables
const brush = document.querySelector('.brush-icon');
const thickness = document.querySelector('#thickness');
const eraser = document.querySelector('#eraser');
const colorIcon = document.querySelector('#color');
const colorPicker = document.querySelector('#hex');

// tools eventListeners
colorIcon.addEventListener('click', () => colorPicker.click());
eraser.addEventListener('click', () => (ctx.strokeStyle = 'white'));

// BRUSH TOOL
// brush stroke variables
let join = 'round';
let cap = 'round';
let rotation;
let currentBrush = 'paint';
const select = document.querySelector('.dropdown');
//default lineWidth
ctx.lineWidth = '1';

// get random float for spray paint
function getRandomFloat(min, max) {
	return Math.random() * (max - min) + min;
}

//choosing a brush
select.addEventListener('change', changeBrush);

function changeBrush(e) {
	if (e.target.value === 'Paint brush') {
		ctx.restore;
		currentBrush = 'paint';
		join = 'round';
		cap = 'round';
		toggleBrushes();
	}
	if (e.target.value === 'Spray paint') {
		ctx.restore;
		currentBrush = 'spray';
		join = 'round';
		cap = 'round';
		toggleBrushes();
	}
	if (e.target.value === 'Connecting brush') {
		ctx.restore;
		currentBrush = 'connectingBrush';
		join = 'round';
		cap = 'round';
		toggleBrushes();
	}
}

// DRAWING
// drawing variables
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// tracker for connecting brush
let points = [];

// drawing functionality
function draw(e) {
	if (!isDrawing) return; //don't run when not moused
	ctx.lineWidth = thickness.value;
	ctx.lineJoin = join;
	ctx.lineCap = cap;
	//start painting
	if (currentBrush === 'paint') {
		ctx.strokeStyle = colorPicker.value;
		ctx.beginPath();
		//start from -> go to
		ctx.moveTo(lastX, lastY);
		ctx.lineTo(e.offsetX, e.offsetY);

		ctx.stroke();
		//update lastX and lastY
		lastX = e.offsetX;
		lastY = e.offsetY;
	} else if (currentBrush === 'spray') {
	} else if (currentBrush === 'connectingBrush') {
		ctx.strokeStyle = colorPicker.value;
		ctx.lineWidth = 1;
		// add current point to points array to keep track of our lines
		points.push({ x: e.clientX, y: e.clientY });
		ctx.beginPath();
		ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y);
		ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
		ctx.stroke();

		//Get rgb color for strokestyle when connecting lines
		const rgb = colorPicker.value
			.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b)
			.substring(1)
			.match(/.{2}/g)
			.map((x) => parseInt(x, 16));

		// go through each point we're drawing to find points closeby
		for (let i = 0, len = points.length; i < len; i++) {
			// for each point.x/point.y subtract last point.x/y
			dx = points[i].x - points[points.length - 1].x;
			dy = points[i].y - points[points.length - 1].y;

			// If a previous point is closeby, draw a line between them
			d = dx * dx + dy * dy;
			if (d < thickness.value * 100) {
				ctx.beginPath();
				ctx.strokeStyle = `rgba(${rgb.toString()}, 0.25)`;
				ctx.moveTo(points[points.length - 1].x + dx * 0.2, points[points.length - 1].y + dy * 0.2);
				ctx.lineTo(points[i].x - dx * 0.2, points[i].y - dy * 0.2);
				ctx.stroke();
			}
		}
	}
}

// Draw while mouse is clicked and moving
canvas.addEventListener('mousedown', (e) => {
	isDrawing = true;
	[ lastX, lastY ] = [ e.offsetX, e.offsetY ];

	if (currentBrush === 'connectingBrush') {
		points.push({ x: e.clientX, y: e.clientY });
	}
});
canvas.addEventListener('mousemove', draw);
// Don't draw when mouse isn't clicked
canvas.addEventListener('mouseup', () => (isDrawing = false));
canvas.addEventListener('mouseout', () => (isDrawing = false));

//Reset points for connecting brush when no longer clicked
canvas.addEventListener('mouseup', () => (points.length = 0));
