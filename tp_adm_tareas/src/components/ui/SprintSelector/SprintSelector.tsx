import React, { useState, useEffect } from 'react';
import './SprintSelector.css';
import { useSprintStore } from '../../../store';
import { SprintModal } from '../SprintModal/SprintModal';

interface SprintSelectorProps {
  onChange?: (sprintId: string) => void;
  value?: string;
}

export const SprintSelector: React.FC<SprintSelectorProps> = ({ 
  onChange,
  value = ""
}) => {
  const { sprints, fetchSprints } = useSprintStore();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchSprints();
  }, [fetchSprints]);


  const handleCloseModal = () => {
    setShowModal(false);
    // Refrescar la lista de sprints después de cerrar el modal
    fetchSprints();
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="sprint-selector-container">
      <select 
        className="sprint-select" 
        value={value} 
        onChange={handleChange}
      >
        <option value="">Seleccione un sprint</option>
        {sprints.map(sprint => (
          <option key={sprint.id} value={sprint.id}>
            {sprint.nombre}
          </option>
        ))}
      </select>
      

      {showModal && <SprintModal handleCloseModal={handleCloseModal} />}
    </div>
  );
}; 