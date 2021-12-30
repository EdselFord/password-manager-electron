const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const checkObject = (data) => {
   const { service, email, username, password, other } = data;

   let result = {};
   if (email == "") {
      if (username == "") {
         if (other == "") {
            result = { service, password };
         } else {
            result = { service, password, other };
         }
      } else if (other == "") {
         result = { service, username, password };
      } else {
         result = { service, username, password, other };
      }
   } else if (username == "") {
      if (other == "") {
         result = { service, email, password };
      } else {
         result = { service, email, password, other };
      }
   } else if (other == "") {
      result = { service, email, username, password };
   } else {
      result = { service, email, username, password, other };
   }

   return result;
};

const addPassword = (data) => {
   if (!fs.existsSync("data")) fs.mkdirSync("data");

   data = checkObject(data);
   data.uuid = uuidv4();

   const writeEmpty = () => {
      fs.writeFileSync("data/password.json", `[${JSON.stringify(data)}]`);
      return 1;
   };

   if (fs.existsSync("data/password.json")) {
      let newPassword = fs.readFileSync("data/password.json", "utf-8");
      if (newPassword !== "") {
         try {
            let newPasswordJSON = JSON.parse(newPassword);
            newPasswordJSON.push(data);
            fs.writeFileSync(
               "data/password.json",
               JSON.stringify(newPasswordJSON)
            );
            return 1;
         } catch (err) {
            if (writeEmpty() == 1) return 1;
         }
      } else {
         if (writeEmpty() == 1) return 1;
      }
   } else {
      if (writeEmpty() == 1) return 1;
   }
};

const getPassword = () => {
   try {
      let dataList = fs.readFileSync("data/password.json", "utf-8");
      return JSON.parse(dataList);
   } catch (err) {
      return -1;
   }
};

function removeDuplicates(originalArray, prop) {
   var newArray = [];
   var lookupObject = {};

   for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
   }

   for (i in lookupObject) {
      newArray.push(lookupObject[i]);
   }
   return newArray;
}

const searchPassword = (keyword) => {
   let dataList = getPassword();
   let dataTemp = dataList;
   let resultId = [];

   if (keyword != "") {
      for (let i = 0; i < dataList.length; i++) {
         for (key in dataTemp[i]) {
            dataTemp[i].service = dataList[i].service.toLowerCase();
            if (dataTemp[i][key].search(keyword) != -1) {
               resultId.push(i);
            }
         }
      }

      if (resultId.length != 0) {
         let result = [];
         resultId.forEach((x) => {
            result.push(dataList[x]);
         });
         return removeDuplicates(result, "uuid");
      } else return -1;
   } else {
      return getPassword();
   }
};

const removePassword = (data) => {
   const listPassword = getPassword();
   let index = listPassword.findIndex((x) => x.uuid == data.uuid);
   listPassword.splice(index, 1);
   fs.writeFileSync("data/password.json", JSON.stringify(listPassword));
   return 1;
};

module.exports = { addPassword, getPassword, searchPassword, removePassword };
