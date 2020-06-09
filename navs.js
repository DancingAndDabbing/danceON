function openLeftNav() {
    document.getElementById("leftNav").style.width = "250px";
    closeRightNav();
}

function closeLeftNav() {
    document.getElementById("leftNav").style.width = "0";
}

function openRightNav() {
    document.getElementById("rightNav").style.width = "250px";
    closeLeftNav();
}

function closeRightNav() {
    document.getElementById("rightNav").style.width = "0";
}
