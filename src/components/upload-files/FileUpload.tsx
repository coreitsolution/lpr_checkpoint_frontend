import React, { useState } from "react";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import "./Uploadfile.scss";

const FileUploadComponent = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  dayjs.extend(buddhistEra);

  const fileInputRef = React.createRef();

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to Array
    if (files.length > 0) {
      const newFiles = files.map((file, index) => {
        const imageUrl = URL.createObjectURL(file); // Generate preview URL
        return {
          id: uploadedFiles.length + index + 1,
          name: file.name,
          date: dayjs().locale("th").format("DD/MM/BBBB (HH:mm)"),
          status: "active",
          file: file,
          url: imageUrl,
        };
      });

      setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);

      // Set preview to the first file of the newly uploaded files
      setImageUrl(newFiles[0].url);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Open the file input dialog
    }
  };

  const deleteFile = (id) => {
    setUploadedFiles((prevFiles) => {
      const updatedFiles = prevFiles.map((file) =>
        file.id === id ? { ...file, status: "delete" } : file
      );

      // Check if all files are marked as "delete"
      if (updatedFiles.every((file) => file.status === "delete")) {
        setImageUrl(null); // Clear preview image
      } else {
        // Update preview to the first active file
        const firstActiveFile = updatedFiles.find(
          (file) => file.status !== "delete"
        );
        setImageUrl(firstActiveFile ? firstActiveFile.url : null);
      }

      return updatedFiles;
    });
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "ชื่อไฟล์",
      flex: 1,
      renderCell: (params) => (
        <a
          href="#!"
          onClick={() => setImageUrl(params.row.url)}
          style={{ color: "white", textDecoration: "underline" }}
        >
          {params.value}
        </a>
      ),
    },
    { field: "date", headerName: "วันที่อัปโหลด", flex: 1 },
    {
      field: "actions",
      headerName: "ลบ",
      sortable: false,
      flex: 0.5,
      renderCell: (params) => (
        <Button
          onClick={() => deleteFile(params.row.id)}
          style={{ color: "red" }}
          startIcon={<img src="/icons/bin.png" alt="Delete" />}
        ></Button>
      ),
    },
  ];

  return (
    <div className="w-full ml-4">
      <div className="flex flex-col items-center justify-center align-middle">
        {/* Conditional Preview Display */}
        {imageUrl && (
          <div className="flex justify-center">
            <img
              src={imageUrl}
              alt="Uploaded"
              className="img-fluid mb-3 rounded"
              style={{
                width: "150px",
                height: "150px",
                objectFit: "contain",
              }}
            />
          </div>
        )}

        <div className="flex flex-col w-full align-middle justify-center items-center ">
          <p className="text-white mb-3">อัพโหลดไฟล์</p>
          <input
            type="file"
            ref={fileInputRef}
            multiple // Allow multiple files
            style={{ display: "none" }}
            onChange={handleFileChange} // Handle file upload when selected
          />
          <Button
            variant="contained"
            className="primary-btn"
            onClick={handleUploadClick} // Trigger file input dialog
            startIcon={<DriveFolderUploadIcon />}
          >
            Upload Files
          </Button>
        </div>

        <div style={{ height: 300, width: "100%" }} className="mt-3">
          {uploadedFiles.filter((x) => x.status !== "delete").length > 0 ? (
            <DataGrid
              rows={uploadedFiles.filter((file) => file.status !== "delete")}
              columns={columns}
              sx={{
                border: 0,
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#242727",
                  color: "white",
                },
                "& .MuiDataGrid-container--top [role=row]": {
                  backgroundColor: "#242727",
                  color: "white",
                  border: "none",
                },
                "& .MuiDataGrid-cell": {
                  "&:nth-of-type(even)": {
                    backgroundColor: "#393B3A",
                  },
                  "&:nth-of-type(odd)": {
                    backgroundColor: "#48494B",
                  },
                  color: "white",
                },
                "& .MuiDataGrid-footerContainer": {
                  display: "content",
                },
              }}
              disableColumnMenu
              disableColumnSorting
              disableColumnFilter
              disableColumnResize
              pagination
              hideFooterPagination
              disableRowSelectionOnClick
            />
          ) : (
            <div className="text-white"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploadComponent;
