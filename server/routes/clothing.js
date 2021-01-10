const express = require("express");
const fs = require("fs");
const fsPromises = require("fs").promises;
const datafile = "server/data/clothing.json";
const router = express.Router();
const DataMonitor = require("../DataMonitor");

let dataMonitor = new DataMonitor();

dataMonitor.on("dataAdded", (item) => {
  console.log(`New element was added : '${item}'`);
});

/* GET all clothing */
router
  .route("/")
  .get(async function (req, res) {
    try {
      let data = await getClothingData();
      console.log("Returning async data");
      res.send(data);
    } catch (err) {
      res.status(500).send(err);
    }
    // getClothingData()
    //   .then((data) => {
    //     console.log("Returning clothing data");
    //     res.send(data);
    //   })
    //   .catch((err) => res.status(500).send(err))
    //   .finally(() => console.log("All done processing promise"));
    // console.log("Ready to work again");
  })
  .post(async function (req, res) {
    try {
      let data = await getClothingData();
      let nextID = getNextAvailableID(data);
      let newClothingItem = {
        clothingID: nextID,
        itemName: req.body.itemName,
        price: req.body.price,
      };

      data.push(newClothingItem);
      await saveClothingData(data);

      dataMonitor("dataAdded", newClothingItem.itemName);

      res.status(201).send(newClothingItem);
    } catch (error) {
      res.status(500).send(error);
    }
  });

async function getClothingData() {
  const rawData = await fsPromises.readFile(datafile, "utf8");
  const clothingData = JSON.parse(rawData);
  return clothingData;
  // return new Promise((resolve, reject) => {
  //   fs.readFile(datafile, "utf8", (err, data) => {
  //     if (err) {
  //       reject(err);
  //     } else {
  //       let clothingData = JSON.parse(data);
  //       resolve(clothingData);
  //     }
  //   });
  // });
}

function getNextAvailableID(allClothingData) {
  let maxID = 0;

  allClothingData.forEach(function (element, index, array) {
    if (element.clothingID > maxID) {
      maxID = element.clothingID;
    }
  });
  return maxID;
}

function saveClothingData(data) {
  return fsPromises.writeFile(datafile, JSON.stringify(data, null, 4));
}

module.exports = router;
