import { useAuth } from "../auth/AuthContext";
import useQuery from "../api/useQuery";
import useMutation from "../api/useMutation";
import { useState } from "react";

export default function ActivitiesPage() {
  const { token } = useAuth();

  const { data: activities, loading, error } = useQuery("/activities", "activities");

  // DELETE mutation — resource will be passed dynamically
  const { mutate: deleteActivity, error: deleteError } = useMutation("DELETE", null, ["activities"]);

  // POST mutation — for adding new activities
  const { mutate: addActivity, error: addError } = useMutation("POST", "/activities", ["activities"]);

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleDelete = (id) => {
    deleteActivity(null, `/activities/${id}`); // passing the full resource dynamically
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newName || !newDescription) return;
    addActivity({ name: newName, description: newDescription });
    setNewName("");
    setNewDescription("");
  };

  return (
    <div>
      <h1>Activities</h1>

      {loading && <p>Loading activities...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {activities?.map((activity) => (
          <li key={activity.id}>
            <strong>{activity.name}</strong>: {activity.description}
            {token && (
              <button onClick={() => handleDelete(activity.id)} style={{ marginLeft: "1rem" }}>
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>

      {deleteError && <p style={{ color: "red" }}>{deleteError}</p>}

      {token && (
        <>
          <h2>Add New Activity</h2>
          <form onSubmit={handleAdd}>
            <input
              type="text"
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              required
            />
            <button type="submit">Add Activity</button>
          </form>
          {addError && <p style={{ color: "red" }}>{addError}</p>}
        </>
      )}
    </div>
  );
}
