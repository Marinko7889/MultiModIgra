// Stanja u igri (Game state) varijable: Uvjezbavanje 0, Igra 1, Kraj igre 2
//let gameState = 0;

// Unos preko Web kamere i model predviđanja ili regresije
// deklariramo varijable, i inicijaliziramo trenutnu procjenu mreže na 0
let video;
let regressor;
let currentPrediction = 0;

// Botuni
let leftButton, centerButton, rightButton, trainButton;

// Varijable igre
let dodged; // izbjegnuto
let hiScore = 0; // ukupno bodova
let ship, meteors, stars; // brodova, meteora, zvijezda

var audio=document.getElementById("audio");
var playPauseBTN=document.getElementById("playPauseBTN");
var count=0;

document.addEventListener("keydown", keydownHandler);



// postavljanje povrsine za crtanje (platno ili canvas)
function setup() {
    const canvas = createCanvas(640, 480);
    background(0);
    noStroke(30);
    select('#canvas').child(canvas);
    
    // Kamera
    video = createCapture(VIDEO, () => {
        console.log('Video spreman');
    });
    video.hide();

    // Ucitavamo model
    const mobileNet = ml5.featureExtractor('MobileNet', () => {
        console.log('MobileNet spreman');
    });
    regressor = mobileNet.regression(video, () => {
        console.log('Model spreman');
    })

    // Botuni
    const buttonDiv = select('#buttons');
    
    leftButton = createButton('Idi lijevo');
    leftButton.parent(buttonDiv);
    leftButton.mouseClicked(() => {
        regressor.addImage(-1)
    });
    
    centerButton = createButton('Ne mici se');
    centerButton.parent(buttonDiv);
    centerButton.mouseClicked(() => {
        regressor.addImage(0)
    });
    
    rightButton = createButton('Idi desno');
    rightButton.parent(buttonDiv);
    rightButton.mouseClicked(() => {
        regressor.addImage(1)
    });
 

    trainButton = createButton('Uvjezbaj');
    select('#train').child(trainButton);
    trainButton.mouseClicked(() => {
        select('#info').html('Uvjezbavam - molim pricekajte');
        const audioPlayer = document.getElementById("audioPlayer");
        audioPlayer.play();
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const texts=document.querySelector('.texts')
        
        const recognition = new window.SpeechRecognition();
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognition.continuous = true;
        recognition.interimResults = true;
    
        const p = document.createElement("p");
    
        recognition.addEventListener("end", () => {
            recognition.start();
        });
    
        recognition.start();
    
        regressor.train((loss) => {
            if (loss === null) {
                console.log("Uvjezbavanje zavrseno");
                setInterval(updatePrediction, 200);
                changeState(1);
                document.addEventListener('keydown', keyPressed);

                recognition.addEventListener("result", (e) => {
                    const text = Array.from(e.results)
                        .map(result => result[0])
                        .map(result => result.transcript)
                        .join('');
                    //p.innerText = text;
                    texts.appendChild(p);
                    if(text.includes("left")){
                        console.log("Lijevo")
                        ship.updateZvukL();
                    }
                    if(text.includes("right")){
                        console.log("Desno")
                        ship.updateZvukD();
                    }
                    if(text.includes("stop")){
                        console.log("Ugasena muzika")
                        audioPlayer.pause();
                    }
                    if(text.includes("play")){
                        console.log("Upaljena muzika")
                        audioPlayer.play();
                    }

                });
            }
            console.log(loss);
        });
    
        function keyPressed(event) {
            if (event.key === "a") {
                ship.updateZvukLT();
            }
            if (event.key === "d") {
                ship.updateZvukDT();
            }
        }
    });
    

    changeState(0);
    
}

function keyPressed() {
    if (key === ' ' && gameState === 2) {
        changeState(1);
    }
    
}


function draw() {
    if (gameState === 0) {
        trainNetwork();
    }
    if (gameState === 1) {
        gameLoop();
    }
    if (gameState === 2) {
        gameOver();
    }
}

function changeState(state) {
    gameState = state;
    
    if (state === 0) {
        select('#info').html('Dodajte slike koje ce pokretati brod. Pritisnite uvjezbajte kad dovrsite.');
        select('#buttons').show();
        select('#train').show();
    } else {
        select('#buttons').hide();
        select('#train').hide();
    }

    if (state === 1) {
        dodged = 0;
        ship = new Ship();
        meteors = [new Meteor()];
        makeStars();
        select('#info').html('0 meteora izbjegnuto. Ukupno bodova: ' + hiScore);
    }

    if (state === 2) {
        select('#info').html('Pritisnite razmaknicu za ponovno igranje ili recite restart');
        
    }
}






// Inicijalizacija Leap Motion kontrolera
