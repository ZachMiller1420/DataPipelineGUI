import React, { useState, useEffect } from 'react';
import axios from 'axios';
import worldMap from '../images/world_bluemarble_pol.jpg';

const AssetOverview = () => {
    const [assets, setAssets] = useState([]);
    const [error, setError] = useState(null);

    const fetchFinalDataset = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/get_pipeline_stage');
            if (response.data.step < 2) {
                setError('Pipeline not complete. Complete all stages to view assets.');
                setAssets([]);
            } else {
                setAssets(response.data.dataset || []);
            }
        } catch (err) {
            setError('Error fetching final dataset.');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchFinalDataset();
    }, []);

    // Function to calculate marker position on the world map image based on lat/long
    const getMarkerStyle = (latitude, longitude, status) => {
        const imageWidth = 1200; // Width of the image in pixels
        const imageHeight = 600; // Height of the image in pixels

        // Set geographical bounds for the map (for world map, using the whole globe)
        const latMin = -90;  // Southernmost latitude
        const latMax = 90;   // Northernmost latitude
        const lonMin = -180; // Westernmost longitude
        const lonMax = 180;  // Easternmost longitude

        // Normalize the latitude and longitude to pixel coordinates on the image
        const x = ((longitude - lonMin) / (lonMax - lonMin)) * imageWidth;
        const y = ((latMax - latitude) / (latMax - latMin)) * imageHeight;

        // Determine the marker color based on status
        let markerColor = 'gray'; // Default color
        switch (status.toLowerCase()) {
            case 'operational':
                markerColor = 'green';
                break;
            case 'not operational':
                markerColor = 'red';
                break;
            case 'unknown':
                markerColor = 'yellow';
                break;
            default:
                markerColor = 'gray'; // Default color for unexpected status
        }

        return { left: `${x}px`, top: `${y}px`, backgroundColor: markerColor };
    };

    // Function to get the background color based on the operational status
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'operational':
                return 'green';
            case 'not operational':
                return 'red';
            case 'unknown':
                return 'yellow';
            default:
                return 'gray'; // Default color for any unexpected value
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Asset Overview</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* World Map as Background */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '500px',
                    backgroundImage: `url(${worldMap})`, // Using the imported image
                    backgroundSize: 'cover',  // Ensure the image covers the entire div
                    backgroundPosition: 'center',  // Center the image
                    marginBottom: '20px',
                }}
            >
                {/* Markers for each asset */}
                {assets.map((asset, index) => {
                    const markerStyle = getMarkerStyle(asset.Latitude, asset.Longitude, asset.OperationalStatus);
                    return (
                        <div
                            key={index}
                            style={{
                                position: 'absolute',
                                ...markerStyle,
                                width: '15px',
                                height: '15px',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                title: asset.Asset,
                            }}
                        />
                    );
                })}
            </div>

            {/* Display Final Dataset */}
            <div style={{ marginTop: '30px' }}>
                <h3>Final Dataset</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Asset</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Latitude</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Longitude</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Operational Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assets.map((asset, index) => (
                            <tr key={index}>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{asset.Asset}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{asset.Latitude}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{asset.Longitude}</td>
                                <td
                                    style={{
                                        border: '1px solid #ddd',
                                        padding: '8px',
                                        backgroundColor: getStatusColor(asset.OperationalStatus), // Apply color based on status
                                        color: 'white', // Text color for better contrast
                                        textAlign: 'center',
                                    }}
                                >
                                    {asset.OperationalStatus}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssetOverview;



