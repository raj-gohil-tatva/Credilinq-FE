import { Typography, IconButton, Button } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import ClassNames from "classNames";

const FileUpload = ({
  selectedFiles,
  setSelectedFiles,
  fileUploadError,
  disabled,
}: {
  selectedFiles: any[];
  setSelectedFiles: Dispatch<SetStateAction<any>>;
  fileUploadError: any;
  disabled: boolean;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const handleFileUpload = (event: any, isDropUpload: boolean) => {
    event.preventDefault();
    let files = event?.target?.files || [];
    if (isDropUpload) {
      files = event?.dataTransfer?.files;
    }
    const allowedTypes = ["application/pdf"];
    const filteredFiles = Array.from(files).filter((file: any) =>
      allowedTypes.includes(file.type)
    ) as any;
    setSelectedFiles(filteredFiles);
    // Process the uploaded files here
    console.log(filteredFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleFileUpload(e, true)}
        onClick={handleClick}
        className={ClassNames("file-upload-wrapper", {
          "file-upload-wrapper-disabled": disabled,
        })}
      >
        <input
          disabled={disabled}
          key={fileInputKey}
          ref={fileInputRef}
          id="upload-input"
          type="file"
          accept="application/pdf"
          multiple
          style={{ display: "none" }}
          onChange={(e) => handleFileUpload(e, false)}
        />
        <IconButton component="span" size="large" className="upload-button">
          <UploadFileIcon />
        </IconButton>
        <Typography
          variant="body2"
          className={ClassNames("file-upload-title", {
            "file-upload-title-disabled": disabled,
          })}
        >
          {selectedFiles.length === 0 ? (
            <>
              <u className={"click-to-upload"}>Click to upload</u> or drag and
              drop Bank Statements
            </>
          ) : (
            `${selectedFiles.length} PDF file(s) selected`
          )}
        </Typography>
      </div>
      <Typography className="terms-and-conditions-error">
        {fileUploadError}
      </Typography>
      {selectedFiles && selectedFiles.length > 0 && (
        <Button
          variant="text"
          className="remove-all-button"
          onClick={() => {
            setFileInputKey((prevKey) => prevKey + 1);
            setSelectedFiles([]);
          }}
        >
          remove all
        </Button>
      )}
    </>
  );
};

export default FileUpload;
