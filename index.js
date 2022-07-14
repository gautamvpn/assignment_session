const express = require("express");
const bodyParser = require("body-parser");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const HTMLParser = require("node-html-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/getTimeStories", (req, res) => {
  let result = [];
  fetch("https://time.com/")
    .then(function (response) {
      return response.text();
    })
    .then(function (data) {
      var root = HTMLParser.parse(data);
      let htmlchild = root
        .querySelectorAll(".latest-stories__item")
        .toString()
        .split("</a>");
      htmlchild.map((ancortext) => {
        let res = {};
        res["link"] = ancortext.match(new RegExp(`<a href="(.*)>`))
          ? ancortext.match(new RegExp(`<a href="(.*)>`))[1]
          : null;
        res["data"] = ancortext.match(
          new RegExp(`<h3 class="latest-stories__item-headline">(.*)</h3>\n`)
        )
          ? ancortext.match(
              new RegExp(
                `<h3 class="latest-stories__item-headline">(.*)</h3>\n`
              )
            )[1]
          : null;
        result.push(res);
      });
      return res.send(result);
    })
    .catch(function (err) {
      console.warn("Something went wrong.", err);
    });
  return;
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
