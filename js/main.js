class PokemonInColumn{
    constructor(src='#', name='blank-pokemon', parentID='#none'){ //gets name and image of pokemon
        this.src = src
        this.name = name
        this.parentID = parentID //dom parent being appended to
    }
    render() {
        const card = document.createElement('div');
        card.classList.add('card');

        const heading = document.createElement('h1');
        heading.textContent = this.name;
        card.appendChild(heading);

        const image = document.createElement('img');
        image.src = this.src;
        card.appendChild(image);

        document.querySelector('.'+this.parentID).prepend(card);
    }
}

//Example fetch using pokemonapi.co
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', e => {
        placeAfterRating(e)
        showNewImage()
    })
})

if(!localStorage.getItem('pokemonLocalStorage')){ //if theres no local storage create it
    localStorage.setItem('pokemonLocalStorage', JSON.stringify({'seenPokemon': [], 'smashedPokemon': [], 'passedPokemon': [], 'mainSectionPokemon':''}))
} // 0 is seen pokemon, 1 is smahsed, 2 is passed

//when page is loaded load the first pokemon on deck:
//will be in localstorage but still pure random for now

startCall()

function showNewImage(){ //determine where last poekmon goes... then show new one
  //const choice = document.querySelector('input').value.toLowerCase()
  let max = 649
  let choice = getRandomPokeNumber(max)
  
 
  addElementToLocalStorage(choice, 'seenPokemon') //adds choice to seen pokemon
  if (getLocalStorageLength('pokemonLocalStorage') == max){
    alert("FINISHED! CLEARING LOCAL STORAGE")
    localStorage.clear()
  }


  const url = 'https://pokeapi.co/api/v2/pokemon/'+choice

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        imageSrc = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default']
        pokeName = capitalizeFirstLetter(data['name'])
        pokeCry = data['cries']['latest']

        playSound(pokeCry)

        pokeCard = new PokemonInColumn(imageSrc, pokeName, 'mainSection')
        pokeCard.render()
        addElementToLocalStorage(pokeCard, 'mainSectionPokemon') //could be just url
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}

function placeAfterRating(e){
    let newParentID = e.target.parentNode.id+'ed' //ghetto ass shit right here

    newPokemon = getLocalStorageList('mainSectionPokemon')
    newPokemon.parentID = newParentID

    pokeCard = document.querySelector('.mainSection').querySelector('.card')
    let col = document.querySelector('.'+newPokemon.parentID)

    col.prepend(pokeCard);

    scrollToBottom(col)

    addElementToLocalStorage(newPokemon, newPokemon.parentID+"Pokemon")
} //DO THIS ON IMAGE CREATION!!! MAKE BIG ONE SMALL ONE? WE WILL SEe

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

function addElementToLocalStorage(element, subIndex){ //push new id to local storage
    let value = JSON.parse(localStorage.getItem('pokemonLocalStorage'))
    if (Array.isArray(value[subIndex])){ //if array or just one
        value[subIndex].unshift(element)
       
    }else{
        value[subIndex] = element
    }
    localStorage.setItem('pokemonLocalStorage', JSON.stringify(value))
}

function getLocalStorageList(listIndex){ //returns the get pokemon list from local storage
    return JSON.parse(localStorage.getItem('pokemonLocalStorage'))[listIndex]
}

function getLocalStorageLength(key){
    return JSON.parse(localStorage.getItem(key)).length
}

function startCall(){
    if(getLocalStorageList('mainSectionPokemon') == ''){
        showNewImage()
    }
    else{
        mainPokemon = getLocalStorageList('mainSectionPokemon')
        newCard = new PokemonInColumn(mainPokemon.src, mainPokemon.name, mainPokemon.parentID) //CHAT ILL FIX IT I SWEAR IM SORRY
        newCard.render()
    }
    
    

    getLocalStorageList('smashedPokemon').forEach(card =>{
        newCard = new PokemonInColumn(card.src, card.name, card.parentID)
        newCard.render()
    })
    getLocalStorageList('passedPokemon').forEach(card =>{
        newCard = new PokemonInColumn(card.src, card.name, card.parentID)
        newCard.render()
    })
    
}

function getRandomPokeNumber(max){
    let choice
    while (true){
        choice = getRandomInt(1,max);
        if (!getLocalStorageList('seenPokemon').includes(choice)){
            break
        }
      }
    return choice
}

function scrollToBottom(element) { //scrolls to bottom
    element.scrollTop = element.scrollTop;
}

function playSound(soundUrl) {
    const audio = document.getElementById("soundPlayer");
    audio.src = soundUrl;
    audio.play();
}