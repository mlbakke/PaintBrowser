// CANVAS
const canvas = document.querySelector('#draw');
const ctx = canvas.getContext('2d');

ctx.lineWidth = '1';

// FIT CANVAS TO WINDOW
function resize() {
	canvas.width = window.innerWidth - 4;
	canvas.height = window.innerHeight - 38;
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
brush.addEventListener('click', toggleBrushes);
colorIcon.addEventListener('click', () => colorPicker.click());
eraser.addEventListener('click', () => (ctx.strokeStyle = 'white'));

// BRUSH TOOL
// brush stroke variables
let join = 'round';
let cap = 'round';
let rotation;
let currentBrush = 'paint';
const paint = document.querySelector('.paint');
const spray = document.querySelector('.spray');
const connectingBrush = document.querySelector('.brush-3');
// get random float for spray paint
function getRandomFloat(min, max) {
	return Math.random() * (max - min) + min;
}

function toggleBrushes() {
	const dropdown = document.querySelector('.dropdown');
	dropdown.classList.toggle('active');
}

//choosing a brush
paint.addEventListener('click', function() {
	ctx.restore;
	currentBrush = 'paint';
	join = 'round';
	cap = 'round';
	toggleBrushes();
});

spray.addEventListener('click', function() {
	ctx.restore;
	currentBrush = 'spray';
	join = 'round';
	cap = 'round';
	toggleBrushes();
});

connectingBrush.addEventListener('click', function() {
	ctx.restore;
	currentBrush = 'connectingBrush';
	join = 'round';
	cap = 'round';
	toggleBrushes();
});

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
			if (d < 1000) {
				ctx.beginPath();
				ctx.strokeStyle = `rgba(${rgb.toString()}, 0.25)`;
				ctx.moveTo(points[points.length - 1].x + dx * 0.2, points[points.length - 1].y + dy * 0.2);
				ctx.lineTo(points[i].x - dx * 0.2, points[i].y - dy * 0.2);
				ctx.stroke();
			}
		}
	}
}

// Draw while mouse is clicked
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

//Connecting brush
canvas.addEventListener('mouseup', () => (points.length = 0));
