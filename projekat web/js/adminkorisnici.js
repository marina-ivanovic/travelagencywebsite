const listaKorisnika= new Object();
let firebaseUrl =
    "https://wd-sv6-2022-default-rtdb.europe-west1.firebasedatabase.app";
    getKorisnici(processKorisnici);
function getKorisnici(callback){
    let request = new XMLHttpRequest();
    let korisnici;
    request.onreadystatechange = function(){

        if(this.readyState==4){
            if(this.status==200){

                removeTableRows('allKorisnici');

                korisnici = JSON.parse(this.responseText);

                for(let id in korisnici){
                    let korisnik = korisnici[id];
                    listaKorisnika[id]=korisnik;
                    appendKorisnikRow('allKorisnici', id, korisnik);
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
function processKorisnici(korisnici) {}
//==================GENERISANJE TABELE========================
function appendKorisnikRow(tbodyId,korisnikId,korisnik){
    let korisnikTr = document.createElement('tr');

    let usernameTd = document.createElement('td');
    usernameTd.innerText = korisnik.korisnickoIme;
    korisnikTr.appendChild(usernameTd).style.fontWeight = 800;

    let emailTd = document.createElement('td');
    emailTd.innerText = korisnik.email;
    korisnikTr.appendChild(emailTd);

    let lozinkaTd = document.createElement('td');
    lozinkaTd.innerText = korisnik.lozinka;
    korisnikTr.appendChild(lozinkaTd);

    let imeTd = document.createElement('td');
    imeTd.innerText = korisnik.ime;
    korisnikTr.appendChild(imeTd);

    let prezimeTd = document.createElement('td');
    prezimeTd.innerText = korisnik.prezime;
    korisnikTr.appendChild(prezimeTd);

    let datumTd = document.createElement('td');
    datumTd.innerText = korisnik.datumRodjenja;
    korisnikTr.appendChild(datumTd);

    let adresaTd = document.createElement('td');
    adresaTd.innerText = korisnik.adresa;
    korisnikTr.appendChild(adresaTd);

    let brojTelefonaTd = document.createElement('td');
    brojTelefonaTd.innerText = korisnik.telefon;
    korisnikTr.appendChild(brojTelefonaTd);

    let editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.innerText = 'Izmeni';
    editBtn.setAttribute('class','izmeni');
    editBtn.addEventListener('click',function(e){
        e.preventDefault();
        showEditPage(korisnik, korisnikId);
    })
    editBtn.setAttribute('data-korisnikId',korisnikId);

    let editTd = document.createElement('td');
    editTd.appendChild(editBtn);
    korisnikTr.appendChild(editTd);

    let deleteBtn = document.createElement('button');
    deleteBtn.type='button';
    deleteBtn.innerText = 'Obrisi';
    deleteBtn.setAttribute('class','obrisi');
    deleteBtn.onclick = deleteKorisnikAlert;
    deleteBtn.setAttribute('data-korisnikId',korisnikId);

    let deleteTd = document.createElement('td');
    deleteTd.appendChild(deleteBtn);
    korisnikTr.appendChild(deleteTd);

    let tbody = document.getElementById(tbodyId);
    tbody.appendChild(korisnikTr);
}

//==========================IZMENA KORISNIKA==================================
function showEditPage(korisnik,korisnikId){
    document.getElementById("updateForma").style.display="flex";
    let editForm = document.getElementById('updateForma');
    
    setFormData(korisnikId,korisnik);

    editForm.addEventListener('submit',function(e){

        e.preventDefault();
        let username = document.getElementById('usernameEdit').value.trim();
        let email = document.getElementById('emailEdit').value.trim();
        let lozinka = document.getElementById('passwordEdit').value.trim();
        let ime = document.getElementById('imeEdit').value.trim();
        let prezime = document.getElementById('prezimeEdit').value.trim();
        let datum = document.getElementById('datumEdit').value.trim();
        let adresa = document.getElementById('ulicaEdit').value.trim().concat(',',document.getElementById('mestoEdit').value.trim(),',',document.getElementById('postanskiEdit').value.trim());
        let brojTelefona = document.getElementById('brTelEdit').value.trim();

        var br = validacijaIzmena(korisnikId,korisnik,ime,prezime,username,email,lozinka,datum,adresa,brojTelefona);
        if(br){
            let putRequest = new XMLHttpRequest();

        putRequest.onreadystatechange = function(e){

            if(this.readyState==4){
                if(this.status==200){
                  closeUpdate();
                  openUspesnaIzmena();
                }else{
                  alert("Greska prilikom izmene korisnika");
                }
              }
        }
        putRequest.open('PUT',firebaseUrl.concat('/korisnici/',korisnikId,'.json'));
        putRequest.send(JSON.stringify(korisnik))
        }

    })
  }

function setFormData(korisnikId,korisnik){

    let usernameInput = document.getElementById('usernameEdit');
    usernameInput.value=korisnik.korisnickoIme;

    let emailInput = document.getElementById('emailEdit');
    emailInput.value=korisnik.email;
    
    let lozinkaInput = document.getElementById('passwordEdit');
    lozinkaInput.value=korisnik.lozinka;

    let imeInput = document.getElementById('imeEdit');
    imeInput.value=korisnik.ime;

    let prezimeInput = document.getElementById('prezimeEdit');
    prezimeInput.value=korisnik.prezime;

    let datumInput = document.getElementById('datumEdit');
    datumInput.value=korisnik.datumRodjenja;

    let ulicaInput = document.getElementById('ulicaEdit');
    let mestoInput = document.getElementById('mestoEdit');
    let postanskiInput = document.getElementById('postanskiEdit');
    let podaci = korisnik.adresa.split(",");
    ulicaInput.value = podaci[0].trim();
    mestoInput.value = podaci[1].trim();
    postanskiInput.value = podaci[2].trim();
    let adresa = document.getElementById('ulicaEdit').value.trim().concat(',',document.getElementById('mestoEdit').value.trim(),',',document.getElementById('postanskiEdit').value.trim())

    let brojTelefonaInput = document.getElementById('brTelEdit');
    brojTelefonaInput.value=korisnik.telefon;

    validacijaIzmena(korisnikId,korisnik,imeInput.value,prezimeInput.value,
        usernameInput.value, emailInput.value, lozinkaInput.value, datumInput.value,
        adresa ,brojTelefonaInput.value);
}
//===================VALIDACIJA KORISNIKA=====================
function validacijaIzmena(korisnikId,korisnik,ime,prezime,username,email,lozinka,datum,adresa,brojTelefona){
    var br = true;
    if (ime===""){
        document.getElementById("imeValEdit").style.display="block";
        br=false;
    }
    else{
        korisnik.ime=ime;
        document.getElementById("imeValEdit").style.display="none";
    }
    if (prezime===""){
        document.getElementById("prezimeValEdit").style.display="block";
        br=false;
    }
    else{
        korisnik.prezime=prezime;
        document.getElementById("prezimeValEdit").style.display="none";
    }
    for (id in listaKorisnika){
        if (listaKorisnika[id].korisnickoIme===username){
            if(id!==korisnikId){
                document.getElementById("userValEditIsti").style.display="block";
                br=false;
                break;
            }
        }
    }
    if (username===""){
        document.getElementById("userValEdit").style.display="block";
        br=false;
    }
    else if((username.length<3)||(username.length>20)){
        document.getElementById("userValEdit").style.display="block";
        br=false;
    }
    if (br){
        korisnik.korisnickoIme=username;
        document.getElementById("userValEdit").style.display="none";
        document.getElementById("userValEditIsti").style.display="none";
    }

    if (lozinka===""){
        document.getElementById("passValEdit").style.display="block";
        br=false;
    }
    else if((lozinka.length<8)){
        document.getElementById("passValEdit").style.display="block";
        br=false;
    }
    else{
        korisnik.lozinka=lozinka;
        document.getElementById("passValEdit").style.display="none";
    }

    let datereg = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
    if(datum.match(datereg)){
        korisnik.datumRodjenja = datum;
        document.getElementById("datumValEdit").style.display="none";
    }
    else{
        document.getElementById("datumValEdit").style.display="block";
        br=false;
    }
    let podaci = adresa.split(',');
    if (podaci[0]===""||podaci[1]===""||podaci[2]===""){
        document.getElementById("adresaValEdit").style.display="block";
        br = false;
    }
    else if(!podaci[2].trim().match(/^\d{5}$/)){
        document.getElementById("adresaValEdit").style.display="block";
        br = false;
    }
    else{
        korisnik.adresa=adresa;
        document.getElementById("adresaValEdit").style.display="none";
    }
    let emailreg =/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;

    if(email.match(emailreg)){
        korisnik.email = email;
        document.getElementById("emailValEdit").style.display="none";
    }
    else{
        document.getElementById("emailValEdit").style.display="block";
        br = false;
    }

    var phonereg =/^[0-9]{9}$/;
    if(brojTelefona.match(phonereg)){
        document.getElementById('telValEdit').style.display = "none";
    }
    else{
        document.getElementById("telValEdit").style.display="block";
        br = false;
    }
    return br;
}
//=====================BRISANJE KORISNIKA=============================
function deleteKorisnikAlert(){
    let clickedBtn = this;
    let korisnikId = clickedBtn.getAttribute('data-korisnikId');
    document.getElementById('deleteForma').style.display = "flex";
    let submit = document.getElementById('obrisiBtn');
    submit.setAttribute('data-korisnikId',korisnikId);
    submit.addEventListener('click',function(e){
        e.preventDefault();
        deleteKorisnik(this);
    })
}


function deleteKorisnik(clickedBtn){
    
    let korisnikId = clickedBtn.getAttribute('data-korisnikId');

    let deleteRequest = new XMLHttpRequest();
  
    deleteRequest.onreadystatechange = function(){
      if(this.readyState==4){
        if (this.status==200){
          getKorisnici();
          window.location.href='adminkorisnici.html';
        }else{
          alert('Greska prilikom brisanja korisnika');
        }
      }
    }
    deleteRequest.open('DELETE',firebaseUrl.concat('/korisnici/',korisnikId,'.json'));
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