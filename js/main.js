var intro_screen = document.querySelector("#intro_screen");
var preguntas_screen = document.querySelector("#preguntas_screen");
var paletas_screen = document.querySelector("#paletas_screen");
var doscolores_screen = document.querySelector("#doscolores_screen");
var combinar_screen = document.querySelector("#combinar_screen");
var btn_comenzar = intro_screen.querySelector(".boton");
var btn_siguiente = preguntas_screen.querySelector("#siguiente button");
var numeroIntereses = preguntas_screen.querySelector("#numeroIntereses");
var interes = preguntas_screen.querySelector("#interes");
var btn_paleta = preguntas_screen.querySelector("#terminar button");
var letters = '0123456789ABCDEF';

var paletas = [];
var intereses = [];
var paleta_elegida = [];
var colores = {};

var state = "intro";

var colores_elegidos = [];


btn_comenzar.onclick = () => { // Si tocar boton de comenzar
    preguntas_screen.classList.remove("ocultar");
    state = "preguntas";
    btn_paleta.classList.add("ocultar");
    intro_screen.classList.add("ocultar")
    numeroIntereses.innerHTML = "<h3>" + intereses.length + "/5";
}

btn_siguiente.onclick = () => { //Pantalla intereses
    if (interes.value.replace(/\s+/g, '').length != 0) {
        intereses.push(interes.value);
        numeroIntereses.innerHTML = "<h3>" + intereses.length + "/5";
        if (intereses.length == 5) { // Cuando haya 5 intereses
            btn_paleta.classList.remove("ocultar");

            btn_siguiente.classList.add("ocultar");
            interes.disabled = true;
        }
    }
    interes.value = "";
}

btn_paleta.onclick = () => { // Si toca el boton de elegi tu paleta
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
                            state = "combinar"
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
    for (let i = 0; i < colores_elegidos.length; i++) { // Mostrar dos colores con sus respectivos intereses
        document.querySelector("#" + colores_elegidos[i]).classList.remove("color_elegido");
        let color = document.createElement("div");
        color.appendChild(document.querySelector("#" + colores_elegidos[i]));
        let interes_texto = document.createElement("h3");
        interes_texto.innerHTML = colores[colores_elegidos[i]].interes
        color.appendChild(interes_texto);
        combinar_screen.querySelector("#doscolores").appendChild(color);

        // Combinacion
        let rgb = colores[colores_elegidos[i]]["color"];
        coloresMezcla.push(rgb);
    }

    let mixed = mixbox.lerp(colores[colores_elegidos[0]]["color"], colores[colores_elegidos[1]]["color"], 0.5);
    console.log("llegue");
    let color = document.createElement("div");
    color.classList.add("circulo");
    color.style.backgroundColor = mixed;
    combinar_screen.querySelector("#combinacion").appendChild(color)
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