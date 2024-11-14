// u ovom dijelu uvjezbavamo neuronsku mrezu
function trainNetwork() {
    // kamera nas vidi zrcalno, pa cemo koristiti trik i zrcaliti sliku da bi nam lijevo i desno bilo prirodno
    translate(width, 0);
    scale(-1.0, 1.0);
    image(video, 0, 0, width, height);
}
// moramo dobiti sto je mreza predvidjela za ulaz
function updatePrediction() {
    regressor.predict((err, camInput) => {
        if (err) {
            console.log('Error: ' + err);
        }
        currentPrediction = camInput;
    });
}