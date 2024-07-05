import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./LoginForm";
import FormComponent from "./FormComponent";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/form" element={<FormComponent />} />
        <Route path="/" element={<LoginForm />} />
      </Routes>
    </Router>
  );
}
export default App;
