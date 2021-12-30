function capitalizeFirstLetter(string) {
   return string.charAt(0).toUpperCase() + string.slice(1);
}

const getPassList = (data) => {
   const header = `<div class="card mx-auto mt-3" style="width: 18rem; transition: 2s">
   <div class="card-body">
      <div class="float-end remove-password" data-get-all-data='${JSON.stringify(
         data
      )}'><i class="bi bi-trash"></i></div>
      <h5 class="card-title">${capitalizeFirstLetter(data.service)}</h5>
      <ul class="list-group list-group-flush">`;

   let datalist = "";

   for (key in data) {
      if (!(key == "service") && !(key == "uuid")) {
         datalist += `<li class="list-group-item"><strong>${capitalizeFirstLetter(
            key
         )}</strong> : ${data[key]}</li>`;
      }
   }

   const footer = `</ul></div>
   </div>`;

   return header + datalist + footer;
};

const electron = require("electron");
const { ipcRenderer } = electron;

const dataContainer = document.getElementById("password-data-list");

ipcRenderer.send("main:loaded", true);

ipcRenderer.on("pass:getlist", (event, list) => {
   if (list != -1) {
      let oldData = "";
      list.forEach((x) => {
         oldData += getPassList(x);
         dataContainer.innerHTML = oldData;
      });
   } else {
      dataContainer.innerHTML =
         '<h4 class="display-4 text-center">Data Kosong</h4>';
   }

   const searchKey = document.getElementById("search-keyword");
   const searchButton = document.getElementById("search-button");

   searchButton.addEventListener("click", () => {
      ipcRenderer.send("pass:search", searchKey.value);
   });

   searchKey.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
         ipcRenderer.send("pass:search", searchKey.value);
      }
   });

   const addPasswordBtn = document.getElementById("go-to-add");

   addPasswordBtn.addEventListener("click", () => {
      ipcRenderer.send("main:goadd");
   });

   const removePassword = document.querySelectorAll(".remove-password");

   removePassword.forEach((element) => {
      element.addEventListener("click", function () {
         ipcRenderer.send(
            "pass:remove",
            JSON.parse(this.getAttribute("data-get-all-data"))
         );
         location.reload();
      });
   });
});

ipcRenderer.on("pass:getsearch", (event, getSearch) => {
   if (getSearch != -1) {
      let oldData = "";
      getSearch.forEach((x) => {
         oldData += getPassList(x);
         dataContainer.innerHTML = oldData;
      });
   } else {
      dataContainer.innerHTML =
         '<h3 class="display-4">Data tidak ditemukan</h3>';
   }
});
