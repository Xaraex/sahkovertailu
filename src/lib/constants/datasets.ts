// Fingrid API datasetit
export const FINGRID_DATASETS = {
    // Sähkön kulutus ja tuotanto
    CONSUMPTION: {
        id: 193,
        name: "Sähkön kulutus Suomessa - reaaliaikatieto",
        unit: "MW",
        description: "Koko Suomen sähkön kulutus, päivittyy 3 minuutin välein",
    },
    CONSUMPTION_FORECAST: {
        id: 166,
        name: "Sähkön kulutusennuste",
        unit: "MW",
        description: "Ennuste sähkön kulutuksesta Suomessa",
    },
    CONSUMPTION_FORECAST_24H: {
        id: 165,
        name: "Sähkön kulutusennuste - seuraavat 24 tuntia",
        unit: "MW",
        description: "Ennuste sähkön kulutuksesta seuraavien 24 tunnin aikana",
    },
    PRODUCTION: {
        id: 192,
        name: "Sähkön tuotanto Suomessa - reaaliaikatieto",
        unit: "MW",
        description: "Koko Suomen sähkön tuotanto, päivittyy 3 minuutin välein",
    },
    PRODUCTION_FORECAST: {
        id: 241,
        name: "Sähkön tuotantoennuste",
        unit: "MW",
        description: "Ennuste sähkön tuotannosta, päivittyy 15 minuutin välein",
    },

    // Tuotanto lähteittäin
    NUCLEAR: {
        id: 188,
        name: "Ydinvoiman tuotanto - reaaliaikatieto",
        unit: "MW",
        description: "Ydinvoiman tuotanto Suomessa, päivittyy tunnin välein",
    },
    HYDRO: {
        id: 191,
        name: "Vesivoiman tuotanto - reaaliaikatieto",
        unit: "MW",
        description: "Vesivoiman tuotanto Suomessa, päivittyy tunnin välein",
    },
    WIND: {
        id: 181,
        name: "Tuulivoiman tuotanto - reaaliaikatieto",
        unit: "MW",
        description: "Tuulivoiman tuotanto Suomessa, päivittyy tunnin välein",
    },
    WIND_FORECAST_15MIN: {
        id: 245,
        name: "Tuulivoimatuotannon ennuste",
        unit: "MW",
        description: "Tuulivoimatuotannon ennuste, päivittyy 15 minuutin välein",
    },
    WIND_FORECAST_DAILY: {
        id: 246,
        name: "Tuulivoimatuotannon ennuste",
        unit: "MW",
        description: "Tuulivoimatuotannon ennuste, päivittyy kerran päivässä",
    },
    SOLAR_FORECAST: {
        id: 248,
        name: "Aurinkovoimatuotannon ennuste",
        unit: "MW",
        description: "Aurinkovoimatuotannon ennuste, päivittyy 15 minuutin välein",
    },
    DISTRICT_HEATING_CHP: {
        id: 201,
        name: "Kaukolämmön yhteistuotanto - reaaliaikatieto",
        unit: "MW",
        description: "Kaukolämmön yhteistuotanto, päivittyy tunnin välein",
    },
    INDUSTRIAL_CHP: {
        id: 202,
        name: "Teollisuuden yhteistuotanto - reaaliaikatieto",
        unit: "MW",
        description: "Teollisuuden yhteistuotanto, päivittyy tunnin välein",
    },
    SMALL_SCALE_PRODUCTION: {
        id: 362,
        name: "Pienimuotoinen sähkön ylijäämätuotanto tuotantomuodoittain",
        unit: "MW",
        description: "Pienimuotoinen sähkön tuotanto tuotantomuodoittain",
    },

    // Päästötiedot
    CO2_EMISSIONS_CONSUMPTION: {
        id: 265,
        name: "Suomessa kulutetun sähkön päästökerroin - reaaliaikatieto",
        unit: "gCO2/kWh",
        description: "Arvio sähkön kulutuksen hiilidioksidipäästöistä kilowattituntia kohden",
    },
    CO2_EMISSIONS_PRODUCTION: {
        id: 266,
        name: "Suomessa tuotetun sähkön päästökerroin - reaaliaikatieto",
        unit: "gCO2/kWh",
        description: "Arvio sähkön tuotannon hiilidioksidipäästöistä kilowattituntia kohden",
    },

    // Hintatiedot (Fingridin kautta saatavilla olevat)
    UP_REGULATION_PRICE: {
        id: 244,
        name: "Säätösähkömarkkinan ylössäätöhinta",
        unit: "€/MWh",
        description: "Säätösähkömarkkinan ylössäätöhinta",
    },
    DOWN_REGULATION_PRICE: {
        id: 106,
        name: "Säätösähkömarkkinan alassäätöhinta",
        unit: "€/MWh",
        description: "Säätösähkömarkkinan alassäätöhinta",
    },
    IMBALANCE_PRICE: {
        id: 319,
        name: "Tasesähkön hinta",
        unit: "€/MWh",
        description: "Tasesähkön hinta",
    }
};

// Tietotyypit API-vastauksille
export interface FingridDataPoint {
    value: number;
    start_time: string;
    end_time: string;
}

export interface FingridResponse {
    data: FingridDataPoint[];
}

// Aikaikkuna-valinnat datan hakemiselle
export enum TimeWindow {
    DAY = "day",
    WEEK = "week",
    MONTH = "month",
    YEAR = "year",
}

// Kiinteän hinnan sopimukset (esimerkkiarvot)
export const FIXED_PRICE_OPTIONS = {
    HALPA: 4.5,    // snt/kWh
    KESKIHINTA: 6.0,  // snt/kWh
    KALLIS: 8.0 // snt/kWh
};