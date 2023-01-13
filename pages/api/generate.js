import { Configuration, OpenAIApi } from "openai";

let client = new OpenAIApi();

export default async function (req, res) {
  console.log(req.body.animal)
  if (!process.env.OPENAI_API_KEY && !req.body.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, https://beta.openai.com/account/api-keys ",
      }
    });
  }
  if (req.body.apiKey){
    const configuration = new Configuration({
      apiKey: req.body.apiKey,
    });
    client = new OpenAIApi(configuration)
  }
  if (process.env.OPENAI_API_KEY){
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    client = new OpenAIApi(configuration)
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      }
    });
    return;
  }
  try {
    const completion = await client.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}
function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Suggest three names for an animal that is a superhero.

Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`;
}
