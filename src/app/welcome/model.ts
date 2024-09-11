
export interface Model {
    resourceType:               string;
    id:                         string;
    status:                     string;
    intent:                     string;
    medication:                 Medication;
    subject:                    Encounter;
    dosageInstruction:          DosageInstruction[];
    substitution:               Substitution;
    identifier?:                Identifier[];
    basedOn?:                   Encounter[];
    priorPrescription?:         Encounter;
    groupIdentifier?:           Identifier;
    statusReason?:              StatusReason;
    statusChanged?:             Date;
    category?:                  CourseOfTherapyType[];
    priority?:                  string;
    doNotPerform?:              boolean;
    informationSource?:         Encounter[];
    encounter?:                 Encounter;
    supportingInformation?:     Encounter[];
    authoredOn?:                Date;
    requester?:                 Encounter;
    reported?:                  boolean;
    performerType?:             CourseOfTherapyType;
    performer?:                 Encounter[];
    device?:                    Device[];
    reason?:                    Device[];
    courseOfTherapyType?:       CourseOfTherapyType;
    insurance?:                 Encounter[];
    note?:                      Note[];
    renderedDosageInstruction?: string;
    effectiveDosePeriod?:       Period;
    dispenseRequest?:           DispenseRequest;
    eventHistory?:              Encounter[];
}

export interface Encounter {
    reference?: string;
    display:    string;
}

export interface CourseOfTherapyType {
    coding: CourseOfTherapyTypeCoding[];
}

export interface CourseOfTherapyTypeCoding {
    system:  string;
    code:    string;
    display: string;
}

export interface Device {
    reference: Reference;
}

export interface Reference {
}

export interface DispenseRequest {
    initialFill:            InitialFill;
    dispenseInterval:       DispenseInterval;
    validityPeriod:         Period;
    numberOfRepeatsAllowed: number;
    quantity:               DispenseInterval;
    expectedSupplyDuration: DispenseInterval;
    dispenser:              Encounter;
    dispenserInstruction:   DispenserInstruction[];
    doseAdministrationAid:  CourseOfTherapyType;
}

export interface DispenseInterval {
    value:  number;
    unit:   string;
    system: string;
    code:   string;
}

export interface DispenserInstruction {
    text: string;
}

export interface InitialFill {
    quantity: DispenseInterval;
    duration: DispenseInterval;
}

export interface Period {
    start: Date;
    end:   Date;
}

export interface DosageInstruction {
    text:         string;
    timing?:      Timing;
    doseAndRate?: DoseAndRate[];
}

export interface DoseAndRate {
    doseQuantity: DispenseInterval;
}

export interface Timing {
    repeat: Repeat;
}

export interface Repeat {
    frequency:  number;
    period:     number;
    periodUnit: string;
}

export interface Identifier {
    system: string;
    value:  string;
}

export interface Medication {
    concept: Concept;
}

export interface Concept {
    coding: ConceptCoding[];
}

export interface ConceptCoding {
    display: string;
}

export interface Note {
    authorReference: Encounter;
    text:            string;
}

export interface StatusReason {
    coding: CourseOfTherapyTypeCoding[];
    text:   string;
}

export interface Substitution {
    allowedBoolean?: boolean;
    reason?:         CourseOfTherapyType;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toWelcome(json: string): Model[] {
        return cast(JSON.parse(json), a(r("Model")));
    }

    public static welcomeToJson(value: Model[]): string {
        return JSON.stringify(uncast(value, a(r("Model"))), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "Welcome": o([
        { json: "resourceType", js: "resourceType", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "status", js: "status", typ: "" },
        { json: "intent", js: "intent", typ: "" },
        { json: "medication", js: "medication", typ: r("Medication") },
        { json: "subject", js: "subject", typ: r("Encounter") },
        { json: "dosageInstruction", js: "dosageInstruction", typ: a(r("DosageInstruction")) },
        { json: "substitution", js: "substitution", typ: r("Substitution") },
        { json: "identifier", js: "identifier", typ: u(undefined, a(r("Identifier"))) },
        { json: "basedOn", js: "basedOn", typ: u(undefined, a(r("Encounter"))) },
        { json: "priorPrescription", js: "priorPrescription", typ: u(undefined, r("Encounter")) },
        { json: "groupIdentifier", js: "groupIdentifier", typ: u(undefined, r("Identifier")) },
        { json: "statusReason", js: "statusReason", typ: u(undefined, r("StatusReason")) },
        { json: "statusChanged", js: "statusChanged", typ: u(undefined, Date) },
        { json: "category", js: "category", typ: u(undefined, a(r("CourseOfTherapyType"))) },
        { json: "priority", js: "priority", typ: u(undefined, "") },
        { json: "doNotPerform", js: "doNotPerform", typ: u(undefined, true) },
        { json: "informationSource", js: "informationSource", typ: u(undefined, a(r("Encounter"))) },
        { json: "encounter", js: "encounter", typ: u(undefined, r("Encounter")) },
        { json: "supportingInformation", js: "supportingInformation", typ: u(undefined, a(r("Encounter"))) },
        { json: "authoredOn", js: "authoredOn", typ: u(undefined, Date) },
        { json: "requester", js: "requester", typ: u(undefined, r("Encounter")) },
        { json: "reported", js: "reported", typ: u(undefined, true) },
        { json: "performerType", js: "performerType", typ: u(undefined, r("CourseOfTherapyType")) },
        { json: "performer", js: "performer", typ: u(undefined, a(r("Encounter"))) },
        { json: "device", js: "device", typ: u(undefined, a(r("Device"))) },
        { json: "reason", js: "reason", typ: u(undefined, a(r("Device"))) },
        { json: "courseOfTherapyType", js: "courseOfTherapyType", typ: u(undefined, r("CourseOfTherapyType")) },
        { json: "insurance", js: "insurance", typ: u(undefined, a(r("Encounter"))) },
        { json: "note", js: "note", typ: u(undefined, a(r("Note"))) },
        { json: "renderedDosageInstruction", js: "renderedDosageInstruction", typ: u(undefined, "") },
        { json: "effectiveDosePeriod", js: "effectiveDosePeriod", typ: u(undefined, r("Period")) },
        { json: "dispenseRequest", js: "dispenseRequest", typ: u(undefined, r("DispenseRequest")) },
        { json: "eventHistory", js: "eventHistory", typ: u(undefined, a(r("Encounter"))) },
    ], false),
    "Encounter": o([
        { json: "reference", js: "reference", typ: u(undefined, "") },
        { json: "display", js: "display", typ: "" },
    ], false),
    "CourseOfTherapyType": o([
        { json: "coding", js: "coding", typ: a(r("CourseOfTherapyTypeCoding")) },
    ], false),
    "CourseOfTherapyTypeCoding": o([
        { json: "system", js: "system", typ: "" },
        { json: "code", js: "code", typ: "" },
        { json: "display", js: "display", typ: "" },
    ], false),
    "Device": o([
        { json: "reference", js: "reference", typ: r("Reference") },
    ], false),
    "Reference": o([
    ], false),
    "DispenseRequest": o([
        { json: "initialFill", js: "initialFill", typ: r("InitialFill") },
        { json: "dispenseInterval", js: "dispenseInterval", typ: r("DispenseInterval") },
        { json: "validityPeriod", js: "validityPeriod", typ: r("Period") },
        { json: "numberOfRepeatsAllowed", js: "numberOfRepeatsAllowed", typ: 0 },
        { json: "quantity", js: "quantity", typ: r("DispenseInterval") },
        { json: "expectedSupplyDuration", js: "expectedSupplyDuration", typ: r("DispenseInterval") },
        { json: "dispenser", js: "dispenser", typ: r("Encounter") },
        { json: "dispenserInstruction", js: "dispenserInstruction", typ: a(r("DispenserInstruction")) },
        { json: "doseAdministrationAid", js: "doseAdministrationAid", typ: r("CourseOfTherapyType") },
    ], false),
    "DispenseInterval": o([
        { json: "value", js: "value", typ: 0 },
        { json: "unit", js: "unit", typ: "" },
        { json: "system", js: "system", typ: "" },
        { json: "code", js: "code", typ: "" },
    ], false),
    "DispenserInstruction": o([
        { json: "text", js: "text", typ: "" },
    ], false),
    "InitialFill": o([
        { json: "quantity", js: "quantity", typ: r("DispenseInterval") },
        { json: "duration", js: "duration", typ: r("DispenseInterval") },
    ], false),
    "Period": o([
        { json: "start", js: "start", typ: Date },
        { json: "end", js: "end", typ: Date },
    ], false),
    "DosageInstruction": o([
        { json: "text", js: "text", typ: "" },
        { json: "timing", js: "timing", typ: u(undefined, r("Timing")) },
        { json: "doseAndRate", js: "doseAndRate", typ: u(undefined, a(r("DoseAndRate"))) },
    ], false),
    "DoseAndRate": o([
        { json: "doseQuantity", js: "doseQuantity", typ: r("DispenseInterval") },
    ], false),
    "Timing": o([
        { json: "repeat", js: "repeat", typ: r("Repeat") },
    ], false),
    "Repeat": o([
        { json: "frequency", js: "frequency", typ: 0 },
        { json: "period", js: "period", typ: 0 },
        { json: "periodUnit", js: "periodUnit", typ: "" },
    ], false),
    "Identifier": o([
        { json: "system", js: "system", typ: "" },
        { json: "value", js: "value", typ: "" },
    ], false),
    "Medication": o([
        { json: "concept", js: "concept", typ: r("Concept") },
    ], false),
    "Concept": o([
        { json: "coding", js: "coding", typ: a(r("ConceptCoding")) },
    ], false),
    "ConceptCoding": o([
        { json: "display", js: "display", typ: "" },
    ], false),
    "Note": o([
        { json: "authorReference", js: "authorReference", typ: r("Encounter") },
        { json: "text", js: "text", typ: "" },
    ], false),
    "StatusReason": o([
        { json: "coding", js: "coding", typ: a(r("CourseOfTherapyTypeCoding")) },
        { json: "text", js: "text", typ: "" },
    ], false),
    "Substitution": o([
        { json: "allowedBoolean", js: "allowedBoolean", typ: u(undefined, true) },
        { json: "reason", js: "reason", typ: u(undefined, r("CourseOfTherapyType")) },
    ], false),
};
