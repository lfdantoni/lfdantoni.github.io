const products = [
  {id: 'pan', description: 'Pan (Kg)'},
  {id: 'harina', description: 'Harina (Kg)'},
  {id: 'leche', description: 'Leche (Unidad)'}
]

const runMaterialComponents = () => {
  var elems = document.querySelectorAll('.sidenav');
  M.Sidenav.init(elems);
}

const getProductsView = () => {
  return `
  <select class="browser-default">
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
          ${getProductsView()}
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
  const element = document.getElementById(itemId);
  element.parentNode.removeChild(element);
}

const addRow = () => {
  const listNode = document.querySelector('#content ul');

  const item = getProductItemView();

  item.querySelector('a.remove')
  .addEventListener('click', (event) => removeRow(event, item.getAttribute('id')))

  item.querySelector('a.add')
    .addEventListener('click', addRow)

  listNode.appendChild(item);

  M.FormSelect.init(item.querySelectorAll('select'));
}

const loadProducts = () => {
  const listNode = document.createElement('ul');
  listNode.classList.add('row');

  const contentNode = document.querySelector('#content');
  contentNode.appendChild(listNode);

  addRow();
}


document.addEventListener('DOMContentLoaded', function() {
  loadProducts();

  runMaterialComponents();
});