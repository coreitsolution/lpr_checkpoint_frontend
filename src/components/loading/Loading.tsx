import LoadingTemplate from "./loading-template/LoadingTemplate";
import "./Loading.scss";

const Loading = () => {
  return (
    <div className="flex flex-col pulse-background">
      <LoadingTemplate />
    </div>
  );
};

export default Loading;
