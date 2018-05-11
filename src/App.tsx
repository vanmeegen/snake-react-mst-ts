
import * as React from "react";
import "./App.css";

import logo from "./logo.svg";
import {SnakeGame} from "./SnakeGame";
import {snakeModel} from "./SnakeModel";

class App extends React.Component {
  public render(): JSX.Element {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Snake Game</h1>
            <p> by Marco van Meegen 2018-05-11</p>
        </header>
          <SnakeGame model={snakeModel}/>
      </div>
    );
  }
}

export default App;
