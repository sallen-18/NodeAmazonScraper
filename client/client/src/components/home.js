import '../App.css';

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        try {
        const response = await axios.post('/process-url', { url });
        if(response.status === 200){
            navigate('/piechart', {state:{data:response.data}})
        }
        
        
        } catch (error) {
        setError('Something went wrong. Please try again.');
        }
    };

    return (
        <> 
            <form onSubmit={handleSubmit}>
                <input type="text" value={url} onChange={(event) => setUrl(event.target.value)} />
                <button type="submit">Submit</button>
            </form>
            {error ? <div style={{color: 'red'}}>{error}</div> : null}
        </>
    );
}

export default Home;