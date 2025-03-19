import { useEffect, useState, useCallback } from "react";
import Todo from "./components/Todo";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import Loader from "./components/Loader";

const App = () => {
  const [isServerAwake, setIsServerAwake] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const checkServer = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/health`);
      setIsServerAwake(response.data.status === "ok");
    } catch (error) {
      console.log("Server is not awake", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkServer();
  }, [checkServer]);

  if (isLoading) {
    return <Loader message="Server is not awake please wait..." />;
  }
  return (
    <div className="min-h-screen bg-gray-100 py-8 w-full">
      {isServerAwake ? (
        <Todo />
      ) : (
        <p className="text-center text-red-500">
          Server is down. Please try again later.
        </p>
      )}
    </div>
  );
};

export default App;
