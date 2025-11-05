import './App.css';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Locations from './components/locations/Locations';

const mockLocations = [
  {
    "name": "вторая",
    "description": "вторая локация",
    "parent_location_id": null,
    "id": 2,
    "created_at": "2025-11-05T08:11:14.192171",
    "children": [
      {
        "name": "пятая",
        "description": "ребенок второй",
        "parent_location_id": 2,
        "id": 5,
        "created_at": "2025-11-05T08:12:17.682600",
        "children": []
      },
      {
        "name": "шестая",
        "description": "тоже ребенок второй",
        "parent_location_id": 2,
        "id": 6,
        "created_at": "2025-11-05T08:12:24.912840",
        "children": []
      }
    ]
  },
  {
    "name": "первая",
    "description": "первая локация",
    "parent_location_id": null,
    "id": 1,
    "created_at": "2025-11-05T08:10:58.136060",
    "children": [
      {
        "name": "третья",
        "description": "ребенок первой",
        "parent_location_id": 1,
        "id": 3,
        "created_at": "2025-11-05T08:11:46.906712",
        "children": []
      },
      {
        "name": "четвертая",
        "description": "тоже ребенок первой",
        "parent_location_id": 1,
        "id": 4,
        "created_at": "2025-11-05T08:11:57.231126",
        "children": []
      }
    ]
  }
];

function App() {
  return (
    <div className="App">
      <Header/>
      <main className="main-content">
        <Locations locations={mockLocations}/>
      </main>
      <Footer/>
    </div>
  );
}

export default App;
