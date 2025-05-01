import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AddTask, Visibility, Edit, Delete } from "@mui/icons-material";
import "./ScreenSprint.css";
import { ITask } from "../../../types/ITask";
import { Modal } from "../../ui/Modal/Modal";
import { useTaskStore, useSprintStore } from "../../../store";
import { showAlert, showConfirm } from "../../../utils/sweetAlert";
import { TaskDetailModal } from "../TaskDetailModal/TaskDetailModal";

export const ScreenSprint = () => {
  const { sprintId } = useParams<{ sprintId: string }>();
  const [showModal, setShowModal] = useState(false);
  const [isLoadingSprint, setIsLoadingSprint] = useState(true);

  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const handleShowDetails = (task: ITask) => {
    setSelectedTask(task);
  };
  const handleCloseDetails = () => {
    setSelectedTask(null);
  };

  const {
    currentSprint: sprint,
    error,
    fetchSprintById,
    moveTask,
    deleteTask,
    moveTaskToBacklog,
  } = useSprintStore();

  const { setActiveTask } = useTaskStore();

  useEffect(() => {
    const loadSprint = async () => {
      if (sprintId) {
        setIsLoadingSprint(true);
        try {
          await fetchSprintById(sprintId);
        } catch (error) {
          console.error("Error al cargar el sprint:", error);
          showAlert("Error al cargar la información del sprint", "error");
        } finally {
          setIsLoadingSprint(false);
        }
      }
    };
    
    loadSprint();
  }, [sprintId, fetchSprintById]);

  // Filtrar tareas por estado
  const getPendingTasks = (): ITask[] => {
    return sprint?.tareas.filter((task) => task.estado === "pendiente") || [];
  };

  const getInProgressTasks = (): ITask[] => {
    return sprint?.tareas.filter((task) => task.estado === "en-progreso") || [];
  };

  const getCompletedTasks = (): ITask[] => {
    return sprint?.tareas.filter((task) => task.estado === "completado") || [];
  };

  const handleOpenModal = () => {
    setActiveTask(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Recargar el sprint después de cerrar el modal
    if (sprintId) {
      fetchSprintById(sprintId);
    }
  };

  const handleEditTask = (taskId: string) => {
    if (!sprint) return;

    const task = sprint.tareas.find((t) => t.id === taskId);
    if (task) {
      setActiveTask(task);
      setShowModal(true);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!sprintId) return;

    const result = await showConfirm(
      "¿Eliminar tarea?",
      "¿Estás seguro de que deseas eliminar esta tarea?",
      "Sí, eliminar",
      "Cancelar"
    );

    if (result.isConfirmed) {
      try {
        await deleteTask(sprintId, taskId);
        showAlert("Tarea eliminada correctamente", "success");
      } catch (error) {
        console.error("Error al eliminar la tarea:", error);
        showAlert("No se pudo eliminar la tarea", "error");
      }
    }
  };

  const handleMoveTask = async (
    taskId: string,
    newStatus: "pendiente" | "en-progreso" | "completado"
  ) => {
    if (!sprintId) return;

    try {
      await moveTask(sprintId, taskId, newStatus);
    } catch (error) {
      console.error("Error al mover la tarea:", error);
      showAlert("No se pudo mover la tarea", "error");
    }
  };

  const handleMoveToBacklog = async (taskId: string) => {
    if (!sprintId) return;

    const result = await showConfirm(
      "¿Enviar al backlog?",
      "¿Estás seguro de que deseas enviar esta tarea al backlog?",
      "Sí, enviar",
      "Cancelar"
    );

    if (result.isConfirmed) {
      try {
        await moveTaskToBacklog(sprintId, taskId);
        showAlert("Tarea enviada al backlog correctamente", "success");
      } catch (error) {
        console.error("Error al mover la tarea al backlog:", error);
        showAlert("No se pudo mover la tarea al backlog", "error");
      }
    }
  };

  if (isLoadingSprint) {
    return <div className="screen-sprint loading">Cargando sprint...</div>;
  }

  if (error || !sprint) {
    return (
      <div className="screen-sprint error">
        {error || "Sprint no encontrado"}
      </div>
    );
  }

  return (
    <div className="screen-sprint">
      <div className="sprint-header">
        <h1>{sprint.nombre.toUpperCase()}</h1>
        <div className="header-actions">
          <span>
            Fecha de inicio: {sprint.fechaInicio} - Fecha de cierre:{" "}
            {sprint.fechaCierre}
          </span>
          <button className="create-task-btn" onClick={handleOpenModal}>
            Crear tarea
            <AddTask />
          </button>
        </div>
      </div>

      <div className="kanban-board">
        <div className="kanban-column">
          <h2>Pendiente</h2>
          <div className="tasks-container">
            {getPendingTasks().map((task) => (
              <div key={task.id} className="task-card">
                <div className="task-content">
                  <div>
                    <div className="task-header">
                      <span className="task-title">Título: {task.titulo}</span>
                    </div>
                    <span className="task-description">
                      Descripción: {task.descripcion}
                    </span>
                    {task.fechaLimite && (
                      <div className="task-limit">
                        Límite: {task.fechaLimite}
                      </div>
                    )}
                  </div>
                  <div className="task-actions">
                    <button
                      className="action-btn"
                      onClick={() => handleMoveToBacklog(task.id)}
                    >
                      Enviar al Backlog
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => handleMoveTask(task.id, "en-progreso")}
                    >
                      Mover a En Progreso
                    </button>
                  </div>
                </div>

                <div className="task-actions-vertical">
                  <button
                    className="action-btn"
                    title="Ver"
                    onClick={() => handleShowDetails(task)}
                  >
                    <Visibility />
                  </button>

                  <button
                    className="action-btn"
                    title="Editar"
                    onClick={() => handleEditTask(task.id)}
                  >
                    <Edit />
                  </button>
                  <button
                    className="action-btn"
                    title="Eliminar"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <Delete />
                  </button>
                </div>
              </div>
            ))}
            {getPendingTasks().length === 0 && (
              <p className="empty-column-message">No hay tareas pendientes</p>
            )}
          </div>
        </div>

        <div className="kanban-column">
          <h2>En progreso</h2>
          <div className="tasks-container">
            {getInProgressTasks().map((task) => (
              <div key={task.id} className="task-card">
                <div className="task-content">
                  <div>
                    <div className="task-header">
                      <span className="task-title">Título: {task.titulo}</span>
                    </div>
                    <span className="task-description">
                      Descripción: {task.descripcion}
                    </span>
                    {task.fechaLimite && (
                      <div className="task-limit">
                        Límite: {task.fechaLimite}
                      </div>
                    )}
                  </div>
                  <div className="task-actions">
                    <button
                      className="action-btn"
                      onClick={() => handleMoveTask(task.id, "pendiente")}
                    >
                      Mover a Pendiente
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => handleMoveTask(task.id, "completado")}
                    >
                      Mover a Completado
                    </button>
                  </div>
                </div>

                <div className="task-actions-vertical">
                  <button
                    className="action-btn"
                    title="Ver"
                    onClick={() => handleShowDetails(task)}
                  >
                    <Visibility />
                  </button>

                  <button
                    className="action-btn"
                    title="Editar"
                    onClick={() => handleEditTask(task.id)}
                  >
                    <Edit />
                  </button>
                  <button
                    className="action-btn"
                    title="Eliminar"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <Delete />
                  </button>
                </div>
              </div>
            ))}
            {getInProgressTasks().length === 0 && (
              <p className="empty-column-message">No hay tareas en progreso</p>
            )}
          </div>
        </div>

        <div className="kanban-column">
          <h2>Completado</h2>
          <div className="tasks-container">
            {getCompletedTasks().map((task) => (
              <div key={task.id} className="task-card">
                <div className="task-content">
                  <div>
                    <div className="task-header">
                      <span className="task-title">Título: {task.titulo}</span>
                    </div>
                    <span className="task-description">
                      Descripción: {task.descripcion}
                    </span>
                    {task.fechaLimite && (
                      <div className="task-limit">
                        Límite: {task.fechaLimite}
                      </div>
                    )}
                  </div>
                  <div className="task-actions">
                    <button
                      className="action-btn"
                      onClick={() => handleMoveTask(task.id, "en-progreso")}
                    >
                      Mover a En Progreso
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => handleMoveToBacklog(task.id)}
                    >
                      Enviar al Backlog
                    </button>
                  </div>
                </div>

                <div className="task-actions-vertical">
                  <button
                    className="action-btn"
                    title="Ver"
                    onClick={() => handleShowDetails(task)}
                  >
                    <Visibility />
                  </button>

                  <button
                    className="action-btn"
                    title="Editar"
                    onClick={() => handleEditTask(task.id)}
                  >
                    <Edit />
                  </button>
                  <button
                    className="action-btn"
                    title="Eliminar"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <Delete />
                  </button>
                </div>
              </div>
            ))}
            {getCompletedTasks().length === 0 && (
              <p className="empty-column-message">No hay tareas completadas</p>
            )}
          </div>
        </div>
      </div>
      {showModal && (
        <Modal handleCloseModal={handleCloseModal} sprintId={sprintId} />
      )}
      {selectedTask && (
        <TaskDetailModal task={selectedTask} onClose={handleCloseDetails} />
      )}
    </div>
  );
};
