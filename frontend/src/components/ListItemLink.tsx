// src/components/ListItemLink.tsx
import React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { ListItemButton, ListItemButtonProps } from '@mui/material';

type ListItemLinkProps = {
  to: string;
} & ListItemButtonProps & Omit<RouterLinkProps, 'to'>;

const ListItemLink = React.forwardRef<HTMLDivElement, ListItemLinkProps>(function ListItemLink(
  props,
  ref
) {
  const { to, children, ...other } = props;

  return (
    <ListItemButton component={RouterLink} to={to} ref={ref} {...other}>
      {children}
    </ListItemButton>
  );
});

export default ListItemLink;
