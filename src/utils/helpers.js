import sunriseAndSunsetData from './sunrise-sunset.json';

export const getMoment = (locationName) => {
  const location = sunriseAndSunsetData.find(
    (data) => data.locationName === locationName
  );

  if (!location) {
    throw new Error(`找不到 ${location} 的日出日落資料`);
  }

  const now = new Date();
  const nowDate = Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(now)
    .replace(/\//g, '-');

  const locationDate = location?.time.find((time) => time.dataTime === nowDate);

  if (!locationDate) {
    throw new Error(`找不到 ${locationName} 在 ${nowDate} 的日出日落資料`);
  }

  const sunriseTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunrise}`
  ).getTime();
  const sunsetTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunset}`
  ).getTime();
  const nowTimeStamp = now.getTime();

  return sunriseTimestamp <= nowTimeStamp && nowTimeStamp <= sunsetTimestamp
    ? 'day'
    : 'night';
};

export const availableLocations = [
  {
    cityName: '臺北市',
    locationName: '臺北',
    sunriseCityName: '臺北市',
  },
  {
    cityName: '桃園市',
    locationName: '新屋',
    sunriseCityName: '桃園市',
  },
  {
    cityName: '高雄市',
    locationName: '高雄',
    sunriseCityName: '高雄市',
  },
  {
    cityName: '臺中市',
    locationName: '臺中',
    sunriseCityName: '臺中市',
  },
  {
    cityName: '新北市',
    locationName: '板橋',
    sunriseCityName: '新北市',
  },
];

export const findLocation = (cityName) => {
  return availableLocations.find((location) => location.cityName === cityName);
};