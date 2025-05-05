import React, { useEffect, useState } from 'react';
import EditIcon from '../components/icons/EditIcon';
import TrashIcon from '../components/icons/TrashIcon';
import '../styles/PantryPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

type Ingredient = {
  id: string;
  name: string;
  quantity: number;
};

export default function PantryPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editQuantity, setEditQuantity] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/ingredients`)
      .then(res => res.json())
      .then(setIngredients)
      .catch(err => console.error('Error fetching ingredients:', err));
  }, []);

  const handleAdd = async () => {
    const quantityNum = Number(newQuantity);
    if (!newName.trim() || isNaN(quantityNum) || quantityNum <= 0) return;

    try {
      const res = await fetch(`${API_URL}/ingredients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), quantity: quantityNum }),
      });

      if (!res.ok) throw new Error('Failed to add ingredient');
      const created: Ingredient = await res.json();
      setIngredients([...ingredients, created]);
      setNewName('');
      setNewQuantity('');
      setIsAdding(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/ingredients/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setIngredients(ingredients.filter(ing => ing.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (ingredient: Ingredient) => {
    setEditingId(ingredient.id);
    setEditName(ingredient.name);
    setEditQuantity(ingredient.quantity.toString());
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditQuantity('');
  };

  const handleSaveEdit = async () => {
    const quantityNum = Number(editQuantity);
    if (!editName.trim() || isNaN(quantityNum) || quantityNum <= 0 || !editingId) return;

    try {
      const res = await fetch(`${API_URL}/ingredients/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim(), quantity: quantityNum }),
      });

      if (!res.ok) throw new Error('Edit failed');
      const updated: Ingredient = await res.json();

      setIngredients(ingredients.map(i => i.id === updated.id ? updated : i));
      cancelEdit();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pantry-page">
      <h1>Your Pantry</h1>
      <div className="pantry-list">
        {ingredients.map(item => (
          <div key={item.id} className="pantry-item">
            {editingId === item.id ? (
              <>
                <input
                  className="edit-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <input
                  className="edit-input"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(e.target.value)}
                />
                <button onClick={handleSaveEdit}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <span className="pantry-item-label">
                  {item.quantity} × {item.name}
                </span>
                <button onClick={() => startEdit(item)}>
                  <EditIcon />
                </button>
                <button onClick={() => handleDelete(item.id)}>
                  <TrashIcon />
                </button>
              </>
            )}
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
              placeholder="Name (e.g. Flour)"
              value={newName}
              onChange={e => setNewName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Quantity (e.g. 2.5)"
              value={newQuantity}
              min="0.01"
              step="0.01"
              onChange={e => setNewQuantity(e.target.value)}
            />
            <button onClick={handleAdd}>Save</button>
            <button onClick={() => setIsAdding(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}