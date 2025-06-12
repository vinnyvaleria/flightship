// src/utils/analyseWeather

const analyseWeather = (data) => {
    const values = data?.values || {};

    return {
        // true if the value is higher than 50%
        isRainLikely:
            values.precipitationProbability > 50 || values.rainIntensity > 0.2,

        isSnowLikely: values.snowIntensity > 0,
        isWindy: values.windGust > 12,
    };
};

export default analyseWeather;
