const logoutBtn = document.querySelector(".logout");
const itemcontainer = document.querySelector(".parcels");
const userDetails = document.querySelector(".user-detail");

// TOKEN
const token = localStorage.getItem("token");
const details = JSON.parse(localStorage.getItem("details"));
// LOGOUT
logoutBtn.addEventListener("click", function () {
  localStorage.clear("token");
  localStorage.clear("details");
  location.href = "login.html";
});

userDetails.innerHTML = `<h3>Welcome Admin </h3>
`;
const loadParcel = async () => {
  try {
    const { data } = await axios.get(
      "https://parcel-delivery.herokuapp.com/api/v1/parcels",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const userParcel = data.parcels.parcels;
    console.log(userParcel);
    const parcel = userParcel
      .map((parcel) => {
        const {
          price,
          destination,
          receiver,
          pickupLocation,
          internationalFormat,
          status,
          presentLocation,
          _id: parcelId,
          createdBy: userId,
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
                            <a href="admin-edit.html?id=${parcelId}" class="edit-btn">
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
                        <h3>UserId: ${userId}</h3>
                        <h3>Price(N): ${price}</h3>
                        <h3>Pickup Location: ${pickupLocation}</h3>
                        <h3>Receipent: ${receiver}</h3>
                        <h3>Receipent No: ${internationalFormat}</h3>
                        <h3>Destination: ${destination}</h3> 
                        <h3 class="stat">Status: ${status}</h3>
                        <h3>Present location: ${presentLocation}</h3>
                </div>
            </article>`;
      })
      .join("");

    if (userParcel.length === 0) {
      itemcontainer.innerHTML =
        '<h1 class="no-parcel"> No delivery parcel available!</h1>';
    } else {
      itemcontainer.innerHTML = parcel;
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
    console.log(error);
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
