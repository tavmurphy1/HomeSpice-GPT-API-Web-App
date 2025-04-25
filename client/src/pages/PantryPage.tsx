import React, { useState } from 'react';
import EditIcon from '../components/icons/EditIcon';
import TrashIcon from '../components/icons/TrashIcon';
import '../styles/PantryPage.css';

export default function PantryPage() {
  // placeholders
  const [items, setItems] = useState([
    { id: 1, label: '4 Kielbasa Sausages' },
    { id: 2, label: '3 Red Peppers' },
    { id: 3, label: 'Oats' },
    { id: 4, label: 'Heavy Cream' },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState('');

  const handleAdd = () => {
    if (!newLabel.trim()) return;
    setItems([
      ...items,
      { id: Date.now(), label: newLabel.trim() }
    ]);
    setNewLabel('');
    setIsAdding(false);
  };

  const handleDelete = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleEdit = (id: number) => {
    // TO DO: Implement edit functionality
    console.log('edit', id);
  };

  return (
    <div className="pantry-page">
      <h1>Your Pantry</h1>
      <div className="pantry-list">
        {items.map(item => (
          <div key={item.id} className="pantry-item">
            <span className="pantry-item-label">{item.label}</span>
            <button onClick={() => handleEdit(item.id)}>
              <EditIcon/>
            </button>
            <button onClick={() => handleDelete(item.id)}>
              <TrashIcon/>
            </button>
          </div>
        ))}
      </div>

      <button className="new-item-button" onClick={() => setIsAdding(true)}>
        New Item
      </button>

      {isAdding && (
        <div className="modal">
          <div className="modal-content">
            <input
              type="text"
              placeholder="e.g. 2 Cups Flour"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
            />
            <button onClick={handleAdd}>Save</button>
            <button onClick={() => setIsAdding(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}