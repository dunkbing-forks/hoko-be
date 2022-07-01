declare interface Pagination<T> {
  items: T[];
  totalPages: number;
  total: number;
  currentPage: number;
}

declare type MediaType = {
  url: string;
  extension: string;
  fileName?: string;
  mediaType: string;
};

declare type ResponseForm = {
  message: string;
  error: boolean;
  data: any;
};
