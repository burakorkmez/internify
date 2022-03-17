const sliders = document.querySelector('.carousel-box');

const sidebarItems = Array.from(
	document.querySelectorAll('.sidebar-list-item')
);
const title = document.querySelector('.title');

sidebarItems.forEach((item) => {
	item.addEventListener('click', (e) => {
		sidebarItems.forEach((i) => i.classList.remove('active'));
		e.target.classList.add('active');
		title.textContent = e.target.textContent;
	});
});

/* Making slider arrows work */

let scrollPerClick = 400;
let imagePadding = 20;
let scrollAmount = 0;

function sliderScrollLeft() {
	sliders.scrollTo({
		top: 0,
		left: (scrollAmount -= scrollPerClick),
		behavior: 'smooth',
	});

	if (scrollAmount < 0) {
		scrollAmount = 0;
	}
}

function sliderScrollRight() {
	console.log(scrollAmount, sliders.scrollWidth - sliders.clientWidth);
	console.log(sliders.clientWidth);
	if (scrollAmount <= sliders.scrollWidth - sliders.clientWidth) {
		console.log('yes');
		sliders.scrollTo({
			top: 0,
			left: (scrollAmount += scrollPerClick),
			behavior: 'smooth',
		});
		console.log(scrollAmount);
	}
}

/* Making carousel draggable */
let isDown = false;
let startX;
let scrollLeft;

sliders.addEventListener('mousedown', (e) => {
	isDown = true;
	sliders.classList.add('active');
	startX = e.pageX - sliders.offsetLeft;
	scrollLeft = sliders.scrollLeft;
});
sliders.addEventListener('mouseleave', () => {
	isDown = false;
	sliders.classList.remove('active');
});
sliders.addEventListener('mouseup', () => {
	isDown = false;
	sliders.classList.remove('active');
});
sliders.addEventListener('mousemove', (e) => {
	if (!isDown) return;
	e.preventDefault();
	const x = e.pageX - sliders.offsetLeft;
	const walk = (x - startX) * 2; // the bigger multiplication the faster scroll
	sliders.scrollLeft = scrollLeft - walk;
});

// fetching products from product-list.json
fetch('product-list.json')
	.then((res) => res.json())
	.then((data) => console.log(data.responses[0][0].params.recommendedProducts));
