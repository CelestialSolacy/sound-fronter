function ualterEmbed(deprecatedData, containerSelector, __analyticsHandler, __ualterAnalyticsCodes, jsonURL) {
  let retries = 0;
  const fetchAndStart = () => {
    fetch(jsonURL).then(async (res) => {
      if (res.ok) {
        ualterRender(await res.json(), containerSelector, __analyticsHandler, __ualterAnalyticsCodes);
      } else if (res.status === 503 && retries < 2) {
        retries++;
        console.warn('Ualter: fetch failed, retrying...');
        setTimeout(fetchAndStart, Math.floor(Math.random() * 2000 + 1000));
      }
    });
  };
  if (deprecatedData && deprecatedData.modules) {
    // legacy call
    ualterRender(deprecatedData, containerSelector, __analyticsHandler, __ualterAnalyticsCodes);
  } else {
    fetchAndStart();
  }
}

function ualterRender(data, containerSelector, __analyticsHandler, __ualterAnalyticsCodes) {
  if (!data.modules || !data.modules.resumen || !data.modules.resumen.content) {
    return;
  }

  function ualterTrack(action, broadcast = false) {
    __analyticsHandler('event', action, { send_to: broadcast ? __ualterAnalyticsCodes : __ualterAnalyticsCodes[0] }); // gtag
  }

  let ualterVisibilityObserver;
  function onEnterViewport(entries) {
    entries.forEach((entry) => {
      if (entry && entry.isIntersecting) {
        ualterTrack('ualter_visible');
        ualterVisibilityObserver.unobserve(entry.target);
      }
    });
  }

  ualterTrack('ualter_ready', true);

  function _quoteAndEscape(input) {
    if (typeof input !== 'string') return input; // usually numbers
    return '"' + input.replace(/"/g, '"') + '"';
  }

  function _formatTitle(str) {
    return str.trim().replace(/[¿?¡!#@$,.]/g, '');
  }

  function ualterGetCSV(category) {
    ualterTrack('download_' + category);
    let csvString;
    let friendlyCategoryName;
    let heading = [];

    switch (category) {
      case 'numeros':
        friendlyCategoryName = 'Datos';
        heading = ['categoria', 'valor', 'descripcion'];
        csvString = data.modules.numeros.content
          .map(({ categoria, datos }) => {
            if (datos) {
              return datos
                .map(({ numero, descripcion }) => {
                  if (numero !== undefined && descripcion) {
                    return [categoria, numero, descripcion].map(_quoteAndEscape).join(',');
                  }
                })
                .join('\n');
            }
          })
          .join('\n');
        break;

      case 'glosario':
        friendlyCategoryName = 'Glosario';
        heading = ['categoria', 'palabra', 'significado'];
        csvString = data.modules.glosario.content
          .map(({ categoria, datos }) => {
            if (datos) {
              return datos
                .map(({ keyword, palabra, significado }) => {
                  const finalTerm = keyword || palabra;
                  if (finalTerm && significado) {
                    return [categoria, finalTerm, significado].map(_quoteAndEscape).join(',');
                  }
                })
                .join('\n');
            }
          })
          .join('\n');
        break;

      default:
        console.log('Unexpected CSV category: ' + category);
        return;
    }

    heading = heading.map(_quoteAndEscape).join(',') + '\n';

    const csvBlob = new Blob([heading + csvString], { type: 'text/csv;charset=utf-8;' });
    let mediaPrefix;
    if (data.media === 'clarin') {
      mediaPrefix = 'Clarín';
    } else if (data.media === 'elcomercio') {
      mediaPrefix = 'El Comercio';
    }

    const fileName = `${mediaPrefix ? mediaPrefix + ' - ' : ''}${friendlyCategoryName} - ${_formatTitle(data.original_title)} (Tabla UalterAI).csv`;

    const tmpLink = document.createElement('a');
    const url = URL.createObjectURL(csvBlob);
    tmpLink.setAttribute('href', url);
    tmpLink.setAttribute('download', fileName);
    tmpLink.style.visibility = 'hidden';
    document.body.appendChild(tmpLink);
    tmpLink.click();
    document.body.removeChild(tmpLink);
  }

  const containerElement = document.querySelector(containerSelector);
  if (containerElement) {
    const ualterContainer = document.createElement('div');
    ualterContainer.classList.add('ualter_content');

    ualterVisibilityObserver = new IntersectionObserver(onEnterViewport, {
      root: null,
      rootMargin: '0px 0px -20% 0px',
      threshold: 1,
    });

    ualterVisibilityObserver.observe(ualterContainer);

    // ### SVG data ###
    const ualterWhiteLogoSvg = '<g clip-path="url(#a)" fill="#fff"><path d="M49.127.833c0-.447.36-.809.808-.809h8.052v1.408a.808.808 0 0 1-.808.808h-8.053V.833Zm8.244 6.062a.808.808 0 0 1-.808.808h-7.438V6.296c0-.447.361-.809.808-.809h7.438v1.408Zm-.192 4.4c.446 0 .808.361.808.808v1.408h-8.052a.808.808 0 0 1-.809-.808v-1.408h8.053ZM28.008 7.325V.035h1.447c.447 0 .808.361.808.808v6.483c0 2.283 1.704 4.218 3.882 4.407l.242.021c.418.035.74.386.74.805v1.444H34.5c-3.578 0-6.49-2.995-6.49-6.675l-.002-.003ZM66.31 9.292l4.204 4.196h-2.705a.808.808 0 0 1-.57-.237l-4.666-4.658a.805.805 0 0 1 .57-1.378h2.38c1.388 0 2.542-1.1 2.574-2.455a2.491 2.491 0 0 0-.716-1.817 2.497 2.497 0 0 0-1.8-.76h-2.694a.808.808 0 0 1-.808-.808V.035h3.502c2.528 0 4.619 2.055 4.663 4.582a4.589 4.589 0 0 1-1.337 3.315 4.853 4.853 0 0 1-2.597 1.36ZM45.033 1.458a.808.808 0 0 1-.808.808h-7.93V.843c0-.447.361-.808.808-.808h7.93v1.423ZM39.55 5.68c0-.447.362-.809.808-.809h1.421v7.82a.808.808 0 0 1-.808.807h-1.42V5.68ZM5.161 13.552C2.315 13.497 0 11.102 0 8.212V.035h1.429c.446 0 .808.361.808.808v7.38c0 1.666 1.325 3.054 2.952 3.092a3.008 3.008 0 0 0 2.185-.861 3.003 3.003 0 0 0 .913-2.164V.843c0-.447.361-.808.808-.808h1.429V8.29a5.223 5.223 0 0 1-1.578 3.754 5.226 5.226 0 0 1-3.683 1.508h-.102ZM20.622.505a.808.808 0 0 0-.75-.505h-.824c-.33 0-.625.2-.749.505l-5.236 12.958h1.688c.44 0 .831-.263.996-.67L19.46 3.6l3.712 9.191c.165.409.557.671.996.671h1.688L20.62.505Z"/><path d="M20.688 9.714c-.44-.088-.78-.43-.868-.868l-.366-1.803-.366 1.803c-.088.44-.43.78-.867.868l-1.804.366 1.804.364c.439.089.779.43.867.868l.366 1.804.366-1.804c.089-.44.43-.78.868-.868l1.803-.364-1.803-.366ZM79.406 12.953l-.307-.84h-3.585l-.306.84a.828.828 0 0 1-.78.544h-1.295l2.898-7.493a.83.83 0 0 1 .773-.53h1.004c.343 0 .65.212.774.53l2.887 7.491h-1.284a.829.829 0 0 1-.78-.544v.002Zm-2.099-5.999-1.335 3.68h2.657l-1.323-3.68h.002ZM83.417 13.498V6.305a.83.83 0 0 1 .83-.83h.878v7.194a.83.83 0 0 1-.83.83h-.878Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h85.127v14H0z"/></clipPath></defs>';
    const upInnerHtml = '<path d="M 16 6.59375 L 15.28125 7.28125 L 2.78125 19.78125 L 4.21875 21.21875 L 16 9.4375 L 27.78125 21.21875 L 29.21875 19.78125 L 16.71875 7.28125 Z"/>'; // Your up arrow path data
    const downInnerHtml = '<path d="M 4.21875 10.78125 L 2.78125 12.21875 L 15.28125 24.71875 L 16 25.40625 L 16.71875 24.71875 L 29.21875 12.21875 L 27.78125 10.78125 L 16 22.5625 Z"/>'; // Your down arrow path data
    const shareIconSvg = '<g clip-path="url(#clip0_400_1792)"><path d="M12.8888 9.77816C12.3847 9.77858 11.8883 9.90163 11.4425 10.1367C10.9966 10.3718 10.6146 10.7118 10.3295 11.1275L5.99012 9.16817C6.29833 8.42392 6.29952 7.58796 5.99345 6.84283L10.3268 4.8735C10.7494 5.48467 11.377 5.92414 12.0958 6.1122C12.8147 6.30025 13.5771 6.22443 14.2449 5.8985C14.9126 5.57256 15.4414 5.0181 15.7353 4.33568C16.0293 3.65325 16.0689 2.88808 15.847 2.17895C15.6251 1.46982 15.1564 0.863696 14.5259 0.470535C13.8954 0.0773743 13.1449 -0.0767867 12.4105 0.0360157C11.6761 0.148818 11.0064 0.521112 10.5229 1.08537C10.0395 1.64962 9.7743 2.36846 9.77545 3.1115C9.77828 3.28736 9.79612 3.46267 9.82878 3.6355L5.22212 5.72883C4.77968 5.31431 4.22579 5.03806 3.6285 4.93401C3.03121 4.82996 2.41654 4.90264 1.85999 5.14314C1.30344 5.38363 0.829268 5.78146 0.495715 6.28774C0.162163 6.79402 -0.0162385 7.38671 -0.0175706 7.993C-0.0189027 8.59928 0.156892 9.19275 0.488217 9.70049C0.819542 10.2082 1.29197 10.6081 1.84745 10.8511C2.40293 11.094 3.01728 11.1694 3.61502 11.068C4.21276 10.9666 4.76786 10.6927 5.21212 10.2802L9.83078 12.3655C9.7987 12.5382 9.78109 12.7132 9.77812 12.8888C9.77799 13.5043 9.96037 14.1059 10.3022 14.6176C10.644 15.1294 11.1299 15.5283 11.6985 15.7639C12.267 15.9994 12.8927 16.0611 13.4963 15.9411C14.0999 15.8211 14.6543 15.5247 15.0895 15.0895C15.5247 14.6544 15.821 14.0999 15.941 13.4963C16.0611 12.8927 15.9994 12.2671 15.7638 11.6985C15.5282 11.13 15.1294 10.6441 14.6176 10.3022C14.1058 9.96041 13.5042 9.77803 12.8888 9.77816ZM12.8888 1.3335C13.2405 1.33337 13.5843 1.43753 13.8768 1.63282C14.1692 1.82811 14.3972 2.10575 14.5319 2.43063C14.6666 2.7555 14.7019 3.11302 14.6334 3.45796C14.5648 3.8029 14.3956 4.11977 14.1469 4.3685C13.8983 4.61722 13.5815 4.78663 13.2366 4.85529C12.8917 4.92394 12.5341 4.88877 12.2092 4.75422C11.8843 4.61967 11.6065 4.39178 11.4111 4.09937C11.2157 3.80697 11.1115 3.46318 11.1115 3.1115C11.1118 2.64017 11.2992 2.18823 11.6324 1.85489C11.9656 1.52154 12.4175 1.33403 12.8888 1.3335ZM3.11145 9.77816C2.75977 9.7783 2.41594 9.67413 2.12347 9.47884C1.83099 9.28355 1.60299 9.00591 1.46832 8.68104C1.33364 8.35616 1.29834 7.99865 1.36687 7.6537C1.4354 7.30876 1.60468 6.99189 1.85331 6.74317C2.10194 6.49444 2.41875 6.32504 2.76367 6.25638C3.10859 6.18772 3.46612 6.22289 3.79104 6.35744C4.11597 6.492 4.39369 6.71989 4.58909 7.01229C4.78449 7.3047 4.88878 7.64848 4.88878 8.00016C4.88826 8.47144 4.70085 8.92327 4.36767 9.25658C4.03449 9.58989 3.58273 9.77746 3.11145 9.77816ZM12.8888 14.6668C12.5371 14.6668 12.1934 14.5626 11.901 14.3672C11.6086 14.1718 11.3807 13.8941 11.2461 13.5692C11.1116 13.2444 11.0763 12.8869 11.1449 12.542C11.2136 12.1971 11.3829 11.8803 11.6315 11.6316C11.8802 11.3829 12.197 11.2136 12.5419 11.145C12.8868 11.0764 13.2443 11.1116 13.5692 11.2462C13.8941 11.3807 14.1718 11.6086 14.3671 11.901C14.5625 12.1934 14.6668 12.5372 14.6668 12.8888C14.6664 13.3603 14.479 13.8123 14.1456 14.1457C13.8123 14.479 13.3602 14.6665 12.8888 14.6668Z"/></g><defs><clipPath id="clip0_400_1792"><rect width="16" height="16" fill="white"/></clipPath></defs>';
    const thumbDownSvg = '<g clip-path="url(#clip0_400_1862)"><path d="M6.73425 12.7505L6.48225 14.2812C6.41617 14.6853 6.46 15.0998 6.60915 15.4811C6.75829 15.8625 7.00725 16.1967 7.32995 16.4488C7.65265 16.7008 8.0372 16.8615 8.44331 16.9139C8.84943 16.9662 9.26216 16.9084 9.63825 16.7465C10.158 16.5132 10.5756 16.0994 10.8135 15.5817L12.2122 12.7505L15.75 12.7505C16.3467 12.7505 16.919 12.5134 17.341 12.0915C17.7629 11.6695 18 11.0972 18 10.5005L18 3.75048C18 3.15374 17.7629 2.58144 17.341 2.15949C16.919 1.73753 16.3467 1.50048 15.75 1.50048L1.4865 1.50048L-3.18924e-06 9.77823L-0.0120026 12.7505L6.73425 12.7505ZM16.5 3.75048L16.5 10.5005C16.5 10.6994 16.421 10.8902 16.2803 11.0308C16.1397 11.1715 15.9489 11.2505 15.75 11.2505L12.75 11.2505L12.75 3.00048L15.75 3.00048C15.9489 3.00048 16.1397 3.0795 16.2803 3.22015C16.421 3.3608 16.5 3.55157 16.5 3.75048ZM1.5 9.97548L2.7525 3.00048L11.25 3.00048L11.25 11.3187L9.43575 14.9937C9.37432 15.1049 9.28738 15.1999 9.18208 15.2709C9.07679 15.3419 8.95614 15.3869 8.83006 15.4022C8.70399 15.4175 8.57608 15.4027 8.45685 15.3589C8.33762 15.3151 8.23049 15.2437 8.14425 15.1505C8.07056 15.0648 8.01669 14.9639 7.98649 14.855C7.95628 14.7461 7.95048 14.6319 7.9695 14.5205L8.50875 11.2505L1.5 11.2505L1.5 9.97548Z" fill="#202020"/></g><defs><clipPath id="clip0_400_1862"><rect width="18" height="18" fill="white" transform="translate(18 18) rotate(-180)"/></clipPath></defs>';
    const thumbUpSvg = '<g clip-path="url(#clip0_400_1856)"><path d="M11.2658 5.24952L11.5178 3.71877C11.5838 3.31466 11.54 2.90021 11.3909 2.51886C11.2417 2.13751 10.9928 1.80329 10.6701 1.55122C10.3474 1.29915 9.9628 1.13851 9.55669 1.08614C9.15057 1.03376 8.73784 1.09158 8.36175 1.25352C7.84197 1.48678 7.42441 1.90061 7.1865 2.41827L5.78775 5.24952H2.25C1.65326 5.24952 1.08097 5.48658 0.65901 5.90853C0.237053 6.33049 0 6.90279 0 7.49952L0 14.2495C0 14.8463 0.237053 15.4186 0.65901 15.8405C1.08097 16.2625 1.65326 16.4995 2.25 16.4995H16.5135L18 8.22177L18.012 5.24952H11.2658ZM1.5 14.2495V7.49952C1.5 7.30061 1.57902 7.10984 1.71967 6.96919C1.86032 6.82854 2.05109 6.74952 2.25 6.74952H5.25V14.9995H2.25C2.05109 14.9995 1.86032 14.9205 1.71967 14.7799C1.57902 14.6392 1.5 14.4484 1.5 14.2495ZM16.5 8.02452L15.2475 14.9995H6.75V6.68127L8.56425 3.00627C8.62568 2.89511 8.71262 2.80012 8.81792 2.72911C8.92321 2.6581 9.04386 2.61309 9.16994 2.59779C9.29601 2.58249 9.42392 2.59733 9.54315 2.64109C9.66238 2.68485 9.76951 2.75629 9.85575 2.84952C9.92944 2.93521 9.98331 3.0361 10.0135 3.145C10.0437 3.2539 10.0495 3.36812 10.0305 3.47952L9.49125 6.74952H16.5V8.02452Z" fill="#202020"/></g><defs><clipPath id="clip0_400_1856"><rect width="18" height="18" fill="white"/></clipPath></defs>';
    const cerrarIconSvg = '<path d="M 16 6.59375 L 15.28125 7.28125 L 2.78125 19.78125 L 4.21875 21.21875 L 16 9.4375 L 27.78125 21.21875 L 29.21875 19.78125 L 16.71875 7.28125 Z"/>';
    const downloadSvg = '<path d="M480-336 288-528l51-51 105 105v-342h72v342l105-105 51 51-192 192ZM263.717-192Q234-192 213-213.15T192-264v-72h72v72h432v-72h72v72q0 29.7-21.162 50.85Q725.676-192 695.96-192H263.717Z"></path>';

    // Function to create a new SVG icon and attach the click event
    const createSvgIcon = (dir, className, yDiv, id) => {
      const arrowIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      arrowIcon.id = id;
      arrowIcon.classList.add(className);
      arrowIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      arrowIcon.setAttribute('viewBox', '0 0 32 32');
      arrowIcon.setAttribute('fill', '#A4A4A4');
      // Set the initial direction of the arrow
      if (dir === 'u') {
        arrowIcon.innerHTML = upInnerHtml;
      } else if (dir === 'd') {
        arrowIcon.innerHTML = downInnerHtml;
      } else if (dir === 'sh') {
        arrowIcon.innerHTML = shareIconSvg;
      }
      return arrowIcon;
    };

    // Create an array to store the SVG icons
    const svgIcons = [];
    // Function to toggle the content visibility when clicking the title
    const toggleContentVisibility = (zDiv, expButton) => {
      let newStatus = 'open';

      if (zDiv.classList.contains('expanded')) {
        const padre = zDiv.parentElement;

        newStatus = 'closed';
        padre.classList.remove('visible');
        zDiv.style.maxHeight = '0';
        zDiv.classList.remove('expanded');
        // expButton.textContent = '▲'; // Display up arrow when expanded
        expButton.innerHTML = downInnerHtml;
        setTimeout(function () {
          const modules = document.getElementById('modules');
          const topPos = modules.getBoundingClientRect().top + window.pageYOffset - 90;
          window.scrollTo({
            top: topPos, // scroll so that the element is at the top of the view
            behavior: 'smooth', // smooth scroll
          });
        }, 600);
      } else {
        const padre = zDiv.parentElement;
        padre.classList.add('visible');

        setTimeout(function () {
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
        // expButton.textContent = '▼'; // Display down arrow when collapsed
        expButton.innerHTML = upInnerHtml;
        const height = zDiv.getBoundingClientRect().top + document.documentElement.scrollTop;
        zDiv.scroll({
          top: height,
          left: 0,
          behavior: 'smooth',
        });
      }

      return newStatus;
    };

    const closeAll = () => {
      const expanded = document.querySelectorAll('.expanded');
      expanded.forEach((item) => {
        const padre = item.parentNode;
        const expandButton = padre.getElementsByClassName('expand-button')[0];
        toggleContentVisibility(item, expandButton);
      });
      document.getElementById('cb1').click();
    };

    const toggleContentVisibilityChild = (zDiv, expButton) => {
      let newStatus = 'open';

      if (zDiv.classList.contains('expanded')) {
        zDiv.style.maxHeight = '0';
        zDiv.classList.remove('expanded');
        expButton.innerHTML = downInnerHtml;
      } else {
        newStatus = 'closed';
        zDiv.style.maxHeight = zDiv.scrollHeight + 'px';
        zDiv.classList.add('expanded');
        expButton.innerHTML = upInnerHtml;
      }

      return newStatus;
    };

    const cerrarModulo = (zDiv, expButton) => {
      const padre = zDiv.parentElement;
      padre.classList.remove('visible');
      zDiv.style.maxHeight = '0';
      zDiv.classList.remove('expanded');
      expButton.innerHTML = downInnerHtml;
      setTimeout(function () {
        const modules = document.getElementById('modules');

        const topPos = modules.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({
          top: topPos, // scroll so that the element is at the top of the view
          behavior: 'smooth', // smooth scroll
        });
      }, 600);
    };

    const adjustMaxHeight = (pDiv, miniExpandedDiv) => {
      const normalHeight = parseInt(pDiv.style.maxHeight, 10);
      const expandedDivHeight = parseInt(miniExpandedDiv.style.maxHeight, 10);
      if (miniExpandedDiv.style.maxHeight >= 0 + 'px') {
        pDiv.style.maxHeight = normalHeight + expandedDivHeight + 'px';
      }
    };

    // ### CONTENEDOR UALTER ###
    const ualterContent = document.createElement('section');
    ualterContent.classList.add('accordion');

    const ualterTab = document.createElement('div');
    ualterTab.classList.add('tab');

    const ualterInput = document.createElement('input');
    ualterInput.setAttribute('type', 'checkbox');
    ualterInput.setAttribute('name', 'accordion-1');
    ualterInput.id = 'cb1';

    const ualterLabel = document.createElement('label');
    ualterLabel.setAttribute('for', 'cb1');
    ualterLabel.classList.add('tab__label');

    const ualterLogoSVG = '<circle cx="14.5" cy="14.5" r="14.5" fill="url(#a)"/><g clip-path="url(#b)" fill="#fff"><path d="M14.4 23A6.4 6.4 0 0 1 8 16.7V7h1.8c.5 0 1 .4 1 1v8.7c0 2 1.6 3.6 3.6 3.7 1 0 2-.4 2.7-1 .7-.7 1.1-1.7 1.1-2.6V8c0-.6.5-1 1-1H21v9.8a6 6 0 0 1-2 4.4 6.6 6.6 0 0 1-4.5 1.8h-.1Z"/><path d="m14.5 11.8.3 1.4c.1.5.5 1 1 1l1.5.3-1.5.3c-.5 0-.9.5-1 1l-.3 1.4-.3-1.5c-.1-.4-.5-.8-1-1l-1.5-.2 1.5-.3c.5 0 .9-.5 1-1l.3-1.4Z"/></g><defs><linearGradient id="a" x1="23.5" y1="3" x2="6.5" y2="25.5" gradientUnits="userSpaceOnUse"><stop stop-color="#040508"/><stop offset=".4" stop-color="#1C2C45"/></linearGradient><clipPath id="b"><path fill="#fff" d="M8 7h13v16H8z"/></clipPath></defs>';
    const ualterLogo = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    ualterLogo.classList.add('ualter_logo');
    ualterLogo.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    ualterLogo.setAttribute('viewBox', '0 0 29 29');
    ualterLogo.innerHTML = ualterLogoSVG;

    const ualterLogoOpen = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    ualterLogoOpen.classList.add('ualter_logo_open');
    ualterLogoOpen.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    ualterLogoOpen.setAttribute('viewBox', '0 0 86 14');
    ualterLogoOpen.innerHTML = ualterWhiteLogoSvg;

    const ualterTitle = document.createElement('div');
    ualterTitle.classList.add('ai');
    ualterTitle.innerHTML = '<span class="smallTitle">Ver resumen</span>';
    const reading_span = document.createElement('span');
    reading_span.innerHTML = 'Tiempo de lectura: ' + Math.round(data.summary_reading_time) + 's';
    ualterTitle.appendChild(reading_span);

    const ualterTitleOpen = document.createElement('div');
    ualterTitleOpen.classList.add('ai_open');
    ualterTitleOpen.textContent = 'Inteligencia Artificial';

    ualterLabel.appendChild(ualterLogo);
    ualterLabel.appendChild(ualterLogoOpen);
    ualterLabel.appendChild(ualterTitle);
    ualterLabel.appendChild(ualterTitleOpen);

    const ualterTabContent = document.createElement('div');
    ualterTabContent.classList.add('tab__content');

    containerElement.appendChild(ualterTabContent);

    // ### SINTESIS ###
    const experimental = document.createElement('div');
    experimental.classList.add('experimental');
    experimental.textContent = 'Experimental: Resumen y análisis automáticos realizados con Inteligencia Artificial';
    const sintesisRectangle = document.createElement('div');
    sintesisRectangle.classList.add('sintesis');
    const sintesisHeader = document.createElement('div');
    sintesisHeader.classList.add('sintesis-header');
    const last_updated_at = data.last_updated_at;
    const fecha = new Date(Date.parse(last_updated_at));
    const sintesisFecha = document.createElement('time');
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    sintesisFecha.innerHTML = last_updated_at ? fecha.toLocaleString('es-ES', options) : '';
    const sintesisTitulo = document.createElement('h2');
    sintesisTitulo.innerHTML = data.original_title;
    const original_reading_time = Math.round(data.original_reading_time);
    const summary_reading_time = Math.round(data.summary_reading_time);
    const summary_data = document.createElement('input');
    summary_data.setAttribute('type', 'hidden');
    summary_data.id = 'summary_reading_time';
    summary_data.value = summary_reading_time;
    const original_data = document.createElement('input');
    original_data.setAttribute('type', 'hidden');
    original_data.id = 'original_reading_time';
    original_data.value = original_reading_time;

    const sintesisSubT = document.createElement('h4');
    sintesisSubT.innerHTML = '<strong>RESUMEN</strong> <span>' + summary_reading_time + 's</span> (Lectura completa ' + original_reading_time + 's)';

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('sintesis-content');

    const resumen = data.modules.resumen.content;
    contentDiv.innerHTML = '<p id="typing-animation">' + resumen + '</p>';

    const sliderWrapper = document.createElement('div');
    sliderWrapper.classList.add('slider-wrapper');

    const slideArrowPrev = document.createElement('button');
    slideArrowPrev.classList.add('slide-arrow');
    slideArrowPrev.id = 'slide-arrow-prev';
    slideArrowPrev.innerHTML = '&#8249;';

    const slideArrowNext = document.createElement('button');
    slideArrowNext.classList.add('slide-arrow');
    slideArrowNext.id = 'slide-arrow-next';
    slideArrowNext.innerHTML = '&#8250;';

    const slideContainer = document.createElement('ul');
    slideContainer.classList.add('slides-container');
    slideContainer.id = 'slides-container';

    const imgArray = data.images;

    imgArray.forEach((item, i) => {
      const slide = document.createElement('li');
      slide.classList.add('slide');
      const slideImg = document.createElement('img');

      let urlImg;
      if (data.media === 'clarin') {
        const clippings = item.value.clippings;
        urlImg = arrayLookup('square_lg', clippings, '_id', 'url');
        if (!urlImg) {
          urlImg = arrayLookup('modal_horizontal_md', clippings, '_id', 'url');
        }
        slideImg.src = 'https://www.clarin.com/img' + urlImg;
      } else {
        slideImg.src = item.value;
      }

      slideImg.alt = item.epigraphe || 'Imagen';
      slideImg.setAttribute('loading', 'lazy');
      const imgEpigraphe = document.createElement('p');
      imgEpigraphe.classList.add('img-epigraph');
      imgEpigraphe.textContent = item.epigraphe;
      slide.appendChild(slideImg);
      slide.appendChild(imgEpigraphe);
      slideContainer.appendChild(slide);
    });
    if (imgArray.length > 1) {
      sliderWrapper.appendChild(slideArrowPrev);
      sliderWrapper.appendChild(slideArrowNext);
    }
    sliderWrapper.appendChild(slideContainer);
    contentDiv.appendChild(sliderWrapper);

    const sintesisFooter = document.createElement('div');
    sintesisFooter.classList.add('sintesis-footer');
    const validar = document.createElement('div');
    validar.classList.add('validar');
    const manos = document.createElement('div');
    manos.classList.add('manos');
    const gracias = document.createElement('div');
    gracias.classList.add('gracias');
    gracias.innerHTML = 'Gracias!';

    const thumbDown = document.createElement('a');
    thumbDown.classList.add('thumb-down');
    thumbDown.src = '#';
    thumbDown.setAttribute('aria-label', 'pulgar abajo');
    const thumbDownIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    thumbDownIcon.classList.add('icon-thumb-down');
    thumbDownIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    thumbDownIcon.setAttribute('viewBox', '0 0 18 18');
    thumbDownIcon.innerHTML = thumbDownSvg;
    thumbDown.appendChild(thumbDownIcon);
    const thumbUp = document.createElement('a');
    thumbUp.classList.add('thumb-up');
    thumbUp.src = '#';
    thumbUp.setAttribute('aria-label', 'pulgar arriba');
    const thumbUpIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    thumbUpIcon.classList.add('icon-thumb-up');
    thumbUpIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    thumbUpIcon.setAttribute('viewBox', '0 0 18 18');
    thumbUpIcon.innerHTML = thumbUpSvg;
    thumbUp.appendChild(thumbUpIcon);

    thumbUp.addEventListener('click', () => {
      if (thumbDown.classList.contains('dislike')) {
        thumbDown.classList.remove('dislike');
      }
      if (thumbUp.classList.contains('like')) {
      } else {
        ualterTrack('like_sintesis');
      }
      thumbUp.classList.add('like');

      gracias.classList.add('on');

      setTimeout(() => {
        gracias.classList.remove('on');
      }, '2000');
    });

    thumbDown.addEventListener('click', () => {
      if (thumbUp.classList.contains('like')) {
        thumbUp.classList.remove('like');
      }
      if (thumbDown.classList.contains('dislike')) {
      } else {
        ualterTrack('dislike_sintesis');
      }
      thumbDown.classList.add('dislike');

      gracias.classList.add('on');

      setTimeout(() => {
        gracias.classList.remove('on');
      }, '2000');
    });

    manos.appendChild(thumbDown);
    manos.appendChild(thumbUp);
    manos.appendChild(gracias);
    sintesisFooter.appendChild(manos);
    // sintesisFooter.appendChild(verOriginal);

    const otrosAnalisis = document.createElement('div');
    otrosAnalisis.classList.add('otros');
    otrosAnalisis.id = 'modules';
    otrosAnalisis.textContent = 'Otros análisis (Experimental)';

    sintesisHeader.appendChild(sintesisFecha);
    sintesisHeader.appendChild(sintesisTitulo);
    sintesisHeader.appendChild(sintesisSubT);
    // sintesisHeader.appendChild(tiempoLectura);
    sintesisHeader.appendChild(summary_data);
    sintesisHeader.appendChild(original_data);
    sintesisRectangle.appendChild(sintesisHeader);
    sintesisRectangle.appendChild(contentDiv);
    sintesisRectangle.appendChild(sintesisFooter);
    sintesisRectangle.appendChild(otrosAnalisis);

    const temp = document.createElement('div');
    temp.id = 'temp';
    temp.classList.add('temp');
    temp.innerHTML = '';

    // Append the rectangle to the container
    ualterTabContent.appendChild(temp);
    ualterTabContent.appendChild(experimental);
    ualterTabContent.appendChild(sintesisRectangle);

    // ### ORDENADO ###
    try {
      const cronArray = !data.modules.cronologia ? [] : data.modules.cronologia.content.filter(({ hecho }) => hecho);
      if (cronArray.length > 0) {
        const cronRctg = document.createElement('div');
        cronRctg.classList.add('expandable-rectangle');
        const cronClickable = document.createElement('div');
        cronClickable.classList.add('clickable');

        const cronContainer = document.createElement('div');
        cronContainer.classList.add('cron-container');
        cronContainer.classList.add('content');
        const icon1 = createSvgIcon('d', 'expand-button', contentDiv, 'eb-cronologia');
        svgIcons.push(icon1);
        cronClickable.addEventListener('click', () => {
          currentsvgIcons = document.getElementById('eb-cronologia');
          if (toggleContentVisibility(cronContainer, currentsvgIcons) === 'open') {
            ualterTrack('module_cronologia_open', true);
          }
        });
        const cronSubT = document.createElement('h4');
        cronSubT.classList.add('sub-title');
        cronSubT.innerHTML = '<strong>PUNTEO</strong> Información ordenada cronológica o lógicamente';
        const crnClickableArr = [];
        const expButtons = [];
        cronArray.forEach((item, i) => {
          const cardcron = document.createElement('div');
          cardcron.classList.add('cron-card');
          const crnClickable = document.createElement('div');
          crnClickable.classList.add('clickable');
          crnClickable.classList.add('cron-container');
          crnClickableArr.push(crnClickable);
          const nameContainer = document.createElement('p');
          nameContainer.classList.add('hecho-container');
          nameContainer.classList.add('underline');
          const enumeration = Number(i) + 1;
          nameContainer.innerHTML = '<span>' + enumeration + '. ' + item.hecho + "</span><svg viewBox='0 0 13 20'><polyline points='0.5 19.5 3 19.5 12.5 10 3 0.5' /></svg>";
          const cronContext = document.createElement('div');
          cronContext.classList.add('contexto');
          const cronol_contexto_final = item.contexto_original || '';
          cronContext.innerHTML = '<p><strong>Texto Original: </strong>“' + cronol_contexto_final + '”</p>';

          const iconic = createSvgIcon('d', 'exp-button', cronContext);
          expButtons.push(iconic);
          crnClickableArr[i].addEventListener('click', (e) => {
            if (toggleContentVisibilityChild(cronContext, iconic) === 'open') {
              ualterTrack('module_cronologia_detalle_open');
            }
            adjustMaxHeight(cronContainer, cronContext);
            e.stopPropagation();
          });
          crnClickable.appendChild(nameContainer);
          crnClickable.appendChild(iconic);
          cardcron.appendChild(crnClickable);
          cardcron.appendChild(cronContext);
          cronContainer.appendChild(cardcron);
        });
        const moduloFooter = document.createElement('div');
        moduloFooter.classList.add('modulo-footer');
        const validar = document.createElement('div');
        validar.classList.add('validar');
        const manos = document.createElement('div');
        manos.classList.add('manos');
        const gracias = document.createElement('div');
        gracias.classList.add('gracias');
        gracias.innerHTML = 'Gracias!';
        const thumbDown = document.createElement('a');
        thumbDown.classList.add('thumb-down');
        thumbDown.src = '#';
        thumbDown.setAttribute('aria-label', 'pulgar abajo');
        const thumbDownIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        thumbDownIcon.classList.add('icon-thumb-down');
        thumbDownIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        thumbDownIcon.setAttribute('viewBox', '0 0 18 18');
        thumbDownIcon.innerHTML = thumbDownSvg;
        thumbDown.appendChild(thumbDownIcon);
        const thumbUp = document.createElement('a');
        thumbUp.classList.add('thumb-up');
        thumbUp.src = '#';
        thumbUp.setAttribute('aria-label', 'pulgar arriba');
        const thumbUpIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        thumbUpIcon.classList.add('icon-thumb-up');
        thumbUpIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        thumbUpIcon.setAttribute('viewBox', '0 0 18 18');
        thumbUpIcon.innerHTML = thumbUpSvg;
        thumbUp.appendChild(thumbUpIcon);

        thumbUp.addEventListener('click', () => {
          if (thumbDown.classList.contains('dislike')) {
            thumbDown.classList.remove('dislike');
          }
          if (thumbUp.classList.contains('like')) {
          } else {
            ualterTrack('like_cronologia');
          }
          thumbUp.classList.add('like');
          gracias.classList.add('on');

          setTimeout(() => {
            gracias.classList.remove('on');
          }, '2000');
        });

        thumbDown.addEventListener('click', () => {
          if (thumbUp.classList.contains('like')) {
            thumbUp.classList.remove('like');
          }
          if (thumbDown.classList.contains('dislike')) {
          } else {
            ualterTrack('dislike_cronologia');
          }
          thumbDown.classList.add('dislike');
          gracias.classList.add('on');

          setTimeout(() => {
            gracias.classList.remove('on');
          }, '2000');
        });
        manos.appendChild(thumbDown);
        manos.appendChild(thumbUp);
        manos.appendChild(gracias);
        const verOriginal = document.createElement('a');
        verOriginal.classList.add('ver');
        verOriginal.href = '#';
        verOriginal.setAttribute('aria-label', 'texto original');
        verOriginal.textContent = 'Ver texto original';
        verOriginal.addEventListener('click', (e) => {
          e.stopPropagation();
          closeAll();
        });
        validar.appendChild(manos);
        const divCerrar = document.createElement('div');
        divCerrar.classList.add('cerrar_clickable');
        const cerrarIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        cerrarIcon.classList.add('collapse-button');
        cerrarIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        cerrarIcon.setAttribute('viewBox', '0 0 32 32');
        cerrarIcon.innerHTML = cerrarIconSvg;
        divCerrar.appendChild(cerrarIcon);
        divCerrar.addEventListener('click', (e) => {
          ualterTrack('module_cronologia_close');
          currentsvgIcons = document.getElementById('eb-cronologia');
          e.stopPropagation();
          cerrarModulo(cronContainer, currentsvgIcons);
        });
        moduloFooter.appendChild(validar);
        moduloFooter.appendChild(verOriginal);
        moduloFooter.appendChild(divCerrar);
        cronContainer.appendChild(moduloFooter);
        let current;
        svgIcons.forEach((item, i) => {
          if (item.id === 'eb-cronologia') {
            current = i;
          }
        });
        cronClickable.appendChild(svgIcons[current]);
        cronClickable.appendChild(cronSubT);
        cronRctg.appendChild(cronClickable);
        cronRctg.appendChild(cronContainer);
        ualterTabContent.appendChild(cronRctg);
      }
    } catch (error) {
      console.log('Hubo un error en Cronología: ', error);
    }

    // ### TEXTUALES ###
    if (data.modules.textuales) {
      try {
        const textualesArray = data.modules.textuales.content;
        const txtDestacRctg = document.createElement('div');
        txtDestacRctg.classList.add('expandable-rectangle');
        const txtDestacClickable = document.createElement('div');
        txtDestacClickable.classList.add('clickable');
        // Create a div for the title

        const txtualesSubT = document.createElement('h4');
        txtualesSubT.classList.add('sub-title');
        // txtualesSubT.textContent = "DESTACADOS Textuales, testimonios, declaraciones y textos clave";
        txtualesSubT.innerHTML = '<strong>DESTACADOS</strong> Textuales, testimonios y declaraciones';
        // Create a div for the Cards
        const cardsContainer = document.createElement('div');
        cardsContainer.classList.add('textual-container');
        cardsContainer.classList.add('content');
        // cardsContainer.style.display = 'block'; // Start with content visible
        // cardsContainer.classList.add('expanded')
        const icon2 = createSvgIcon('d', 'expand-button', cardsContainer, 'eb-destacados');
        svgIcons.push(icon2);
        // Set the click event handler for the button in the second rectangle
        txtDestacClickable.addEventListener('click', () => {
          currentsvgIcons = document.getElementById('eb-destacados');
          if (toggleContentVisibility(cardsContainer, currentsvgIcons) === 'open') {
            ualterTrack('module_destacados_open', true);
          }
        });
        // Iterate through the "textualesArray" and create cards
        textualesArray.forEach((item, i) => {
          // Create a new div for the card
          const textCard = document.createElement('div');
          textCard.classList.add('textual-card');
          // Create a div for the "autor" name
          const contAutor = document.createElement('p');
          contAutor.classList.add('cont-autor');
          // Create a div for the "cita" text
          const citaDiv = document.createElement('em');
          citaDiv.classList.add('cita');
          citaDiv.textContent = item.cita;
          // Append the "autor" and "cita" divs to the card
          if (item.autor) {
            const autorDiv = document.createElement('strong');
            autorDiv.classList.add('autor');
            autorDiv.textContent = item.autor + ': ';
            contAutor.appendChild(autorDiv);
          }
          contAutor.appendChild(citaDiv);
          textCard.appendChild(contAutor);
          // Append the card to the parent container
          cardsContainer.appendChild(textCard);
        });
        const moduloFooter = document.createElement('div');
        moduloFooter.classList.add('modulo-footer');
        const validar = document.createElement('div');
        validar.classList.add('validar');
        const manos = document.createElement('div');
        manos.classList.add('manos');
        const gracias = document.createElement('div');
        gracias.classList.add('gracias');
        gracias.innerHTML = 'Gracias!';
        const thumbDown = document.createElement('a');
        thumbDown.classList.add('thumb-down');
        thumbDown.src = '#';
        thumbDown.setAttribute('aria-label', 'pulgar abajo');
        const thumbDownIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        thumbDownIcon.classList.add('icon-thumb-down');
        thumbDownIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        thumbDownIcon.setAttribute('viewBox', '0 0 18 18');
        thumbDownIcon.innerHTML = thumbDownSvg;
        thumbDown.appendChild(thumbDownIcon);
        const thumbUp = document.createElement('a');
        thumbUp.classList.add('thumb-up');
        thumbUp.src = '#';
        thumbUp.setAttribute('aria-label', 'pulgar arriba');
        const thumbUpIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        thumbUpIcon.classList.add('icon-thumb-up');
        thumbUpIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        thumbUpIcon.setAttribute('viewBox', '0 0 18 18');
        thumbUpIcon.innerHTML = thumbUpSvg;
        thumbUp.appendChild(thumbUpIcon);
        thumbUp.addEventListener('click', () => {
          if (thumbDown.classList.contains('dislike')) {
            thumbDown.classList.remove('dislike');
          }
          if (thumbUp.classList.contains('like')) {
          } else {
            ualterTrack('like_destacados');
          }
          thumbUp.classList.add('like');
          gracias.classList.add('on');

          setTimeout(() => {
            gracias.classList.remove('on');
          }, '2000');
        });

        thumbDown.addEventListener('click', () => {
          if (thumbUp.classList.contains('like')) {
            thumbUp.classList.remove('like');
          }
          if (thumbDown.classList.contains('dislike')) {
          } else {
            ualterTrack('dislike_destacados');
          }
          thumbDown.classList.add('dislike');
          gracias.classList.add('on');

          setTimeout(() => {
            gracias.classList.remove('on');
          }, '2000');
        });
        manos.appendChild(thumbDown);
        manos.appendChild(thumbUp);
        manos.appendChild(gracias);
        const verOriginal = document.createElement('a');
        verOriginal.classList.add('ver');
        verOriginal.href = '#';
        verOriginal.setAttribute('aria-label', 'texto original');
        verOriginal.textContent = 'Ver texto original';
        verOriginal.addEventListener('click', (e) => {
          e.stopPropagation();
          closeAll();
        });
        validar.appendChild(manos);
        const divCerrar = document.createElement('div');
        divCerrar.classList.add('cerrar_clickable');
        const cerrarIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        cerrarIcon.classList.add('collapse-button');
        cerrarIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        cerrarIcon.setAttribute('viewBox', '0 0 32 32');
        cerrarIcon.innerHTML = cerrarIconSvg;
        divCerrar.appendChild(cerrarIcon);
        divCerrar.addEventListener('click', (e) => {
          currentsvgIcons = document.getElementById('eb-destacados');
          ualterTrack('module_destacados_close');
          e.stopPropagation();
          cerrarModulo(cardsContainer, currentsvgIcons);
        });
        moduloFooter.appendChild(validar);
        moduloFooter.appendChild(verOriginal);
        moduloFooter.appendChild(divCerrar);
        cardsContainer.appendChild(moduloFooter);
        let current;
        svgIcons.forEach((item, i) => {
          if (item.id === 'eb-destacados') {
            current = i;
          }
        });
        txtDestacClickable.appendChild(svgIcons[current]);
        txtDestacClickable.appendChild(txtualesSubT);
        txtDestacRctg.appendChild(txtDestacClickable);
        txtDestacRctg.appendChild(cardsContainer);
        // Append the rectangle to the container
        ualterTabContent.appendChild(txtDestacRctg);
      } catch (error) {
        console.log('Hubo un error en Textuales: ', error);
      }
    }

    // ### NUMBERS ###
    if (data.modules.numeros) {
      try {
        const numbersArray = data.modules.numeros.content;
        // Create the expandable rectangle div
        const numbersRctg = document.createElement('div');
        numbersRctg.classList.add('expandable-rectangle');
        // Create a div for the title

        const numbersClickable = document.createElement('div');
        numbersClickable.classList.add('clickable');
        // Create a div for the Cards
        const numbersContainer = document.createElement('div');
        numbersContainer.classList.add('numbers-container');
        numbersContainer.classList.add('content');
        numbersContainer.id = 'module_numeros';
        // numbersContainer.style.display = 'none'; // Start with content invisible
        const icon3 = createSvgIcon('d', 'expand-button', numbersContainer, 'eb-numeros');
        svgIcons.push(icon3);
        // Set the click event handler for the button in the second rectangle
        numbersClickable.addEventListener('click', () => {
          currentsvgIcons = document.getElementById('eb-numeros');
          if (toggleContentVisibility(numbersContainer, currentsvgIcons) === 'open') {
            ualterTrack('module_numeros_open', true);
          }
        });
        // Create Numbers subtitle
        const numbersSubT = document.createElement('h4');
        numbersSubT.classList.add('sub-title');
        numbersSubT.innerHTML = '<strong>DATOS</strong> Tabla con cifras extraídas del original';

        numbersArray.forEach((it, i) => {
          const taCat = document.createElement('div');
          taCat.classList.add('cat-table');
          taCat.innerHTML = it.categoria;
          const datosArray = it.datos;

          const numTable = document.createElement('table');
          numTable.classList.add('num-table');
          // Create a table header row
          const numHeaderRow = numTable.insertRow();
          // Create header cells
          const relacionHeader = numHeaderRow.insertCell(0);
          relacionHeader.textContent = 'Descripción';
          const numeroHeader = numHeaderRow.insertCell(1);
          numeroHeader.textContent = 'Valor';

          datosArray.forEach((item, i) => {
            const numero = item.numero;
            if (numero === null || numero === undefined) return;

            const row = numTable.insertRow(i + 1); // i + 1 because we have a header row

            // Create cells and set their textContent
            const relacionCell = row.insertCell(0);
            const numeroCell = row.insertCell(1);
            numeroCell.textContent = numero.toLocaleString('es-ES');
            relacionCell.innerHTML = (item.descripcion || '').replace(numero, "<span class='highlight'>" + numero + '</span>');
          });
          numbersContainer.appendChild(taCat);
          numbersContainer.appendChild(numTable);
        });
        const moduloFooter = document.createElement('div');
        moduloFooter.classList.add('modulo-footer');
        const validar = document.createElement('div');
        validar.classList.add('validar');
        const manos = document.createElement('div');
        manos.classList.add('manos');
        const gracias = document.createElement('div');
        gracias.classList.add('gracias');
        gracias.innerHTML = 'Gracias!';
        const thumbDown = document.createElement('a');
        thumbDown.classList.add('thumb-down');
        thumbDown.src = '#';
        thumbDown.setAttribute('aria-label', 'pulgar abajo');
        const thumbDownIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        thumbDownIcon.classList.add('icon-thumb-down');
        thumbDownIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        thumbDownIcon.setAttribute('viewBox', '0 0 18 18');
        thumbDownIcon.innerHTML = thumbDownSvg;
        thumbDown.appendChild(thumbDownIcon);
        const thumbUp = document.createElement('a');
        thumbUp.classList.add('thumb-up');
        thumbUp.src = '#';
        thumbUp.setAttribute('aria-label', 'pulgar arriba');
        const thumbUpIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        thumbUpIcon.classList.add('icon-thumb-up');
        thumbUpIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        thumbUpIcon.setAttribute('viewBox', '0 0 18 18');
        thumbUpIcon.innerHTML = thumbUpSvg;
        thumbUp.appendChild(thumbUpIcon);
        thumbUp.addEventListener('click', () => {
          if (thumbDown.classList.contains('dislike')) {
            thumbDown.classList.remove('dislike');
          }
          if (thumbUp.classList.contains('like')) {
          } else {
            ualterTrack('like_datos');
          }
          thumbUp.classList.add('like');
          gracias.classList.add('on');

          setTimeout(() => {
            gracias.classList.remove('on');
          }, '2000');
        });

        thumbDown.addEventListener('click', () => {
          if (thumbUp.classList.contains('like')) {
            thumbUp.classList.remove('like');
          }
          if (thumbDown.classList.contains('dislike')) {
          } else {
            ualterTrack('dislike_datos');
          }
          thumbDown.classList.add('dislike');
          gracias.classList.add('on');

          setTimeout(() => {
            gracias.classList.remove('on');
          }, '2000');
        });
        manos.appendChild(thumbDown);
        manos.appendChild(thumbUp);
        manos.appendChild(gracias);
        const verOriginal = document.createElement('a');
        verOriginal.classList.add('ver');
        verOriginal.href = '#';
        verOriginal.setAttribute('aria-label', 'texto original');
        verOriginal.textContent = 'Ver texto original';
        verOriginal.addEventListener('click', (e) => {
          e.stopPropagation();
          closeAll();
        });
        validar.appendChild(manos);

        const download = document.createElement('div');
        download.classList.add('download');
        const downloadLink = document.createElement('a');
        downloadLink.classList.add('download_link');
        const downloadText = document.createElement('span');
        downloadText.textContent = 'Descargar CSV';
        const downloadIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        downloadIcon.classList.add('icon-download');
        downloadIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        downloadIcon.setAttribute('viewBox', '0 -960 960 960');
        downloadIcon.innerHTML = downloadSvg;
        downloadLink.appendChild(downloadIcon);
        downloadLink.addEventListener('click', (e) => {
          try {
            ualterGetCSV('numeros');
          } catch (error) {
            console.warn('Error creating CSV', error);
          }
          e.stopPropagation();
        });
        downloadLink.appendChild(downloadText);
        download.appendChild(downloadLink);

        const divCerrar = document.createElement('div');
        divCerrar.classList.add('cerrar_clickable');
        const cerrarIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        cerrarIcon.classList.add('collapse-button');
        cerrarIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        cerrarIcon.setAttribute('viewBox', '0 0 32 32');
        cerrarIcon.innerHTML = cerrarIconSvg;
        divCerrar.appendChild(cerrarIcon);
        divCerrar.addEventListener('click', (e) => {
          currentsvgIcons = document.getElementById('eb-numeros');
          ualterTrack('module_numeros_close');
          e.stopPropagation();
          cerrarModulo(numbersContainer, currentsvgIcons);
        });
        moduloFooter.appendChild(validar);
        moduloFooter.appendChild(verOriginal);
        moduloFooter.appendChild(download);
        moduloFooter.appendChild(divCerrar);
        numbersContainer.appendChild(moduloFooter);
        let current;
        svgIcons.forEach((item, i) => {
          if (item.id === 'eb-numeros') {
            current = i;
          }
        });
        numbersClickable.appendChild(svgIcons[current]);
        numbersClickable.appendChild(numbersSubT);
        numbersRctg.appendChild(numbersClickable);
        numbersRctg.appendChild(numbersContainer);
        // Append the rectangle to the container
        ualterTabContent.appendChild(numbersRctg);
      } catch (error) {
        console.log('Hubo un error en Numbers: ', error);
      }
    }

    // ### PREGUNTAS ###
    if (data.modules.preguntas) {
      try {
        const pregsArray = data.modules.preguntas.content;
        // Create the expandable rectangle div
        const preguntasRctg = document.createElement('div');
        preguntasRctg.classList.add('expandable-rectangle');
        // preguntasRctg.id = 'tries';
        const pregsClickable = document.createElement('div');
        pregsClickable.classList.add('clickable');
        // Create a div for the title

        const subTpregs = document.createElement('h4');
        subTpregs.classList.add('sub-title');
        // subTpregs.textContent = "FAQ La información presentada como preguntas frecuentes";
        subTpregs.innerHTML = '<strong>FAQ</strong> Información como preguntas frecuentes';
        const pregsContainer = document.createElement('div');
        pregsContainer.classList.add('pregs-container');
        pregsContainer.classList.add('content');
        const icon5 = createSvgIcon('d', 'expand-button', pregsContainer, 'eb-preguntas');
        svgIcons.push(icon5);
        pregsClickable.addEventListener('click', () => {
          currentsvgIcons = document.getElementById('eb-preguntas');
          if (toggleContentVisibility(pregsContainer, currentsvgIcons) === 'open') {
            ualterTrack('module_preguntas_open', true);
          }
        });
        const pregClickableArr = [];
        const isPregClicked = false;
        const respItems = [];
        const pregExpIcons = [];
        pregsArray.forEach((item, i) => {
          const cardPreg = document.createElement('div');
          cardPreg.classList.add('preg-card');
          if (i === 0) {
            cardPreg.classList.add('preg-line');
          } else if (i !== pregsArray.length - 1) {
            cardPreg.classList.add('preg-line');
          } else if (i === pregsArray.length - 1) {
            cardPreg.classList.add('preg-last');
          }
          const pregClickable = document.createElement('div');
          pregClickable.classList.add('preg-container');
          pregClickableArr.push(pregClickable);
          const pregDiv = document.createElement('p');
          pregDiv.classList.add('preg');
          pregDiv.textContent = i + 1 + '. ' + item.pregunta;
          const respDiv = document.createElement('p');
          respDiv.classList.add('resp');
          respDiv.textContent = item.respuesta;
          respItems.push(respDiv);
          pregClickable.appendChild(pregDiv);
          cardPreg.appendChild(pregClickable);
          cardPreg.appendChild(respDiv);
          pregsContainer.appendChild(cardPreg);
        });
        const moduloFooter = document.createElement('div');
        moduloFooter.classList.add('modulo-footer');
        const validar = document.createElement('div');
        validar.classList.add('validar');
        const manos = document.createElement('div');
        manos.classList.add('manos');
        const gracias = document.createElement('div');
        gracias.classList.add('gracias');
        gracias.innerHTML = 'Gracias!';
        const thumbDown = document.createElement('a');
        thumbDown.classList.add('thumb-down');
        thumbDown.src = '#';
        thumbDown.setAttribute('aria-label', 'pulgar abajo');
        const thumbDownIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        thumbDownIcon.classList.add('icon-thumb-down');
        thumbDownIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        thumbDownIcon.setAttribute('viewBox', '0 0 18 18');
        thumbDownIcon.innerHTML = thumbDownSvg;
        thumbDown.appendChild(thumbDownIcon);
        const thumbUp = document.createElement('a');
        thumbUp.classList.add('thumb-up');
        thumbUp.src = '#';
        thumbUp.setAttribute('aria-label', 'pulgar arriba');
        const thumbUpIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        thumbUpIcon.classList.add('icon-thumb-up');
        thumbUpIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        thumbUpIcon.setAttribute('viewBox', '0 0 18 18');
        thumbUpIcon.innerHTML = thumbUpSvg;
        thumbUp.appendChild(thumbUpIcon);
        thumbUp.addEventListener('click', () => {
          if (thumbDown.classList.contains('dislike')) {
            thumbDown.classList.remove('dislike');
          }
          if (thumbUp.classList.contains('like')) {
          } else {
            ualterTrack('like_preguntas');
          }
          thumbUp.classList.add('like');
          gracias.classList.add('on');

          setTimeout(() => {
            gracias.classList.remove('on');
          }, '2000');
        });

        thumbDown.addEventListener('click', () => {
          if (thumbUp.classList.contains('like')) {
            thumbUp.classList.remove('like');
          }
          if (thumbDown.classList.contains('dislike')) {
          } else {
            ualterTrack('dislike_preguntas');
          }
          thumbDown.classList.add('dislike');
          gracias.classList.add('on');

          setTimeout(() => {
            gracias.classList.remove('on');
          }, '2000');
        });
        manos.appendChild(thumbDown);
        manos.appendChild(thumbUp);
        manos.appendChild(gracias);
        const verOriginal = document.createElement('a');
        verOriginal.classList.add('ver');
        verOriginal.href = '#';
        verOriginal.setAttribute('aria-label', 'texto original');
        verOriginal.textContent = 'Ver texto original';
        verOriginal.addEventListener('click', (e) => {
          e.stopPropagation();
          closeAll();
        });
        validar.appendChild(manos);
        const divCerrar = document.createElement('div');
        divCerrar.classList.add('cerrar_clickable');
        const cerrarIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        cerrarIcon.classList.add('collapse-button');
        cerrarIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        cerrarIcon.setAttribute('viewBox', '0 0 32 32');
        cerrarIcon.innerHTML = cerrarIconSvg;
        divCerrar.appendChild(cerrarIcon);
        divCerrar.addEventListener('click', (e) => {
          currentsvgIcons = document.getElementById('eb-preguntas');
          ualterTrack('module_preguntas_close');
          e.stopPropagation();
          cerrarModulo(pregsContainer, currentsvgIcons);
        });
        moduloFooter.appendChild(validar);
        moduloFooter.appendChild(verOriginal);
        moduloFooter.appendChild(divCerrar);
        pregsContainer.appendChild(moduloFooter);
        let current;
        svgIcons.forEach((item, i) => {
          if (item.id === 'eb-preguntas') {
            current = i;
          }
        });
        pregsClickable.appendChild(svgIcons[current]);
        pregsClickable.appendChild(subTpregs);
        preguntasRctg.appendChild(pregsClickable);
        preguntasRctg.appendChild(pregsContainer);
        ualterTabContent.appendChild(preguntasRctg);
      } catch (error) {
        console.log('Hubo un error en Preguntas: ', error);
      }
    }

    // ### GLOSARIO ###
    if (data.modules.glosario && data.modules.glosario.content && data.modules.glosario.content.length > 0) {
      try {
        // Create the expandable rectangle div
        const glosarioRctg = document.createElement('div');
        glosarioRctg.classList.add('expandable-rectangle');
        glosarioRctg.id = 'tries';
        const gloClickable = document.createElement('div');
        gloClickable.classList.add('clickable');
        const gloContainer = document.createElement('div');
        gloContainer.classList.add('glo-container');
        gloContainer.classList.add('content');
        // Start with content invisible
        const icon6 = createSvgIcon('d', 'expand-button', gloContainer, 'eb-glosario');
        svgIcons.push(icon6);
        // Set the click event handler for the button in the second rectangle
        gloClickable.addEventListener('click', () => {
          currentsvgIcons = document.getElementById('eb-glosario');
          if (toggleContentVisibility(gloContainer, currentsvgIcons) === 'open') {
            ualterTrack('module_glosario_open', true);
          }
        });
        const gloSubT = document.createElement('h4');
        gloSubT.classList.add('sub-title');
        gloSubT.innerHTML = '<strong>GLOSARIO</strong> Lista de términos';

        data.modules.glosario.content.forEach((glosarioCategory, i) => {
          if (!Array.isArray(glosarioCategory.datos)) return;

          const datosArray = glosarioCategory.datos
            .map((dato) => {
              return {
                palabra: dato.palabra || dato.keyword || '',
                significado: dato.significado,
              };
            })
            .filter(({ palabra, significado }) => palabra && significado)
            .sort((a, b) => a.palabra.localeCompare(b.palabra));

          if (datosArray.length < 1) return; // Skip empty

          const gloCat = document.createElement('div');
          gloCat.classList.add('cat-table');
          gloCat.innerHTML = glosarioCategory.categoria;

          const gloTable = document.createElement('table');
          gloTable.classList.add('num-table');
          // Create a table header row
          const gloHeaderRow = gloTable.insertRow();
          // Create header cells
          const relacionHeader = gloHeaderRow.insertCell(0);
          relacionHeader.textContent = 'Palabra';
          const numeroHeader = gloHeaderRow.insertCell(1);
          numeroHeader.textContent = 'Significado';

          datosArray.forEach((item, i) => {
            const palabra = item.palabra;
            if (palabra === null || palabra === undefined) return;

            const row = gloTable.insertRow(i + 1); // i + 1 because we have a header row

            // Create cells and set their textContent
            const palabraCell = row.insertCell(0);
            const relacionCell = row.insertCell(1);
            palabraCell.textContent = palabra;
            relacionCell.innerHTML = (item.significado || '').replace(palabra, "<span class='highlight'>" + palabra + '</span>');
          });
          gloContainer.appendChild(gloCat);
          gloContainer.appendChild(gloTable);
        });
        const moduloFooter = document.createElement('div');
        moduloFooter.classList.add('modulo-footer');
        const validar = document.createElement('div');
        validar.classList.add('validar');
        const manos = document.createElement('div');
        manos.classList.add('manos');
        const gracias = document.createElement('div');
        gracias.classList.add('gracias');
        gracias.innerHTML = 'Gracias!';
        const thumbDown = document.createElement('a');
        thumbDown.classList.add('thumb-down');
        thumbDown.src = '#';
        thumbDown.setAttribute('aria-label', 'pulgar abajo');
        const thumbDownIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        thumbDownIcon.classList.add('icon-thumb-down');
        thumbDownIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        thumbDownIcon.setAttribute('viewBox', '0 0 18 18');
        thumbDownIcon.innerHTML = thumbDownSvg;
        thumbDown.appendChild(thumbDownIcon);
        const thumbUp = document.createElement('a');
        thumbUp.classList.add('thumb-up');
        thumbUp.src = '#';
        thumbUp.setAttribute('aria-label', 'pulgar arriba');
        const thumbUpIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        thumbUpIcon.classList.add('icon-thumb-up');
        thumbUpIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        thumbUpIcon.setAttribute('viewBox', '0 0 18 18');
        thumbUpIcon.innerHTML = thumbUpSvg;
        thumbUp.appendChild(thumbUpIcon);
        thumbUp.addEventListener('click', () => {
          if (thumbDown.classList.contains('dislike')) {
            thumbDown.classList.remove('dislike');
          }
          if (thumbUp.classList.contains('like')) {
          } else {
            ualterTrack('like_glosario');
          }
          thumbUp.classList.add('like');
          gracias.classList.add('on');

          setTimeout(() => {
            gracias.classList.remove('on');
          }, '2000');
        });

        thumbDown.addEventListener('click', () => {
          if (thumbUp.classList.contains('like')) {
            thumbUp.classList.remove('like');
          }
          if (thumbDown.classList.contains('dislike')) {
          } else {
            ualterTrack('dislike_glosario');
          }
          thumbDown.classList.add('dislike');
          gracias.classList.add('on');

          setTimeout(() => {
            gracias.classList.remove('on');
          }, '2000');
        });
        manos.appendChild(thumbDown);
        manos.appendChild(thumbUp);
        manos.appendChild(gracias);
        const verOriginal = document.createElement('a');
        verOriginal.classList.add('ver');
        verOriginal.href = '#';
        verOriginal.setAttribute('aria-label', 'texto original');
        verOriginal.textContent = 'Ver texto original';
        verOriginal.addEventListener('click', (e) => {
          e.stopPropagation();
          closeAll();
        });
        validar.appendChild(manos);

        const download = document.createElement('div');
        download.classList.add('download');
        const downloadLink = document.createElement('a');
        downloadLink.classList.add('download_link');
        const downloadText = document.createElement('span');
        downloadText.textContent = 'Descargar CSV';
        const downloadIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        downloadIcon.classList.add('icon-download');
        downloadIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        downloadIcon.setAttribute('viewBox', '0 -960 960 960');
        downloadIcon.innerHTML = downloadSvg;
        downloadLink.appendChild(downloadIcon);
        downloadLink.addEventListener('click', (e) => {
          try {
            ualterGetCSV('glosario');
          } catch (error) {
            console.warn('Error creating CSV', error);
          }
          e.stopPropagation();
        });
        downloadLink.appendChild(downloadText);
        download.appendChild(downloadLink);

        const divCerrar = document.createElement('div');
        divCerrar.classList.add('cerrar_clickable');
        const cerrarIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        cerrarIcon.classList.add('collapse-button');
        cerrarIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        cerrarIcon.setAttribute('viewBox', '0 0 32 32');
        cerrarIcon.innerHTML = cerrarIconSvg;
        divCerrar.appendChild(cerrarIcon);
        divCerrar.addEventListener('click', (e) => {
          currentsvgIcons = document.getElementById('eb-glosario');
          ualterTrack('module_glosario_close');
          e.stopPropagation();
          cerrarModulo(gloContainer, currentsvgIcons);
        });
        moduloFooter.appendChild(validar);
        moduloFooter.appendChild(verOriginal);
        moduloFooter.appendChild(download);
        moduloFooter.appendChild(divCerrar);
        gloContainer.appendChild(moduloFooter);
        let current;
        svgIcons.forEach((item, i) => {
          if (item.id === 'eb-glosario') {
            current = i;
          }
        });
        gloClickable.appendChild(svgIcons[current]);
        gloClickable.appendChild(gloSubT);
        glosarioRctg.appendChild(gloClickable);
        glosarioRctg.appendChild(gloContainer);
        ualterTabContent.appendChild(glosarioRctg);
      } catch (error) {
        console.log('Hubo un error en Glosario: ', error);
      }
    }

    ualterTab.appendChild(ualterInput);
    ualterTab.appendChild(ualterLabel);

    const ualterFooter = document.createElement('div');
    ualterFooter.classList.add('footer');

    const ualterLogoFooter = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    ualterLogoFooter.classList.add('logo');
    ualterLogoFooter.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    ualterLogoFooter.setAttribute('viewBox', '0 0 86 14');
    ualterLogoFooter.innerHTML = ualterWhiteLogoSvg;

    // ualterLogoFooter.innerHTML = "Ualter.AI";

    const footerText = document.createElement('div');
    footerText.classList.add('disclaimer');
    footerText.innerHTML = 'Ualter produce ediciones automáticas de textos periodísticos en forma de resúmenes y análisis. Sus resultados experimentales están basados en inteligencia artificial. Por tratarse de una edición de Inteligencia Artificial los textos eventualmente pueden contener errores, omisiones, establecer relaciones equivocadas entre datos y otras inexactitudes imprevistas.<br/>Recomendamos chequear la edición';

    const redes = document.createElement('div');
    redes.classList.add('rrss');

    const ulRedes = document.createElement('ul');
    const liRedesX = document.createElement('li');
    liRedesX.classList.add('rrss_x');

    const liRedesIG = document.createElement('li');
    liRedesIG.classList.add('rrss_ig');

    const aRedesX = document.createElement('a');
    aRedesX.href = 'https://twitter.com/ualterai';
    aRedesX.target = '_blank';
    const logoXSVG = '<g clip-path="url(#clip0_866_558)"><path d="M17.261 15.7776C16.783 15.1422 16.2997 14.4979 15.8247 13.8625C14.1075 11.5742 12.3335 9.20914 10.5573 6.83814L16.9751 0H15.009L14.9676 0.0435927C14.0699 1.00042 13.1721 1.95724 12.2744 2.91406C11.4107 3.83468 10.5477 4.7553 9.68399 5.67518C8.27942 3.80291 6.87411 1.9299 5.4688 0.0554144L5.42742 0H0.253191L0.41574 0.220919C1.09106 1.13858 1.76637 2.05551 2.44095 2.97317C3.12588 3.90339 3.8108 4.83362 4.49572 5.76458C5.24492 6.78051 6.00521 7.8127 6.74185 8.81238C6.3872 9.19067 6.03255 9.56823 5.6779 9.94652C5.28926 10.3603 4.90136 10.774 4.51271 11.1878C4.09895 11.6296 3.68445 12.0715 3.26995 12.5133C2.85176 12.9589 2.43356 13.4051 2.01611 13.8507C1.41837 14.4868 0.821374 15.123 0.225114 15.7591L-0.000976562 16H1.957L1.99838 15.9564C2.59833 15.318 3.19755 14.6797 3.79602 14.0413C4.44548 13.3497 5.0942 12.6581 5.74365 11.9666C6.36356 11.306 6.98346 10.6455 7.60336 9.98568C8.29346 10.9218 8.98355 11.8587 9.67291 12.7956L10.5802 14.0287C10.8159 14.3486 11.0509 14.6678 11.2866 14.9878C11.5215 15.3069 11.7565 15.6254 11.9914 15.9446L12.0328 16.0007H17.4287L17.2617 15.7783L17.261 15.7776ZM8.40798 8.72223L7.81246 7.9154L3.01283 1.39497H4.7292L6.42414 3.65366C6.82017 4.18194 7.21694 4.71023 7.61297 5.23851C8.00383 5.75941 8.39468 6.2803 8.7848 6.8012C8.99611 7.08271 9.20743 7.36421 9.41726 7.64498L9.47268 7.7196C9.47711 7.72551 9.48228 7.73216 9.48672 7.73807L9.58572 7.87033C10.943 9.68053 12.301 11.4915 13.6591 13.3009L14.6366 14.6043H12.737L8.57423 8.94906L8.50477 8.85523L8.4065 8.7215L8.40798 8.72223Z" fill="white"/></g><defs><clipPath id="clip0_866_558"><rect width="17.429" height="16" fill="white"/></clipPath></defs>';
    const logoX = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    logoX.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    logoX.setAttribute('viewBox', '0 0 18 16');
    logoX.innerHTML = logoXSVG;
    aRedesX.appendChild(logoX);

    const aRedesIG = document.createElement('a');
    aRedesIG.href = 'https://www.instagram.com/ualter.ai';
    aRedesIG.target = '_blank';
    const logoIGSVG = '<g clip-path="url(#clip0_866_556)"><path d="M16.1894 4.01435C16.0796 2.96107 15.6683 2.02927 14.8697 1.28245C14.0304 0.496291 13.0026 0.149111 11.8769 0.0904419C9.95877 -0.0124009 5.404 -0.0772817 3.80476 0.17879C1.97706 0.470753 0.778836 1.51713 0.273595 3.28754C-0.115689 4.64935 -0.0383847 10.9262 0.188698 12.2728C0.497917 14.1137 1.60779 15.2939 3.46794 15.764C4.7552 16.0898 11.0824 16.0483 12.5022 15.8226C14.381 15.5252 15.5889 14.4429 16.0776 12.6221C16.451 11.2244 16.3198 5.27538 16.1894 4.01435ZM14.6875 12.0126C14.4694 13.411 13.5231 14.2765 12.0895 14.4305C10.7732 14.572 4.89393 14.65 3.67293 14.3152C2.50508 13.9949 1.83694 13.2074 1.64299 12.054C1.45801 10.9524 1.41177 5.44931 1.64092 3.97638C1.85627 2.59042 2.80187 1.72488 4.22718 1.56889C5.67319 1.41014 10.8761 1.3922 12.2613 1.60064C13.6839 1.81461 14.566 2.74503 14.722 4.15239C14.8676 5.46588 14.909 10.6004 14.6888 12.0126H14.6875ZM8.16282 3.89701C5.85127 3.89563 3.97663 5.7323 3.97594 7.99899C3.97456 10.2657 5.84712 12.1044 8.15867 12.1058C10.4702 12.1072 12.3449 10.2705 12.3456 8.00382C12.3469 5.73714 10.4744 3.89839 8.16282 3.89701ZM8.13383 10.6529C6.6395 10.6398 5.43851 9.44086 5.45232 7.97483C5.46543 6.5088 6.6885 5.33129 8.18283 5.3444C9.67716 5.35751 10.8781 6.55643 10.865 8.02246C10.8512 9.48848 9.62884 10.666 8.13452 10.6529H8.13383ZM13.4906 3.74171C13.4892 4.27249 13.0496 4.7018 12.5084 4.70042C11.9673 4.69904 11.5297 4.26766 11.5311 3.73688C11.5325 3.2061 11.9721 2.77678 12.5133 2.77816C13.0544 2.77954 13.492 3.21093 13.4906 3.74171Z" fill="white"/></g><defs><clipPath id="clip0_866_556"><rect width="16.3223" height="16" fill="white"/></clipPath></defs>';
    const logoIG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    logoIG.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    logoIG.setAttribute('viewBox', '0 0 17 16');
    logoIG.innerHTML = logoIGSVG;
    aRedesIG.appendChild(logoIG);

    const copy_cont = document.createElement('ul');
    copy_cont.classList.add('copyright_container');

    const copy = document.createElement('li');
    copy.innerHTML = '© Ualter 2024';

    const contact = document.createElement('li');
    const contactLink = document.createElement('a');
    contactLink.href = 'mailto:contacto@ualter.ai';
    contactLink.innerHTML = 'Contactanos';

    ualterFooter.appendChild(ualterLogoFooter);
    ualterFooter.appendChild(footerText);
    liRedesX.appendChild(aRedesX);
    liRedesIG.appendChild(aRedesIG);
    ulRedes.appendChild(liRedesX);
    ulRedes.appendChild(liRedesIG);
    redes.appendChild(ulRedes);
    contact.appendChild(contactLink);
    copy_cont.appendChild(copy);
    copy_cont.appendChild(contact);
    redes.appendChild(copy_cont);
    ualterFooter.appendChild(redes);

    ualterTabContent.appendChild(ualterFooter);

    ualterTab.appendChild(ualterTabContent);
    ualterContent.appendChild(ualterTab);
    ualterContainer.appendChild(ualterContent);
    containerElement.prepend(ualterContainer);
  } else {
    console.error(`Element not found with selector: ${containerSelector}`);
    return;
  }

  const textElement = document.getElementById('typing-animation');
  const words = textElement.textContent.split(' ');
  textElement.textContent = ''; // Clear the original text
  let currentWordIndex = 0;
  const cb1 = document.getElementById('cb1');
  const rndInt = randomIntFromInterval(25, 50);

  const summary_reading_time = document.getElementById('summary_reading_time');
  const original_reading_time = document.getElementById('original_reading_time');

  let reading_data = {
    summary: summary_reading_time.value,
    original: original_reading_time.value,
  };
  cb1.addEventListener('click', () => {
    if (cb1.checked) {
      ualterTrack('ualter_open', true);
      temp.innerHTML = ''; // news msg
    } else {
      ualterTrack('ualter_close', true);
      temp.innerHTML = '';
    }
    animateText();
  });

  const slidesContainer = document.getElementById('slides-container');
  const slide = document.querySelector('.slide');
  const prevButton = document.getElementById('slide-arrow-prev');
  const nextButton = document.getElementById('slide-arrow-next');
  let curSlide = 0;
  const countAll = document.querySelectorAll('.slide').length;

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      curSlide++;
      if (curSlide === countAll - 1) {
        nextButton.style.display = 'none';
      }
      if (curSlide > 0) {
        prevButton.style.display = 'block';
      }
      ualterTrack('slider_fotos_next');
      const slideWidth = slide.clientWidth;
      slidesContainer.scrollLeft += slideWidth;
    });
  }
  if (prevButton) {
    if (countAll > 0) {
      prevButton.style.display = 'none';
    }

    prevButton.addEventListener('click', () => {
      if (curSlide === countAll - 1) {
        nextButton.style.display = 'block';
      }
      if (curSlide === 0) {
        curSlide = countAll;
        prevButton.style.display = 'none';
      } else {
        curSlide--;
      }

      ualterTrack('slider_fotos_prev');
      const slideWidth = slide.clientWidth;
      if (slidesContainer.scrollLeft === 0) {
        slidesContainer.scrollLeft += slideWidth;
      } else {
        slidesContainer.scrollLeft -= slideWidth;
      }
    });
  }

  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function animateText() {
    if (currentWordIndex < words.length) {
      const word = words[currentWordIndex];
      textElement.textContent += word + ' ';
      currentWordIndex++;
      // You can adjust the animation speed by changing the timeout value (in milliseconds)
      setTimeout(animateText, rndInt);
    }
  }

  function animateProgress(from, to, duration) {
    const start = performance.now();
    function step(timestamp) {
      const progress = Math.min((timestamp - start) / duration, 1);
      setProgress(from + progress * (to - from));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  function arrayLookup(searchValue, array, searchIndex, returnIndex) {
    for (let i = 0; i < array.length; i++) {
      if (array[i][searchIndex] === searchValue) {
        return array[i][returnIndex];
      }
    }

    return null;
  }
}

function ualterError(containerSelector) {
  const containerElement = document.querySelector(containerSelector);
  if (containerElement) {
    containerElement.innerHTML = 'No hay versión Ualter para este artículo.';
  } else {
    console.error(`Element not found with selector: ${containerSelector}`);
  }
}
