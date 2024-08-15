import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Inventory from './components/Inventory';
import CreateInvoice from './components/CreateInvoice';
import AutoReturn from './components/AutoReturn';
import InventoryManagement from './components/InventoryManagement';

import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Box } from '@mui/system';

function App() {
  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Warehouse Manager
            </Typography>
            <Button color="inherit" component={Link} to="/">Inventory</Button>
            <Button color="inherit" component={Link} to="/manage-inventory">Manage Inventory</Button>
            <Button color="inherit" component={Link} to="/create-invoice">Create Invoice</Button>
            <Button color="inherit" component={Link} to="/auto-return">Auto Return</Button>
          </Toolbar>
        </AppBar>

        <Container sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<Inventory />} />
            <Route path="/manage-inventory" element={<InventoryManagement />} />
            <Route path="/create-invoice" element={<CreateInvoice />} />
            <Route path="/auto-return" element={<AutoReturn />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
}

export default App;
