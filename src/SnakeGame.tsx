import * as React from "react";
import {Direction, Field, snakeModel, SnakeModel} from "./SnakeModel";
import Timer = NodeJS.Timer;
import {observer} from "mobx-react";

interface IFieldProps {
    fieldContent: typeof Field.Type;
    x: number;
    y: number;
}

interface ISnakeModelProps {
    model: typeof SnakeModel.Type;
}

@observer
export class FieldComponent extends React.Component<IFieldProps> {
    constructor(props: IFieldProps) {
        super(props);
    }

    public render(): JSX.Element | null {
        const transform = `translate(${this.props.x * 10},${this.props.y * 10})`;
        let result = null;
        switch (this.props.fieldContent) {
            case "empty":
                break;
            case "border":
                result = <rect transform={transform} width={10} height={10} fill="black"/>;
                break;
            case "snake":
                result = <rect transform={transform} width={10} height={10} fill="purple"/>;
                break;
            default:
                result = <circle transform={transform} width={10} height={10} fill="red"/>;
                break;
        }
        return result;
    }

}

@observer
export class SnakeGame extends React.Component<ISnakeModelProps> {
    private timeout: Timer;
    private mainDiv: HTMLDivElement | null;

    constructor(props: ISnakeModelProps) {
        super(props);
    }

    private newGame = ()=>{
        this.props.model.init(60, 60);
        this.props.model.initSnake(3, 3, 10);
        if (this.mainDiv !== null) {
            this.mainDiv.focus();
        }
        this.timeout = setInterval(() => {
            const finished = snakeModel.move();
            if (finished) {
                clearTimeout(this.timeout);
            }
        }, 100);
    }

    public render(): JSX.Element {
        const result: JSX.Element[] = [];
        const width = this.props.model.width;
        this.props.model.board.forEach((f, idx) => {
            result.push(<FieldComponent fieldContent={f} x={idx % width} y={Math.floor(idx / width)}/>);
        });

        return <div style={{margin:"10px"}}>
            <div>
                <button onClick={this.newGame} title="New Game">New Game</button>
                <p>Score: {this.props.model.score}</p>
                {this.props.model.finished ? <h2>You crashed, Game Finished</h2> : null}
            </div>
            <div onKeyDown={this.onKeyDown} tabIndex={1} ref={(c) => {
                this.mainDiv = c;
            }} style={{outline: "none"}}>
                <svg width="600" height="600" viewBox="0 0 600 600">
                    {result}
                </svg>
            </div>
        </div>;
    }

    private onKeyDown = (evt: React.KeyboardEvent<HTMLElement>) => {
        let direction: typeof Direction.Type | undefined = undefined;
        switch (evt.keyCode) {
            case 38:
                direction = "up";
                break;
            case 40:
                direction = "down";
                break;
            case 37:
                direction = "left";
                break;
            case 39:
                direction = "right";
                break;
        }
        if (direction !== undefined) {
            this.props.model.setDirection(direction);
        }
    }
}