import './App.css';
import MapComponent from './Map.js';
import ContainerComponent from './ContainerComponent.js';


function App() {
  return (
    <div className="App">
      <h1>MUNCHIES</h1>
      {/* InfoBox */}
      {/* Map */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '24px' }}>
        <ContainerComponent
            width="1080px"
            height="700px"
            borderRadius="20px"
            borderColor="rgba(52, 152, 219, 0.5)" >
          <MapComponent latitude={42} longitude={42}/>
        </ContainerComponent>
      </div>
      
    </div>
  );
}

export default App;
