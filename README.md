Inspiration
Food powers our progress as a society, yet the indomitable challenge of choosing what to eat has always been an issue. Over the past year, generative AI recipe assistants have emerged that can provide recipes given available ingredients or provide meal recommendations from images of food. However, our teams experience in using these tools revealed a common shortcoming - that these tools often produced generic recommendations, weren't great at incorporating food preferences (which are highly local/variable by nature), and couldn't factor in personal health data in deciding upon meals. To this end, we set out to take advantage of recent advances in interoperability and connectivity of disparate health data sources as well as LLM's/AI agents to synthesize various forms of personal health, diet, and wellness data and provide highly personalized food recommendations. Specifically, our digital health project aims to tackle two main food challenges: 1) a lack of healthy and conscious eating around the world and 2) address health deficiencies through better food options. These challenges are especially pertinent amongst older individuals who carry the highest disease burden but oftentimes don't have the capacity or information available to make informed decisions about the food they are consuming.

What it does
We built Holistic Health, a tool that provides personalized meal recommendations through combining state-of-the-art LLM's with highly personalized data in a human-centered framework to address this challenge. Holistic Health is currently deployed as a web application and allows users to sign up, add background information about themselves and their health and immediately start connecting wearables or other biometrics that provide insight into personalized health measures. From there, Holistic Health provides visualizations showcasing nutrient intake and allows users to generate daily sets of meals that satisfy their personal health requirements.

How we built it
Our web application is built using ReactJS. We used TogetherAI's model hub to finetune a LLAMA-70B and Mixtral-8x7B model (the LLAMA-70B is what is used for inference) for recipe generation using personalized health metrics coming from TerraAPI as well as semantically parse information passed in by the users around their current diet. We also integrate with FatSecret to gather detailed caloric and health information, with some initial work being done to verify self consistency of these results with those from a RAG model trained based on TogetherAI's hub.

Challenges we ran into
One of the biggest challenges we ran into was parsing the data across a variety of wearable integrations to select for the most important pieces of information. Using a combination of scientific literature searches and statistical testing, we ultimately decided upon a couple of monitored metrics that we would use for finetuning. Another issue we faced was identifying the best way to quantify how much a user ate of a specific meal, since being extremely precise (i.e. measuring meals in grams) can decrease the quality of experience for users, but not being precise enough might lead to wildly incorrect estimations of the relative nutrients in specific foods. We ended up settling on a middle of the road solution that allows users to specify quantities of food in terms of units that were defined by a ranking model coming from API calls to FatSecret.

Accomplishments that we're proud of
 We are extremely proud of our existing feature set and the lack of significant hallucination in model responses due to the fine tuning. We also were excited by our capabilities to integrate almost every wearable out there through the TerraAPI.

What we learned
We learned a lot about using new APIs and a LOT about prompt engineering and finetuning of models. We also learned a lot on preventing model hallucination while preserving diversity of model outputs. We also spent a considerable amount of time understanding how various metabolic factors can be affected by one another.

What's next for Holistic Health
We have a couple of ideas that we want to pursue next. Firstly, we want to polish the UI to more concisely show recipe information as well as add more relevant pieces of health information into our visualization suite. From there, we have a couple of technical ideas to further improve recipe generation, from improving quality through embedding models and/or similarity searches to additional finetuning with a more diverse set of templates. In terms of features, we hope to add in fitness recommendations as well (i.e. personalized exercise plans) to ensure that we are addressing recommendations for both the food and fitness problem. Ultimately, we also hope to incorporate more real health data from our APIs to derive more rigorous insights around health!