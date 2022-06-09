export type mediaType = {
  url: string;
  extension: string;
  fileName?: string;
  mediaType: string;
};

export type responseForm = {
  message: string;
  error: boolean;
  data: any;
};
