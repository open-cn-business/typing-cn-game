import type {WordCanvas} from "@/components/core/WordCanvas";

export class WordCanvasContainer{
    constructor(public canvas: WordCanvas, public x: number, public y: number) {
    }

    reset(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.canvas.canvas, this.x, this.y);
    }

    clear(ctx: CanvasRenderingContext2D){
        ctx.clearRect(this.x, this.y, this.canvas.canvas.width, this.canvas.canvas.height);
    }
}