//Example fetch using pokemonapi.co
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', e => {
        placeAfterRating(e)
        showNewImage()
    })
})

if(!localStorage.getItem('seenPokemon')){ //if theres no local storage create it
    localStorage.setItem('seenPokemon', JSON.stringify([]))
}

//when page is loaded load the first pokemon on deck:
//will be in localstorage but still pure random for now
showNewImage()


function showNewImage(){ //determine where last poekmon goes... then show new one
  //const choice = document.querySelector('input').value.toLowerCase()
  let max = 151
  let choice = 0
  while (true){
    choice = getRandomInt(1,max);
    if (!getSeenPokemonList().includes(choice)){
        break
    }
  }
 
  addIdToLocalStorage(choice)
  if (getLocalStorageLength('seenPokemon') == max){
    alert("FINISHED! CLEARING LOCAL STORAGE")
    localStorage.clear()
  }


  const url = 'https://pokeapi.co/api/v2/pokemon/'+choice

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        imageSrc = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default']
        pokeName = capitalizeFirstLetter(data['name'])

        document.querySelector('#mainPhoto').src = imageSrc
        document.querySelector('#mainPokeName').textContent = pokeName
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}

function placeAfterRating(e){
    let parent = document.querySelector('#'+e.target.id+'ed') //ghetto ass shit right here
    let imageSrc = document.querySelector("#mainPhoto").src
    let pokeName = document.querySelector("#mainPokeName").textContent
    //create pokemon in collumn
    createnNewPokemonInColumn(imageSrc, pokeName, parent)
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

function addIdToLocalStorage(id){ //push new id to local storage
    let list = JSON.parse(localStorage.getItem('seenPokemon'))
    list.push(id)
    localStorage.setItem('seenPokemon', JSON.stringify(list))
}

function getSeenPokemonList(){ //returns the get pokemon list from local storage
    return JSON.parse(localStorage.getItem('seenPokemon'))
}

function getLocalStorageLength(key){
    return JSON.parse(localStorage.getItem(key)).length
}

function createnNewPokemonInColumn(src, pokeName, parent){
    let newPIC = new PokemonInColumn(src, pokeName, parent)
    newPIC.render()

}

class PokemonInColumn{
    constructor(src='#', name='blank-pokemon', parent=Node){ //gets name and image of pokemon
        this.src = src
        this.name = name
        this.parent = parent //dom parent being appended to
    }
    render() {
        const card = document.createElement('div');
        card.classList.add('card');

        const image = document.createElement('img');
        image.src = this.src;
        card.appendChild(image);

        const heading = document.createElement('h1');
        heading.textContent = this.name;
        card.appendChild(heading);

        this.parent.appendChild(card);
    }
}