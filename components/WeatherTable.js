import { useState, useEffect } from 'react'
import axios from 'axios'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'

const WeatherTable = () => {
  const [weatherData, setWeatherData] = useState(null)
  const [advice, setAdvice] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ipResponse = await axios.get('https://api.ipify.org?format=json')
        const ipAddress = ipResponse.data.ip
        const weatherResponse = await axios.get(`/api/getWeatherData?ipAddress=${ipAddress}`)
        setWeatherData(weatherResponse.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [])

  const onClick = () => {
    setIsModalOpen(true)
    setTimeout(() => setIsModalOpen(false), 400)
  }

  useEffect(() => {
    let cancel

    const getAdvice = async () => {
      if (weatherData !== null) {
        try {
          const response = await axios.post(
            '/api/getAdvice',
            { weatherData },
            {
              cancelToken: new axios.CancelToken((c) => (cancel = c)),
            }
          )
          const advice = response.data.advice
          setAdvice(advice)
        } catch (error) {
          console.error(error)
        }
      }
    }

    getAdvice()

    return () => {
      if (typeof cancel === 'function') {
        cancel()
      }
    }
  }, [weatherData])

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const capitalizeWords = (str) => {
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className="weather-container">
      {weatherData ? (
        <div className="weather-data">
          <div className="weather-status">
            <h3 className="weather-header">
              {`Current Weather in ${weatherData.location.name} is
            ${capitalizeWords(weatherData.current.condition.text)}`}
            </h3>

            {advice ? (
              <div className="weather-condition">
                <Tooltip id="my-tooltip" />
                <button
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="What AI says to pack for the day"
                  data-tooltip-place="top"
                  onClick={() => setIsModalOpen(true)}
                >
                  <img
                    className="weather-icon"
                    src={`https:${weatherData.current.condition.icon}`}
                    alt={weatherData.current.condition.text}
                  />
                </button>
              </div>
            ) : (
              <img
                className="weather-icon"
                src={`https:${weatherData.current.condition.icon}`}
                alt={weatherData.current.condition.text}
              />
            )}
          </div>
          <table>
            <tbody>
              <tr>
                <td>{`Cloud coverage is ${weatherData.current.cloud}%`}</td>
              </tr>
              <tr>
                <td>{`Temperature is ${weatherData.current.temp_f}F/${weatherData.current.temp_c}C`}</td>
              </tr>
              <tr>
                <td>{`It feels like ${weatherData.current.feelslike_f}F/${weatherData.current.feelslike_c}C`}</td>
              </tr>
              <tr>
                <td>{`Humidity is ${weatherData.current.humidity}%`}</td>
              </tr>
              <tr></tr>
              <tr>
                <td>{`Visibility is at ${weatherData.current.vis_miles} miles`}</td>
              </tr>
              <tr>
                <td>{`Current wind speed is ${weatherData.current.wind_mph} mph`}</td>
              </tr>
              {weatherData.current.gust_mph > 8 && (
                <tr>
                  <td>{`Winds are gusting at ${weatherData.current.gust_mph} mph`}</td>
                </tr>
              )}
              <tr>
                <td>{`Wind direction is ${weatherData.current.wind_dir}`} </td>
              </tr>
            </tbody>
          </table>
          {isModalOpen && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal-advice">
                <button className="close-button" onClick={closeModal}>
                  X
                </button>
                <div>
                  <h3>Advice on How to Pack Today</h3>
                  <p>{advice}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default WeatherTable
