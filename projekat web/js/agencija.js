const listaKorisnika= new Object();
const listaDestinacija = new Object();
let firebaseUrl =
    "https://wd-sv6-2022-default-rtdb.europe-west1.firebasedatabase.app";
getKorisnici(processKorisnici);
let agencijaId = getParamValue('id');
var dest = "";
getAgencije();
getDestinacije(processDestinacije);
function processDestinacije(destinacije) {}
function getAgencije(){
    let request = new XMLHttpRequest();

    request.onreadystatechange = function(){

        if(this.readyState==4){
            if(this.status==200){

                let agencije = JSON.parse(this.responseText);

                for(let id in agencije){
                    if(id===agencijaId){
                        dest = agencije[agencijaId].destinacije;
                        appendAgencija(agencije[id]);
                    }
                }
            }else{
                alert("Greska prilikom ucitavanja agencija");
                window.location.href='error.html';
            }
        }
    }
    request.open('GET',firebaseUrl.concat('/agencije.json'));
    request.send();
}
function getDestinacije(){
    let request = new XMLHttpRequest();

    request.onreadystatechange = function(){

        if(this.readyState==4){
            if(this.status==200){

                removeCardRows('destinacije-lista');

                let destinacijeid = JSON.parse(this.responseText);
                let destinacije = destinacijeid[dest];
                for(let id in destinacije){
                    let destinacija = destinacije[id];
                    listaDestinacija[id] = destinacija;
                    appendDestinacijaCard(destinacija,id);
                }
            }else{
                alert("Greska prilikom ucitavanja destinacija");
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

  function appendAgencija(agencija){
    const glavni = document.getElementById('glavni-agencija');
    const slika = document.createElement('img');
    slika.src = agencija.logo;
    const card = document.createElement('div');
    card.className = 'tekst-agencija';
    card.innerHTML = `
        <h1>${agencija.naziv}</h1>
        <p>Adresa: ${agencija.adresa}</p>
        <p>Godina formiranja: ${agencija.godina}</p>
        <p>Broj telefona: ${agencija.brojTelefona}</p>
        <p>Email adresa: ${agencija.email}</p>
    `;
    glavni.appendChild(slika);
    glavni.appendChild(card);
    
}

function appendDestinacijaCard(destinacija,id){
    const glavni = document.getElementById('destinacije-lista');

    const card = document.createElement('div');
    card.setAttribute('id',id);
    card.className = 'card';
    if (destinacija.opis ===undefined || destinacija.opis===""){
        card.innerHTML = `
        <div class="card-image">
        <img src="${destinacija.slike[0]}">
        </div>
        <div class="card-content">
        <h2 id="${id}-naziv">${destinacija.naziv}</h2>
        <div class="card-info">
            <p>...</p>
        </div>
        <button class="btn" ${`onclick="window.location.href='destinacija.html?id=${id}'"`}>Saznajte više</button>
        </div>
    `;

    }
    else{
        card.innerHTML = `
        <div class="card-image">
        <img src="${destinacija.slike[0]}">
        </div>
        <div class="card-content">
        <h2 id="${id}-naziv">${destinacija.naziv}</h2>
        <div class="card-info">
            <p>${destinacija.opis.substring(0,100)}...</p>
        </div>
        <button class="btn" ${`onclick="window.location.href='destinacija.html?id=${id}'"`}>Saznajte više</button>
        </div>
    `;
    }

    glavni.appendChild(card);
    
}
function removeCardRows(tBodyId){
    let tBody = document.getElementById(tBodyId);

    while(tBody.firstChild){
        tBody.removeChild(tBody.lastChild);
    }
}
//=================PRETRAGA=================
const pretragaInput = document.getElementById('pretraga-input-naziv');

pretragaInput.addEventListener('input', function (e) {
    e.preventDefault();
  const vrednost = e.target.value;
  applyFilters(vrednost);
});

if (document.querySelector('input[name="putovanje"]')) {
  document.querySelectorAll('input[name="putovanje"]').forEach((elem) => {
    elem.addEventListener("change", function (e) {
        e.preventDefault();
      const vrednost = pretragaInput.value;
      applyFilters(vrednost);
    });
  });
}

if (document.querySelector('input[name="prevoz"]')) {
  document.querySelectorAll('input[name="prevoz"]').forEach((elem) => {
    elem.addEventListener("change", function (e) {
        e.preventDefault();
      const vrednost = pretragaInput.value;
      applyFilters(vrednost);
    });
  });
}

function applyFilters(vrednost) {
  const putovanjeInput = document.querySelector('input[name="putovanje"]:checked');
  const prevozInput = document.querySelector('input[name="prevoz"]:checked');

  for (id in listaDestinacija) {
    const destinacija = listaDestinacija[id];
    let putovanjeFilterPassed = true;
    let prevozFilterPassed = true;
    let pretragaFilterPassed = true;

    if (putovanjeInput && putovanjeInput.value !== 'none') {
      putovanjeFilterPassed = destinacija.tip === putovanjeInput.value;
    }

    if (prevozInput && prevozInput.value !== 'none') {
      prevozFilterPassed = destinacija.prevoz === prevozInput.value;
    }

    if (vrednost) {
      pretragaFilterPassed = destinacija.naziv.toLowerCase().includes(vrednost.toLowerCase());
    }

    if (putovanjeFilterPassed && prevozFilterPassed && pretragaFilterPassed) {
      document.getElementById(id).style.display = 'flex';
      highlight(vrednost,id);
    } else {
      document.getElementById(id).style.display = 'none';
    }
  }
}
function highlight(text, id) {
    var inputText = document.getElementById(id.concat('-naziv'));
    var innerHTML = inputText.innerHTML;
    var highlightedText = '<mark>$&</mark>';

    innerHTML = innerHTML.replace(/<\/?mark>/gi, '');
  
    if (text.length > 0) {
      var regex = new RegExp(text, 'gi');
      innerHTML = innerHTML.replace(regex, highlightedText);
    }
  
    inputText.innerHTML = innerHTML;
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

function openUspesno(){
    document.getElementById('uspesnaReg').style.display = "flex";
    closeReg();
}

function closeUspesno(){
    document.getElementById('uspesnaReg').style.display = "none";
    window.location.reload();
}
function openUspesanLogin(){
    closeLogin();
    document.getElementById('uspesanLogin').style.display = "flex";
}

function closeUspesanLogin(){
    document.getElementById('uspesanLogin').style.display = "none";
}