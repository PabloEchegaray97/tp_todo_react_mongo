import { FC, useState, ChangeEvent, FormEvent } from "react";
import styles from "./Modal.module.css";
import { useTaskStore, useSprintStore } from "../../../store";
import { showAlert } from "../../../utils/sweetAlert";

type IModal = {
  handleCloseModal: VoidFunction;
  sprintId?: string;
};

interface ITaskForm {
  titulo: string;
  descripcion: string;
  fechaLimite: string;
}

const initialState: ITaskForm = {
  titulo: "",
  descripcion: "",
  fechaLimite: "",
};

export const Modal: FC<IModal> = ({ handleCloseModal, sprintId }) => {
  const {
    activeTask,
    setActiveTask,
    createTask,
    updateTask: updateBacklogTask,
  } = useTaskStore();
  const { addTask, updateTask: updateSprintTask } = useSprintStore();
  const [formValues, setFormValues] = useState<ITaskForm>(
    activeTask
      ? {
          titulo: activeTask.titulo,
          descripcion: activeTask.descripcion,
          fechaLimite: activeTask.fechaLimite || "",
        }
      : initialState
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Si estamos editando una tarea existente
      if (activeTask) {
        // Si estamos editando una tarea dentro de un sprint
        if (sprintId) {
          await updateSprintTask(sprintId, activeTask.id, {
            titulo: formValues.titulo,
            descripcion: formValues.descripcion,
            fechaLimite: formValues.fechaLimite,
          });
          showAlert(
            `Tarea "${formValues.titulo}" actualizada correctamente`,
            "success"
          );
        } else {
          // Si estamos editando una tarea del backlog
          await updateBacklogTask({
            ...activeTask,
            titulo: formValues.titulo,
            descripcion: formValues.descripcion,
            fechaLimite: formValues.fechaLimite,
          });
          showAlert(
            `Tarea "${formValues.titulo}" actualizada correctamente`,
            "success"
          );
        }
      }
      // Si estamos creando una tarea en un sprint específico
      else if (sprintId) {
        await addTask(sprintId, {
          titulo: formValues.titulo,
          descripcion: formValues.descripcion,
          fechaLimite: formValues.fechaLimite,
        });
        showAlert(
          `Tarea "${formValues.titulo}" creada correctamente en el sprint`,
          "success"
        );
      }
      // Si estamos creando una tarea en el backlog
      else {
        await createTask({
          titulo: formValues.titulo,
          descripcion: formValues.descripcion,
          fechaLimite: formValues.fechaLimite,
          estado: "pendiente",
        });
        showAlert(
          `Tarea "${formValues.titulo}" creada correctamente en el backlog`,
          "success"
        );
      }

      setActiveTask(null);
      handleCloseModal();
    } catch (error) {
      console.error("Error al guardar la tarea:", error);
      showAlert("Ha ocurrido un error al guardar la tarea", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.containerPrincipalModal}>
      <div className={styles.contentPopUP}>
        <div className={styles.title}>
          <h3>
            {activeTask
              ? "EDITAR TAREA"
              : sprintId
              ? "CREAR TAREA EN LA SPRINT"
              : "CREAR TAREA EN BACKLOG"}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className={styles.formContent}>
          <div>
            <div className={styles.inputContainer}>
              <div className={styles.inputContainerItem}>
                <label htmlFor="title">Título de la tarea</label>
                <input
                  placeholder="Ingrese un Titulo"
                  type="text"
                  required
                  onChange={handleChange}
                  value={formValues.titulo}
                  autoComplete="off"
                  name="titulo"
                />
              </div>
              <div className={styles.inputContainerItem}>
                <label htmlFor="deadline">Seleccione una fecha</label>
                <input
                  type="date"
                  required
                  onChange={handleChange}
                  value={formValues.fechaLimite}
                  autoComplete="off"
                  name="fechaLimite"
                />
              </div>
            </div>
            <label htmlFor="description">Descripción de la tarea</label>
            <textarea
              placeholder="Ingrese una descripción"
              required
              onChange={handleChange}
              value={formValues.descripcion}
              name="descripcion"
              id=""
              className={styles.textArea}
              rows={5}
            ></textarea>
          </div>
          <div className={styles.buttonCard}>
            <button type="button" onClick={handleCloseModal}>
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Guardando..."
                : activeTask
                ? "Guardar cambios"
                : "Crear Tarea"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
