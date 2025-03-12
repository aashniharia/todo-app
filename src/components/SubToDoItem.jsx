export const SubTodoItem = ({ subTodo, todoId, onToggle, onDelete }) => (
  <li
    className={`flex items-center justify-between p-3 rounded-lg shadow-sm transition-all ${
      subTodo.isComplete ? "bg-gray-50" : "bg-white hover:shadow-md"
    }`}
  >
    <div className="flex items-center gap-2 flex-1">
      <input
        type="checkbox"
        checked={subTodo.isComplete}
        onChange={() => onToggle(todoId, subTodo._id, subTodo.isComplete)}
        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span
        className={`flex-1 ${
          subTodo.isComplete ? "line-through text-gray-500" : ""
        }`}
      >
        {subTodo.title}
      </span>
    </div>
    <button
      onClick={() => onDelete(todoId, subTodo._id)}
      className="ml-4 text-red-500 hover:text-red-700 transition-colors"
    >
      Delete
    </button>
  </li>
);
