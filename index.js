// ProductsComponent

const products = [
  {id: 'pan', description: 'Pan (Kg)'},
  {id: 'harina', description: 'Harina (Kg)'},
  {id: 'leche', description: 'Leche (Unidad)'}
]

const runMaterialComponents = () => {
  var elems = document.querySelectorAll('.sidenav');
  M.Sidenav.init(elems);
}

const getProductsView = (id) => {
  return `
  <select class="browser-default" id="product-${id}">
    <option value="" disabled selected>Elegir opcion</option>
    ${products.map(p => (`
      <option value="${p.id}">${p.description}</option>
    `))
    .join('')}
  </select>

  `
}

const getProductItemView = () => {
  const item = document.createElement('li')

  const id =  new Date().getTime();

  item.setAttribute('id', id);

  item.classList.add('col','s12','l12');

  item.innerHTML = `
      <div class="row">
        <div class="col s12 l1 product-icon">
          <i class="material-icons circle">shopping_cart</i>
        </div>
        <div class="input-field col s12 l3">
          ${getProductsView(id)}
        </div>
        <div class="input-field col s12 l3">
          <input placeholder="Nota" id="nota-${id}" type="text" class="validate" required>
          <label for="nota-${id}">Nota</label>
        </div>
        <div class="input-field col s12 l3">
          <input placeholder="Cantidad" id="cantidad-${id}" type="number" class="validate" required>
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

const addRow = (listNode) => {
  const item = getProductItemView();

  item.querySelector('a.remove')
  .addEventListener('click', (event) => removeRow(event, item.getAttribute('id')))

  item.querySelector('a.add')
    .addEventListener('click', addRow.bind(this, listNode))

  listNode.appendChild(item);

  M.FormSelect.init(item.querySelectorAll('select'));
}

const saveData = () => {
  console.log('save data')
  const rowNodes = document.querySelectorAll('#content ul li');
  const listToSave = [];
  
  rowNodes.forEach(n => {
    const id = n.id;

    const product = n.querySelector(`#product-${id}`).value;
    const note = n.querySelector(`#nota-${id}`).value;
    const quantity = n.querySelector(`#cantidad-${id}`).value;

    if(product && note && quantity) {
      listToSave.push({
        id,
        note,
        quantity
      })
    }
  })
  
  localStorage.setItem('productList', JSON.stringify(listToSave));
}

const getSaveButtonNode = () => {
  const buttonWrapper = document.createElement('div');
  buttonWrapper.classList.add('col', 's12', 'save-button');

  const buttonNode = document.createElement('a');
  buttonNode.classList.add('waves-effect', 'waves-light', 'btn');
  buttonNode.innerText = 'Save';
  buttonNode.addEventListener('click', saveData)

  buttonWrapper.appendChild(buttonNode);

  return buttonWrapper;
}

const loadProducts = () => {
  const listNode = document.createElement('ul');
  listNode.classList.add('row');

  addRow(listNode);

  const wrapperNode = document.createElement('div');

  const saveButtonNode = getSaveButtonNode();

  wrapperNode.appendChild(saveButtonNode);
  wrapperNode.appendChild(listNode);

  return wrapperNode;
}

const ProductsComponent = {
  render: () => loadProducts()
}

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
const routes = [
  { path: '/', component: ProductsComponent, },
  { path: '/about', component: AboutComponent, },
];

const parseLocation = () => location.hash.slice(1).toLowerCase() || '/';

const findComponentByPath = (path, routes) => routes.find(r => r.path.match(new RegExp(`^\\${path}$`, 'gm'))) || undefined;

const router = () => {
  // Find the component based on the current path
  const path = parseLocation();
  // If there's no matching route, get the "Error" component
  const { component = ErrorComponent } = findComponentByPath(path, routes) || {};

  const componentRender = component.render();

  const content = document.getElementById('content');
  content.innerHTML = '';
  
  if (typeof componentRender === 'string'){
    content.innerHTML = componentRender;
  } else {
    content.appendChild(componentRender);
  }

  var elem = document.querySelector('.sidenav');
  var instance = M.Sidenav.getInstance(elem);
  instance.close();
}

document.addEventListener('DOMContentLoaded', function() {
  loadProducts();

  runMaterialComponents();

  registerSW();

  // router
  router();
  window.addEventListener('hashchange', router);
});