'use client';
import axios from "axios";
import { useEffect } from "react";

export default function TestAxios() {
  useEffect(() => {
    console.log("Axios is loaded:", axios);
  }, []);

  return <p>Check console for Axios</p>;
}

