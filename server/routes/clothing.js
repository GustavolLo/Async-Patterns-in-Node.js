const express = require("express");
const fs = require("fs");
const datafile = "server/data/clothing.json";
const router = express.Router();

/* GET all clothing */
router.route("/").get(function (req, res) {
  getClothingData()
    .then((data) => {
      console.log("Returning clothing data");
      res.send(data);
    })
    .catch((err) => res.status(500).send(err))
    .finally(() => console.log("All done processing promise"));
  console.log("Ready to work again");
});

function getClothingData() {
  return new Promise((resolve, reject) => {
    fs.readFile(datafile, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        let clothingData = JSON.parse(data);
        resolve(clothingData);
      }
    });
  });
}

module.exports = router;
