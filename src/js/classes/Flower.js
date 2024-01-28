
export default class Flower {

    constructor(p, x, y, hue) {
        this.p = p;
        this.x = x;
        this.y = y;
        this.petalCount = p.random(2, 16);
        this.pistilRadius = p.random(p.width / 64, p.width / 32);
        this.cp1x = Math.random() * p.random(p.width / 32, p.width / 16);
        this.cp1y = 0;
        this.cp2x = Math.random() * p.random(p.width / 32, p.width / 16);
        this.cp2y = Math.random() * p.random(p.width / 32, p.width / 16);
        this.cp3x = Math.random() * p.random(p.width / 32, p.width / 16);
        this.cp3y = Math.random() * p.random(p.width / 32, p.width / 16);
        this.cp4x = 0;
        this.cp4y = 0;
        this.petalColor = {
            r: hue, 
            g: p.random(50, 100), 
            b: p.random(50, 100),
            a: p.random(0.25, 1),
        }
        this.petalHues = this.generatePetalHues(hue);
        this.pistilColor = {
            r: hue + 90 > 360 ? hue - 90 : hue + 90, 
            g: p.random(50, 100), 
            b: p.random(50, 100),
            a: p.random(0.25, 1),
        }
    }

    makePetal () {
        this.p.beginShape();
        this.p.vertex(this.cp1x, this.cp1y);
        this.p.bezierVertex(this.cp2x, this.cp2y, this.cp3x, this.cp3y, this.cp4x, this.cp4y);
        this.p.bezierVertex(this.cp3x, -this.cp3y, this.cp2x, -this.cp2y, this.cp1x, this.cp1y); // if first 2 numbers are changed to 20, 115 it becomes continuous
        this.p.endShape();
    }

    generatePetalHues (hue) {
        const array = [];
        let newHue = hue;
        for (let i = 0; i < this.petalCount * 2; i++) {
            newHue = this.randomHue(newHue);
            array.push(newHue)
        }
        return array;
    }

    randomHue (hue) {
        const adjustment = this.p.random(-10, 10); 
        return hue + adjustment > 360 ? hue - 360 + adjustment : hue + adjustment;
    } 

    draw () {
        this.p.translate(this.x, this.y);
        this.p.push();
        for (let i = 0; i < this.petalCount * 2; i++) {
            this.p.fill(
                this.petalHues[i], 
                this.petalColor.g,
                this.petalColor.b,
                this.petalColor.a
            );
            this.p.strokeWeight(.5);
            this.makePetal();
            this.p.rotate(this.p.PI / this.petalCount);
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