import React from 'react';
import { Outlet } from 'react-router';
import styled from 'styled-components';
import { Navbar } from '../components/navbar';

const AbsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  height: 100%;
  width: 100%;
  overflow: auto;
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: start;
  min-height: 100vh;
  width: 70%;
  margin: 80px auto;
  font-size: calc(10px + 2vmin);
  color: white;

  @media (max-width: 768px) {
    margin: 20px !important;
    width: unset;
  }
`;

function App() {
  return (
    <AbsContainer>
      <Navbar />
      <AppContainer>
        <h1>Fund Management</h1>
        <Outlet context={{}}/>
      </AppContainer>
    </AbsContainer>
  );
}

export default App;
