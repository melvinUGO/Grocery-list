// ******* selected items ********************
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const input = document.querySelector(".input");
const paste = document.querySelector(".input-btn");
const clearBtn = document.querySelector(".clear-btn");
const list = document.querySelector(".grocery-list");

// edit option
let editElement;
editFlag = false;
editID = "";

// ****** event listeners *****************
form.addEventListener("submit", displayGrocery);
clearBtn.addEventListener("click", clearList);
window.addEventListener("DOMContentLoaded", setupItem);

//  ******** functions *******************
function displayGrocery(e) {
  e.preventDefault();
  const value = input.value;
  const id = new Date().getTime().toString();

  if (value !== "" && !editFlag) {
    const element = document.createElement("article");
    const attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add("grocery-item");
    element.innerHTML = `<p>${value}</p>
            <div>
              <button type="button" class="edit-btn">
                <ion-icon name="create-outline"></ion-icon>
              </button>
              <button type="button" class="delete-btn">
                <ion-icon name="trash-outline"></ion-icon>
              </button>
            </div>`;
    list.appendChild(element);
    const deleteBtn = document.querySelectorAll(".delete-btn");
    deleteBtn.forEach((btn) => {
      btn.addEventListener("click", deleteButton);
    });
    const editBtn = document.querySelectorAll(".edit-btn");
    editBtn.forEach((btn) => {
      btn.addEventListener("click", editItem);
    });

    displayAlert("Item added", "success");
    // add to local storage
    addLocalStorage(id, value);
    displayDefault();
    clearBtn.classList.add("show-clear-btn");
  } else if (value !== "" && editFlag) {
    displayAlert("value changed", "success");
    editLocalStorage(editID, value);
    displayDefault();
  } else {
    displayAlert("No items added", "danger");
  }
}

// alert
function displayAlert(text, color) {
  alert.textContent = text;
  alert.classList.add(`alert-${color}`);
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${color}`);
  }, 1000);
}

// clear list
function clearList() {
  list.innerHTML = "";
  clearBtn.classList.remove("show-clear-btn");
  displayAlert("list cleared", "danger");
}

// edit item
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.parentElement.firstChild;
  input.value = editElement.textContent;
  paste.innerHTML = "Edit";
  editFlag = true;
  editID = element.dataset.id;
  paste.addEventListener("click", function () {
    editElement.textContent = input.value;
  });
  localStorage.removeItem("list");
}

// delete button
function deleteButton(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  displayAlert("Item deleted", "danger");
  // delete from local storage
  displayDefault();
  removeFromLocalStorage(id);
}

// default
function displayDefault() {
  input.value = "";
  paste.innerHTML = "Paste";
  editFlag = false;
  editID = "";
}

// *************** local storage *************
function addLocalStorage(id, value) {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();

  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });

  localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
  items = getLocalStorage();
  items.forEach(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

// ******set up item *****************

function setupItem() {
  const items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
  }
}

function createListItem(id, value) {
  const element = document.createElement("article");
  const attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.classList.add("grocery-item");
  element.innerHTML = `<p>${value}</p>
            <div>
              <button type="button" class="edit-btn">
                <ion-icon name="create-outline"></ion-icon>
              </button>
              <button type="button" class="delete-btn">
                <ion-icon name="trash-outline"></ion-icon>
              </button>
            </div>`;
  list.appendChild(element);
  const deleteBtn = document.querySelectorAll(".delete-btn");
  deleteBtn.forEach((btn) => {
    btn.addEventListener("click", deleteButton);
  });
  const editBtn = document.querySelectorAll(".edit-btn");
  editBtn.forEach((btn) => {
    btn.addEventListener("click", editItem);
  });
}
console.log(getLocalStorage());
