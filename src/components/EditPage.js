import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditPage = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the asset index or ID from the URL
    const [asset, setAsset] = useState(null);

    useEffect(() => {
        const fetchAsset = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/get_pipeline_stage');
                setAsset(response.data.dataset[id]); // Assuming 'id' corresponds to the asset index
            } catch (err) {
                console.error('Error fetching asset:', err);
            }
        };
        fetchAsset();
    }, [id]);

    const handleSave = async () => {
        try {
            await axios.post('http://127.0.0.1:5000/update_pipeline_data', {
                data: asset, // Send the updated data
            });
            navigate('/overview'); // Redirect to the overview page after saving
        } catch (err) {
            console.error('Error saving asset:', err);
        }
    };

    const handleChange = (e) => {
        setAsset({ ...asset, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <h2>Edit Asset</h2>
            {asset ? (
                <div>
                    <label>Asset Name:</label>
                    <input
                        type="text"
                        name="Asset"
                        value={asset.Asset}
                        onChange={handleChange}
                    />
                    <label>Latitude:</label>
                    <input
                        type="text"
                        name="Latitude"
                        value={asset.Latitude}
                        onChange={handleChange}
                    />
                    <label>Longitude:</label>
                    <input
                        type="text"
                        name="Longitude"
                        value={asset.Longitude}
                        onChange={handleChange}
                    />
                    <button onClick={handleSave}>Save Changes</button>
                </div>
            ) : (
                <p>Loading asset data...</p>
            )}
        </div>
    );
};

export default EditPage;