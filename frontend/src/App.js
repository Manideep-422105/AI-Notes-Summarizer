import React from "react";
import Summarizer from "./pages/Summarizer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <div>
      <Summarizer />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default App;
