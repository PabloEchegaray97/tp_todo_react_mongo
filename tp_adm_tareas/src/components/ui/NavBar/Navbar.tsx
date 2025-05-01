import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import "./Navbar.css";
import Button from "../Button/Button";

interface NavbarProps {
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

const Navbar = ({ onToggleTheme, isDarkMode }: NavbarProps) => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-spacer" />
        <h1 className="navbar-title">ADMINISTRADOR DE TAREAS</h1>
        <Button
          variant="text"
          size="small"
          className="theme-toggle-button"
          onClick={onToggleTheme}
        >
          {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
