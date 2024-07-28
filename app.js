// import {
//   auth,
//   db,
//   storage,
//   onAuthStateChanged,
//   signOut,
//   doc,
//   getDoc,
// } from "./utils/utils.js";

// const logout_btn = document.getElementById("logout_btn");
// const login_link = document.getElementById("login_link");
// const user_img = document.getElementById("user_img");

// // console.log("auth agaya", auth);
// // console.log("db", db);
// // console.log("storage agaya", storage);

// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     // User is signed in, see docs for a list of available properties
//     // https://firebase.google.com/docs/reference/js/auth.user
//     const uid = user.uid;
//     login_link.style.display = "none";
//     user_img.style.display = "inline-block";
//     getUserInfo(uid);
//     // ...
//   } else {
//     window.location.href = "/auth/login/index.html";
//     login_link.style.display = "inline-block";
//     user_img.style.display = "none";
//   }
// });

// logout_btn.addEventListener('click', () => {
//   signOut(auth);
// });

// function getUserInfo(uid){
//   const userRef = doc(db, "users", uid);
//   getDoc(userRef).then((data)=> {
//     console.log("data", data.id);
//     console.log("data=>", data.data());
//     console.log(data)
//     user_img.src = data.data().img;
//   })
//   .catch((err) => {
//     console.error("Error getting image: ", err);
//     alert(err.message);
//   });

//   // /auth/login/index.html 

// }
 
import {
  auth,
  db,
  storage,
  onAuthStateChanged,
  signOut,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  collection,
  getDocs,
  ref,
  uploadBytes,
  getDownloadURL,
} from "./utils/utils.js";

const logout_btn = document.getElementById("logout_btn");
const login_link = document.getElementById("login_link");
const user_img = document.getElementById("user_img");
const productForm = document.getElementById("product-form");
const productList = document.getElementById("product-list");


onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    login_link.style.display = "none";
    user_img.style.display = "inline-block";
    getUserInfo(uid);
    loadProducts();
  } else {
    window.location.href = "/auth/login/index.html";
    login_link.style.display = "inline-block";
    user_img.style.display = "none";
  }
});

logout_btn.addEventListener('click', () => {
  signOut(auth);
});

productForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;
  const productImage = document.getElementById("image").files[0];


  const user = auth.currentUser;

  if (user) {
    const userId = user.uid;
    const imageUrl = await uploadImage(productImage);
    console.log(userId);
    addProduct({ name, price, category, description, imageUrl, userId });
  } else {
    alert("User not authenticated");
  }


});

async function uploadImage(file) {
  const storageRef = ref(storage, `products/${file.name}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}

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

async function addProduct(product) {
  try {
    await addDoc(collection(db, "products"), product);
    alert("Product added successfully!");
    productForm.reset();
    loadProducts();
  } catch (error) {
    console.error("Error adding product: ", error);
    alert(error.message);
  }
}

async function loadProducts() {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    productList.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const product = doc.data();
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
            class="add-to-cart-btn w-full py-2 px-4 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            data-id="${doc.id}"
          >
            Add to Cart
          </button>
        </div>
      `;
      productList.appendChild(productItem);
    });
    addCartFunctionality();
  } catch (error) {
    console.error("Error loading products: ", error);
    alert(error.message);
  }
}

function addCartFunctionality() {
  const cartButtons = document.querySelectorAll('.add-to-cart-btn');
  cartButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const productId = button.getAttribute('data-id');
      await addToCart(productId); // Updated to handle adding products to cart
    });
  });
}

async function addToCart(productId) {
  const user = auth.currentUser;

  if (user) {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);
    let cart = userDoc.data().cart || [];

    if (!cart.includes(productId)) {
      cart.push(productId);
      await updateDoc(userRef, { cart });
      alert("Product added to cart!");
    } else {
      alert("Product already in cart!");
    }
  } else {
    alert("User not authenticated");
  }
}