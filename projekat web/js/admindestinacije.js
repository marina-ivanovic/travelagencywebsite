const listaKorisnika= new Object();
let firebaseUrl =
    "https://wd-sv6-2022-default-rtdb.europe-west1.firebasedatabase.app";
    getKorisnici(processKorisnici);
    getDestinacije();




function getDestinacije(){
    let request = new XMLHttpRequest();

    request.onreadystatechange = function(){

        if(this.readyState==4){
            if(this.status==200){

                removeTableRows('allDestinacije');

                let destinacije = JSON.parse(this.responseText);

                for(let podgrupe in destinacije){
                    let grupe = destinacije[podgrupe];
                    for(let id in grupe){
                        let destinacija = grupe[id];
                        appendDestinacijaRow('allDestinacije', podgrupe,id, destinacija);
                    }
                }
            }else{
                alert("Greska prilikom ucitavanja destinacija");
            }
        }
    }
    request.open('GET',firebaseUrl.concat('/destinacije.json'));
    request.send();
}
//===================GENERISANJE TABELE========================
function appendDestinacijaRow(tbodyId,podgrupeId, destinacijaId,destinacija){
    let destinacijaTr = document.createElement('tr');
    
    let nazivTd = document.createElement('td');
    nazivTd.innerText = destinacija.naziv;
    destinacijaTr.appendChild(nazivTd).style.fontWeight = 800;

    let opisTd = document.createElement('td');
    let skraceniOpis;
    if(destinacija.opis===undefined){
        skraceniOpis = '';
    }
    else{
        skraceniOpis = destinacija.opis.substring(0,100);
        opisTd.innerText = skraceniOpis.concat('...');
    }
    destinacijaTr.appendChild(opisTd);

    let slikeTd = document.createElement('td');
    slikeTd.innerText = destinacija.slike;

    destinacijaTr.appendChild(slikeTd);

    let tipTd = document.createElement('td');
    if(destinacija.tip===undefined){
        tipTd.innerText = '';
    }
    else{
        tipTd.innerText = destinacija.tip;
    }
    destinacijaTr.appendChild(tipTd);

    let prevozTd = document.createElement('td');
    if(destinacija.prevoz===undefined){
        prevozTd.innerText = '';
    }
    else{
        prevozTd.innerText = destinacija.prevoz;
    }
    destinacijaTr.appendChild(prevozTd);

    let maxOsobaTd = document.createElement('td');
    if(destinacija.maxOsoba===undefined){
        maxOsobaTd.innerText = '';
    }
    else{
        maxOsobaTd.innerText = destinacija.maxOsoba;
    }
    destinacijaTr.appendChild(maxOsobaTd);

    let cenaTd = document.createElement('td');
    if(destinacija.cena===undefined){
        cenaTd.innerText = '';
    }
    else{
        cenaTd.innerText = destinacija.cena;
    }
    destinacijaTr.appendChild(cenaTd);

    let editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.innerText = 'Izmeni';
    editBtn.setAttribute('class','izmeni');
    editBtn.addEventListener('click',function(e)
    {
        e.preventDefault();
        showEditPage(destinacija,podgrupeId, destinacijaId);
    })
    editBtn.setAttribute('data-destinacijaId',destinacijaId);

    let editTd = document.createElement('td');
    editTd.appendChild(editBtn);
    destinacijaTr.appendChild(editTd);

    let deleteBtn = document.createElement('button');
    deleteBtn.type='button';
    deleteBtn.innerText = 'Obrisi';
    deleteBtn.setAttribute('class','obrisi');
    deleteBtn.onclick = deleteDestinacijaAlert;
    deleteBtn.setAttribute('data-destinacijaId',destinacijaId);

    let deleteTd = document.createElement('td');
    deleteTd.appendChild(deleteBtn);
    destinacijaTr.appendChild(deleteTd);

    let tbody = document.getElementById(tbodyId);
    tbody.appendChild(destinacijaTr);
}
//===========IZMENA DESTINACIJE (nije implementirana)==============
function showEditPage(destinacija){
    document.getElementById("updateForma").style.display="flex";
    
    setFormData(destinacija);
  }

function setFormData(destinacija){
    let nazivInput = document.getElementById('naziv');
    nazivInput.value=destinacija.naziv;

    let opisInput = document.getElementById('opis');
    opisInput.value=destinacija.opis;

    
    let slikeInput = document.getElementById('slike');
    slikeInput.value=destinacija.slike;

    let tipInput = document.getElementById('tip');
    tipInput.value=destinacija.tip;

    let prevozInput = document.getElementById('prevoz');
    prevozInput.value=destinacija.prevoz;

    let maxOsobaInput = document.getElementById('maxOsoba');
    maxOsobaInput.value=destinacija.maxOsoba;

    let cenaInput = document.getElementById('cena');
    cenaInput.value=destinacija.cena;
}

//========BRISANJE DESTINACIJE(nije trazeno u spesifikaciji, pa nije funkcionalno)=========
function deleteDestinacijaAlert(){
    document.getElementById('deleteForma').style.display = "flex";
}

function removeTableRows(tBodyId){
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
    window.location.href="admindestinacije.html";
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