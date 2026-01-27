import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// @ts-ignore
import { makeServer } from "./mirage/server";

if (import.meta.env.DEV) {
  makeServer({ environment: "development" });
}

createRoot(document.getElementById("root")!).render(<App />);

