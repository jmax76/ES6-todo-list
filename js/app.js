// state

const defaultState = {
    attivo: [],
    completato: []
  };
  
  window.state = window.state || defaultState;
  
  /**
   * Aggiunge un elemento alla todo-list
   * @param {string} text 
   */
  const addItem = text => {
    console.info('aggiungo elemento', text);
    window.state.attivo = window.state.attivo.concat(text);
  };
  
  /**
   * Rimuove un indice dalla todo-list attiva
   * @param {number} index 
   */
  const completeItem = index => {
    console.info('rimuovo elemento', index);
    // aggiungi l'elemento da rimuovere alla lista dei completati
    window.state.completato = window.state.completato.concat(window.state.attivo[index]);
  
    // rimuovi l'elemento dalla lista
    window.state.attivo = window.state.attivo.filter((elementText, i) => i !== index);
  };
  
  /**
   * Salva lo stato nel browser
   */
  const saveStorage = () => {
    console.info('salvo in localstorage', window.state);
    return localStorage.setItem('todo-list', JSON.stringify(window.state));
  };
  
  /**
   * Legge lo stato dal browser
   */
  const readStorage = () => {
    const data = localStorage.getItem('todo-list');
    console.info('leggo la da localstorage', data);
    if (data === null) return defaultState;
  
    return JSON.parse(data);
  };
  
  // render
  
  const mainContainer = document.querySelector('#list');
  const mainCompleted = document.querySelector('.lista-completata');
  
  const renderItem = (text, index, noEvent) => {
    const node = document.createElement('li');
    const innerText = document.createElement('span');
    innerText.innerText = text;
  
    node.appendChild(innerText);
    if (!noEvent) node.addEventListener('click', removeItemClick.bind(undefined, index));
    return node;
  };
  
  const renderDomList = (list, elements) => {
    elements.forEach(element => {
      list.appendChild(element);
    })
  };
  
  const clearList = list => {
    list.innerHTML = '';
  };
  
  const renderList = (list, DOMList, noEvent) => {
    const items = list.map((elementText, index) => renderItem(elementText, index, noEvent));
  
    clearList(DOMList);
    renderDomList(DOMList, items);
  };
  
  const renderActives = () => {
    console.info('rendering', window.state.attivo);
    renderList(window.state.attivo, mainContainer, false);
  };
  
  const renderDone = () => {
    console.info('rendering', window.state.completato);
    console.log(mainCompleted);
    renderList(window.state.completato, mainCompleted, true);
  };
  
  const addItemButtonClick = () => {
    console.info('click su bottone aggiunta');
    const inputValue = document.querySelector('#instodo').value.trim();
    if (inputValue !== '') addItem(inputValue);
    renderActives();
  };
  
  var removeItemClick = index => {
    console.info('click su bottone rimozione', index);
    completeItem(index);
    renderActives();
    renderDone();
  }
  
  // esportazione
  const es5TodoList = {
    readStorage,
    saveStorage,
    addItemButtonClick,
    removeItemClick,
    renderAll() {
      renderActives();
      renderDone();
    }
  };
  
  // runtime
  const addButton = document.querySelector('#addtodo');
  addButton.addEventListener('click', es5TodoList.addItemButtonClick);
  
  window.addEventListener('beforeunload', es5TodoList.saveStorage);
  window.addEventListener('load', () => {
    window.state = es5TodoList.readStorage();
    es5TodoList.renderAll();
  });