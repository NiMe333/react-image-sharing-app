import { useState, useEffect } from "react";
import Photo from "./Photo";

function Photos() {
  const [photos, setPhotos] = useState([]);

  useEffect(function () {
    const getPhotos = async function () {
      const res = await fetch("http://localhost:5001/photos");
      const data = await res.json();
      setPhotos(data);
    };
    getPhotos();
  }, []);

  return (
    <div>
      <h3>Photos:</h3>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {photos.map((photo) => (
          <Photo photo={photo} key={photo._id} />
        ))}
      </div>
    </div>
  );
}

export default Photos;
