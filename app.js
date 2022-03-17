const sliders = document.querySelector('.carousel-box');
const sidebarUl = document.querySelector('.sidebar-list');
const title = document.querySelector('.title');
const notificationModal = document.querySelector('.notification-box');
const notificationModalCloseBtn = document.querySelector('.close-btn');
let images;

let products = [];
let categories = [];
let currentCategory;

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
	if (scrollAmount <= sliders.scrollWidth - sliders.clientWidth) {
		sliders.scrollTo({
			top: 0,
			left: (scrollAmount += scrollPerClick),
			behavior: 'smooth',
		});
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

// notificationModal onclick close
notificationModalCloseBtn.addEventListener('click', () => {
	notificationModal.style.transform = 'translateY(10rem)';
	notificationModal.style.opacity = '0';
});

// fetching categories from product-list.json
(async () => {
	const res = await fetch('product-list.json');
	const data = await res.json();
	const userCategories = data.responses[0][0].params.userCategories;

	userCategories.forEach((category, i) => {
		let formattedCategory = category;
		if (category.includes('>')) {
			formattedCategory = category.split('>')[1];
		}
		categories.push({ originalCategoryName: category, formattedCategory });

		sidebarUl.insertAdjacentHTML(
			'beforeend',
			`<li class="sidebar-list-item ${i === 0 ? 'active' : ''}">${
				formattedCategory ? formattedCategory : category
			}</li>
			`
		);

		const sidebarItems = Array.from(
			document.querySelectorAll('.sidebar-list-item')
		);

		// onclick to sidebar-item, add active class and change the textContent of title
		sidebarItems.forEach((item, index) => {
			item.addEventListener('click', (e) => {
				if (!item.classList.contains('active')) {
					sliders.innerHTML = `<div
					class="half-circle half-circle-left"
					onclick="sliderScrollLeft()"
				>
					<span><i class="fa-solid fa-chevron-left arrow"></i></span>
				</div>
				<div
					class="half-circle half-circle-right"
					onclick="sliderScrollRight()"
				>
					<span><i class="fa-solid fa-chevron-right arrow"></i></span>
				</div>`;
					currentCategory = index;
					fetchProducts(index);
				}

				sidebarItems.forEach((i) => i.classList.remove('active'));
				e.target.classList.add('active');
				title.textContent = e.target.textContent;
			});
		});
	});
	title.textContent = categories[0].formattedCategory;
})();

// fetching products from product-list.json
const fetchProducts = async (current = 0) => {
	try {
		const res = await fetch('product-list.json');
		const data = await res.json();
		products =
			data.responses[0][0].params.recommendedProducts[
				categories[current].originalCategoryName
			];

		products.map((product, index) => {
			sliders.insertAdjacentHTML(
				'beforeend',
				`<div class="card">
				<img
					
					data-src=${product.image}
					alt=""
				/>

				<h2 class="desc">
					${product.name.length > 50 ? product.name.slice(0, 51) + '...' : product.name}
				</h2>
				<p class="price">${product.priceText}</p>
				${
					product.params.shippingFee === 'FREE'
						? '<div class="cargo"><i class="fa-solid fa-truck" style="color: green"></i><p> Ücretsiz Kargo</p></div>'
						: ''
				}
				<button class="add-to-basket">Sepete Ekle</button>
			</div>`
			);
		});

		const buttons = Array.from(document.querySelectorAll('.add-to-basket'));

		// lazy loading the images
		images = document.querySelectorAll('[data-src]');
		images.forEach((image) => {
			imgObserver.observe(image);
		});
		//

		buttons.forEach((button) => {
			button.addEventListener('click', () => {
				notificationModal.style.transform = 'translateY(0)';
				notificationModal.style.opacity = '1';

				setTimeout(() => {
					notificationModal.style.transform = 'translateY(10rem)';
					notificationModal.style.opacity = '0';
				}, 6000);
			});
		});
	} catch (err) {
		console.log(err);
	}
};

fetchProducts();

const imgOptions = { threshold: 0, rootMargin: '0px 0px 300px 0px' };
const imgObserver = new IntersectionObserver((entries, imgObserver) => {
	entries.forEach((entry) => {
		if (!entry.isIntersecting) return;
		preloadImg(entry.target);
		imgObserver.unobserve(entry.target);
	});
}, imgOptions);

const preloadImg = (img) => {
	const src = img.getAttribute('data-src');
	if (!src) return;
	img.src = src;
};
