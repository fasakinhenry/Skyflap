//Define the context of the game
let ctx = canvas.getContext('2d');

//Set canvas height and width to take the full height and width of the browser window
canvas.width = innerWidth;
canvas.height = innerHeight;

let spacePressed = false;

//Create an addEventListener to handle the canvas height and width when the browser resizes

addEventListener("resize", ()=>{
    canvas.height = innerHeight;
    canvas.width = innerWidth;
});

addEventListener("keydown", (e)=>{
    if (e.code === 'Space') spacePressed = true;
});

addEventListener("keyup", (e)=>{
    if (e.code === 'Space') spacePressed = false;
});

//Create all the important variables that will be used in the game

let angle = 0;
let hue = 0;
let frame = 0;
let score =0;
let gameSpeed = 2;

// Create a variable to define all the parametrs that will be used to generate game objects
let particlesArray  = [];
let obstaclesArray = [];

//This is a class to handle all the background of the game
class Layer {
    constructor(image, speedModifier) {
        this.x = 0;
        this.y = 0;
        this.width = innerWidth;
        this.height = innerHeight;
//        this.x2 = this.width;
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed * this.speedModifier;
    }
    
    //    Method that updates the background to give it a moving effect
    update() {
        this.speed = gameSpeed * this.speedModifier;
        if (this.x <= -this.width) {
            this.x = 0; //this.width + this.x2 - this.speed;
        }
        
        //  Reset the x values of the images in the game
        this.x = Math.floor(this.x - this.speed);
    }
    //    Method to draw the background image to the canvas
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
}

//Create classes for all the game objects
//Create a class for the bird class
class Bird {
    constructor() {
        this.x = 150;
        this.y = 200;
        this.vy = 0;
        this.width = 100;
        this.height = 100;
        this.weight = 1;
        this.sprite = 0;
        this.imageArray = [bird1, bird2, bird3, bird4];
        this.image = this.imageArray[this.sprite];
    }
    
    //Create a method to update the bird element
    update() {
        let curve = Math.sin(angle) * 5;
        if (this.y > canvas.height - this.height + curve) {
            this.y = canvas.height - this.height + curve;
            this.vy = 0;
        } else {
            this.vy += this.weight;
            this.vy *= 1;
            this.y += this.vy;
        }
        
        if (this.y <= 0) {
            this.y = 0;
            this.vy = 0;
        }
        if (this.sprite < 3) {
            this.sprite++;
        } else {
            this.sprite = 0;
        }
        
        this.image = this.imageArray[this.sprite];
        
        
        if (spacePressed || this > this.height) this.flap();
    }
    
    //Create a method to draw the bird to the canvas
    draw() {
        ctx.fillStyle = "hsl(" + hue + ", 100%, 50%, 1)";
        ctx.beginPath();
//        ctx.fillRect(this.x, this.y, this.width, this.height);
//        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.height / 2, 0, Math.PI * 2, false);
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.fill();
    }
    
    //Create a function in the bird class to allow for the flapping of the bird upward
    flap() {
        this.vy -= 5;
    }
}

const bird = new Bird();

// Create a class for the gemeration of the particles of the game
class Particle {
    constructor() {
        this.x = bird.x;
        this.y = bird.y + bird.height / 2;
        this.size = Math.random() * 7 + 3;
        this.speedY = (Math.random() * 1) - 0.5;
        this.color = "hsla(" + hue + ", 100%, 50%, 0.8)";
    }

    // Create a class to update the position of each particle
    update() {
        this.x -= gameSpeed;
        this.y += this.speedY;
    }

    // Create a function in the class to draw the particles to the screen
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// create a new class for the obstacles in the game which are in the form of pipes
class Obstacles {
    constructor() {
        this.top =  (Math.random() * canvas.height/3) + 50;
        this.bottom =  (Math.random() * canvas.height/3) + 50;
        this.x = canvas.width;
        this.width = 80;
//        this.color = "hsla(" + hue + ", 100%, 50%, 1)";
//        this.color = "black" || "hsla(" + hue + ", 100%, 50%, 1)";
        this.color1 = "hsla(" + hue + ", 100%, 50%, 1)";
        this.color2 = "black"
        this.colorChosen = [this.color1, this.color2];
        this.color = this.colorChosen[Math.floor(Math.random() * this.colorChosen.length)];
    }
    
    //Create a method to draw the obstacles on the screen
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, 0, this.width, this.top);
        ctx.fillRect(this.x, canvas.height - this.bottom, this.width, this.bottom);
    }
    
    // Create a method to uodate and simulate the movements of the obstacle
    update() {
        this.x -= gameSpeed * 5;
        this.draw();
    }
}

const background = new Layer(backgroundImage, 6.5);

function handleObstacles() {
    if (frame%20 === 0) {
        obstaclesArray.unshift(new Obstacles);
    }
    
    for (i = 0; i < obstaclesArray.length; i++) {
        obstaclesArray[i].update();
    }
    
    if (obstaclesArray.length > 20) {
        obstaclesArray.pop(obstaclesArray[0]);
    }
}



// Create a function to handle all the generative particles
function handleParticles() {
    // Add particle to the beginning of the array
    particlesArray.unshift(new Particle);
    //Use a for loop to assign the draw and update method to the particle instance of the Particle class
    for (i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    
    if (particlesArray.length > 200) {
        for (let i = 0; i < 20; i++) {
            particlesArray.pop(particlesArray[i]);
        }
    }
}

function handleCollisions() {
    for (let i = 0; i < obstaclesArray.length; i++) {
        if (bird.x < obstaclesArray[i].x + obstaclesArray[i].width && bird.x + bird.width > obstaclesArray[i].x && ((bird.y < 0 + obstaclesArray[i].top && bird.y + bird.height > 0) || (bird.y  > canvas.height - obstaclesArray[i].bottom && bird.y + bird.height < canvas.height))) {
            //Collision detected
            return true;
        }
    }
}



//Create a function that animate all the elements in the game
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleCollisions();
    if (handleCollisions()) {
        return
//        swal.fire("Game Over")
    }
    background.draw();
    background.update();
    handleObstacles();
    bird.update();
    bird.draw();
    handleParticles();
    angle+= 0.12;
    hue++;
    frame++;
    requestAnimationFrame(animate);
}

animate();

