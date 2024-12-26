import React, { useState } from 'react';
import axios from 'axios';

const MathPipeline = () => {
    const [result, setResult] = useState(0); // Store the current result
    const [increment, setIncrement] = useState(0); // Store user input

    // Fetch the current result from the backend
    const fetchResult = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/get_result');
            setResult(response.data.result);
        } catch (error) {
            console.error('Error fetching result:', error);
        }
    };

    // Send user input to update the pipeline
    const updatePipeline = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/update_pipeline', {
                increment: parseInt(increment, 10),
            });
            setResult(response.data.result);
        } catch (error) {
            console.error('Error updating pipeline:', error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Math Pipeline</h2>
            <div>
                <button onClick={fetchResult}>Fetch Current Result</button>
            </div>
            <p>Current Result: {result}</p>
            <div>
                <input
                    type="number"
                    value={increment}
                    onChange={(e) => setIncrement(e.target.value)}
                    placeholder="Enter increment value"
                />
                <button onClick={updatePipeline}>Update Pipeline</button>
            </div>
        </div>
    );
};

export default MathPipeline;
