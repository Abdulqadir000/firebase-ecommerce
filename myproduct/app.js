import {
  auth,
  db,
  onAuthStateChanged,
  signOut,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  collection,
  query,
  where,
} from "../utils/utils.js";

const logout_btn = document.getElementById("logout_btn");
const user_img = document.getElementById("user_img");
const productList = document.getElementById("product-list");

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    getUserInfo(uid);
    loadUserProducts(uid);
    console.log(uid);
  } else {
    window.location.href = "../auth/login/index.html";
  }
});

logout_btn.addEventListener('click', () => {
  signOut(auth);
});

function getUserInfo(uid) {
  const userRef = doc(db, "users", uid);
  getDoc(userRef).then((data) => {
  }).catch((err) => {
    console.error("Error getting image: ", err);
    alert(err.message);
  });
}

async function loadUserProducts(uid) {
  try {
    const productsRef = collection(db, "products");
    const q = query(productsRef, where("userId", "==", uid));
    const querySnapshot = await getDocs(q);
    productList.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const product = doc.data();
      const productItem = document.createElement("div");
      productItem.className = "product-item p-4 md:p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out";
      productItem.innerHTML = `
        <div class="product-image-wrapper mb-4 overflow-hidden rounded-lg">
          <img
            src="${product.imageUrl}"
            alt="${product.name}"
            class="product-image w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-105"
          />
        </div>
        <div class="product-details text-center">
          <h2 class="product-name text-lg font-bold text-gray-800 mb-2">${product.name}</h2>
          <p class="product-price text-xl font-semibold text-blue-600 mb-2">$${product.price}</p>
          <p class="product-category text-sm font-medium text-gray-600 mb-2">${product.category}</p>
          <p class="product-description text-gray-700 mb-4">${product.description}</p>
          <button
            class="delete-product-btn w-full py-2 px-4 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300 ease-in-out"
            data-id="${doc.id}"
          >
            Delete
          </button>
        </div>
      `;
      
      productList.appendChild(productItem);
    });
    addDeleteFunctionality();
  } catch (error) {
    console.error("Error loading products: ", error);
    alert(error.message);
  }
}


function addDeleteFunctionality() {
  const deleteButtons = document.querySelectorAll('.delete-product-btn');
  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-id');
      deleteProduct(productId);
    });
  });
}

async function deleteProduct(productId) {
  try {
    await deleteDoc(doc(db, "products", productId));
    alert("Product deleted successfully!");
    const user = auth.currentUser;
    if (user) {
      loadUserProducts(user.uid);
    }
  } catch (error) {
    console.error("Error deleting product: ", error);
    alert(error.message);
  }
}
