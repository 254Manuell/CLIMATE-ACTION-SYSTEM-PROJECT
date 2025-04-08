// AQI breakpoints for different pollutants
const PM25_BREAKPOINTS = [
  { min: 0, max: 12.0, aqi_min: 0, aqi_max: 50 },
  { min: 12.1, max: 35.4, aqi_min: 51, aqi_max: 100 },
  { min: 35.5, max: 55.4, aqi_min: 101, aqi_max: 150 },
  { min: 55.5, max: 150.4, aqi_min: 151, aqi_max: 200 },
  { min: 150.5, max: 250.4, aqi_min: 201, aqi_max: 300 },
  { min: 250.5, max: 500.4, aqi_min: 301, aqi_max: 500 }
];

const PM10_BREAKPOINTS = [
  { min: 0, max: 54, aqi_min: 0, aqi_max: 50 },
  { min: 55, max: 154, aqi_min: 51, aqi_max: 100 },
  { min: 155, max: 254, aqi_min: 101, aqi_max: 150 },
  { min: 255, max: 354, aqi_min: 151, aqi_max: 200 },
  { min: 355, max: 424, aqi_min: 201, aqi_max: 300 },
  { min: 425, max: 604, aqi_min: 301, aqi_max: 500 }
];

const NO2_BREAKPOINTS = [
  { min: 0, max: 53, aqi_min: 0, aqi_max: 50 },
  { min: 54, max: 100, aqi_min: 51, aqi_max: 100 },
  { min: 101, max: 360, aqi_min: 101, aqi_max: 150 },
  { min: 361, max: 649, aqi_min: 151, aqi_max: 200 },
  { min: 650, max: 1249, aqi_min: 201, aqi_max: 300 },
  { min: 1250, max: 2049, aqi_min: 301, aqi_max: 500 }
];

function calculatePollutantAQI(concentration: number, breakpoints: typeof PM25_BREAKPOINTS) {
  for (const bp of breakpoints) {
    if (concentration >= bp.min && concentration <= bp.max) {
      return Math.round(
        ((bp.aqi_max - bp.aqi_min) / (bp.max - bp.min)) * 
        (concentration - bp.min) + 
        bp.aqi_min
      );
    }
  }
  return concentration > breakpoints[breakpoints.length - 1].max ? 500 : 0;
}

export function calculateAQI(PM25: number, PM10: number, NO2: number): number {
  const pm25AQI = calculatePollutantAQI(PM25, PM25_BREAKPOINTS);
  const pm10AQI = calculatePollutantAQI(PM10, PM10_BREAKPOINTS);
  const no2AQI = calculatePollutantAQI(NO2, NO2_BREAKPOINTS);

  // Return the highest AQI value among all pollutants
  return Math.max(pm25AQI, pm10AQI, no2AQI);
}

export function getAQICategory(aqi: number): {
  category: string;
  color: string;
  description: string;
} {
  if (aqi <= 50) {
    return {
      category: "Good",
      color: "green",
      description: "Air quality is satisfactory, and air pollution poses little or no risk."
    };
  } else if (aqi <= 100) {
    return {
      category: "Moderate",
      color: "yellow",
      description: "Air quality is acceptable. However, there may be a risk for some people."
    };
  } else if (aqi <= 150) {
    return {
      category: "Unhealthy for Sensitive Groups",
      color: "orange",
      description: "Members of sensitive groups may experience health effects."
    };
  } else if (aqi <= 200) {
    return {
      category: "Unhealthy",
      color: "red",
      description: "Everyone may begin to experience health effects."
    };
  } else if (aqi <= 300) {
    return {
      category: "Very Unhealthy",
      color: "purple",
      description: "Health warnings of emergency conditions. The entire population is likely to be affected."
    };
  } else {
    return {
      category: "Hazardous",
      color: "maroon",
      description: "Health alert: everyone may experience more serious health effects."
    };
  }
}
