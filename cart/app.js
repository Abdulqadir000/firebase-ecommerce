import {
  auth,
  db,
  onAuthStateChanged,
  signOut,
  doc,
  getDoc,
  collection,
  updateDoc,
} from "../utils/utils.js";

const logout_btn = document.getElementById("logout_btn");
const login_link = document.getElementById("login_link");
const user_img = document.getElementById("user_img");
const cartList = document.getElementById("cart-list");

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    login_link.style.display = "none";
    user_img.style.display = "inline-block";
    getUserInfo(uid);
    loadCartItems(uid);
  } else {
    window.location.href = "../auth/login/index.html";
    login_link.style.display = "inline-block";
    user_img.style.display = "none";
  }
});

logout_btn.addEventListener('click', () => {
  signOut(auth);
});

function getUserInfo(uid) {
  const userRef = doc(db, "users", uid);
  getDoc(userRef).then((data) => {
    user_img.src = data.data().img;
  })
  .catch((err) => {
    console.error("Error getting image: ", err);
    alert(err.message);
  });
}

async function loadCartItems(uid) {
  try {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    const cart = userDoc.data().cart || [];

    cartList.innerHTML = "";

    for (let productId of cart) {
      const productRef = doc(db, "products", productId);
      const productDoc = await getDoc(productRef);

      if (productDoc.exists()) {
        const product = productDoc.data();
        const productItem = document.createElement("div");
        productItem.className = "product-item p-4 md:p-6 bg-white rounded-lg shadow-md";
        productItem.innerHTML = `
          <div class="product-image-wrapper mb-4">
            <img
              src="${product.imageUrl}"
              alt="${product.name}"
              class="product-image w-full h-48 object-cover rounded-md"
            />
          </div>
          <div class="product-details text-center">
            <h2 class="product-name text-lg font-bold text-gray-800 mb-2">${product.name}</h2>
            <p class="product-price text-xl font-semibold text-blue-600 mb-2">$${product.price}</p>
            <p class="product-category text-sm font-medium text-gray-600 mb-2">${product.description}</p>
            <button
              class="remove-from-cart-btn w-full py-2 px-4 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              data-id="${productId}"
            >
              Remove from Cart
            </button>
          </div>
        `;
        cartList.appendChild(productItem);
      }
    }

    addRemoveFromCartFunctionality();
  } catch (error) {
    console.error("Error loading cart items: ", error);
    alert(error.message);
  }
}

function addRemoveFromCartFunctionality() {
  const removeButtons = document.querySelectorAll('.remove-from-cart-btn');
  removeButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const productId = button.getAttribute('data-id');
      await removeFromCart(productId);
      button.closest('.product-item').remove();
    });
  });
}

async function removeFromCart(productId) {
  const user = auth.currentUser;

  if (user) {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);
    let cart = userDoc.data().cart || [];

    cart = cart.filter(id => id !== productId);
    await updateDoc(userRef, { cart });
    alert("Product removed from cart!");
  } else {
    alert("User not authenticated");
  }
}

