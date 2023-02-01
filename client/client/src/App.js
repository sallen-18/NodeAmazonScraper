
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./components/home"
import Results from "./components/results"
import PieHelper from "./components/PieHelper"




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={ < Home /> } ></Route>
        <Route path="/results" element={ < Results /> }></Route>
        <Route path="/piechart" element={ < PieHelper /> }></Route>
      </Routes>
    </Router> 
  );
}


export default App;
