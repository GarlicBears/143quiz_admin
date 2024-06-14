import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Components/common/Layout';
import Dashboard from './Pages/Dashboard';
import Login from './Pages/Login';
import Error from './Pages/Error';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path={'*'} element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;
