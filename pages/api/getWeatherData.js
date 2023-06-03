import axios from 'axios'

export default async function handler(req, res) {
  const { ipAddress } = req.query

  try {
    const response = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHERAPI_APIKEY}&q=${ipAddress}`
    )

    // Set CORS header
    res.setHeader('Access-Control-Allow-Origin', '*')

    // Set Cache-Control header for caching
    // This example caches for 15 minutes
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate')

    res.status(200).json(response.data)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred while fetching weather data' })
  }
}
