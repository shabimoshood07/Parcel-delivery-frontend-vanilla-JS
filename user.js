const userDetails = document.querySelector(".user-detail");
const itemcontainer = document.querySelector(".parcels");
const destinationInput = document.querySelector(".destination-input");
const pickupLocationInput = document.querySelector(".pickup-location-input");
const recipientNameInput = document.querySelector(".recipient-name-input");
const recipientPhoneNumberInput = document.querySelector(
  ".recipient-phoneNumber-input"
);
const weightInput = document.querySelector(".weight-input");
const amountOutput = document.querySelector(".output");

const createBtn = document.querySelector(".create-btn");
const createForm = document.querySelector(".create");
const successMsg = document.querySelector("#success");
const errorMsg = document.querySelector("#error");
const logoutBtn = document.querySelector(".logout");

// amountOutput.innerHTML = `${weightInput.value * 15}`;
weightInput.addEventListener("input", () => {
  amountOutput.textContent = Math.round(weightInput.value * 15);
});
// TOKEN
const token = localStorage.getItem("token");
const details = JSON.parse(localStorage.getItem("details"));

window.addEventListener("load", async () => {
  userDetails.innerHTML = `<h3>Welcome ${details.name} </h3>`;
});

const loadParcel = async () => {
  try {
    const { data } = await axios.get(
      "https://parcel-delivery.herokuapp.com/api/v1/parcels/user",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const userParcel = data.parcel.parcel;
    console.log(userParcel);
    const parcels = userParcel
      .map((parcel) => {
        // if ((parcel.presentLocation = "")) {
        //   let setpresentLocation = "";
        // } else {
        //   let setpresentLocation = parcel.presentLocation;
        // }

        // if ((parcel.status = " ")) {
        //   let status = "";
        // } else {
        //   let status = parcel.status;
        // }

        const {
          destination,
          status,
          presentLocation,
          _id: parcelId,
          pickupLocation,
          receiverNumber,
          receiver,
          price,
        } = parcel;
        return ` 
            <article class="item">
                  <div class="item-heading">
                    <div class="toggle-icon">
                        <button class="close-details toggle-btn">
                            <i class="fas fa-chevron-up"></i>
                        </button>
                        <button class="open-details toggle-btn">
                            <i class="fas fa-chevron-down"></i>
                        </button>
                    </div>
                    <div class="item-details">
                        <label for="id">Parcel id: ${parcelId}</label>
                        <div class="">
                            <a href="edit.html?id=${parcelId}" class="edit-btn">
                                <i class="fas fa-edit"></i>
                            </a>
                            <button class="check-btn">
                                <i class="fas fa-check-circle"></i>
                            </button>
                            <button data-id= "${parcelId}" class="delete-btn">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="destination-details">
                <h3>Pickup Location: ${pickupLocation}</h3> 
                        <h3>Destination: ${destination}</h3> 
                        <h3>Recipient: ${receiver}</h3> 
                        <h3>Recipient No: ${receiverNumber}</h3> 
                        <h3 class="stat">Status: ${status}</h3>
                        <h3>Present location: ${presentLocation}</h3>
                        <h3 class="stat">Price (N): ${price}</h3>
                </div>
            </article>`;
      })
      .join("");

    if (userParcel.length === 0) {
      itemcontainer.innerHTML =
        '<h1 class="no-parcel"> No delivery parcel available!</h1>';
    } else {
      itemcontainer.innerHTML = parcels;
    }

    const editBtn = document.querySelector(".edit-btn");
    const checkBtn = document.querySelector(".check-btn");
    const stats = document.querySelectorAll(".stat");

    stats.forEach(function (stat) {
      const edit =
        stat.parentElement.previousElementSibling.lastElementChild
          .lastElementChild.firstElementChild;

      const check =
        stat.parentElement.previousElementSibling.lastElementChild
          .lastElementChild.lastElementChild.previousElementSibling;

      if (stat.textContent === "Status: Undefined") {
        stat.style.display = "none";
      }
      if (stat.textContent === "Status: delivered") {
        edit.style.display = "none";
        check.style.display = "inline";
      }
    });

    // ALL BUTTON CONFIGURATION

    // TOGGLE DETAILS BTN
    const openDetails = document.querySelectorAll(".open-details");
    const closeDetails = document.querySelectorAll(".close-details");

    openDetails.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        const openBtn = e.currentTarget;
        const closeBtn = openBtn.parentElement.firstElementChild;
        openBtn.style.display = "none";
        closeBtn.style.display = "block";
        const det =
          e.currentTarget.parentElement.parentElement.nextElementSibling;
        det.style.height = "fit-content";
      });
    });

    closeDetails.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        const closeBtn = e.currentTarget;
        const openBtn = closeBtn.parentElement.lastElementChild;
        openBtn.style.display = "block";
        closeBtn.style.display = "none";
        const det =
          e.currentTarget.parentElement.parentElement.nextElementSibling;
        det.style.height = "0px";
      });
    });
  } catch (error) {
    console.log(error.response);
  }
};
loadParcel();

// DELETE PARCEl
itemcontainer.addEventListener("click", async (e) => {
  const el = e.target.parentElement;
  if (el.classList.contains("delete-btn")) {
    const id = el.dataset.id;
    try {
      await axios.delete(
        `https://parcel-delivery.herokuapp.com/api/v1/parcels/${id}/delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log(error.response);
    }
    loadParcel();
  }
});

// CREATE PARCEL
createForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  createBtn.textContent = "Loading...";
  const destination = destinationInput.value;
  const receiver = recipientNameInput.value;
  const receiverNumber = recipientPhoneNumberInput.value;
  const pickupLocation = pickupLocationInput.value;
  const weight = weightInput.value;
  const price = amountOutput.textContent;
  console.log(
    destination,
    receiver,
    receiverNumber,
    pickupLocation,
    weight,
    price
  );

  if (
    !destination ||
    !receiverNumber ||
    !receiver ||
    !pickupLocation ||
    !weight ||
    !price
  ) {
    errorMsg.style.visibility = "visible";
    errorMsg.textContent = "Enter all input fields";
    setTimeout(function () {
      errorMsg.style.visibility = "hidden";
    }, 2000);
  } else {
    try {
      await axios.post(
        "https://parcel-delivery.herokuapp.com/api/v1/parcels",
        {
          destination,
          receiver,
          receiverNumber,
          pickupLocation,
          weight,
          price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      successMsg.style.visibility = "visible";

      setTimeout(function () {
        successMsg.style.visibility = "hidden";
      }, 2000);
      destinationInput.value = "";
      recipientNameInput.value = "";
      recipientPhoneNumberInput.value = "";
      pickupLocationInput.value = "";
      weightInput.value = "";
    } catch (error) {
      console.log(error.response.data);
      errorMsg.style.visibility = "visible";
      if (
        error.response.data.msg ===
          "The string supplied did not seem to be a phone number" ||
        "The string supplied is too short to be a phone number"
      ) {
        errorMsg.textContent = "Invalid phone number";
      } else {
        errorMsg.textContent = `${error.response.data.msg}`;
      }
      setTimeout(function () {
        errorMsg.style.visibility = "hidden";
      }, 2000);
    }
  }

  loadParcel();
  createBtn.textContent = "Create";
});

// LOGOUT
logoutBtn.addEventListener("click", function () {
  localStorage.clear("token");
  localStorage.clear("details");
  location.href = "login.html";
});
