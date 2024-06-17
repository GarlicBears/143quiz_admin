import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Components/common/Layout';
import Dashboard from './Pages/Dashboard';
import Login from './Pages/Login';
import Visitor from './Pages/Visitor';
import GameStat from './Pages/GameStat';
import UserSetting from './Pages/UserSetting';
import AdminSetting from './Pages/AdminSetting';
import TopicSetting from './Pages/TopicSetting';
import Error from './Pages/Error';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/visitors" element={<Visitor />} />
          <Route path="/gamestats" element={<GameStat />} />
          <Route path="/usersetting" element={<UserSetting />} />
          <Route path="/adminsetting" element={<AdminSetting />} />
          <Route path="/topicsetting" element={<TopicSetting />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path={'*'} element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;
