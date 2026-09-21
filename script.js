const banniere = document.getElementById("banniere");
const accepter = document.getElementById("accepter");
const refuser = document.getElementById("refuser");
const toggle = document.getElementById("switch-boutton")
const visites = document.getElementById("nb-visits")

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const found = cookies.find(cookie => cookie.startsWith(name + "="));
  if (found) {
    return found.split("=")[1];
  } else {
    return null;
  }
}

function showBannerIfNeeded() {
  if (!getCookie("consent")) {
    banniere.style.display = "block";
  } else {
    banniere.style.display = "none";
  }
}

function cookieAccepter() {
  document.cookie = "consent=true; max-age=15778800; path=/";
  banniere.style.display = "none";
}

function cookieRefuser() {
  document.cookie = "consent=false; max-age=86400; path=/";
  banniere.style.display = "none";
}

accepter.addEventListener("click", cookieAccepter);
refuser.addEventListener("click", cookieRefuser);

showBannerIfNeeded();
// partie 1 

const light = "Passer au thème light"
const dark = "Passer au thème sombre"
const cookieLight = "theme=light"
const cookieDark = "theme=dark"

toggle.addEventListener("click", changement)

function changement() {
  if (toggle.textContent === dark) {
    const expiration = new Date()
    expiration.setTime(expiration.getTime() + 15778800 * 1000)
    document.cookie = `${cookieDark}; expires=${expiration.toUTCString()}; path=/`
    toggle.textContent = light
    toggle.classList.add("button-secondary")
    toggle.classList.remove("button-primary")
  } else if (toggle.textContent === light) {
    const expiration = new Date()
    expiration.setTime(expiration.getTime() + 15778800 * 1000)
    document.cookie = `${cookieLight}; expires=${expiration.toUTCString()}; path=/`
    toggle.textContent = dark
    toggle.classList.add("button-primary")
    toggle.classList.remove("button-secondary")
  }
}
// partie 2 

let i = 0 

window.addEventListener("load", incrementation)

function incrementation(){
  i += 1
  document.cookie = `visits = ${i}`
  visites.textContent = `${i}`
}