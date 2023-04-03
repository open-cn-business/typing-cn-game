import type {Letter} from "@/components/core/Letter";

export class WordCanvas {
    private defaultEnFontFamily: string = 'Comic Sans MS';
    private defaultCnFontFamily: string = 'Ma Shan Zheng';
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    distance = 20;
    pinyinMarginLeft = 0;

    greenColor = 'hsla(160, 100%, 37%, 1)';


    makeAllGreen(){
        this.letters.forEach((letter, index) => {
            letter.color = this.greenColor;
        });
        this.cnWord.color = this.greenColor;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.render();
    }
    makeCharGreen(index: number){
        this.letters[index].color = this.greenColor;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.render();
    }

    makeCharRed(index: number){
        this.letters[index].color = 'red';
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.render();
    }

    private render(){
        this.ctx.font = `${this.fontSize}px '${this.defaultEnFontFamily}', '${this.defaultCnFontFamily}', sans-serif`;
        this.ctx.textBaseline = 'middle';
        const letterWidth = this.ctx.measureText(this.word).width;
        const wordWidth = this.ctx.measureText(this.cnWord.char).width;
        this.canvas.width = Math.max.apply(null, [letterWidth, wordWidth]);
        this.pinyinMarginLeft = (this.canvas.width - letterWidth) / 2;
        const oneLineHeight = this.fontSize * 1.5;
        this.canvas.height = oneLineHeight * 2 + this.distance;
        this.ctx.font = `${this.fontSize}px '${this.defaultEnFontFamily}', '${this.defaultCnFontFamily}', sans-serif`;
        this.ctx.textBaseline = 'middle';
        this.letters.forEach((letter, index) => {
            this.ctx.fillStyle = letter.color;
            const xp = this.getLetterXPosition(index);
            const yp = oneLineHeight / 2;
            this.ctx.fillText(letter.char, xp, yp);
        });
        this.ctx.fillStyle = this.cnWord.color;
        this.ctx.fillText(this.cnWord.char, (this.canvas.width - wordWidth) / 2, oneLineHeight + this.distance);
    }

    constructor(public word: string, public letters: Letter[], public fontSize: number, public cnWord: Letter) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d')!;
        this.render();
    }

    getLetterXPosition(index: number): number {
        let x = this.pinyinMarginLeft;
        for (let i = 0; i < index; i++) {
            x += this.ctx.measureText(this.letters[i].char).width;
        }
        return x;
    }
}
