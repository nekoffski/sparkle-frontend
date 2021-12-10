import React from 'react';
import Main from './components/MainComponent';
import { BrowserRouter } from 'react-router-dom';


import './App.css';

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Main/>
      </BrowserRouter>
    </div>
  );
}

export default App;
