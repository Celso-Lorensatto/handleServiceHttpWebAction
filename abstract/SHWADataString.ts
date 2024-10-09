import SolutionHandler from "@providers/abstract/solutionAbstract";

interface IFieldsMap {
  body?: {
    [key: string]: string[];
  };
  headers?: {
    [key: string]: string[];
  };
}

interface IAction {
  url: string;
  method: "post" | "get";
  headers: { [key: string]: string };
  body?: { [key: string]: string };
  fieldsMap?: IFieldsMap;
}

interface IActions {
  [key: string]: IAction;
}

interface IServiceData {
  headers: { [key: string]: string };
  actions: IActions;
}

export abstract class SHWADataStruct extends SolutionHandler {
  libData: any;

  constructor() {
    super();
  }

  async initialize(libData) {
    this.libData = libData;
  }

  protected async getActionRequestData(serviceName: string, action: string) {
    const serviceData = await this.getServiceData(serviceName);
    const actionData = serviceData.actions[action] as IAction;
    if (!actionData) {
      throw new Error("Action Not Found in the service Provided Data");
    }
    const url = actionData.url;
    const method = actionData.method.toLowerCase();
    const headers = {
      ...serviceData.headers,
      ...actionData.headers,
    };
    const body = actionData.body || {};
    const fieldsBodyMap = actionData.fieldsMap?.body || {};
    const fieldsHeadersMap = actionData.fieldsMap?.headers || {};

    return {
      url,
      headers,
      method,
      body,
      fieldsBodyMap,
      fieldsHeadersMap,
    };
  }

  protected async getServiceData(serviceName: string): Promise<IServiceData> {
    const serviceData = this.libData[serviceName];
    if (!serviceData) {
      throw new Error("Serviço não encontrado");
    }
    return serviceData;
  }

  getObjFields(
    fieldsMap: { [key: string]: string[] },
    fields: { [key: string]: string }
  ) {
    const resultado = {};

    for (const [key, value] of Object.entries(fields)) {
      if (!fieldsMap[key]) {
        resultado[key] = value;
        continue;
      }
      fieldsMap[key].forEach((subKey) => {
        resultado[subKey] = fields[key];
      });
    }

    return resultado;
  }

  protected objToFormData(data: { [key: string]: string }) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }
    return formData;
  }
}
