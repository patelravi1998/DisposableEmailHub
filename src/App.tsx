import Maintenance from "./pages/Maintenance";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
// other imports...

const App = () => {
  const showMaintenance = true; // <<< Set to false when you're ready to go live

  return (
    <BrowserRouter>
      {showMaintenance ? (
        <Maintenance />
      ) : (
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          {/* Add your other routes here */}
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default App;
