import React, { useState } from "react";
import styles from './TaskCard.module.css'
import { Share, Visibility, Edit, Delete } from "@mui/icons-material";
import { SprintSelector } from "../SprintSelector/SprintSelector";
import { showAlert } from "../../../utils/sweetAlert";

interface TaskCardProps {
  titulo: string;
  descripcion: string;
  fechaLimite?: string;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  onViewClick?: () => void;
  onSendToSprint?: (sprintId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  titulo,
  descripcion,
  fechaLimite,
  onEditClick,
  onDeleteClick,
  onViewClick,
  onSendToSprint,
}) => {
  const [selectedSprintId, setSelectedSprintId] = useState<string>("");

  const handleSprintChange = (sprintId: string) => {
    setSelectedSprintId(sprintId);
  };

  const handleSendToSprint = () => {
    if (selectedSprintId && onSendToSprint) {
      onSendToSprint(selectedSprintId);
    } else {
      showAlert("Por favor seleccione un sprint primero", "warning");
    }
  };

  return (
    <div className={styles.taskCard}>
      <div className={styles.taskContent}>
        <span className={styles.taskTitle}>Título: {titulo}</span>
        <span className={styles.taskDescription}>Descripción: {descripcion}</span>
        {fechaLimite && (
          <span className={styles.taskCreatedAt}>Creado: {fechaLimite}</span>
        )}
      </div>
      <div className={styles.taskActions}>
        <div className={styles.sprintSelectorWrapper}>
          <SprintSelector
            value={selectedSprintId}
            onChange={handleSprintChange}
          />
        </div>

        <button
          className={styles.actionBtn}
          onClick={handleSendToSprint}
          disabled={!selectedSprintId}
        >
          Enviar
          <Share />
        </button>

        <div className={styles.actionButtonsGroup}>
          <button className={styles.actionBtn} title="Ver" onClick={onViewClick}>
            <Visibility />
          </button>

          <button className={styles.actionBtn} title="Editar" onClick={onEditClick}>
            <Edit />
          </button>
          <button
            className={styles.actionBtn}
            title="Eliminar"
            onClick={onDeleteClick}
          >
            <Delete />
          </button>
        </div>
      </div>
    </div>
  );
};
