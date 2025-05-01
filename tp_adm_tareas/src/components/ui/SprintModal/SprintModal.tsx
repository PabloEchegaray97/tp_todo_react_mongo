import { FC, useState, ChangeEvent, FormEvent } from "react";
import styles from "../Modal/Modal.module.css";
import { useSprintStore } from "../../../store";
import { ISprint } from "../../../types/ISprint";
import { showAlert } from "../../../utils/sweetAlert";

type ISprintModal = {
  handleCloseModal: VoidFunction;
  activeSprint?: ISprint | null;
};

interface ISprintForm {
  nombre: string;
  fechaInicio: string;
  fechaCierre: string;
}

const initialState: ISprintForm = {
  nombre: "",
  fechaInicio: "",
  fechaCierre: "",
};

export const SprintModal: FC<ISprintModal> = ({ handleCloseModal, activeSprint }) => {
  const { createSprint, updateSprint } = useSprintStore();
  const [formValues, setFormValues] = useState<ISprintForm>(
    activeSprint 
      ? { 
          nombre: activeSprint.nombre, 
          fechaInicio: activeSprint.fechaInicio, 
          fechaCierre: activeSprint.fechaCierre 
        } 
      : initialState
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validar que la fecha de cierre sea posterior a la fecha de inicio
      const fechaInicio = new Date(formValues.fechaInicio);
      const fechaCierre = new Date(formValues.fechaCierre);
      
      if (fechaCierre <= fechaInicio) {
        showAlert("La fecha de cierre debe ser posterior a la fecha de inicio", "error");
        setIsSubmitting(false);
        return;
      }
      
      if (activeSprint) {
        await updateSprint({
          ...activeSprint,
          nombre: formValues.nombre,
          fechaInicio: formValues.fechaInicio,
          fechaCierre: formValues.fechaCierre,
        });
        showAlert(`Sprint "${formValues.nombre}" actualizado correctamente`, "success");
      } else {
        await createSprint({
          nombre: formValues.nombre,
          fechaInicio: formValues.fechaInicio,
          fechaCierre: formValues.fechaCierre,
          tareas: []
        });
        showAlert(`Sprint "${formValues.nombre}" creado correctamente`, "success");
      }
      
      handleCloseModal();
    } catch (error) {
      console.error("Error al guardar el sprint:", error);
      showAlert("Ha ocurrido un error al guardar el sprint", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.containerPrincipalModal}>
      <div className={styles.contentPopUP}>
        <div className={styles.title}>
          <h3>{activeSprint ? "Editar Sprint" : "Crear Nuevo Sprint"}</h3>
        </div>

        <form onSubmit={handleSubmit} className={styles.formContent}>
          <div>
            <div className={styles.inputContainerItem}>
              <label htmlFor="title">
                Título del Sprint
              </label>
              <input
                placeholder="Ingrese un título para el sprint"
                type="text"
                required
                onChange={handleChange}
                value={formValues.nombre}
                autoComplete="off"
                name="nombre"
              />
            </div>
            
            <div className={styles.inputContainer}>
              <div className={styles.inputContainerItem}>
                <label htmlFor="startDate">
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  required
                  onChange={handleChange}
                  value={formValues.fechaInicio}
                  autoComplete="off"
                  name="fechaInicio"
                />
              </div>
              <div className={styles.inputContainerItem}>
                <label htmlFor="closingDate">
                  Fecha de cierre
                </label>
                <input
                  type="date"
                  required
                  onChange={handleChange}
                  value={formValues.fechaCierre}
                  autoComplete="off"
                  name="fechaCierre"
                />
              </div>
            </div>
          </div>
          
          <div className={styles.buttonCard}>
            <button type="button" onClick={handleCloseModal}>Cancelar</button>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting 
                ? "Guardando..." 
                : activeSprint 
                  ? "Guardar cambios" 
                  : "Crear Sprint"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 