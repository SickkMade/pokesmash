class PokemonInColumn{
    constructor(src='#', name='blank-pokemon', parentID='#none', soundUrl="shing a linga ding dong"){ //gets name and image of pokemon
        this.src = src
        this.name = name
        this.parentID = parentID //dom parent being appended to
        this.soundUrl = soundUrl
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

document.querySelectorAll('.smashOrPass').forEach(button => {
    button.addEventListener('click', e => {
        placeAfterRating(e);
        showNewImage();
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
  if (getLocalStorageLength('pokemonLocalStorage') == max - 1){
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

        //maybe move some of these iinto funcs if they grow

        audioSetUp(pokeCry)

        mainSectionChangeData(imageSrc, pokeName)

        pokeCard = new PokemonInColumn(imageSrc, pokeName, 'invisibleDiv', pokeCry)
        pokeCard.render()
        addElementToLocalStorage(pokeCard, 'mainSectionPokemon') //could be just url
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}

function placeAfterRating(e){
    let newParentID = e.target.closest('button').id+'ed' //ghetto ass shit right here

    newPokemon = getLocalStorageList('mainSectionPokemon')
    newPokemon.parentID = newParentID

    pokeCard = document.querySelector('.invisibleDiv').querySelector('.card')
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
    mainPokemon = getLocalStorageList('mainSectionPokemon');

    if(mainPokemon == ''){
        showNewImage()
    }
    else{
        mainSectionChangeData(mainPokemon.src, mainPokemon.name)
        newCard = new PokemonInColumn(mainPokemon.src, mainPokemon.name, 'invisibleDiv', mainPokemon.soundUrl)
        newCard.render()
        audioSetUp(mainPokemon.soundUrl)
    }
    
    document.querySelector('#playButton').addEventListener('mouseup', _ => {
        soundUrl = getLocalStorageList('mainSectionPokemon').soundUrl;
        playSound(soundUrl)
    })

    createBars(50);

    getLocalStorageList('smashedPokemon').forEach(card =>{
        newCard = new PokemonInColumn(card.src, card.name, card.parentID, card.soundUrl)
        newCard.render()
    })
    getLocalStorageList('passedPokemon').forEach(card =>{
        newCard = new PokemonInColumn(card.src, card.name, card.parentID, card.soundUrl)
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

    if(audio.paused){//if the audio is NOT playing
        audio.play();
    }
}

function createBars(barCount){ //creates a new audio bar, used at start
    let barDiv = document.querySelector('#bars')
    for(let i = 0; i < barCount; i++){
        let newBar = document.createElement('div');
        newBar.classList.add('audioBar');
        newBar.classList.add('smallBar');
        barDiv.append(newBar);
    }
    randomizeBars()
}
function randomizeBars(){ //randomizes the height of the audio bars
    let bars = document.querySelector('#bars').children;
    let maxHeight = 50;
    let minHeight = 5;
    for(let i = 0; i < bars.length; i++){
        bars[i].style.height = getRandomInt(minHeight, maxHeight)+'px';
    }
}
function changeBarCount(audioLen){ //change the amount of bars, and width
    let barsDiv = document.querySelector('#bars'); //get amount of bars, invis or not
    let bars = barsDiv.children;
    const barsMin = 15;

    //let barsDivWidth = parseInt(window.getComputedStyle(barsDiv).width);
    //let barsMargin = 2 * parseInt(window.getComputedStyle(bars[0]).marginLeft)

    if(audioLen > bars.length){ //make sure we aren't looping through too many
        audioLen = bars.length;
    }
    else if(audioLen < barsMin){
        audioLen = barsMin;
    }
    //check bars div width and change the bar count to audio length!, so if max
    //bars is 12 then a long auido would be 12 bars and a short would be 4-5!
    for(let i = 0; i < bars.length; i++){
        bars[i].classList.add('smallBar');
    }
    let startPos = Math.floor((bars.length - audioLen));
    startPos = getRandomInt(0, startPos);
    for(let i = startPos; i < startPos+audioLen; i++){//from 0 to audioLen
        bars[i].classList.remove('smallBar');
        //bars[i].style.width = ((barsDivWidth / audioLen) - barsMargin) +'px'; //might have to subtract margin
    }
}
function mainSectionChangeData(imageSrc, pokeName){
    document.querySelector('#mainPhoto').src = imageSrc;
    document.querySelector('#mainPokeName').textContent = pokeName;
}

function audioSetUp(pokeCry){
    audio = document.getElementById("soundPlayer")
        audio.src = pokeCry
        audio.onloadedmetadata = _ =>{
            changeBarCount(Math.floor(audio.duration / 0.04));
            randomizeBars();
        }
}


/*
ideas
col has items fall down to bottom
OR col has items slide in from top!?

use a list of all the different hinge names for audio prompts and use
a random one for each refresh!

*/