function ProfileImageUpload({ onChange, preview }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (onChange) onChange(reader.result); // pass base64 to parent
    };
    reader.readAsDataURL(file);
  };

  return (
    <label
      htmlFor="profileUpload"
      className="position-relative d-inline-block"
      style={{ cursor: "pointer" }}
    >
      <img
        src={preview || "/default-avatar.png"} // default avatar
        alt="Profile"
        className="rounded-circle border"
        style={{
          width: "40px",
          height: "40px",
          objectFit: "cover",
          borderWidth: "2px",
        }}
      />
      <div
        className="position-absolute bottom-0 end-0 bg-primary rounded-circle d-flex align-items-center justify-content-center"
        style={{
          width: "20px",
          height: "20px",
          border: "2px solid white",
        }}
      >
        <i className="bi bi-pencil text-white" style={{ fontSize: "12px" }}></i>
      </div>
      <input
        type="file"
        id="profileUpload"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </label>
  );
}

export default ProfileImageUpload;
