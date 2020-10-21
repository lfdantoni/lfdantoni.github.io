const App = (() => {
  const components = {};

  return {
    addComponent: (name, component) => {
      components[name] = component;
    },
    getComponent: (name) => {
      return components[name];
    }
  }
})()

const AsyncModule = (() => {
  const loadComponent = async (filePath, componentName) => {
    return new Promise(resolve => {
      // Checks if the file is already loaded to skip
      const exist = document.querySelector(`script[src="${filePath}"]`);
      if(exist) return resolve(componentName);

      var s = document.createElement('script');
      s.setAttribute('src', filePath);
      s.onload=() => {
        resolve(componentName);
      };

      document.head.appendChild( s );
    })
  }

  return {
    loadComponent
  } 
})()

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


// ErrorComponent
const ErrorComponent = (() => {
  return {
    render: () => '404 Page Not Found'
  }
})()


// Service Worker
const SWModule = (() => {
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
})()

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

      if(typeof component === 'function') {
        const componentName = await component();
        currentComponent = App.getComponent(componentName);
      } else {
        currentComponent = component;
      }
     
      if(currentComponent.load) {
        await currentComponent.load();
      }

      const componentRender = await currentComponent.render();
    
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

const runMaterialComponents = () => {
  var elems = document.querySelectorAll('.sidenav');
  M.Sidenav.init(elems);
}

const routes = [
  { path: '/', component: ProductsComponent, },
  { path: '/about', component: () => AsyncModule.loadComponent('about-component.js', 'AboutComponent') },
];

document.addEventListener('DOMContentLoaded', function() {
  runMaterialComponents();

  // router
  new Router(routes);
});