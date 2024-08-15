import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Alert 
} from '@mui/material';

function CreateInvoice() {
  const [invoice, setInvoice] = useState({
    invoiceNumber: '',
    customer: '',
    type: 'Sales Invoice',
    items: [{ itemCode: '', quantity: 0, unitOfMeasure: '' }],
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/invoices');
        setInvoices(response.data);
      } catch (error) {
        setError('Failed to fetch invoices');
      }
    };
    fetchInvoices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('http://localhost:5000/api/invoices', invoice);
      setSuccess('Invoice created successfully');
      setInvoice({
        invoiceNumber: '',
        customer: '',
        type: 'Sales Invoice',
        items: [{ itemCode: '', quantity: 0, unitOfMeasure: '' }],
      });
      const response = await axios.get('http://localhost:5000/api/invoices');
      setInvoices(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message || 'An error occurred while creating the invoice'
      );
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...invoice.items];
    newItems[index][field] = value;
    setInvoice({ ...invoice, items: newItems });
  };

  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { itemCode: '', quantity: 0, unitOfMeasure: '' }],
    });
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Create Invoice
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <Paper elevation={3} style={{ padding: 16 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Invoice Number"
            fullWidth
            margin="normal"
            value={invoice.invoiceNumber}
            onChange={(e) => setInvoice({ ...invoice, invoiceNumber: e.target.value })}
            required
          />
          <TextField
            label="Customer"
            fullWidth
            margin="normal"
            value={invoice.customer}
            onChange={(e) => setInvoice({ ...invoice, customer: e.target.value })}
            required
          />
          <Select
            fullWidth
            margin="normal"
            value={invoice.type}
            onChange={(e) => setInvoice({ ...invoice, type: e.target.value })}
          >
            <MenuItem value="Sales Invoice">Sales Invoice</MenuItem>
            <MenuItem value="Sales Return">Sales Return</MenuItem>
          </Select>

          {invoice.items.map((item, index) => (
            <Grid container spacing={2} key={index}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Item Code"
                  fullWidth
                  value={item.itemCode}
                  onChange={(e) => handleItemChange(index, 'itemCode', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Quantity"
                  type="number"
                  fullWidth
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Unit of Measure"
                  fullWidth
                  value={item.unitOfMeasure}
                  onChange={(e) => handleItemChange(index, 'unitOfMeasure', e.target.value)}
                  required
                />
              </Grid>
            </Grid>
          ))}

          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={addItem}>
              Add Item
            </Button>
          </Box>
          <Box mt={2}>
            <Button type="submit" variant="contained" color="secondary">
              Create Invoice
            </Button>
          </Box>
        </form>
      </Paper>

      <Box mt={4}>
        <Typography variant="h5">Previous Invoices</Typography>
        {invoices.length === 0 ? (
          <Typography>No invoices available</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Invoice Number</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Items</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv._id}>
                    <TableCell>{inv.invoiceNumber}</TableCell>
                    <TableCell>{inv.customer}</TableCell>
                    <TableCell>{inv.type}</TableCell>
                    <TableCell>{new Date(inv.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {inv.items.map((item, idx) => (
                        <Box key={idx}>
                          {item.itemCode} - {item.quantity} {item.unitOfMeasure}
                        </Box>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
}

export default CreateInvoice;
