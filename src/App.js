
import './App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import SignUp from './component/SignUp';
import Login from './component/Login';

import SearchComp from './component/Search';
import WatchList from './component/WatchList';




function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/home' element={<SearchComp/>}/>
        <Route path='/watchlist' element={<WatchList/>}/>





      </Routes>
    </Router>
    
    </>
  );
}

export default App;
