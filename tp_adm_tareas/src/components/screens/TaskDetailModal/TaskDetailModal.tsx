import { ITask } from "../../../types/ITask";
import styles from "../../ui/Modal/Modal.module.css";

interface TaskDetailModalProps {
  task: ITask;
  onClose: () => void;
}

export const TaskDetailModal = ({ task, onClose }: TaskDetailModalProps) => {
  return (
    <div className={styles.containerPrincipalModal} onClick={onClose}>
      <div className={styles.contentPopUP} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>
          <h3>{task.titulo}</h3>
        </div>
        
        <div className={styles.contentDetail}>
          <p>
            <strong>Descripción:</strong> {task.descripcion}
          </p>
          {task.estado && (
            <p>
              <strong>Estado:</strong> {task.estado.charAt(0).toUpperCase() + task.estado.slice(1)}
            </p>
          )}
          {task.fechaLimite && (
            <p>
              <strong>Fecha límite:</strong> {task.fechaLimite}
            </p>
          )}
        </div>
        
        <div className={styles.buttonCard}>
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};
