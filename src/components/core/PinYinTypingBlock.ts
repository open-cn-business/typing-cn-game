import {WordCanvasContainer} from "@/components/core/WordCanvasContainer";
import type {onTypingError, onTypingFinished} from "@/components/core/Listener";
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

    constructor(
        public pinYin: string,
        public word: string
    ) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d')!;
        this.render();
    }

    setFinishedEvent(fun: onTypingFinished) {
        this.finishedEvent = fun;
    }

    setTypeErrorEvent(fun: onTypingError) {
        this.typeErrorEvent = fun;
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
                        if (this.finishedEvent) {
                            this.finishedEvent();
                        }
                    } else {
                        if (curWord == undefined) {
                            console.log('undfine word', curWord)
                        }
                        this.waitForInput = curWord[this.charIndexInWord].toLowerCase();
                    }
                } else {
                    // char green
                    curCanvas.canvas.makeCharGreen(this.charIndexInWord);
                    this.charIndexInWord++;
                    this.waitForInput = curWord[this.charIndexInWord].toLowerCase();
                }

            } else {
                if (this.typeErrorEvent) {
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
        console.log(`init canvas width: ${this.canvas.width} height: ${this.canvas.height}`);

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
            console.log('zzq see draw word', wordCanvas.canvas.toDataURL());
            x += wordCanvas.canvas.width + 20;
            height = wordCanvas.canvas.height;
        }
        this.waitForInput = this.charArr[0][0].toLowerCase();

        this.canvas.width = x + 10;
        this.canvas.height = height;
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, x + 10, height);
        console.log(`calculate width: ${x + 10} height: ${height}`);
        console.log(`canvas width: ${this.canvas.width} height: ${this.canvas.height}`);
        this.ctx.font = `30px \'${this.defaultEnFontFamily}\', \'${this.defaultCnFontFamily}\', Arial`;
        this.ctx.fillStyle = '#000';

        this.childCanvasArray.forEach(canvas => {
            this.ctx.drawImage(canvas.canvas.canvas, canvas.x, 20);
        });
    };

}