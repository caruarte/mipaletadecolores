var navegacion_principal = document.querySelector(".navegacion-principal");
var links_navegacion = navegacion_principal.querySelectorAll("a");
var closeIcon = document.querySelector(".closeIcon");
var menuIcon = document.querySelector(".menuIcon");


var preguntas_screen = document.querySelector("#preguntas_screen");
var btn_siguiente = preguntas_screen.querySelector("#siguiente button");
var numeroIntereses = preguntas_screen.querySelector("#numeroIntereses");
var interes = preguntas_screen.querySelector("#interes");
var btn_terminar = preguntas_screen.querySelector("#terminar button");

var paletas_screen = document.querySelector("#paletas_screen");

var doscolores_screen = document.querySelector("#doscolores_screen");

var combinar_screen = document.querySelector("#combinar_screen");
var combinacion_interes = combinar_screen.querySelector("#combinacion_interes");
var btn_combinar = combinar_screen.querySelector("#btn_combinar button");

var tupaleta_screen = document.querySelector("#tupaleta_screen");
var btn_paleta = tupaleta_screen.querySelector("#btn_paleta button");



var letters = '0123456789ABCDEF';

var paletas = [];
var intereses = [];
var paleta_elegida = [];
var colores = {};

var state = "preguntas";
btn_terminar.classList.add("ocultar");
numeroIntereses.innerHTML = "<h3>" + intereses.length + "/5";

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

// INTERESES

btn_siguiente.onclick = () => { //Pantalla intereses
    if (interes.value.replace(/\s+/g, '').length != 0) {
        intereses.push(interes.value);
        numeroIntereses.innerHTML = "<h3>" + intereses.length + "/5";
        if (intereses.length == 5) { // Cuando haya 5 intereses
            btn_terminar.classList.remove("ocultar");

            btn_siguiente.classList.add("ocultar");
            interes.disabled = true;
        }
    }
    interes.value = "";
}

// PALETAS

btn_terminar.onclick = () => { // Si toca el boton de elegi tu paleta
    state = "paletas";
    shuffle(intereses);
    paletas_screen.classList.remove("ocultar");
    preguntas_screen.classList.add("ocultar");
    for (let i = 0; i < intereses.length; i++) { // Hacer 5 paletas
        var paleta = document.createElement("div");
        paleta.classList.add("centrar")
        paleta.classList.add("paleta")
        paletas.push(paleta);
        paleta.id = "paleta" + (i + 1);
        paletas_screen.appendChild(paleta)
        for (let j = 0; j < intereses.length; j++) { // Hacer 5 colores por cada paleta
            let color = document.createElement("div");
            color.classList.add("circulo")
            var randomColor = '';
            for (let k = 0; k < 6; k++) {
                randomColor += letters[Math.floor(Math.random() * 16)];
            }
            color.style.backgroundColor = "#" + randomColor;
            paleta.appendChild(color)
        }
    }
    for (let i = 0; i < paletas.length; i++) {
        paletas[i].addEventListener('click', (e) => { // Si hace click en una paleta

            if (state == "paletas") {
                state = "dos_colores";
                doscolores_screen.classList.remove("ocultar");
                paletas_screen.classList.add("ocultar");
                paletaElegida(paletas[i]);
            }
        })
    }
}


// ELEGIR COLORES


function paletaElegida(paleta) { // Si elegis una paleta

    doscolores_screen.appendChild(paleta);
    paleta.classList.add("paleta_elegida");

    let revelar = document.createElement("div");
    revelar.id = "revelar";
    revelar.classList.add("centrar");
    revelar.classList.add("ocultar");
    let boton = document.createElement("button");
    boton.classList.add("boton");
    boton.classList.add("boton-verde");
    boton.innerHTML = "Revelar";
    revelar.appendChild(boton);
    doscolores_screen.appendChild(revelar);

    paleta_elegida = paleta.querySelectorAll('.circulo');
    for (let i = 0; i < paleta_elegida.length; i++) { // Asignar un interes a cada color de la paleta
        paleta_elegida[i].id = "color" + (i + 1);


        colores[paleta_elegida[i].id] = {}
        colores[paleta_elegida[i].id]["color"] = paleta_elegida[i].style.backgroundColor;
        colores[paleta_elegida[i].id]["interes"] = intereses[i];


        paleta_elegida[i].addEventListener('click', (e) => { // Si hace click en un color
            if (state == "dos_colores") {
                console.log(colores[paleta_elegida[i].id]);
                if (!paleta_elegida[i].classList.contains("color_elegido") && colores_elegidos.length < 2) {
                    paleta_elegida[i].classList.add("color_elegido")
                    colores_elegidos.push(paleta_elegida[i].id);
                    if (colores_elegidos.length == 2) {
                        revelar.classList.remove("ocultar");
                        revelar.onclick = () => { // Si hace click en combinar
                            combinar_screen.classList.remove("ocultar");
                            state = "combinar";
                            doscolores_screen.classList.add("ocultar");
                            combinar(colores_elegidos);
                        }
                    }
                } else {
                    let index = colores_elegidos.indexOf(paleta_elegida[i].id);
                    if (index > -1) { // only splice array when item is found
                        colores_elegidos.splice(index, 1);
                        revelar.classList.add("ocultar");
                        paleta_elegida[i].classList.remove("color_elegido");
                    }
                }
            }
        })
    }

}


function combinar(colores_elegidos) {
    let coloresMezcla = [];
    combinar_screen.querySelector("#doscolores").innerHTML = '';
    combinar_screen.querySelector("#combinacion").innerHTML = '';
    for (let i = 0; i < colores_elegidos.length; i++) { // Mostrar dos colores con sus respectivos intereses
        let color = document.createElement("div");
        let circulo = document.createElement("div");
        circulo.classList.add("circulo");
        circulo.style.backgroundColor = colores[colores_elegidos[i]].color;
        color.appendChild(circulo);
        let interes_texto = document.createElement("h3");
        interes_texto.innerHTML = colores[colores_elegidos[i]].interes
        color.appendChild(interes_texto);
        combinar_screen.querySelector("#doscolores").appendChild(color);

        // Combinacion
        let rgb = colores[colores_elegidos[i]]["color"];
        coloresMezcla.push(rgb);
    }

    let mixed = mixbox.lerp(colores[colores_elegidos[0]]["color"], colores[colores_elegidos[1]]["color"], 0.5);
    console.log(mixed);
    let color = document.createElement("div");
    color.classList.add("circulo");
    color.id = "color" + (Object.keys(colores).length + 1);
    color.style.backgroundColor = mixed;
    colores["color" + (Object.keys(colores).length + 1)] = {}
    colores["color" + (Object.keys(colores).length)]["color"] = color.style.backgroundColor;
    combinar_screen.querySelector("#combinacion").appendChild(color)
}

btn_combinar.onclick = () => { // Click en combinar
    if (combinacion_interes.value.replace(/\s+/g, '').length != 0) {

        intereses.push(combinacion_interes.value);
        colores["color" + (Object.keys(colores).length)]["interes"] = combinacion_interes.value;
        combinar_screen.classList.add("ocultar");
        tupaleta_screen.classList.remove("ocultar");
        state = "tupaleta";
        tupaleta(colores);

    }
    combinacion_interes.value = "";
}


function tupaleta(colores) {
    tupaleta_screen.querySelector("#tupaleta").innerHTML = ''; // Reiniciar
    for (let i = 0; i < Object.keys(colores).length; i++) {
        let color = document.createElement("div");
        let circulo = document.createElement("div");
        circulo.classList.add("circulo");
        circulo.style.backgroundColor = colores["color" + (i + 1)].color;
        color.appendChild(circulo)
        let interes_texto = document.createElement("h3");
        interes_texto.innerHTML = colores["color" + (i + 1)].interes;
        color.appendChild(interes_texto);
        tupaleta_screen.querySelector("#tupaleta").appendChild(color);
    }
}

btn_paleta.onclick = () => { // Click en segui combinando
    colores_elegidos = [];
    while (true) {
        let random = Math.floor(Math.random() * (Object.keys(colores).length - 1 + 1) + 1);
        console.log(random);
        let index = colores_elegidos.indexOf("color" + random);
        console.log(index);
        if (!(index > -1)) { // when item is not found
            colores_elegidos.push("color" + random);
            if (colores_elegidos.length == 2) {
                break;
            }
        }

    }
    combinar_screen.classList.remove("ocultar");
    tupaleta_screen.classList.add("ocultar");
    state = "combinar";
    combinar(colores_elegidos);
}

function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }

    return array;
}