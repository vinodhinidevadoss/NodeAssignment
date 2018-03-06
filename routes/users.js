const express = require('express');
const router = express.Router();

let fs = require('fs');
let readData = fs.createReadStream("./db.json");

readData.on("data", data => {
  dataJson = JSON.parse(data);
})

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ dataJson });
});

router.get('/addProduct', function (req, res, next) {
  res.json({ dataJson });
});

router.post("/addProduct", function (req, res, next) {
  let prod = req.body;
  let id = dataJson.Device.length;
  prod.id = ++id;
  dataJson.Device.push(prod);
  let writeStream = fs.createWriteStream("./db.json");
  writeStream.write(JSON.stringify(dataJson), err => {
    if (err) throw err;
    else {
      let successmessage = "Successfully Added the new Product";
      res.status(200).json({ successmessage });
    }
  });
});

router.get("/updateProduct/:id", function (req, res, next) {
  let id = req.params.id;
  let updateIndex = dataJson.Device.findIndex(data => data.id == id);
  if (updateIndex != -1) {
    res.json({ DeviceDetails: dataJson.Device[updateIndex] });
  }
  else {
    let errMsg = "Invalid Id";
    res.json({ errMsg });
  }
})

router.post("/updateProduct/:id", function (req, res, next) {
  let prod = req.body;
  let id = req.params.id;
  let updateIndex = dataJson.Device.findIndex(data => data.id == id);
  prod.id = id;
  dataJson.Device[updateIndex] = prod;
  let writeStream = fs.createWriteStream("./db.json");
  writeStream.write(JSON.stringify(dataJson), err => {
    if (err) throw err;
    else {
      let editmsg = "Product is edited successfully";
      res.json({ editmsg });
    }
  });
});

router.get("/deleteProduct/:id", function (req, res) {
  let id = req.params.id;
  let deleteIndex = dataJson.Device.findIndex(data => data.id == id);
  if (deleteIndex != -1) {
    dataJson.Device.splice(deleteIndex, 1);
    let writeStream = fs.createWriteStream("./db.json");
    writeStream.write(JSON.stringify(dataJson), err => {
      if (err) throw err;
      else {
        let deletemsg = "Successfully deleted Device" + " " + id;
        res.json({ deletemsg });
      }
    });
  }
  else {
    let errMsg = "Invalid Product Index";
    res.json({ errMsg });
  }
});

router.post("/getProduct", function (req, res, next) {
  if (req.body.id) {
    let getId = dataJson.Device.findIndex(data => data.id == req.body.id);
    res.json({ deviceDetails: dataJson.Device[getId] });
  } 
  else if (req.body.productName) {
    let getName = dataJson.Device.filter(
      data => data.productName == req.body.productName
    );
    res.json({ deviceDetails: getName });
  }
  else{
    let errMsg = "Please enter valid product id or name";
    res,json({errMsg});
  }
});

router.get("/viewCategory", function (req, res) {
  let categoryArray = [];
  let categoryArray1 = [];
  for (i = 0; i < dataJson.Device.length; i++) {
    categoryArray.push(dataJson.Device[i].category);
  }
  for (i = 0; i < categoryArray.length - 1; i++) {
    for (j = 1; j < categoryArray.length; j++) {
      if (categoryArray[i] == categoryArray[j]) {
        categoryArray.splice(j, 1);
      }
    }
  }
  for (i = 0; i < categoryArray.length; i++) {
    let CatObjvalue = [];
    let count = 0;
    for (j = 0; j < dataJson.Device.length; j++) {
      if (categoryArray[i] == dataJson.Device[j].category) {
        CatObjvalue[count] = dataJson.Device[j];
        count++;
      }
    }

    mainCategory[categoryArray[i]] = CatObjvalue;
  }
  res.json({ Category: mainCategory });
});

router.get("/search/:val", function (req, res, next) {
  let val = req.params.val.toLowerCase();
  let searchresult = [];
  let arr = dataJson.Device;
  searchresult = arr.filter(function (obj) {
    return obj.productName
      .toString()
      .toLowerCase()
      .includes(val);
  });
  res.json({ searchresult: searchresult });
});

router.get("/globalSearch/:val", (req, res, next) => {
  let globalSearchResult = [];
  let val = req.params.val.toLowerCase();
  let arr = dataJson.Device;

  globalSearchResult = arr.filter(function (obj) {
    return Object.keys(obj).some(function (key) {
      return obj[key]
        .toString()
        .toLowerCase()
        .includes(val);
    });
  });
  res.json({ globalSearchResult: globalSearchResult });
});

module.exports = router;
