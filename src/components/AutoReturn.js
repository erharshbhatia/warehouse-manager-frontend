import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';

function AutoReturn() {
  const [rejectedItems, setRejectedItems] = useState([{ itemCode: '', quantity: 0 }]);
  const [error, setError] = useState('');
  const [salesReturns, setSalesReturns] = useState([]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...rejectedItems];
    newItems[index][field] = value;
    setRejectedItems(newItems);
  };

  const addItem = () => {
    setRejectedItems([...rejectedItems, { itemCode: '', quantity: 0 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSalesReturns([]);

    try {
      const response = await axios.post('http://localhost:5000/api/returns/auto-create', { rejectedItems });
      setSalesReturns(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating auto returns');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Auto Create Returns
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {rejectedItems.map((item, index) => (
            <React.Fragment key={index}>
              <Grid item xs={5}>
                <TextField
                  label="Item Code"
                  variant="outlined"
                  fullWidth
                  value={item.itemCode}
                  onChange={(e) => handleItemChange(index, 'itemCode', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  label="Quantity"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value, 10))}
                  inputProps={{ min: 1 }}
                  required
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton color="primary" onClick={addItem}>
                  <AddCircleIcon />
                </IconButton>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>

        <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
          Create Auto Returns
        </Button>
      </form>

      {salesReturns.length > 0 && (
        <div>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Created Sales Returns
          </Typography>
          {salesReturns.map((return_, index) => (
            <div key={index} style={{ marginBottom: '20px' }}>
              <Typography variant="h6">Sales Return {index + 1}</Typography>
              <Typography variant="body1">Invoice Number: {return_.invoiceNumber}</Typography>
              <Typography variant="body1">Customer: {return_.customer}</Typography>

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
                    {return_.items.map((item, itemIndex) => (
                      <TableRow key={itemIndex}>
                        <TableCell>{item.itemCode}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.unitOfMeasure}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}

export default AutoReturn;
