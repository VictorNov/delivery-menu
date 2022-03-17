let dishes = [
    {
        id: 1,
        name: "French Fries with Ketchup",
        price: 2.23,
        img: "img/plate__french-fries.png",
    },
    {
        id: 2,
        name: "Salmon and Vegetables",
        price: 5.12,
        img: "img/plate__salmon-vegetables.png",
    },
    {
        id: 3,
        name: "Spaghetti with Meat Sauce",
        price: 7.82,
        img: "img/plate__spaghetti-meat-sauce.png",
    },
    {
        id: 4,
        name: "Bacon with Eggs",
        price: 2.23,
        img: "img/plate__bacon-eggs.png",
    },
    {
        id: 5,
        name: "Chicken Salad",
        price: 4.32,
        img: "img/plate__chicken-salad.png",
    },
    {
        id: 6,
        name: "Fish and Chips",
        price: 5.47,
        img: "img/plate__fish-sticks-fries.png",
    },
    {
        id: 7,
        name: "Italian Ravioli with Cheese",
        price: 6.53,
        img: "img/plate__ravioli.png",
    },
    {
        id: 8,
        name: "Tortellini with meat",
        price: 6.03,
        img: "img/plate__tortellini.png",
    },
    {
        id: 9,
        name: "Fish with Lemon and Tomatoes",
        price: 9.68,
        img: "img/plate__fish.png",
    },
];
let cart   = [];
let menuContainer = document.querySelector(".container-menu");
let cartContainer = document.querySelector(".container-cart");
let cartSubtotal  = cartContainer.querySelector(".subtotal");
let cartTax       = cartContainer.querySelector(".tax");
let cartTotal     = cartContainer.querySelector(".total");
let summary       = cartContainer.querySelector(".summary");
let emptyText     = cartContainer.querySelector(".cart-empty");

renderMenuItems(dishes);
renderCartItems(cart);

function renderMenuItems(menu) {
    let menuElements = document.querySelectorAll(".menu-item");
    for (let element of menuElements) {
        element.parentNode.removeChild(element);
    }

    for (let dish of menu) {
        let element = document.createElement("li");

        element.classList.add("menu-item");
        if (dish.inCart) {
            element.classList.add("in-cart");
        }
        element.dataset.itemId = dish.id;

        element.innerHTML =
            `<img class="menu-item-image" src="${dish.img}" alt="${dish.name}" title="${dish.name}">
            <div class="menu-item-description">
                <h3 class="menu-item-title">${dish.name}</h3>
                <p class="menu-item-price">${'$' + dish.price}</p>
            </div>
            <button class="add-to-cart">
                ${dish.inCart ? '<img class="icon-check" src="img/check.svg" alt="">In Cart' : 'Add to Cart' }
            </button>`;

        element.querySelector(".add-to-cart").addEventListener( "click", addItemToCart );

        menuContainer.appendChild(element);
    }
}

function addItemToCart(event) {
    let id = +event.target.parentElement.dataset.itemId;
    let cartIndex = cart.findIndex(i => i.id === id);

    if (cartIndex >= 0) {
        cart[cartIndex].quantity++;
    } else {
        let cartItem = dishes.find(item => item.id === id);
        cartItem.quantity = 1;
        cartItem.inCart = true;
        cart.push(cartItem);
    }

    renderMenuItems(dishes);
    renderCartItems(cart);
    countTotal(cart);
}

function renderCartItems(cartItems) {
    let cartElements = document.querySelectorAll(".cart-item");
    for (let element of cartElements) {
        element.parentNode.removeChild(element);
    }

    if (cartItems.length <= 0) {
        summary.hidden = true;
        emptyText.hidden = false;
    } else {
        summary.hidden = false;
        emptyText.hidden = true;
    }

    cartItems.forEach( function(cartItem, i) {
        let element = document.createElement("li");

        element.classList.add("cart-item");
        element.dataset.itemId = cartItem.id;

        element.innerHTML =
            `<div class="cart-item-image">
                <span class="cart-item-counter">${cartItem.quantity}</span>
              </div>
              <div class="cart-item-body">
                <p class="cart-item-title">${cartItem.name}</p>
                <p class="cart-item-price">${"$" + cartItem.price}</p>
                <form class="cart-item-controls" data-item-id="${cartItem.id}">
                  <label class="cart-item-quantity">
                    <span class="button-minus"></span>
                    ${cartItem.quantity}
                    <span class="button-plus"></span>
                    <input type="range" name="quantity" min="0" value="${cartItem.quantity}">
                  </label>
                  <p class="cart-item-total-price">${"$" + Math.round(cartItem.quantity * cartItem.price * 100) / 100}</p>
                </form>
              </div>`;

        element.querySelector(".cart-item-image").style.backgroundImage =
            `url(${cartItem.img})`;

        let buttonMinus = element.querySelector(".button-minus");
        let buttonPlus = element.querySelector(".button-plus");

        buttonMinus.addEventListener( "click", () => {
            if (+cartItem.quantity === 1) {
                cartItem.inCart = false;
                cartItems.splice(i, 1);
                renderMenuItems(dishes);
            } else {
                cartItem.quantity--;
            }

            renderCartItems(cart);
            countTotal(cart);
        } );

        buttonPlus.addEventListener( "click", () => {
            cartItem.quantity++;
            renderCartItems(cart);
            countTotal(cart);
        } );

        cartContainer.appendChild(element);
    } );
}

function countTotal (cartItems) {
    let subtotal = 0;

    for (let cartItem of cartItems) {
        subtotal += cartItem.quantity * cartItem.price;
        subtotal = Math.round(subtotal * 100) / 100;
    }

    let tax = Math.round(subtotal * 0.0975 * 100) / 100;
    let total = Math.round((subtotal + tax) * 100) / 100;

    cartSubtotal.innerHTML = `${"$" + subtotal}`;
    cartTax.innerHTML = `${"$" + tax}`;
    cartTotal.innerHTML = `${"$" + total}`;
}