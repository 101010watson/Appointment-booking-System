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