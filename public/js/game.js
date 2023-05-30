import QuestionsData from '../data/questions.json' assert {type: 'json'}

// Templates
const MainBoardTemplate = document.createElement('template')
MainBoardTemplate.innerHTML = `
<div class="gameBoard showHost">

  <!--- Scores --->
  <div class="score" id="boardScore">0</div>
  <div class="score" id="team1">0</div>
  <div class="score" id="team2">0</div>

  <!--- Main Board --->
  <div id="middleBoard">

    <!--- Question --->
    <div class="questionHolder">
      <span class="question"></span>
    </div>

    <!--- Answers --->
    <div class="colHolder">
      <survey-says-answer-card></survey-says-answer-card>
      <survey-says-answer-card></survey-says-answer-card>
      <survey-says-answer-card></survey-says-answer-card>
      <survey-says-answer-card></survey-says-answer-card>
      <survey-says-answer-card></survey-says-answer-card>
      <survey-says-answer-card></survey-says-answer-card>
      <survey-says-answer-card></survey-says-answer-card>
      <survey-says-answer-card></survey-says-answer-card>
    </div>

  </div>
  <!--- Wrong --->
  <div class="wrongX wrongBoard" hidden>
    <img alt="not on board" src="/public/images/wrong.svg" />
    <img alt="not on board" src="/public/images/wrong.svg" />
    <img alt="not on board" src="/public/images/wrong.svg" />
  </div>
  <survey-says-admin-board id="host"></survey-says-admin-board>
</div>`.trim()

const AdminBoardTemplate = document.createElement('template')
AdminBoardTemplate.innerHTML = `
<!--- Buttons --->
<div class="btnHolder" id="host">
  <div id="hostBTN" class="button">Be the host</div>
  <div id="awardTeam1" class="button" data-team="1">Award Team 1</div>
  <div id="newQuestion" class="button">New Question</div>
  <div id="againSound" class="button">Again 🔈</div>
  <div id="wrong1" class="button wrongX">
    <img alt="not on board" src="/public/images/wrong.svg" />
  </div>
  <div id="wrong2" class="button wrongX">
    <img alt="not on board" src="/public/images/wrong.svg" />
  </div>
  <div id="wrong3" class="button wrongX">
    <img alt="not on board" src="/public/images/wrong.svg" />
  </div>
  <div id="awardTeam2" class="button" data-team="2">Award Team 2</div>
</div>`.trim()

const AnswerCardTemplate = document.createElement('template')
AnswerCardTemplate.innerHTML = `
<div class="cardHolder empty">
  <div class="card" data-id="">
    <div class="front">
      <span class="darkBG"></span> <!--Number-->
      <span class="answer"></span> <!--Answer-->
    </div>
    <div class="back darkBG">
      <span></span> <!--Answer-->
      <strong class="lightBG points"></strong> <!--Points-->
    </div>
  </div>
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

class SurveySaysBoard extends HTMLElement {
  constructor() {
    super('')
    this.appendChild(MainBoardTemplate.content.cloneNode(true))
  }

  connectedCallback() {
    this.$board = this.querySelector('.gameBoard')
    this.$adminBoard = this.$board.querySelector('#host')
    this.$wrongBoard = this.$board.querySelector('.wrongBoard')
    this.$question = this.$board.querySelector('.question')
    this.$boardScore = this.$board.querySelector('#boardScore')
    this.$team1 = this.$board.querySelector('#team1')
    this.$team2 = this.$board.querySelector('#team2')
    this.$wrongBoardImages = [...this.$wrongBoard.querySelectorAll('img')]
    this.$answerCards = [...this.$board.querySelectorAll('survey-says-answer-card')]

    this.$answerCards.forEach((card, index) => {
      const cardID = String(index + 1)
      card.setAttribute('data-id', cardID)
      const triggerDetails = Object.assign(Object.create(null), { cardID, trigger: 'flipCard' })
      card.addEventListener('click', this.#dispatchDetails.bind(this, triggerDetails))
    })
  }

  flipCardByID(cardID) {
    const card = this.$board.querySelector(`survey-says-answer-card[data-id="${cardID}"]`)
    if (card) {
      card.$cardHolder.classList.toggle('flipped')
    }
    return card.$cardHolder.classList.contains('flipped')
  }

  updateScoreBoard(points) {
    this.$boardScore.innerHTML = String(points)
  }

  awardTeam1(points) {
    this.$team1.innerHTML = String(points)
  }

  awardTeam2(points) {
    this.$team2.innerHTML = String(points)
  }

  resetFlippedCards() {
    this.$answerCards.forEach(card => {
      card.$cardHolder.classList.remove('flipped')
    })
  }

  removeHostControls() {
    this.$adminBoard.toggleAttribute('hidden', true)
    this.$board.classList.remove('showHost')
    this.$answerCards.forEach(card => {
      card.$cardHolder.classList.remove('showHost')
    })
  }

  hostAssigned() {
    this.$adminBoard.$makeHost.toggleAttribute('hidden', true)
    this.$answerCards.forEach(card => {
      card.$cardHolder.classList.add('showHost')
    })
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

  makeQuestion(questionText, questionAnswers) {
    this.$question.innerHTML = questionText //.textContent
    this.resetFlippedCards()
    const maxCards = this.$answerCards.length
    for (let i = 0; i < maxCards; i++) {
      if (questionAnswers[i]) {
        this.$answerCards[i].setCardAnswer(questionAnswers[i])
      } else {
        this.$answerCards[i].isEmpty()
      }
    }
  }


  #dispatchDetails(trigger) {
    const btnClicked = new CustomEvent('command', {
      bubbles: false,
      detail: trigger,
    })
    this.dispatchEvent(btnClicked)
  }

}

class SurveySaysAdminBoard extends HTMLElement {
  constructor() {
    super('')
    this.appendChild(AdminBoardTemplate.content.cloneNode(true))
  }

  connectedCallback() {
    this.$adminBoard = this.querySelector('#host')
    this.$makeHost = this.$adminBoard.querySelector('#hostBTN')
    this.$awardTeam1 = this.$adminBoard.querySelector('#awardTeam1')
    this.$awardTeam2 = this.$adminBoard.querySelector('#awardTeam2')
    this.$againSound = this.$adminBoard.querySelector('#againSound')
    this.$wrong1 = this.$adminBoard.querySelector('#wrong1')
    this.$wrong2 = this.$adminBoard.querySelector('#wrong2')
    this.$wrong3 = this.$adminBoard.querySelector('#wrong3')
    this.$newQuestion = this.$adminBoard.querySelector('#newQuestion')

    this.$makeHost.addEventListener('click', this.#dispatchDetails.bind(this, 'makeHost'))
    this.$awardTeam1.addEventListener('click', this.#dispatchDetails.bind(this, 'awardTeam1'))
    this.$awardTeam2.addEventListener('click', this.#dispatchDetails.bind(this, 'awardTeam2'))
    this.$againSound.addEventListener('click', this.#dispatchDetails.bind(this, 'againSound'))
    this.$wrong1.addEventListener('click', this.#dispatchDetails.bind(this, 'wrong1'))
    this.$wrong2.addEventListener('click', this.#dispatchDetails.bind(this, 'wrong2'))
    this.$wrong3.addEventListener('click', this.#dispatchDetails.bind(this, 'wrong3'))
    this.$newQuestion.addEventListener('click', this.#dispatchDetails.bind(this, 'newQuestion'))
  }

  #dispatchDetails(trigger) {
    const btnClicked = new CustomEvent('command', {
      bubbles: false,
      detail: { trigger },
    })
    this.dispatchEvent(btnClicked)
  }
}

class SurveySaysAnswerCard extends HTMLElement {
  constructor() {
    super('')
    this.appendChild(AnswerCardTemplate.content.cloneNode(true))
  }

  connectedCallback() {
    this.$cardHolder = this.querySelector('.cardHolder')
    this.$frontNumber = this.$cardHolder.querySelector('.front span.darkBG')
    this.$frontAnswer = this.$cardHolder.querySelector('.front .answer')
    this.$backAnswer = this.$cardHolder.querySelector('.back span')
    this.$backPoints = this.$cardHolder.querySelector('.back .points')
  }

  setCardAnswer(questionDetails) {
    const [answer, points] = questionDetails
    this.$frontNumber.innerHTML = this.getAttribute('data-id')
    this.$frontAnswer.innerHTML = answer
    this.$backAnswer.innerHTML = answer
    this.$backPoints.innerHTML = points
    this.$cardHolder.classList.remove('empty')
  }

  isEmpty() {
    this.$cardHolder.classList.add('empty')
    this.$frontNumber.innerHTML = ''
    this.$frontAnswer.innerHTML = ''
    this.$backAnswer.innerHTML = ''
    this.$backPoints.innerHTML = ''
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
globalThis.customElements.define('survey-says-board', SurveySaysBoard)
globalThis.customElements.define('survey-says-admin-board', SurveySaysAdminBoard)
globalThis.customElements.define('survey-says-answer-card', SurveySaysAnswerCard)

class GameManager {

  #$introScreen
  #$surveySaysBoard
  #role = 'player'
  socket = io.connect()
  questionMarker = 0
  questions = []
  points = {
    scoreBoard: 0,
    team1: 0,
    team2: 0,
  }
  #roundInProgress = true
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
    this.#$surveySaysBoard = document.querySelector('survey-says-board')
    this.#$surveySaysBoard.$adminBoard.addEventListener('command', evt => {
      this.talkSocket({ data: { ...evt.detail } })
    })
    this.#$surveySaysBoard.addEventListener('command', evt => {
      this.talkSocket({ data: { ...evt.detail } })
    })
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
    this.#$surveySaysBoard.hostAssigned()
    this.socket.emit("talking", {
      trigger: 'hostAssigned'
    })
    return this
  }

  removeHostControls() {
    if (!this.isHost()) {
      this.#$surveySaysBoard.removeHostControls()
    }
    return this
  }

  isHost() {
    return this.#role === 'host'
  }

  awardPoints(team) {
    if (this.points.scoreBoard > 0) {
      this.points[`team${team}`] += this.points.scoreBoard
      this.points.scoreBoard = 0
      this.Sounds.points.play()
      this.#$surveySaysBoard[`awardTeam${team}`](this.points[`team${team}`])
      this.#$surveySaysBoard.updateScoreBoard(this.points.scoreBoard)
      this.#roundInProgress = false
    }
  }

  wrongAnswer(amt) {
    this.Sounds.strike.play()
    this.#$surveySaysBoard.displayWrongs(amt)
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
    this.clearBoard()
    const questionText = this.questions[this.questionMarker] ?? ''
    const questionAnswers = QuestionsData[questionText] ?? ''
    this.#$surveySaysBoard.makeQuestion(questionText, questionAnswers)
    this.answerPoints = new Map()
    questionAnswers.forEach((questionDetails, index) => {
      const [, points] = questionDetails
      const cardID = String(index + 1)
      this.answerPoints.set(cardID, points)
    })
    this.#roundInProgress = true
  }

  flipCard(cardID) {
    if (this.answerPoints.get(cardID)) {
      this.Sounds.flipCard.play()
      const isFlipped = this.#$surveySaysBoard.flipCardByID(cardID)
      if (this.#roundInProgress) {
        const cardRowPoints = ~~this.answerPoints.get(cardID) ?? 0
        if (isFlipped) {
          this.points.scoreBoard += cardRowPoints
        } else {
          this.points.scoreBoard = Math.max(this.points.scoreBoard - cardRowPoints, 0)
        }
        this.#$surveySaysBoard.updateScoreBoard(this.points.scoreBoard)
      }
    }
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
    this.#$surveySaysBoard.toggleAttribute('hidden', hideIntro)
  }

  clearBoard() {
    this.#$surveySaysBoard.makeQuestion('', [])
    this.points.scoreBoard = 0
    this.#$surveySaysBoard.updateScoreBoard(this.points.scoreBoard)
    this.#roundInProgress = false
  }

  clearScores() {
    this.clearBoard()
    this.points.team1 = 0
    this.points.team2 = 0
    this.#$surveySaysBoard.awardTeam1(this.points.team1)
    this.#$surveySaysBoard.awardTeam2(this.points.team2)
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
      case "flipCard":
        this.flipCard(data.cardID)
        break;
      case "hostAssigned":
        this.removeHostControls()
        //app.closeIntro()
        break;
      case "wrong1":
        this.wrongAnswer(1)
        break;
      case "wrong2":
        this.wrongAnswer(2)
        break;
      case "wrong3":
        this.wrongAnswer(3)
        break;
      case "clearBoard":
        this.clearBoard()
        break;
      case "clearScores":
        this.clearScores()
        break;
      case "toggleIntroMusic":
        this.toggleIntroMusic()
        break;
      case "toggleIntro":
          this.toggleIntro()
        break;
      case "againSound":
        this.Sounds.again.play()
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
    if (KEY === 'c' && confirm('Clear the board?')) { //Clear
      gameManager.talkSocket(socketData('clearBoard'))
    }
    if (KEY === 'n' && confirm('start New game?')) { // New Game
      gameManager.talkSocket(socketData('clearScores'))
    }
  }
})
