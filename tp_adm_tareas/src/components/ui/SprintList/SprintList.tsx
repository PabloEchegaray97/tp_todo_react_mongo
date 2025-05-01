import { useState, useEffect } from "react";
import SprintListItem from "../SprintListItem/SprintListItem";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import "./SprintList.css";
import { useSprintStore } from "../../../store";
import { SprintModal } from "../SprintModal/SprintModal";
import { showAlert } from "../../../utils/sweetAlert";

const SprintList = () => {
  const { sprints, fetchSprints, } = useSprintStore();
  const [showModal, setShowModal] = useState(false);
  const [, setIsLoadingList] = useState(true);

  useEffect(() => {
    const loadSprints = async () => {
      setIsLoadingList(true);
      try {
        await fetchSprints();
      } catch (error) {
        console.error("Error al cargar sprints:", error);
        showAlert("Error al cargar la lista de sprints", "error");
      } finally {
        setIsLoadingList(false);
      }
    };
    
    loadSprints();
  }, [fetchSprints]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Refrescar la lista de sprints después de cerrar el modal
    fetchSprints();
  };

  return (
    <div className="sprint-list">
      <div className="sprint-list-header">
        <div className="sprint-list-title-container">
          <h2 className="sprint-list-title">Lista de Sprints</h2>
          <button className="sprint-list-add-button" onClick={handleOpenModal}>
            <PlaylistAddIcon />
          </button>
        </div>
      </div>

      <ul className="sprint-list-items">
        {sprints.length > 0 ? (
          sprints.map((sprint) => (
            <SprintListItem
              key={sprint.id}
              sprintId={sprint.id}
              sprintNumber={sprint.nombre}
              startDate={sprint.fechaInicio}
              endDate={sprint.fechaCierre}
            />
          ))
        ) : (
          <li className="sprint-list-empty">No hay sprints disponibles</li>
        )}
      </ul>

      {showModal && <SprintModal handleCloseModal={handleCloseModal} />}
    </div>
  );
};

export default SprintList;
