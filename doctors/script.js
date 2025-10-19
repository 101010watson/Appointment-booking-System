const redirectToDoc = document.querySelector(".navPanel");

redirectToDoc.addEventListener('click',(e)=>{
    let target = e.target.closest("li");

    if(!target) return;

    if(target.classList.contains("homeTab")){
        window.location.assign("../dashboard/index.html");
    }
    else if(target.classList.contains("profileTab")){
        window.location.assign("../profile/index.html");
    }
    else if(target.classList.contains("settingsTab")){
        window.location.assign("../settings/index.html");
    }

});

let darkMode = localStorage.getItem("darkMode");
const themeSwitch = document.querySelector('#theme-switch');

const enableDarkMode = () => {
    document.body.classList.add('darkMode');
    localStorage.setItem('darkMode','active');
}
const disableDarkMode = () => {
    document.body.classList.remove('darkMode');
    localStorage.setItem('darkMode','null');
}

if(darkMode === 'active') enableDarkMode();

themeSwitch.addEventListener('click',() => {
    darkMode = localStorage.getItem('darkMode');
    darkMode != "active" ? enableDarkMode() : disableDarkMode();
});