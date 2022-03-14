// Renders a new logo on load and click

document.getElementById('roughLogo').addEventListener('click', () => drawPeople());

function drawPeople() {
    let roughLoc = document.getElementById('roughLogo');
    while (roughLoc.lastChild) { roughLoc.removeChild(roughLoc.lastChild); }

    let roughLogo = rough.svg(roughLoc);

    let l1 = roughLogo.linearPath([[15, 1], [32, 84], [63, 64]], {stroke: '#555', strokeWidth: 2});
    let l2 = roughLogo.linearPath([[67, 31], [2, 55], [83, 68]], {stroke: '#555', strokeWidth: 2});
    let c = roughLogo.circle(35, 27, 27, {stroke: '#555', strokeWidth: 2});

    let l1a = roughLogo.linearPath([[15+80, 1], [32+80, 84], [63+80, 64]], {stroke: '#888', strokeWidth: 2});
    let l2a = roughLogo.linearPath([[67+80, 31], [2+80, 55], [83+80, 68]], {stroke: '#888', strokeWidth: 2});
    let ca = roughLogo.circle(35+80, 27, 27, {stroke: '#888', strokeWidth: 2});

    let l1b = roughLogo.linearPath([[15+160, 1], [32+160, 84], [63+160, 64]], {stroke: '#aaa', strokeWidth: 2});
    let l2b = roughLogo.linearPath([[67+160, 31], [2+160, 55], [83+160, 68]], {stroke: '#aaa', strokeWidth: 2});
    let cb = roughLogo.circle(35+160, 27, 27, {stroke: '#aaa', strokeWidth: 2});

    roughLoc.appendChild(l1);
    roughLoc.appendChild(l2);
    roughLoc.appendChild(c);

    roughLoc.appendChild(l1a);
    roughLoc.appendChild(l2a);
    roughLoc.appendChild(ca);

    roughLoc.appendChild(l1b);
    roughLoc.appendChild(l2b);
    roughLoc.appendChild(cb);

    return false;
}

drawPeople();
