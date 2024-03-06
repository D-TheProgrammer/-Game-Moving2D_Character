// Utilisation du canvas HTML pour le fond en couleur presque blanche
let cnv = document.getElementById('monFond');
let ctx_fond = cnv.getContext('2d');
ctx_fond.imageSmoothingEnabled = false;
ctx_fond.fillStyle = "#f7f6f2";
ctx_fond.fillRect(0, 0, cnv.width, cnv.height);

//Reccuperation du canvas pour le tutoriel 
let cnv_tutoriel = document.getElementById('tutoriel');
let ctx_tutoriel = cnv_tutoriel.getContext('2d');
//Creation du texte avec la polite et la couleur
ctx_tutoriel.font = '20px Arial';
ctx_tutoriel.fillStyle = 'red';
ctx_tutoriel.fillText('Tutoriel : ', 10, 30);

//Ce texte est trop grand va falloir le decouper pour afficher 
ctx_tutoriel.fillStyle = 'green';
let texte = "Voici les Commandes pour déplacer le personnage :\n'z' ->  pour se déplacer en HAUT \n'e' -> pour se deplacer en diagonal en HAUT A DROITE  \n'd' ->  pour se déplacer a DROITE  \n'x' -> pour se deplacer en diagonal en BAS A DROITE  \n's' ->  pour se déplacer en BAS  \n'w' -> pour se deplacer en diagonal en BAS A GAUCHE  \n'q' ->  pour se déplacer a GAUCHE \n'a' -> pour se deplacer en diagonal en HAUT A GAUCHE  \n' ' cest a dire 'ESPACE' ->  POUR DANSER" ;

var x_ligne = 30; // position x des lignes de tutoriel
var y_ligne = 50; // position y des lignes de tutoriel
var hauteur_ligne = 20; //Separation des ligne 
var ligne_texte = texte.split('\n'); // Separation en liste du texte a chaque retour a la ligne

//Affiche le texte avec des retours à la ligne
for (var i = 0; i<ligne_texte.length; i++){
    ctx_tutoriel.fillText(ligne_texte[i], x_ligne, y_ligne + (i*hauteur_ligne)); 
}


//Variable utile au decors 
let positionX_fondBateau= 300; //Position initiale du bateu
let positionY1_fondPluie = -70; // Position initiale de la première image de pluie
let positionY2_fondPluie = -cnv.height; // Position initiale de la deuxième image de pluie
let largeur_bateau = 100;
let hauteur_bateau = 50;
let directionBateau = "droite";
//Pour limage de fond
let img_fond = new Image();
img_fond.src = "./assets/cuphead_background.png";

img_fond.onload = function () { 
    ctx_fond.drawImage(img_fond, 0, 0, cnv.width, cnv.height);
};

//Image de PLuie
let cnv_AnimPaysage1 = document.getElementById('AnimPaysage1');
let ctx_AnimPaysage1 = cnv_AnimPaysage1.getContext('2d');
let img_fond_AnimPay1 = new Image();
img_fond_AnimPay1.src = "./assets/pluie.png";

let cnv_AnimPaysage2 = document.getElementById('AnimPaysage1');
let ctx_AnimPaysage2 = cnv_AnimPaysage2.getContext('2d');
let img_fond_AnimPay2 = new Image();
img_fond_AnimPay2.src = "./assets/pluie.png";

img_fond_AnimPay1.onload = function () { 
    ctx_AnimPaysage1.drawImage(img_fond_AnimPay1, 0, 0, cnv.width, cnv.height);
};
img_fond_AnimPay2.onload = function () { 
    ctx_AnimPaysage2.drawImage(img_fond_AnimPay2, 0, 0, cnv.width, cnv.height);
};

//Image de Bateau
let cnv_AnimBateau = document.getElementById('bateau');
let ctx_AnimBateau = cnv_AnimBateau.getContext('2d'); 
let img_fond_AnimBateau = new Image();
img_fond_AnimBateau.src = "./assets/cuphead_bateau.png";

img_fond_AnimBateau.onload = function () { 
    ctx_AnimBateau.drawImage(img_fond_AnimBateau, positionX_fondBateau, 0, largeur_bateau, hauteur_bateau);
};


// On cree un canvas separer pour le personnage avec id HTML
let cnvPersonnage = document.getElementById('monPersonnage');
let ctxPersonnage = cnvPersonnage.getContext('2d');

// Creation des tableaux pour stocker les images du personnage
let all_img_hauGau = [];  let all_img_hau = [];  let all_img_hauDroi = [];
let all_img_Gau = [];                               let all_img_Droi = [];
let all_img_basGau = [];  let all_img_bas = [];  let all_img_basDroi = [];

// Liste des images pour lanimation de danse 
let all_img_dance = [];

let anim_id = -1;

// Variable qui vont influencer la position du perso et le fait qu'il avance dans le temps
let animationInterval;
let positionX = 200;
let positionY = 210;
let direction ="nul";
let perso_bouge = false;

// Fonction pour charger le spritesheet et le separer en image pour l'animation
function preparation_Img_Animation(src, ListeImage, nb_ligne_a_visiter, nb_image_a_recup, larg_image_gen , haut_image_gen,coorX_prem_img, coorY_prem_img, ecartX, numimageA_Sauter, sens_choix_img) {
    ListeImage.length = 0;
    let img = new Image();
    img.src = src;
    img.onload = function () { 
        // Canva Temporaire pour traiter l'image du spritesheet
        let canvas1 = document.createElement('canvas');
        canvas1.width = img.width;
        canvas1.height = img.height;
        let context1 = canvas1.getContext('2d');

        // Dessin du spritesheet sur le canvas temporaire
        context1.drawImage(img, 0, 0, img.width, img.height);

        for (let j = 0; j < nb_ligne_a_visiter; j += 1) { //  boucle pour parcourir un nb de lignes du spritesheet
            let imax = nb_image_a_recup; // le nombre d'images quon veut par ligne
            
            for (let i = 0; i < imax; i += 1) {
                if (i != numimageA_Sauter ){             
                    // On obtient les données de chaque image du perso dans le spritesheet
                    let canvasImageData1 = context1.getImageData(coorX_prem_img, coorY_prem_img , larg_image_gen, haut_image_gen);
                    let canvas2 = document.createElement('canvas');
                    canvas2.width = larg_image_gen;
                    canvas2.height = haut_image_gen; //Largeur Hauteur du Canvas choisi 

                    let context2 = canvas2.getContext('2d');
                    context2.putImageData(canvasImageData1, 0, 0);
                    ListeImage.push(canvas2); //On ajoute limage dans la liste
                }
                // Met ajour la valeur de coorX_prem_img pour l'espacement entre les iages
                if (sens_choix_img == "versLaDroite"){
                    coorX_prem_img += ecartX;
                }    
                else{
                    coorX_prem_img -= ecartX;
                }     
            }
        }
    };
}

// Appel de la fonction pour charger et traiter l'image
//HAUT
preparation_Img_Animation(
    "./assets/spritesheet/spritesheet_cuphead.png", 
    all_img_hau, // Tableau pour stozcker les images
    1, // Nb de lignes à visiter (nb_ligne_a_visiter)
    13, // Nb d'images à récupérer par ligne (nb_image_a_recup)
    68, // Largeur de l'image generée
    96, // Hauteur de l'image 
    428, // Coordonnee X  de la première image (coorX_prem_img)
    9, // Coordonnee Y  de la première image (coorY_prem_img)
    103, // Ecart entre les images (ecartX)
    -1, // Si besoin Numéro de l'image à sauter (numimageA_Sauter)
    "versLaDroite" // Prend sur la spritesheet les images les unes apres les autres vers la droite ou la gauche (sens_choix_img)
);

//HAUT DROITE
preparation_Img_Animation("./assets/spritesheet/spritesheet_cuphead.png", 
    all_img_hauDroi, 1, 12, 68, 96, 325, 120, 103, -1, "versLaDroite" );

//DROITE
preparation_Img_Animation( "./assets/spritesheet/spritesheet_cuphead.png", 
    all_img_Droi, 1, 12, 68, 96, 220, 345, 103, 1 , "versLaDroite" );

//BAS DROITE
preparation_Img_Animation( "./assets/spritesheet/spritesheet_cuphead.png", 
    all_img_basDroi, 1, 13, 68, 99, 425, 460, 103, -1 , "versLaDroite" );

// BAS
preparation_Img_Animation( "./assets/spritesheet/spritesheet_cuphead.png", 
    all_img_bas, 1, 13, 68, 100, 23, 683, 103, 1, "versLaDroite" );

// BAS-GAUCHE
preparation_Img_Animation( 
    "./assets/spritesheet/spritesheet_cuphead0_renverser.png", 
    all_img_basGau, 1, 13, 68, 99, 1150, 460, 103, -1 , 
    "versLaGauche" );

// GAUCHE
preparation_Img_Animation( "./assets/spritesheet/spritesheet_cuphead0_renverser.png", 
    all_img_Gau, 1, 12, 68, 99, 1360, 345, 103, -1, "versLaGauche" );

// HAUT-GAUCHE
preparation_Img_Animation( "./assets/spritesheet/spritesheet_cuphead0_renverser.png", 
    all_img_hauGau, 1, 12, 68, 96, 1260, 120, 103, -1, "versLaGauche" );

// ANIMATION DANSE JOIE 
preparation_Img_Animation( "./assets/spritesheet/spritesheet_cuphead.png", 
    all_img_dance, 1, 10, 99, 110, 4, 790, 103, 1,
    "versLaDroite" );


let ImageCharger = all_img_hau; // De base on utilise les images pour le haut


// Fonction pour mettre à jour le canvas du personnage
function update() {
    ctxPersonnage.clearRect(0, 0, cnv.width, cnv.height); // Efface tout le canvas
    
    if (positionX >= cnv.width) {
        positionX = 0; // Si le perso arrive en bord de canvas
    }
    if (positionY >= cnv.height) {
        positionY = 0; 
    }
    if (positionX < 0) {
        positionX = cnv.width; 
    }
    if (positionY < 0) {
        positionY = cnv.height; 
    }
    switch (direction) {
        case "haut" :
            positionY -=10;
            break;
        case "haut-droite":
            positionY -=7;
            positionX += 7;
            break;
        case "droite":
            positionX += 10;
            break;
        case "bas-droite":
            positionX += 7;
            positionY +=7;
            break;
        case "bas":
            positionY += 10;
            break;    
        case "bas-gauche":
            positionX -= 7;
            positionY +=7;
            break;
        case "gauche":
            positionX -= 10;
            break;
        case "haut-gauche":
            positionY -=7;
            positionX -= 7;
            break;
        case "rien":
            break;
    }

    // dessine l'image à la position X et Y
    if (anim_id >= 0) {
        ctxPersonnage.drawImage(ImageCharger[anim_id], positionX, positionY);
        anim_id += 1;
        if (anim_id == ImageCharger.length - 1) { anim_id = 0; }
    }
}


function update_pluie() {

    cnv_AnimPaysage1.width = cnv.width;
    cnv_AnimPaysage1.height = cnv.height;
    
    cnv_AnimPaysage2.width = cnv.width;
    cnv_AnimPaysage2.height = cnv.height;
    
    // Efface les canvas
    ctx_AnimPaysage1.clearRect(0, 0, cnv_AnimPaysage1.width, cnv_AnimPaysage1.height);
    ctx_AnimPaysage2.clearRect(0, 0, cnv_AnimPaysage2.width, cnv_AnimPaysage2.height);

    // Dessine l'image de la pluie
    ctx_AnimPaysage1.drawImage(img_fond_AnimPay1, 0, positionY1_fondPluie, cnv_AnimPaysage1.width, cnv_AnimPaysage1.height);
    ctx_AnimPaysage2.drawImage(img_fond_AnimPay2, 0, positionY2_fondPluie, cnv_AnimPaysage2.width, cnv_AnimPaysage2.height);

    if (positionY1_fondPluie >= cnv_AnimPaysage1.height) {
        positionY1_fondPluie = -cnv_AnimPaysage1.height;
    }
    
    if (positionY2_fondPluie >= cnv_AnimPaysage2.height) {
        positionY2_fondPluie = -cnv_AnimPaysage2.height;
    }

    //Fais descendre la pluie
    positionY1_fondPluie += 10;
    positionY2_fondPluie += 10;
}


function update_bateau() {
    // Efface les canvas
    ctx_AnimBateau.clearRect(0, 0, cnv_AnimBateau.width, cnv_AnimBateau.height); // Efface le canvas du bateau
    
    //Dessine le bateau
    ctx_AnimBateau.drawImage(img_fond_AnimBateau, positionX_fondBateau, 0, largeur_bateau, hauteur_bateau);

    
    // Fais bouger le bateau de droite à gauche
    if (directionBateau === "droite") {
        positionX_fondBateau += 10;
        // Si le bateau atteint le bord droit  on change la direction
        if (positionX_fondBateau  > cnv_AnimPaysage1.width) {
            directionBateau = "gauche";
        }
    } else if (directionBateau === "gauche") {
        positionX_fondBateau -= 10;
        // Si le bateau atteint le bord gauche  on change la direction
        if (positionX_fondBateau < 0) {
            directionBateau = "droite";
        }
    }
}


// Fonction pour demarrer l'animation ESPACE
function animationDanse() {
    ImageCharger = all_img_dance; // On utilise les images de l'animation "ESPACE"
    startAnimation();
}

// Fonction demarrer les animation de marche
function startAnimation() {
    if (perso_bouge == false) {
        if (anim_id < 0) {
            perso_bouge = true;
            anim_id = 0;
            animationInterval = setInterval(update, 80);
        }
    }
}

//Fonction pour arreter l'animation du personnage 
function stopAnimation() {
    clearInterval(animationInterval);
    perso_bouge = false;
    anim_id = -1;
}

//Gestion des boutons enfoncé
function keydown_fun(e) {
    let key = e.key.toLowerCase(); // Pour Convertir la touche en minuscules
    switch (key) {
        case "z":
            direction = "haut";
            ImageCharger = all_img_hau; // On Utilise all_img_HAU pour les déplacements vers le haut
            startAnimation();
            break;
        
        case "e":
            direction = "haut-droite";
            ImageCharger = all_img_hauDroi; 
            startAnimation();
            break;

        case "d":
            direction = "droite";
            ImageCharger = all_img_Droi;
            startAnimation();
            break;

        case "x":
            direction = "bas-droite";
            ImageCharger = all_img_basDroi; 
            startAnimation();
            break;

        case "s":
            direction = "bas";
            ImageCharger = all_img_bas; 
            startAnimation();
            break;

        case "w":
            direction = "bas-gauche";
            ImageCharger = all_img_basGau; 
            startAnimation();
            break;

        case "q":
            direction = "gauche";
            ImageCharger = all_img_Gau; 
            startAnimation();
            break;
        
        case "a":
            direction = "haut-gauche";
            ImageCharger = all_img_hauGau; 
            startAnimation();
            break;

        //Touche Espace
        case " ":
            direction = "rien";
            ImageCharger = all_img_dance; 
            startAnimation();
            break;
    }
}

//Gestion des boutons relacher 
function keyup_fun(e) {
    let key = e.key.toLowerCase(); // pour convertir la touche en minuscules
    switch (key) {
        case "z":
        case "e" :
        case "d":
        case "x" :
        case "s" :
        case "w" :
        case "q":
        case "a":
            stopAnimation();
            break;
        case " ":
            animationDanse();
            break;
    }
}

// On appel la fonction pour l'animation ESPACE dès que la page se charge
window.addEventListener('load', animationDanse);


window.addEventListener('keydown', keydown_fun, false);
window.addEventListener('keyup', keyup_fun, false);


setInterval(update_pluie, 20);
setInterval(update_bateau, 50); //car le bateau est plus lent 