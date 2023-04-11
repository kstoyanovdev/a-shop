// SELECT ELEMENTS
const productsElement = document.querySelector('.products');
const cartTitleElement = document.querySelector('.cart-title');
const cartItemsElement = document.querySelector('.cart-items');
const totalElement = document.querySelector('.cart-footer');

// RENDER PRODUCTS
function renderProducts() {
    const htmlStrings = data.map((product) => {
      return `
        <div id="product-cart">
          <div class="product-cart-thumb">
            <a href="${product.url}">
              <img src="${product.thumb}" alt="${product.name}">
            </a>
            <div class="product-badges">
              <span class="badge">${product.badge}</span>
            </div>
          </div>
          <div class="product-cart-content"> 
            <div class="product-category">${product.category}</div>                
            <h2 class="product-title">
              <a href="${product.url}">${product.name}</a>
            </h2>
            <div class="product-card-footer">
              <div class="product-price">
                <span>${product.currency} ${product.price}</span>
                <span class="old-price">${product.currency} ${product.price_old}</span>
              </div>
              <div class="add-cart" onclick="addToCart(${product.id})">
                <a class="add" href="#">Add</a>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    productsElement.innerHTML = htmlStrings.join('');
  }

renderProducts();

// CART ARRAY
let cart = JSON.parse(localStorage.getItem('CART')) || [];
updateCart();

// ADD TO CART
function addToCart(id){

    if(cart.some((item) => item.id === id)){
        changeNumberOfUnits('plus', id);
    } else {
        const item = data.find( (product) => product.id === id)
        cart.push({
            ...item, numberOfUnits: 1
        });
    
        updateCart();
    }
}

// UPDATE CART 
function updateCart(){
    renderCartItems();
    renderTotal();

    // Save cart to local storage
    localStorage.setItem('CART', JSON.stringify(cart));
}

// CALCULATE AND RENDER SUBTOTAL
function renderTotal(){
    let totalPrice = 0;
    let totalItems = 0;
    let totalCurrency = '';

    cart.forEach((item) => {
        totalPrice += item.price * item.numberOfUnits;
        totalItems += item.numberOfUnits;
        totalCurrency = item.currency;
    });

    if (totalItems !== 0){
        cartTitleElement.innerHTML = `<h2>Shopping Cart</h2>`;
        totalElement.innerHTML = `Total (${totalItems} items): ${totalCurrency} ${totalPrice.toFixed()}`;
    }
}

// RENDER CART ITEMS
function renderCartItems(){
    cartItemsElement.innerHTML = '';
    
    cart.forEach((item)=> {
        cartItemsElement.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <img src="${item.thumb}" alt="${item.name}">
                    <h4 class="cart-item-title">${item.name}</h4>
                </div>
                <div class="cart-item-unit-price">${item.currency} ${item.price}</div>
                <div class="cart-item-units">
                    <div class="btn minus" onclick="changeNumberOfUnits('minus', ${item.id});">-</div>
                    <div class="number">${item.numberOfUnits}</div>
                    <div class="btn plus" onclick="changeNumberOfUnits('plus', ${item.id});">+</div>           
                </div>
                <div class="cart-item-remove">
                    <a href="" onclick="removeItemFromCart(${item.id});">X</a>
                </div>
            </div>
        `;
    });
}

// CHANGE NUMBER OF UNITS
function changeNumberOfUnits(action, id){
    cart = cart.map((item) => {

        let numberOfUnits = item.numberOfUnits;

        if(item.id === id){
            if(action === 'minus' && numberOfUnits > 1){
                numberOfUnits--
            } else if (action === 'plus' && numberOfUnits < item.instock){
                numberOfUnits++
            }
        }

        return {
            ...item,
            numberOfUnits,
        };
    });

    updateCart();
}

// REMOVE ITEM FROM CART
function removeItemFromCart(id){
    cart = cart.filter((item) => item.id !== id);

    updateCart();
}