import PacmanLoader from "react-spinners/PacmanLoader";

export default function Loading() {
  return (
    <div className="spinner-container">
      <PacmanLoader color="#994bb1" />
      <span>Loading</span>
    </div>
  );
}
