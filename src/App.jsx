import React, { useState, useEffect, useRef } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import EntryPage from './components/EntryPage';
import RoomPage from './components/RoomPage';

import './App.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <EntryPage />
  },
  {
    path: "/room/:roomid",
    element: <RoomPage/>
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
