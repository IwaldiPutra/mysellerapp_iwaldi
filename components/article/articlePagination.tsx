import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ArticlePaginationProps {
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function ArticlePagination({
  total,
  page,
  limit,
  onPageChange,
}: ArticlePaginationProps) {
  const totalPages = Math.ceil(total / limit);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (page < totalPages) onPageChange(page + 1);
  };

  const renderPageLinks = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={i === page}
            onClick={(e) => {
              e.preventDefault();
              if (i !== page) onPageChange(i);
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }
    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" onClick={handlePrev} />
        </PaginationItem>

        {renderPageLinks()}

        <PaginationItem>
          <PaginationNext href="#" onClick={handleNext} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
