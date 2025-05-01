import { NavLink } from "react-router-dom";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import "./Sidebar.css";
import SprintList from "../SprintList/SprintList";
import Button from "../Button/Button";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-header">
          <NavLink to="/backlog" className="sidebar-link">
            <Button
              variant="contained"
              className="backlog-button"
              startIcon={<FormatListBulletedIcon />}
            >
              Backlog
            </Button>
          </NavLink>
        </div>

        <div className="sidebar-divider" />

        <SprintList />
      </div>
    </aside>
  );
};

export default Sidebar;
