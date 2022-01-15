const registerForm = document.querySelector("#register");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const phoneNumberInput = document.querySelector("#phone-number");
const addressInput = document.querySelector("#address");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirm-password");
const errorMsg = document.querySelector("#error");
const successMsg = document.querySelector("#success");
const submitBtn = document.querySelector(".submit-btn");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = nameInput.value;
  const email = emailInput.value;
  const phoneNumber = phoneNumberInput.value;
  const address = addressInput.value;
  const password = passwordInput.value;
  submitBtn.textContent = "Loading...";
  console.log(name, email, phoneNumber, address, password);
  try {
    if (confirmPasswordInput.value !== passwordInput.value) {
      errorMsg.style.visibility = "visible";
      errorMsg.textContent = "password do not match";
      setTimeout(function () {
        errorMsg.style.visibility = "hidden";
      }, 2000);
    } else {
      const { data } = await axios.post(
        "https://parcel-delivery.herokuapp.com/api/v1/auth/signup",
        { name, email, password, address, phoneNumber }
      );
      console.log(data.token);
      successMsg.style.visibility = "visible";
      setTimeout(function () {
        successMsg.style.visibility = "hidden";
      }, 2000);

      nameInput.value = "";
      emailInput.value = "";
      passwordInput.value = "";
      phoneNumberInput.value = "";
      addressInput.value = "";
      confirmPasswordInput.value = "";
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "details",
        JSON.stringify({
          email: data.user.email,
          name: data.user.name,
        })
      );
      if (data.user.role === "user") {
        location.href = "user.html";
      } else {
        location.href = "admin.html";
      }
    }
  } catch (error) {
    errorMsg.style.visibility = "visible";
    if (!name && !email && !password) {
      errorMsg.textContent = "please provide name, email and password";
    } else if (password.length < 6) {
      errorMsg.textContent = "minimum of 6 characters required for password";
    } else if (
      error.response.data.msg ===
      "The string supplied did not seem to be a phone number"
    ) {
      errorMsg.textContent = "Invalid phone number";
    } else {
      errorMsg.textContent = `${error.response.data.msg}`;
    }

    setTimeout(function () {
      errorMsg.style.visibility = "hidden";
    }, 2000);
  }
  submitBtn.textContent = "Register";
});
