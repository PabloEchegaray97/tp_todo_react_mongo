import { ISprint } from "../../../types/ISprint";
import styles from "../Modal/Modal.module.css";

interface SprintDetailModalProps {
  sprint: ISprint;
  onClose: () => void;
}

export const SprintDetailModal = ({
  sprint,
  onClose,
}: SprintDetailModalProps) => {
  return (
    <div className={styles.containerPrincipalModal} onClick={onClose}>
      <div className={styles.contentPopUP} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>
          <h3>{sprint.nombre}</h3>
        </div>
        
        <div className={styles.contentDetail}>
          <p>
            <strong>Fecha de inicio:</strong> {sprint.fechaInicio}
          </p>
          <p>
            <strong>Fecha de cierre:</strong> {sprint.fechaCierre}
          </p>
          <p>
            <strong>Tareas:</strong>
            {sprint.tareas.length > 0 ? (
            <div>
              {sprint.tareas.map((tarea, index) => (
                <p key={index}>- {tarea.titulo}</p>
              ))}
            </div>
          ) : (
            <p>No hay tareas asignadas</p>
          )}
          </p>
          
        </div>
        
        <div className={styles.buttonCard}>
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};
