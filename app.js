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
const brush = document.querySelector('#brush');
const thickness = document.querySelector('#thickness');
const eraser = document.querySelector('#eraser');
const colorIcon = document.querySelector('#color');
const colorPicker = document.querySelector('#hex');
const bucket = document.querySelector('#bucket');
// tools eventListeners
brush.addEventListener('click', openBrushes);
colorIcon.addEventListener('click', () => colorPicker.click());
colorPicker.addEventListener('change', () => (ctx.strokeStyle = colorPicker.value));
eraser.addEventListener('click', () => (ctx.strokeStyle = 'white'));
bucket.addEventListener('click', useBucket);
// tools functionality
function openBrushes() {
	console.log('åpner brush-velger');
}
function useBucket() {
	console.log('mal alt');
}

// DRAWING
// drawing variables
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// drawing functionality
function draw(e) {
	if (!isDrawing) return; //don't run when not moused
	ctx.lineWidth = thickness.value;
	ctx.lineJoin = 'round';
	ctx.lineCap = 'round';
	//start painting
	ctx.beginPath();
	//start from -> go to
	ctx.moveTo(lastX, lastY);
	ctx.lineTo(e.offsetX, e.offsetY);

	ctx.stroke();
	//update lastX and lastY
	lastX = e.offsetX;
	lastY = e.offsetY;
}

// Draw while mouse is clicked
canvas.addEventListener('mousedown', (e) => {
	isDrawing = true;
	[ lastX, lastY ] = [ e.offsetX, e.offsetY ];
});
canvas.addEventListener('mousemove', draw);
// Don't draw when mouse isn't clicked
canvas.addEventListener('mouseup', () => (isDrawing = false));
canvas.addEventListener('mouseout', () => (isDrawing = false));
