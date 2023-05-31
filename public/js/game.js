import QuestionsData from '../data/questions.json' assert {type: 'json'}

// Templates
const MainBoardTemplate = document.createElement('template')
MainBoardTemplate.innerHTML = `
<div class="gameBoard showHost">

  <!--- Scores --->
  <div class="score" id="team1">0</div>
  <div class="score" id="team2">0</div>

  <!--- Main Board --->
  <div id="middleBoard">
    <div class="song"></div>
    <div class="start"></div>
    <div class="lyric"></div>
  </div>

  <!--- Wrong --->
  <div class="wrongX wrongBoard" hidden>
    <img alt="not on board" src="/public/images/wrong.svg" />
  </div>

  <admin-board id="host"></admin-board>
</div>`.trim()

const AdminBoardTemplate = document.createElement('template')
AdminBoardTemplate.innerHTML = `
<!--- Buttons --->
<div class="btnHolder" id="host">
  <div id="hostBTN" class="button">Be the host</div>
  <div id="awardTeam1" class="button" data-team="1">Award Team 1</div>
  <div id="newQuestion" class="button">New Question</div>
  <div id="playHint" class="button">Play Hint 🔈</div>
  <div id="wrong1" class="button wrongX">
    <img alt="not on board" src="/public/images/wrong.svg" />
  </div>
  <div id="playClip" class="button">Play Song 🔈</div>
  <div id="showLyrics" class="button">Show Lyrics</div>
  <div id="showSong" class="button">Show Song</div>
  <div id="showArtist" class="button">Show Artist</div>
  <div id="awardTeam2" class="button" data-team="2">Award Team 2</div>
</div>`.trim()

const IntroScreenTemplate = document.createElement('template')
IntroScreenTemplate.innerHTML = `
<div class="intro">
  <div class="intro-text">
    <header>Finish the Lyrics</header>
    <div class="subHeader">90's Edition</div>
    <div class="intro-cds">
      <div class="cd disc"></div>
      <!-- <div class="record black disc"></div>
      <div class="record bronze disc"></div>
      <div class="record silver disc"></div>
      <div class="record gold disc"></div> -->
    </div>
  </div>
</div>`.trim()

class GameBoard extends HTMLElement {
  constructor() {
    super('')
    this.appendChild(MainBoardTemplate.content.cloneNode(true))
  }

  connectedCallback() {
    this.$board = this.querySelector('.gameBoard')
    this.$adminBoard = this.$board.querySelector('#host')
    this.$wrongBoard = this.$board.querySelector('.wrongBoard')
    this.$team1 = this.$board.querySelector('#team1')
    this.$team2 = this.$board.querySelector('#team2')
    this.$wrongBoardImages = [...this.$wrongBoard.querySelectorAll('img')]
    /*this.$question = this.$board.querySelector('.question')

   */
  }

  awardTeam1(points) {
    this.$team1.innerHTML = String(points)
  }

  awardTeam2(points) {
    this.$team2.innerHTML = String(points)
  }

  removeHostControls() {
    this.$adminBoard.toggleAttribute('hidden', true)
    this.$board.classList.remove('showHost')
  }

  hostAssigned() {
    this.$adminBoard.$makeHost.toggleAttribute('hidden', true)
  }

  displayWrongs(amt) {
    this.$wrongBoardImages.forEach((img, index) => {
      img.toggleAttribute('hidden', !Boolean(amt > index))
    })
    this.$wrongBoard.toggleAttribute('hidden', false)
    globalThis.setTimeout(() => {
      this.$wrongBoard.toggleAttribute('hidden', true)
    }, 1000)
  }

  makeQuestion(questionData) {
    questionData.hint.play()
    /* this.$question.innerHTML = questionText //.textContent
     this.resetFlippedCards()
     const maxCards = this.$answerCards.length
     for (let i = 0; i < maxCards; i++) {
       if (questionAnswers[i]) {
         this.$answerCards[i].setCardAnswer(questionAnswers[i])
       } else {
         this.$answerCards[i].isEmpty()
       }
     }*/
  }


  #dispatchDetails(trigger) {
    const btnClicked = new CustomEvent('command', {
      bubbles: false,
      detail: trigger,
    })
    this.dispatchEvent(btnClicked)
  }

}

class AdminBoard extends HTMLElement {
  constructor() {
    super('')
    this.appendChild(AdminBoardTemplate.content.cloneNode(true))
  }

  connectedCallback() {
    this.$adminBoard = this.querySelector('#host')
    this.$makeHost = this.$adminBoard.querySelector('#hostBTN')
    this.$awardTeam1 = this.$adminBoard.querySelector('#awardTeam1')
    this.$awardTeam2 = this.$adminBoard.querySelector('#awardTeam2')
    this.$newQuestion = this.$adminBoard.querySelector('#newQuestion')

    this.$playHint = this.$adminBoard.querySelector('#playHint')
    this.$wrong1 = this.$adminBoard.querySelector('#wrong1')
    this.$playClip = this.$adminBoard.querySelector('#playClip')
    this.$showLyrics = this.$adminBoard.querySelector('#showLyrics')
    this.$showSong = this.$adminBoard.querySelector('#showSong')
    this.$showArtist = this.$adminBoard.querySelector('#showArtist')


    this.$makeHost.addEventListener('click', this.#dispatchDetails.bind(this, 'makeHost'))
    this.$awardTeam1.addEventListener('click', this.#dispatchDetails.bind(this, 'awardTeam1'))
    this.$awardTeam2.addEventListener('click', this.#dispatchDetails.bind(this, 'awardTeam2'))
    this.$playHint.addEventListener('click', this.#dispatchDetails.bind(this, 'playHint'))
    this.$wrong1.addEventListener('click', this.#dispatchDetails.bind(this, 'wrong1'))

    this.$newQuestion.addEventListener('click', this.#dispatchDetails.bind(this, 'newQuestion'))
    this.$playClip.addEventListener('click', this.#dispatchDetails.bind(this, 'playClip'))
    this.$showLyrics.addEventListener('click', this.#dispatchDetails.bind(this, 'showLyrics'))
    this.$showSong.addEventListener('click', this.#dispatchDetails.bind(this, 'showSong'))
    this.$showArtist.addEventListener('click', this.#dispatchDetails.bind(this, 'showArtist'))
  }

  #dispatchDetails(trigger) {
    const btnClicked = new CustomEvent('command', {
      bubbles: false,
      detail: { trigger },
    })
    this.dispatchEvent(btnClicked)
  }
}


class IntroScreen extends HTMLElement {
  constructor() {
    super('')
    this.appendChild(IntroScreenTemplate.content.cloneNode(true))
  }

  connectedCallback() {
    this.$intro = this.querySelector('.intro')
  }

  hide() {
    this.$cardHolder.setAttribute('hidden', 'hidden')
  }

  show() {
    this.$cardHolder.removeAttribute('hidden')
  }

}




// Define Custom Elements
globalThis.customElements.define('intro-screen', IntroScreen)
globalThis.customElements.define('game-board', GameBoard)
globalThis.customElements.define('admin-board', AdminBoard)

class GameManager {

  #$introScreen
  #$gameBoard
  #role = 'player'
  socket = io.connect()
  questionMarker = -1
  questions = []
  generatedQuestions = []
  points = {
    team1: 0,
    team2: 0,
  }

  answerPoints = new Map()
  Sounds = {
    again: new Audio(`../public/fx/again.mp3`),
    flipCard: new Audio(`../public/fx/flip.mp3`),
    intro: new Audio(`../public/fx/intro.mp3`),
    newSurvey: new Audio(`../public/fx/new.mp3`),
    points: new Audio(`../public/fx/points.mp3`),
    strike: new Audio(`../public/fx/strike.mp3`),
  }

  constructor() {
    this.socket.on('listening', this.#listenSocket.bind(this))
    this.questions = QuestionsData
  }

  async init() {
    const undefinedElements = document.querySelectorAll(':not(:defined)')
    await Promise.all([...undefinedElements].map(
      elem => globalThis.customElements.whenDefined(elem.localName)
    ))
    this.#$introScreen = document.querySelector('intro-screen')
    this.#$gameBoard = document.querySelector('game-board')
    this.#$gameBoard.$adminBoard.addEventListener('command', evt => {
      this.talkSocket({ data: { ...evt.detail } })
    })
    this.#$gameBoard.addEventListener('command', evt => {
      this.talkSocket({ data: { ...evt.detail } })
    })
    this.generateQuestions()
    return this
  }

  talkSocket(e) {
    const trigger = e.data?.trigger ?? ''
    if (this.isHost()) {
      this.socket.emit('talking', e.data)
    } else if (trigger.includes('makeHost')) {
      this.makeHost()
    }
  }

  makeHost() {
    this.#role = 'host'
    this.#$gameBoard.hostAssigned()
    this.socket.emit("talking", {
      trigger: 'hostAssigned'
    })
    return this
  }

  removeHostControls() {
    if (!this.isHost()) {
      this.#$gameBoard.removeHostControls()
    }
    return this
  }

  isHost() {
    return this.#role === 'host'
  }

  awardPoints(team) {

    this.points[`team${team}`]++
    this.Sounds.points.play()
    this.#$gameBoard[`awardTeam${team}`](this.points[`team${team}`])

  }

  wrongAnswer(amt) {
    this.Sounds.strike.play()
    this.#$gameBoard.displayWrongs(amt)
  }

  changeQuestion() {
    if (this.isHost()) {
      this.questionMarker = (this.questionMarker + 1) % this.questions.length
      this.socket.emit("talking", {
        questionMarker: this.questionMarker,
        trigger: 'makeQuestion'
      })
    }
  }

  makeQuestion() {
    this.Sounds.newSurvey.play()
    this.generatedQuestions.forEach(({hint, fullSong}) => {
      hint.pause()
      hint.currentTime = 0
      fullSong.pause()
      fullSong.currentTime = 0
    })
    const questionData = this.generatedQuestions[this.questionMarker]
    this.#$gameBoard.makeQuestion(questionData)
  }

  generateQuestions() {
    this.generatedQuestions = []
    this.questions.forEach( ({ song, artist, start, lyrics, music, stopAt }) => {
      const hint = new Audio(music)
      const fullSong = new Audio(music)

      hint.addEventListener("timeupdate", () => {
        if (hint.currentTime >= stopAt) {
          hint.pause()
          hint.currentTime = 0
        }
      })

      const questionData = {
        song,
        artist,
        start,
        lyrics,
        hint,
        fullSong
      }
      this.generatedQuestions.push(questionData)
    })
  }



  toggleIntroMusic() {
    if (this.Sounds.intro.paused) {
      this.Sounds.intro.play()
      this.Sounds.intro.currentTime = 0
    } else {
      this.Sounds.intro.pause()
    }
  }

  toggleIntro() {
    const hideIntro = this.#$introScreen.hasAttribute('hidden')
    this.#$introScreen.toggleAttribute('hidden', !hideIntro)
    this.#$gameBoard.toggleAttribute('hidden', hideIntro)
  }

  clearScores() {
    this.points.team1 = 0
    this.points.team2 = 0
    this.#$gameBoard.awardTeam1(this.points.team1)
    this.#$gameBoard.awardTeam2(this.points.team2)
  }

  #listenSocket(data) {
    switch (data.trigger) {
      case "newQuestion":
        this.changeQuestion()
        break;
      case "makeQuestion":
        this.questionMarker = data.questionMarker
        this.makeQuestion()
        break;
      case "awardTeam1":
        this.awardPoints(1);
        break;
      case "awardTeam2":
        this.awardPoints(2);
        break;
      case "hostAssigned":
        this.removeHostControls()
        //app.closeIntro()
        break;
      case "wrong1":
        this.wrongAnswer(1)
        break;
      case "clearScores":
        this.clearScores()
        break;
      case "toggleIntroMusic":
        this.toggleIntroMusic()
        break;
      case "toggleIntro":
        this.toggleIntro()
        this.changeQuestion()
        break;
      case "playHint":
        // this.Sounds.again.play()
        break;
    }
  }
}

const gameManager = await new GameManager().init()

// Game Mechanics

//Hot Keys
globalThis.document.addEventListener('keydown', e => {
  const KEY = e.key.toLowerCase()
  if (['s', 'c', 'm', 'i', 'n'].includes(KEY)) {
    e.preventDefault()
    e.stopPropagation()
  }
  const socketData = (trigger) => Object.assign(Object.create(null), { data: { trigger } })

  if (KEY === 's') { //Start
    gameManager.makeHost()
  }
  if (KEY === 'm') { //Music
    gameManager.talkSocket(socketData('toggleIntroMusic'))
  }
  if (KEY === 'i') { //Introduction
    gameManager.talkSocket(socketData('toggleIntro'))
  }

  if (gameManager.isHost()) {
    if (KEY === 'n' && confirm('start New game?')) { // New Game
      gameManager.talkSocket(socketData('clearScores'))
    }
  }
})
