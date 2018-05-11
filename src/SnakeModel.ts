import {types} from "mobx-state-tree";


const range = (from: number, to: number, step: number = 1) =>
    Array(Math.floor((to - from) / step) + 1)
        .fill(0)
        .map((v, i) => from + i * step);

const set = (self: typeof SnakeModel.Type, x: number, y: number, value: typeof Field.Type) => {
    const index = x + self.width * y;
    self.board[index] = value;
};

export const Field = types.enumeration("Field", ["empty", "border", "snake"]);
export const Direction = types.enumeration("Direction", ["left", "right", "up", "down"]);

export const SnakeModel = types.model({
    board: types.optional(types.array(Field), []),
    finished: types.optional(types.boolean, false),
    score: types.optional(types.number, 0),
    width: types.optional(types.number, 100),
    height: types.optional(types.number, 100),
    /** current move direction of snake */
    direction: types.optional(Direction, "right"),
    /** array of indices which snake occupies; head is last entry */
    snake: types.optional(types.array(types.number), [])
}).views((self) => {
    return {
        at: (x: number, y: number) => {
            const index: number = x + self.width * y;
            return self.board[index];
        }
    };
}).actions((self) => {
    return {
            init: (width: number, height: number): void => {
                self.board.clear();
                self.snake.clear();
                self.direction = "right";
                self.width = width;
                self.height = height;
                range(0, width * height - 1).forEach(idx => self.board[idx] = "empty");
                range(0, width - 1).forEach(idx => {
                    set(self as typeof SnakeModel.Type, idx, 0, "border");
                    set(self as typeof SnakeModel.Type, idx, height - 1, "border");
                });
                range(0, height - 1).forEach(idx => {
                    set(self as typeof SnakeModel.Type, 0, idx, "border");
                    set(self as typeof SnakeModel.Type, width - 1, idx, "border");
                });
            },

            initSnake: (x: number, y: number, length: number) => {
                self.snake.clear();
                range(x, x + length - 1).forEach(idx => {
                    const index = idx + y * self.width;
                    self.snake.push(index);
                    self.board[index] = "snake";
                });
            },
            setDirection: (d: typeof Direction.Type) => {
                self.direction = d;
            },
            move: () => {
                if (!self.finished && self.snake.length > 0) {
                    // remove tail on board
                    self.board[self.snake[0]] = "empty";
                    self.snake.shift();
                    const headIndex = self.snake[self.snake.length -1];
                    let offset = 0;
                    switch (self.direction){
                        case "left":
                            offset = -1;
                            break;
                        case "right":
                            offset = 1;
                            break;
                        case "up":
                            offset = -self.width;
                            break;
                        case "down":
                            offset = self.width;
                            break;
                    }
                    const newIndex = headIndex + offset;
                    if (self.board[newIndex] !== "empty"){
                        self.finished = true;
                    } else {
                        self.score = self.score +1;
                    }
                    self.snake.push(newIndex);
                    self.board[newIndex] = "snake";
                }
            }

        };
    }
);


export const snakeModel = SnakeModel.create();