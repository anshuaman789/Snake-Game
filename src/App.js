/*global score, highestScore*/
import React, { Component } from "react";
import Snake from "./Snake";
import Food from "./Food";
import Button from "./Button";
import Menu from "./Menu";

const getRandomFood = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  return [x, y];
};

const initialState = {
  food: getRandomFood(),
      direction: "RIGHT",
      speed: 100,
      route: "menu",
      snakeDots: [[0, 0], [0, 2]],
      score: 0,
      highestScore: 0,
      // paused: false,
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    const storedHighestScore = localStorage.getItem("highestScore");
  this.setState({
    highestScore: storedHighestScore ? parseInt(storedHighestScore, 10) : 0,
  });
    setInterval(this.moveSnake, this.state.speed);
    document.onkeydown = this.onKeyDown;
  }

  componentDidUpdate(prevProps, prevState) {
    this.onSnakeOutOfBounds();
    this.onSnakeCollapsed();
    this.onSnakeEats();

    if (prevState.route !== this.state.route) {
      if (this.state.route === "game" && !this.state.paused) {
        // Start the game logic
        this.startGame();
      } else if (this.state.route === "menu") {
        // Stop the game logic when returning to the menu
        clearInterval(this.intervalId);
      }
    }
  }

  startGame() {
    // Start the interval for snake movement
    this.intervalId = setInterval(this.moveSnake, this.state.speed);
  }

  onKeyDown = e => {
    e = e || window.event;
    switch (e.keyCode) {
      case 37:
        this.setState({ direction: "LEFT" });
        break;
      case 38:
        this.setState({ direction: "UP" });
        break;
      case 39:
        this.setState({ direction: "RIGHT" });
        break;
      case 40:
        this.setState({ direction: "DOWN" });
        break;
    }
  };

  moveSnake = () => {
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length - 1];
    if (this.state.route === "game") {
      switch (this.state.direction) {
        case "RIGHT":
          head = [head[0] + 2, head[1]];
          break;
        case "LEFT":
          head = [head[0] - 2, head[1]];
          break;
        case "DOWN":
          head = [head[0], head[1] + 2];
          break;
        case "UP":
          head = [head[0], head[1] - 2];
          break;
      }
      dots.push(head);
      dots.shift();
      this.setState({
        snakeDots: dots
      });
    }
  };

  onSnakeOutOfBounds() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    if (this.state.route === "game") {
      if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
        this.gameOver();
      }
    }
  }

  onSnakeCollapsed() {
    let snake = [...this.state.snakeDots];
    let head = snake[snake.length - 1];
    snake.pop();
    snake.forEach(dot => {
      if (head[0] == dot[0] && head[1] == dot[1]) {
        this.gameOver();
      }
    });
  }

  onSnakeEats() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    let food = this.state.food;
    if (head[0] == food[0] && head[1] == food[1]) {
      this.setState((prevState) => {
        const newScore = prevState.score + 1;
        const newHighestScore = Math.max(newScore, prevState.highestScore);
        localStorage.setItem("highestScore", newHighestScore.toString());
        return {
          food: getRandomFood(),
          score: newScore,
          highestScore: newHighestScore,
        };
      });
      this.increaseSnake();
      this.increaseSpeed();
    }
  }

  increaseSnake() {
    let newSnake = [...this.state.snakeDots];
    newSnake.unshift([]);
    this.setState({
      snakeDots: newSnake
    });
  }

  increaseSpeed() {
    if (this.state.speed > 10) {
      this.setState({
        speed: this.state.speed - 20
      });
    }
  }

  onRouteChange = () => {
    this.setState({
      route: "game"
    });
  };

  gameOver() {
    alert(`GAME OVER, your score is ${this.state.snakeDots.length - 2}`);
    this.setState(initialState);
  }

  onDown = () => {
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length - 1];

    head = [head[0], head[1] + 2];
    dots.push(head);
    dots.shift();
    this.setState({
      direction: "DOWN",
      snakeDots: dots
    });
  };

  onUp = () => {
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length - 1];

    head = [head[0], head[1] - 2];
    dots.push(head);
    dots.shift();
    this.setState({
      direction: "UP",
      snakeDots: dots
    });
  };

  onRight = () => {
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length - 1];

    head = [head[0] + 2, head[1]];
    dots.push(head);
    dots.shift();
    this.setState({
      direction: "RIGHT",
      snakeDots: dots
    });
  };

  onLeft = () => {
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length - 1];

    head = [head[0] - 2, head[1]];
    dots.push(head);
    dots.shift();
    this.setState({
      direction: "LEFT",
      snakeDots: dots
    });
  };

  // onPauseResume = () => {
  //   this.setState((prevState) => {
  //     const paused = !prevState.paused;
  //     if (paused) {
  //       clearInterval(this.intervalId); // Pause the game
  //     } else {
  //       this.intervalId = setInterval(this.moveSnake, this.state.speed); // Resume the game
  //     }
  //     return { paused };
  //   });
  // };
  

  onRestart = () => {
    clearInterval(this.intervalId); // Stop the current game logic

    // Restart the game logic
    this.setState({
      food: getRandomFood(),
      direction: "RIGHT",
      speed: 100,
      route: "game",
      snakeDots: [[0, 0], [0, 2]],
      score: 0,
      paused: false,
    }, () => this.startGame()); // Start the interval for snake movement
  };

  
  

  render() {
    const { route, snakeDots, food, paused } = this.state;
    return (
      <div>
        {route === "menu" ? (
          <div>
            <Menu onRouteChange={this.onRouteChange} />
          </div>
        ) : (
          <div>
            <div className="game-info">
              <p>Score: {this.state.score}</p>
              <p>Highest Score: {this.state.highestScore}</p>
            </div>
            <div className="game-area">
              <Snake snakeDots={snakeDots} />
              <Food dot={food} />
            </div>
            <Button
              onDown={this.onDown}
              onLeft={this.onLeft}
              onRight={this.onRight}
              onUp={this.onUp}
              // onPauseResume={this.onPauseResume}
              onRestart={this.onRestart}
            />
          </div>
        )}
      </div>
    );
  }
}

export default App;
