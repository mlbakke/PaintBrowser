// CANVAS
const canvas = document.querySelector('#draw');
const ctx = canvas.getContext('2d');

// FIT CANVAS TO WINDOW
function resize() {
	canvas.width = window.innerWidth - 4;
	canvas.height = window.innerHeight - 38;
}

window.addEventListener('load', resize);
window.addEventListener('resize', resize);

// PAINT FUNCTION
