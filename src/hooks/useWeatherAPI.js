import { useCallback, useEffect, useState } from 'react';

const fetchCurrentWeather = ({ authorizationKey, locationName }) => {
    return fetch(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&locationName=${locationName}`
    )
      .then((response) => response.json())
      .then((data) => {
        // STEP 1：定義 `locationData` 把回傳的資料中會用到的部分取出來
        const locationData = data.records.location[0];
  
        // STEP 2：將風速（WDSD）和氣溫（TEMP）的資料取出
        const weatherElements = locationData.weatherElement.reduce(
          (neededElements, item) => {
            if (['WDSD', 'TEMP'].includes(item.elementName)) {
              neededElements[item.elementName] = item.elementValue;
            }
            return neededElements;
          },
          {}
        );
  
        return {
          observationTime: locationData.time.obsTime,
          locationName: locationData.locationName,
          temperature: weatherElements.TEMP,
          windSpeed: weatherElements.WDSD,
        }
      });
  };
  
  const fetchWeatherForecast = ({ authorizationKey, cityName }) => {
    return fetch(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const locationData = data.records.location[0]
        const weatherElements = locationData.weatherElement.reduce(
          (neededElements, item) => {
            if (['Wx', 'PoP', 'CI'].includes(item.elementName)) {
              neededElements[item.elementName] = item.time[0].parameter;
            }
            return neededElements;
          },
          {}
        );
  
        return {
          description: weatherElements.Wx.parameterName,
          weatherCode: weatherElements.Wx.parameterValue,
          rainPossibility: weatherElements.PoP.parameterName,
          comfortability: weatherElements.CI.parameterName,        
        };
      });
  };

const useWeatherAPI = ({ locationName, authorizationKey, cityName }) => {

    // 定義會使用到的資料狀態
    const [weatherElement, setWeatherElement] = useState({
      observationTime: new Date(),
      locationName: '',
      description: '',
      windSpeed: 0,
      temperature: 0,
      rainPossibility: 0,
      isLoading: true, 
    });

    const fetchData = useCallback(async () => {
        setWeatherElement((prevState) => ({
          ...prevState,
          isLoading: true,
        }));
    
        const [currentWeather, weatherForecast] = await Promise.all([
          fetchCurrentWeather({ authorizationKey, locationName }),
          fetchWeatherForecast({ authorizationKey, cityName }), 
        ])
    
        setWeatherElement({
          ...currentWeather, 
          ...weatherForecast,
          isLoading: false, 
        })
    }, [authorizationKey, cityName, locationName])

    useEffect(() => {
    fetchData();
    }, [fetchData]);

    return [weatherElement, fetchData];
}

export default useWeatherAPI;