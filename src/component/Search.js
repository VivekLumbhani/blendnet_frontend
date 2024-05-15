import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { NotificationAdd, SearchOutlined } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import NavBar from './NavBar';

const theme = createTheme();

const SearchComp = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [symbol, setSymbol] = useState('');
  
    const handleChange = (event) => {
      setSymbol(event.target.value);
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        setLoading(true);
        const response = await axios.post('http://127.0.0.1:8000/searchStock', {
          keyword: symbol.toUpperCase(),
        });
        setSearchResults(response.data.bestMatches);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    const addToWatchList=async(symbol)=>{
        console.log("symbol selected "+symbol);
        var userid = localStorage.getItem('userid');

        console.log("user id "+userid);
        // http://127.0.0.1:8000/addToWatchList
        try {
            const response = await axios.post('http://127.0.0.1:8000/addToWatchList', {
              symbol: symbol,
              uniqueId: userid,

            });

            alert("set success "+response.data)
      
            
      
            console.log(response.data);
          } catch (error) {
            console.error('Error:', error);
          }
      


    }
      return (
        <>
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="md">
                
        
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <NavBar/>
        
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <SearchOutlined />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Search Stocks
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    autoComplete="off"
                                    name="symbol"
                                    required
                                    fullWidth
                                    id="symbol"
                                    label="Enter Stock Symbol"
                                    autoFocus
                                    value={symbol}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ height: '100%' }}
                                >
                                    Search
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                    {loading && <p>Loading...</p>}
                    {searchResults.length > 0 && (
                        <Box mt={3} width="100%">
                            <Typography variant="h6" gutterBottom>
                                Search Results
                            </Typography>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Symbol</th>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Region</th>
                                        <th>Market Open</th>
                                        <th>Market Close</th>
                                        <th>Currency</th>
                                        <th>Match Score</th>
                                        <th>Add To watchlist</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {searchResults.map((result, index) => (
                                        <tr key={index}>
                                            <td>{result['1. symbol']}</td>
                                            <td>{result['2. name']}</td>
                                            <td>{result['3. type']}</td>
                                            <td>{result['4. region']}</td>
                                            <td>{result['5. marketOpen']}</td>
                                            <td>{result['6. marketClose']}</td>
                                            <td>{result['8. currency']}</td>
                                            <td>{result['9. matchScore']}</td>
                                            <td>{
                                                <Button
                                                onClick={()=>addToWatchList(result['1. symbol'])}
                                                
                                                component="label"
                                                role={undefined}
                                                variant="contained"
                                                tabIndex={-1}
                                                startIcon={<NotificationAdd />}
                                              />


                                                }</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Box>
                    )}
                </Box>
            </Container>
        </ThemeProvider>
        </>
    );
};

export default SearchComp;

