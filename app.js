import { fetchMovieAvailability, fetchMovieList } from './api.js';
fetchMovieList().then(data => {
	show(data);
});
function show(data) {
	document.getElementById('loader').remove();
	const pNode = document.getElementsByTagName('main')[0];
	const pNode2 = document.createElement('div');
	pNode2.className = 'movie-holder';
	pNode.append(pNode2);
	for (let elem of data) {
		const cNode = document.createElement('a');
		cNode.className = 'movie-link';
		cNode.href = `/${elem.name}`;
		cNode.innerHTML = `<div class="movie" data-d="${elem.name}">
    <div class="movie-img-wrapper" style="background-image: url('${elem.imgUrl}');">
    </div>
    <h4>${elem.name}</h4>
    </div>`;
		cNode.addEventListener('click', func);
		pNode2.append(cNode);
	}
}
function func(event) {
	event.preventDefault();
	const dv = document.createElement('div');
	dv.id = 'loader';
	dv.textContent = 'Loading...';
	const pNode = document.getElementById('booker-grid-holder');
	pNode.append(dv);
	const movieName = event.currentTarget.querySelector('.movie').dataset.d;
	fetchMovieAvailability(movieName).then(data => {
		createGrid(data);
	});
}
let flag = false;
function createGrid(data) {
	document.getElementById('loader').remove();
	if (flag) return;
	flag = true;
	const pNode = document.getElementById('booker-grid-holder');
	// pNode.innerHTML='';
	document.querySelector('h3').classList.toggle('v-none');
	const cNode1 = document.createElement('div');
	const cNode2 = document.createElement('div');
	cNode1.className = 'booking-grid';
	cNode2.className = 'booking-grid';
	pNode.append(cNode1, cNode2);
	for (let i = 1; i <= 12; i++) {
		const dv = document.createElement('div');
		dv.id = `booking-grid-${i}`;
		dv.textContent = i;
		if (data.includes(i)) dv.className = 'unavailable-seat';
		else {
			dv.className = 'available-seat';
			dv.addEventListener('click', func2);
		}
		cNode1.append(dv);
	}
	for (let i = 13; i <= 24; i++) {
		const dv = document.createElement('div');
		dv.id = `booking-grid-${i}`;
		if (data.includes(i)) dv.className = 'unavailable-seat';
		else {
			dv.className = 'available-seat';
			dv.addEventListener('click', func2);
		}
		dv.textContent = i;
		cNode2.append(dv);
	}
}
function func2(event) {
	if (!event.currentTarget.className.includes('selected-seat'))
		event.currentTarget.classList.add('selected-seat');
	else event.currentTarget.classList.remove('selected-seat');
	if (document.getElementsByClassName('selected-seat').length > 0)
		document.getElementById('book-ticket-btn').className = '';
	else document.getElementById('book-ticket-btn').className = 'v-none';
}
document.getElementById('book-ticket-btn').addEventListener('click', func3);
const seats = [];
function func3() {
	const booker = document.getElementById('booker');
	const sts = document.getElementsByClassName('selected-seat');
	for (let elem of sts) {
		seats.push(elem.textContent);
	}
	booker.innerHTML = '';
	const dv = document.createElement('div');
	dv.id = 'confirm-purchase';
	booker.append(dv);
	const h = document.createElement('h3');
	h.textContent = `Confirm your booking for seat numbers:${seats.join(',')}`;
	dv.append(h);
	const frm = document.createElement('form');
	frm.id = 'customer-detail-form';
	frm.setAttribute('onsubmit', 'event.preventDefault();');
	dv.append(frm);
	frm.innerHTML = `<div>Email <input type="email" required/> </div>
    <div>Phone number <input type="tel" required/></div>
    <div><button type="submit">Purchase</button> </div>`;
	document.querySelector('button').addEventListener('click', func4);
}
function func4() {
	const inptdata = document.getElementsByTagName('input');
	const email = inptdata[0].value;
	const pNumber = inptdata[1].value;
	const booker = document.getElementById('booker');
	booker.innerHTML = '';
	const dv = document.createElement('div');
	dv.id = 'success';
	booker.append(dv);
	dv.innerHTML = `<h3>Booking details</h3>
    <div>Seats: ${seats.join(', ')}</div>
    <div>Phone number:${pNumber}</div>
    <div>Email:${email}</div>`;
}
