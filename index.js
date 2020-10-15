const runMaterialComponents = () => {
  var elems = document.querySelectorAll('.sidenav');
  M.Sidenav.init(elems);
}

// API
const API = (() => {
  const baseUrl = 'https://book-store-server2020.herokuapp.com';

  const getProductTypes = async () => {
    return fetch(`${baseUrl}/products`)
      .then(response => response.json());
  }

  const getUserData = async () => {
    // Replaces with a correct userId
    return fetch(`${baseUrl}/users/1`)
      .then(response => response.json());
  }

  /**
   * 
   * @param {*} userData partial user props to update
   */
  const updateUserCartData = async (userCartData) => {
    // Replaces with a correct userId
    return fetch(`${baseUrl}/users/1`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        updatedAt: new Date().getTime(), // it should be in the server side
        cart: userCartData
      })
    })
      .then(response => response.json());
  }

  return {
    getProductTypes,
    getUserData,
    updateUserCartData
  }
})()



// ProductsComponent
const ProductsComponent = ((API) => {

  let products = [];

  let autoSaveInterval = null;

  let forceStopAutoSave = true;

  let reRender = () => {};
  
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
    if (forceStopAutoSave) return;
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
      localStorage.setItem('lastUpdate', new Date().getTime().toString());
    }
  
  }

  const startAutoSave = () => {
    forceStopAutoSave = false;
    autoSaveInterval = setInterval(() => saveData(), 1000);
  }

  const stopAutoSave = () => {
    forceStopAutoSave = true;
    autoSaveInterval && clearInterval(autoSaveInterval);
  }

  const syncData = async () => {
    stopAutoSave();
    const userData = await API.getUserData();

    const lastUpdate = parseInt(localStorage.getItem('lastUpdate'));

    if (userData.updatedAt > lastUpdate) {
      localStorage.setItem('productList', JSON.stringify(userData.cart));
      localStorage.setItem('lastUpdate', userData.updatedAt.toString());
    } else if (userData.updatedAt < lastUpdate) {
      const sendData = JSON.parse(localStorage.getItem('productList'));
      const savedData = await API.updateUserCartData(sendData);
      localStorage.setItem('lastUpdate', savedData.updatedAt.toString());
    }

    if (userData.updatedAt !== lastUpdate) {
      reRender();
    }
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

  const init = async (update) => {
    reRender = update;
    await loadProductTypes();

    startAutoSave();

    return loadProducts();
  }

  const load = async () => {
    return syncData();
  }

  return {
    load,
    render: (update) => init(update),
    willUnmount: () => willUnmountProductsComponent()
  }
})(API) // module dependency


// AboutComponent
const AboutComponent = {
  render: () => 'AboutComponent'
}

// ErrorComponent
const ErrorComponent = {
  render: () => '404 Page Not Found'
}

// Service Worker
const registerSW = () => {
  if('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(() => {
          console.log('ServiceWorker registered!')
        })
        .catch((err) => {
          console.log('ServiceWorker register had an error ', err)
        })
    })
  }
}

// routes

const Router = (() => {
  const parseLocation = () => location.hash.slice(1).toLowerCase() || '/';
  const findComponentByPath = (path, routes) => routes.find(r => r.path.match(new RegExp(`^\\${path}$`, 'gm'))) || undefined;

  let privateRoutes = [];
  let currentComponent = null;

  class Router {
    constructor(routes) {
      privateRoutes = routes;

      this.update();
      window.addEventListener('hashchange', this.update);
    }

    update = async () => {
      // call unmount method
      if (currentComponent) {
        currentComponent.willUnmount && currentComponent.willUnmount();
      }

      // Find the component based on the current path
      const path = parseLocation();
      // If there's no matching route, get the "Error" component
      const { component = ErrorComponent } = findComponentByPath(path, privateRoutes) || {};

      currentComponent = component;

      if(currentComponent.load) {
        await currentComponent.load();
      }

      const componentRender = await currentComponent.render(this.update);
    
      const content = document.getElementById('content');
      content.innerHTML = '';
      
      if (typeof componentRender === 'string'){
        content.innerHTML = componentRender;
      } else {
        content.appendChild(componentRender);
      }
    
      M.updateTextFields(); // for updating material component values
    
      var elem = document.querySelector('.sidenav');
      var instance = M.Sidenav.getInstance(elem);
      instance.close();
    }
  }

  return Router;
})()

const routes = [
  { path: '/', component: ProductsComponent, },
  { path: '/about', component: AboutComponent, },
];

document.addEventListener('DOMContentLoaded', function() {
  // loadProducts();

  runMaterialComponents();

  registerSW();

  // router
  new Router(routes);
});