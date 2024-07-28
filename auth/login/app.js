import {
  createUserWithEmailAndPassword,
  auth,
  signInWithEmailAndPassword,
} from "../../utils/utils.js";

// create account = createUserWithEmailAndPassword
// upload image = ref, uploadBytes , getDownloadURL
// set complete data into firestore = doc, setDoc

const login_form = document.getElementById("login_form");

login_form.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("Form submit event fired");

  const email = e.target[0].value;
  const password = e.target[1].value;

  //   console.log("email>",email);
  //   console.log("password>",password);

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "/";
    })
    .catch((err) => alert(err));
});
