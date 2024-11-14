// Igra se vrti u petlji, jer stalno provjeravamo i osvjezavamo stanje
function gameLoop() {
    background(0);

    // Moramo iscrtati i osvjeziti zvijezde
    stars.forEach((star) => {
        star.show(); // prikazi
        star.update(); // osvjezi
    });

    // Iscrtaj i osvjezi svemirski brod
    ship.show(); // prikazi
    ship.update(); // osvjezi
    

    // Iscrtaj i osvjezi meteore
    meteors.forEach((meteor) => {
        meteor.show();
        meteor.update();
        // Moramo provjeriti jesu li se meteor i brod sudarili, a ako jesu promijenit cemo stanje
        if (meteor.collided(ship)) {
            changeState(2); // promijeni stanje, doslo je do sudara!
            return
        }
    });
    // na slucajan nacin dodajemo nove meteore
    if (random() < 0.0001 || frameCount % 3600 === 0) {
        meteors.push(new Meteor());
    }
}