import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select'

// Component
import TextBox from '../../components/text-box/TextBox'

interface PaginationProps {
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  handleRowsPerPageChange: (event: SelectChangeEvent) => void;
  totalPages: number;
  pageInput: string;
  handlePageInputKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  handlePageInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  textFieldFontSize?: string
}

const PaginationComponent: React.FC<PaginationProps> = ({
  page,
  onChange,
  rowsPerPage,
  rowsPerPageOptions,
  handleRowsPerPageChange,
  totalPages,
  pageInput,
  handlePageInputKeyDown,
  handlePageInputChange,
  textFieldFontSize,
}) => {
  return (
    <div className='flex items-center justify-between w-full'>
      <div className="flex items-center space-x-4">
        <p className="text-white text-[16px]">แสดง</p>
        <Select
          id="row-per-page-select"
          value={rowsPerPage.toString()}
          onChange={handleRowsPerPageChange}
          className="bg-white h-[35px] min-w-[100px] w-[100px]"
          size="medium"
        >
          {rowsPerPageOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className='flex justify-center items-center'>
        <Stack spacing={2}>
          <Pagination
            sx={{
              display: 'flex',
              justifyContent: 'end',
              "& .MuiPaginationItem-page": {
                color: "black",
                backgroundColor: "#D9D9D9",
              },
              "& .MuiPaginationItem-page:hover": {
                backgroundColor: "#1E1E1E",
                color: "white",
              },
              "& .MuiPaginationItem-previousNext": {
                color: "black",
                backgroundColor: "#D9D9D9",
              },
              "& .MuiPaginationItem-ellipsis": {
                color: "white",
              },
              "& .MuiPaginationItem-page.Mui-selected": {
                backgroundColor: "#1E1E1E",
                color: "white",
              },
            }}
            count={totalPages}
            variant="outlined"
            shape="rounded"
            page={page}
            onChange={onChange}
          />
        </Stack>
        <div className="flex items-center space-x-2 ml-3">
          <p className="text-white text-[16px]">
            หน้า
          </p>
          <TextBox
            id="input-page"
            label=""
            placeHolder=""
            className="w-[200px]"
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
            textFieldFontSize={textFieldFontSize}
            value={pageInput}
            onKeyDown={handlePageInputKeyDown}
            onChange={handlePageInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PaginationComponent;