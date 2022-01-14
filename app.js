const registerForm = document.querySelector("#register");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const errorMsg = document.querySelector("#error");
const successMsg = document.querySelector("#success");
const submitBtn = document.querySelector(".submit-btn");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = nameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  submitBtn.textContent = "Loading...";

  try {
    await axios.post(
      "https://parcel-delivery.herokuapp.com/api/v1/auth/signup",
      { name, email, password }
    );
    successMsg.style.visibility = "visible";
    setTimeout(function () {
      successMsg.style.visibility = "hidden";
    }, 2000);

    nameInput.value = "";
    emailInput.value = "";
    passwordInput.value = "";
  } catch (error) {
    console.log(error.response);
    errorMsg.style.visibility = "visible";
    if (!name && !email && !password) {
      errorMsg.textContent = "please provide name, email and password";
    } else if (password.length < 6) {
      errorMsg.textContent = "minimum of 6 characters required for password";
    } else {
      errorMsg.textContent = `${error.response.data.msg}`;
    }

    setTimeout(function () {
      errorMsg.style.visibility = "hidden";
    }, 2000);
  }
  submitBtn.textContent = "Register";
});
