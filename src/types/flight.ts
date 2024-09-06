import { UploadFile } from "antd";

export interface Flight {
    id: string;
    img: string;
    code: string;
    status: string;
    departureDate?: string | null;
    capacity: number;
}

export type FieldType = {
    code: string;
    departureDate: Object;
    capacity: number;
    upload?: UploadFile[];
  };
  