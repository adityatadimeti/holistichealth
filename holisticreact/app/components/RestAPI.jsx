"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import JsonView from "@uiw/react-json-view";
import { useAction, useMutation, useQuery } from "convex/react";
import { myAPICall, createTask, getTask } from "../../convex/functions";
import { api } from "../../convex/_generated/api";
import Together from "together-ai";
import Chart from "chart.js/auto";
import PieChart from "./PieChart";

import { CategoryScale } from "chart.js";

Chart.register(CategoryScale);

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: "438d711c47f1704ecd54b9b10420938927c8e8f7029426fc98c123d2bf8abb08",
  dangerouslyAllowBrowser: true,
  baseURL: "https://api.together.xyz/v1",
});

// This is how to use out REST API
async function fetchUserData(userID, start_date, end_date, scope) {
  let request = await fetch(`/getData`, {
    method: "POST",
    headers: {
      auth_success_redirect_url: "http://localhost:3000",
      "dev-id": process.env.NEXT_PUBLIC_DEV_ID,
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
      scope: scope,
      user_id: userID,
      start_date: start_date,
      end_date: end_date,
    },
  });

  return (await request.json()).data;
}

async function run(age, height, weight, gender, meal) {
  let system_content =
    "You are a recipe generation assistant. Be descriptive and helpful.";
  let user_content =
    `[Prompt] Given the following information, please do your best to suggest a ` +
    meal +
    ` dish. Remember to only suggest one meal, and make sure that the meal is the most appropriate given the context. [Context] Your client is a ` +
    age +
    ` year old ` +
    gender +
    ` who is ` +
    height +
    `inches and weighs ` +
    weight +
    `lbs. They take [between 5000 and 25000] steps a day, burn an average of [number of steps from previous blank * 0.04], have a [below average/average/above average] blood glucose, a  [below average/average/above average] heart rate, and have an [below/average/above average] BMI. He ate a [describe a popular Mexican/Italian/American/Indian/Asian/African meal] for [breakfast/lunch/dinner - should be the same meal from before] yesterday. This contains [] calories, [] grams of fat, [] grams of carbs, and [] grams of protein. For reference, given their demographics, they should be consuming ` +
    65 +
    6.2 * weight +
    12.7 * height -
    6.8 * age +
    ` if they are a male or ` +
    655 +
    4.3 * weight +
    4.3 * height -
    4.7 * age +
    ` calories,  [0.3/9 * calories] grams of fat, [0.4/4 * calories] grams of carbs, and [0.25/4 * calories  if they are a male or 0.2 / 4 * calories if they are a female] grams of protein per day. 

    [ANSWER] 
    Here is the ` +
    meal +
    ` dish to consider.
    
    Recommended Meal: [Insert recommended meal name here]

    Recipe: 
    
    [Insert recipe for the recommended meal]
    
    Instructions:
    
    [Insert instructions to make the recipe from above]
    
    Nutritional Information:
    
    Calories: [number of calories]
    Fat: [number of grams of fat]
    Carbs: [number of grams of carbs]
    Protein: [number of grams of protein]
    
    Summary:
    
    [Include four sentences on why this meal was recommended given the client's very unique context]
    
    
    Remember to follow this template exactly.`;

  // let context =
  //   "[Context] Your client is a 25 year old male who is 6'2\" and weighs 180 lbs. He takes 9500 steps a day and has an average BMI. He ate a cheeseburger with beef and salted fries for dinner yesterday\nThis contains 1000 calories, 51 grams of fat, 101 grams of carbs, and 32 grams of protein. For reference, given his demographics, he should be consuming 2750 calories, 83 grams of fat, 360 grams of carbs, and 180 grams of protein per day.";

  // user_content += context;
  // user_content +=
  //   "Please only report the recommended meal, the recipe, and the nutritional information.";

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: system_content },
      { role: "user", content: user_content },
    ],
    model: "meta-llama/Llama-2-70b-chat-hf",
    max_tokens: 1024,
    temperature: 0.7,
  });

  var dict = {};

  const output = chatCompletion.choices[0].message.content;
  console.log("HERE -----");

  console.log(output);
  let recommendedMealRegex = /Recommended Meal: (.+?)(?=\n\n|$)/s;
  let match = output.match(recommendedMealRegex);
  console.log(match);
  if (match) {
    const recommendedMeal = match[1]; // Extract the recommended meal text
    dict["recommendedMeal"] = recommendedMeal;
  } else {
    console.log("Recommended meal section not found.");
  }

  recommendedMealRegex = /Nutritional Information:\n(.+?)(?=\n\n|$)/s;
  match = output.match(recommendedMealRegex);
  console.log(match);
  if (match) {
    const nutrition = match[1]; // Extract the recommended meal text

    const lines = nutrition.trim().split("\n");

    // Initialize an empty dictionary

    // Iterate through each line
    lines.forEach((line) => {
      // Split each line by ':'
      const parts = line.split(":");
      if (parts.length === 2) {
        // Extract key and value, trim whitespace
        const key = parts[0].trim();
        const value = parts[1].trim();
        // Add key-value pair to the dictionary
        dict[key] = value;
      }
    });

    dict["nutrition"] = nutrition;
  } else {
    console.log("nutrition meal section not found.");
  }

  recommendedMealRegex = /Summary:\n(.+?)(?=\n\n|$)/s;
  match = output.match(recommendedMealRegex);
  console.log(match);
  if (match) {
    const recommendedMeal = match[1]; // Extract the recommended meal text
    dict["summary"] = recommendedMeal;
  } else {
    console.log("summary meal section not found.");
  }

  console.log(dict);
  return dict;
}

async function text2image() {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are an AI assistant" },
      { role: "user", content: "give me an image of the mountains" },
    ],
    model: "stabilityai/stable-diffusion-xl-base-1.0",
    max_tokens: 1024,
  });
  console.log(chatCompletion.choices[0].message.content);
}

export default function RestAPI() {
  const searchParams = useSearchParams();

  useEffect(() => {
    setUser({
      userID: searchParams.get("user_id"),
      resource: searchParams.get("resource"),
    });
  }, []);

  const [user, setUser] = useState({
    userID: null,
    resource: null,
  });

  const [scope, setScope] = useState("DAILY");
  const [chosen, setChosen] = useState("");
  const [enteredFood, setEnteredFood] = useState("");
  const [start_date, setStartDate] = useState("00-00-0000");
  const [end_date, setEndDate] = useState("00-00-0000");
  const [output, setOutput] = useState();
  const [food, setFood] = useState();
  const [result, setResult] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showchart, setshowchart] = useState(false);
  const [vals1, setvals1] = useState({});
  const [vals2, setvals2] = useState({});
  const [vals3, setvals3] = useState({});
  const [age, setage] = useState(0);
  const [gender, setgender] = useState("");
  const [height, setheight] = useState(0);
  const [weight, setweight] = useState(0);

  const [chartData, setChartData] = useState({
    labels: ["Carbs", "Protein", "Fat"],
    datasets: [
      {
        label: "Macros Breakdown",
        data: [12, 19, 5],
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });
  const [chartData2, setChartData2] = useState({
    labels: ["Carbs", "Protein", "Fat"],
    datasets: [
      {
        label: "Macros Breakdown",
        data: [12, 19, 5],
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });
  const [chartData3, setChartData3] = useState({
    labels: ["Carbs", "Protein", "Fat"],
    datasets: [
      {
        label: "Macros Breakdown",
        data: [12, 19, 5],
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });
  const performMyAction = useAction(api.functions.myAPICall);
  const performCreateTask = useMutation(api.functions.createTask);

  //text2image();

  function isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  return (
    <>
      <div className="bg-white/20 p-8 rounded-[30px] border-2 border-white flex justify-center items-center flex-col gap-4 w-full min-h-[200px]">
        {!user.userID ? (
          <>
            <p className="text-[24px] font-semibold">Choose Data</p>
          </>
        ) : (
          <>
            <p className="text-[20px] font-semibold w-full">Step 1</p>

            <div className="w-full flex flex-col gap-4">
              <SelectScope scope={scope} setScope={setScope} />
              <SelectDate
                text={"Select your start date:"}
                scope={start_date}
                setScope={setStartDate}
              />
              <SelectDate
                text={"Select your end date:"}
                scope={end_date}
                setScope={setEndDate}
              />
              <button
                className=" px-4 py-2 rounded-full border-2 border-white text-white hover:bg-opacity-70"
                onClick={async () => {
                  setOutput({ status: "Loading..." });
                  fetchUserData(
                    user.userID,
                    start_date,
                    end_date,
                    scope.toLowerCase()
                  ).then((out) => {
                    setOutput(out);
                  });
                }}
              >
                Load data
              </button>

              <p className="text-[20px] font-semibold w-full">Step 2</p>
              <h2 style={{ marginTop: "-10px" }}>
                Enter information about you
              </h2>
              <input
                type="numeric"
                placeholder="Enter age"
                style={{
                  height: "24px",
                  fontSize: "15px",
                  width: "300px",
                  marginTop: "-5px",
                  padding: "20px",
                  border: "1px solid black",
                  textAlign: "left",
                }}
                onChange={(e) => {
                  setage(e.currentTarget.value);
                }}
                className="px-4 py-10 rounded-full w-fit text-center"
              ></input>
              <input
                type="numeric"
                placeholder="Enter height"
                style={{
                  height: "24px",
                  fontSize: "15px",
                  width: "300px",
                  marginTop: "-5px",
                  padding: "20px",
                  border: "1px solid black",
                  textAlign: "left",
                }}
                onChange={(e) => {
                  setheight(e.currentTarget.value);
                }}
                className="px-4 py-10 rounded-full w-fit text-center"
              ></input>
              <input
                type="numeric"
                placeholder="Enter weight"
                style={{
                  height: "24px",
                  fontSize: "15px",
                  width: "300px",
                  marginTop: "-5px",
                  padding: "20px",
                  border: "1px solid black",
                  textAlign: "left",
                }}
                onChange={(e) => {
                  setweight(e.currentTarget.value);
                }}
                className="px-4 py-10 rounded-full w-fit text-center"
              ></input>
              <input
                type="text"
                placeholder="Enter gender"
                style={{
                  height: "24px",
                  fontSize: "15px",
                  width: "300px",
                  marginTop: "-5px",
                  padding: "20px",
                  border: "1px solid black",
                  textAlign: "left",
                }}
                onChange={(e) => {
                  setgender(e.currentTarget.value);
                }}
                className="px-4 py-10 rounded-full w-fit text-center"
              ></input>

              <p className="text-[20px] font-semibold w-full">Step 3</p>
              <h2 style={{ marginTop: "-10px" }}>
                Now, enter what you ate today!
              </h2>

              <input
                type="text"
                placeholder="Enter meal"
                style={{
                  height: "24px",
                  fontSize: "15px",
                  width: "300px",
                  marginTop: "-5px",
                  padding: "20px",
                  border: "1px solid black",
                  textAlign: "left",
                }}
                onChange={(e) => {
                  setEnteredFood(e.currentTarget.value);
                }}
                className="px-4 py-10 rounded-full w-fit text-center"
              ></input>

              <button
                style={{
                  borderRadius: "15px",
                  width: "100px",
                  marginTop: "-5px",
                  color: "white",
                  padding: "5px",
                  fontSize: "12px",
                  border: "1px solid white",
                }}
                onClick={async () => {
                  setFood({ status: "Loading..." });
                  setResult(await performMyAction({ foodName: enteredFood }));
                }}
              >
                Submit
              </button>

              <button
                style={{
                  borderRadius: "15px",
                  width: "100px",
                  marginTop: "-5px",
                  color: "white",
                  padding: "5px",
                  fontSize: "12px",
                  border: "1px solid white",
                }}
                onClick={(e) => {
                  setShowResult(true);
                }}
              >
                Process Results
              </button>

              {showResult && (
                <>
                  <p className="text-[20px] font-semibold w-full">Step 4</p>
                  <h2 style={{ marginTop: "-10px" }}>Choose your quantities</h2>
                  {console.log(result)}
                  <div className="relative ">
                    <p
                      className="white px-4 py-2 bg-white/20 border-white text-center border-2 w-fit rounded-full cursor-pointer"
                      onClick={(e) => {
                        setDropdown(!dropdown);
                        e.stopPropagation();
                      }}
                    >
                      {chosen}
                    </p>
                    {dropdown && (
                      <div className="absolute top-full translate-y-[10px] w-full rounded-[20px] overflow-hidden">
                        {parse_results(result).map((s) => {
                          return (
                            <p
                              className="white px-4 py-2 bg-white hover:bg-gray-300 cursor-pointer text-[10px] text-center"
                              onClick={() => {
                                setChosen(s);
                                setDropdown(!dropdown);
                              }}
                            >
                              {s}
                            </p>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <h2 style={{ marginTop: "10px" }}>Enter quantity</h2>

                  <input
                    type="number"
                    placeholder="quantity"
                    style={{
                      height: "24px",
                      fontSize: "15px",
                      width: "300px",
                      marginTop: "-5px",
                      padding: "20px",
                      border: "1px solid black",
                      textAlign: "left",
                    }}
                    onChange={(e) => {
                      setQuantity(e.currentTarget.value);
                    }}
                    className="px-4 py-10 rounded-full w-fit text-center"
                  ></input>

                  <button
                    style={{
                      borderRadius: "15px",
                      width: "100px",
                      marginTop: "-5px",
                      color: "white",
                      padding: "5px",
                      fontSize: "12px",
                      border: "1px solid white",
                    }}
                    onClick={async () => {
                      // genClick();
                      // fetch("http://localhost:3000/mytest")
                      //   .then((response) => response.json())
                      console.log("clicked");
                      // runinferece().then((out) => {
                      //   console.log(out);
                      // });

                      let valsdict = await run(
                        age,
                        height,
                        weight,
                        gender,
                        "breakfast"
                      );
                      setvals1(valsdict);
                      console.log("HEERE");
                      console.log(valsdict);
                      setshowchart(true);
                      setChartData({
                        labels: ["Carbs", "Protein", "Fat"],
                        datasets: [
                          {
                            label: "Macros Breakdown",
                            data: [
                              parseInt(valsdict["Carbs"].replace(/\D/g, "")),
                              parseInt(valsdict["Protein"].replace(/\D/g, "")),
                              parseInt(valsdict["Fat"].replace(/\D/g, "")),
                            ],
                            backgroundColor: [
                              "rgba(75,192,192,1)",
                              "#50AF95",
                              "#f3ba2f",
                              "#2a71d0",
                            ],
                            borderColor: "black",
                            borderWidth: 2,
                          },
                        ],
                      });

                      let valsdict2 = await run(
                        age,
                        height,
                        weight,
                        gender,
                        "lunch"
                      );
                      setvals2(valsdict2);
                      console.log("HEERE");
                      console.log(valsdict2);
                      setshowchart(true);
                      setChartData2({
                        labels: ["Carbs", "Protein", "Fat"],
                        datasets: [
                          {
                            label: "Macros Breakdown",
                            data: [
                              parseInt(valsdict2["Carbs"].replace(/\D/g, "")),
                              parseInt(valsdict2["Protein"].replace(/\D/g, "")),
                              parseInt(valsdict2["Fat"].replace(/\D/g, "")),
                            ],
                            backgroundColor: [
                              "rgba(75,192,192,1)",
                              "#50AF95",
                              "#f3ba2f",
                              "#2a71d0",
                            ],
                            borderColor: "black",
                            borderWidth: 2,
                          },
                        ],
                      });

                      let valsdict3 = await run(
                        age,
                        height,
                        weight,
                        gender,
                        "dinner"
                      );
                      setvals3(valsdict3);
                      console.log("HEERE");
                      console.log(valsdict3);
                      setshowchart(true);
                      setChartData3({
                        labels: ["Carbs", "Protein", "Fat"],
                        datasets: [
                          {
                            label: "Macros Breakdown",
                            data: [
                              parseInt(valsdict3["Carbs"].replace(/\D/g, "")),
                              parseInt(valsdict3["Protein"].replace(/\D/g, "")),
                              parseInt(valsdict3["Fat"].replace(/\D/g, "")),
                            ],
                            backgroundColor: [
                              "rgba(75,192,192,1)",
                              "#50AF95",
                              "#f3ba2f",
                              "#2a71d0",
                            ],
                            borderColor: "black",
                            borderWidth: 2,
                          },
                        ],
                      });

                      //   .then((data) => console.log(data));
                    }}
                  >
                    Generate
                  </button>

                  {/* {showchart && (
                    <div>
                      <PieChart
                        chartData={chartData}
                        calcount={vals1["Calories"]}
                      />
                      <PieChart
                        chartData={chartData2}
                        calcount={vals2["Calories"]}
                      />
                      <PieChart
                        chartData={chartData3}
                        calcount={vals3["Calories"]}
                      />
                    </div>
                  )} */}
                </>
              )}
            </div>
          </>
        )}
      </div>

      <>
        {showchart && (
          <div
            className={
              (!user.userID && "opacity-[70%]") +
              " bg-white/20 p-8 rounded-[30px] border-2 border-white flex justify-center items-center flex-col gap-4 w-full h-full"
            }
          >
            <div>
              <PieChart
                chartData={chartData}
                calcount={vals1["Calories"]}
                desc={vals1["recommendedMeal"]}
                summary={vals1["summary"]}
              />
              <PieChart
                chartData={chartData2}
                calcount={vals2["Calories"]}
                desc={vals2["recommendedMeal"]}
                summary={vals2["summary"]}
              />
              <PieChart
                chartData={chartData3}
                calcount={vals3["Calories"]}
                desc={vals3["recommendedMeal"]}
                summary={vals3["summary"]}
              />
            </div>
          </div>
        )}
      </>

      {/* <>
        <div
          className={
            (!user.userID && "opacity-[70%]") +
            " bg-white/20 p-8 rounded-[30px] border-2 border-white flex justify-center items-center flex-col gap-4 w-full h-full"
          }
        >
          <pre className="m-2 bg-white border-2 border-black rounded-[20px] w-full h-[300px] overflow-y-scroll max-h-[400px] p-2 max-w-[500px]">
            {output &&
              isJsonString(output) &&
              JSON.parse(output).data == undefined &&
              console.log("no user data")}
            {output &&
              isJsonString(output) &&
              JSON.parse(output).data.length > 0 && (
                <JsonView value={JSON.parse(output).data[0]["calories_data"]} />
              )}
          </pre>
        </div>
      </> */}
    </>
  );
}
// ^^ right above is where the data gets outputted

function genClick() {
  console.log("clockec");

  const pyProg = spawn("python", ["./test.py"]);

  // Collect data from script and print to console
  let data = "";
  pyProg.stdout.on("data", (stdout) => {
    data += stdout.toString();
  });

  // Print errors to console, if any
  pyProg.stderr.on("data", (stderr) => {
    console.log(`stderr: ${stderr}`);
  });

  // When script is finished, print collected data
  pyProg.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    console.log(data);
  });
}
function parse_results(results) {
  results = JSON.parse(results);

  //     data = json.loads(example_fts)
  //     for result in data["foods"]["food"]:
  //         if result["food_name"] == "Palak Paneer":
  //             print(result["food_name"])
  //             print(result["food_description"])

  //iterate through the results json
  let allfoods = results["foods"]["food"];
  let final_descriptions = [];
  for (let i = 0; i < allfoods.length; i++) {
    final_descriptions.push(
      allfoods[i]["food_name"] +
        " - " +
        allfoods[i]["food_description"] +
        " - " +
        allfoods[i]["brand_name"]
    );
  }
  return final_descriptions;
}

function SelectScope({ scope, setScope }) {
  const [open, setOpen] = useState(false);

  const SCOPES = [
    "ACTIVITY",
    "BODY",
    "DAILY",
    "MENSTRUATION",
    "NUTRITION",
    "SLEEP",
  ];

  return (
    <div className="flex justify-between items-center w-full">
      <p>Select your scope:</p>
      <div className="relative ">
        <p
          className="white px-4 py-2 bg-white/20 border-white text-center border-2 w-fit rounded-full cursor-pointer"
          onClick={(e) => {
            setOpen(!open);
            e.stopPropagation();
          }}
        >
          {scope}
        </p>
        {open && (
          <div className="absolute top-full translate-y-[10px] w-full rounded-[20px] overflow-hidden">
            {SCOPES.map((s) => {
              return (
                <p
                  className="white px-4 py-2 bg-white hover:bg-gray-300 cursor-pointer text-[10px] text-center"
                  onClick={() => {
                    setScope(s);
                    setOpen(!open);
                  }}
                >
                  {s}
                </p>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function SelectDate({ text, scope, setScope }) {
  const SCOPES = ["DAILY", "SLEEP"];

  return (
    <div className="flex gap-4 justify-between items-center w-full">
      <p>{text}</p>
      <input
        type="text"
        placeholder="YYYY-MM--DD"
        className="px-2 py-4 rounded-full w-fit text-center"
        onChange={(e) => {
          setScope(e.currentTarget.value);
        }}
      ></input>
    </div>
  );
}
