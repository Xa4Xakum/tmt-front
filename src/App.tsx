import './App.css';
import Categories from './components/categories/Categories';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Locations from './components/locations/Locations';

function App() {
  return (
    <div className="App">
      <Header/>
      <main className="main-content">
        <Locations/>
      </main>
      <Footer/>
    </div>
  );
}

export default App;
д