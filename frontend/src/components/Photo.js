function Photo(props) {
  const p = props.photo;

  return (
    <div className="card mb-3" style={{ width: "400px" }}>
      <img
        className="card-img-top"
        src={"http://localhost:5001" + p.path}
        alt={p.name}
      />

      <div className="card-body">
        <h5>{p.name}</h5>

        <p>{p.message}</p>

        <p>
          👍 {p.likes} | 👎 {p.dislikes}
        </p>

        <p>
          <b>Avtor:</b> {p.postedBy?.username}
        </p>

        <p>
          <small>{new Date(p.createdAt).toLocaleString()}</small>
        </p>
      </div>
    </div>
  );
}

export default Photo;
