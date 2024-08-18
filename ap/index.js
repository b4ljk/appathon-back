import axios from "axios";
import { Router } from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { schedule_as_nums } from "../helpers/index.js";
const calc = Router();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function getDataFromSisi(body) {
  let allData = body.map(async (item, index) => {
    await sleep(50 * index);
    let data = await axios.post(`https://stud-api.num.edu.mn/topMenus/TopSchedules?empid=0&roomid=0&courseid=${item}`);
    return data;
  });
  return allData;
}

function getCombinations(arr) {
  var result = [[]];
  var counter = 0;
  const maxCombinations = 200000;

  for (var i = 0; i < arr.length; i++) {
    var currentSubArray = arr[i];
    var temp = [];

    for (var j = 0; j < currentSubArray.length; j++) {
      for (var k = 0; k < result.length; k++) {
        var newCombination = result[k].concat(currentSubArray[j]);
        temp.push(newCombination);
        counter++;

        // Break the loop if the limit has been reached
        if (counter >= maxCombinations) {
          return temp;
        }
      }
    }

    result = temp;
  }

  return result;
}

calc.post("/", async (req, res) => {
  const currentDirectory = dirname(fileURLToPath(import.meta.url));
  const { body: bodyAll } = req;
  const { body } = bodyAll;
  // let iterator = 0;
  // let loop = body;
  let unclassifedlessons = [];

  const promisedData = await getDataFromSisi(body);

  Promise.all(promisedData).then(async (values) => {
    // console.log(values);
    values.map((datas) => {
      // console.log(datas);
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

      for (let each_lecture of lecture) {
        if (each_lecture?.groupid == 0) {
          if (each_lecture?.subjectCredit == 3) {
            let choosenAlready = false;
            for (let each_seminar of seminar) {
              if (each_seminar?.groupid == 0 && each_lecture?.courseid == each_seminar?.courseid) {
                combinations.push([each_lecture, each_seminar]);
                choosenAlready = true;
              }
            }
            if (!choosenAlready) {
              for (let each_leccc of lecture) {
                if (each_leccc?.groupid == 0 && each_lecture?.courseid == each_leccc?.courseid) {
                  combinations.push([each_lecture, each_leccc]);
                  choosenAlready = true;
                }
              }
            }
          } else {
            combinations.push([each_lecture]);
          }
        }
      }
      for (let each_seminar of seminar) {
        if (each_seminar?.groupid == 0 && each_seminar?.subjectCredit < 3) {
          combinations.push([each_seminar]);
        }
      }

      lecture.map((item) => {
        if (item.groupid == 0) return;
        seminar.map((el) => {
          if (item.groupid == el.groupid) {
            combinations.push([item, el]);
          }
        });
      });

      unclassifedlessons.push(combinations);
    });

    let hugeAmount = false;
    unclassifedlessons = unclassifedlessons.filter((el) => el.length != 0);
    const possible_combinations = getCombinations(unclassifedlessons);
    const valid_schedule = [];
    if (possible_combinations.length > 10000) {
      hugeAmount = true;
    }

    for (let each_combination of possible_combinations) {
      const weekly_schedule = {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
      };
      for (let each_class of each_combination) {
        weekly_schedule?.[each_class?.weekDay]?.push(each_class);
      }
      if (hugeAmount) {
        let counter = 0;
        for (let each_day in weekly_schedule) {
          if (weekly_schedule[each_day].length > 0) {
            counter += 1;
          }
        }
        if (counter > 3) {
          continue;
        }
      }
      for (let each_day in weekly_schedule) {
        if (weekly_schedule[each_day].length > 0) {
          const sorted = weekly_schedule[each_day].sort((a, b) => {
            return a?.timeid - b?.timeid;
          });
          // this is very dangerous
          weekly_schedule[each_day] = sorted;
        }
      }
      let isValid = true;
      for (let each_day in weekly_schedule) {
        if (weekly_schedule[each_day].length > 0) {
          if (!checkValidity(weekly_schedule[each_day])) {
            isValid = false;
            break;
          }
        }
      }
      if (isValid) {
        valid_schedule.push(weekly_schedule);
      }
    }
    let result = valid_schedule.map((item) => {
      return Object.keys(item).map((key) => item[key]);
    });

    // if response is longer than 1000 then make it 1000
    if (result.length > 1000) {
      result = result.slice(0, 1000);
    }
    res.send(result);
  });
});

function checkValidity(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i].timeid + arr[i].durtime > arr[i + 1].timeid) {
      return false;
    }
  }
  return true;
}

export default calc;
