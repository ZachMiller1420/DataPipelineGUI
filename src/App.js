import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PipelineTransformation from './components/PipelineSimulation';
import AssetOverview from './components/AssetOverview';

function App() {
    return (
        <Router>
            <div className="App">
                <nav style={{ margin: '20px' }}>
                    <Link to="/" style={{ marginRight: '10px' }}>Pipeline Transformation</Link>
                    <Link to="/assets">Asset Overview</Link>
                </nav>
                <Routes>
                    <Route path="/" element={<PipelineTransformation />} />
                    <Route path="/assets" element={<AssetOverview />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;


