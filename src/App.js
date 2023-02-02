import { Routes, Route } from "react-router-dom";
import "./App.css"
import Home from "./components/Home/Home";
import Menu from "./components/Menu/Menu";
import Recap from "./components/Recap/Recap";

function App() {
  return (
    <div className="App">
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/order-recap/:orderNumber" element={<Recap />} />
        </Routes>
    </div>
  );
}

export default App;
