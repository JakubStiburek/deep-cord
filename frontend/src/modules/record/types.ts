import { components } from "@/modules/common/types/api-schema";

export type Record = {
  id: string;
  file: {
    uri: string;
  };
  annotationTiers: [
    {
      annotations: {
        id: string;
        span: {
          start: number;
          end: number;
        };
        type: string;
        value: string;
        meta: object;
      }[];
    }
  ];
  label: string;
};

export type File = components["schemas"]["FileDto"];
