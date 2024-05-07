const listarPokemons = document.querySelector('#listaPokemons');
const url = 'https://pokeapi.co/api/v2/pokemon?limit=151';
const urla = 'https://pokeapi.co/api/v2/pokemon/';

const botonesHeader = document.querySelectorAll('.btn-header');

fetch(url)
    .then(response => response.json())
    .then(data => {
        // Extraer la URL de cada Pokémon
        const pokemonUrls = data.results.map(pokemon => pokemon.url);
        // Crear un array de promesas fetch para cada URL de Pokémon
        const pokemonPromises = pokemonUrls.map(url => fetch(url).then(response => response.json()));
        // Esperar a que todas las promesas se resuelvan
        return Promise.all(pokemonPromises);
    })
    .then(pokemonDataArray => {
        // Iterar sobre los datos de cada Pokémon y mostrarlos
        pokemonDataArray.forEach(poke => {
            mostrarPokemones(poke);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });


function mostrarPokemones(poke) {

    let tipos = poke.types.map(tipo =>
        `<p class="tipo" id="${(tipo).type.name}">${tipo.type.name}</p>`); // mapea los tipos de pokemon y los guarda en un array
    tipos = tipos.join(' '); // une los elementos del array en un string

    let pokeId = poke.id.toString();
    if (pokeId.length === 1) {
        pokeId = `00${pokeId}`;
    } else if (pokeId.length === 2) {
        pokeId = `0${pokeId}`;
    }

    const div = document.createElement('div');
    div.classList.add('pokemon');
    div.innerHTML = `

        <div class="pokemon-container">

        <p class="pokemon-id-back">${pokeId}</p>
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other['official-artwork'].front_default}"
                alt="${poke.name}">
        </div>


        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>


            <div class="pokemon-tipos">
                ${tipos}
            </div>

            <div class="pokemom-stats">
                <p class="stat">${poke.height} m</p>
                <p class="stat">${poke.weight} kg</p>
            </div>
        </div>

        </div>
            
        `;

    listarPokemons.appendChild(div);

}

botonesHeader.forEach(boton => boton.addEventListener('click', (event) => {
    const botonId = event.currentTarget.id;
 
    listarPokemons.innerHTML = '';
 
    for(let  i = 1; i <= 151; i++){
        fetch(urla + i)
        .then(response => response.json())
        .then(data => {
            if (botonId === 'ver-todos' || botonId === 'todos') {
                mostrarPokemones(data);
            } else {
                const tipos = data.types.map(tipo => tipo.type.name);
                if(tipos.some(tipo => tipo === botonId)){
                    mostrarPokemones(data);
                }
            }
        })
    }
}));

