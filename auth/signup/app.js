import {
  createUserWithEmailAndPassword,
  auth,
  doc,
  setDoc,
  db,
  ref,
  uploadBytes,
  getDownloadURL,
  storage,
} from "../../utils/utils.js";

// create account = createUserWithEmailAndPassword
// upload image = ref, uploadBytes , getDownloadURL
// set complete data into firestore = doc, setDoc

const signup_btn = document.getElementById("signup_user_btn");
const submit_btn = document.getElementById("submit_btn");

// signup_btn.addEventListener("submit", function (e) {
//   e.preventDefault();
//   console.log(e);
  

//   const img = e.target[0].files[0];
//   const email = e.target[1].values;
//   const password = e.target[2].values;
//   const firstName = e.target[4].values;
//   const lastName = e.target[5].values;
//   const phone = e.target[6].values;
//   const company = e.target[7].values;

//   const userinfo = {
//     img,
//     email,
//     password,
//     firstName,
//     lastName,
//     phone,
//     company,
//   };
//   // create account
//   submit_btn.disabled = true;
//   submit_btn.innerText = "Loading...";
//   createUserWithEmailAndPassword(auth, email, password)
//     .then((user) => {
//       // upload user image

//       const userRef = ref(storage, `user/${user.user.uid}`);
//       uploadBytes(userRef, img)
//         .then(() => {
//           // get url of image
//           getDownloadURL(userRef)
//             .then((url) => {
//               //update user info objext
//               userinfo.img = url;
//               // vreate krdia document refrence
//               var userDbRef = doc(db, "users", user.user.uid);

//               //set documtn to db

//               setDoc(userDbRef, userinfo).then(() => {
//                 window.location.href = "/";
//                 submit_btn.disabled = false;
//                 submit_btn.innerText = "Submit";
//               });
//             })
//             .catch((err) => {
//               submit_btn.disabled = false;
//               submit_btn.innerText = "Submit";
//             });
//         })
//         .catch(() => {
//           submit_btn.disabled = false;
//           submit_btn.innerText = "Submit";
//         });
//     })
//     .catch((err) => {
//       alert(err), (submit_btn.disabled = false);
//       submit_btn.innerText = "Submit";
//     });
// });


document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM fully loaded and parsed");

  const signupForm = document.getElementById("signup_form");
  if (signupForm) {
    console.log("Signup form found");

    const submit_btn = document.getElementById("submit_btn");
    if (submit_btn) {
      console.log("Submit button found");

      signupForm.addEventListener("submit", function(e) {
        e.preventDefault();
        console.log("Form submit event fired");

        const img = e.target.elements.profile_img.files[0];
        const email = e.target.elements.floating_email.value;
        const password = e.target.elements.floating_password.value;
        const firstName = e.target.elements.floating_first_name.value;
        const lastName = e.target.elements.floating_last_name.value;
        const phone = e.target.elements.floating_phone.value;
        const company = e.target.elements.floating_company.value;

        console.log("Form values: ", { img, email, password, firstName, lastName, phone, company });

        const userinfo = {
          img,
          email,
          password,
          firstName,
          lastName,
          phone,
          company,
        };

        submit_btn.disabled = true;
        submit_btn.innerText = "Loading...";

        createUserWithEmailAndPassword(auth, email, password)
          .then((user) => {
            console.log("User created: ", user);

            const userRef = ref(storage, `user/${user.user.uid}`);
            uploadBytes(userRef, img)
              .then(() => {
                getDownloadURL(userRef)
                  .then((url) => {
                    console.log("Image URL: ", url);
                    userinfo.img = url;

                    var userDbRef = doc(db, "users", user.user.uid);
                    setDoc(userDbRef, userinfo).then(() => {
                      window.location.href = "/";
                      submit_btn.disabled = false;
                      submit_btn.innerText = "Submit";
                    });
                  })
                  .catch((err) => {
                    console.error("Error getting download URL: ", err);
                    submit_btn.disabled = false;
                    submit_btn.innerText = "Submit";
                  });
              })
              .catch((err) => {
                console.error("Error uploading image: ", err);
                submit_btn.disabled = false;
                submit_btn.innerText = "Submit";
              });
          })
          .catch((err) => {
            console.error("Error creating user: ", err);
            alert(err.message);
            submit_btn.disabled = false;
            submit_btn.innerText = "Submit";
          });
      });
    } else {
      console.error("Submit button not found");
    }
  } else {
    console.error("Signup form not found");
  }
});
