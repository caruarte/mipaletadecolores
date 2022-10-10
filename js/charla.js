var navegacion_principal = document.querySelector(".navegacion-principal");
var links_navegacion = navegacion_principal.querySelectorAll("a");
var closeIcon = document.querySelector(".closeIcon");
var menuIcon = document.querySelector(".menuIcon");


var paletas = [];
var intereses = [];
var paleta_elegida = [];
var colores = {};

var state = "charla";

var colores_elegidos = [];


const hamburger = document.querySelector(".hamburger");


function windowSize(x) {
    if (x.matches) { // If media query matches
        navegacion_principal.classList.add("ocultar");
        closeIcon.style.display = "none";
        menuIcon.style.display = "block";
    } else {
        navegacion_principal.classList.remove("ocultar");
    }
}

var x = window.matchMedia("(max-width: 768px)")
windowSize(x) // Call listener function at run time
x.addListener(windowSize) // Attach listener function on state changes

function toggleMenu() {
    if (navegacion_principal.classList.contains("ocultar")) {
        navegacion_principal.classList.remove("ocultar");
        closeIcon.style.display = "block";
        menuIcon.style.display = "none";
    } else {
        navegacion_principal.classList.add("ocultar");
        closeIcon.style.display = "none";
        menuIcon.style.display = "block";
    }
}

menuIcon.addEventListener("click", toggleMenu);
closeIcon.addEventListener("click", toggleMenu);

links_navegacion.forEach(
    function(link) {
        link.addEventListener("click", toggleMenu);
    }
)

// CHARLA