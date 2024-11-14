// U ovom dijelu definiramo kako cemo zavrsiti igru
function gameOver() {
    background(0);

    // Crtamo i osvjezavamo zvijezde
    stars.forEach((star) => {
        star.show();
        star.update();
    });

    // Crtamo, pokazujemo, brodove
    ship.show();
    
    // i meteore
    meteors.forEach((meteor) => {
        meteor.show();
    });
    
    textAlign(CENTER);
    textSize(64);
    fill(255);
    stroke(0, 200, 0);
    text('Kraj igre', width / 2, height / 2);
}