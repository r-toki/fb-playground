import React, { useEffect, useState } from "react";
import firebase from "firebase/app";

import { db } from "./firebaseApp";

type Todo = {
  id: string;
  ref: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
  name: string;
};

function App() {
  const todosRef = db.collection("todos");
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const unsubscribe = todosRef.onSnapshot((snap) => {
      const newTodos = snap.docs.map((doc) => ({
        id: doc.id,
        ref: doc.ref,
        ...doc.data(),
      })) as Todo[];
      setTodos(newTodos);
    });
    return unsubscribe;
  }, [todosRef]);

  const addTodo = async () => {
    await todosRef.add({ name });
    setName("");
  };

  const [name, setName] = useState("");

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTodo();
        }}
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <div style={{ display: "flex", padding: "0.5rem 0" }}>
              <div style={{ marginRight: "1rem" }}>{todo.name}</div>
              <button onClick={() => todo.ref.delete()}>remove</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
