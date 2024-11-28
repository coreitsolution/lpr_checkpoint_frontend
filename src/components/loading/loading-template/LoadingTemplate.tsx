import "../Loading.scss";

const LoadingTemplate = () => {
  return (
    <div className="flex flex-col items-center">
      {/* <div className="pulse"></div> */}
      <div className="spinner"></div>

      <p className="pt-6" style={{ fontWeight: "bolder", color: "white" }}>
        กรุณารอสักครู่...
      </p>
    </div>
  );
};

export default LoadingTemplate;
