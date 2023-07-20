const listaKorisnika= new Object();
let firebaseUrl =
    "https://wd-sv6-2022-default-rtdb.europe-west1.firebasedatabase.app";
getKorisnici(processKorisnici);
let dest = getParamValue('id');
getDestinacije();

function getDestinacije(){
    let request = new XMLHttpRequest();

    request.onreadystatechange = function(){

        if(this.readyState==4){
            if(this.status==200){

                let destinacije = JSON.parse(this.responseText);
                for(let podgrupa in destinacije){
                    for(let id in destinacije[podgrupa]){
                        if(id===dest){
                            appendDestinacija(destinacije[podgrupa][id]);
                            slajdInicijalizacija();
                        }
                    }
                }
            }else{
                alert("Greska prilikom ucitavanja destinacija");
                window.location.href='error.html';
            }
        }
    }
    request.open('GET',firebaseUrl.concat('/destinacije.json'));
    request.send();
}
function getParamValue(name) {
    let location = decodeURI(window.location.toString());
    let index = location.indexOf("?") + 1;
    let subs = location.substring(index, location.length);
    let splitted = subs.split("&");

    for (i = 0; i < splitted.length; i++) {
      let s = splitted[i].split("=");
      let pName = s[0];
      let pValue = s[1];
      if (pName == name) {
        return pValue;
      }
    }
  }

  function appendDestinacija(destinacija){
    const glavni = document.getElementById('glavni-agencija');
    const slika = document.createElement('img');
    slika.src = destinacija.slike[0];
    const card = document.createElement('div');
    card.className = 'tekst-agencija';
    card.innerHTML = `
        <h1>${destinacija.naziv}</h1>
        <p>${destinacija.opis}</p>
        <p>Cena: ${destinacija.cena}</p>
        <p>Tip: ${destinacija.tip}</p>
        <p>Prevoz: ${destinacija.prevoz}</p>
        <p>Max osoba: ${destinacija.maxOsoba}</p>
    `;
    let slike = destinacija.slike;
    for (id in slike){
        appendDestinacijaSlike(destinacija,id);
    }
    glavni.appendChild(slika);
    glavni.appendChild(card);

    
}

function appendDestinacijaSlike(destinacija,id){
    const glavni = document.getElementById('galerija');
    const slajd = document.createElement('div');
    slajd.className = 'slajd';
    slajd.innerHTML = `
            <img src=${destinacija.slike[id]}>
    `;
    glavni.appendChild(slajd);
}

function removeCardRows(tBodyId){
    let tBody = document.getElementById(tBodyId);

    while(tBody.firstChild){
        tBody.removeChild(tBody.lastChild);
    }
}

//=================LOGIN KORISNIKA=================
let loginPageLoaded = false;

function openLogin() {
    document.getElementById("loginForma").style.display = "flex";
    if (!loginPageLoaded) {
        showLoginPage();
        loginPageLoaded = true;
      }
    }
    

function showLoginPage(){
    let loginForm = document.getElementById('loginForma');

    loginForm.addEventListener('submit',function(e){

        e.preventDefault();
        let user = document.getElementById('usernameLogin').value.trim();
        let lozinka = document.getElementById('passwordLogin').value.trim();

        var br = true;
        var username ="";
        var password ="";
        for (id in listaKorisnika){
            if (listaKorisnika[id].korisnickoIme===user){
                username=user;
                password = listaKorisnika[id].lozinka;
                break;
            }

        }
        if(username===""){
            document.getElementById("userValLogin").style.display="block";
            br=false;
        }
        else if((username.length<3)||(username.length>20)){
            document.getElementById("userValLogin").style.display="block";
            br=false;
        }
        else{
            document.getElementById("userValLogin").style.display="none";
        }
    
        if (lozinka===""){
            document.getElementById("passValLogin").style.display="block";
            br=false;
        }
        else if((lozinka.length<8)){
            document.getElementById("passValLogin").style.display="block";
            br=false;
        }
        else if(!(lozinka===password)){
            document.getElementById("passValLogin").style.display="block";
            br=false;
        }
        else{
            document.getElementById("passValLogin").style.display="none";
        }
        if (br){
            closeLogin();
            openUspesanLogin();
        }

    })
  }
//=================REGISTRACIJA KORISNIKA=================
function getKorisnici(callback){
    let request = new XMLHttpRequest();
    let korisnici;
    request.onreadystatechange = function(){

        if(this.readyState==4){
            if(this.status==200){


                korisnici = JSON.parse(this.responseText);

                for(let id in korisnici){
                    let korisnik = korisnici[id];
                    listaKorisnika[id]=korisnik;
                }
                callback(listaKorisnika);
            }else{
                alert("Greska prilikom ucitavanja korisnika");
            }
        }
    }
    request.open('GET',firebaseUrl.concat('/korisnici.json'));
    request.send();
}
function processKorisnici(korisnici) {
}

let regPageLoaded = false;

    function openReg() {
        closeLogin();
        document.getElementById("registracijaForma").style.display = "flex";
        if (!regPageLoaded) {
            showRegPage();
            regPageLoaded = true;
          }
        }
    
    function showRegPage(){
        let regForm = document.getElementById('registracijaForma');
    
        regForm.addEventListener('submit',function(e){
    
            e.preventDefault();
            let username = document.getElementById('username').value.trim();
            let email = document.getElementById('email').value.trim();
            let lozinka = document.getElementById('password').value.trim();
            let ime = document.getElementById('ime').value.trim();
            let prezime = document.getElementById('prezime').value.trim();
            let datum = document.getElementById('datum').value.trim();
            let adresa = document.getElementById('ulica').value.trim().concat(',',document.getElementById('mesto').value.trim(),',',document.getElementById('postanski').value.trim());
            let brojTelefona = document.getElementById('brTel').value.trim();
            var br = validacijaRegistracija(ime,prezime,username,email,lozinka,datum,adresa,brojTelefona);
            
            if(br){
                let korisnik= {
                    "korisnickoIme": username,
                    "lozinka": lozinka,
                    "ime": ime,
                    "prezime": prezime,
                    "email": email,
                    "datumRodjenja": datum,
                    "adresa": adresa,
                    "telefon": brojTelefona
                }
    
                let putRequest = new XMLHttpRequest();
    
                putRequest.onreadystatechange = function(e){
    
                    if(this.readyState==4){
                        if(this.status==200){
                            openUspesno();
                        }else{
                        alert("Greska prilikom dodavanja korisnika");
                        }
                    }
                }
                putRequest.open('POST',firebaseUrl.concat('/korisnici/.json'));
                putRequest.send(JSON.stringify(korisnik))
            }
    
        })
      }
    
  function validacijaRegistracija(ime,prezime,username,email,lozinka,datum,adresa,brojTelefona){
    var br = true;
    if (ime===""){
        document.getElementById("imeVal").style.display="block";
        br=false;
    }
    else{
        document.getElementById("imeVal").style.display="none";
    }
    if (prezime===""){
        document.getElementById("prezimeVal").style.display="block";
        br=false;
    }
    else{
        document.getElementById("prezimeVal").style.display="none";
    }
    for (id in listaKorisnika){
        if (listaKorisnika[id].korisnickoIme===username){
            document.getElementById("userValIsti").style.display="block";
            br=false;
            break;
        }
    }
    if (username===""){
        document.getElementById("userVal").style.display="block";
        br=false;
    }
    else if((username.length<3)||(username.length>20)){
        document.getElementById("userVal").style.display="block";
        br=false;
    }
    if(br){
        document.getElementById("userValIsti").style.display="none";
        document.getElementById("userVal").style.display="none";
    }

    if (lozinka===""){
        document.getElementById("passVal").style.display="block";
        br=false;
    }
    else if((lozinka.length<8)){
        document.getElementById("passVal").style.display="block";
        br=false;
    }
    else{
        document.getElementById("passVal").style.display="none";
    }

    let datereg = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
    if(datum.match(datereg)){
        document.getElementById("datumVal").style.display="none";
    }
    else{
        document.getElementById("datumVal").style.display="block";
        br=false;
    }
    let podaci = adresa.split(',');
    if (podaci[0]===""||podaci[1]===""||podaci[2]===""){
        document.getElementById("adresaVal").style.display="block";
        br = false;
    }
    else if(!podaci[2].trim().match(/^\d{5}$/)){
        document.getElementById("adresaVal").style.display="block";
        br = false;
    }
    else{
        document.getElementById("adresaVal").style.display="none";
    }
    let emailreg =/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;

    if(email.match(emailreg)){
        document.getElementById("emailVal").style.display="none";
    }
    else{
        document.getElementById("emailVal").style.display="block";
        br = false;
    }
    var phonereg =/^[0-9]{9}$/;
    if(brojTelefona.match(phonereg)){
        document.getElementById('telVal').style.display = "none";
    }
    else{
        document.getElementById("telVal").style.display="block";
        br = false;
    }
    return br;
}
//====================POMOCNE FUNKCIJE======================
  
function closeLogin() {
document.getElementById("loginForma").style.display = "none";
}
function otvoriNav(){
    if (document.getElementById("responsive-nav-id").style.display == "block"){
      document.getElementById("responsive-nav-id").style.display = "none";
    }
    else{
      document.getElementById("responsive-nav-id").style.position = "fixed";
      document.getElementById("responsive-nav-id").style.display = "block";
    }

  }

function closeReg() {
document.getElementById("registracijaForma").style.display = "none";
}

function openDropdown() {
    if(document.getElementById("dropdown-admin").style.display == "block"){
    document.getElementById("dropdown-admin").style.display = "none";
    }
    else{
    document.getElementById("dropdown-admin").style.display = "block";
    }
}
function openDropdown2() {
    if(document.getElementById("dropdown-admin2").style.display == "block"){
    document.getElementById("dropdown-admin2").style.display = "none";
    }
    else{
    document.getElementById("dropdown-admin2").style.display = "block";
    }
}
function closeUpdate(){
    document.getElementById("updateForma").style.display="none";
}

function closeDelete(){
    document.getElementById('deleteForma').style.display ="none";
  }

function openUspesnaIzmena(){
    document.getElementById('uspesnaIzmena').style.display = "flex";
}

function closeUspesnaIzmena(){
    document.getElementById('uspesnaIzmena').style.display = "none";
    window.location.reload();
}
function openUspesno(){
    document.getElementById('uspesnaReg').style.display = "flex";
}

function closeUspesno(){
    document.getElementById('uspesnaReg').style.display = "none";
    window.location.reload();
}
function openUspesanLogin(){
    document.getElementById('uspesanLogin').style.display = "flex";
}

function closeUspesanLogin(){
    document.getElementById('uspesanLogin').style.display = "none";
}
let slideIndex = 0;
function slajdInicijalizacija(){
    showSlides(slideIndex);
}

function promeniSlajd(n) {
  showSlides(slideIndex += n);
}

function trenutan(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  const slides = document.getElementsByClassName("slajd");
  if (n >= slides.length) { slideIndex = 0; }
  if (n < 0) { slideIndex = slides.length - 1; }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex].style.display = "block";
}
