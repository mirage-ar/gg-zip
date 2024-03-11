import React, { useState } from "react";

import styles from "./DropForm.module.css";

interface DropFormProps {
  latitude: number | undefined;
  longitude: number | undefined;
  fetchBoxes: () => void;
}

const DropForm: React.FC<DropFormProps> = ({ latitude, longitude, fetchBoxes }) => {
  const [boxCount, setBoxCount] = useState("");
  const [radius, setRadius] = useState(""); // [1
  const [pointRange, setPointRange] = useState({ start: "", end: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (latitude && longitude) {
      const result = await fetch("/api/boxes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude,
          longitude,
          boxCount: parseInt(boxCount, 10),
          min: parseInt(pointRange.start, 10),
          max: parseInt(pointRange.end, 10),
          radius: parseInt(radius, 10),
        }),
      });

      const data = await result.json();

      if (data.success) {
        console.log(data.boxes);
        fetchBoxes();
      }
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <div>
            Latitude: {latitude?.toFixed(6)}
            <br />
            Longitude: {longitude?.toFixed(6)}
          </div>
        </div>
        <div>
          <label>
            Radius:
            <input type="text" value={radius} onChange={(e) => setRadius(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Number of Boxes:
            <input type="text" value={boxCount} onChange={(e) => setBoxCount(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Point Range Start:
            <input
              type="text"
              value={pointRange.start}
              onChange={(e) => setPointRange({ ...pointRange, start: e.target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            Point Range End:
            <input
              type="text"
              value={pointRange.end}
              onChange={(e) => setPointRange({ ...pointRange, end: e.target.value })}
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default DropForm;
