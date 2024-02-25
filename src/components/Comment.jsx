import { useState, useRef, useEffect } from "react";
import Action from "./Action";
import { ReactComponent as DownArrow } from "../assets/down-arrow.svg";
import { ReactComponent as UpArrow } from "../assets/up-arrow.svg";
import { ReactComponent as StarOutlined } from "../assets/white-star.svg";
import { ReactComponent as StarFilled } from "../assets/yellow-star.svg";

const Comment = (props) => {
  const {
    handleInsertNode,
    handleEditNode,
    handleDeleteNode,
    comment,
    comments,
  } = props;
  const [input, setInput] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [expand, setExpand] = useState(false);
  const [sortOrder, setSortOrder] = useState("ascending");
  const [timestamp, setTimestamp] = useState(new Date());
  const [starred, setStarred] = useState(false); // State to track starred status
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef?.current?.focus();
    // Retrieve comments from local storage on component mount
    const storedComments = localStorage.getItem("comments");
    if (storedComments) {
      try {
        // Parse the stored JSON data
        const parsedComments = JSON.parse(storedComments);
        // Update comments state with parsed comments
        handleInsertNode(parsedComments);
      } catch (error) {
        // Handle JSON parsing error
        console.error("Error parsing stored comments:", error);
      }
    }
  }, []);

  // Update local storage whenever comments state changes
  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments));
  }, [comments]);

  const handleNewComment = () => {
    setExpand(!expand);
    setShowInput(true);
    setTimestamp(new Date());
  };

  const onAddComment = () => {
    if (editMode) {
      handleEditNode(comment.id, inputRef?.current?.innerText);
    } else {
      setExpand(true);
      handleInsertNode(comment.id, input);
      setShowInput(false);
      setInput("");
    }
    setEditMode(false);
  };

  const handleDelete = () => {
    handleDeleteNode(comment.id);
  };

  const formatTimestamp = (date) => {
    const currentDate = date || timestamp;
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();
    return `${formattedDate}`;
  };

  // Function to handle toggling the star symbol
  const toggleStar = () => {
    setStarred(!starred); // Toggle starred status
  };

  return (
    <div>
      <div className={comment.id === 1 ? "inputContainer" : "commentContainer"}>
        {comment.id === 1 ? (
          <>
            <div className="heading">
              <h2 className="text-center">What on your mind ?</h2>
            </div>
            <input
              id="results"
              type="text"
              className="inputContainer__input first_input"
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a Comment...."
            />

            <Action
              className="reply2 comment2"
              type="POST"
              handleClick={onAddComment}
            />
            <div className="box">
              <div className="heading3">
                <h6>Replies :</h6>
              </div>
              <div className="heading4">
                <h6>Sort According to :</h6>
              </div>
              <div>
                <button id="select">Date Posted</button>
              </div>
            </div>
          </>
        ) : (
          <>
            <span
              contentEditable={editMode}
              suppressContentEditableWarning={editMode}
              ref={inputRef}
              style={{ wordWrap: "break-word" }}
            >
              {comment.name}
            </span>

            <div style={{ display: "flex", marginTop: "5px" }}>
              {/* {editMode ? (
                <>
                  <Action
                    className="reply"
                    type="SAVE"
                    handleClick={onAddComment}
                  />
                  <Action
                    className="reply"
                    type="CANCEL"
                    handleClick={() => {
                      if (inputRef.current)
                        inputRef.current.innerText = comment.name;
                      setEditMode(false);
                    }}
                  />
                </>
              ) : ( */}
              <>
                {/* <div className="replybox"> */}
                <Action
                  className="reply"
                  type={
                    <>
                      {expand ? (
                        <UpArrow width="10px" height="10px" />
                      ) : (
                        <DownArrow width="10px" height="10px" />
                      )}{" "}
                      REPLY
                    </>
                  }
                  handleClick={handleNewComment}
                />
                {/* <Action
                    className="reply"
                    type="EDIT"
                    handleClick={() => {
                      setEditMode(true);
                    }}
                  /> */}
                <Action
                  className="reply"
                  type="DELETE"
                  handleClick={handleDelete}
                />
                {/* </div> */}

                <div className="starButton" onClick={toggleStar}>
                  {starred ? (
                    <StarFilled id="star_img2" />
                  ) : (
                    <StarOutlined id="star_img" />
                  )}
                </div>
              </>
              {/* )} */}
            </div>
          </>
        )}

        <span className="comment-timestamp">{formatTimestamp(timestamp)}</span>

        {/* Toggle timestamp button */}
        {/* <div className="toggle-timestamp" onClick={toggleTimestamp}>
          Toggle Timestamp
        </div> */}
      </div>

      <div
        className="ex"
        style={{ display: expand ? "block" : "none", paddingLeft: 150 }}
      >
        {showInput && (
          <div className="inputContainer2">
            <input
              id="results1"
              type="text"
              className="inputContainer__input"
              autoFocus
              onChange={(e) => setInput(e.target.value)}
            />

            <Action className="reply" type="REPLY" handleClick={onAddComment} />
            <Action
              className="reply"
              type="CANCEL"
              handleClick={() => {
                setShowInput(false);
                if (!comment?.items?.length) setExpand(false);
              }}
            />
          </div>
        )}
        <div>
          {/* Render comment components and UI elements here */}
          {/* Button to toggle timestamp display */}
          <Action
            className="toggle-timestamp"
            // type={showTimestamp ? "Hide Timestamp" : "Show Timestamp"}
            // handleClick={toggleTimestamp}
          />
        </div>

        {comment?.items?.map((cmnt) => (
          <Comment
            key={cmnt.id}
            handleInsertNode={handleInsertNode}
            handleEditNode={handleEditNode}
            handleDeleteNode={handleDeleteNode}
            comment={cmnt}
          />
        ))}
      </div>
    </div>
  );
};

export default Comment;
