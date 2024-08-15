import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

function InventoryManagement() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ itemCode: '', quantity: 0, unitOfMeasure: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/items');
      setItems(response.data);
    } catch (error) {
      setError('Error fetching inventory items');
    }
  };

  const handleNewItemChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleCreateOrUpdateItem = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      let response;
      const existingItem = items.find(item => item.itemCode === newItem.itemCode);

      if (existingItem) {
        // Update existing item
        response = await axios.put(`http://localhost:5000/api/items/${newItem.itemCode}`, newItem);
      } else {
        // Create new item
        response = await axios.post('http://localhost:5000/api/items', newItem);
      }

      setSuccess(response.data.message || 'Item saved successfully');
      setNewItem({ itemCode: '', quantity: 0, unitOfMeasure: '' });
      fetchItems();
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating/updating item');
    }
  };

  const handleUpdateQuantity = async (itemCode, quantityChange) => {
    try {
      await axios.patch(`http://localhost:5000/api/items/${itemCode}`, { quantityChange });
      setSuccess('Quantity updated successfully');
      fetchItems();
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating quantity');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Inventory Management
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Typography variant="h6" gutterBottom>
        Create or Update Item
      </Typography>
      <form onSubmit={handleCreateOrUpdateItem} style={{ marginBottom: '16px' }}>
        <TextField
          label="Item Code"
          name="itemCode"
          value={newItem.itemCode}
          onChange={handleNewItemChange}
          required
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Quantity"
          name="quantity"
          type="number"
          value={newItem.quantity}
          onChange={handleNewItemChange}
          required
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Unit of Measure"
          name="unitOfMeasure"
          value={newItem.unitOfMeasure}
          onChange={handleNewItemChange}
          required
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Save Item
        </Button>
      </form>

      <Typography variant="h6" gutterBottom>
        Current Inventory
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item Code</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Unit of Measure</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.itemCode}>
                <TableCell>{item.itemCode}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.unitOfMeasure}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleUpdateQuantity(item.itemCode, 1)}>
                    <AddIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleUpdateQuantity(item.itemCode, -1)}>
                    <RemoveIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default InventoryManagement;
