import { useState } from "react";
import { NavLink } from "react-router-dom";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import "./SprintListItem.css";
import { Edit, Visibility, Delete } from "@mui/icons-material";
import { useSprintStore } from "../../../store";
import { SprintModal } from "../SprintModal/SprintModal";
import { ISprint } from "../../../types/ISprint";
import { showAlert, showConfirm } from "../../../utils/sweetAlert";
import { SprintDetailModal } from "../SprintDetailModal/SprintDetailModal";

interface SprintListItemProps {
  sprintId?: string;
  sprintNumber: string;
  startDate: string;
  endDate: string;
}

const SprintListItem = ({
  sprintId,
  sprintNumber,
  startDate,
  endDate,
}: SprintListItemProps) => {
  // El ID del sprint ahora viene directamente del campo _id de la API
  const routeId = sprintId || "";
  const [showEditModal, setShowEditModal] = useState(false);
  const { fetchSprints, sprints } = useSprintStore();

  // Encontrar el objeto sprint completo usando el ID
  const sprintData = sprintId ? sprints.find((s) => s.id === sprintId) : null;

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevenir navegación al hacer clic
    e.stopPropagation(); // Evitar que el evento se propague
    setShowEditModal(true);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevenir navegación al hacer clic
    e.stopPropagation(); // Evitar que el evento se propague

    if (sprintId) {
      const result = await showConfirm(
        `¿Eliminar sprint?`,
        `¿Estás seguro que deseas eliminar el ${sprintNumber}?`,
        "Sí, eliminar",
        "Cancelar"
      );

      if (result.isConfirmed) {
        try {
          // Importar el store y usar su método de eliminación
          const { deleteSprint } = useSprintStore.getState();
          await deleteSprint(sprintId);
          showAlert(
            `Sprint ${sprintNumber} eliminado correctamente`,
            "success"
          );
          // Refrescar la lista después de eliminar
          fetchSprints();
        } catch (error) {
          console.error("Error al eliminar el sprint:", error);
          showAlert("No se pudo eliminar el sprint", "error");
        }
      }
    }
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    // Refrescar la lista después de editar
    fetchSprints();
  };
  const [showDetailModal, setShowDetailModal] = useState(false);

  return (
    <li className="sprint-list-item">
      <NavLink to={`/sprint/${routeId}`} className="sprint-list-item-link">
        <div className="sprint-list-item-content-wrapper">
          <div className="sprint-list-item-content">
            <div className="sprint-list-item-content-header">
              <div className="sprint-list-item-icon">
                <FormatListBulletedIcon />
              </div>
              <div className="sprint-list-item-title">{sprintNumber}</div>
            </div>
            <div className="sprint-list-item-dates">
              <div>Inicio: {startDate}</div>
              <div>Cierre: {endDate}</div>
            </div>
          </div>
          <div className="sprint-list-item-buttons">
            <button
              className="action-button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowDetailModal(true);
              }}
              title="Ver sprint"
            >
              <Visibility />
            </button>

            <button
              className="action-button"
              onClick={handleEdit}
              title="Editar sprint"
            >
              <Edit />
            </button>
            <button
              className="action-button"
              onClick={handleDelete}
              title="Eliminar sprint"
            >
              <Delete />
            </button>
          </div>
        </div>
      </NavLink>

      {/* Modal para editar sprint */}
      {showEditModal && sprintData && (
        <SprintModal
          handleCloseModal={handleCloseModal}
          activeSprint={sprintData as ISprint}
        />
      )}
      {showDetailModal && sprintData && (
        <SprintDetailModal
          sprint={sprintData}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </li>
  );
};

export default SprintListItem;
