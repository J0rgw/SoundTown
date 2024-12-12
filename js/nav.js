function shadow() {
    document.querySelectorAll ('#search-bar *[type]').forEach (function (el) {
    el.classList.toggle ('shadow');
});
}
function shadowL() {
    document.querySelectorAll ('#login').forEach (function (el) {
    el.classList.toggle ('shadowL');
});
}