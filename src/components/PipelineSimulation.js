import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Progress, Input, Row, Col } from 'reactstrap'; // Bootstrap components

const PipelineTransformation = () => {
    const [pipelineData, setPipelineData] = useState([]);
    const [transformedData, setTransformedData] = useState([]);
    const [step, setStep] = useState(0);

    // Fetch current pipeline data from the backend
    useEffect(() => {
        const fetchPipelineData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/get_pipeline_stage');
                const data = response.data.dataset || [];
                setPipelineData(data);
                setTransformedData([...data]); // Initialize transformedData with a copy of pipelineData
                setStep(response.data.step);
            } catch (err) {
                console.error('Error fetching pipeline data:', err);
            }
        };
        fetchPipelineData();
    }, []);

    // Apply the next transformation to the data
    const processNextStage = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/process_next_stage');
            setPipelineData(response.data.dataset);
            setStep(response.data.step);
        } catch (err) {
            console.error('Error processing next stage:', err);
        }
    };

    // Allow user to update pipeline data directly
    const updatePipelineData = async () => {
        try {
            await axios.post('http://127.0.0.1:5000/update_pipeline_data', { data: transformedData });
            alert('Pipeline data updated successfully!');
        } catch (err) {
            console.error('Error updating pipeline data:', err);
        }
    };

    // Handle editing a data entry
    const handleEdit = (index, key, value) => {
        setTransformedData((prevData) => {
            const updatedData = [...prevData];
            if (!updatedData[index]) {
                updatedData[index] = {}; // Ensure the object exists
            }
            updatedData[index][key] = value; // Update the specific key with the value
            return updatedData;
        });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Pipeline Transformation</h2>

            {/* Step Indicators and Progress Bar */}
            <div className="mb-4">
                <h4>Step {step + 1} of 3</h4>
                <Progress value={(step + 1) * 33.33} max={100} />
                <div className="d-flex justify-content-between">
                    <span>Step 1</span>
                    <span>Step 2</span>
                    <span>Step 3</span>
                </div>
            </div>

            {/* Data Table */}
            <div className="mb-4">
                <h3>Pipeline Data (Step {step})</h3>
                <Table striped>
                    <thead>
                        <tr>
                            <th>Asset</th>
                            <th>Latitude</th>
                            <th>Longitude</th>
                            <th>Operational Status</th>
                            <th>Speed</th>
                            <th>Heading</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pipelineData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.Asset}</td>
                                <td>{item.Latitude}</td>
                                <td>{item.Longitude}</td>
                                <td>{item.OperationalStatus}</td>
                                <td>
                                    <Input
                                        type="number"
                                        value={transformedData[index]?.Speed || item.Speed || ''}
                                        onChange={(e) =>
                                            handleEdit(index, 'Speed', e.target.value)
                                        }
                                    />
                                </td>
                                <td>
                                    <Input
                                        type="number"
                                        value={transformedData[index]?.Heading || item.Heading || ''}
                                        onChange={(e) =>
                                            handleEdit(index, 'Heading', e.target.value)
                                        }
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Action Buttons */}
            <Row>
                <Col>
                    <Button color="primary" onClick={processNextStage}>
                        Process Next Stage
                    </Button>
                </Col>
                <Col>
                    <Button color="success" onClick={updatePipelineData}>
                        Update Pipeline Data
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default PipelineTransformation;


