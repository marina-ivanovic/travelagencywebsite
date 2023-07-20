const listaKorisnika= new Object();
const listaDestinacija = new Object();
let firebaseUrl =
    "https://wd-sv6-2022-default-rtdb.europe-west1.firebasedatabase.app";
    getKorisnici(processKorisnici);
    getAgencije();
    getDestinacije(processDestinacije);



function getDestinacije(callback) {
    let request = new XMLHttpRequest();
  
    request.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          let destinacijeid = JSON.parse(this.responseText);
          for (let id in destinacijeid) {
            let destinacije = destinacijeid[id];
            listaDestinacija[id] = destinacije;
          }
          callback(listaDestinacija);
        } else {
          alert("Greska prilikom ucitavanja destinacija");
        }
      }
    }
  
    request.open('GET', firebaseUrl.concat('/destinacije.json'));
    request.send();
  }
  
function getAgencije(){
    let request = new XMLHttpRequest();

    request.onreadystatechange = function(){

        if(this.readyState==4){
            if(this.status==200){

                removeTableRows('allAgencije');

                let agencije = JSON.parse(this.responseText);

                for(let id in agencije){
                    let agencija = agencije[id];
                    appendAgencijaRow('allAgencije', id, agencija);
                }
            }else{
                alert("Greska prilikom ucitavanja agencija");
            }
        }
    }
    request.open('GET',firebaseUrl.concat('/agencije.json'));
    request.send();
}
//=====================GENERISANJE TABELE=======================
function appendAgencijaRow(tbodyId,agencijaId,agencija){
    let agencijaTr = document.createElement('tr');
    
    let nazivTd = document.createElement('td');
    nazivTd.innerText = agencija.naziv;
    agencijaTr.appendChild(nazivTd).style.fontWeight = 800;

    let adresaTd = document.createElement('td');
    adresaTd.innerText = agencija.adresa;
    agencijaTr.appendChild(adresaTd);

    let godinaTd = document.createElement('td');
    godinaTd.innerText = agencija.godina;
    agencijaTr.appendChild(godinaTd);

    let logoTd = document.createElement('td');
    logoTd.innerText = agencija.logo;
    agencijaTr.appendChild(logoTd);

    let brojTelefonaTd = document.createElement('td');
    brojTelefonaTd.innerText = agencija.brojTelefona;
    agencijaTr.appendChild(brojTelefonaTd);

    let emailTd = document.createElement('td');
    emailTd.innerText = agencija.email;
    agencijaTr.appendChild(emailTd);

    let editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.innerText = 'Izmeni';
    editBtn.setAttribute('class','izmeni');
    editBtn.addEventListener('click',function(e){
        e.preventDefault();
        showEditPage(agencija, agencijaId);
    })
    editBtn.setAttribute('data-agencijaId',agencijaId);

    let editTd = document.createElement('td');
    editTd.appendChild(editBtn);
    agencijaTr.appendChild(editTd);

    let deleteBtn = document.createElement('button');
    deleteBtn.type='button';
    deleteBtn.innerText = 'Obrisi';
    deleteBtn.setAttribute('class','obrisi');
    deleteBtn.onclick = deleteAgencijaAlert;
    deleteBtn.setAttribute('data-agencijaId',agencijaId);

    let deleteTd = document.createElement('td');
    deleteTd.appendChild(deleteBtn);
    agencijaTr.appendChild(deleteTd);

    let tbody = document.getElementById(tbodyId);
    tbody.appendChild(agencijaTr);
}
//====================IZMENA AGENCIJE=======================
function showEditPage(agencija,agencijaId){
    document.getElementById("updateForma").style.display="flex";
    let editForm = document.getElementById('updateForma');
    
    setFormData(agencija);

    editForm.addEventListener('submit',function(e){

        e.preventDefault();

        let naziv = document.getElementById('naziv').value.trim();
        let brojTelefona = document.getElementById('brojTelefona').value.trim();
        let adresa = document.getElementById('adresa').value.trim();
        let logo = document.getElementById('logo').value.trim();
        let godina = document.getElementById('godina').valueAsNumber;
        let destinacijaNaziv = document.getElementById('destNaziv').value;
        let destinacijaSlika = document.getElementById('destSlika').value;
        let email = document.getElementById('emailAg').value.trim();

        var br = validacijaIzmena(agencija,naziv,brojTelefona,adresa,logo,godina,email,destinacijaNaziv,destinacijaSlika);

        if(br){
            let putRequest = new XMLHttpRequest();

        putRequest.onreadystatechange = function(e){

            if(this.readyState==4){
                if(this.status==200){
                    closeUpdate();
                    openUspesnaIzmena();
                }else{
                    alert("Greska prilikom izmene agencije");
                }
              }
        }
        putRequest.open('PUT',firebaseUrl.concat('/agencije/',agencijaId,'.json'));
        putRequest.send(JSON.stringify(agencija))
        }

    })
  }

function setFormData(agencija){
    let btnDelDest = document.getElementById('obrisiDest');
    btnDelDest.addEventListener('click',function(e){
        e.preventDefault();
        let selected = document.getElementById('destinacije');
        let izbor = selected.options[selected.selectedIndex].value;
        if(izbor!=='default'){
            btnDelDest.setAttribute('dest-id',izbor);
            btnDelDest.setAttribute('podgrupa',agencija.destinacije);
            deleteDestinacija(this);
        }
    })
    const glavni = document.getElementById('destinacije');
    glavni.innerHTML = '';
    const drop = document.createElement('option');
    drop.value='default';
    drop.innerHTML = 'Izaberite destinaciju';
    drop.setAttribute('id','default');
    glavni.appendChild(drop);
    let dest = listaDestinacija[agencija.destinacije];
    for(d in dest){
        generisiSelect(d,dest[d]);
    }
    
    let nazivInput = document.getElementById('naziv');
    nazivInput.value=agencija.naziv;

    let brojTelefonaInput = document.getElementById('brojTelefona');
    brojTelefonaInput.value=agencija.brojTelefona;

    let adresaInput = document.getElementById('adresa');
    adresaInput.value=agencija.adresa;

    let logoInput = document.getElementById('logo');
    logoInput.value=agencija.logo;

    let godinaInput = document.getElementById('godina');
    godinaInput.value=agencija.godina;

    let emailInput = document.getElementById('emailAg');
    emailInput.value=agencija.email;

    validacijaIzmena(agencija,nazivInput.value,brojTelefonaInput.value,adresaInput.value,logoInput.value,godinaInput.value,emailInput.value,"","");
}
function generisiSelect(id,destinacija){
    const glavni = document.getElementById('destinacije');
    const drop = document.createElement('option');
    drop.setAttribute('id',id);
    drop.value=id;
    drop.innerHTML = destinacija.naziv;

    glavni.appendChild(drop);
}
//=======================VALIDACIJA AGENCIJE===============================
function validacijaIzmena(agencija,naziv,brojTelefona,adresa,logo,godina,email,destinacijaNaziv,destinacijaSlika){
    var br = true;
    if (naziv===""){
        document.getElementById("nazivVal").style.display="block";
        br=false;
    }
    else{
        agencija.naziv=naziv;
        document.getElementById("nazivVal").style.display="none";
    }
    regex = /^[0-9]{3}[/][0-9]{4}[-\s\.][0-9]{5,7}$/;
    if (brojTelefona.match(regex)){
        agencija.brojTelefona = brojTelefona;
        document.getElementById("brtelVal").style.display="none";
    }
    else{
        document.getElementById("brtelVal").style.display="block";
        br=false;
    }

    if (adresa===""){
        document.getElementById("adrVal").style.display="block";
        br = false;
    }
    else{
        agencija.adresa=adresa;
        document.getElementById("adrVal").style.display="none";
    }

    url=/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/;
    if(logo.match(url)){
        agencija.logo = logo;
        document.getElementById("logoVal").style.display="none";
    }
    else{
        document.getElementById("logoVal").style.display="block";
        br =false;
    }

    if(email.indexOf("@")<=-1){
        document.getElementById("emailValAg").style.display="block";
        br = false;
    }
    else{
        agencija.email = email;
        document.getElementById("emailValAg").style.display="none";
    }
    if (!godina){
        document.getElementById("godinaVal").style.display="block";
        br = false;
    }
    else{
        agencija.godina=godina;
        document.getElementById("godinaVal").style.display="none";
    }
    if(((destinacijaNaziv==="")&&(destinacijaSlika!==""))||((destinacijaNaziv!=="")&&(destinacijaSlika===""))){
        document.getElementById('destValNovi').style.display="block";
        br = false;
    }
    else{
        if((destinacijaNaziv==="")&&(destinacijaSlika==="")){
        }
        else if(!(destinacijaSlika.match(url))){
            document.getElementById('destValLink').style.display="block";
            br = false;
        }
        else{
            napraviDestinaciju(destinacijaNaziv,destinacijaSlika,agencija);
            document.getElementById('destValNovi').style.display="none";
            document.getElementById('destValLink').style.display="none";
        }
    }
    return br;
}
function napraviDestinaciju(naziv,slika,agencija){
    let podgrupa = agencija.destinacije;
    let dest = {
        "naziv": naziv,
        "slike": [slika]
    }

    let postRequest = new XMLHttpRequest();
    postRequest.onreadystatechange = function(){
        if(this.readyState==4){
            if (this.status==200){
            }else{
              alert('Greska prilikom dodavanja destinacije');
            }
          }
        }
      
        postRequest.open('POST',firebaseUrl.concat('/destinacije/',podgrupa,'/','.json'));
        postRequest.send(JSON.stringify(dest));
}


function deleteDestinacija(clickedBtn){
    let destinacijaId = clickedBtn.getAttribute('dest-id');
    let podgrupa = clickedBtn.getAttribute('podgrupa');
    let deleteRequest = new XMLHttpRequest();
  
    deleteRequest.onreadystatechange = function(){
  
      if(this.readyState==4){
        if (this.status==200){
            document.getElementById('destValUspesno').style.display = 'block';
        }else{
          alert('Greska prilikom brisanja agencije');
        }
      }
    }
  
    deleteRequest.open('DELETE',firebaseUrl.concat('/destinacije/',podgrupa,'/',destinacijaId,'.json'));
    deleteRequest.send();
  }
//===================BRISANJE AGENCIJE=====================
function deleteAgencijaAlert(){
    let clickedBtn = this;
    let agencijaId = clickedBtn.getAttribute('data-agencijaId');
    document.getElementById('deleteForma').style.display = "flex";
    let submit = document.getElementById('obrisiBtn');
    submit.setAttribute('data-agencijaId',agencijaId);
    submit.addEventListener('click',function(e){
        e.preventDefault();
        deleteAgencija(this);
    })
}

function deleteAgencija(clickedBtn){
    let agencijaId = clickedBtn.getAttribute('data-agencijaId');
  
    let deleteRequest = new XMLHttpRequest();
  
    deleteRequest.onreadystatechange = function(){
  
      if(this.readyState==4){
        if (this.status==200){
          window.location.href='adminagencije.html';
        }else{
          alert('Greska prilikom brisanja agencije');
        }
      }
    }
  
    deleteRequest.open('DELETE',firebaseUrl.concat('/agencije/',agencijaId,'.json'));
    deleteRequest.send();
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
                window.location.href='error.html';
            }
        }
    }
    request.open('GET',firebaseUrl.concat('/korisnici.json'));
    request.send();
}
function processKorisnici(korisnici) {
}
function processDestinacije(functdestinacije){}
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
//===============POMOCNE FUNKCIJE======================
  
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
function closeDeleteD(){
    document.getElementById('deleteFormaD').style.display ="none";
    }

function openUspesnaIzmena(){
    document.getElementById('uspesnaIzmena').style.display = "flex";
}

function closeUspesnaIzmena(){
    document.getElementById('uspesnaIzmena').style.display = "none";
    window.location.href="adminagencije.html";
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