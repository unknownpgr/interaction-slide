import "./App.css";
import CardInteraction from "../CardInteraction/CardInteraction";
import AvoidInteraction from "../AvoidInteraction/AvoidInteraction";
import BranchingInteraction from "../BranchingInteraction/BranchingInteraction";

export default function App() {
  return (
    <div className="app">
      {/* <AvoidInteraction></AvoidInteraction> */}
      {/* <CardInteraction></CardInteraction> */}
      <BranchingInteraction></BranchingInteraction>
    </div>
  );
}
