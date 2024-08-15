import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from '@mui/material';

function Inventory() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/items');
        setItems(res.data);
      } catch (err) {
        setError('Failed to fetch inventory items');
        console.error('Error fetching items:', err);
      }
    };
    fetchItems();
  }, []);

  const handleResetInventory = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/items/reset-inventory');
      if (response.status === 200) {
        setItems([]);
        alert('Inventory and invoices have been reset successfully');
      }
    } catch (error) {
      console.error('Error resetting inventory:', error);
      alert('Failed to reset inventory and invoices');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Inventory Management
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Button
        variant="contained"
        color="secondary"
        onClick={handleResetInventory}
        sx={{ mb: 2 }}
      >
        Reset Inventory and Invoices
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item Code</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Unit of Measure</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.itemCode}>
                <TableCell>{item.itemCode}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.unitOfMeasure}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Inventory;
