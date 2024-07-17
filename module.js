'use strict'

console.log("module loaded")

const info={
    frame:60,
    num:{cat:30,text:5},
    size:{min:100,max:500},
    speed:{min:30,max:120},
    imgNum:{min:1,max:2},
    randTexts:[`happy happy happy`,`cute kitty`,'happy',`meow meow`]
}

const calc={
    normalize:({x,y})=>{
        const radius = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
        return {x:x/radius, y:y/radius};
    },

    randomPos:()=>{
        return {
            x:Math.random()*100,
            y:Math.random()*100,
        }
    },

    getRand:([min,max])=>{
        return (Math.random()*(max-min)+min);
    },

    getInteRand:([min,max])=>{
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

class Boing extends HTMLElement{
    nowPos;
    nowVelo;
    speed;
    size;

    constructor(inner,size=null){
        super();
        this.innerHTML=inner;
        this.size = size;

        this.moveAnimStart();
    }

    setPos({x,y,size}){
        if(size==null){
            this.style=`top:${x}%;left:${y}%;`;
        }
        else
            this.style=`top:${x}%;left:${y}%;width:${size}px;height:${size}px;`;
    }

    moveCalc(){
        this.nowPos = {
            x:this.nowPos.x + this.nowVelo.x / info.frame * this.speed,
            y:this.nowPos.y + this.nowVelo.y / info.frame * this.speed,
        }

        // for velocity
        this.nowPos.x >= 100 && this.nowVelo.x > 0 && (this.nowVelo.x = -this.nowVelo.x);
        this.nowPos.x <= 0 && this.nowVelo.x < 0 && (this.nowVelo.x = -this.nowVelo.x);

        this.nowPos.y >= 100 && this.nowVelo.y > 0 && (this.nowVelo.y = -this.nowVelo.y);
        this.nowPos.y <= 0 && this.nowVelo.y < 0 && (this.nowVelo.y = -this.nowVelo.y);
    }

    moveAnimStart(){
        this.nowVelo=calc.normalize({x:1,y:1});
        this.nowPos=calc.randomPos();

        this.speed = calc.getRand([info.speed.min,info.speed.max]);

        setInterval(()=>{
            this.moveCalc();
            this.setPos({...this.nowPos,size:this.size});
        },1000/info.frame);
    }
}

class HappyCat extends Boing{

    constructor(){
        const imgLink = `imgs/happycat/${calc.getInteRand([info.imgNum.min,info.imgNum.max])}.gif`;
        super(`<img src="${imgLink}" alt="">`,calc.getRand([info.size.min,info.size.max]));
    }
}

class HappyText extends Boing{

    constructor(){
        const randText = info.randTexts[calc.getInteRand([0,info.randTexts.length-1])]

        super(`<div class="rainbow_text_animated">${randText}</div>`);
    }
}

customElements.define('happy-cat',HappyCat);
customElements.define('happy-text',HappyText);


const app = document.getElementById("app");
let inner=``;

// gen cat
for(let i=0;i<info.num.cat;i++)
    inner+= `<happy-cat></happy-cat>`

// gen text
for(let i=0;i<info.num.text;i++)
    inner+= `<happy-text></happy-text>`

app.innerHTML=inner;