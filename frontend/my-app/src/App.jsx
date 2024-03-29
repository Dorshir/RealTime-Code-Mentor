import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LobbyPage from "./pages/LobbyPage";
import CodeBlockPage from "./components/CodeBlockPage";
import "./Styles.css";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LobbyPage />} />
          <Route path="/code-block/:id" element={<CodeBlockPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
