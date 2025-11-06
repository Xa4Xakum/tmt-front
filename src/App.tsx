import { Route, BrowserRouter, Routes } from 'react-router-dom';
import './App.css';
import Categories from './components/categories/Categories';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Locations from './components/locations/Locations';
import InventoryPage from './components/inventory/Inventory';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header/>
        <main className="main-content">
          <Routes>
            <Route path="/locations" element={<Locations/>}/>
            <Route path="/categories" element={<Categories/>}/>
            <Route path="/inventory" element={<InventoryPage/>}/>
          </Routes>
        </main>
        <Footer/>
      </div>
    </BrowserRouter>
  );
}

export default App;
