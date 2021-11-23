class Pipe {
    type;
    rotation;
    jointPoints = [];
    coordinates = [];
    filled;
    imageList = [];
    image;

    constructor(type, coordinates, rotation, imageList) {
        this.type = type;
        this.coordinates = coordinates;
        this.rotation = rotation;
        if (type == "waterfall") {
            this.filled = true;
        }

        this.imageList = imageList;
        if (this.imageList) {
            this.image = this.imageList[0];
        }
        this.setJointPoints(type, rotation);
    }

    setJointPoints(pipeType, pipeRotate) {
        if (pipeType == "waterfall") {
            this.jointPoints = [0, 0, 1, 0];
        } else if (pipeType == "straight") {
            this.jointPoints = [0, 1, 0, 1];
        } else if (pipeType == "duple") {
            this.jointPoints = [0, 1, 1, 0];
        } else if (pipeType == "triple") {
            this.jointPoints = [1, 1, 1, 0];
        } else if (pipeType == "cross") {
            this.jointPoints = [1, 1, 1, 1];
        } else if (pipeType == "finish") {
            this.jointPoints = [0, 0, 1, 0];
        }

        for (let i = 0; i < pipeRotate; i += 90) {
            this.changeJointPoints();
        }
    }

    changeJointPoints() {
        let newJointPoints = [];
        for (let i = 0; i < this.jointPoints.length; i++) {
            if (i == 3) {
                newJointPoints[0] = this.jointPoints[i];
            } else {
                newJointPoints[i + 1] = this.jointPoints[i];
            }
        }
        for (let i = 0; i < newJointPoints.length; i++) {
            this.jointPoints[i] = newJointPoints[i];
        }
    }

    changeRotation() {
        if (this.rotation < 270) {
            this.rotation += 90;
        } else {
            this.rotation = 0;
        }

        
        this.changeJointPoints();
    }
}

class Field {
    spriteContainer;
    pixiLoader;
    pipeMatrix = [];
    pipeMatrixXLength;
    field;
    pipes = [];
    waterfallPipes = [];
    pipesToWin = [];
    getMenu;
    audio;
    
    constructor(pipeMatrix, getMenu, spriteContainer, pixiLoader) {
        this.audio = new Audio();
        this.audio.src = '../resources/audio/click.mp3';
        this.spriteContainer = spriteContainer;
        this.pixiLoader = pixiLoader;
        this.getMenu = getMenu;
        let counter = 0;
        for (let i = 0; i < pipeMatrix.length; i++) {
            this.pipeMatrix.push([]);
            for (let j = 0; j < pipeMatrix[i].length; j++) {
                let rotation = pipeMatrix[i][j].type == "waterfall" ? 0 : 90 * Math.floor(Math.random() * 4);
                let imageList = [];
                let pipe;
                if (pipeMatrix[i][j].type == "waterfall") {
                    this.pixiLoader.load(() => {
                        pipe = new PIXI.Sprite(this.pixiLoader.resources["../resources/pipes/waterfall.png"].texture);
                        this.spriteContainer.stage.addChild(pipe);
                        imageList = ["../resources/pipes/waterfall.png", "../resources/pipes/waterfall.png"];
                    });
                } else if (pipeMatrix[i][j].type == "finish") {
                    this.pixiLoader.load(() => {
                        pipe = new PIXI.Sprite(this.pixiLoader.resources["../resources/pipes/finish_unfilled.png"].texture);
                        this.spriteContainer.stage.addChild(pipe);
                        imageList = ["../resources/pipes/finish_unfilled.png", "../resources/pipes/finish_filled.png"];
                    });
                } else if (pipeMatrix[i][j].type == "straight") {
                    this.pixiLoader.load(() => {
                        pipe = new PIXI.Sprite(this.pixiLoader.resources["../resources/pipes/straight_unfilled.png"].texture);
                        this.spriteContainer.stage.addChild(pipe);
                        imageList = ["../resources/pipes/straight_unfilled.png", "../resources/pipes/straight_filled.png"];
                    });
                } else if (pipeMatrix[i][j].type == "duple") {
                    this.pixiLoader.load(() => {
                        pipe = new PIXI.Sprite(this.pixiLoader.resources["../resources/pipes/duple_unfilled.png"].texture);
                        this.spriteContainer.stage.addChild(pipe);
                        imageList = ["../resources/pipes/duple_unfilled.png", "../resources/pipes/duple_filled.png"];
                    });
                } else if (pipeMatrix[i][j].type == "triple") {
                    this.pixiLoader.load(() => {
                        pipe = new PIXI.Sprite(this.pixiLoader.resources["../resources/pipes/triple_unfilled.png"].texture);
                        this.spriteContainer.stage.addChild(pipe);
                        imageList = ["../resources/pipes/triple_unfilled.png", "../resources/pipes/triple_filled.png"];
                    });
                }else if (pipeMatrix[i][j].type == "cross") {
                    this.pixiLoader.load(() => {
                        pipe = new PIXI.Sprite(this.pixiLoader.resources["../resources/pipes/cross_unfilled.png"].texture);
                        this.spriteContainer.stage.addChild(pipe);
                        imageList = ["../resources/pipes/cross_unfilled.png", "../resources/pipes/cross_filled.png"];
                    });
                }
                if (pipe) {
                    pipe.interactive = true;
                    pipe.buttonMode = true;
                    pipe.anchor.set(0.5);
                    pipe.width = 100;
                    pipe.height = 100;
                    pipe.x = j * 100 + 250;
                    pipe.y = i * 100 + 75;
                    pipe.on("pointerup", this.rotatePipe.bind(this, counter, false));

                }
                this.pipes.push(pipe);
                this.pipeMatrix[i].push(new Pipe(pipeMatrix[i][j].type, [i, j], rotation, imageList ? imageList : []));

                if (pipeMatrix[i][j].type == "waterfall") {
                    this.waterfallPipes.push(this.pipeMatrix[i][j]);
                } else if (pipeMatrix[i][j].type == "finish") {
                    this.pipesToWin.push(this.pipeMatrix[i][j])
                }
                counter++;
            }
        }

        this.pipeMatrixXLength = pipeMatrix[0].length;
        for (let i = 0; i < this.pipes.length; i++) {
            this.rotatePipe(i, true);
        }
        this.checkWaterPath();
        this.waterFiller();
    }

    rotatePipe(index, isStart) {
        let x = index % this.pipeMatrixXLength;
        let y = (index - x) / this.pipeMatrixXLength;
        if (this.pipeMatrix[y][x].type != "cross" && this.pipeMatrix[y][x].type != "waterfall" && this.pipes[index]) {
            this.pipeMatrix[y][x].changeRotation();
            this.pipes[index].rotation = this.pipeMatrix[y][x].rotation * Math.PI / 180;
            if (!isStart) {
                this.audio.play();
                this.checkWaterPath();
                this.waterFiller();
                this.isWin();
            }
        }
    }

    isWin() {
        let winCounter = this.pipesToWin.length;
        for (let i = 0; i < this.pipesToWin.length; i++) {
            if (this.pipesToWin[i].filled) {
                winCounter -= 1;
            }
        }
        if (winCounter == 0) {
            this.pipes.forEach(pipe => {
                if (pipe) {
                    pipe.removeAllListeners();
                }
            })
            setTimeout(this.getMenu, 400);
        }
    }

    waterFiller() {
        for (let i = 0; i < this.pipes.length; i++) {
            let x = i % this.pipeMatrixXLength;
            let y = (i - x) / this.pipeMatrixXLength;
            if (this.pipeMatrix[y][x].filled) {
                if (this.pipeMatrix[y][x].image) {
                    this.pipeMatrix[y][x].image = this.pipeMatrix[y][x].imageList[1];
                    this.pipes[i].texture = PIXI.Texture.from(this.pipeMatrix[y][x].image);
                }
            } else if (!this.pipeMatrix[y][x].filled){
                if (this.pipeMatrix[y][x].image) {
                    this.pipeMatrix[y][x].image = this.pipeMatrix[y][x].imageList[0];
                    this.pipes[i].texture = PIXI.Texture.from(this.pipeMatrix[y][x].image);
                }
            }
        }
    }

    checkWaterPath() {
        let queue = [];
        for (let i = 0; i < this.pipeMatrix.length; i++) {
            for (let j = 0; j < this.pipeMatrix[i].length; j++) {
                if (this.pipeMatrix[i][j].type != "waterfall") {
                    this.pipeMatrix[i][j].filled = false;
                }
            }
        }
        for (let i = 0; i < this.waterfallPipes.length; i++) {
            queue.push(this.waterfallPipes[i]);
        }
        while (queue.length > 0) {
            if (queue[0].jointPoints[0] == 1) {
                let y = queue[0].coordinates[0] - 1;
                let x = queue[0].coordinates[1];
                if (y >= 0 && x >= 0 && y < this.pipeMatrix.length && x < this.pipeMatrix[0].length) {
                    if (this.pipeMatrix[y][x].jointPoints[2] == 1 && !this.pipeMatrix[y][x].filled) {
                        this.pipeMatrix[y][x].filled = true;
                        queue.push(this.pipeMatrix[y][x]);
                    }
                }
            }
            if (queue[0].jointPoints[1] == 1) {
                let y = queue[0].coordinates[0];
                let x = queue[0].coordinates[1] + 1;
                if (y >= 0 && x >= 0 && y < this.pipeMatrix.length && x < this.pipeMatrix[0].length) {
                    if (this.pipeMatrix[y][x].jointPoints[3] == 1 && !this.pipeMatrix[y][x].filled) {
                        this.pipeMatrix[y][x].filled = true;
                        queue.push(this.pipeMatrix[y][x]);
                    }
                }
            }
            if (queue[0].jointPoints[2] == 1) {
                let y = queue[0].coordinates[0] + 1;
                let x = queue[0].coordinates[1];
                if (y >= 0 && x >= 0 && y < this.pipeMatrix.length && x < this.pipeMatrix[0].length) {
                    if (this.pipeMatrix[y][x].jointPoints[0] == 1 && !this.pipeMatrix[y][x].filled) {
                        this.pipeMatrix[y][x].filled = true;
                        queue.push(this.pipeMatrix[y][x]);
                    }
                }
            }
            if (queue[0].jointPoints[3] == 1) {
                let y = queue[0].coordinates[0];
                let x = queue[0].coordinates[1] - 1;
                if (y >= 0 && x >= 0 && y < this.pipeMatrix.length && x < this.pipeMatrix[0].length) {
                    if (this.pipeMatrix[y][x].jointPoints[1] == 1 && !this.pipeMatrix[y][x].filled) {
                        this.pipeMatrix[y][x].filled = true;
                        queue.push(this.pipeMatrix[y][x]);
                    }
                }
            }
            queue.shift();
        }
    }
}

class Game {
    spriteContainer;
    pixiLoader = new PIXI.Loader();
    level = 0;
    levelGonfig;
    fieldLink;

    constructor() {
        this.spriteContainer = new PIXI.Application({
            width: 800,
            height: 700,
            backgroundColor: 0x1899bb
        });
        document.body.appendChild(this.spriteContainer.view);

        this.pixiLoader
            .add("../resources/backgrounds/beach.jpg")
            .add("../resources/buttons/grey_button.png")
            .add("../resources/pipes/waterfall.png")
            .add("../resources/pipes/finish_unfilled.png")
            .add("../resources/pipes/finish_filled.png")
            .add("../resources/pipes/straight_unfilled.png")
            .add("../resources/pipes/straight_filled.png")
            .add("../resources/pipes/duple_unfilled.png")
            .add("../resources/pipes/duple_filled.png")
            .add("../resources/pipes/triple_unfilled.png")
            .add("../resources/pipes/triple_filled.png")
            .add("../resources/pipes/cross_unfilled.png")
            .add("../resources/pipes/cross_filled.png")
            .add("../resources/elements/victory.jpg")
            .add("../resources/elements/logo.png")
            .load(() => {
                const background = new PIXI.Sprite(this.pixiLoader.resources["../resources/backgrounds/beach.jpg"].texture);
                this.spriteContainer.stage.addChild(background);
            });
        this.getMenu();
    }

    getMenu() {
        this.clearStage()
        this.pixiLoader.load(() => {
            const startButton = new PIXI.Sprite(this.pixiLoader.resources["../resources/buttons/grey_button.png"].texture);
            startButton.anchor.set(0.5)
            startButton.x = 400;
            startButton.y = 500;
            startButton.interactive = true;
            startButton.buttonMode = true;
            startButton.on("pointerup", this.nextLevel.bind(this));
            this.spriteContainer.stage.addChild(startButton);
            if (this.level == 0) {
                const logo = new PIXI.Sprite(this.pixiLoader.resources["../resources/elements/logo.png"].texture);
                this.spriteContainer.stage.addChild(logo);
            }
            if (this.level != 0) {
                const victoryImage = new PIXI.Sprite(this.pixiLoader.resources["../resources/elements/victory.jpg"].texture);
                victoryImage.y = 350;
                this.spriteContainer.stage.addChild(victoryImage);
            }
        });
    }

    nextLevel() {
        this.clearStage()
        this.level++;
        this.levelGonfig = levelConfigs.find(levelConfig => {
            if (levelConfig.level == this.level) {
                return true;
            } else {
                return false;
            }
        });
        if (this.levelGonfig) {
            this.fieldLink = new Field(this.levelGonfig.pipeMatrix, this.getMenu.bind(this), this.spriteContainer, this.pixiLoader);
        } else {
            this.level = 0;
            this.getMenu();
        }
    }

    clearStage() {
        for (let i = this.spriteContainer.stage.children.length; i >= 1; i--){
            this.spriteContainer.stage.removeChild(this.spriteContainer.stage.children[i])
        }
    }
}

const game = new Game();