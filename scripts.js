const menu = document.querySelector('#menu');
const cartBtn = document.querySelector('#cart-btn');
const cartModal = document.querySelector('#cart-modal');
const cartItemsContainer = document.querySelector('#cart-items');
const cartTotal = document.querySelector('#cart-total');
const checkoutBtn = document.querySelector('#checkout-btn');
const cartClose = document.querySelector('#close-modal-btn');
const cartCounter = document.querySelector('#cart-counter');
const addressForm = document.querySelector('#address');
const addressWarning = document.querySelector('#address-warn');

let cart = [];

cartBtn.addEventListener('click', () => {
  updateCartModal();
  cartModal.style.display = 'flex';
});

cartModal.addEventListener('click', (e) => {
  if (e.target === cartModal) {
    cartModal.style.display = 'none';
  }
});

cartClose.addEventListener('click', () => {
  cartModal.style.display = 'none';
});

menu.addEventListener('click', (e) => {
  let parentButton = e.target.closest('.add-to-cart-btn');

  if (parentButton) {
    const name = parentButton.dataset.name;
    const price = Number(parentButton.dataset.price);

    addToCart(name, price);
  }
});

function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1
    });
  }

  updateCartModal();
}

function updateCartModal() {
  cartItemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach((item) => {
    const itemElement = document.createElement('div');
    itemElement.classList.add('flex', 'justify-between', 'flex-col', 'mb-4', 'border-b', 'pb-2');

    itemElement.innerHTML = `
    <div class="flex items-center justify-between">
      <div>
        <p class="font-medium">${item.name}</p>
        <p>Qtd: ${item.quantity}</p>
        <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
      </div>

      <button class="remove-from-cart-btn" data-name="${item.name}">
          Remover
      </button>        

    </div>
  `;

    total += item.price * item.quantity;
    cartItemsContainer.appendChild(itemElement);

  });

  cartTotal.textContent = total.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  cartCounter.innerHTML = cart.length;

}

cartItemsContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-from-cart-btn')) {
    const name = e.target.dataset.name;
    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem.quantity === 1) {
    cart = cart.filter((item) => item.name !== name);
  } else {
    existingItem.quantity -= 1;
  }

  updateCartModal();
}

addressForm.addEventListener('input', (e) => {

  const isOpen = checkRestaurantOpen();
  if (!isOpen) {
    Toastify({
      text: "Ops o restaurante está fechado! Volte mais tarde!",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #ff416c, #ff4b2b)",
      },
    }).showToast();

    return;
  }

  let inputValue = e.target.value;

  if (inputValue !== "") {
    addressForm.classList.remove('border-red-500');
    addressWarning.classList.add('hidden');
  }


  console.log(cart)
});

checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    Toastify({
      text: "Seu carrinho esta vazio!",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #ff416c, #ff4b2b)",
      },
    }).showToast();
    return;
  }

  if (addressForm.value === '') {
    addressWarning.classList.remove('hidden');
    addressForm.classList.add('border-red-500');
    return;
  }

  const cartItems = cart.map((item) => {
    return `${item.name} - Qtd: (${item.quantity}) - Preço: R$ ${item.price.toFixed(2)} | `;
  }).join("");

  const message = encodeURIComponent(cartItems);
  const phone = '5591991782007';

  window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressForm.value}`, '_blank');

  cart = [];
  updateCartModal();

});

function checkRestaurantOpen() {
  const date = new Date();
  const hours = date.getHours();

  return hours >= 11 && hours < 22;
}

const spanItem = document.querySelector('#date-span');
const isOpen = checkRestaurantOpen();

if (isOpen) {
  spanItem.classList.remove('bg-red-500');
  spanItem.classList.add('bg-green-500');
} else {
  spanItem.classList.remove('bg-green-500');
  spanItem.classList.add('bg-red-500');
}