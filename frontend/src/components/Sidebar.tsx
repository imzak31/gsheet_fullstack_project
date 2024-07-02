// src/components/Sidebar.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { List, ListItemText, Box } from '@mui/material';
import { styled } from '@mui/system';
import ListItemLink from './ListItemLink';
import { routePaths } from '../routes/routePaths';

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: '20%',
  height: '100vh',
  backgroundColor: '#f4f4f4',
  boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const StyledListItemLink = styled(ListItemLink)(({ theme }) => ({
  '&.active': {
    backgroundColor: 'rgba(0, 0, 128, 0.1)',
    color: 'navy',
  },
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 128, 0.2)',
    color: 'navy',
  },
}));

const options = [
  { text: 'Import a Sheet', path: routePaths.importSheet },
  { text: 'Vacations Registered', path: routePaths.vacationsRegistered },
  { text: 'Import Errors', path: routePaths.importErrors },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <SidebarContainer>
      <List>
        {options.map(option => (
          <StyledListItemLink
            key={option.path}
            to={option.path}
            selected={location.pathname === option.path}
          >
            <ListItemText primary={option.text} />
          </StyledListItemLink>
        ))}
      </List>
    </SidebarContainer>
  );
}
