import { useEffect, useState } from "react";
import { REVIEWS_CSV_URL } from "./config.js";

function parseCSV(t) {
  const rows = []; let r = [], c = "", q = false;
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (q) {
      if (ch === '"') { if (t[i + 1] === '"') { c += '"'; i++; } else q = false; }
      else c += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") { r.push(c); c = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && t[i + 1] === "\n") i++;
      r.push(c); rows.push(r); r = []; c = "";
    } else c += ch;
  }
  if (c || r.length) { r.push(c); rows.push(r); }
  return rows;
}

export default function useReviews() {
  const [list, setList] = useState([]);
  useEffect(() => {
    if (!REVIEWS_CSV_URL) return;
    fetch(REVIEWS_CSV_URL)
      .then((r) => (r.ok ? r.text() : Promise.reject()))
      .then((t) => {
        const [head, ...rows] = parseCSV(t);
        const col = (k) => head.map((h) => h.trim().toLowerCase()).indexOf(k);
        const [n, s, x] = [col("name"), col("rating"), col("text")];
        setList(
          rows
            .filter((r) => (r[x] || "").trim())
            .map((r) => ({
              name: (r[n] || "Customer").trim(),
              place: "",
              rating: Math.min(5, Math.max(1, parseInt(r[s], 10) || 5)),
              text: r[x].trim(),
            }))
        );
      })
      .catch(() => {});
  }, []);
  return list;
}