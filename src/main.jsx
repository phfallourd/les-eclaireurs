import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Service worker : mode hors ligne sur chantier (sous-sols, parkings…).
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Enregistrement impossible (http, navigateur ancien) : l'app
      // fonctionne quand même, simplement sans cache hors ligne.
    });
  });
}
