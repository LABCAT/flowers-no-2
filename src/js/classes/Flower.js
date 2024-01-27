
export default class Flower {

    constructor(p5, x, y, hue) {
        this.p = p5;
        this.x = x;
        this.y = y;
        this.petalCount = p5.random(2, 16);
        this.pistilRadius = p5.random(10, 20);
        this.cp1x = Math.random() * p5.random(20, 80);
        this.cp1y = 0;
        this.cp2x = Math.random() * p5.random(20, 80);
        this.cp2y = Math.random() * p5.random(20, 80);
        this.cp3x = Math.random() * p5.random(20, 80);
        this.cp3y = Math.random() * p5.random(20, 80);
        this.cp4x = 0;
        this.cp4y = 0;
        this.petalColor = {
            r: hue, 
            g: this.p.random(50, 100), 
            b: this.p.random(50, 100),
            a: this.p.random(50, 100),
        }
        this.pistilColor = {
            r: hue + 90 > 360 ? hue - 90 : hue + 90, 
            g: this.p.random(50, 100), 
            b: this.p.random(50, 100),
            a: this.p.random(50, 100),
        }
    }

    makePetal () {
        this.p.beginShape();
        this.p.vertex(this.cp1x, this.cp1y);
        this.p.bezierVertex(this.cp2x, this.cp2y, this.cp3x, this.cp3y, this.cp4x, this.cp4y);
        this.p.bezierVertex(this.cp3x, -this.cp3y, this.cp2x, -this.cp2y, this.cp1x, this.cp1y); // if first 2 numbers are changed to 20, 115 it becomes continuous
        this.p.endShape();
    }

    draw () {
        this.p.translate(this.x, this.y);
        this.p.push();
        this.p.noStroke();
        let hue = this.petalColor.r;
        for (let i = 0; i < this.petalCount * 2; i++) {
            this.p.fill(
                hue, 
                this.petalColor.g,
                this.petalColor.b,
                this.petalColor.a
            );
            this.p.strokeWeight(.25);
            this.makePetal();
            this.p.rotate(this.p.PI / this.petalCount);
            hue = hue + 10 > 360 ? hue - 360 + 10 : hue + 10;
        }
        this.p.fill(
            this.pistilColor.r, 
            this.pistilColor.g,
            this.pistilColor.b,
            this.pistilColor.a
        );
        this.p.ellipse(0, 0, this.pistilRadius);
        this.p.pop();
        this.p.translate(-this.x, -this.y);
    }
}