import {snakeModel} from "./SnakeModel";
import {getSnapshot} from "mobx-state-tree";

describe("Snake Model describes state and action for Snake Game", () => {

    it("initializes an empty model", () => {
        expect(getSnapshot(snakeModel)).toEqual({
            "board": [],
            "direction": "right",
            "finished": false,
            "height": 100,
            "score": 0,
            "width": 100,
            "snake": []
        });
    });

    it("initializes a models size and border correctly ", () => {
        snakeModel.init(4, 4);
        expect(getSnapshot(snakeModel.board)).toEqual(
            [
                "border", "border", "border", "border",
                "border", "empty", "empty", "border",
                "border", "empty", "empty", "border",
                "border", "border", "border", "border"]
        );
        expect(snakeModel.width).toEqual(4);
        expect(snakeModel.height).toEqual(4);
    });

    describe("It can move a snake on the board", () => {
        beforeEach(() => {
            snakeModel.init(10, 10);
        });

        it("creates a snake of a given length", () => {
            snakeModel.initSnake(3, 3, 3);
            expect(snakeModel.at(3, 3)).toEqual("snake");
            expect(snakeModel.at(4, 3)).toEqual("snake");
            expect(snakeModel.at(5, 3)).toEqual("snake");
            expect(snakeModel.at(6, 3)).toEqual("empty");
        });

        it("moves a snake in the current direction for action move", () => {
            snakeModel.initSnake(3, 3, 3);
            snakeModel.move();
            expect(snakeModel.at(3, 3)).toEqual("empty");
            expect(snakeModel.at(4, 3)).toEqual("snake");
            expect(snakeModel.at(5, 3)).toEqual("snake");
            expect(snakeModel.at(6, 3)).toEqual("snake");
        });

        it("moves up if direction up is set before", () => {
            snakeModel.initSnake(3, 3, 3);
            snakeModel.setDirection("up");
            snakeModel.move();
            expect(snakeModel.at(3, 3)).toEqual("empty");
            expect(snakeModel.at(4, 3)).toEqual("snake");
            expect(snakeModel.at(5, 3)).toEqual("snake");
            expect(snakeModel.at(5, 2)).toEqual("snake");
        });

        it("moves down if direction down is set before", () => {
            snakeModel.initSnake(3, 3, 3);
            snakeModel.setDirection("down");
            snakeModel.move();
            expect(snakeModel.at(3, 3)).toEqual("empty");
            expect(snakeModel.at(4, 3)).toEqual("snake");
            expect(snakeModel.at(5, 3)).toEqual("snake");
            expect(snakeModel.at(5, 4)).toEqual("snake");
        });
        it("moves right if direction right is set before", () => {
            snakeModel.initSnake(3, 3, 3);
            snakeModel.setDirection("up");
            snakeModel.setDirection("right");
            snakeModel.move();
            expect(snakeModel.at(3, 3)).toEqual("empty");
            expect(snakeModel.at(4, 3)).toEqual("snake");
            expect(snakeModel.at(5, 3)).toEqual("snake");
            expect(snakeModel.at(6, 3)).toEqual("snake");
        });
        it("finishes game if it runs into itself", () => {
            snakeModel.initSnake(3, 3, 3);
            snakeModel.setDirection("left");
            snakeModel.move();
            expect(snakeModel.at(3, 3)).toEqual("empty");
            expect(snakeModel.at(4, 3)).toEqual("snake");
            expect(snakeModel.at(5, 3)).toEqual("snake");
            expect(snakeModel.finished).toEqual(true);
        });
    });

});
