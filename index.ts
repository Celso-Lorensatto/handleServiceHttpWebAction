import axios, { AxiosResponse } from "axios";
import { SHWADataStruct } from "./abstract";
import { assign, size } from "lodash";

interface IhandleServiceHttpWebActionOptions {
  body?: any;
  headers?: { Cookie: string;[key: string]: string };
  formData?: true | false;
}

export default class SHWA extends SHWADataStruct {
  static createInstance() {
    return new this();
  }

  static getInstance(): SHWA {
    return super.getInstance();
  }

  async handleServiceHttpWebAction(
    serviceName: string,
    action: string,
    requestConfig?: IhandleServiceHttpWebActionOptions
  ): Promise<AxiosResponse> {
    let options: IhandleServiceHttpWebActionOptions = {
      formData: false,
    };

    if (requestConfig) {
      options = assign({}, options, requestConfig);
    }

    const { url, headers, method, body, fieldsBodyMap, fieldsHeadersMap } =
      await this.getActionRequestData(serviceName, action);

    const hasFieldsToBeFilled =
      size(fieldsBodyMap) > 0 || size(fieldsHeadersMap) > 0;
    let bodyFilledFields = {};
    let headersFilledFields = {};
    if (hasFieldsToBeFilled) {
      bodyFilledFields = this.getObjFields(fieldsBodyMap, requestConfig!.body!);
      headersFilledFields = this.getObjFields(
        fieldsHeadersMap,
        requestConfig!.headers!
      );
    }

    const finalHeaders = {
      ...headers,
      ...requestConfig?.headers,
      ...headersFilledFields,
    };

    let finalBody = {
      ...body,
      ...requestConfig?.body,
      ...bodyFilledFields,
    };

    if (options.formData) {
      finalBody = this.objToFormData(finalBody);
    }

    if (method == "get") {
      return await axios.get(url, { headers: finalHeaders });
    }

    return await axios[method](url, finalBody, { headers: finalHeaders });
  }
}
