/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Empty } from "../google/protobuf/empty";
import { FieldMask } from "../google/protobuf/field_mask";
import { Expr } from "../google/type/expr";

export const protobufPackage = "bytebase.v1";

export interface ListRisksRequest {
  /**
   * The maximum number of risks to return. The service may return fewer than
   * this value.
   * If unspecified, at most 50 risks will be returned.
   * The maximum value is 1000; values above 1000 will be coerced to 1000.
   */
  pageSize: number;
  /**
   * A page token, received from a previous `ListRisks` call.
   * Provide this to retrieve the subsequent page.
   *
   * When paginating, all other parameters provided to `LiskRisks` must match
   * the call that provided the page token.
   */
  pageToken: string;
}

export interface ListRisksResponse {
  risks: Risk[];
  /**
   * A token, which can be sent as `page_token` to retrieve the next page.
   * If this field is omitted, there are no subsequent pages.
   */
  nextPageToken: string;
}

export interface CreateRiskRequest {
  /** The risk to create. */
  risk: Risk | undefined;
}

export interface UpdateRiskRequest {
  /**
   * The risk to update.
   *
   * The risk's `name` field is used to identify the risk to update.
   * Format: risks/{risk}
   */
  risk:
    | Risk
    | undefined;
  /** The list of fields to update. */
  updateMask: string[] | undefined;
}

export interface DeleteRiskRequest {
  /**
   * The name of the risk to delete.
   * Format: risks/{risk}
   */
  name: string;
}

export interface Risk {
  /** Format: risks/{risk} */
  name: string;
  source: Risk_Source;
  title: string;
  level: number;
  active: boolean;
  condition: Expr | undefined;
}

export enum Risk_Source {
  SOURCE_UNSPECIFIED = "SOURCE_UNSPECIFIED",
  DDL = "DDL",
  DML = "DML",
  CREATE_DATABASE = "CREATE_DATABASE",
  REQUEST_QUERY = "REQUEST_QUERY",
  REQUEST_EXPORT = "REQUEST_EXPORT",
  DATA_EXPORT = "DATA_EXPORT",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export function risk_SourceFromJSON(object: any): Risk_Source {
  switch (object) {
    case 0:
    case "SOURCE_UNSPECIFIED":
      return Risk_Source.SOURCE_UNSPECIFIED;
    case 1:
    case "DDL":
      return Risk_Source.DDL;
    case 2:
    case "DML":
      return Risk_Source.DML;
    case 3:
    case "CREATE_DATABASE":
      return Risk_Source.CREATE_DATABASE;
    case 4:
    case "REQUEST_QUERY":
      return Risk_Source.REQUEST_QUERY;
    case 5:
    case "REQUEST_EXPORT":
      return Risk_Source.REQUEST_EXPORT;
    case 6:
    case "DATA_EXPORT":
      return Risk_Source.DATA_EXPORT;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Risk_Source.UNRECOGNIZED;
  }
}

export function risk_SourceToJSON(object: Risk_Source): string {
  switch (object) {
    case Risk_Source.SOURCE_UNSPECIFIED:
      return "SOURCE_UNSPECIFIED";
    case Risk_Source.DDL:
      return "DDL";
    case Risk_Source.DML:
      return "DML";
    case Risk_Source.CREATE_DATABASE:
      return "CREATE_DATABASE";
    case Risk_Source.REQUEST_QUERY:
      return "REQUEST_QUERY";
    case Risk_Source.REQUEST_EXPORT:
      return "REQUEST_EXPORT";
    case Risk_Source.DATA_EXPORT:
      return "DATA_EXPORT";
    case Risk_Source.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export function risk_SourceToNumber(object: Risk_Source): number {
  switch (object) {
    case Risk_Source.SOURCE_UNSPECIFIED:
      return 0;
    case Risk_Source.DDL:
      return 1;
    case Risk_Source.DML:
      return 2;
    case Risk_Source.CREATE_DATABASE:
      return 3;
    case Risk_Source.REQUEST_QUERY:
      return 4;
    case Risk_Source.REQUEST_EXPORT:
      return 5;
    case Risk_Source.DATA_EXPORT:
      return 6;
    case Risk_Source.UNRECOGNIZED:
    default:
      return -1;
  }
}

function createBaseListRisksRequest(): ListRisksRequest {
  return { pageSize: 0, pageToken: "" };
}

export const ListRisksRequest = {
  encode(message: ListRisksRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pageSize !== 0) {
      writer.uint32(8).int32(message.pageSize);
    }
    if (message.pageToken !== "") {
      writer.uint32(18).string(message.pageToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListRisksRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListRisksRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.pageSize = reader.int32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.pageToken = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ListRisksRequest {
    return {
      pageSize: isSet(object.pageSize) ? globalThis.Number(object.pageSize) : 0,
      pageToken: isSet(object.pageToken) ? globalThis.String(object.pageToken) : "",
    };
  },

  toJSON(message: ListRisksRequest): unknown {
    const obj: any = {};
    if (message.pageSize !== 0) {
      obj.pageSize = Math.round(message.pageSize);
    }
    if (message.pageToken !== "") {
      obj.pageToken = message.pageToken;
    }
    return obj;
  },

  create(base?: DeepPartial<ListRisksRequest>): ListRisksRequest {
    return ListRisksRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ListRisksRequest>): ListRisksRequest {
    const message = createBaseListRisksRequest();
    message.pageSize = object.pageSize ?? 0;
    message.pageToken = object.pageToken ?? "";
    return message;
  },
};

function createBaseListRisksResponse(): ListRisksResponse {
  return { risks: [], nextPageToken: "" };
}

export const ListRisksResponse = {
  encode(message: ListRisksResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.risks) {
      Risk.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.nextPageToken !== "") {
      writer.uint32(18).string(message.nextPageToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListRisksResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListRisksResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.risks.push(Risk.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.nextPageToken = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ListRisksResponse {
    return {
      risks: globalThis.Array.isArray(object?.risks) ? object.risks.map((e: any) => Risk.fromJSON(e)) : [],
      nextPageToken: isSet(object.nextPageToken) ? globalThis.String(object.nextPageToken) : "",
    };
  },

  toJSON(message: ListRisksResponse): unknown {
    const obj: any = {};
    if (message.risks?.length) {
      obj.risks = message.risks.map((e) => Risk.toJSON(e));
    }
    if (message.nextPageToken !== "") {
      obj.nextPageToken = message.nextPageToken;
    }
    return obj;
  },

  create(base?: DeepPartial<ListRisksResponse>): ListRisksResponse {
    return ListRisksResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ListRisksResponse>): ListRisksResponse {
    const message = createBaseListRisksResponse();
    message.risks = object.risks?.map((e) => Risk.fromPartial(e)) || [];
    message.nextPageToken = object.nextPageToken ?? "";
    return message;
  },
};

function createBaseCreateRiskRequest(): CreateRiskRequest {
  return { risk: undefined };
}

export const CreateRiskRequest = {
  encode(message: CreateRiskRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.risk !== undefined) {
      Risk.encode(message.risk, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateRiskRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateRiskRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.risk = Risk.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateRiskRequest {
    return { risk: isSet(object.risk) ? Risk.fromJSON(object.risk) : undefined };
  },

  toJSON(message: CreateRiskRequest): unknown {
    const obj: any = {};
    if (message.risk !== undefined) {
      obj.risk = Risk.toJSON(message.risk);
    }
    return obj;
  },

  create(base?: DeepPartial<CreateRiskRequest>): CreateRiskRequest {
    return CreateRiskRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<CreateRiskRequest>): CreateRiskRequest {
    const message = createBaseCreateRiskRequest();
    message.risk = (object.risk !== undefined && object.risk !== null) ? Risk.fromPartial(object.risk) : undefined;
    return message;
  },
};

function createBaseUpdateRiskRequest(): UpdateRiskRequest {
  return { risk: undefined, updateMask: undefined };
}

export const UpdateRiskRequest = {
  encode(message: UpdateRiskRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.risk !== undefined) {
      Risk.encode(message.risk, writer.uint32(10).fork()).ldelim();
    }
    if (message.updateMask !== undefined) {
      FieldMask.encode(FieldMask.wrap(message.updateMask), writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateRiskRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateRiskRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.risk = Risk.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.updateMask = FieldMask.unwrap(FieldMask.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UpdateRiskRequest {
    return {
      risk: isSet(object.risk) ? Risk.fromJSON(object.risk) : undefined,
      updateMask: isSet(object.updateMask) ? FieldMask.unwrap(FieldMask.fromJSON(object.updateMask)) : undefined,
    };
  },

  toJSON(message: UpdateRiskRequest): unknown {
    const obj: any = {};
    if (message.risk !== undefined) {
      obj.risk = Risk.toJSON(message.risk);
    }
    if (message.updateMask !== undefined) {
      obj.updateMask = FieldMask.toJSON(FieldMask.wrap(message.updateMask));
    }
    return obj;
  },

  create(base?: DeepPartial<UpdateRiskRequest>): UpdateRiskRequest {
    return UpdateRiskRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<UpdateRiskRequest>): UpdateRiskRequest {
    const message = createBaseUpdateRiskRequest();
    message.risk = (object.risk !== undefined && object.risk !== null) ? Risk.fromPartial(object.risk) : undefined;
    message.updateMask = object.updateMask ?? undefined;
    return message;
  },
};

function createBaseDeleteRiskRequest(): DeleteRiskRequest {
  return { name: "" };
}

export const DeleteRiskRequest = {
  encode(message: DeleteRiskRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeleteRiskRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteRiskRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DeleteRiskRequest {
    return { name: isSet(object.name) ? globalThis.String(object.name) : "" };
  },

  toJSON(message: DeleteRiskRequest): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    return obj;
  },

  create(base?: DeepPartial<DeleteRiskRequest>): DeleteRiskRequest {
    return DeleteRiskRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<DeleteRiskRequest>): DeleteRiskRequest {
    const message = createBaseDeleteRiskRequest();
    message.name = object.name ?? "";
    return message;
  },
};

function createBaseRisk(): Risk {
  return { name: "", source: Risk_Source.SOURCE_UNSPECIFIED, title: "", level: 0, active: false, condition: undefined };
}

export const Risk = {
  encode(message: Risk, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.source !== Risk_Source.SOURCE_UNSPECIFIED) {
      writer.uint32(24).int32(risk_SourceToNumber(message.source));
    }
    if (message.title !== "") {
      writer.uint32(34).string(message.title);
    }
    if (message.level !== 0) {
      writer.uint32(40).int32(message.level);
    }
    if (message.active === true) {
      writer.uint32(56).bool(message.active);
    }
    if (message.condition !== undefined) {
      Expr.encode(message.condition, writer.uint32(66).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Risk {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRisk();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.source = risk_SourceFromJSON(reader.int32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.title = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.level = reader.int32();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.active = reader.bool();
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.condition = Expr.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Risk {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      source: isSet(object.source) ? risk_SourceFromJSON(object.source) : Risk_Source.SOURCE_UNSPECIFIED,
      title: isSet(object.title) ? globalThis.String(object.title) : "",
      level: isSet(object.level) ? globalThis.Number(object.level) : 0,
      active: isSet(object.active) ? globalThis.Boolean(object.active) : false,
      condition: isSet(object.condition) ? Expr.fromJSON(object.condition) : undefined,
    };
  },

  toJSON(message: Risk): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.source !== Risk_Source.SOURCE_UNSPECIFIED) {
      obj.source = risk_SourceToJSON(message.source);
    }
    if (message.title !== "") {
      obj.title = message.title;
    }
    if (message.level !== 0) {
      obj.level = Math.round(message.level);
    }
    if (message.active === true) {
      obj.active = message.active;
    }
    if (message.condition !== undefined) {
      obj.condition = Expr.toJSON(message.condition);
    }
    return obj;
  },

  create(base?: DeepPartial<Risk>): Risk {
    return Risk.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Risk>): Risk {
    const message = createBaseRisk();
    message.name = object.name ?? "";
    message.source = object.source ?? Risk_Source.SOURCE_UNSPECIFIED;
    message.title = object.title ?? "";
    message.level = object.level ?? 0;
    message.active = object.active ?? false;
    message.condition = (object.condition !== undefined && object.condition !== null)
      ? Expr.fromPartial(object.condition)
      : undefined;
    return message;
  },
};

export type RiskServiceDefinition = typeof RiskServiceDefinition;
export const RiskServiceDefinition = {
  name: "RiskService",
  fullName: "bytebase.v1.RiskService",
  methods: {
    listRisks: {
      name: "ListRisks",
      requestType: ListRisksRequest,
      requestStream: false,
      responseType: ListRisksResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          8410: [new Uint8Array([0])],
          800010: [new Uint8Array([13, 98, 98, 46, 114, 105, 115, 107, 115, 46, 108, 105, 115, 116])],
          800016: [new Uint8Array([1])],
          578365826: [new Uint8Array([11, 18, 9, 47, 118, 49, 47, 114, 105, 115, 107, 115])],
        },
      },
    },
    createRisk: {
      name: "CreateRisk",
      requestType: CreateRiskRequest,
      requestStream: false,
      responseType: Risk,
      responseStream: false,
      options: {
        _unknownFields: {
          8410: [new Uint8Array([4, 114, 105, 115, 107])],
          800010: [new Uint8Array([15, 98, 98, 46, 114, 105, 115, 107, 115, 46, 99, 114, 101, 97, 116, 101])],
          800016: [new Uint8Array([1])],
          800024: [new Uint8Array([1])],
          578365826: [new Uint8Array([17, 58, 4, 114, 105, 115, 107, 34, 9, 47, 118, 49, 47, 114, 105, 115, 107, 115])],
        },
      },
    },
    updateRisk: {
      name: "UpdateRisk",
      requestType: UpdateRiskRequest,
      requestStream: false,
      responseType: Risk,
      responseStream: false,
      options: {
        _unknownFields: {
          8410: [new Uint8Array([16, 114, 105, 115, 107, 44, 117, 112, 100, 97, 116, 101, 95, 109, 97, 115, 107])],
          800010: [new Uint8Array([15, 98, 98, 46, 114, 105, 115, 107, 115, 46, 117, 112, 100, 97, 116, 101])],
          800016: [new Uint8Array([1])],
          800024: [new Uint8Array([1])],
          578365826: [
            new Uint8Array([
              31,
              58,
              4,
              114,
              105,
              115,
              107,
              50,
              23,
              47,
              118,
              49,
              47,
              123,
              114,
              105,
              115,
              107,
              46,
              110,
              97,
              109,
              101,
              61,
              114,
              105,
              115,
              107,
              115,
              47,
              42,
              125,
            ]),
          ],
        },
      },
    },
    deleteRisk: {
      name: "DeleteRisk",
      requestType: DeleteRiskRequest,
      requestStream: false,
      responseType: Empty,
      responseStream: false,
      options: {
        _unknownFields: {
          800010: [new Uint8Array([15, 98, 98, 46, 114, 105, 115, 107, 115, 46, 100, 101, 108, 101, 116, 101])],
          800016: [new Uint8Array([1])],
          800024: [new Uint8Array([1])],
          578365826: [
            new Uint8Array([
              20,
              42,
              18,
              47,
              118,
              49,
              47,
              123,
              110,
              97,
              109,
              101,
              61,
              114,
              105,
              115,
              107,
              115,
              47,
              42,
              125,
            ]),
          ],
        },
      },
    },
  },
} as const;

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Long ? string | number | Long : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
