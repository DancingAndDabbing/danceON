// Appends code to the documentation page and makes the tabs interactive
// docs_a.js is the current content created

const ACTIVE_CLASS = 'is-active';

// This finds existing tabs, but probably we'll want to generate them dynamically
const ST_TABS = [...document.querySelectorAll('#stTabs li')];
const ST_CONTENT = [...document.querySelectorAll('#stContent div')];

const ATABS = [...document.querySelectorAll('#aTabs li')];
const ACONTENT = [...document.querySelectorAll('#aContent div')];

const BTABS = [...document.querySelectorAll('#bTabs li')];
const BCONTENT = [...document.querySelectorAll('#bContent div')];

const CTABS = [...document.querySelectorAll('#cTabs li')];
const CCONTENT = [...document.querySelectorAll('#cContent div')];

const DTABS = [...document.querySelectorAll('#dTabs li')];
const DCONTENT = [...document.querySelectorAll('#dContent div')];

const ETABS = [...document.querySelectorAll('#eTabs li')];
const ECONTENT = [...document.querySelectorAll('#eContent div')];

const FTABS = [...document.querySelectorAll('#fTabs li')];
const FCONTENT = [...document.querySelectorAll('#fContent div')];

setContent(ST_CONTENT, ST_TITLES, ST_CODE);
setTabNames(ST_TABS, ST_TITLES);
initTabs(ST_TABS, ST_CONTENT);

setContent(ACONTENT, ATITLES, ACODE);
setTabNames(ATABS, ATITLES);
initTabs(ATABS, ACONTENT);

setContent(BCONTENT, BTITLES, BCODE);
setTabNames(BTABS, BTITLES);
initTabs(BTABS, BCONTENT);

setContent(CCONTENT, CTITLES, CCODE);
setTabNames(CTABS, CTITLES);
initTabs(CTABS, CCONTENT);

setContent(DCONTENT, DTITLES, DCODE);
setTabNames(DTABS, DTITLES);
initTabs(DTABS, DCONTENT);

setContent(ECONTENT, ETITLES, ECODE);
setTabNames(ETABS, ETITLES);
initTabs(ETABS, ECONTENT);

setContent(FCONTENT, FTITLES, FCODE);
setTabNames(FTABS, FTITLES);
initTabs(FTABS, FCONTENT);

function setContent(contentElements, tabTitles, contentList) {
    contentElements.forEach((c, i) => {
        let h = document.createElement('h1');
        h.classList.add('title');
        h.innerHTML = tabTitles[i];
        c.appendChild(h);
        contentList[i].forEach((code, j) => {
            let p = document.createElement('p');
            p.innerHTML = code.description;
            c.appendChild(p);
            c.appendChild(createCode(code.code));
            if (j < contentList[i].length - 1) c.appendChild(document.createElement('hr'));

        });
    });
}

function createCode(codeText) {
    let pre = document.createElement('pre');
    pre.classList.add('language-js');

    let code = document.createElement('code');
    code.classList.add('language-js');

    code.innerHTML = codeText;
    pre.appendChild(code);

    return pre;
}

function setTabNames(tabElements, tabTitles) {
    tabElements.forEach((t, i) => {
        t.firstChild.innerHTML = tabTitles[i];
    });
}

// Make tabs interactive
function initTabs(tabsElements, contentElements) {
    tabsElements.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        let selected = tab.getAttribute('data-tab');
        updateActiveTab(tabsElements, tab);
        updateActiveContent(contentElements, selected);
      })
    })
}

function updateActiveTab(tabsElements, selected) {
  tabsElements.forEach((tab) => {
    if (tab && tab.classList.contains(ACTIVE_CLASS)) {
      tab.classList.remove(ACTIVE_CLASS);
    }
  });
  selected.classList.add(ACTIVE_CLASS);
}

function updateActiveContent(contentElements, selected) {
  contentElements.forEach((item) => {
    if (item && item.classList.contains(ACTIVE_CLASS)) {
      item.classList.remove(ACTIVE_CLASS);
    }
    let data = item.getAttribute('data-content');
    if (data === selected) {
      item.classList.add(ACTIVE_CLASS);
    }
  });
}
