import { useEffect, useState } from 'react';
import EditIcon from '../components/icons/EditIcon';
import TrashIcon from '../components/icons/TrashIcon';
import '../styles/PantryPage.css';
import { useAuth } from '../context/AuthContext';
import { getPantry, addIngredient, updateIngredient, deleteIngredient } from '../services/pantryService';
import { Ingredient } from '../types/Ingredient';

export default function PantryPage() {
  const { token, loading } = useAuth();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [editUnit, setEditUnit] = useState('');

  useEffect(() => {
    if (loading || !token) return;

    const fetchIngredients = async () => {
      try {
        const data = await getPantry(token);
        setIngredients(data);
      } catch (err) {
        console.error('Error fetching ingredients:', err);
      }
    };
    fetchIngredients();
  }, [token, loading]);

  // Add a new ingredient
  const handleAdd = async () => {
    // handle no token
    if (!token) {
      console.error("No token provided.");
      return;
    }

    const quantityNum = Number(newQuantity);
    if (!newName.trim() || !newUnit.trim() || isNaN(quantityNum) || quantityNum <= 0) return;

    try {
      const created = await addIngredient(token, { 
        name: newName.trim(),
        quantity: quantityNum,
        unit: newUnit.trim()
      });
      setIngredients([...ingredients, created]);
      setNewName('');
      setNewQuantity('');
      setNewUnit('');
      setIsAdding(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Remove an ingredient by ID
  const handleDelete = async (id: string) => {
    // handle no token
    if (!token) {
      console.error("No token provided.");
      return;
    }
    try {
      await deleteIngredient(token, id);
      setIngredients(ingredients.filter(ing => ing.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Start editing an ingredient
  const startEdit = (ingredient: Ingredient) => {
    setEditingId(ingredient.id);
    setEditName(ingredient.name);
    setEditQuantity(ingredient.quantity.toString());
    setEditUnit(ingredient.unit);
  };

  // Cancel editing mode
  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditQuantity('');
    setEditUnit('');
  };
  // save updated ingredient
  const handleSaveEdit = async () => {
    //handle no token
    if (!token) {
      console.error("No token provided.");
      return;
    }
    const quantityNum = Number(editQuantity);
    if (!editName.trim() || !editUnit.trim() || isNaN(quantityNum) || quantityNum <= 0 || !editingId) return;

    try {
      const updated = await updateIngredient(token, editingId, {
        name: editName.trim(),
        quantity: quantityNum,
        unit: editUnit.trim()
      });
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
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="edit-input"
                />
                <input
                  value={editQuantity}
                  type="number"
                  min="0.01"
                  step="0.01"
                  onChange={e => setEditQuantity(e.target.value)}
                  className="edit-input"
                />
                <select
                  value={editUnit}
                  onChange={e => setEditUnit(e.target.value)}
                  className="edit-input"
                >
                  <option value="">Select unit</option>
                  <option value="g">grams</option>
                  <option value="kg">kilograms</option>
                  <option value="ml">milliliters</option>
                  <option value="l">liters</option>
                  <option value="tsp">teaspoons</option>
                  <option value="tbsp">tablespoons</option>
                  <option value="cups">cups</option>
                  <option value="oz">ounces</option>
                  <option value="pieces">whole (e.g. eggs, tomatoes)</option>
                </select>
                <button onClick={handleSaveEdit}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <span className="pantry-item-label">
                  {item.quantity} {item.unit} × {item.name}
                </span>
                <button onClick={() => startEdit(item)}><EditIcon /></button>
                <button onClick={() => handleDelete(item.id)}><TrashIcon /></button>
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
            <select
              value={newUnit}
              onChange={e => setNewUnit(e.target.value)}
              className="edit-input"
            >
              <option value="">Select unit</option>
              <option value="g">grams</option>
              <option value="kg">kilograms</option>
              <option value="ml">milliliters</option>
              <option value="l">liters</option>
              <option value="tsp">teaspoons</option>
              <option value="tbsp">tablespoons</option>
              <option value="cups">cups</option>
              <option value="oz">ounces</option>
              <option value="pieces">whole (e.g. eggs, tomatoes)</option>
            </select>
            <button onClick={handleAdd} disabled={!newName || !newUnit || !newQuantity}>Save</button>
            <button onClick={() => setIsAdding(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}