const ProductsComponent = ((API) => {

  let products = [];

  let autoSaveInterval = null;
  
  const getProductsView = (id, product) => {
    return `
    <select class="browser-default" id="product-${id}">
      <option value="" disabled ${!product && 'selected'}>Elegir opcion</option>
      ${products.map(p => (`
        <option value="${p.id}" ${product===p.id && 'selected'}>${p.description}</option>
      `))
      .join('')}
    </select>
  
    `
  }
  
  const getProductItemView = (rowData = {}) => {
    const item = document.createElement('li')
  
    const newId =  new Date().getTime();
  
    const {
      id = newId,
      product = null,
      note = '',
      quantity = ''} = rowData
  
    item.setAttribute('id', id);
  
    item.classList.add('col','s12','l12');
  
    item.innerHTML = `
        <div class="row">
          <div class="col s12 l1 product-icon">
            <i class="material-icons circle">shopping_cart</i>
          </div>
          <div class="input-field col s12 l3">
            ${getProductsView(id, product)}
          </div>
          <div class="input-field col s12 l3">
            <input placeholder="Nota" id="nota-${id}" type="text" class="validate" required value="${note}">
            <label for="nota-${id}">Nota</label>
          </div>
          <div class="input-field col s12 l3">
            <input placeholder="Cantidad" id="cantidad-${id}" type="number" class="validate" required value="${quantity}">
            <label for="cantidad-${id}">Cantidad</label>
          </div>
          <div class="col s5 offset-s7 m3 offset-m9 l2">
            <div class="col s6 l6"> <a class="btn-floating btn-large waves-effect waves-light red remove"><i class="material-icons">remove</i></a></div>
            <div class="col s6 l6"> <a class="btn-floating btn-large waves-effect waves-light red add"><i class="material-icons">add</i></a></div>
          </div>
        </div>
    `
  
    return item;
  }
  
  const removeRow = (event, itemId) => {
    if(document.querySelectorAll('#content ul li').length === 1) return;
    
    const element = document.getElementById(itemId);
    element.parentNode.removeChild(element);
  }
  
  const addRow = (listNode, rowData) => {
    const item = getProductItemView(rowData);
  
    item.querySelector('a.remove')
    .addEventListener('click', (event) => removeRow(event, item.getAttribute('id')))
  
    item.querySelector('a.add')
      .addEventListener('click', addRow.bind(this, listNode))
  
    listNode.appendChild(item);
  
    M.FormSelect.init(item.querySelectorAll('select'));
  }
  
  const saveData = () => {
    console.log('save')
    const rowNodes = document.querySelectorAll('#content ul li');
    const listToSave = [];
    
    rowNodes.forEach(n => {
      const id = n.id;
  
      const product = n.querySelector(`#product-${id}`).value;
      const note = n.querySelector(`#nota-${id}`).value;
      const quantity = n.querySelector(`#cantidad-${id}`).value;
  
      listToSave.push({
        id,
        product,
        note,
        quantity
      })
    })

    const listToSaveStr =  JSON.stringify(listToSave);
    const listSaved =  localStorage.getItem('productList');

    // it could be improved
    if(listToSaveStr !== listSaved) {
      localStorage.setItem('productList', listToSaveStr);
      localStorage.setItem('sync', 'false');
    }
  
  }

  const startAutoSave = () => {
    // Checks if there is no setInterval executing
    if(!autoSaveInterval) {
      autoSaveInterval = setInterval(() => saveData(), 2000);
    }
  }

  const stopAutoSave = () => {
    autoSaveInterval && clearInterval(autoSaveInterval);
    autoSaveInterval = null; // Clean autoSaveInterval variable
  }

  const syncData = async () => {
    stopAutoSave();
    let success = true;
    const sendData = JSON.parse(localStorage.getItem('productList'));

    try {
      await API.updateUserCartData(sendData);
    } catch (error) {
      // we need to show an error here
      success = false;
      alert('There was an error. Check your Network and try again.')
    }

    localStorage.setItem('sync', success ? 'true' : 'false');
    startAutoSave();
  }

  const loadData = async () => {
    // if I have a fail sync, I keep my current localStorage data
    if(localStorage.getItem('sync') === 'false') return;

    const userData = await API.getUserData();

    localStorage.setItem('productList', JSON.stringify(userData.cart));
  }

  const getSaveButtonNode = () => {
    const buttonWrapper = document.createElement('div');
    buttonWrapper.classList.add('col', 's12', 'save-button');
  
    const buttonNode = document.createElement('a');
    buttonNode.classList.add('waves-effect', 'waves-light', 'btn');
    buttonNode.innerText = 'Sync';
    buttonNode.addEventListener('click', syncData)
  
    buttonWrapper.appendChild(buttonNode);
  
    return buttonWrapper;
  }
  
  const loadProducts = () => {
    const listNode = document.createElement('ul');
    listNode.classList.add('row');
  
    // load saved products
    const dataSaved = localStorage.getItem('productList');
    const rowsSaved = dataSaved ? JSON.parse(dataSaved) : [];
    const rowsData = rowsSaved.length ? rowsSaved : [{}];
    rowsData.forEach(rowData => addRow(listNode, rowData));
    
  
    const wrapperNode = document.createElement('div');
  
    const saveButtonNode = getSaveButtonNode();
  
    wrapperNode.appendChild(saveButtonNode);
    wrapperNode.appendChild(listNode);
  
    return wrapperNode;
  }
  
  const willUnmountProductsComponent = () => {
    stopAutoSave();
  }

  const loadProductTypes = async () => {
    products = await API.getProductTypes();
  }

  const render = async () => {
    await loadProductTypes();

    startAutoSave();

    return loadProducts();
  }

  return {
    load: loadData,
    render,
    willUnmount: willUnmountProductsComponent
  }
})(API) // module dependency

App.addComponent('ProductsComponent', ProductsComponent)