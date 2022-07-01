declare interface Pagination<T> {
  items: T[];
  totalPages: number;
  total: number;
  currentPage: number;
}
