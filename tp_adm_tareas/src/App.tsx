import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import MainContent from "./components/screens/MainContent/MainContent";
import "./styles/theme.css";
import Sidebar from "./components/ui/Sidebar/Sidebar";
import Navbar from "./components/ui/NavBar/Navbar";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  useEffect(() => {
    // Aplicamos el tema al cargar
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar onToggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <div className="app-content">
          <Sidebar />
          <MainContent />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
