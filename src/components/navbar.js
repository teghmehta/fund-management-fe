// navbar component using styled components
// links to Transactions, Blocks

import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NavbarContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
    background-color: lightgray;
    border-radius: 4px;
    box-sizing: border-box;

`;

// use react router

const NavItem = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    @media (max-width: 768px) {
        margin: 20px !important;
        width: unset;
    }
`;

const NavItemLink = styled(Link)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 300;

    color: black;
    text-decoration: none;
    padding: 5px 20px;

    @media (max-width: 768px) {
        width: unset;
    }

    &:hover {
        background-color: #555;
    }

    &:active {
        background-color: #777;
    }

`;

export const Navbar = () => {
    return (
        <NavbarContainer>
            <NavItem>
                <h2>Fund Management</h2>
            </NavItem>
        </NavbarContainer>
    );
}