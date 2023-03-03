const { all, default: axios } = require("axios");
const { time, Console } = require("console");
const e = require("express");
const { urlencoded, json } = require("express");
const fs = require("fs");
const { type } = require("os");

const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  let loop = ["23228", "26063", "26068", "26065", "26022"];

  // loop.map((courdseid) => {
  //   axios
  //     .post(
  //       "https://stud-api.num.edu.mn/topMenus/TopSchedules?courseid=" + courdseid
  //     )
  //     .then((response) => {
  //       var lecture = [];
  //       var seminar = [];

  //       response.data.map((item) => {
  //         if (item.compName == "Лекц") {
  //           lecture.push(item);
  //         } else {
  //           seminar.push(item);
  //         }
  //       });
  //       let combination = [];
  //       lecture.map((item) => {
  //         seminar.map((el) => {
  //           if (item.groupid == el.groupid) {
  //             let k = [];
  //             k.push(item);
  //             k.push(el);

  //             combination.push(k);
  //           }
  //         });
  //       });

  //       //   this.unclassifedlessons.push(combination);

  //       let dataa = JSON.stringify(combination);
  //       fs.writeFileSync(`${courdseid}.json`, dataa);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // });

  let unclassifedlessons = [];

  loop.map((item) => {
    var data = fs.readFileSync(`${item}.json`, "utf8");
    unclassifedlessons.push(JSON.parse(data));
  });

  var objectkeys = Object.keys(unclassifedlessons);

  let keys = [];
  function mdqu() {
    let numb = 0;
    objectkeys.map((item) => {
      let k = {};
      k[item] = unclassifedlessons[item].length;
      numb++;
      keys.push(k);
    });
  }

  mdqu();
  let numb = [];
  keys.map((item) => {
    let numbers = [];
    let max = Object.values(item);
    for (let i = 0; i < max; i++) {
      numbers.push(i);
    }
    numb.push(numbers);
  });

  let sssssss = combinations(numb);

  function combinations(arrays) {
    function combine(index, current) {
      if (index === arrays.length) {
        result.push(current.slice());
        return;
      }
      for (let i = 0; i < arrays[index].length; i++) {
        current.push(arrays[index][i]);
        combine(index + 1, current);
        current.pop();
      }
    }
    let result = [];
    combine(0, []);
    return result;
  }

  let returndata = [];
  let limit = 0;
  let counterlesson1 = 0;

  sssssss.map((item, indexxx) => {
    let monday = [];
    let tuesday = [];
    let wednesday = [];
    let thursday = [];
    let friday = [];
    let saturday = [];
    let sunday = [];
    item.map((el, ind) => {
      unclassifedlessons[ind][el].map((i) => {
        if (i.weekname == "Даваа") {
          monday.push(i);
        } else if (i.weekname == "Мягмар") {
          tuesday.push(i);
        } else if (i.weekname == "Лхагва") {
          wednesday.push(i);
        } else if (i.weekname == "Пүрэв") {
          thursday.push(i);
        } else if (i.weekname == "Баасан") {
          friday.push(i);
        } else if (i.weekname == "Бямба") {
          saturday.push(i);
        } else {
          sunday.push(i);
        }
      });
    });

    let days = [monday, tuesday, wednesday, thursday, friday, saturday, sunday];
    let daycounter = 0;

    days.map((item) => {
      let times = [];

      item.map((el) => {
        times.push(el.time.split("-"));
      });
      times.sort();

      if (indexxx == 0) {
        console.log(times);
      }
      let countr = 0;
      let timeslen = times.length;

      if (timeslen == 1) {
        countr++;
      } else {
        times.map((it, index1) => {
          if (timeslen - 1 > index1) {
            if (it[0] != times[index1 + 1][0] && it[1] < times[index1 + 1][0]) {
              countr++;
            }
          }
        });
      }

      if (timeslen == 0 || timeslen == 1) {
        daycounter++;
      } else if (timeslen - 1 == countr) {
        daycounter++;
      }

      if (indexxx == 0) {
        console.log(daycounter);
      }
    });

    if (daycounter == days.length) {
      returndata.push(days);
    }
  });

  let dataassss = JSON.stringify(returndata);
  // fs.writeFileSync(`realdata.json`, dataassss);

  res.send(dataassss);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
