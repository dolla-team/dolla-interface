const ErrorPage = () => {
  return (
    <div
      style={{
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh"
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1>Oops! Something went wrong.</h1>
        <p>We're sorry, but an unexpected error occurred.</p>
      </div>
      <button
        style={{
          padding: "10px 20px",
          backgroundColor: "rgb(221, 144, 0)",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "20px"
        }}
        onClick={() => window.location.reload()}
      >
        Reload Page
      </button>
    </div>
  );
};

export default ErrorPage;
