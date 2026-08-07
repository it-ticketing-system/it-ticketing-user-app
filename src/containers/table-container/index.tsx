'use client';

import { Pagination, Spinner, Table } from '@heroui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Suspense, type ReactNode } from 'react';
import { ICON_SIZE_CLASS } from '@/constants';
import { useQueryState } from '@/hooks';
import type { PaginationMeta } from '@/apis/core/types/api-response';

type TableKey = string | number;

type TableSkeletonType =
  'text' | 'double-text' | 'action' | 'image-text' | 'badge';

export interface TableHeaderOptions<TColumnKey extends TableKey = TableKey> {
  id: TColumnKey;
  label: ReactNode;
  className?: string;
  isRowHeader?: boolean;
  skeletonType?: TableSkeletonType;
}

interface TablePaginationOptions extends PaginationMeta {
  pageParam?: string;
  isPending?: boolean;
  onPageChange?: (page: number) => void;
}

interface TablePaginationLabels {
  previous: string;
  next: string;
  page: (page: number) => string;
  summary: (data: { from: number; to: number; total: number }) => ReactNode;
}

interface TableContainerProps<
  TItem extends { id: TableKey },
  TColumnKey extends TableKey = TableKey,
> {
  ariaLabel: string;
  headerCells: Array<TableHeaderOptions<TColumnKey>>;
  isLoading?: boolean;
  loadingLabel?: ReactNode;
  errorComponent?: ReactNode;
  emptyComponent?: ReactNode;
  pagination?: TablePaginationOptions;
  paginationLabels?: TablePaginationLabels;
  paginationFallback?: ReactNode;
  items: TItem[];
  children: (item: TItem) => ReactNode;
}

type PaginationToken = number | 'start-ellipsis' | 'end-ellipsis';

const createPaginationItems = (
  currentPage: number,
  totalPages: number,
): PaginationToken[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'end-ellipsis', totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      'start-ellipsis',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    'start-ellipsis',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'end-ellipsis',
    totalPages,
  ];
};

const TablePaginationFallback = () => {
  return (
    <div
      aria-hidden="true"
      className="flex w-full items-center justify-between"
    >
      <div className="bg-primary-50 h-4 w-40 rounded-sm" />

      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="bg-primary-50 size-8 rounded-md" />
        ))}
      </div>
    </div>
  );
};

const TablePagination = ({
  page,
  perPage,
  total,
  totalPages,
  pageParam = 'page',
  isPending = false,
  onPageChange,
  labels,
}: TablePaginationOptions & { labels: TablePaginationLabels }) => {
  const { isPending: isNavigationPending, setQuery } = useQueryState();

  const safeTotalPages = Math.max(totalPages, 1);
  const safePage = Math.min(Math.max(page, 1), safeTotalPages);
  const isPageChangePending = isPending || isNavigationPending;

  const firstItem = total === 0 ? 0 : (safePage - 1) * perPage + 1;
  const lastItem = Math.min(safePage * perPage, total);

  const paginationItems = createPaginationItems(safePage, safeTotalPages);

  const changePage = (nextPage: number) => {
    if (
      isPageChangePending ||
      nextPage < 1 ||
      nextPage > safeTotalPages ||
      nextPage === safePage
    ) {
      return;
    }

    if (onPageChange) {
      onPageChange(nextPage);
      return;
    }

    setQuery(pageParam, nextPage === 1 ? null : nextPage, {
      history: 'push',
      scroll: false,
    });
  };

  return (
    <Pagination size="sm">
      <Pagination.Summary>
        {labels.summary({
          from: firstItem,
          to: lastItem,
          total,
        })}
      </Pagination.Summary>

      {safeTotalPages > 1 && (
        <Pagination.Content dir="rtl">
          <Pagination.Item>
            <Pagination.Previous
              aria-label={labels.previous}
              isDisabled={isPageChangePending || safePage === 1}
              onPress={() => changePage(safePage - 1)}
            >
              <ChevronRight aria-hidden="true" className={ICON_SIZE_CLASS.sm} />
            </Pagination.Previous>
          </Pagination.Item>

          {paginationItems.map((item) => {
            if (typeof item !== 'number') {
              return (
                <Pagination.Item key={item}>
                  <Pagination.Ellipsis />
                </Pagination.Item>
              );
            }

            return (
              <Pagination.Item key={item}>
                <Pagination.Link
                  aria-label={labels.page(item)}
                  isActive={item === safePage}
                  isDisabled={isPageChangePending}
                  onPress={() => changePage(item)}
                >
                  {item}
                </Pagination.Link>
              </Pagination.Item>
            );
          })}

          <Pagination.Item>
            <Pagination.Next
              aria-label={labels.next}
              isDisabled={isPageChangePending || safePage === safeTotalPages}
              onPress={() => changePage(safePage + 1)}
            >
              <ChevronLeft aria-hidden="true" className={ICON_SIZE_CLASS.sm} />
            </Pagination.Next>
          </Pagination.Item>
        </Pagination.Content>
      )}
    </Pagination>
  );
};

const TableContainer = <
  TItem extends { id: TableKey },
  TColumnKey extends TableKey = TableKey,
>({
  ariaLabel,
  headerCells,
  isLoading = false,
  loadingLabel,
  errorComponent,
  emptyComponent,
  pagination,
  paginationLabels,
  paginationFallback = <TablePaginationFallback />,
  items,
  children,
}: TableContainerProps<TItem, TColumnKey>) => {
  const tableItems = isLoading ? [] : items;

  return (
    <Table variant="secondary">
      <Table.ScrollContainer>
        <Table.Content dir="rtl" aria-busy={isLoading} aria-label={ariaLabel}>
          <Table.Header>
            {headerCells.map((cell) => (
              <Table.Column
                key={cell.id}
                id={cell.id}
                isRowHeader={cell.isRowHeader}
                className={cell.className}
              >
                {cell.label}
              </Table.Column>
            ))}
          </Table.Header>

          <Table.Body
            items={tableItems}
            renderEmptyState={() => {
              if (errorComponent) {
                return errorComponent;
              }

              if (isLoading) {
                return (
                  <div className="flex min-h-52 flex-col items-center justify-center gap-3 px-6 py-10 text-center">
                    <Spinner size="lg" color="accent" />

                    {loadingLabel && (
                      <p className="text-body-sm text-muted">{loadingLabel}</p>
                    )}
                  </div>
                );
              }

              return emptyComponent ?? null;
            }}
          >
            {children}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>

      {!isLoading && pagination && pagination.total > 0 && paginationLabels && (
        <Table.Footer>
          <Suspense fallback={paginationFallback}>
            <TablePagination {...pagination} labels={paginationLabels} />
          </Suspense>
        </Table.Footer>
      )}
    </Table>
  );
};

export default TableContainer;
export { TableContainer, TablePagination, TablePaginationFallback };
