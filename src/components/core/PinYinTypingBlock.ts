import {WordCanvasContainer} from "@/components/core/WordCanvasContainer";
import type {onTypingError, onTypingFinished, onTypingSuccess} from "@/components/core/Listener";
import {Letter} from "@/components/core/Letter";
import {WordCanvas} from "@/components/core/WordCanvas";

export class PinYinTypingBlock {

    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    private defaultEnFontFamily: string = 'Comic Sans MS';
    private defaultCnFontFamily: string = 'Ma Shan Zheng';
    private childCanvasArray: WordCanvasContainer[] = [];
    private charArr: string[][] = [];
    private waitForInput = '';
    private currentWordIndex = 0;
    private charIndexInWord = 0;

    private finishedEvent: onTypingFinished | undefined;
    private typeErrorEvent: onTypingError | undefined;
    private typeCharSuccess: onTypingSuccess | undefined;

    constructor(
        public pinYin: string,
        public word: string
    ) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d')!;
        this.render();
    }

    setFinishedEvent(fun: onTypingFinished) {
        if (typeof fun !== 'function') {
            throw new Error('Parameter must be a function');
        }
        this.finishedEvent = fun;
    }

    setTypeSuccessEvent(fun: onTypingSuccess) {
        if (typeof fun !== 'function') {
            throw new Error('Parameter must be a function');
        }
        this.typeCharSuccess = fun;
    }

    setTypeErrorEvent(fun: onTypingError) {
        if (typeof fun !== 'function') {
            throw new Error('Parameter must be a function');
        }
        this.typeErrorEvent = fun;
    }

    private mapChar(char: string){
        console.log('mapChar', char);
        // 字母排序>声母排序>韵母排序
        if (char == 'a' || char == 'A' || char == 'ā' || char == 'á' || char == 'ǎ' || char == 'à') {
            return 'a';
        }else if (char == 'b' || char == 'B' || char == 'ḃ') {
            return 'b';
        }else if (char == 'c' || char == 'C' || char == 'ĉ') {
            return 'c';
        }else if (char == 'd' || char == 'D' || char == 'ḋ') {
            return 'd';
        } else if (char == 'e' || char == 'E' || char == 'ē' || char == 'é' || char == 'ě' || char == 'è') {
            return 'e';
        } else if (char == 'f' || char == 'F' || char == 'f̄') {
            return 'f';
        }else if (char == 'g' || char == 'G' || char == 'ǵ') {
            return 'g';
        }else if (char == 'h' || char == 'H' || char == 'ĥ') {
            return 'h';
        } else if (char == 'i' || char == 'I' || char == 'ī' || char == 'í' || char == 'ǐ' || char == 'ì') {
            return 'i';
        }else if (char == 'j' || char == 'J' || char == 'ǰ') {
            return 'j';
        }else if (char == 'k' || char == 'K' || char == 'ḱ') {
            return 'k';
        }else if (char == 'l' || char == 'L' || char == 'l̄') {
            return 'l';
        }else if (char == 'm' || char == 'M' || char == 'm̄' || char == 'ḿ' || char == 'm̀') {
            return 'm';
        }else if (char == 'n' || char == 'N' ||char == 'ń' || char == 'ň' || char == 'ǹ') {
            return 'n';
        } else if (char == 'o' || char == 'O' || char == 'ō' || char == 'ó' || char == 'ǒ' || char == 'ò') {
            return 'o';
        }else if (char == 'p' || char == 'P' || char == 'ṕ') {
            return  'p';
        }else if (char == 'q' || char == 'Q' || char == 'ɢ') {
            return 'q';
        }else  if (char == 'r' || char == 'R' || char == 'ŕ') {
            return 'r';
        }else if (char == 's' || char == 'S' || char == 'ŝ') {
            return 's';
        }else if (char == 't' || char == 'T' || char == 'ṯ') {
            return 't';
        }else if (char == 'u' || char == 'U' || char == 'ü' || char == 'ǜ' ||  char == 'ǚ' || char == 'ǘ' || char == 'ū' || char == 'ú' || char == 'ǔ' || char == 'ù') {
            return 'u';
        } else if (char == 'v' || char == 'V' || char == 'ṽ') {
            return 'v';
        } else if (char == 'w' || char == 'W' || char == 'ẁ') {
            return 'w';
        } else if (char == 'x' || char == 'X' || char == 'ẋ') {
            return 'x';
        } else if (char == 'y' || char == 'Y' || char == 'ȳ' || char == 'ý' || char == 'ỳ') {
            return 'y';
        } else if (char == 'z' || char == 'Z' || char == 'ẑ') {
            return 'z';
        } else {
            return char;
        }
    }

    public append(key: string): void {
        if (this.ctx && this.canvas) {
            const curCanvas = this.childCanvasArray[this.currentWordIndex];
            if (!curCanvas) {
                return;
            }
            let curWord = this.charArr[this.currentWordIndex];
            curCanvas.clear(this.ctx);
            if (key == this.waitForInput) {
                if (curWord.length === (this.charIndexInWord + 1)) {
                    // all green
                    curCanvas.canvas.makeAllGreen();
                    this.currentWordIndex++;
                    this.charIndexInWord = 0;
                    curWord = this.charArr[this.currentWordIndex];
                    if (this.currentWordIndex == this.charArr.length) {
                        if (typeof this.finishedEvent === 'function') {
                            this.finishedEvent();
                        }
                    } else {
                        this.waitForInput = this.mapChar(curWord[this.charIndexInWord]);
                    }
                } else {
                    if (typeof this.typeCharSuccess === 'function') {
                        this.typeCharSuccess(key);
                    }
                    // char green
                    curCanvas.canvas.makeCharGreen(this.charIndexInWord);
                    this.charIndexInWord++;
                    this.waitForInput = this.mapChar(curWord[this.charIndexInWord]);
                }

            } else {
                if (typeof this.typeErrorEvent === 'function') {
                    this.typeErrorEvent(this.waitForInput, key);
                }
                curCanvas.canvas.makeCharRed(this.charIndexInWord);
            }
            curCanvas.reset(this.ctx);
        }
    }

    public render(): void {
        if (this.ctx && this.canvas) {
            this.childCanvasArray = [];
            this.currentWordIndex = 0;
            this.charIndexInWord = 0;
            this.charArr = [];
            // 清空画布
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.draw();
        }
    }

    private draw() {
        if (!this.pinYin || !this.word) {
            return;
        }
        const fontSize = 30;
        const words = this.pinYin.split(' ');
        const words2 = this.word.split('');
        let x = 10;
        let height = 0;
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const cnWord = words2[i];
            const letters = word.split('').map(char => new Letter(char, 'grey'));
            this.charArr = [...this.charArr, word.split('')];
            const wordCanvas = new WordCanvas(word, letters, fontSize, {char: cnWord, color: 'grey'});
            this.childCanvasArray.push(new WordCanvasContainer(wordCanvas, x, 20));
            x += wordCanvas.canvas.width + 20;
            height = wordCanvas.canvas.height;
        }
        this.waitForInput = this.mapChar(this.charArr[0][0]);

        this.canvas.width = x + 10;
        this.canvas.height = height;
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, x + 10, height);
        this.ctx.font = `30px \'${this.defaultEnFontFamily}\', \'${this.defaultCnFontFamily}\', Arial`;
        this.ctx.fillStyle = '#000';

        this.childCanvasArray.forEach(canvas => {
            this.ctx.drawImage(canvas.canvas.canvas, canvas.x, 20);
        });
    };

}