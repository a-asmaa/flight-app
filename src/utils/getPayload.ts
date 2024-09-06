import { FieldType } from "../types/flight";

export const getPayload = (values: FieldType, departureDate: string|null, withImage: boolean = false) => {

    if(withImage) { // create with photo
      
      const formData = new FormData();
      formData.append("code", values.code);
      formData.append("capacity", values.capacity.toString());
      formData.append("departureDate", departureDate?.toString() || '');
      if(values.upload) formData.append('photo', values.upload[0].originFileObj as Blob, values.upload[0].name);   
      return formData;

    } else {
      const _body = {
        'code': values.code,
        'capacity':  values.capacity,
        'departureDate':  departureDate  // '2020-10-23'
      };
      return JSON.stringify(_body);
    }
  }