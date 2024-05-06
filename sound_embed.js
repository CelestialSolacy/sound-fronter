// Function to load JSON data from a file
function loadJSON(url) {
	return fetch(url)
		.then((response) => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.catch((error) => {
			console.error('There was a problem fetching the data:', error);
		});
}

const jsondata = 'jasonmilei.json';

const subtitles = ['Índice temático', 'NOMBRES', 'DATOS', 'ESTADÍSTICO'];

function popupPlay(timestamp, tsStop, elem) {
	var audio = document.getElementById('myAudio');
	//playFromTimestamp(audio, timestamp)
	currentContainerQuote = elem;
	focus = false;
	stopTime = parseFloat(tsStop);
	audio.currentTime = timestamp;
	audio.play();
}

function getVideoQuote(elem, nombre, lugar, date, audio, data) {
	const popupContainer = elem.parentElement.nextElementSibling;
	popupContainer.classList.toggle('hidden2');
	const dataFull = {
		nombre: nombre,
		lugar: lugar,
		date: date,
		audio: audio,
		data: data,
	};
	var xhr = new XMLHttpRequest();
	xhr.open(
		'POST',
		'https://senecaonthebeach.com/video_generator_files/videos_backend_aux.php',
		true
	);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				// document.getElementById('loader').style.display = 'none'
				// document.getElementById('shareBtnContainer').style.display = 'flex'
				console.log('Request sent successfully!');
				// Retrieve and handle the response here
				var response = xhr.responseText;
				popupContainer.querySelector('.spinner').style.display = 'none';
				popupContainer.querySelector(
					'.popup-video-content'
				).innerHTML = `<video width='500' height='500' src='https://ualtersound.site/videos/${response}' type="video/mp4" controls></video>`;
				popupContainer.querySelector(
					'.popup-video-content'
				).nextElementSibling.innerHTML = `<div class="generate-video-btn" onclick="shareVideoUrl('https://ualtersound.site/videos/${response}')">Compartir</div>`;
				console.log('Response:', response);
			} else {
				console.log('Error:', xhr.status);
			}
		}
	};
	xhr.send(JSON.stringify(dataFull));
	console.log(data[0]);
}

function stopQuote(elem) {
	const buttons = elem.parentElement.querySelectorAll('button');
	buttons[1].style.display = 'inline-block';
	elem.style.display = 'none';
	var audio = document.getElementById('myAudio');
	audio.pause();
}

function playQuote(tsStart, tsStop, elem) {
	var audio = document.getElementById('myAudio');
	currentContainerQuote = elem.parentElement.previousElementSibling;
	const buttons = elem.parentElement.querySelectorAll('button');
	buttons[0].style.display = 'inline-block';
	elem.style.display = 'none';
	stopTime = parseFloat(tsStop);
	audio.currentTime = tsStart;
	audio.play();
}

function fixPlayQuoteBtns(elem) {
	const buttons = elem.nextElementSibling.querySelectorAll('button');
	buttons[0].style.display = 'inline-block';
	buttons[1].style.display = 'none';
}

function showPopupContexto(element) {
	var content = element.getAttribute('data-context');
	var startTime = element.getAttribute('data-ts');
	var stopTime = element.getAttribute('data-ts-stop');

	// Display the popup
	var popup = document.getElementById('popup');
	var popupContent = document.getElementById('popup-content');
	var popupHeader = document.getElementById('popup-title');
	var datosContainer = document.getElementById('datos-expandable');

	popupHeader.innerHTML = element.innerHTML;
	popupContent.innerHTML = `<span class='popupSpanContainer' onclick='popupPlay(${startTime}, ${stopTime}, this)' data-ts='${startTime}' data-ts-stop='${stopTime}'>${content}</span>`;

	var containerRect = datosContainer.getBoundingClientRect();
	var buttonRect = element.getBoundingClientRect();
	var popupRect = popup.getBoundingClientRect();
	popup.style.top = buttonRect.top - containerRect.top + buttonRect.height;

	popup.style.display = 'block';

	//100 + 10*element.getAttribute("data-index") + buttonRect.height/2;
}

function closePopup() {
	var popup = document.getElementById('popup');
	popup.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function () {
	loadJSON(jsondata).then((data) => {
		// Get the div element with class "ualter_main"
		var ualterMain = document.querySelector('.ualter_main');

		// Check if the element exists
		if (ualterMain) {
			let currentWordIndex = 0;
			const cb1 = document.getElementById('cb1');
			//const textElement = document.getElementById('typing-animation');
			// const words = textElement.textContent.split(' ').filter(Boolean);
			// textElement.textContent = '';

			function animateText() {
				if (currentWordIndex < words.length) {
					const word = words[currentWordIndex];
					textElement.textContent += word + ' ';
					currentWordIndex++;
					// You can adjust the animation speed by changing the timeout value (in milliseconds)
					setTimeout(animateText, 50);
				}
			}
			//animateText();

			const toggleContentVisibility = (zDiv, expButton) => {
				let newStatus = 'open';
				const upInnerHtml =
					'<path d="M 16 6.59375 L 15.28125 7.28125 L 2.78125 19.78125 L 4.21875 21.21875 L 16 9.4375 L 27.78125 21.21875 L 29.21875 19.78125 L 16.71875 7.28125 Z"/>'; // Your up arrow path data
				const downInnerHtml =
					'<path d="M 4.21875 10.78125 L 2.78125 12.21875 L 15.28125 24.71875 L 16 25.40625 L 16.71875 24.71875 L 29.21875 12.21875 L 27.78125 10.78125 L 16 22.5625 Z"/>'; // Your down arrow path data

				if (zDiv.classList.contains('expanded')) {
					const padre = zDiv.parentElement;
					console.log('krakatoa');
					newStatus = 'closed';
					padre.classList.remove('visible');
					zDiv.style.maxHeight = '0';
					zDiv.classList.remove('expanded');
					// expButton.textContent = 'â–²'; // Display up arrow when expanded
					expButton.innerHTML = downInnerHtml;
					/*setTimeout(function () {
          const modules = document.getElementById('modules');
          const topPos = modules.getBoundingClientRect().top + window.pageYOffset - 90;
          window.scrollTo({
            top: topPos, // scroll so that the element is at the top of the view
            behavior: 'smooth', // smooth scroll
          });
        }, 600);*/
				} else {
					const padre = zDiv.parentElement;
					padre.classList.add('visible');

					setTimeout(function () {
						const modules = document.getElementById('modules');
						const topPos =
							zDiv.getBoundingClientRect().top + window.pageYOffset - 90;
						window.scrollTo({
							top: topPos, // scroll so that the element is at the top of the view
							behavior: 'smooth', // smooth scroll
						});
					}, 600);

					const expandidos = Array.from(
						document.getElementsByClassName('expanded')
					);
					expandidos.forEach((expandido) => {
						const padre = expandido.parentNode;
						padre.classList.remove('visible');
						const expandButton =
							padre.getElementsByClassName('expand-button')[0];
						expandido.classList.remove('expanded');
						expandido.style.maxHeight = '0';
						if (expandButton) {
							expandButton.innerHTML = downInnerHtml;
						}
					});
					zDiv.style.maxHeight = '2200px';
					zDiv.style.overflow = 'auto';
					zDiv.classList.add('expanded');
					expButton.innerHTML = upInnerHtml;
					const height =
						zDiv.getBoundingClientRect().top +
						document.documentElement.scrollTop -
						1000;
					zDiv.scroll({
						top: height,
						left: 0,
						behavior: 'smooth',
					});
				}

				return newStatus;
			};

			function shareVideoUrl(url) {
				if (navigator.share) {
					navigator
						.share({
							title: videoElement.title || 'Ualter Sound',
							text:
								videoElement.getAttribute('data-description') || 'Ualter Sound',
							url: url || window.location.href,
						})
						.then(() => console.log('Video shared successfully'))
						.catch((error) => console.error('Error sharing video:', error));
				} else {
					// Fallback for browsers that do not support Web Share API
					console.log('Web Share API is not supported');
					// You can provide alternative sharing options or a custom sharing dialog here
				}
			}

			function closePopupParent(elem) {
				elem.parentElement.classList.toggle('hidden2');
			}

			function isPlayerOutOfView() {
				const playerContainer = document.getElementById(
					'player-container-reference'
				);
				const rect = playerContainer.getBoundingClientRect();
				const windowHeight =
					window.innerHeight || document.documentElement.clientHeight;
				//console.log(rect);
				return rect.bottom < 0 || rect.top > windowHeight;
			}

			// Function to update player position
			function updatePlayerPosition() {
				const playerContainer = document.getElementById('player-container');
				if (isPlayerOutOfView()) {
					playerContainer.classList.add('floating');
					playerContainer.classList.remove('not-floating');
					//console.log("Out Of View");
				} else {
					playerContainer.classList.add('not-floating');
					playerContainer.classList.remove('floating');
					// console.log("In View");
				}
			}

			// Update player position on scroll
			window.addEventListener('scroll', updatePlayerPosition);

			function clearSiblings() {
				var elements = document.querySelectorAll('.toggle-divs');
				elements.forEach(function (span) {
					span.classList.add('hidden');
				});
			}

			function toggleNextSiblings(event) {
				// Get the next siblings and toggle their display property
				var nextSiblings = event.target.nextElementSibling;
				clearSiblings();
				while (nextSiblings) {
					if (nextSiblings.classList.contains('toggle-divs')) {
						nextSiblings.classList.toggle('hidden');
					}

					nextSiblings = nextSiblings.nextElementSibling;
				}
			}

			function fetchAndDisplayData() {
				try {
					// Create a new XMLHttpRequest object
					var xhr = new XMLHttpRequest();

					// Open a synchronous GET request to fetch the JSON file
					xhr.open('GET', 'test.json', false);
					xhr.send();

					// Check if the request was successful (status 200)
					if (xhr.status === 200) {
						// Parse the JSON data
						var jsonData = JSON.parse(xhr.responseText);

						// Get the transcript container
						var transcriptContainer = document.getElementById(
							'transcriptContainer'
						);

						// Build HTML string
						var htmlString = jsonData
							.map(function (item) {
								return `
							<div class="container-speaker">
								<div class="speaker">${item[0]}</div>
								<div class="speaker-time">${item[2]}</div>
								<div class="speaker-text">${item[1]}</div>
							</div>`;
							})
							.join('');

						// Set the HTML content of the transcript container
						transcriptContainer.innerHTML = htmlString;
					} else {
						console.error('Failed to fetch JSON data. Status:', xhr.status);
					}
				} catch (error) {
					console.error('Error fetching or displaying data:', error);
				}
			}

			function formatTimeNew(seconds) {
				var minutes = Math.floor(seconds / 60);
				seconds = Math.floor(seconds % 60);
				var hours = Math.floor(minutes / 60);
				minutes = Math.floor(minutes % 60);

				return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
					2,
					'0'
				)}:${String(seconds).padStart(2, '0')}`;
			}

			function fetchAndDisplayDataNombres() {
				try {
					// Create a new XMLHttpRequest object
					var xhr = new XMLHttpRequest();

					// Open a synchronous GET request to fetch the JSON file
					xhr.open('GET', 'nombres.json', false);
					xhr.send();

					// Check if the request was successful (status 200)
					if (xhr.status === 200) {
						// Parse the JSON data
						var jsonData = JSON.parse(xhr.responseText);

						// Get the transcript container
						var transcriptContainer = document.getElementById('nombres');

						// Build HTML string
						var htmlString = jsonData
							.map(function (item) {
								return `
							<div class="container-nombre">
								<span data-ts="${item[1]}">${item[0]} (${formatTimeNew(item[1])})</span>
							</div>`;
							})
							.join('');

						// Set the HTML content of the transcript container
						transcriptContainer.innerHTML =
							'<div class="title-nombres">Nombres</div>' + htmlString;
					} else {
						console.error('Failed to fetch JSON data. Status:', xhr.status);
					}
				} catch (error) {
					console.error('Error fetching or displaying data:', error);
				}
			}

			function getTimestampFromUrl() {
				const urlParams = new URLSearchParams(window.location.search);
				const timestamp = urlParams.get('t');
				return timestamp ? parseFloat(timestamp) : null;
			}

			// Function to start playing audio from a specific timestamp
			function playFromTimestamp(audioElement, timestamp) {
				if (timestamp !== null) {
					audioElement.currentTime = timestamp;
					audioElement.play();
				}
			}

			var stopTime = false;
			//fetchAndDisplayData();
			//fetchAndDisplayDataNombres();
			var currentContainerQuote = '';
			var focus = false;

			function formatDate(inputDate) {
				// Parse inputDate string to Date object
				const date = new Date(inputDate);

				// Array of month names in Spanish abbreviation
				const monthNames = [
					'ENE',
					'FEB',
					'MAR',
					'ABR',
					'MAY',
					'JUN',
					'JUL',
					'AGO',
					'SEP',
					'OCT',
					'NOV',
					'DIC',
				];

				// Get day, month, and year components from the date object
				const day = date.getDate();
				const month = monthNames[date.getMonth()];
				const year = date.getFullYear();

				// Return formatted date string
				return `${day} ${month} ${year}`;
			}

			// ### SVG data ###

			const ualterLogoOpen = `<g clip-path="url(#a)" fill="#fff">
			<path d="M49.127.833c0-.447.36-.809.808-.809h8.052v1.408a.808.808 0 0 1-.808.808h-8.053V.833Zm8.244 6.062a.808.808 0 0 1-.808.808h-7.438V6.296c0-.447.361-.809.808-.809h7.438v1.408Zm-.192 4.4c.446 0 .808.361.808.808v1.408h-8.052a.808.808 0 0 1-.809-.808v-1.408h8.053ZM28.008 7.325V.035h1.447c.447 0 .808.361.808.808v6.483c0 2.283 1.704 4.218 3.882 4.407l.242.021c.418.035.74.386.74.805v1.444H34.5c-3.578 0-6.49-2.995-6.49-6.675l-.002-.003ZM66.31 9.292l4.204 4.196h-2.705a.808.808 0 0 1-.57-.237l-4.666-4.658a.805.805 0 0 1 .57-1.378h2.38c1.388 0 2.542-1.1 2.574-2.455a2.491 2.491 0 0 0-.716-1.817 2.497 2.497 0 0 0-1.8-.76h-2.694a.808.808 0 0 1-.808-.808V.035h3.502c2.528 0 4.619 2.055 4.663 4.582a4.589 4.589 0 0 1-1.337 3.315 4.853 4.853 0 0 1-2.597 1.36ZM45.033 1.458a.808.808 0 0 1-.808.808h-7.93V.843c0-.447.361-.808.808-.808h7.93v1.423ZM39.55 5.68c0-.447.362-.809.808-.809h1.421v7.82a.808.808 0 0 1-.808.807h-1.42V5.68ZM5.161 13.552C2.315 13.497 0 11.102 0 8.212V.035h1.429c.446 0 .808.361.808.808v7.38c0 1.666 1.325 3.054 2.952 3.092a3.008 3.008 0 0 0 2.185-.861 3.003 3.003 0 0 0 .913-2.164V.843c0-.447.361-.808.808-.808h1.429V8.29a5.223 5.223 0 0 1-1.578 3.754 5.226 5.226 0 0 1-3.683 1.508h-.102ZM20.622.505a.808.808 0 0 0-.75-.505h-.824c-.33 0-.625.2-.749.505l-5.236 12.958h1.688c.44 0 .831-.263.996-.67L19.46 3.6l3.712 9.191c.165.409.557.671.996.671h1.688L20.62.505Z"></path>
			<path d="M20.688 9.714c-.44-.088-.78-.43-.868-.868l-.366-1.803-.366 1.803c-.088.44-.43.78-.867.868l-1.804.366 1.804.364c.439.089.779.43.867.868l.366 1.804.366-1.804c.089-.44.43-.78.868-.868l1.803-.364-1.803-.366ZM79.406 12.953l-.307-.84h-3.585l-.306.84a.828.828 0 0 1-.78.544h-1.295l2.898-7.493a.83.83 0 0 1 .773-.53h1.004c.343 0 .65.212.774.53l2.887 7.491h-1.284a.829.829 0 0 1-.78-.544v.002Zm-2.099-5.999-1.335 3.68h2.657l-1.323-3.68h.002ZM83.417 13.498V6.305a.83.83 0 0 1 .83-.83h.878v7.194a.83.83 0 0 1-.83.83h-.878Z"></path>
	</g>
	<defs>
			<clipPath id="a"><path fill="#fff" d="M0 0h85.127v14H0z"></path></clipPath>
	</defs>`;
			const ualterLogoClosed = `<circle cx="14.5" cy="14.5" r="14.5" fill="#0f1674"></circle><g clip-path="url(#b)" fill="#fff"><path d="M14.4 23A6.4 6.4 0 0 1 8 16.7V7h1.8c.5 0 1 .4 1 1v8.7c0 2 1.6 3.6 3.6 3.7 1 0 2-.4 2.7-1 .7-.7 1.1-1.7 1.1-2.6V8c0-.6.5-1 1-1H21v9.8a6 6 0 0 1-2 4.4 6.6 6.6 0 0 1-4.5 1.8h-.1Z"></path><path d="m14.5 11.8.3 1.4c.1.5.5 1 1 1l1.5.3-1.5.3c-.5 0-.9.5-1 1l-.3 1.4-.3-1.5c-.1-.4-.5-.8-1-1l-1.5-.2 1.5-.3c.5 0 .9-.5 1-1l.3-1.4Z"></path></g><defs><linearGradient id="a" x1="23.5" y1="3" x2="6.5" y2="25.5" gradientUnits="userSpaceOnUse"><stop stop-color="#040508"></stop><stop offset=".4" stop-color="#1C2C45"></stop></linearGradient><clipPath id="b"><path fill="#fff" d="M8 7h13v16H8z"></path></clipPath></defs>`;
			const pathSvgCrono = `<path d="M 4.21875 10.78125 L 2.78125 12.21875 L 15.28125 24.71875 L 16 25.40625 L 16.71875 24.71875 L 29.21875 12.21875 L 27.78125 10.78125 L 16 22.5625 Z"></path>`;
			const pathSvgCollapse = `<path d="M 4.21875 10.78125 L 2.78125 12.21875 L 15.28125 24.71875 L 16 25.40625 L 16.71875 24.71875 L 29.21875 12.21875 L 27.78125 10.78125 L 16 22.5625 Z"></path>`;
			const icon_close = `<path d="M1082.2,896.6l410.2-410c51.5-51.5,51.5-134.6,0-186.1s-134.6-51.5-186.1,0l-410.2,410L486,300.4
				c-51.5-51.5-134.6-51.5-186.1,0s-51.5,134.6,0,186.1l410.2,410l-410.2,410c-51.5,51.5-51.5,134.6,0,186.1
				c51.6,51.5,135,51.5,186.1,0l410.2-410l410.2,410c51.5,51.5,134.6,51.5,186.1,0c51.1-51.5,51.1-134.6-0.5-186.2L1082.2,896.6z"/>`;

			const ualterLogoExpanded = document.createElementNS(
				'http://www.w3.org/2000/svg',
				'svg'
			);

			// Set attributes
			ualterLogoExpanded.setAttribute('class', 'ualter_logo_open');
			ualterLogoExpanded.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
			ualterLogoExpanded.setAttribute('viewBox', '0 0 86 14');
			ualterLogoExpanded.innerHTML = ualterLogoOpen;

			const ualterLogoCompressed = document.createElementNS(
				'http://www.w3.org/2000/svg',
				'svg'
			);

			// Set attributes
			ualterLogoCompressed.setAttribute('class', 'ualter_logo');
			ualterLogoCompressed.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
			ualterLogoCompressed.setAttribute('viewBox', '0 0 29 29');
			ualterLogoCompressed.innerHTML = ualterLogoClosed;

			//  ** PNG base64 data **
			const apple_touch_icon = `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
			SUVORK5CYII=`;

			const favicon_16 = `iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAvVBMVEUAAAAcLEUcLEUcLEUcLEUb
			K0MkJEkgIDEHCxEcK0UdK0URGysbKkIcLUQNFB8LEBkOGCUIDBMWIzYNFR8FBwsFBQoFCQwSGioF
			CQ4LDhcXHDMGBgYGDBIcLEUiMkr19vcXJDoUHzL+/v5qdYUaKUEOFSEMERwSHCx0fo1jbn4RGigJ
			Dhbs7vCkqrR5hJJATWIeLUUZKD8WIzYPGCb19fbg4uXf4eWOlqKJkZ5td4docoFkbHdiaHJOWm5L
			WGywmoteAAAAHXRSTlMA/ZLz1I4HBf69KvKXLfT01NTT072Uk5GQji0sKwkgv6cAAAC3SURBVBjT
			PY3XFoJADEQjRQWx95KFXVBA6fb6/59ldjk6L0numcmA1Go+6PWHizXUajoeD4/b3aE9barbwsCr
			+F6SiSQOYlGUFQ8JtWcA3Qain2Dp8eRFpg1oSMBFip2e5FmCUQPGAjem32PQFWBRxNwHtXV+4E7A
			DzzeUZFYMJKI6dEITAK5uCLeRE6rqWoxFZezSGlp2KB68Z1lHzk1AGhZ+JfVAkk0mZJ+jW4l2zR0
			3TBtuX8B7LUY+TN24CsAAAAASUVORK5CYII=`;

			const favicon_32 = `iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAABSlBMVEUAAAAcLEUSHzMcLEUbKkIb
			K0QbKkMiIkUcLEUcLEUfLEASGysICxIcLEUdK0UEBwoLCxcLERscLEUcLEUOFSEcLEUFBwsbK0MN
			FSAGCQ4cLEQGCA4aKUIcLEMGCAwJDhYTHi8GCA0VIDMcLEUTIDEPFyQMERsWIzcJDBMEBgkcK0UG
			Cg4RGigGCQwJDxcaKkQGBgYHBwcYMUkcLEX///8iMkrs7vAbK0MVIDMXJDgTHS4eLkYWIjYSGysO
			FSIMEx4KDxkaKUEYJjsPFyQaKD4UHzAQGCcRGikJDRYuPFMZJz0YJToLERwHCxHs7e4yQVcNFCAI
			DBPT1dplcIEGCQ50fo1qdYU3RVsXHyzw8fPc3+PX2t7EyM+JkZ44RlwfKDX6+vvm6Ovf4eXe4OTN
			0dbIzNKfprCco66ZoKuDjJp9hpVXY3UqOVAZIzKARLTXAAAAM3RSTlMA+gzIJPWJB+OaGPf0l1gY
			CPrr6urp49LJyZ2bVi366unMx8Gdm5mYloqBgVlYVzEuJRUA6u/1AAAByElEQVQ4y22S11rjMBSE
			ZTu9sLDAAgvs0nuXkhAMSQihGAgBQui91/e/ZSwdG5swF7Y+nV8azZHYl/SJwfaWpqb/HZ2TOqtX
			YCC+tL62spsvFPbKic7Zb+XG0Nbi/OoCiFx+u7BRPvg32uhb3lYqSmIJxC6IvfJBx6+v+nQzzyxv
			bmVBwCYHG5v4M+Oub+YcRKmYXZwHQTYgaI9wG5fKgHBs8tKmV50jJMumZZmOzfHVVU7ajEsDTQIp
			IfYdm30hjuUmCdvkL3eAtGOzA0DZjKB/QS+g0gD4WF+x0yR01sA9AKUBkFVt3Z5iUS9AaQAUKc0Q
			M/xApQICQMlOA5t29tsPHB7ikxYiQ01rYZoXOKrenVaPbMCkpsX9gPV2S0AKaWwi/t2iShYp5LU3
			6fEe8oQOyU8AUNP63JimEKKihhaGJjVtGI0i4QIe1egC18K5Irqo1VAN616w0KxdC1GjyaDuXBYK
			DyDOnp/O8Ds3aTKqrpus7wXp/J2mtAA9GApykRbQzavJSSH15GRSelaXlxZ3ZYSZVCzCf1Qkxkjd
			PxKRbuZqrr++bqj1pPBY0F/WQuTvKpb0IMFogNVLb0garZrWaiS7dObqE1ZNsLdStwc7AAAAAElF
			TkSuQmCC`;

			const quote_pause = `iVBORw0KGgoAAAANSUhEUgAAAGQAAABkAQMAAABKLAcXAAAABlBMVEUAAAD///+l2Z/dAAAAAXRS
			TlMAQObYZgAAABpJREFUOMtjGAHg//8PIDzKG+WN8oYQbzgDAMd/joB6d163AAAAAElFTkSuQmCC`;

			const quote_play = `iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAAUVBMVEUAAAD/////////////////
			////////////////////////////////////////////////////////////////////////////
			//////////8IN+deAAAAGnRSTlMAVbrj7ZgPDJErHwf59Ih3Z/rWyao+MRde25vLkuYAAAE2SURB
			VGje7ZlLcoMwEAVHEgKD88E/THT/g0aJK3kL71zVrmKsvkAvgEaasUaj8dL0OXV5MpZYKm+73kDG
			cqP73BtGKH98BaMIRZwuJiBJJY4mKEk55KsZJRHvHwMnEWkGJeIYQImICygR54mWKDWcRKnhJCKt
			qESpQSVKDSpRalCJUkNKlBpUotSgEqUGlSg1qESpQSVKDSlRalCJUoNKlBpUotSgEqWGlCg1qESp
			QSVKDSpRalCJUoNKlBpSogsUKBFx4CQiP0PSuZFkHw8+rR4+xpoVD4GMi4efVpo9HCQO+erhcHe6
			eDhw14R4uASdJw8X02PwMCyoCfEwwImjh6FaWj0MOmtCPAyf4+JhIfCTkO0vaZSQTS/O7hKyqWXm
			/1p23htHvL1SvZEMu99VeaPRaDzGNwxeQ+uz5XUsAAAAAElFTkSuQmCC`;

			const quote_share = `iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAAe1BMVEUAAAD/////////////////
			////////////////////////////////////////////////////////////////////////////
			///////////////////////////////////////////////////////////////////NgkbwAAAA
			KHRSTlMAqhTQj/tV8/fkPTPKcg7uTyq2pVouCtW9nX9GIpeShoNtZ6yJdx484LFrUQAAAcRJREFU
			aN7t1ttugkAQgOEBC4KcEZCT50P3/Z+wF2YyXYlgRyZtmv0vNeFzd1yyYDKZ/lMByOc6HyAVGUrJ
			KWTIKWTIKWRIK/ZSKXllZRSjGOUPKHFQHKxw4ycOCbMqVdfWnqIElPSMgJSS7RKFCSml5ajpFvE7
			RK5eaWHziar1xA3XV28ZkXUvGllGo4b59baNTq578qYNsNQ966mRbZSeE146HK+90AwuUix1Ijzi
			s4YGF4k0wWsygBGDh+w1YneDEYOLbL8beQ88g5CpdfgpjBpc5Kio2n40Qs3gIgU9xbnC+Dq4SLak
			iafwUKwbXKSiM5isYNBaM7hIQ0YJFClksBGX9uoTMF1Bg43EPhoOzmOooMFFPhR2haet0eAhpYNG
			DiMd0GAhORr+1GP4SKmwFMQQizZLDMlwIl4vh+zopiaHJHhEbnJIigtpQA45I5LJIZWH9xKQQzpc
			yFEQ2ePYbUEkpN0SQ2I8iRdBJMCRdIJIgUgsiBzwJQ9iCH1QyyH059pKInjdaiURvKZEcgi950+S
			CJ7FAn5aH9zrpxE8Ji7/9xpkXoQyiEEM8viNb72dP4LMl0EM8gtIZM1eBCaT6eW+AJoSNIuQCzA+
			AAAAAElFTkSuQmCC`;

			// ** UI html element generator **

			// Create a div element with class "lippmann_content"
			const lippmannContent = document.createElement('div');
			lippmannContent.classList.add('lippmann_content');
			lippmannContent.style.maxWidth = '600px';
			lippmannContent.style.margin = 'auto';

			// Create a div element with class "ualter_content"
			const ualterContent = document.createElement('div');
			ualterContent.classList.add('ualter_content');

			// Create a section element with class "accordion"
			const accordionSection = document.createElement('section');
			accordionSection.classList.add('accordion');

			// Create a div element with class "tab"
			const tabDiv = document.createElement('div');
			tabDiv.classList.add('tab');

			// Create an input element of type checkbox
			const checkboxInput = document.createElement('input');
			checkboxInput.setAttribute('type', 'checkbox');
			checkboxInput.setAttribute('name', 'accordion-1');
			checkboxInput.setAttribute('id', 'cb1');

			// Create a label element for the checkbox
			const labelForCheckbox = document.createElement('label');
			labelForCheckbox.setAttribute('for', 'cb1');
			labelForCheckbox.classList.add('tab__label');

			tabDiv.appendChild(checkboxInput);
			tabDiv.appendChild(labelForCheckbox);

			accordionSection.appendChild(tabDiv);

			// Append the accordion section to the ualter content
			ualterContent.appendChild(accordionSection);

			// Append the ualter content to the lippmann content
			lippmannContent.appendChild(ualterContent);

			// Append the lippmann content to the body of the document
			ualterMain.appendChild(lippmannContent);

			labelForCheckbox.appendChild(ualterLogoExpanded);

			labelForCheckbox.appendChild(ualterLogoCompressed);

			const soundTitle = document.createElement('div');
			soundTitle.setAttribute('style', 'display:none;');
			soundTitle.setAttribute('class', 'ai');
			soundTitle.textContent =
				'Leer resumen realizado con Inteligencia Artificial';

			const soundSubTitle = document.createElement('div');
			soundSubTitle.setAttribute('class', 'ai_open');
			soundSubTitle.textContent = 'Inteligencia Artificial';

			// const animationDiv = document.createElement('div');
			// animationDiv.setAttribute('class', 'animation');

			// const animationContainer = document.createElement('div');
			// animationContainer.setAttribute('class', 'animation_container');

			// const videoElement = document.createElement('video');
			// videoElement.setAttribute('id', 'ualter_animation');
			// videoElement.setAttribute('playsinline', '');
			// videoElement.setAttribute('autoplay', '');
			// videoElement.setAttribute('loop', '');
			// videoElement.setAttribute('controls', 'false');
			// // videoElement.setAttribute('preload', 'true');
			// videoElement.setAttribute('muted', '');
			// videoElement.setAttribute('preload', 'auto');

			// const sourceElement = document.createElement('source');
			// sourceElement.setAttribute(
			// 	'src',
			// 	'https://test.zetenta.com/ualter//ualter.mp4'
			// );

			// // Append source element to video element
			// videoElement.appendChild(sourceElement);

			// // Append video element to inner div
			// animationContainer.appendChild(videoElement);

			// Append inner div to the third div
			// animationDiv.appendChild(animationContainer);

			// Append all created elements to the labelForCheckbox div
			labelForCheckbox.appendChild(soundTitle);
			labelForCheckbox.appendChild(soundSubTitle);
			// labelForCheckbox.appendChild(animationDiv);

			const tempDiv = document.createElement('div');
			tempDiv.classList.add('temp');
			tabDiv.appendChild(tempDiv);

			const ualterTabContent = document.createElement('div');
			ualterTabContent.classList.add('tab__content');

			const experimental = document.createElement('div');
			experimental.classList.add('experimental');
			experimental.textContent =
				'Experimental: Resumen y análisis automáticos realizados con Inteligencia Artificial';

			const sintesisRectangle = document.createElement('div');
			sintesisRectangle.classList.add('sintesis');
			const sintesisHeader = document.createElement('div');
			sintesisHeader.classList.add('sintesis-header');

			sintesisRectangle.appendChild(sintesisHeader);

			const timeElement = document.createElement('time');
			timeElement.textContent = formatDate(data.date);

			const sintesisTitulo = document.createElement('h2');
			const spanElement = document.createElement('span');
			spanElement.setAttribute('data-ts', data.titulo.start);
			spanElement.textContent = data.titulo.text;
			sintesisTitulo.appendChild(spanElement);

			const sintesish5 = document.createElement('h5');
			const strongSintesis = document.createElement('strong');
			// Set the text content for the strong element
			strongSintesis.textContent = 'SÍNTESIS';
			// Append the strong element to the h5 element
			sintesish5.appendChild(strongSintesis);
			// Append the rest of the text to the h5 element
			sintesish5.insertAdjacentText(
				'beforeend',
				' Resumen condensado y objetivo de la entrevista original'
			);

			// Create the p element with class "lectura"
			const pSintesisHeader = document.createElement('p');
			pSintesisHeader.classList.add('lectura');

			sintesisHeader.appendChild(timeElement);
			sintesisHeader.appendChild(sintesisTitulo);
			sintesisHeader.appendChild(sintesish5);
			sintesisHeader.appendChild(pSintesisHeader);

			ualterTabContent.appendChild(experimental);
			ualterTabContent.appendChild(sintesisRectangle);

			const sintesisContent = document.createElement('div');
			sintesisContent.classList.add('sintesis-content');

			const resumen = data.resumen;
			sintesisContent.innerHTML =
				'<p id="typing-animation">' + resumen + '</p>';

			const sintesisExpandable = document.createElement('div');
			sintesisExpandable.classList.add('expandable-rectangle');

			sintesisRectangle.appendChild(sintesisContent);

			tabDiv.appendChild(ualterTabContent);

			subtitles.forEach((subx, i) => {
				console.log(subx, i);

				const expandableRectangleDiv = document.createElement('div');
				expandableRectangleDiv.classList.add('expandable-rectangle');

				if (subx === 'DATOS') {
					expandableRectangleDiv.id = 'datos-expandable';
					const popupDiv = document.createElement('div');
					popupDiv.setAttribute('id', 'popup');

					// Create the div element with class "popup-header"
					const popupHeaderDiv = document.createElement('div');
					popupHeaderDiv.classList.add('popup-header');

					// Create the div element with id "popup-title"
					const popupTitleDiv = document.createElement('div');
					popupTitleDiv.setAttribute('id', 'popup-title');

					// Create the div element with class "popup-header-img-container"
					const popupHeaderImgContainerDiv = document.createElement('div');
					popupHeaderImgContainerDiv.classList.add(
						'popup-header-img-container'
					);
					popupHeaderImgContainerDiv.setAttribute('onclick', 'closePopup()');

					const closeIconPopupSvg = document.createElementNS(
						'http://www.w3.org/2000/svg',
						'svg'
					);

					// Set attributes
					closeIconPopupSvg.setAttribute('fill', '#ffffff');
					closeIconPopupSvg.setAttribute('height', '12px');
					closeIconPopupSvg.setAttribute('width', '12px');
					closeIconPopupSvg.setAttribute('version', '1.1');
					closeIconPopupSvg.setAttribute('id', 'Layer_1');
					closeIconPopupSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
					closeIconPopupSvg.setAttribute(
						'xmlns:xlink',
						'http://www.w3.org/1999/xlink'
					);
					closeIconPopupSvg.setAttribute('viewBox', '0 0 1792 1792');
					closeIconPopupSvg.setAttribute('xml:space', 'preserve');
					closeIconPopupSvg.innerHTML = icon_close;

					const closeIconImg = document.createElement('img');
					closeIconImg.setAttribute('src', icon_close);

					// Append the img element to the "popup-header-img-container" div
					popupHeaderImgContainerDiv.appendChild(closeIconPopupSvg);

					// Append the "popup-title" and "popup-header-img-container" divs to the "popup-header" div
					popupHeaderDiv.appendChild(popupTitleDiv);
					popupHeaderDiv.appendChild(popupHeaderImgContainerDiv);

					// Create the div element with id "popup-content"
					const popupContentDiv = document.createElement('div');
					popupContentDiv.setAttribute('id', 'popup-content');

					// Append the "popup-header" and "popup-content" divs to the "popup" div
					popupDiv.appendChild(popupHeaderDiv);
					popupDiv.appendChild(popupContentDiv);
					expandableRectangleDiv.appendChild(popupDiv);
				}

				if (data.nombres.length > 0) {
					expandableRectangleDiv.style.display = '';
				} else {
					expandableRectangleDiv.style.display = 'none';
				}
				sintesisContent.appendChild(expandableRectangleDiv);

				const clickableDiv = document.createElement('div');
				clickableDiv.classList.add('clickable');

				// Create the svg element
				const svgElementCrono = document.createElementNS(
					'http://www.w3.org/2000/svg',
					'svg'
				);
				svgElementCrono.setAttribute('id', 'eb-cronologia');
				svgElementCrono.classList.add('expand-button');
				svgElementCrono.setAttribute('viewBox', '0 0 32 32');
				svgElementCrono.setAttribute('fill', '#A4A4A4');

				svgElementCrono.innerHTML = pathSvgCrono;

				clickableDiv.appendChild(svgElementCrono);

				const h5Element = document.createElement('h5');
				h5Element.classList.add('sub-title');
				h5Element.innerHTML = `<strong>${subx}</strong>`;

				clickableDiv.appendChild(h5Element);
				expandableRectangleDiv.appendChild(clickableDiv);

				const cronContainerDiv = document.createElement('div');
				cronContainerDiv.classList.add('cron-container', 'content');
				cronContainerDiv.setAttribute(
					'style',
					'max-height: 0px; overflow: auto;'
				);

				const cronCard = document.createElement('div');
				cronCard.classList.add('cron-card');
				cronCard.id = `cardy-${i}`;
				cronContainerDiv.appendChild(cronCard);

				// Append the inner div to the outer div
				expandableRectangleDiv.appendChild(cronContainerDiv);

				if (i === 0) {
					const cardChord = document.getElementById(`cardy-${i}`);
					data.indice_tematico.forEach((i_t, j) => {
						const indiceTematicoDiv = document.createElement('div');
						indiceTematicoDiv.classList.add(
							'indice_tematico_element',
							'preg-card',
							'preg-line'
						);
						cardChord.appendChild(indiceTematicoDiv);

						const indiceTematicoTitulo = document.createElement('div');
						indiceTematicoTitulo.classList.add(
							'indice_tematico_titulo',
							'preg'
						);
						indiceTematicoTitulo.onclick = toggleNextSiblings;
						indiceTematicoTitulo.textContent = i_t.titulo;
						indiceTematicoDiv.appendChild(indiceTematicoTitulo);

						const hiddenIndiceTematico = document.createElement('div');
						hiddenIndiceTematico.classList.add('hidden', 'toggle-divs');
						indiceTematicoDiv.appendChild(hiddenIndiceTematico);

						i_t['subtitulos'].forEach((sub_i_t) => {
							const indiceTematicoSubTitulo = document.createElement('div');
							indiceTematicoSubTitulo.classList.add(
								'indice_tematico_subtitulo'
							);
							indiceTematicoSubTitulo.textContent = sub_i_t[0];
							hiddenIndiceTematico.appendChild(indiceTematicoSubTitulo);

							sub_i_t[1].forEach((quote) => {
								const quoteSpan = document.createElement('span');
								quoteSpan.classList.add('quote');
								quoteSpan.onclick = function () {
									fixPlayQuoteBtns(this);
								};
								quoteSpan.setAttribute('data-ts', quote.start);
								quoteSpan.setAttribute('data-ts-stop', quote.end);
								indiceTematicoDiv.appendChild(quoteSpan);
								quote['words'].forEach((word) => {
									const wordSpan = document.createElement('span');
									wordSpan.setAttribute('data-ts', word.start);
									wordSpan.setAttribute('data-ts-stop', word.end);
									wordSpan.textContent = word.text ? word.text : word.word;
									quoteSpan.appendChild(wordSpan);
									hiddenIndiceTematico.appendChild(quoteSpan);
								});
								const btnsQuoteContainer = document.createElement('div');
								btnsQuoteContainer.classList.add('btns-quote-container');

								const pauseButton = document.createElement('button');
								pauseButton.classList.add('btn-video-share');
								pauseButton.style.display = 'none';
								pauseButton.innerHTML = '<img src="images/quote-pause.png" />';
								pauseButton.onclick = function () {
									stopQuote(this);
								};
								btnsQuoteContainer.appendChild(pauseButton);

								const playButton = document.createElement('button');
								playButton.classList.add('btn-video-share');
								playButton.innerHTML = '<img src="images/quote-play.png" />';
								playButton.onclick = function () {
									playQuote(quote.start, quote.end, this);
								};
								btnsQuoteContainer.appendChild(playButton);

								if (data.nombre) {
									const shareButton = document.createElement('button');
									shareButton.classList.add('btn-video-share');
									shareButton.innerHTML =
										'<img src="images/quote-share.png" />';
									shareButton.onclick = function () {
										getVideoQuote(
											this,
											data.nombre,
											data.lugar,
											data.date,
											data.audio,
											JSON.stringify(quote.words).replace(/"/g, "'")
										);
									};
									btnsQuoteContainer.appendChild(shareButton);
								}
								hiddenIndiceTematico.appendChild(btnsQuoteContainer);

								const popupVideoDiv = document.createElement('div');
								popupVideoDiv.classList.add('popup-video', 'hidden2');

								const closeButtonDiv = document.createElement('div');
								closeButtonDiv.classList.add('close');
								closeButtonDiv.innerHTML = '&times;';
								closeButtonDiv.onclick = function () {
									closePopupParent(this);
								};
								popupVideoDiv.appendChild(closeButtonDiv);

								const spinnerDiv = document.createElement('div');
								spinnerDiv.classList.add('spinner');
								popupVideoDiv.appendChild(spinnerDiv);

								const popupVideoContentDiv = document.createElement('div');
								popupVideoContentDiv.classList.add('popup-video-content');
								popupVideoDiv.appendChild(popupVideoContentDiv);

								const buttonContainerDiv = document.createElement('div');
								buttonContainerDiv.style.display = 'flex';
								buttonContainerDiv.style.justifyContent = 'center';
								buttonContainerDiv.style.margin = '15px';
								popupVideoDiv.appendChild(buttonContainerDiv);

								const seguirEscuchandoSpan = document.createElement('span');
								seguirEscuchandoSpan.classList.add('quote_seguir_escuchando');
								seguirEscuchandoSpan.setAttribute('data-ts', quote.end);
								seguirEscuchandoSpan.textContent = '(Seguir escuchando)';

								const playIconSpan = document.createElement('span');
								playIconSpan.classList.add(
									'icon-quote',
									'material-symbols-outlined'
								);
								playIconSpan.setAttribute('data-ts', quote.end);
								playIconSpan.textContent = 'play_circle';

								const lineBreak = document.createElement('br');

								const twitterShareButton = document.createElement('a');
								twitterShareButton.classList.add('twitter-share-button');
								twitterShareButton.href = 'https://twitter.com/intent/tweet';
								twitterShareButton.setAttribute('data-text', quote.text);

								hiddenIndiceTematico.appendChild(seguirEscuchandoSpan);
								hiddenIndiceTematico.appendChild(playIconSpan);
								hiddenIndiceTematico.appendChild(lineBreak);
								hiddenIndiceTematico.appendChild(twitterShareButton);
							});
						});
					});
				}

				if (i === 1) {
					const cardChord = document.getElementById(`cardy-${i}`);
					data.nombres.forEach((nombre) => {
						// Create container div for each nombre
						const containerNombreDiv = document.createElement('div');
						containerNombreDiv.classList.add('container-nombre');

						// Create span element for each nombre
						const nombreSpan = document.createElement('span');
						nombreSpan.setAttribute('data-ts', nombre[0]);
						nombreSpan.textContent = nombre[2];

						// Append span element to container div
						containerNombreDiv.appendChild(nombreSpan);

						// Append container div to cron card div
						cardChord.appendChild(containerNombreDiv);
					});
				}

				if (i === 2) {
					const cardChord = document.getElementById(`cardy-${i}`);
					const innerCronCardDiv = document.createElement('div');

					data.numeros.forEach((numero) => {
						const catTableDiv = document.createElement('div');
						catTableDiv.classList.add('cat-table');
						catTableDiv.textContent = numero.categoria;
						innerCronCardDiv.appendChild(catTableDiv);

						const tableElement = document.createElement('table');
						tableElement.classList.add('num-table');

						const tbodyElement = document.createElement('tbody');

						const trHeader = document.createElement('tr');
						const tdDescriptionHeader = document.createElement('td');
						tdDescriptionHeader.textContent = 'Descripción';
						const tdValueHeader = document.createElement('td');
						tdValueHeader.textContent = 'Valor';
						trHeader.appendChild(tdDescriptionHeader);
						trHeader.appendChild(tdValueHeader);
						tbodyElement.appendChild(trHeader);

						numero.datos.forEach((dato) => {
							const trElement = document.createElement('tr');
							let stringWords = '';
							if (dato.words) {
								dato.words.forEach((word) => {
									if (word.word !== undefined) {
										stringWords += `<span data-ts="${word.start}">${word.word}</span>\n`;
									} else {
										stringWords += `<span data-ts="${word.start}">${word.text}</span>\n`;
									}
								});
							}
							const tdClickable = document.createElement('td');
							tdClickable.classList.add('td-clickable');
							tdClickable.setAttribute('data-ts', dato.start);
							tdClickable.setAttribute('data-ts-stop', dato.end);
							tdClickable.setAttribute(
								'data-context',
								dato.words ? stringWords : dato.contexto_original
							);
							tdClickable.textContent = dato.descripcion;
							tdClickable.onclick = function () {
								showPopupContexto(this);
							};
							const tdNumero = document.createElement('td');
							tdNumero.textContent = dato.numero;

							trElement.appendChild(tdClickable);
							trElement.appendChild(tdNumero);
							tbodyElement.appendChild(trElement);
						});
						tableElement.appendChild(tbodyElement);
						innerCronCardDiv.appendChild(tableElement);
					});
					cardChord.appendChild(innerCronCardDiv);
				}

				if (i === 3) {
					const cardChord = document.getElementById(`cardy-${i}`);

					const tableElement = document.createElement('table');
					tableElement.classList.add('num-table');

					const tbodyElement = document.createElement('tbody');

					const trHeader = document.createElement('tr');
					const tdDescriptionHeader = document.createElement('td');
					tdDescriptionHeader.textContent = 'Descripcion';
					const tdValueHeader = document.createElement('td');
					tdValueHeader.textContent = 'Valor';
					trHeader.appendChild(tdDescriptionHeader);
					trHeader.appendChild(tdValueHeader);
					tbodyElement.appendChild(trHeader);

					const trPalabrasTotales = document.createElement('tr');
					const tdPalabrasTotalesDescription = document.createElement('td');
					tdPalabrasTotalesDescription.textContent = 'Palabras totales';
					const tdPalabrasTotalesValue = document.createElement('td');
					tdPalabrasTotalesValue.textContent =
						data.estadistico.palabras_totales; // Assuming data is available
					trPalabrasTotales.appendChild(tdPalabrasTotalesDescription);
					trPalabrasTotales.appendChild(tdPalabrasTotalesValue);
					tbodyElement.appendChild(trPalabrasTotales);

					const trPalabrasPorMinuto = document.createElement('tr');
					const tdPalabrasPorMinutoDescription = document.createElement('td');
					tdPalabrasPorMinutoDescription.textContent = 'Palabras por minuto';
					const tdPalabrasPorMinutoValue = document.createElement('td');
					tdPalabrasPorMinutoValue.textContent =
						data.estadistico.palabras_minuto;
					trPalabrasPorMinuto.appendChild(tdPalabrasPorMinutoDescription);
					trPalabrasPorMinuto.appendChild(tdPalabrasPorMinutoValue);
					tbodyElement.appendChild(trPalabrasPorMinuto);

					tableElement.appendChild(tbodyElement);

					cardChord.appendChild(tableElement);
				}

				const moduloFooterDiv = document.createElement('div');
				moduloFooterDiv.classList.add('modulo-footer');

				const verAnchor = document.createElement('a');
				verAnchor.classList.add('ver');

				const cerrarClickableDiv = document.createElement('div');
				cerrarClickableDiv.classList.add('cerrar_clickable');

				const collapseButtonSvg = document.createElementNS(
					'http://www.w3.org/2000/svg',
					'svg'
				);
				collapseButtonSvg.classList.add('collapse-button');
				collapseButtonSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
				collapseButtonSvg.setAttribute('viewBox', '0 0 32 32');

				collapseButtonSvg.innerHTML = pathSvgCollapse;

				moduloFooterDiv.appendChild(verAnchor);
				moduloFooterDiv.appendChild(cerrarClickableDiv);
				cerrarClickableDiv.appendChild(collapseButtonSvg);

				cronContainerDiv.appendChild(moduloFooterDiv);
			});

			// Transcript Wrapper
			const transcriptWrapperDiv = document.createElement('div');
			transcriptWrapperDiv.classList.add('transcript-wrapper');
			transcriptWrapperDiv.id = 'transcriptContainer';

			const playerContainerReferenceDiv = document.createElement('div');
			playerContainerReferenceDiv.id = 'player-container-reference';
			transcriptWrapperDiv.appendChild(playerContainerReferenceDiv);

			const playerContainerDiv = document.createElement('div');
			playerContainerDiv.id = 'player-container';
			playerContainerDiv.classList.add('not-floating');

			const audioTranscriptElement = document.createElement('audio');
			audioTranscriptElement.id = 'myAudio';
			audioTranscriptElement.setAttribute('controls', '');

			const sourceElementGenAudios = document.createElement('source');
			sourceElementGenAudios.setAttribute('src', './audios/' + data.audio);
			sourceElementGenAudios.setAttribute(
				'type',
				// 'audio/' + (param === 'milei' ? 'mp3' : 'mp3')
				'audio/ogg'
			);
			// audioTranscriptElement.textContent =
			// 	'Your browser does not support the audio element.';
			audioTranscriptElement.appendChild(sourceElementGenAudios);

			playerContainerDiv.appendChild(audioTranscriptElement);
			transcriptWrapperDiv.appendChild(playerContainerDiv);

			const fadeGradientDiv = document.createElement('div');
			fadeGradientDiv.classList.add('fade-gradient');
			transcriptWrapperDiv.appendChild(fadeGradientDiv);

			const transcriptDiv = document.createElement('div');
			transcriptDiv.classList.add('transcript');
			transcriptDiv.id = 'transcriptMain';

			const containerSpeakerDiv = document.createElement('div');
			containerSpeakerDiv.classList.add('container-speaker');

			const speakerTextContainerDiv = document.createElement('div');
			speakerTextContainerDiv.classList.add('speaker-text-container');

			const speakerTextDiv = document.createElement('div');
			speakerTextDiv.classList.add('speaker-text');

			let stringHtml = '';
			if (data.timestamps[0].start) {
				// Iterate through each timestamp in data.timestamps
				for (let i = 0; i < data.timestamps.length; i++) {
					const word = data.timestamps[i].word;
					const startT = data.timestamps[i].start;
					// Check if word is not empty
					if (word !== '') {
						// Check if style is set for the timestamp
						if (data.timestamps[i].style) {
							stringHtml += `<span data-ts="${startT}">${word}<br><br></span>\n`;
						} else {
							stringHtml += `<span data-ts="${startT}">${word}</span>\n`;
						}
					}
				}
			} else {
				// Iterate through each timestamp in data.timestamps
				data.timestamps.forEach((timestamp) => {
					stringHtml += `<span data-ts="${timestamp[1]}">${timestamp[0]}</span>\n`;
				});
			}
			speakerTextDiv.innerHTML = stringHtml;
			speakerTextContainerDiv.appendChild(speakerTextDiv);
			containerSpeakerDiv.appendChild(speakerTextContainerDiv);
			transcriptDiv.appendChild(containerSpeakerDiv);
			transcriptWrapperDiv.appendChild(transcriptDiv);

			sintesisContent.appendChild(transcriptWrapperDiv);

			// Sintesis footer - Fuera de tab__content

			const sintesisFooter = document.createElement('div');
			sintesisFooter.classList.add('sintesis-footer');
			sintesisFooter.innerHTML = `<div class="manos">
			<a class="thumb-down">
					<svg class="icon-thumb-down" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
							<g clip-path="url(#clip0_400_1862)">
									<path d="M6.73425 12.7505L6.48225 14.2812C6.41617 14.6853 6.46 15.0998 6.60915 15.4811C6.75829 15.8625 7.00725 16.1967 7.32995 16.4488C7.65265 16.7008 8.0372 16.8615 8.44331 16.9139C8.84943 16.9662 9.26216 16.9084 9.63825 16.7465C10.158 16.5132 10.5756 16.0994 10.8135 15.5817L12.2122 12.7505L15.75 12.7505C16.3467 12.7505 16.919 12.5134 17.341 12.0915C17.7629 11.6695 18 11.0972 18 10.5005L18 3.75048C18 3.15374 17.7629 2.58144 17.341 2.15949C16.919 1.73753 16.3467 1.50048 15.75 1.50048L1.4865 1.50048L-3.18924e-06 9.77823L-0.0120026 12.7505L6.73425 12.7505ZM16.5 3.75048L16.5 10.5005C16.5 10.6994 16.421 10.8902 16.2803 11.0308C16.1397 11.1715 15.9489 11.2505 15.75 11.2505L12.75 11.2505L12.75 3.00048L15.75 3.00048C15.9489 3.00048 16.1397 3.0795 16.2803 3.22015C16.421 3.3608 16.5 3.55157 16.5 3.75048ZM1.5 9.97548L2.7525 3.00048L11.25 3.00048L11.25 11.3187L9.43575 14.9937C9.37432 15.1049 9.28738 15.1999 9.18208 15.2709C9.07679 15.3419 8.95614 15.3869 8.83006 15.4022C8.70399 15.4175 8.57608 15.4027 8.45685 15.3589C8.33762 15.3151 8.23049 15.2437 8.14425 15.1505C8.07056 15.0648 8.01669 14.9639 7.98649 14.855C7.95628 14.7461 7.95048 14.6319 7.9695 14.5205L8.50875 11.2505L1.5 11.2505L1.5 9.97548Z" fill="#202020"></path>
							</g>
							<defs>
									<clipPath id="clip0_400_1862">
											<rect width="18" height="18" fill="white" transform="translate(18 18) rotate(-180)"></rect>
									</clipPath>
							</defs>
					</svg>
			</a>
			<a class="thumb-up">
					<svg class="icon-thumb-up" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
							<g clip-path="url(#clip0_400_1856)">
									<path d="M11.2658 5.24952L11.5178 3.71877C11.5838 3.31466 11.54 2.90021 11.3909 2.51886C11.2417 2.13751 10.9928 1.80329 10.6701 1.55122C10.3474 1.29915 9.9628 1.13851 9.55669 1.08614C9.15057 1.03376 8.73784 1.09158 8.36175 1.25352C7.84197 1.48678 7.42441 1.90061 7.1865 2.41827L5.78775 5.24952H2.25C1.65326 5.24952 1.08097 5.48658 0.65901 5.90853C0.237053 6.33049 0 6.90279 0 7.49952L0 14.2495C0 14.8463 0.237053 15.4186 0.65901 15.8405C1.08097 16.2625 1.65326 16.4995 2.25 16.4995H16.5135L18 8.22177L18.012 5.24952H11.2658ZM1.5 14.2495V7.49952C1.5 7.30061 1.57902 7.10984 1.71967 6.96919C1.86032 6.82854 2.05109 6.74952 2.25 6.74952H5.25V14.9995H2.25C2.05109 14.9995 1.86032 14.9205 1.71967 14.7799C1.57902 14.6392 1.5 14.4484 1.5 14.2495ZM16.5 8.02452L15.2475 14.9995H6.75V6.68127L8.56425 3.00627C8.62568 2.89511 8.71262 2.80012 8.81792 2.72911C8.92321 2.6581 9.04386 2.61309 9.16994 2.59779C9.29601 2.58249 9.42392 2.59733 9.54315 2.64109C9.66238 2.68485 9.76951 2.75629 9.85575 2.84952C9.92944 2.93521 9.98331 3.0361 10.0135 3.145C10.0437 3.2539 10.0495 3.36812 10.0305 3.47952L9.49125 6.74952H16.5V8.02452Z" fill="#202020"></path>
							</g>
							<defs>
									<clipPath id="clip0_400_1856">
											<rect width="18" height="18" fill="white"></rect>
									</clipPath>
							</defs>
					</svg>
			</a>
			<div class="gracias">Gracias!</div>
		</div>`;
			tabDiv.appendChild(sintesisFooter);

			const otrosDivExperimental = document.createElement('div');
			otrosDivExperimental.classList.add('otros');
			otrosDivExperimental.id = 'modules';
			otrosDivExperimental.textContent = 'Otros análisis (Experimental)';

			tabDiv.appendChild(otrosDivExperimental);

			const footerDiv = document.createElement('div');
			footerDiv.classList.add('footer');
			footerDiv.innerHTML = `<svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 86 14">
			<g clip-path="url(#a)" fill="#fff">
					<path d="M49.127.833c0-.447.36-.809.808-.809h8.052v1.408a.808.808 0 0 1-.808.808h-8.053V.833Zm8.244 6.062a.808.808 0 0 1-.808.808h-7.438V6.296c0-.447.361-.809.808-.809h7.438v1.408Zm-.192 4.4c.446 0 .808.361.808.808v1.408h-8.052a.808.808 0 0 1-.809-.808v-1.408h8.053ZM28.008 7.325V.035h1.447c.447 0 .808.361.808.808v6.483c0 2.283 1.704 4.218 3.882 4.407l.242.021c.418.035.74.386.74.805v1.444H34.5c-3.578 0-6.49-2.995-6.49-6.675l-.002-.003ZM66.31 9.292l4.204 4.196h-2.705a.808.808 0 0 1-.57-.237l-4.666-4.658a.805.805 0 0 1 .57-1.378h2.38c1.388 0 2.542-1.1 2.574-2.455a2.491 2.491 0 0 0-.716-1.817 2.497 2.497 0 0 0-1.8-.76h-2.694a.808.808 0 0 1-.808-.808V.035h3.502c2.528 0 4.619 2.055 4.663 4.582a4.589 4.589 0 0 1-1.337 3.315 4.853 4.853 0 0 1-2.597 1.36ZM45.033 1.458a.808.808 0 0 1-.808.808h-7.93V.843c0-.447.361-.808.808-.808h7.93v1.423ZM39.55 5.68c0-.447.362-.809.808-.809h1.421v7.82a.808.808 0 0 1-.808.807h-1.42V5.68ZM5.161 13.552C2.315 13.497 0 11.102 0 8.212V.035h1.429c.446 0 .808.361.808.808v7.38c0 1.666 1.325 3.054 2.952 3.092a3.008 3.008 0 0 0 2.185-.861 3.003 3.003 0 0 0 .913-2.164V.843c0-.447.361-.808.808-.808h1.429V8.29a5.223 5.223 0 0 1-1.578 3.754 5.226 5.226 0 0 1-3.683 1.508h-.102ZM20.622.505a.808.808 0 0 0-.75-.505h-.824c-.33 0-.625.2-.749.505l-5.236 12.958h1.688c.44 0 .831-.263.996-.67L19.46 3.6l3.712 9.191c.165.409.557.671.996.671h1.688L20.62.505Z"></path>
					<path d="M20.688 9.714c-.44-.088-.78-.43-.868-.868l-.366-1.803-.366 1.803c-.088.44-.43.78-.867.868l-1.804.366 1.804.364c.439.089.779.43.867.868l.366 1.804.366-1.804c.089-.44.43-.78.868-.868l1.803-.364-1.803-.366ZM79.406 12.953l-.307-.84h-3.585l-.306.84a.828.828 0 0 1-.78.544h-1.295l2.898-7.493a.83.83 0 0 1 .773-.53h1.004c.343 0 .65.212.774.53l2.887 7.491h-1.284a.829.829 0 0 1-.78-.544v.002Zm-2.099-5.999-1.335 3.68h2.657l-1.323-3.68h.002ZM83.417 13.498V6.305a.83.83 0 0 1 .83-.83h.878v7.194a.83.83 0 0 1-.83.83h-.878Z"></path>
			</g>
			<defs>
					<clipPath id="a">
							<path fill="#fff" d="M0 0h85.127v14H0z"></path>
					</clipPath>
			</defs>
	</svg>
	<div class="disclaimer">
			Ualter produce ediciones automáticas de textos periodísticos en forma de resúmenes y análisis. Sus resultados experimentales están basados en ChatGPT. Por tratarse de una edición de Inteligencia Artificial los
			textos eventualmente pueden contener errores, omisiones, establecer relaciones equivocadas entre datos y otras inexactitudes imprevistas.<br />
			Recomendamos chequear la edición
	</div>
	<div class="rrss">
			<ul>
					<li class="rrss_x">
							<a href="https://twitter.com/ualterai" target="_blank">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 16">
											<g clip-path="url(#clip0_866_558)">
													<path d="M17.261 15.7776C16.783 15.1422 16.2997 14.4979 15.8247 13.8625C14.1075 11.5742 12.3335 9.20914 10.5573 6.83814L16.9751 0H15.009L14.9676 0.0435927C14.0699 1.00042 13.1721 1.95724 12.2744 2.91406C11.4107 3.83468 10.5477 4.7553 9.68399 5.67518C8.27942 3.80291 6.87411 1.9299 5.4688 0.0554144L5.42742 0H0.253191L0.41574 0.220919C1.09106 1.13858 1.76637 2.05551 2.44095 2.97317C3.12588 3.90339 3.8108 4.83362 4.49572 5.76458C5.24492 6.78051 6.00521 7.8127 6.74185 8.81238C6.3872 9.19067 6.03255 9.56823 5.6779 9.94652C5.28926 10.3603 4.90136 10.774 4.51271 11.1878C4.09895 11.6296 3.68445 12.0715 3.26995 12.5133C2.85176 12.9589 2.43356 13.4051 2.01611 13.8507C1.41837 14.4868 0.821374 15.123 0.225114 15.7591L-0.000976562 16H1.957L1.99838 15.9564C2.59833 15.318 3.19755 14.6797 3.79602 14.0413C4.44548 13.3497 5.0942 12.6581 5.74365 11.9666C6.36356 11.306 6.98346 10.6455 7.60336 9.98568C8.29346 10.9218 8.98355 11.8587 9.67291 12.7956L10.5802 14.0287C10.8159 14.3486 11.0509 14.6678 11.2866 14.9878C11.5215 15.3069 11.7565 15.6254 11.9914 15.9446L12.0328 16.0007H17.4287L17.2617 15.7783L17.261 15.7776ZM8.40798 8.72223L7.81246 7.9154L3.01283 1.39497H4.7292L6.42414 3.65366C6.82017 4.18194 7.21694 4.71023 7.61297 5.23851C8.00383 5.75941 8.39468 6.2803 8.7848 6.8012C8.99611 7.08271 9.20743 7.36421 9.41726 7.64498L9.47268 7.7196C9.47711 7.72551 9.48228 7.73216 9.48672 7.73807L9.58572 7.87033C10.943 9.68053 12.301 11.4915 13.6591 13.3009L14.6366 14.6043H12.737L8.57423 8.94906L8.50477 8.85523L8.4065 8.7215L8.40798 8.72223Z" fill="white"></path>
											</g>
											<defs>
													<clipPath id="clip0_866_558">
															<rect width="17.429" height="16" fill="white"></rect>
													</clipPath>
											</defs>
									</svg>
							</a>
					</li>
					<li class="rrss_ig">
							<a href="https://www.instagram.com/ualter.ai" target="_blank">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 16">
											<g clip-path="url(#clip0_866_556)">
													<path d="M16.1894 4.01435C16.0796 2.96107 15.6683 2.02927 14.8697 1.28245C14.0304 0.496291 13.0026 0.149111 11.8769 0.0904419C9.95877 -0.0124009 5.404 -0.0772817 3.80476 0.17879C1.97706 0.470753 0.778836 1.51713 0.273595 3.28754C-0.115689 4.64935 -0.0383847 10.9262 0.188698 12.2728C0.497917 14.1137 1.60779 15.2939 3.46794 15.764C4.7552 16.0898 11.0824 16.0483 12.5022 15.8226C14.381 15.5252 15.5889 14.4429 16.0776 12.6221C16.451 11.2244 16.3198 5.27538 16.1894 4.01435ZM14.6875 12.0126C14.4694 13.411 13.5231 14.2765 12.0895 14.4305C10.7732 14.572 4.89393 14.65 3.67293 14.3152C2.50508 13.9949 1.83694 13.2074 1.64299 12.054C1.45801 10.9524 1.41177 5.44931 1.64092 3.97638C1.85627 2.59042 2.80187 1.72488 4.22718 1.56889C5.67319 1.41014 10.8761 1.3922 12.2613 1.60064C13.6839 1.81461 14.566 2.74503 14.722 4.15239C14.8676 5.46588 14.909 10.6004 14.6888 12.0126H14.6875ZM8.16282 3.89701C5.85127 3.89563 3.97663 5.7323 3.97594 7.99899C3.97456 10.2657 5.84712 12.1044 8.15867 12.1058C10.4702 12.1072 12.3449 10.2705 12.3456 8.00382C12.3469 5.73714 10.4744 3.89839 8.16282 3.89701ZM8.13383 10.6529C6.6395 10.6398 5.43851 9.44086 5.45232 7.97483C5.46543 6.5088 6.6885 5.33129 8.18283 5.3444C9.67716 5.35751 10.8781 6.55643 10.865 8.02246C10.8512 9.48848 9.62884 10.666 8.13452 10.6529H8.13383ZM13.4906 3.74171C13.4892 4.27249 13.0496 4.7018 12.5084 4.70042C11.9673 4.69904 11.5297 4.26766 11.5311 3.73688C11.5325 3.2061 11.9721 2.77678 12.5133 2.77816C13.0544 2.77954 13.492 3.21093 13.4906 3.74171Z" fill="white"></path>
											</g>
											<defs>
													<clipPath id="clip0_866_556">
															<rect width="16.3223" height="16" fill="white"></rect>
													</clipPath>
											</defs>
									</svg>
							</a>
					</li>
			</ul>
			<ul class="copyright_container">
					<li>© Ualter 2024</li>
					<li><a href="mailto:contacto@ualter.ai">Contactanos</a></li>
			</ul>
	</div>`;
			accordionSection.appendChild(footerDiv);

			// After the DOM is fully nurtured:
			document.querySelectorAll('.clickable').forEach((div) => {
				div.addEventListener('click', function () {
					console.log('test');
					toggleContentVisibility(
						this.nextElementSibling,
						this.getElementsByClassName('expand-button')[0]
					);
				});
			});

			var spans = document.querySelectorAll('.transcript span');
			var imagesClickeable = document.querySelectorAll('.circle-img');
			var spans2 = document.querySelectorAll('span');
			var spans_popup = document.querySelectorAll('.popupSpanContainer span');
			var audio = document.getElementById('myAudio');
			var transcriptContainer = document.getElementById('transcriptContainer');
			var currentContainerSpeaker = '';
			const playerContainer = document.getElementById('player-container');
			const rect = transcriptContainer.getBoundingClientRect();
			const transcriptMain = document.getElementById('transcriptMain');

			const scrollTop = rect.top - 500;

			const timestamp = getTimestampFromUrl();
			playFromTimestamp(audio, timestamp);

			audio.addEventListener('timeupdate', function (event) {
				var currentTime = audio.currentTime;
				if (stopTime) {
					if (currentTime >= stopTime) {
						audio.pause();
						stopTime = false;
					}
					console.log(stopTime);
					var spansIndice = currentContainerQuote.querySelectorAll('span');
					spansIndice.forEach(function (span) {
						span.classList.remove('playing');
					});
					for (var i = spansIndice.length - 1; i >= 0; i--) {
						var span2 = spansIndice[i];
						var timestamp2 = parseFloat(span2.dataset.ts);
						if (currentTime >= timestamp2) {
							span2.classList.add('playing');

							break;
						}
					}
					spans.forEach(function (span) {
						span.classList.remove('playing');
					});

					/*  spans_quote.forEach(function (span) {
            span.classList.remove('playing');
        });
        for (var i = spans_quote.length -1; i >= 0; i--) {
            if (currentTime >= parseFloat(spans_quote[i].dataset.ts)) {
                spans_quote[i].classList.add('playing');
            }
        }*/

					for (var i = spans.length - 1; i >= 0; i--) {
						var span = spans[i];
						var timestamp = parseFloat(span.dataset.ts);

						if (currentTime >= timestamp) {
							span.classList.add('playing');
							transcriptMain.scrollTop =
								span.offsetTop - transcriptMain.offsetTop - 70;
							break;
						}
					}
				} else {
					spans.forEach(function (span) {
						span.classList.remove('playing');
					});

					for (var i = spans.length - 1; i >= 0; i--) {
						var span = spans[i];
						var timestamp = parseFloat(span.dataset.ts);

						if (currentTime >= timestamp) {
							span.classList.add('playing');
							//const clickedCircleImgDiv = span.closest(".container-speaker").querySelector(".circle-img");
							//clickedCircleImgDiv.classList.add("circle-img-active");
							//const allCircleImgDivs = document.querySelectorAll(".circle-img");

							// allCircleImgDivs.forEach(function(circleImgDiv) {
							//    if (circleImgDiv !== clickedCircleImgDiv) {
							//         circleImgDiv.classList.remove("circle-img-active");
							//     }
							//  });
							const closestContainer = span.closest('.container-speaker');
							event.preventDefault();
							if (focus) {
								currentContainerSpeaker = closestContainer;

								/*window.scrollTo({
                top: 500, // Adjust the value to the desired vertical offset
                behavior: 'smooth' // Optional: smooth scrolling behavior
            });*/
								window.scrollTo({
									top: document.body.scrollHeight - 1200,
									behavior: 'smooth',
								});

								focus = false;
							}

							transcriptMain.scrollTop =
								span.offsetTop - transcriptMain.offsetTop - 70;
							break;
						}
					}
				}
			});

			imagesClickeable.forEach(function (circleImg) {
				var parentElement = circleImg.parentNode;
				circleImg.addEventListener('click', function () {
					const timestamp = parseFloat(
						parentElement
							.querySelector('span:first-child')
							.getAttribute('data-ts')
					);
					var audio = document.getElementById('myAudio');
					audio.currentTime = timestamp;
					audio.play();
				});
			});

			spans2.forEach(function (span) {
				var parentElement = span.parentNode;
				span.addEventListener('click', function () {
					console.log(span.classList);
					if (span.classList.contains('quote')) {
						document.querySelectorAll('.quote span').forEach(function (span) {
							span.classList.remove('playing');
						});
						console.log('Si');
						currentContainerQuote = span;
						focus = false;
						stopTime = span.getAttribute('data-ts-stop');
					} else if (!parentElement.classList.contains('speaker-text')) {
						stopTime = false;
						focus = true;
					} else {
						stopTime = false;
						focus = false;
					}
					var audio = document.getElementById('myAudio');
					var timestamp = parseFloat(this.dataset.ts);

					audio.currentTime = timestamp;
					audio.play();
				});
			});

			const player = new Plyr('#myAudio');
		} else {
			console.error("Div with class 'ualter_content' not found!");
		}
	});
});
