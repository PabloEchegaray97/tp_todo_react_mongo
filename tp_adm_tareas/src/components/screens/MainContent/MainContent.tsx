import "./MainContent.css";
import { ScreenBacklog } from "../ScreenBacklog/ScreenBacklog";
import { ScreenSprint } from "../ScreenSprint/ScreenSprint";
import { Routes, Route } from "react-router-dom";

const MainContent = () => {
  return (
    <main className="main-content">
      <Routes>
        <Route path="/" element={<ScreenBacklog />} />
        <Route path="/backlog" element={<ScreenBacklog />} />
        <Route path="/sprint/:sprintId" element={<ScreenSprint />} />
      </Routes>
    </main>
  );
};

export default MainContent;
