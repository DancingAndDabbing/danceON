const ATABS = [...document.querySelectorAll('#aTabs li')];
const ACONTENT = [...document.querySelectorAll('#aContent div')];
//console.log(ACONTENT);

const ACTIVE_CLASS = 'is-active';

setContent(ACONTENT, ACODE);
setTabNames(ATABS, ATITLES);
initTabs(ATABS, ACONTENT);

function setTabNames(tabElements, tabTitles) {
    tabElements.forEach((t, i) => {
        t.firstChild.innerHTML = tabTitles[i];
    });
}

function setContent(contentElements, contentList) {
    contentElements.forEach((c, i) => {
        contentList[i].forEach((code) => {
            c.appendChild(createCode(code));
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
