import React, { useState } from "react";
import {
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const CustomPagination = () => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#000",
        padding: "10px 20px",
        color: "#fff",
      }}
    >
      {/* Rows per page dropdown */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ marginRight: "8px" }}>แสดง</span>
        <FormControl variant="outlined" size="small">
          <Select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            style={{ backgroundColor: "#fff", color: "#000", width: "80px" }}
          >
            {[10, 20, 50, 100].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Pagination */}
      <Pagination
        count={4} // Total number of pages
        page={currentPage}
        onChange={handlePageChange}
        siblingCount={1}
        boundaryCount={1}
        shape="rounded"
        color="primary"
        renderItem={(item) => ({
          ...item,
          style: {
            color: "#fff",
            backgroundColor: item.selected ? "#424242" : "#000",
            border: "1px solid #fff",
          },
        })}
      />

      {/* Current page dropdown */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ marginRight: "8px" }}>หน้า</span>
        <FormControl variant="outlined" size="small">
          <Select
            value={currentPage}
            onChange={(e) => setCurrentPage(e.target.value)}
            style={{ backgroundColor: "#fff", color: "#000", width: "80px" }}
          >
            {[1, 2, 3, 4].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

export default CustomPagination;
