'use client';
import React, { useEffect } from "react";
import axios from "axios";

export default function TestAxios() {
  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/todos/1")
      .then(res => console.log("✅ Axios works:", res.data))
      .catch(err => console.error("❌ Axios error:", err));
  }, []);

  return <div>Check console for Axios test result.</div>;
}
