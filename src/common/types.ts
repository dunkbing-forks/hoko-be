export type MediaType = {
  url: string;
  extension: string;
  fileName?: string;
  mediaType: string;
};

export type ResponseForm = {
  message: string;
  error: boolean;
  data: any;
};
