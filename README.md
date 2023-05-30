# Survey Says

This is a web app used to create a server using a live socket in order to set up a **game host instance** and an **audience display instance**.  Once the host is selected, they will have control over the audience board and points. 

## Install and Start

```bash
cd survey-says
npm install
npm start
```

Terminal should respond with:

```sh
Listening on http://localhost:2022/
```

> It should also open the local page on your default web browser.

---

## How to Play Survey Says

* Open two(2) browser windows at http://localhost:2022/
* Click **Be the host** to assign that window to become the game **host controller**. All other open instances will become the **audience window** window. 
* As the **host** you can:
   * Click to reveal answers
   * Assign points
   * Go to new questions
   * Play sound effects

**When you first open the game there will be an intro screen**

> Optionally press `m` on your keyboard to toggle the intro music

> To continue press `s` on your keyboard

**Just click on `new question` to play the game**

If a contestant guesses the correct answer, click on the board to reveal the answer for the audience.

![Intro Screen](./screens/game-screen.gif)

If the team playing cannot clear the board, then the opposing team has a chance to guess one correct answer to earn the points.  The host can award the winning team the points and reveal the remaining answers before moving on to a new round.


### Host HotKeys

While the main game window is on focus, press they key below to trigger the event.

| Key | Event |
| --- | ----------- |
| m | Toggle intro music |
| i | Toggle intro screen |
| s | Start the game as the Host |
| c | Clear the board with nothing (Host Only) |
| n | Start a new game by clearing out the scores (Host Only) |


---

## Architecture

The modern version coded in JavaScript 2022 uses web components, classes and other ES2022 features. To learn more about web components visit:

> https://blog.openreplay.com/an-introduction-to-native-web-components/


**Visual of components for UI**

![Components](./screens/components-drawio.svg)

The modern code is made up of three(3) custom elements and a `GameManager` class that will manage the logic/state of the game as well as handle the event listeners from the custom elements emitted by user interaction. 

**Folder Structure**

The `public` folder and `server.js` file are the main concerns for this application.

```
survey-says
├── node_modules
├── public
│   ├── css
│   │    └── style.css
│   ├── data
│   │    └── questions.json
│   ├── fx
│   │    ├── again.mp3
│   │    ├── flip.mp3
│   │    ├── intro.mp3
│   │    ├── new.mp3
│   │    ├── notification.mp3
│   │    ├── points.mp3
│   │    └── strike.mp3
│   ├── images
│   │    ├── background.svg
│   │    ├── favicon.ico
│   │    └── wrong.svg
│   ├── js
│   │    └── SurveySays.js
│   └── index.html
├── screens
├── .editorconfig
├── .gitignore
├── host-ip.js
├── package-lock.json
├── package.json
├── README.md
└── server.js
```

**Enjoy**
