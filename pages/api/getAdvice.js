import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_APIKEY,
})
const openai = new OpenAIApi(configuration)
// only add a period if the last character is not punctuation
function addPeriod(text) {
  const punctuation = ['.', '!']
  const lastCharacter = text[text.length - 1]
  if (!punctuation.includes(lastCharacter)) {
    return `${text}.`
  }
  return text
}

async function handler(req, res) {
  const { weatherData } = req.body

  if (weatherData) {
    const prompt = `In the voice of Willard Scott without saying so, and presence based on current time as ${weatherData.location.localtime} and based on current weather described as ${weatherData.current.condition.text} and weather conditions consisting of Cloud Coverage is ${weatherData.current.cloud}% and Temperature is ${weatherData.current.temp_f}F and Humidity is ${weatherData.current.humidity}% and Precipitation for the day is ${weatherData.current.precip_in} inches and Current Wind Speed is ${weatherData.current.wind_mph} mph and Winds are Gusting at ${weatherData.current.gust_mph} mph, any advice on what I should pack when going outside, as in outerwear, and/or an umbrella? Limit 140 characters.`
    try {
      const { data } = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt,
        temperature: 0.7, // Adjust based on desired randomness vs. coherence
        max_tokens: 100, // Adjust based on desired response length
        top_p: 1,
        frequency_penalty: 0.2, // Fine-tune to control repetitiveness
        presence_penalty: 0.6, // Fine-tune to encourage relevant responses
        stop: '\\n',
      })
      const advice = data.choices[0].text.trim()
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.status(200).json({ advice })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'An error occurred while fetching advice' })
    }
  } else {
    res.status(400).json({ message: 'Invalid request data' })
  }
}

export default handler
//
