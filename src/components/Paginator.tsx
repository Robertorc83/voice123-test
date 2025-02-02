import { FC } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

interface PaginatorProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
}

const Paginator: FC<PaginatorProps> = ({ currentPage, onPageChange, totalPages }) => {
  const pageNeighbours = 2;
  const totalNumbers = pageNeighbours * 2 + 1;

  let pages: number[] = [];

  if (totalPages <= totalNumbers + 2) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    pages = [1];

    let startPage = Math.max(2, currentPage - pageNeighbours);
    let endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);

    if (currentPage <= pageNeighbours + 1) {
      startPage = 2;
      endPage = totalNumbers;
    }

    if (currentPage >= totalPages - pageNeighbours) {
      startPage = totalPages - totalNumbers + 1;
      endPage = totalPages - 1;
    }

    if (startPage > 2) {
      pages.push(-1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push(-1);
    }

    pages.push(totalPages);
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8, flexWrap: 'wrap', gap: 1 }}>
      {/* Prev Button */}
      <Button
        variant="outlined"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        sx={{ borderColor: 'black', color: 'black' }}
      >
        Prev
      </Button>

      {/* Page Numbers and Ellipsis */}
      {pages.map((page, index) => {
        if (page === -1) {
          return (
            <Button
              key={`ellipsis-${index}`}
              variant="outlined"
              disabled
              sx={{ borderColor: 'black', color: 'black' }}
            >
              ...
            </Button>
          );
        }
        return (
          <Button
            key={page}
            variant={page === currentPage ? 'contained' : 'outlined'}
            onClick={() => onPageChange(page)}
            sx={
              page === currentPage
                ? { backgroundColor: 'white', borderColor: 'black', color: 'black' }
                : { borderColor: 'black', color: 'black' }
            }
          >
            {page}
          </Button>
        );
      })}

      {/* Next Button */}
      <Button
        variant="outlined"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        sx={{ borderColor: 'black', color: 'black' }}
      >
        Next
      </Button>
    </Box>
  );
};

export default Paginator;
