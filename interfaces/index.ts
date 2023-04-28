export interface ClimateRiskData {
    'Asset Name': string;
    Lat: string;
    Long: string;
    'Business Category': string;
    'Risk Rating': number;
    'Risk Factors': string;
    Year: number;
}

export interface RiskFactors {
    Hurricane: number
    'Extreme heat': number
    Tornado: number
    Wildfire: number
    Flooding: number
}

export interface GraphData {
    initialData: ClimateRiskData[]
    decade?: number
}