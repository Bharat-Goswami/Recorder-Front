import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAudio, DeleteAudio } from "./redux/audioSlice";
import { FaTrash } from "react-icons/fa";
import MovingComponent from "react-moving-text";
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
const GetAudioList = () => {
  const dispatch = useDispatch();
  const audio = useSelector((state) => state.audio);
  const [currentPage, setCurrentPage] = useState(1);
  const audiosPerPage = 3;

  useEffect(() => {
    dispatch(GetAudio());
  }, []);

  const indexOfLastAudio = currentPage * audiosPerPage;
  const indexOfFirstAudio = indexOfLastAudio - audiosPerPage;
  const currentAudios = audio.audios.slice(indexOfFirstAudio, indexOfLastAudio);

  const decodeFileBase64 = (str) => {
    return decodeURIComponent(
      atob(str)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = (audioId) => {

    dispatch(DeleteAudio(audioId));
    toast.error("Your audio is deleted!");
  };

  return (
    <div className="rounded p-3 my-2">
      <MovingComponent
        type="typewriter"
        duration="1s"
        dataText={[
          "Please check file size in console, at the end of base64 text.",
        ]}
      />
      <p className="text-center mb-0">
        Cannot save data more than <code>100Kb</code> to the database.
      </p>
      <h3 className="text-center text-success lead">
        <u>Previously Saved Recordings</u>
      </h3>
      {currentAudios.map((item) => (
        <div key={item._id}>
          <h4 className="d-none">{item.audio} </h4>
          <div className="audio-container">
            <audio src={item.audio} controls className="w-100" />
            <button
              className="btn btn-danger btn-sm ms-2 delete-button"
              onClick={() => handleDelete(item._id)}
            >
              <FaTrash />
            </button>
          </div>
          <br />
          <span>
            <span className="fw-bolder">Saved on: </span>{" "}
            {new Date(item.createdAt).toLocaleDateString("en-US")}{" "}
          </span>
          <span className="fw-bold">Time:</span>{" "}
          {new Date(item.createdAt).toLocaleTimeString("en-US")}
          {/* <button
            className="btn btn-danger btn-sm ms-2"
            onClick={() => handleDelete(item._id)}
          >
            <FaTrash />
          </button> */}
          <hr className="m-2" />
        </div>
      ))}
      <nav className="mt-3">
        <ul className="pagination justify-content-center">
          {Array.from(
            { length: Math.ceil(audio.audios.length / audiosPerPage) },
            (_, index) => (
              <li
                key={index}
                className={`page-item ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            )
          )}
        </ul>
      </nav>
      <ToastContainer />
    </div>
  );
};

export default GetAudioList;
