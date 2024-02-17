import logo from './logo.svg';
import './App.css';

// Importing the API and instantiating the client using your keys
const { default: Terra } = require("terra-api");

const API_KEY = "dx4zU4T4_70nL6CDsAcDfev9w1Hswo-p"
const DEV_ID = "sadsa-testing-kWCJOen6mN"
const SECRET = "dcdd7626fa045013c3d28f54264d40a202fb7ad14a50df4e"


const terra = new Terra("DEV_ID", "API_KEY", "SECRET");


terra
    .generateWidgetSession({
      referenceID: 'abs',
      providers: ["CRONOMETER", "OURA"],
      authSuccessRedirectUrl: "success.com",
      authFailureRedirectUrl: "failure.com",
  		language: 'en'
    })
    .then((s) => {
      console.log(s);
    });


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={() => terra.getProviders().then((p) => { console.log(p); })}>Get</button>
      </header>
    </div>
  );
}

export default App;
