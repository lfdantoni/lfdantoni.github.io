const products = [
  {id: 'pan', description: 'Pan (Kg)'},
  {id: 'harina', description: 'Harina (Kg)'},
  {id: 'leche', description: 'Leche (Litros)'}
]

const getProductsView = () => {
  return `
    <select class="browser-default">
      <option value="" disabled selected>Elegir un producto</option>
      ${
        products
          .map(p => `<option value="${p.id}">${p.description}</option>`)
          .join('')
      }
    </select>
  `
}

const removeRow = (id) => {
  if(document.querySelectorAll('#content ul li').length === 1) return;
   
  const elementToRemove = document.getElementById(id);

  if(elementToRemove) {
    elementToRemove.parentElement.removeChild(elementToRemove);
  }
}

const addRow = () => {
  const ulNode = document.querySelector('#content ul');

  const newItemNode = getProductItemView();

  ulNode.appendChild(newItemNode);
}

const getProductItemView = () => {
  const id = new Date().getTime();

  const itemNode = document.createElement('li');
  itemNode.classList.add('col','s12');

  itemNode.setAttribute('id', id);

  const content = `
    <div class="row">
      <div class="col s12 l1 product-icon">
        <i class="material-icons circle">shopping_cart</i>
      </div>
      <div class="input-field col s12 l3">
       ${getProductsView()}
      </div>
      <div class="input-field col s12 l3">
        <input type="text" placeholder="Nota" id="nota-${id}" class="validate" required>
        <label for="nota-${id}">Nota</label>
      </div>
      <div class="input-field col s12 l3">
        <input type="number" placeholder="Cantidad" id="cantidad-${id}" class="validate" required>
        <label for="cantidad-${id}">Cantidad</label>
      </div>
      <div class="col s5 offset-s7 l2">
        <div class="col s6"> <a class="btn-floating btn-large waves-effect waves-light red remove"> <i class="material-icons">remove</i> </a> </div>
        <div class="col s6"> <a class="btn-floating btn-large waves-effect waves-light red add"> <i class="material-icons">add</i> </a> </div>
      </div>
    </div>
  `

  itemNode.innerHTML = content;

  itemNode
    .querySelector('a.remove')
    .addEventListener('click', () => removeRow(id))

  itemNode
    .querySelector('a.add')
    .addEventListener('click', () => addRow())

  return itemNode;
}

const loadProducts = () => {
  const id = new Date().getTime();

  const ulNode = document.createElement('ul');
  ulNode.classList.add('row');

  const itemNode = getProductItemView();

  ulNode.appendChild(itemNode);

  const contentNode = document.querySelector('#content');
  contentNode.appendChild(ulNode);

}

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems);

  loadProducts();
});