import { Router } from 'express';

const router = Router();

router.get('/weather/:city', async (req, res) => {
  const { city } = req.params;
  const apiKey = process.env.WEATHER_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'Weather API Key is missing' });
  }

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    
    if (data.cod !== 200) {
      return res.status(data.cod).json({ error: data.message });
    }

    res.json({
      temp: data.main.temp,
      description: data.weather[0].description,
      isBadWeather: data.weather[0].main === 'Rain' || data.weather[0].main === 'Thunderstorm'
    });
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({ error: 'Failed to fetch weather' });
  }
});

export default router;
