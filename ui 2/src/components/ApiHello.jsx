import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api.js";

export default function ApiHello() {
  const [msg, setMsg] = useState("Loading...");

  useEffect(() => {
    apiFetch("/api/hello")
      .then(r => r.json())
      .then(d => setMsg(d.message))
      .catch(() => setMsg("Could not reach Flask"));
  }, []);

  return <p>{msg}</p>;
}
