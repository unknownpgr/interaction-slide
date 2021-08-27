import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import CardInteraction from "../CardInteraction/CardInteraction";
import AvoidInteraction from "../AvoidInteraction/AvoidInteraction";
import BranchingInteraction from "../BranchingInteraction/BranchingInteraction";
import RealtimeInteraction from "../Realtime/RealtimeInteraction";

function Root() {
  return <div>
    <ul>
      <li><Link to="/avoid">Avoid</Link></li>
      <li><Link to="/card">Card</Link></li>
      <li><Link to="/branch">Branch</Link></li>
      <li><Link to="/realtime">Realtime</Link></li>
    </ul>
  </div>;
}

export default function App() {
  return (
    <div className="app">
      <Router>
        <Switch>
          <Route path="/" exact>
            <Root></Root>
          </Route>
          <Route path="/avoid">
            <AvoidInteraction></AvoidInteraction>
          </Route>
          <Route path="/card">
            <CardInteraction></CardInteraction>
          </Route>
          <Route path="/branch">
            <BranchingInteraction></BranchingInteraction>
          </Route>
          <Route path="/realtime">
            <RealtimeInteraction></RealtimeInteraction>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}
