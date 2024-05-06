function shareVideoUrl(url) {
	if (navigator.share) {
		navigator
			.share({
				title: videoElement.title || 'Ualter Sound',
				text: videoElement.getAttribute('data-description') || 'Ualter Sound',
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
	const playerContainer = document.getElementById('player-container-reference');
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
			var transcriptContainer = document.getElementById('transcriptContainer');

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
          <span data-ts="${
						item[1]
					}">${item[0]} (${formatTimeNew(item[1])})</span>
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
document.addEventListener('DOMContentLoaded', function () {
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
				parentElement.querySelector('span:first-child').getAttribute('data-ts')
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
});

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
