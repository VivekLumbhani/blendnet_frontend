import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { NotificationAdd, SearchOutlined, TramSharp } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import NavBar from './NavBar';

const theme = createTheme();

const WatchList = () => {
  const [WatchList, setWatchList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [symbol, setSymbol] = useState('');

  const handleChange = (event) => {
    setSymbol(event.target.value);
  };

  useEffect(() => {
    fetchWatchList()
  }, [])
  
  const fetchWatchList = async () => {
    try {
      setLoading(true);
      const uniqueId = localStorage.getItem("userid");
      console.log("uniqueId " + uniqueId);
  
      // Step 1: Fetch symbols from the backend
      const response = await axios.post('http://127.0.0.1:8000/fetchWatchList', {
        uniqueId: uniqueId,
      });
      console.log("symbols data: " + JSON.stringify(response.data));
  
      // Extract symbols from the response
      const symbols = response.data.map(item => item.symbol);
  
      // Step 2: Fetch details for each symbol
      const detailsPromises = symbols.map(async symbol => {
        // Fetch details for the symbol
        const detailsResponse = await axios.post('http://127.0.0.1:8000/fetchSingleStock', {
          name: symbol
        });
  
        // Extract Meta Data and the first object of Time Series (5min) if it exists
        const responseData = detailsResponse.data.response;
        const metaData = responseData["Meta Data"];
        const timeSeriesData = responseData["Time Series (5min)"];
        const firstTimeSeriesKey = timeSeriesData ? Object.keys(timeSeriesData)[0] : null;
        const firstTimeSeriesData = firstTimeSeriesKey ? timeSeriesData[firstTimeSeriesKey] : null;
  
        // Check if both metaData and timeSeriesData are defined before proceeding
        if (metaData && firstTimeSeriesData) {
          // Return the extracted data
          return { metaData, timeSeries: { [firstTimeSeriesKey]: firstTimeSeriesData } };
        } else {
          return null; // Return null if either metaData or timeSeriesData is not defined
        }
      });
  
      // Wait for all details requests to complete
      const detailsData = await Promise.all(detailsPromises);
      console.log("details data: ", detailsData);
  
      // Filter out any null values from the detailsData array
      const filteredDetailsData = detailsData.filter(data => data !== null);
  
      // Set the filtered details to the WatchList state
      setWatchList(filteredDetailsData);
  
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };
  
  

  const deleteFromWatchList = async (symbol) => {
    console.log("symbol selected " + symbol);
    var userid = localStorage.getItem('userid');

    console.log("user id " + userid);
    // http://127.0.0.1:8000/addToWatchList
    try {
      const response = await axios.post('http://127.0.0.1:8000/addToWatchList', {
        symbol: symbol,
        uniqueId: userid,

      });

      alert("set success " + response.data)



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
            <NavBar />


{WatchList.length > 0 && (
  <Box mt={3} width="100%">
    <Typography variant="h6" gutterBottom>
      Search Results
    </Typography>
    <table>
      <thead>
        <tr>
          <th>Symbol</th>
          {/* Add other table headers here if needed */}
          <th>Add To Watchlist</th>
        </tr>
      </thead>
      <tbody>
        {WatchList.map((result, index) => {
          // Logging result object outside JSX
          console.log("result is ", JSON.stringify(result));

          return (
            <tr key={index}>
              <td>{result.bestMatches.symbol}</td>
              {/* You can add other columns if needed */}
              <td>
                <Button
                  onClick={() => deleteFromWatchList(result.symbol)}
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<TramSharp />}
                />
              </td>
            </tr>
          );
        })}
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

export default WatchList;

