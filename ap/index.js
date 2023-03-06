import axios from "axios";
import { Router } from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
const calc = Router();

async function getDataFromSisi(body) {
  let allData = body.map(async (item) => {
    let data = await axios.post(
      `https://stud-api.num.edu.mn/topMenus/TopSchedules?empid=0&roomid=0&courseid=${item}`
    );
    return data;
  });
  return allData;
}

async function combinator(urls) {
  let items = [];
  for (const url of urls) {
    try {
      const response = await axios.post(
        `https://stud-api.num.edu.mn/topMenus/TopSchedules?courseid=${url}`
      );

      response.data.map((item) => {
        if (item.compName == "Лекц") {
          lecture.push(item);
        } else {
          seminar.push(item);
        }
      });

      let combinations = [];
      lecture.map((item) => {
        seminar.map((el) => {
          if (item.groupid == el.groupid) {
            combinations.push([item, el]);
          }
        });
      });
      // console.log(combinations);
      items.push(combinations);
    } catch (err) {
      console.error(err);
    }
  }

  return items;
}

calc.post("/", async (req, res) => {
  const currentDirectory = dirname(fileURLToPath(import.meta.url));
  const { body: bodyAll } = req;
  const { body } = bodyAll;
  console.log(body, "body");
  // let iterator = 0;
  // let loop = body;
  let unclassifedlessons = [];

  const promisedData = await getDataFromSisi(body);
  Promise.all(promisedData).then(async (values) => {
    values.map((datas) => {
      let lecture = [];
      let seminar = [];
      datas.data.map((item) => {
        if (item.compName == "Лекц") {
          lecture.push(item);
        } else {
          seminar.push(item);
        }
      });

      let combinations = [];
      lecture.map((item) => {
        seminar.map((el) => {
          if (item.groupid == el.groupid) {
            combinations.push([item, el]);
          }
        });
      });

      unclassifedlessons.push(combinations);

      // console.log(item.data);
    });
    console.log(unclassifedlessons);
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

      let days = [
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
      ];
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
              if (
                it[0] != times[index1 + 1][0] &&
                it[1] < times[index1 + 1][0]
              ) {
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
        }
      });

      if (daycounter == days.length) {
        returndata.push(days);
      }
    });
    console.log(returndata, "returndata");
    let dataassss = JSON.stringify(returndata);
    res.send(dataassss);
  });
});

export default calc;
