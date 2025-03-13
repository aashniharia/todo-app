import { useState, useEffect } from "react";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("API URL:", API_BASE_URL);
import { SubTodoItem } from "./SubToDoItem";

function Todo() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [newSubTodo, setNewSubTodo] = useState("");
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [priority, setPriority] = useState("medium");
  const [sortBy, setSortBy] = useState("createdAt");
  const [expandedCards, setExpandedCards] = useState({});

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      console.log("fetching todos");
      const response = await axios.get(`${API_BASE_URL}/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/todos`, {
        title: newTodo,
        subTodos: [],
      });
      setTodos([response.data, ...todos]);
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const addSubTodo = async (todoId) => {
    if (!newSubTodo.trim()) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/todos/${todoId}/subtodos`,
        {
          title: newSubTodo,
          priority,
          isComplete: false,
        }
      );

      setTodos(
        todos.map((todo) =>
          todo._id === todoId
            ? { ...todo, subTodos: [...todo.subTodos, response.data] }
            : todo
        )
      );
      setNewSubTodo("");
    } catch (error) {
      console.error("Error adding subtodo:", error);
    }
  };

  const toggleSubTodoComplete = async (todoId, subTodoId, isComplete) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/todos/${todoId}/subtodos/${subTodoId}`,
        {
          isComplete: !isComplete,
        }
      );

      setTodos(
        todos.map((todo) =>
          todo._id === todoId
            ? {
                ...todo,
                subTodos: todo.subTodos.map((subTodo) =>
                  subTodo._id === subTodoId ? response.data : subTodo
                ),
              }
            : todo
        )
      );
    } catch (error) {
      console.error("Error updating subtodo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const deleteSubTodo = async (todoId, subTodoId) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/todos/${todoId}/subtodos/${subTodoId}`
      );
      setTodos(
        todos.map((todo) =>
          todo._id === todoId
            ? {
                ...todo,
                subTodos: todo.subTodos.filter(
                  (subTodo) => subTodo._id !== subTodoId
                ),
              }
            : todo
        )
      );
    } catch (error) {
      console.error("Error deleting subtodo:", error);
    }
  };

  const sortTodos = (todos) => {
    if (sortBy === "priority") {
      return [...todos].sort((a, b) => {
        const aPriority = a.subTodos.reduce((max, subTodo) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return Math.max(max, priorityOrder[subTodo.priority] || 0);
        }, 0);
        const bPriority = b.subTodos.reduce((max, subTodo) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return Math.max(max, priorityOrder[subTodo.priority] || 0);
        }, 0);
        return bPriority - aPriority;
      });
    }
    return [...todos].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  };

  const toggleCard = (todoId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [todoId]: !prev[todoId],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pt-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-900">
        Todo App
      </h1>

      <form onSubmit={addTodo} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo list"
            className="flex-1 p-2 rounded-lg shadow-sm border-0 focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-white/80 backdrop-blur-sm"
          />
          <button
            type="submit"
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-600 transition-all"
          >
            Add List
          </button>
        </div>
      </form>

      <div className="mb-4 flex justify-between items-center">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 rounded-lg shadow-sm border-0 focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-white/80 backdrop-blur-sm"
        >
          <option value="createdAt">Sort by Date</option>
          <option value="priority">Sort by Priority</option>
        </select>
      </div>

      <ul className="space-y-4">
        {sortTodos(todos).map((todo) => (
          <li
            key={todo._id}
            className="rounded-xl p-6 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4 flex-1">
                <button
                  onClick={() => toggleCard(todo._id)}
                  className="text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <svg
                    className={`w-6 h-6 transform transition-transform ${
                      expandedCards[todo._id] ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div>
                  <h3 className="text-xl font-semibold">{todo.title}</h3>
                  <p className="text-sm text-gray-600">
                    {todo.subTodos.filter((st) => st.isComplete).length} of{" "}
                    {todo.subTodos.length} tasks completed
                  </p>
                </div>
              </div>
              <button
                onClick={() => deleteTodo(todo._id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                Delete List
              </button>
            </div>

            <div
              className={`transition-all duration-300 ease-in-out ${
                expandedCards[todo._id]
                  ? "opacity-100 max-h-[2000px]"
                  : "opacity-0 max-h-0 overflow-hidden"
              }`}
            >
              <div className="mb-4 bg-gray-50 p-4 rounded-lg shadow-inner">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Add New Tasks
                </h4>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={selectedTodo === todo._id ? newSubTodo : ""}
                      onChange={(e) => {
                        setSelectedTodo(todo._id);
                        setNewSubTodo(e.target.value);
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSubTodo(todo._id);
                        }
                      }}
                      placeholder="Type task and press Enter to add multiple"
                      className="flex-1 p-2 rounded-lg shadow-sm border-0 focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-white/80"
                    />
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="p-2 rounded-lg shadow-sm border-0 focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-white/80"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                    <button
                      onClick={() => addSubTodo(todo._id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-green-600 transition-all"
                    >
                      Add
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Press Enter after each task to add multiple tasks quickly
                  </p>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-700">Tasks</h4>
                  <span className="text-sm text-gray-500">
                    {todo.subTodos.length} tasks
                  </span>
                </div>

                <ul className="space-y-2">
                  {todo.subTodos.length === 0 ? (
                    <li className="text-gray-500 text-center py-4 bg-gray-50 rounded-lg shadow-inner">
                      No tasks added yet. Add your first task above!
                    </li>
                  ) : (
                    <>
                      {todo.subTodos.filter((st) => st.priority === "high")
                        .length > 0 && (
                        <li className="mb-4">
                          <h5 className="text-xs font-semibold text-red-600 mb-2">
                            HIGH PRIORITY
                          </h5>
                          <ul className="space-y-2">
                            {todo.subTodos
                              .filter((st) => st.priority === "high")
                              .map((subTodo) => (
                                <SubTodoItem
                                  key={subTodo._id}
                                  subTodo={subTodo}
                                  todoId={todo._id}
                                  onToggle={toggleSubTodoComplete}
                                  onDelete={deleteSubTodo}
                                />
                              ))}
                          </ul>
                        </li>
                      )}

                      {todo.subTodos.filter((st) => st.priority === "medium")
                        .length > 0 && (
                        <li className="mb-4">
                          <h5 className="text-xs font-semibold text-yellow-600 mb-2">
                            MEDIUM PRIORITY
                          </h5>
                          <ul className="space-y-2">
                            {todo.subTodos
                              .filter((st) => st.priority === "medium")
                              .map((subTodo) => (
                                <SubTodoItem
                                  key={subTodo._id}
                                  subTodo={subTodo}
                                  todoId={todo._id}
                                  onToggle={toggleSubTodoComplete}
                                  onDelete={deleteSubTodo}
                                />
                              ))}
                          </ul>
                        </li>
                      )}

                      {todo.subTodos.filter((st) => st.priority === "low")
                        .length > 0 && (
                        <li className="mb-4">
                          <h5 className="text-xs font-semibold text-green-600 mb-2">
                            LOW PRIORITY
                          </h5>
                          <ul className="space-y-2">
                            {todo.subTodos
                              .filter((st) => st.priority === "low")
                              .map((subTodo) => (
                                <SubTodoItem
                                  key={subTodo._id}
                                  subTodo={subTodo}
                                  todoId={todo._id}
                                  onToggle={toggleSubTodoComplete}
                                  onDelete={deleteSubTodo}
                                />
                              ))}
                          </ul>
                        </li>
                      )}
                    </>
                  )}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
