<?php
$param = $_GET['v'];
$jsonData = file_get_contents("generated/data/$param");
$data = json_decode($jsonData, true);
?>


<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="./sound_discurso_files/style.css">

    <link rel="stylesheet" href="https://cdn.plyr.io/3.7.8/plyr.css" />
    <link rel="stylesheet" href="./sound_discurso_files/style_ualter_sound.css?v=1009">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
    <link rel="apple-touch-icon" sizes="180x180" href="../images/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="../images/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="../images/favicon-16x16.png">
    <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="./sound_discurso_files/script_ualter_sound.js?v=1006" charset="utf-8"></script>
    <title>Ualter Sound</title>


</head>

<body>
    <script>
        document.addEventListener('DOMContentLoaded', function() {

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








            document.querySelectorAll('.clickable').forEach(div => {
                div.addEventListener('click', function() {
                    console.log("test");
                    toggleContentVisibility(this.nextElementSibling, this.getElementsByClassName('expand-button')[0])
                });
            });
        });
        const toggleContentVisibility = (zDiv, expButton) => {
            let newStatus = 'open';
            const upInnerHtml = '<path d="M 16 6.59375 L 15.28125 7.28125 L 2.78125 19.78125 L 4.21875 21.21875 L 16 9.4375 L 27.78125 21.21875 L 29.21875 19.78125 L 16.71875 7.28125 Z"/>'; // Your up arrow path data
            const downInnerHtml = '<path d="M 4.21875 10.78125 L 2.78125 12.21875 L 15.28125 24.71875 L 16 25.40625 L 16.71875 24.71875 L 29.21875 12.21875 L 27.78125 10.78125 L 16 22.5625 Z"/>'; // Your down arrow path data

            if (zDiv.classList.contains('expanded')) {

                const padre = zDiv.parentElement;
                console.log("krakatoa")
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

                setTimeout(function() {
                    const modules = document.getElementById('modules');
                    const topPos = zDiv.getBoundingClientRect().top + window.pageYOffset - 90;
                    window.scrollTo({
                        top: topPos, // scroll so that the element is at the top of the view
                        behavior: 'smooth', // smooth scroll
                    });
                }, 600);

                const expandidos = Array.from(document.getElementsByClassName('expanded'));
                expandidos.forEach((expandido) => {
                    const padre = expandido.parentNode;
                    padre.classList.remove('visible');
                    const expandButton = padre.getElementsByClassName('expand-button')[0];
                    expandido.classList.remove('expanded');
                    expandido.style.maxHeight = '0';
                    if (expandButton) {
                        expandButton.innerHTML = downInnerHtml;
                    }
                });
                zDiv.style.maxHeight = '2200px';
                zDiv.style.overflow = 'auto';
                zDiv.classList.add('expanded');
                // expButton.textContent = 'â–¼'; // Display down arrow when collapsed
                expButton.innerHTML = upInnerHtml;
                const height = zDiv.getBoundingClientRect().top + document.documentElement.scrollTop - 1000;
                zDiv.scroll({
                    top: height,
                    left: 0,
                    behavior: 'smooth',
                });
            }

            return newStatus;
        };
    </script>
    <div class="lippmann_content" style="max-width: 600px;margin:auto;">
        <div class="ualter_content">
            <section class="accordion">
                <div class="tab">
                    <input type="checkbox" name="accordion-1" id="cb1" />
                    <label for="cb1" class="tab__label">
                        <svg style="display:none;" class="ualter_logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29">
                            <circle cx="14.5" cy="14.5" r="14.5" fill="url(#a)"></circle>
                            <g clip-path="url(#b)" fill="#fff">
                                <path d="M14.4 23A6.4 6.4 0 0 1 8 16.7V7h1.8c.5 0 1 .4 1 1v8.7c0 2 1.6 3.6 3.6 3.7 1 0 2-.4 2.7-1 .7-.7 1.1-1.7 1.1-2.6V8c0-.6.5-1 1-1H21v9.8a6 6 0 0 1-2 4.4 6.6 6.6 0 0 1-4.5 1.8h-.1Z"></path>
                                <path d="m14.5 11.8.3 1.4c.1.5.5 1 1 1l1.5.3-1.5.3c-.5 0-.9.5-1 1l-.3 1.4-.3-1.5c-.1-.4-.5-.8-1-1l-1.5-.2 1.5-.3c.5 0 .9-.5 1-1l.3-1.4Z"></path>
                            </g>
                            <defs>
                                <linearGradient id="a" x1="23.5" y1="3" x2="6.5" y2="25.5" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#040508"></stop>
                                    <stop offset=".4" stop-color="#1C2C45"></stop>
                                </linearGradient>
                                <clipPath id="b">
                                    <path fill="#fff" d="M8 7h13v16H8z"></path>
                                </clipPath>
                            </defs>
                        </svg>
                        <svg class="ualter_logo_open" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 86 14">
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
                        <div style="display:none;" class="ai">Leer resumen realizado con Inteligencia Artificial</div>
                        <div class="ai_open">Inteligencia Artificial</div>
                        <div class="animation">
                            <div class="animation_container">
                                <video id="ualter_animation" playsinline="" autoplay="" loop="" controls="false" preload="true" muted="">
                                    <source src="https://test.zetenta.com/ualter//ualter.mp4" />
                                </video>
                            </div>
                        </div>
                    </label>
                    <div class="temp"></div>
                    <div class="tab__content">
                        <div class="experimental">Experimental: Resumen y análisis automáticos realizados con Inteligencia Artificial</div>
                        <div class="sintesis">
                            <div class="sintesis-header">
                                <time>22 abril 2024</time>
                                <h2><span data-ts="<?php echo $data['titulo']['start'] ?> ">"<?php echo $data['titulo']['text'] ?>" </span></h2>
                                <h5><strong>SÍNTESIS</strong> Resumen condensado y objetivo de la entrevista original</h5>
                                <p class="lectura"></p>
                            </div>
                            <div class="sintesis-content">
                                <p id="typing-animation">
                                    <?php echo $data['resumen'] ?>

                                </p>
                                <!--   <div class="slider-wrapper">
                                <ul class="slides-container" style="overflow:hidden;" id="slides-container">
                                    <li class="slide" style="display:grid;place-items:center;">
                                        <img style="width:85%;"src="<?php echo $data['imagen'] ?>    " style="margin:auto;" />
                                        <p class="img-epigraph">
                                        </p>
                                    </li>
                                </ul>
                            </div>-->
                                <div class="expandable-rectangle" <?php echo sizeof($data['indice_tematico']) > 0 ? "" : "style='display:none;'" ?>>
                                    <div class="clickable">
                                        <svg id="eb-cronologia" class="expand-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="#A4A4A4">
                                            <path d="M 4.21875 10.78125 L 2.78125 12.21875 L 15.28125 24.71875 L 16 25.40625 L 16.71875 24.71875 L 29.21875 12.21875 L 27.78125 10.78125 L 16 22.5625 Z"></path>
                                        </svg>
                                        <h5 class="sub-title"><strong>Indice Temático</strong></h5>
                                    </div>
                                    <div class="cron-container content" style="max-height: 0px; overflow: auto;">
                                        <div class="cron-card">
                                            <div class='indice_tematico'>

                                                <?php foreach ($data['indice_tematico'] as $indiceTematico) { ?>
                                                    <div class='indice_tematico_element preg-card preg-line'>
                                                        <div class='indice_tematico_titulo preg' onclick='toggleNextSiblings(event)'>
                                                            <?php echo $indiceTematico['titulo'] ?>
                                                        </div>
                                                        <div class="hidden toggle-divs">
                                                            <?php foreach ($indiceTematico['subtitulos'] as $subtitulo) { ?>
                                                                <div class='indice_tematico_subtitulo '>
                                                                    <?php echo $subtitulo[0] ?>
                                                                </div>
                                                                <?php foreach ($subtitulo[1] as $quote) { ?>
                                                                    <span class='quote' onclick="fixPlayQuoteBtns(this)" data-ts='<?php echo $quote["start"] ?>' data-ts-stop='<?php echo $quote["end"] ?>'>
                                                                        <?php foreach ($quote["words"] as $word) { ?>
                                                                            <span data-ts="<?php echo $word['start'] ?>" data-ts-stop="<?php echo $word['end'] ?>"><?php echo isset($word['text']) ? $word['text'] : $word['word'] ?></span>

                                                                        <?php } ?>
                                                                    </span>
                                                                    <div class="btns-quote-container">
                                                                        <button class="btn-video-share" style="display:none;" onclick="stopQuote(this)"><img src="sound_discurso_files/quote-pause.png" /></button>
                                                                        <button class="btn-video-share" onclick="playQuote(<?php echo $quote['start'] ?>,<?php echo $quote['end'] ?>,this)"><img src="sound_discurso_files/quote-play.png" /></button>
                                                                        <?php if (isset($data['nombre'])) { ?>
                                                                            <button class="btn-video-share" onclick="getVideoQuote(this, '<?php echo $data['nombre'] ?>','<?php echo $data['lugar'] ?>','<?php echo $data['date'] ?>','<?php echo $data['audio'] ?>',<?php echo str_replace('"', "'", json_encode($quote['words'])) ?>)"><img src="sound_discurso_files/quote-share.png" /></button>
                                                                        <?php } ?>
                                                                    </div>
                                                                    <div class="popup-video hidden2">
                                                                        <div onclick="closePopupParent(this)" class="close">&times;</div>
                                                                        <div class="spinner"></div>
                                                                        <div class="popup-video-content">

                                                                        </div>
                                                                        <div style="display:flex;justify-content:center;margin:15px;">

                                                                        </div>
                                                                    </div>



                                                                    <span class='quote_seguir_escuchando' data-ts='<?php echo $quote["end"] ?>'>
                                                                        (Seguir escuchando)
                                                                    </span>
                                                                    <span data-ts='<?php echo $quote["end"] ?>' class='icon-quote material-symbols-outlined'>
                                                                        play_circle
                                                                    </span>
                                                                    <br>
                                                                    <a class="twitter-share-button" href="https://twitter.com/intent/tweet" data-text="<?php echo $quote['text'] ?>"></a>
                                                                <?php } ?>


                                                            <?php } ?>
                                                        </div>
                                                    </div>
                                                <?php } ?>
                                            </div>
                                        </div>

                                        <div class="modulo-footer">

                                            <a class="ver"></a>
                                            <div class="cerrar_clickable">
                                                <svg class="collapse-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                                                    <path d="M 16 6.59375 L 15.28125 7.28125 L 2.78125 19.78125 L 4.21875 21.21875 L 16 9.4375 L 27.78125 21.21875 L 29.21875 19.78125 L 16.71875 7.28125 Z"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="expandable-rectangle" <?php echo sizeof($data['nombres']) > 0 ? "" : "style='display:none;'" ?>>
                                    <div class="clickable">
                                        <svg id="eb-cronologia" class="expand-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="#A4A4A4">
                                            <path d="M 4.21875 10.78125 L 2.78125 12.21875 L 15.28125 24.71875 L 16 25.40625 L 16.71875 24.71875 L 29.21875 12.21875 L 27.78125 10.78125 L 16 22.5625 Z"></path>
                                        </svg>
                                        <h5 class="sub-title"><strong>NOMBRES</strong></h5>
                                    </div>
                                    <div class="cron-container content" style="max-height: 0px; overflow: auto;">
                                        <div class="cron-card">
                                            <?php foreach ($data['nombres'] as $nombre) { ?>
                                                <div class="container-nombre">
                                                    <span data-ts="<?php echo $nombre[0] ?>"><?php echo $nombre[2] ?></span>
                                                </div>
                                            <?php } ?>

                                        </div>

                                        <div class="modulo-footer">

                                            <a class="ver"></a>
                                            <div class="cerrar_clickable">
                                                <svg class="collapse-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                                                    <path d="M 16 6.59375 L 15.28125 7.28125 L 2.78125 19.78125 L 4.21875 21.21875 L 16 9.4375 L 27.78125 21.21875 L 29.21875 19.78125 L 16.71875 7.28125 Z"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="expandable-rectangle" id="datos-expandable" <?php echo sizeof($data['numeros']) > 0 ? "" : "style='display:none;'" ?>>
                                    <div id="popup">
                                        <div class='popup-header'>
                                            <div id="popup-title"></div>
                                            <div class='popup-header-img-container' onclick="closePopup()"><img src="./sound_discurso_files/icon-close.svg" /></div>
                                        </div>
                                        <div id="popup-content"></div>
                                    </div>
                                    <div class="clickable">
                                        <svg id="eb-cronologia" class="expand-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="#A4A4A4">
                                            <path d="M 4.21875 10.78125 L 2.78125 12.21875 L 15.28125 24.71875 L 16 25.40625 L 16.71875 24.71875 L 29.21875 12.21875 L 27.78125 10.78125 L 16 22.5625 Z"></path>
                                        </svg>
                                        <h5 class="sub-title"><strong>DATOS</strong></h5>
                                    </div>
                                    <div class="cron-container content" style="max-height: 0px; overflow: auto;">
                                        <div class="cron-card">
                                            <div>
                                                <?php foreach ($data['numeros'] as $numero) { ?>
                                                    <div class="cat-table"><?php echo $numero['categoria'] ?></div>
                                                    <table class="num-table">
                                                        <tbody>
                                                            <tr>
                                                                <td>Descripción</td>
                                                                <td>Valor</td>
                                                            </tr>
                                                            <?php foreach ($numero['datos'] as $dato) { ?>
                                                                <tr>
                                                                    <?php
                                                                    if (isset($dato['words'])) {
                                                                        $stringWords = "";
                                                                        foreach ($dato['words'] as $word) {
                                                                            if (isset($word['word'])) {
                                                                                $stringWords .= "<span data-ts='" . $word['start'] . "'>" . $word['word'] . "</span>\n";
                                                                            } else {
                                                                                $stringWords .= "<span data-ts='" . $word['start'] . "'>" . $word['text'] . "</span>\n";
                                                                            }
                                                                        }
                                                                    }
                                                                    ?>
                                                                    <td class='td-clickable' data-context="<?php echo isset($dato['words']) ? $stringWords : $dato['contexto_original'] ?>" onclick="showPopupContexto(this)" data-ts="<?php echo $dato['start'] ?>" data-ts-stop="<?php echo $dato['end'] ?>"><?php echo $dato['descripcion'] ?></td>
                                                                    <td><?php echo $dato['numero'] ?></td>
                                                                </tr>
                                                            <?php } ?>
                                                        </tbody>
                                                    </table>
                                                <?php } ?>
                                            </div>

                                        </div>

                                        <div class="modulo-footer">

                                            <a class="ver"></a>
                                            <div class="cerrar_clickable">
                                                <svg class="collapse-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                                                    <path d="M 16 6.59375 L 15.28125 7.28125 L 2.78125 19.78125 L 4.21875 21.21875 L 16 9.4375 L 27.78125 21.21875 L 29.21875 19.78125 L 16.71875 7.28125 Z"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="expandable-rectangle">
                                    <div class="clickable">
                                        <svg id="eb-cronologia" class="expand-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="#A4A4A4">
                                            <path d="M 4.21875 10.78125 L 2.78125 12.21875 L 15.28125 24.71875 L 16 25.40625 L 16.71875 24.71875 L 29.21875 12.21875 L 27.78125 10.78125 L 16 22.5625 Z"></path>
                                        </svg>
                                        <h5 class="sub-title"><strong>ESTADISTICO</strong></h5>
                                    </div>
                                    <div class="cron-container content" style="max-height: 0px; overflow: auto;">
                                        <div class="cron-card">
                                            <!--<div>
                                    <h2>Palabras totales: <?php echo $data['estadistico']['palabras_totales'] ?></h2>
                                    <h2>Palabras por minuto: <?php echo $data['estadistico']['palabras_minuto'] ?></h2>
                              </div>-->
                                            <table class="num-table">
                                                <tbody>
                                                    <tr>
                                                        <td>Descripcion</td>
                                                        <td>Valor</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Palabras totales</td>
                                                        <td><?php echo $data['estadistico']['palabras_totales'] ?></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Palabras por minuto</td>
                                                        <td><?php echo $data['estadistico']['palabras_minuto'] ?></td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        </div>

                                        <div class="modulo-footer">

                                            <a class="ver"></a>
                                            <div class="cerrar_clickable">
                                                <svg class="collapse-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                                                    <path d="M 16 6.59375 L 15.28125 7.28125 L 2.78125 19.78125 L 4.21875 21.21875 L 16 9.4375 L 27.78125 21.21875 L 29.21875 19.78125 L 16.71875 7.28125 Z"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>




                                <div class="transcript-wrapper" id="transcriptContainer">
                                    <div id="player-container-reference"></div>
                                    <div id="player-container" class="not-floating">
                                        <audio id="myAudio" controls>
                                            <source src="<?php echo 'generated/audios/' . $data['audio'] ?> " type="audio/<?php echo $param == 'milei' ? mp3 : mp3 ?>">
                                            Your browser does not support the audio element.
                                        </audio>
                                    </div>
                                    <div class="fade-gradient"></div>
                                    <!--  <div class="fade-gradient-top"></div> -->
                                    <div class="transcript" id="transcriptMain">
                                        <div class="container-speaker">
                                            <div class="speaker-text-container">
                                                <div class="speaker-text">
                                                    <?php
                                                    $stringHtml = "";
                                                    if (isset($data['timestamps'][0]['start'])) {
                                                        //$fixSpaces = false;
                                                        for ($i = 0; $i < sizeof($data['timestamps']); $i++) {
                                                            $word = $data['timestamps'][$i]['word'];
                                                            $startT = $data['timestamps'][$i]['start'];
                                                            if ($word != "") {
                                                                // $stringAux = "";
                                                                //$stringAuxPre = "";
                                                                // if ($fixSpaces) {
                                                                //     $stringAux = "</div>";
                                                                //     $fixSpaces = false;
                                                                // }

                                                                // if (strpos($word, ",") || strpos($word, ".")) {

                                                                //     if (is_numeric(preg_replace('/[,.]/', '', $word)) && isset($data['timestamps'][$i+1]) && (is_numeric($data['timestamps'][$i+1]['word']) || strpos($data['timestamps'][$i+1]['word'], "%")) ) {
                                                                //        $stringAuxPre .= "<div class='fix-spaces'>";
                                                                //         $fixSpaces = true;
                                                                //     }
                                                                //  }
                                                                if (isset($data['timestamps'][$i]['style'])) {
                                                                    $stringHtml .= "<span data-ts='" . $startT . "'>" . $word . "<br><br></span>\n";
                                                                } else {
                                                                    $stringHtml .= "<span data-ts='" . $startT . "'>" . $word . "</span>\n";
                                                                }
                                                            }
                                                        }
                                                    } else {
                                                        foreach ($data['timestamps'] as $timestamp) {
                                                            $stringHtml .= "<span data-ts='" . $timestamp[1] . "'>" . $timestamp[0] . "</span>\n";
                                                        }
                                                    }
                                                    echo $stringHtml;
                                                    ?>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>

                        </div>




                    </div>
                    <div class="sintesis-footer">
                        <div class="manos">
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
                        </div>
                    </div>
                    <div class="otros" id="modules">Otros análisis (Experimental)</div>
                </div>

                <!--<div class="expandable-rectangle">
                        <div class="clickable">
                            <svg id="eb-cronologia" class="expand-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="#A4A4A4">
                                <path d="M 4.21875 10.78125 L 2.78125 12.21875 L 15.28125 24.71875 L 16 25.40625 L 16.71875 24.71875 L 29.21875 12.21875 L 27.78125 10.78125 L 16 22.5625 Z"></path>
                            </svg>
                            <h5 class="sub-title"><strong>PALABRAS</strong></h5>
                        </div>
                        <div class="cron-container content" style="padding:0;max-height: 0px; overflow: auto;">
                            <div class="cron-card">
                             <div class="container-palabras-main">
                             <div class="palabras-title">Cuánto tiempo habló cada uno</div>
                             <div class="container-palabras">
                                <div class="container-palabras-barra">
                                    <div class="palabras-nombre">Fantino</div>
                                    <div class="palabras-barra">
                                        <div class="palabras-barra-left">
                                            42%
                                        </div>
                                        <div class="palabras-barra-right">
                                            58%
                                        </div>
                                    </div>
                                    <div class="palabras-nombre">Lanata</div>
                                </div>
                             </div>
                             <div class="container-palabras-count">
                                <div>8m 12s = 2,345 palabras</div>
                                <div>12m 37s = 6,435 palabras</div>
                             </div>
                             <div class="container-palabras-footer">
                                <div>Tiempo total 20m 49s</div>
                                <div>8,780 palabras</div>
                            </div>
                            </div>
                           
                            </div>
                           
                            <div class="modulo-footer">
                        
                                <a class="ver"></a>
                                <div class="cerrar_clickable">
                                    <svg class="collapse-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                                        <path d="M 16 6.59375 L 15.28125 7.28125 L 2.78125 19.78125 L 4.21875 21.21875 L 16 9.4375 L 27.78125 21.21875 L 29.21875 19.78125 L 16.71875 7.28125 Z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div> -->
                <div class="footer">
                    <svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 86 14">
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
                    </div>
                </div>
        </div>
    </div>
    </section>
    </div>
    </div>
    <script src="https://cdn.plyr.io/3.7.8/plyr.js"></script>
    <script>
        const player = new Plyr('#myAudio');
    </script>
</body>

</html>