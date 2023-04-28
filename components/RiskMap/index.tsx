'use client'

import { LoadScript, GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { FC, useEffect, useState } from "react";
import { DECADES } from "../../constants";
import { ClimateRiskData } from "../../interfaces";
import { loadClimateRiskData } from "../../utils/loadClimateRiskData.util";
import getMarkerIcon from "../../utils/getMarkerIcon.util";

export default function RiskMap() {
    const [selectedDecade, setSelectedDecade] = useState(DECADES[0]);
    const [selectedAsset, setSelectedAsset] = useState<ClimateRiskData | null>(null);
    const [climateRiskData, setClimateRiskData] = useState<ClimateRiskData[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await loadClimateRiskData();
                console.log('Loaded JSON data:', data);
                setClimateRiskData(data);
            } catch (error) {
                console.error('Error loading data:', error);
            }
        }
        fetchData();
    }, []);

    const filteredData = climateRiskData.filter((dataPoint) => {
        return Math.floor(dataPoint.Year / 10) * 10 === selectedDecade;
    });

    const mapStyles = {
        width: '100%',
        height: '100vh',
    };

    const defaultCenter = {
        lat: 0,
        lng: 0,
    };

    const fitBoundsToMarkers = (map: google.maps.Map) => {
        const bounds = new google.maps.LatLngBounds();
        filteredData.forEach((dataPoint) => {
            bounds.extend({ lat: parseFloat(dataPoint.Lat), lng: parseFloat(dataPoint.Long) });
        });
        map.fitBounds(bounds);
    }

    console.log(climateRiskData)
    console.log(selectedAsset)

    return (
        <div>
            <select value={selectedDecade} onChange={(e) => setSelectedDecade(parseInt(e.target.value))}>
                {DECADES.map((decade) => (
                    <option key={decade} value={decade}>
                        {decade}
                    </option>
                ))}
            </select>

            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''}>
                <GoogleMap mapContainerStyle={mapStyles} zoom={2} center={defaultCenter} options={{ gestureHandling: "greedy" }}>
                    {filteredData.map((dataPoint, index) => (
                        <Marker
                            key={index}
                            position={{ lat: parseFloat(dataPoint.Lat), lng: parseFloat(dataPoint.Long) }}
                            icon={{
                                url: getMarkerIcon(dataPoint['Risk Rating']),
                            }}
                            onClick={() => setSelectedAsset(dataPoint)}
                        />
                    ))}
                    {selectedAsset && (
                        <InfoWindow
                            position={{ lat: parseFloat(selectedAsset.Lat), lng: parseFloat(selectedAsset.Long) }}
                            onCloseClick={() => setSelectedAsset(null)}
                        >
                            <>
                                <h2>{selectedAsset['Asset Name']}</h2>
                                <p>{selectedAsset['Business Category']}</p>
                            </>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>
        </div>
    )
}