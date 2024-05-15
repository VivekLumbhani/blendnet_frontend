import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { DeleteForeverOutlined, NotificationAdd, SearchOutlined, TramSharp } from '@mui/icons-material';
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
  
      
      const response = await axios.post('http://127.0.0.1:8000/fetchWatchList', {
        uniqueId: uniqueId,
      });
      console.log("symbols data: " + JSON.stringify(response.data));
  
      
      const symbols = response.data.map(item => item.symbol);
      console.log("symbols: ", symbols); 
      
      const detailsPromises = symbols.map(async symbol => {
      
        const searchResponse = await axios.post('http://127.0.0.1:8000/searchStock', {
          keyword: symbol
        });
        console.log("search response for symbol ", symbol, ": ", searchResponse.data); 
        
        
        const exactMatch = searchResponse.data.bestMatches.find(match => match["1. symbol"] === symbol);
  
        if (exactMatch) {
        
          return {
            metaData: {
              "Symbol": exactMatch["1. symbol"],
              "Name": exactMatch["2. name"],
              "Type": exactMatch["3. type"],
              "Region": exactMatch["4. region"] || "",
              "Market Open": exactMatch["5. marketOpen"] || "",
              "Market Close": exactMatch["6. marketClose"] || "",
              "Currency": exactMatch["8. currency"] || "",
            },
            timeSeries: null 
          };
        } else {
          return null; 
        }
      });
  
      
      const detailsData = await Promise.all(detailsPromises);
      console.log("details data: ", detailsData);
  
      
      const filteredDetailsData = detailsData.filter(data => data !== null);
  
      
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
      const response = await axios.delete('http://127.0.0.1:8000/deleteFromWatchList', {
  data: {
    symbol: symbol,
    uniqueId: userid,
  }
});


      alert("set success " + JSON.stringify(response.data))



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
    <table border="1">
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Name</th>
          <th>Type</th>
          <th>Region</th>
          <th>Market Open</th>
          <th>Market Close</th>
          <th>Currency</th>
          <th>Add To Watchlist</th>
        </tr>
      </thead>
      <tbody>
        {WatchList.map((result, index) => {

console.log("result is ", JSON.stringify(result));

          return (
            <tr key={index}>
              <td>{result.metaData["Symbol"]}</td>
              <td>{result.metaData["Name"]}</td>
              <td>{result.metaData["Type"]}</td>
              <td>{result.metaData["Region"]}</td>
              <td>{result.metaData["Market Open"]}</td>
              <td>{result.metaData["Market Close"]}</td>
              <td>{result.metaData["Currency"]}</td>
              {/* Add the button for adding to watchlist */}
              <td>
                <Button
                  onClick={() => deleteFromWatchList(result.metaData["Symbol"])}
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<DeleteForeverOutlined />}
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

