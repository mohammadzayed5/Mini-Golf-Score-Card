import { useEffect, useState } from "react";

export default function ApiHello() {
  const [msg, setMsg] = useState("Loading...");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/hello")
      .then(r => r.json())
      .then(d => setMsg(d.message))
      .catch(() => setMsg("Could not reach Flask"));
  }, []);

  return <p>{msg}</p>;
}
