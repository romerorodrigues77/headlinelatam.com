//#region node_modules/zod/v3/helpers/util.js
var e;
(function(e) {
	e.assertEqual = (e) => {};
	function t(e) {}
	e.assertIs = t;
	function n(e) {
		throw Error();
	}
	e.assertNever = n, e.arrayToEnum = (e) => {
		let t = {};
		for (let n of e) t[n] = n;
		return t;
	}, e.getValidEnumValues = (t) => {
		let n = e.objectKeys(t).filter((e) => typeof t[t[e]] != "number"), r = {};
		for (let e of n) r[e] = t[e];
		return e.objectValues(r);
	}, e.objectValues = (t) => e.objectKeys(t).map(function(e) {
		return t[e];
	}), e.objectKeys = typeof Object.keys == "function" ? (e) => Object.keys(e) : (e) => {
		let t = [];
		for (let n in e) Object.prototype.hasOwnProperty.call(e, n) && t.push(n);
		return t;
	}, e.find = (e, t) => {
		for (let n of e) if (t(n)) return n;
	}, e.isInteger = typeof Number.isInteger == "function" ? (e) => Number.isInteger(e) : (e) => typeof e == "number" && Number.isFinite(e) && Math.floor(e) === e;
	function r(e, t = " | ") {
		return e.map((e) => typeof e == "string" ? `'${e}'` : e).join(t);
	}
	e.joinValues = r, e.jsonStringifyReplacer = (e, t) => typeof t == "bigint" ? t.toString() : t;
})(e ||= {});
var t;
(function(e) {
	e.mergeShapes = (e, t) => ({
		...e,
		...t
	});
})(t ||= {});
var n = e.arrayToEnum([
	"string",
	"nan",
	"number",
	"integer",
	"float",
	"boolean",
	"date",
	"bigint",
	"symbol",
	"function",
	"undefined",
	"null",
	"array",
	"object",
	"unknown",
	"promise",
	"void",
	"never",
	"map",
	"set"
]), r = (e) => {
	switch (typeof e) {
		case "undefined": return n.undefined;
		case "string": return n.string;
		case "number": return Number.isNaN(e) ? n.nan : n.number;
		case "boolean": return n.boolean;
		case "function": return n.function;
		case "bigint": return n.bigint;
		case "symbol": return n.symbol;
		case "object": return Array.isArray(e) ? n.array : e === null ? n.null : e.then && typeof e.then == "function" && e.catch && typeof e.catch == "function" ? n.promise : typeof Map < "u" && e instanceof Map ? n.map : typeof Set < "u" && e instanceof Set ? n.set : typeof Date < "u" && e instanceof Date ? n.date : n.object;
		default: return n.unknown;
	}
}, i = e.arrayToEnum([
	"invalid_type",
	"invalid_literal",
	"custom",
	"invalid_union",
	"invalid_union_discriminator",
	"invalid_enum_value",
	"unrecognized_keys",
	"invalid_arguments",
	"invalid_return_type",
	"invalid_date",
	"invalid_string",
	"too_small",
	"too_big",
	"invalid_intersection_types",
	"not_multiple_of",
	"not_finite"
]), a = class t extends Error {
	get errors() {
		return this.issues;
	}
	constructor(e) {
		super(), this.issues = [], this.addIssue = (e) => {
			this.issues = [...this.issues, e];
		}, this.addIssues = (e = []) => {
			this.issues = [...this.issues, ...e];
		};
		let t = new.target.prototype;
		Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
	}
	format(e) {
		let t = e || function(e) {
			return e.message;
		}, n = { _errors: [] }, r = (e) => {
			for (let i of e.issues) if (i.code === "invalid_union") i.unionErrors.map(r);
			else if (i.code === "invalid_return_type") r(i.returnTypeError);
			else if (i.code === "invalid_arguments") r(i.argumentsError);
			else if (i.path.length === 0) n._errors.push(t(i));
			else {
				let e = n, r = 0;
				for (; r < i.path.length;) {
					let n = i.path[r];
					r === i.path.length - 1 ? (e[n] = e[n] || { _errors: [] }, e[n]._errors.push(t(i))) : e[n] = e[n] || { _errors: [] }, e = e[n], r++;
				}
			}
		};
		return r(this), n;
	}
	static assert(e) {
		if (!(e instanceof t)) throw Error(`Not a ZodError: ${e}`);
	}
	toString() {
		return this.message;
	}
	get message() {
		return JSON.stringify(this.issues, e.jsonStringifyReplacer, 2);
	}
	get isEmpty() {
		return this.issues.length === 0;
	}
	flatten(e = (e) => e.message) {
		let t = {}, n = [];
		for (let r of this.issues) if (r.path.length > 0) {
			let n = r.path[0];
			t[n] = t[n] || [], t[n].push(e(r));
		} else n.push(e(r));
		return {
			formErrors: n,
			fieldErrors: t
		};
	}
	get formErrors() {
		return this.flatten();
	}
};
a.create = (e) => new a(e);
//#endregion
//#region node_modules/zod/v3/locales/en.js
var o = (t, r) => {
	let a;
	switch (t.code) {
		case i.invalid_type:
			a = t.received === n.undefined ? "Required" : `Expected ${t.expected}, received ${t.received}`;
			break;
		case i.invalid_literal:
			a = `Invalid literal value, expected ${JSON.stringify(t.expected, e.jsonStringifyReplacer)}`;
			break;
		case i.unrecognized_keys:
			a = `Unrecognized key(s) in object: ${e.joinValues(t.keys, ", ")}`;
			break;
		case i.invalid_union:
			a = "Invalid input";
			break;
		case i.invalid_union_discriminator:
			a = `Invalid discriminator value. Expected ${e.joinValues(t.options)}`;
			break;
		case i.invalid_enum_value:
			a = `Invalid enum value. Expected ${e.joinValues(t.options)}, received '${t.received}'`;
			break;
		case i.invalid_arguments:
			a = "Invalid function arguments";
			break;
		case i.invalid_return_type:
			a = "Invalid function return type";
			break;
		case i.invalid_date:
			a = "Invalid date";
			break;
		case i.invalid_string:
			typeof t.validation == "object" ? "includes" in t.validation ? (a = `Invalid input: must include "${t.validation.includes}"`, typeof t.validation.position == "number" && (a = `${a} at one or more positions greater than or equal to ${t.validation.position}`)) : "startsWith" in t.validation ? a = `Invalid input: must start with "${t.validation.startsWith}"` : "endsWith" in t.validation ? a = `Invalid input: must end with "${t.validation.endsWith}"` : e.assertNever(t.validation) : a = t.validation === "regex" ? "Invalid" : `Invalid ${t.validation}`;
			break;
		case i.too_small:
			a = t.type === "array" ? `Array must contain ${t.exact ? "exactly" : t.inclusive ? "at least" : "more than"} ${t.minimum} element(s)` : t.type === "string" ? `String must contain ${t.exact ? "exactly" : t.inclusive ? "at least" : "over"} ${t.minimum} character(s)` : t.type === "number" || t.type === "bigint" ? `Number must be ${t.exact ? "exactly equal to " : t.inclusive ? "greater than or equal to " : "greater than "}${t.minimum}` : t.type === "date" ? `Date must be ${t.exact ? "exactly equal to " : t.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(t.minimum))}` : "Invalid input";
			break;
		case i.too_big:
			a = t.type === "array" ? `Array must contain ${t.exact ? "exactly" : t.inclusive ? "at most" : "less than"} ${t.maximum} element(s)` : t.type === "string" ? `String must contain ${t.exact ? "exactly" : t.inclusive ? "at most" : "under"} ${t.maximum} character(s)` : t.type === "number" ? `Number must be ${t.exact ? "exactly" : t.inclusive ? "less than or equal to" : "less than"} ${t.maximum}` : t.type === "bigint" ? `BigInt must be ${t.exact ? "exactly" : t.inclusive ? "less than or equal to" : "less than"} ${t.maximum}` : t.type === "date" ? `Date must be ${t.exact ? "exactly" : t.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(t.maximum))}` : "Invalid input";
			break;
		case i.custom:
			a = "Invalid input";
			break;
		case i.invalid_intersection_types:
			a = "Intersection results could not be merged";
			break;
		case i.not_multiple_of:
			a = `Number must be a multiple of ${t.multipleOf}`;
			break;
		case i.not_finite:
			a = "Number must be finite";
			break;
		default: a = r.defaultError, e.assertNever(t);
	}
	return { message: a };
}, s = o;
function c() {
	return s;
}
//#endregion
//#region node_modules/zod/v3/helpers/parseUtil.js
var l = (e) => {
	let { data: t, path: n, errorMaps: r, issueData: i } = e, a = [...n, ...i.path || []], o = {
		...i,
		path: a
	};
	if (i.message !== void 0) return {
		...i,
		path: a,
		message: i.message
	};
	let s = "", c = r.filter((e) => !!e).slice().reverse();
	for (let e of c) s = e(o, {
		data: t,
		defaultError: s
	}).message;
	return {
		...i,
		path: a,
		message: s
	};
};
function u(e, t) {
	let n = c(), r = l({
		issueData: t,
		data: e.data,
		path: e.path,
		errorMaps: [
			e.common.contextualErrorMap,
			e.schemaErrorMap,
			n,
			n === o ? void 0 : o
		].filter((e) => !!e)
	});
	e.common.issues.push(r);
}
var d = class e {
	constructor() {
		this.value = "valid";
	}
	dirty() {
		this.value === "valid" && (this.value = "dirty");
	}
	abort() {
		this.value !== "aborted" && (this.value = "aborted");
	}
	static mergeArray(e, t) {
		let n = [];
		for (let r of t) {
			if (r.status === "aborted") return f;
			r.status === "dirty" && e.dirty(), n.push(r.value);
		}
		return {
			status: e.value,
			value: n
		};
	}
	static async mergeObjectAsync(t, n) {
		let r = [];
		for (let e of n) {
			let t = await e.key, n = await e.value;
			r.push({
				key: t,
				value: n
			});
		}
		return e.mergeObjectSync(t, r);
	}
	static mergeObjectSync(e, t) {
		let n = {};
		for (let r of t) {
			let { key: t, value: i } = r;
			if (t.status === "aborted" || i.status === "aborted") return f;
			t.status === "dirty" && e.dirty(), i.status === "dirty" && e.dirty(), t.value !== "__proto__" && (i.value !== void 0 || r.alwaysSet) && (n[t.value] = i.value);
		}
		return {
			status: e.value,
			value: n
		};
	}
}, f = Object.freeze({ status: "aborted" }), p = (e) => ({
	status: "dirty",
	value: e
}), m = (e) => ({
	status: "valid",
	value: e
}), ee = (e) => e.status === "aborted", te = (e) => e.status === "dirty", h = (e) => e.status === "valid", g = (e) => typeof Promise < "u" && e instanceof Promise, _;
(function(e) {
	e.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, e.toString = (e) => typeof e == "string" ? e : e?.message;
})(_ ||= {});
//#endregion
//#region node_modules/zod/v3/types.js
var v = class {
	constructor(e, t, n, r) {
		this._cachedPath = [], this.parent = e, this.data = t, this._path = n, this._key = r;
	}
	get path() {
		return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
	}
}, ne = (e, t) => {
	if (h(t)) return {
		success: !0,
		data: t.value
	};
	if (!e.common.issues.length) throw Error("Validation failed but no issues detected.");
	return {
		success: !1,
		get error() {
			if (this._error) return this._error;
			let t = new a(e.common.issues);
			return this._error = t, this._error;
		}
	};
};
function y(e) {
	if (!e) return {};
	let { errorMap: t, invalid_type_error: n, required_error: r, description: i } = e;
	if (t && (n || r)) throw Error("Can't use \"invalid_type_error\" or \"required_error\" in conjunction with custom error map.");
	return t ? {
		errorMap: t,
		description: i
	} : {
		errorMap: (t, i) => {
			let { message: a } = e;
			return t.code === "invalid_enum_value" ? { message: a ?? i.defaultError } : i.data === void 0 ? { message: a ?? r ?? i.defaultError } : t.code === "invalid_type" ? { message: a ?? n ?? i.defaultError } : { message: i.defaultError };
		},
		description: i
	};
}
var b = class {
	get description() {
		return this._def.description;
	}
	_getType(e) {
		return r(e.data);
	}
	_getOrReturnCtx(e, t) {
		return t || {
			common: e.parent.common,
			data: e.data,
			parsedType: r(e.data),
			schemaErrorMap: this._def.errorMap,
			path: e.path,
			parent: e.parent
		};
	}
	_processInputParams(e) {
		return {
			status: new d(),
			ctx: {
				common: e.parent.common,
				data: e.data,
				parsedType: r(e.data),
				schemaErrorMap: this._def.errorMap,
				path: e.path,
				parent: e.parent
			}
		};
	}
	_parseSync(e) {
		let t = this._parse(e);
		if (g(t)) throw Error("Synchronous parse encountered promise.");
		return t;
	}
	_parseAsync(e) {
		let t = this._parse(e);
		return Promise.resolve(t);
	}
	parse(e, t) {
		let n = this.safeParse(e, t);
		if (n.success) return n.data;
		throw n.error;
	}
	safeParse(e, t) {
		let n = {
			common: {
				issues: [],
				async: t?.async ?? !1,
				contextualErrorMap: t?.errorMap
			},
			path: t?.path || [],
			schemaErrorMap: this._def.errorMap,
			parent: null,
			data: e,
			parsedType: r(e)
		};
		return ne(n, this._parseSync({
			data: e,
			path: n.path,
			parent: n
		}));
	}
	"~validate"(e) {
		let t = {
			common: {
				issues: [],
				async: !!this["~standard"].async
			},
			path: [],
			schemaErrorMap: this._def.errorMap,
			parent: null,
			data: e,
			parsedType: r(e)
		};
		if (!this["~standard"].async) try {
			let n = this._parseSync({
				data: e,
				path: [],
				parent: t
			});
			return h(n) ? { value: n.value } : { issues: t.common.issues };
		} catch (e) {
			e?.message?.toLowerCase()?.includes("encountered") && (this["~standard"].async = !0), t.common = {
				issues: [],
				async: !0
			};
		}
		return this._parseAsync({
			data: e,
			path: [],
			parent: t
		}).then((e) => h(e) ? { value: e.value } : { issues: t.common.issues });
	}
	async parseAsync(e, t) {
		let n = await this.safeParseAsync(e, t);
		if (n.success) return n.data;
		throw n.error;
	}
	async safeParseAsync(e, t) {
		let n = {
			common: {
				issues: [],
				contextualErrorMap: t?.errorMap,
				async: !0
			},
			path: t?.path || [],
			schemaErrorMap: this._def.errorMap,
			parent: null,
			data: e,
			parsedType: r(e)
		}, i = this._parse({
			data: e,
			path: n.path,
			parent: n
		});
		return ne(n, await (g(i) ? i : Promise.resolve(i)));
	}
	refine(e, t) {
		let n = (e) => typeof t == "string" || t === void 0 ? { message: t } : typeof t == "function" ? t(e) : t;
		return this._refinement((t, r) => {
			let a = e(t), o = () => r.addIssue({
				code: i.custom,
				...n(t)
			});
			return typeof Promise < "u" && a instanceof Promise ? a.then((e) => e ? !0 : (o(), !1)) : a ? !0 : (o(), !1);
		});
	}
	refinement(e, t) {
		return this._refinement((n, r) => e(n) ? !0 : (r.addIssue(typeof t == "function" ? t(n, r) : t), !1));
	}
	_refinement(e) {
		return new F({
			schema: this,
			typeName: R.ZodEffects,
			effect: {
				type: "refinement",
				refinement: e
			}
		});
	}
	superRefine(e) {
		return this._refinement(e);
	}
	constructor(e) {
		this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = {
			version: 1,
			vendor: "zod",
			validate: (e) => this["~validate"](e)
		};
	}
	optional() {
		return I.create(this, this._def);
	}
	nullable() {
		return L.create(this, this._def);
	}
	nullish() {
		return this.nullable().optional();
	}
	array() {
		return w.create(this);
	}
	promise() {
		return P.create(this, this._def);
	}
	or(e) {
		return D.create([this, e], this._def);
	}
	and(e) {
		return k.create(this, e, this._def);
	}
	transform(e) {
		return new F({
			...y(this._def),
			schema: this,
			typeName: R.ZodEffects,
			effect: {
				type: "transform",
				transform: e
			}
		});
	}
	default(e) {
		let t = typeof e == "function" ? e : () => e;
		return new Ge({
			...y(this._def),
			innerType: this,
			defaultValue: t,
			typeName: R.ZodDefault
		});
	}
	brand() {
		return new Je({
			typeName: R.ZodBranded,
			type: this,
			...y(this._def)
		});
	}
	catch(e) {
		let t = typeof e == "function" ? e : () => e;
		return new Ke({
			...y(this._def),
			innerType: this,
			catchValue: t,
			typeName: R.ZodCatch
		});
	}
	describe(e) {
		let t = this.constructor;
		return new t({
			...this._def,
			description: e
		});
	}
	pipe(e) {
		return Ye.create(this, e);
	}
	readonly() {
		return Xe.create(this);
	}
	isOptional() {
		return this.safeParse(void 0).success;
	}
	isNullable() {
		return this.safeParse(null).success;
	}
}, re = /^c[^\s-]{8,}$/i, ie = /^[0-9a-z]+$/, ae = /^[0-9A-HJKMNP-TV-Z]{26}$/i, oe = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, se = /^[a-z0-9_-]{21}$/i, ce = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, le = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, ue = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, de = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", fe, pe = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, me = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, he = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, ge = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, _e = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, ve = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, ye = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", be = RegExp(`^${ye}$`);
function xe(e) {
	let t = "[0-5]\\d";
	e.precision ? t = `${t}\\.\\d{${e.precision}}` : e.precision ?? (t = `${t}(\\.\\d+)?`);
	let n = e.precision ? "+" : "?";
	return `([01]\\d|2[0-3]):[0-5]\\d(:${t})${n}`;
}
function Se(e) {
	return RegExp(`^${xe(e)}$`);
}
function Ce(e) {
	let t = `${ye}T${xe(e)}`, n = [];
	return n.push(e.local ? "Z?" : "Z"), e.offset && n.push("([+-]\\d{2}:?\\d{2})"), t = `${t}(${n.join("|")})`, RegExp(`^${t}$`);
}
function we(e, t) {
	return !!((t === "v4" || !t) && pe.test(e) || (t === "v6" || !t) && he.test(e));
}
function Te(e, t) {
	if (!ce.test(e)) return !1;
	try {
		let [n] = e.split(".");
		if (!n) return !1;
		let r = n.replace(/-/g, "+").replace(/_/g, "/").padEnd(n.length + (4 - n.length % 4) % 4, "="), i = JSON.parse(atob(r));
		return !(typeof i != "object" || !i || "typ" in i && i?.typ !== "JWT" || !i.alg || t && i.alg !== t);
	} catch {
		return !1;
	}
}
function Ee(e, t) {
	return !!((t === "v4" || !t) && me.test(e) || (t === "v6" || !t) && ge.test(e));
}
var x = class t extends b {
	_parse(t) {
		if (this._def.coerce && (t.data = String(t.data)), this._getType(t) !== n.string) {
			let e = this._getOrReturnCtx(t);
			return u(e, {
				code: i.invalid_type,
				expected: n.string,
				received: e.parsedType
			}), f;
		}
		let r = new d(), a;
		for (let n of this._def.checks) if (n.kind === "min") t.data.length < n.value && (a = this._getOrReturnCtx(t, a), u(a, {
			code: i.too_small,
			minimum: n.value,
			type: "string",
			inclusive: !0,
			exact: !1,
			message: n.message
		}), r.dirty());
		else if (n.kind === "max") t.data.length > n.value && (a = this._getOrReturnCtx(t, a), u(a, {
			code: i.too_big,
			maximum: n.value,
			type: "string",
			inclusive: !0,
			exact: !1,
			message: n.message
		}), r.dirty());
		else if (n.kind === "length") {
			let e = t.data.length > n.value, o = t.data.length < n.value;
			(e || o) && (a = this._getOrReturnCtx(t, a), e ? u(a, {
				code: i.too_big,
				maximum: n.value,
				type: "string",
				inclusive: !0,
				exact: !0,
				message: n.message
			}) : o && u(a, {
				code: i.too_small,
				minimum: n.value,
				type: "string",
				inclusive: !0,
				exact: !0,
				message: n.message
			}), r.dirty());
		} else if (n.kind === "email") ue.test(t.data) || (a = this._getOrReturnCtx(t, a), u(a, {
			validation: "email",
			code: i.invalid_string,
			message: n.message
		}), r.dirty());
		else if (n.kind === "emoji") fe ||= new RegExp(de, "u"), fe.test(t.data) || (a = this._getOrReturnCtx(t, a), u(a, {
			validation: "emoji",
			code: i.invalid_string,
			message: n.message
		}), r.dirty());
		else if (n.kind === "uuid") oe.test(t.data) || (a = this._getOrReturnCtx(t, a), u(a, {
			validation: "uuid",
			code: i.invalid_string,
			message: n.message
		}), r.dirty());
		else if (n.kind === "nanoid") se.test(t.data) || (a = this._getOrReturnCtx(t, a), u(a, {
			validation: "nanoid",
			code: i.invalid_string,
			message: n.message
		}), r.dirty());
		else if (n.kind === "cuid") re.test(t.data) || (a = this._getOrReturnCtx(t, a), u(a, {
			validation: "cuid",
			code: i.invalid_string,
			message: n.message
		}), r.dirty());
		else if (n.kind === "cuid2") ie.test(t.data) || (a = this._getOrReturnCtx(t, a), u(a, {
			validation: "cuid2",
			code: i.invalid_string,
			message: n.message
		}), r.dirty());
		else if (n.kind === "ulid") ae.test(t.data) || (a = this._getOrReturnCtx(t, a), u(a, {
			validation: "ulid",
			code: i.invalid_string,
			message: n.message
		}), r.dirty());
		else if (n.kind === "url") try {
			new URL(t.data);
		} catch {
			a = this._getOrReturnCtx(t, a), u(a, {
				validation: "url",
				code: i.invalid_string,
				message: n.message
			}), r.dirty();
		}
		else n.kind === "regex" ? (n.regex.lastIndex = 0, n.regex.test(t.data) || (a = this._getOrReturnCtx(t, a), u(a, {
			validation: "regex",
			code: i.invalid_string,
			message: n.message
		}), r.dirty())) : n.kind === "trim" ? t.data = t.data.trim() : n.kind === "includes" ? t.data.includes(n.value, n.position) || (a = this._getOrReturnCtx(t, a), u(a, {
			code: i.invalid_string,
			validation: {
				includes: n.value,
				position: n.position
			},
			message: n.message
		}), r.dirty()) : n.kind === "toLowerCase" ? t.data = t.data.toLowerCase() : n.kind === "toUpperCase" ? t.data = t.data.toUpperCase() : n.kind === "startsWith" ? t.data.startsWith(n.value) || (a = this._getOrReturnCtx(t, a), u(a, {
			code: i.invalid_string,
			validation: { startsWith: n.value },
			message: n.message
		}), r.dirty()) : n.kind === "endsWith" ? t.data.endsWith(n.value) || (a = this._getOrReturnCtx(t, a), u(a, {
			code: i.invalid_string,
			validation: { endsWith: n.value },
			message: n.message
		}), r.dirty()) : n.kind === "datetime" ? Ce(n).test(t.data) || (a = this._getOrReturnCtx(t, a), u(a, {
			code: i.invalid_string,
			validation: "datetime",
			message: n.message
		}), r.dirty()) : n.kind === "date" ? be.test(t.data) || (a = this._getOrReturnCtx(t, a), u(a, {
			code: i.invalid_string,
			validation: "date",
			message: n.message
		}), r.dirty()) : n.kind === "time" ? Se(n).test(t.data) || (a = this._getOrReturnCtx(t, a), u(a, {
			code: i.invalid_string,
			validation: "time",
			message: n.message
		}), r.dirty()) : n.kind === "duration" ? le.test(t.data) || (a = this._getOrReturnCtx(t, a), u(a, {
			validation: "duration",
			code: i.invalid_string,
			message: n.message
		}), r.dirty()) : n.kind === "ip" ? we(t.data, n.version) || (a = this._getOrReturnCtx(t, a), u(a, {
			validation: "ip",
			code: i.invalid_string,
			message: n.message
		}), r.dirty()) : n.kind === "jwt" ? Te(t.data, n.alg) || (a = this._getOrReturnCtx(t, a), u(a, {
			validation: "jwt",
			code: i.invalid_string,
			message: n.message
		}), r.dirty()) : n.kind === "cidr" ? Ee(t.data, n.version) || (a = this._getOrReturnCtx(t, a), u(a, {
			validation: "cidr",
			code: i.invalid_string,
			message: n.message
		}), r.dirty()) : n.kind === "base64" ? _e.test(t.data) || (a = this._getOrReturnCtx(t, a), u(a, {
			validation: "base64",
			code: i.invalid_string,
			message: n.message
		}), r.dirty()) : n.kind === "base64url" ? ve.test(t.data) || (a = this._getOrReturnCtx(t, a), u(a, {
			validation: "base64url",
			code: i.invalid_string,
			message: n.message
		}), r.dirty()) : e.assertNever(n);
		return {
			status: r.value,
			value: t.data
		};
	}
	_regex(e, t, n) {
		return this.refinement((t) => e.test(t), {
			validation: t,
			code: i.invalid_string,
			..._.errToObj(n)
		});
	}
	_addCheck(e) {
		return new t({
			...this._def,
			checks: [...this._def.checks, e]
		});
	}
	email(e) {
		return this._addCheck({
			kind: "email",
			..._.errToObj(e)
		});
	}
	url(e) {
		return this._addCheck({
			kind: "url",
			..._.errToObj(e)
		});
	}
	emoji(e) {
		return this._addCheck({
			kind: "emoji",
			..._.errToObj(e)
		});
	}
	uuid(e) {
		return this._addCheck({
			kind: "uuid",
			..._.errToObj(e)
		});
	}
	nanoid(e) {
		return this._addCheck({
			kind: "nanoid",
			..._.errToObj(e)
		});
	}
	cuid(e) {
		return this._addCheck({
			kind: "cuid",
			..._.errToObj(e)
		});
	}
	cuid2(e) {
		return this._addCheck({
			kind: "cuid2",
			..._.errToObj(e)
		});
	}
	ulid(e) {
		return this._addCheck({
			kind: "ulid",
			..._.errToObj(e)
		});
	}
	base64(e) {
		return this._addCheck({
			kind: "base64",
			..._.errToObj(e)
		});
	}
	base64url(e) {
		return this._addCheck({
			kind: "base64url",
			..._.errToObj(e)
		});
	}
	jwt(e) {
		return this._addCheck({
			kind: "jwt",
			..._.errToObj(e)
		});
	}
	ip(e) {
		return this._addCheck({
			kind: "ip",
			..._.errToObj(e)
		});
	}
	cidr(e) {
		return this._addCheck({
			kind: "cidr",
			..._.errToObj(e)
		});
	}
	datetime(e) {
		return typeof e == "string" ? this._addCheck({
			kind: "datetime",
			precision: null,
			offset: !1,
			local: !1,
			message: e
		}) : this._addCheck({
			kind: "datetime",
			precision: e?.precision === void 0 ? null : e?.precision,
			offset: e?.offset ?? !1,
			local: e?.local ?? !1,
			..._.errToObj(e?.message)
		});
	}
	date(e) {
		return this._addCheck({
			kind: "date",
			message: e
		});
	}
	time(e) {
		return typeof e == "string" ? this._addCheck({
			kind: "time",
			precision: null,
			message: e
		}) : this._addCheck({
			kind: "time",
			precision: e?.precision === void 0 ? null : e?.precision,
			..._.errToObj(e?.message)
		});
	}
	duration(e) {
		return this._addCheck({
			kind: "duration",
			..._.errToObj(e)
		});
	}
	regex(e, t) {
		return this._addCheck({
			kind: "regex",
			regex: e,
			..._.errToObj(t)
		});
	}
	includes(e, t) {
		return this._addCheck({
			kind: "includes",
			value: e,
			position: t?.position,
			..._.errToObj(t?.message)
		});
	}
	startsWith(e, t) {
		return this._addCheck({
			kind: "startsWith",
			value: e,
			..._.errToObj(t)
		});
	}
	endsWith(e, t) {
		return this._addCheck({
			kind: "endsWith",
			value: e,
			..._.errToObj(t)
		});
	}
	min(e, t) {
		return this._addCheck({
			kind: "min",
			value: e,
			..._.errToObj(t)
		});
	}
	max(e, t) {
		return this._addCheck({
			kind: "max",
			value: e,
			..._.errToObj(t)
		});
	}
	length(e, t) {
		return this._addCheck({
			kind: "length",
			value: e,
			..._.errToObj(t)
		});
	}
	nonempty(e) {
		return this.min(1, _.errToObj(e));
	}
	trim() {
		return new t({
			...this._def,
			checks: [...this._def.checks, { kind: "trim" }]
		});
	}
	toLowerCase() {
		return new t({
			...this._def,
			checks: [...this._def.checks, { kind: "toLowerCase" }]
		});
	}
	toUpperCase() {
		return new t({
			...this._def,
			checks: [...this._def.checks, { kind: "toUpperCase" }]
		});
	}
	get isDatetime() {
		return !!this._def.checks.find((e) => e.kind === "datetime");
	}
	get isDate() {
		return !!this._def.checks.find((e) => e.kind === "date");
	}
	get isTime() {
		return !!this._def.checks.find((e) => e.kind === "time");
	}
	get isDuration() {
		return !!this._def.checks.find((e) => e.kind === "duration");
	}
	get isEmail() {
		return !!this._def.checks.find((e) => e.kind === "email");
	}
	get isURL() {
		return !!this._def.checks.find((e) => e.kind === "url");
	}
	get isEmoji() {
		return !!this._def.checks.find((e) => e.kind === "emoji");
	}
	get isUUID() {
		return !!this._def.checks.find((e) => e.kind === "uuid");
	}
	get isNANOID() {
		return !!this._def.checks.find((e) => e.kind === "nanoid");
	}
	get isCUID() {
		return !!this._def.checks.find((e) => e.kind === "cuid");
	}
	get isCUID2() {
		return !!this._def.checks.find((e) => e.kind === "cuid2");
	}
	get isULID() {
		return !!this._def.checks.find((e) => e.kind === "ulid");
	}
	get isIP() {
		return !!this._def.checks.find((e) => e.kind === "ip");
	}
	get isCIDR() {
		return !!this._def.checks.find((e) => e.kind === "cidr");
	}
	get isBase64() {
		return !!this._def.checks.find((e) => e.kind === "base64");
	}
	get isBase64url() {
		return !!this._def.checks.find((e) => e.kind === "base64url");
	}
	get minLength() {
		let e = null;
		for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
		return e;
	}
	get maxLength() {
		let e = null;
		for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
		return e;
	}
};
x.create = (e) => new x({
	checks: [],
	typeName: R.ZodString,
	coerce: e?.coerce ?? !1,
	...y(e)
});
function De(e, t) {
	let n = (e.toString().split(".")[1] || "").length, r = (t.toString().split(".")[1] || "").length, i = n > r ? n : r;
	return Number.parseInt(e.toFixed(i).replace(".", "")) % Number.parseInt(t.toFixed(i).replace(".", "")) / 10 ** i;
}
var Oe = class t extends b {
	constructor() {
		super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
	}
	_parse(t) {
		if (this._def.coerce && (t.data = Number(t.data)), this._getType(t) !== n.number) {
			let e = this._getOrReturnCtx(t);
			return u(e, {
				code: i.invalid_type,
				expected: n.number,
				received: e.parsedType
			}), f;
		}
		let r, a = new d();
		for (let n of this._def.checks) n.kind === "int" ? e.isInteger(t.data) || (r = this._getOrReturnCtx(t, r), u(r, {
			code: i.invalid_type,
			expected: "integer",
			received: "float",
			message: n.message
		}), a.dirty()) : n.kind === "min" ? (n.inclusive ? t.data < n.value : t.data <= n.value) && (r = this._getOrReturnCtx(t, r), u(r, {
			code: i.too_small,
			minimum: n.value,
			type: "number",
			inclusive: n.inclusive,
			exact: !1,
			message: n.message
		}), a.dirty()) : n.kind === "max" ? (n.inclusive ? t.data > n.value : t.data >= n.value) && (r = this._getOrReturnCtx(t, r), u(r, {
			code: i.too_big,
			maximum: n.value,
			type: "number",
			inclusive: n.inclusive,
			exact: !1,
			message: n.message
		}), a.dirty()) : n.kind === "multipleOf" ? De(t.data, n.value) !== 0 && (r = this._getOrReturnCtx(t, r), u(r, {
			code: i.not_multiple_of,
			multipleOf: n.value,
			message: n.message
		}), a.dirty()) : n.kind === "finite" ? Number.isFinite(t.data) || (r = this._getOrReturnCtx(t, r), u(r, {
			code: i.not_finite,
			message: n.message
		}), a.dirty()) : e.assertNever(n);
		return {
			status: a.value,
			value: t.data
		};
	}
	gte(e, t) {
		return this.setLimit("min", e, !0, _.toString(t));
	}
	gt(e, t) {
		return this.setLimit("min", e, !1, _.toString(t));
	}
	lte(e, t) {
		return this.setLimit("max", e, !0, _.toString(t));
	}
	lt(e, t) {
		return this.setLimit("max", e, !1, _.toString(t));
	}
	setLimit(e, n, r, i) {
		return new t({
			...this._def,
			checks: [...this._def.checks, {
				kind: e,
				value: n,
				inclusive: r,
				message: _.toString(i)
			}]
		});
	}
	_addCheck(e) {
		return new t({
			...this._def,
			checks: [...this._def.checks, e]
		});
	}
	int(e) {
		return this._addCheck({
			kind: "int",
			message: _.toString(e)
		});
	}
	positive(e) {
		return this._addCheck({
			kind: "min",
			value: 0,
			inclusive: !1,
			message: _.toString(e)
		});
	}
	negative(e) {
		return this._addCheck({
			kind: "max",
			value: 0,
			inclusive: !1,
			message: _.toString(e)
		});
	}
	nonpositive(e) {
		return this._addCheck({
			kind: "max",
			value: 0,
			inclusive: !0,
			message: _.toString(e)
		});
	}
	nonnegative(e) {
		return this._addCheck({
			kind: "min",
			value: 0,
			inclusive: !0,
			message: _.toString(e)
		});
	}
	multipleOf(e, t) {
		return this._addCheck({
			kind: "multipleOf",
			value: e,
			message: _.toString(t)
		});
	}
	finite(e) {
		return this._addCheck({
			kind: "finite",
			message: _.toString(e)
		});
	}
	safe(e) {
		return this._addCheck({
			kind: "min",
			inclusive: !0,
			value: -(2 ** 53 - 1),
			message: _.toString(e)
		})._addCheck({
			kind: "max",
			inclusive: !0,
			value: 2 ** 53 - 1,
			message: _.toString(e)
		});
	}
	get minValue() {
		let e = null;
		for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
		return e;
	}
	get maxValue() {
		let e = null;
		for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
		return e;
	}
	get isInt() {
		return !!this._def.checks.find((t) => t.kind === "int" || t.kind === "multipleOf" && e.isInteger(t.value));
	}
	get isFinite() {
		let e = null, t = null;
		for (let n of this._def.checks) if (n.kind === "finite" || n.kind === "int" || n.kind === "multipleOf") return !0;
		else n.kind === "min" ? (t === null || n.value > t) && (t = n.value) : n.kind === "max" && (e === null || n.value < e) && (e = n.value);
		return Number.isFinite(t) && Number.isFinite(e);
	}
};
Oe.create = (e) => new Oe({
	checks: [],
	typeName: R.ZodNumber,
	coerce: e?.coerce || !1,
	...y(e)
});
var ke = class t extends b {
	constructor() {
		super(...arguments), this.min = this.gte, this.max = this.lte;
	}
	_parse(t) {
		if (this._def.coerce) try {
			t.data = BigInt(t.data);
		} catch {
			return this._getInvalidInput(t);
		}
		if (this._getType(t) !== n.bigint) return this._getInvalidInput(t);
		let r, a = new d();
		for (let n of this._def.checks) n.kind === "min" ? (n.inclusive ? t.data < n.value : t.data <= n.value) && (r = this._getOrReturnCtx(t, r), u(r, {
			code: i.too_small,
			type: "bigint",
			minimum: n.value,
			inclusive: n.inclusive,
			message: n.message
		}), a.dirty()) : n.kind === "max" ? (n.inclusive ? t.data > n.value : t.data >= n.value) && (r = this._getOrReturnCtx(t, r), u(r, {
			code: i.too_big,
			type: "bigint",
			maximum: n.value,
			inclusive: n.inclusive,
			message: n.message
		}), a.dirty()) : n.kind === "multipleOf" ? t.data % n.value !== BigInt(0) && (r = this._getOrReturnCtx(t, r), u(r, {
			code: i.not_multiple_of,
			multipleOf: n.value,
			message: n.message
		}), a.dirty()) : e.assertNever(n);
		return {
			status: a.value,
			value: t.data
		};
	}
	_getInvalidInput(e) {
		let t = this._getOrReturnCtx(e);
		return u(t, {
			code: i.invalid_type,
			expected: n.bigint,
			received: t.parsedType
		}), f;
	}
	gte(e, t) {
		return this.setLimit("min", e, !0, _.toString(t));
	}
	gt(e, t) {
		return this.setLimit("min", e, !1, _.toString(t));
	}
	lte(e, t) {
		return this.setLimit("max", e, !0, _.toString(t));
	}
	lt(e, t) {
		return this.setLimit("max", e, !1, _.toString(t));
	}
	setLimit(e, n, r, i) {
		return new t({
			...this._def,
			checks: [...this._def.checks, {
				kind: e,
				value: n,
				inclusive: r,
				message: _.toString(i)
			}]
		});
	}
	_addCheck(e) {
		return new t({
			...this._def,
			checks: [...this._def.checks, e]
		});
	}
	positive(e) {
		return this._addCheck({
			kind: "min",
			value: BigInt(0),
			inclusive: !1,
			message: _.toString(e)
		});
	}
	negative(e) {
		return this._addCheck({
			kind: "max",
			value: BigInt(0),
			inclusive: !1,
			message: _.toString(e)
		});
	}
	nonpositive(e) {
		return this._addCheck({
			kind: "max",
			value: BigInt(0),
			inclusive: !0,
			message: _.toString(e)
		});
	}
	nonnegative(e) {
		return this._addCheck({
			kind: "min",
			value: BigInt(0),
			inclusive: !0,
			message: _.toString(e)
		});
	}
	multipleOf(e, t) {
		return this._addCheck({
			kind: "multipleOf",
			value: e,
			message: _.toString(t)
		});
	}
	get minValue() {
		let e = null;
		for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
		return e;
	}
	get maxValue() {
		let e = null;
		for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
		return e;
	}
};
ke.create = (e) => new ke({
	checks: [],
	typeName: R.ZodBigInt,
	coerce: e?.coerce ?? !1,
	...y(e)
});
var Ae = class extends b {
	_parse(e) {
		if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== n.boolean) {
			let t = this._getOrReturnCtx(e);
			return u(t, {
				code: i.invalid_type,
				expected: n.boolean,
				received: t.parsedType
			}), f;
		}
		return m(e.data);
	}
};
Ae.create = (e) => new Ae({
	typeName: R.ZodBoolean,
	coerce: e?.coerce || !1,
	...y(e)
});
var je = class t extends b {
	_parse(t) {
		if (this._def.coerce && (t.data = new Date(t.data)), this._getType(t) !== n.date) {
			let e = this._getOrReturnCtx(t);
			return u(e, {
				code: i.invalid_type,
				expected: n.date,
				received: e.parsedType
			}), f;
		}
		if (Number.isNaN(t.data.getTime())) return u(this._getOrReturnCtx(t), { code: i.invalid_date }), f;
		let r = new d(), a;
		for (let n of this._def.checks) n.kind === "min" ? t.data.getTime() < n.value && (a = this._getOrReturnCtx(t, a), u(a, {
			code: i.too_small,
			message: n.message,
			inclusive: !0,
			exact: !1,
			minimum: n.value,
			type: "date"
		}), r.dirty()) : n.kind === "max" ? t.data.getTime() > n.value && (a = this._getOrReturnCtx(t, a), u(a, {
			code: i.too_big,
			message: n.message,
			inclusive: !0,
			exact: !1,
			maximum: n.value,
			type: "date"
		}), r.dirty()) : e.assertNever(n);
		return {
			status: r.value,
			value: new Date(t.data.getTime())
		};
	}
	_addCheck(e) {
		return new t({
			...this._def,
			checks: [...this._def.checks, e]
		});
	}
	min(e, t) {
		return this._addCheck({
			kind: "min",
			value: e.getTime(),
			message: _.toString(t)
		});
	}
	max(e, t) {
		return this._addCheck({
			kind: "max",
			value: e.getTime(),
			message: _.toString(t)
		});
	}
	get minDate() {
		let e = null;
		for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
		return e == null ? null : new Date(e);
	}
	get maxDate() {
		let e = null;
		for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
		return e == null ? null : new Date(e);
	}
};
je.create = (e) => new je({
	checks: [],
	coerce: e?.coerce || !1,
	typeName: R.ZodDate,
	...y(e)
});
var Me = class extends b {
	_parse(e) {
		if (this._getType(e) !== n.symbol) {
			let t = this._getOrReturnCtx(e);
			return u(t, {
				code: i.invalid_type,
				expected: n.symbol,
				received: t.parsedType
			}), f;
		}
		return m(e.data);
	}
};
Me.create = (e) => new Me({
	typeName: R.ZodSymbol,
	...y(e)
});
var Ne = class extends b {
	_parse(e) {
		if (this._getType(e) !== n.undefined) {
			let t = this._getOrReturnCtx(e);
			return u(t, {
				code: i.invalid_type,
				expected: n.undefined,
				received: t.parsedType
			}), f;
		}
		return m(e.data);
	}
};
Ne.create = (e) => new Ne({
	typeName: R.ZodUndefined,
	...y(e)
});
var Pe = class extends b {
	_parse(e) {
		if (this._getType(e) !== n.null) {
			let t = this._getOrReturnCtx(e);
			return u(t, {
				code: i.invalid_type,
				expected: n.null,
				received: t.parsedType
			}), f;
		}
		return m(e.data);
	}
};
Pe.create = (e) => new Pe({
	typeName: R.ZodNull,
	...y(e)
});
var Fe = class extends b {
	constructor() {
		super(...arguments), this._any = !0;
	}
	_parse(e) {
		return m(e.data);
	}
};
Fe.create = (e) => new Fe({
	typeName: R.ZodAny,
	...y(e)
});
var S = class extends b {
	constructor() {
		super(...arguments), this._unknown = !0;
	}
	_parse(e) {
		return m(e.data);
	}
};
S.create = (e) => new S({
	typeName: R.ZodUnknown,
	...y(e)
});
var C = class extends b {
	_parse(e) {
		let t = this._getOrReturnCtx(e);
		return u(t, {
			code: i.invalid_type,
			expected: n.never,
			received: t.parsedType
		}), f;
	}
};
C.create = (e) => new C({
	typeName: R.ZodNever,
	...y(e)
});
var Ie = class extends b {
	_parse(e) {
		if (this._getType(e) !== n.undefined) {
			let t = this._getOrReturnCtx(e);
			return u(t, {
				code: i.invalid_type,
				expected: n.void,
				received: t.parsedType
			}), f;
		}
		return m(e.data);
	}
};
Ie.create = (e) => new Ie({
	typeName: R.ZodVoid,
	...y(e)
});
var w = class e extends b {
	_parse(e) {
		let { ctx: t, status: r } = this._processInputParams(e), a = this._def;
		if (t.parsedType !== n.array) return u(t, {
			code: i.invalid_type,
			expected: n.array,
			received: t.parsedType
		}), f;
		if (a.exactLength !== null) {
			let e = t.data.length > a.exactLength.value, n = t.data.length < a.exactLength.value;
			(e || n) && (u(t, {
				code: e ? i.too_big : i.too_small,
				minimum: n ? a.exactLength.value : void 0,
				maximum: e ? a.exactLength.value : void 0,
				type: "array",
				inclusive: !0,
				exact: !0,
				message: a.exactLength.message
			}), r.dirty());
		}
		if (a.minLength !== null && t.data.length < a.minLength.value && (u(t, {
			code: i.too_small,
			minimum: a.minLength.value,
			type: "array",
			inclusive: !0,
			exact: !1,
			message: a.minLength.message
		}), r.dirty()), a.maxLength !== null && t.data.length > a.maxLength.value && (u(t, {
			code: i.too_big,
			maximum: a.maxLength.value,
			type: "array",
			inclusive: !0,
			exact: !1,
			message: a.maxLength.message
		}), r.dirty()), t.common.async) return Promise.all([...t.data].map((e, n) => a.type._parseAsync(new v(t, e, t.path, n)))).then((e) => d.mergeArray(r, e));
		let o = [...t.data].map((e, n) => a.type._parseSync(new v(t, e, t.path, n)));
		return d.mergeArray(r, o);
	}
	get element() {
		return this._def.type;
	}
	min(t, n) {
		return new e({
			...this._def,
			minLength: {
				value: t,
				message: _.toString(n)
			}
		});
	}
	max(t, n) {
		return new e({
			...this._def,
			maxLength: {
				value: t,
				message: _.toString(n)
			}
		});
	}
	length(t, n) {
		return new e({
			...this._def,
			exactLength: {
				value: t,
				message: _.toString(n)
			}
		});
	}
	nonempty(e) {
		return this.min(1, e);
	}
};
w.create = (e, t) => new w({
	type: e,
	minLength: null,
	maxLength: null,
	exactLength: null,
	typeName: R.ZodArray,
	...y(t)
});
function T(e) {
	if (e instanceof E) {
		let t = {};
		for (let n in e.shape) {
			let r = e.shape[n];
			t[n] = I.create(T(r));
		}
		return new E({
			...e._def,
			shape: () => t
		});
	}
	return e instanceof w ? new w({
		...e._def,
		type: T(e.element)
	}) : e instanceof I ? I.create(T(e.unwrap())) : e instanceof L ? L.create(T(e.unwrap())) : e instanceof A ? A.create(e.items.map((e) => T(e))) : e;
}
var E = class t extends b {
	constructor() {
		super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
	}
	_getCached() {
		if (this._cached !== null) return this._cached;
		let t = this._def.shape(), n = e.objectKeys(t);
		return this._cached = {
			shape: t,
			keys: n
		}, this._cached;
	}
	_parse(e) {
		if (this._getType(e) !== n.object) {
			let t = this._getOrReturnCtx(e);
			return u(t, {
				code: i.invalid_type,
				expected: n.object,
				received: t.parsedType
			}), f;
		}
		let { status: t, ctx: r } = this._processInputParams(e), { shape: a, keys: o } = this._getCached(), s = [];
		if (!(this._def.catchall instanceof C && this._def.unknownKeys === "strip")) for (let e in r.data) o.includes(e) || s.push(e);
		let c = [];
		for (let e of o) {
			let t = a[e], n = r.data[e];
			c.push({
				key: {
					status: "valid",
					value: e
				},
				value: t._parse(new v(r, n, r.path, e)),
				alwaysSet: e in r.data
			});
		}
		if (this._def.catchall instanceof C) {
			let e = this._def.unknownKeys;
			if (e === "passthrough") for (let e of s) c.push({
				key: {
					status: "valid",
					value: e
				},
				value: {
					status: "valid",
					value: r.data[e]
				}
			});
			else if (e === "strict") s.length > 0 && (u(r, {
				code: i.unrecognized_keys,
				keys: s
			}), t.dirty());
			else if (e !== "strip") throw Error("Internal ZodObject error: invalid unknownKeys value.");
		} else {
			let e = this._def.catchall;
			for (let t of s) {
				let n = r.data[t];
				c.push({
					key: {
						status: "valid",
						value: t
					},
					value: e._parse(new v(r, n, r.path, t)),
					alwaysSet: t in r.data
				});
			}
		}
		return r.common.async ? Promise.resolve().then(async () => {
			let e = [];
			for (let t of c) {
				let n = await t.key, r = await t.value;
				e.push({
					key: n,
					value: r,
					alwaysSet: t.alwaysSet
				});
			}
			return e;
		}).then((e) => d.mergeObjectSync(t, e)) : d.mergeObjectSync(t, c);
	}
	get shape() {
		return this._def.shape();
	}
	strict(e) {
		return _.errToObj, new t({
			...this._def,
			unknownKeys: "strict",
			...e === void 0 ? {} : { errorMap: (t, n) => {
				let r = this._def.errorMap?.(t, n).message ?? n.defaultError;
				return t.code === "unrecognized_keys" ? { message: _.errToObj(e).message ?? r } : { message: r };
			} }
		});
	}
	strip() {
		return new t({
			...this._def,
			unknownKeys: "strip"
		});
	}
	passthrough() {
		return new t({
			...this._def,
			unknownKeys: "passthrough"
		});
	}
	extend(e) {
		return new t({
			...this._def,
			shape: () => ({
				...this._def.shape(),
				...e
			})
		});
	}
	merge(e) {
		return new t({
			unknownKeys: e._def.unknownKeys,
			catchall: e._def.catchall,
			shape: () => ({
				...this._def.shape(),
				...e._def.shape()
			}),
			typeName: R.ZodObject
		});
	}
	setKey(e, t) {
		return this.augment({ [e]: t });
	}
	catchall(e) {
		return new t({
			...this._def,
			catchall: e
		});
	}
	pick(n) {
		let r = {};
		for (let t of e.objectKeys(n)) n[t] && this.shape[t] && (r[t] = this.shape[t]);
		return new t({
			...this._def,
			shape: () => r
		});
	}
	omit(n) {
		let r = {};
		for (let t of e.objectKeys(this.shape)) n[t] || (r[t] = this.shape[t]);
		return new t({
			...this._def,
			shape: () => r
		});
	}
	deepPartial() {
		return T(this);
	}
	partial(n) {
		let r = {};
		for (let t of e.objectKeys(this.shape)) {
			let e = this.shape[t];
			r[t] = n && !n[t] ? e : e.optional();
		}
		return new t({
			...this._def,
			shape: () => r
		});
	}
	required(n) {
		let r = {};
		for (let t of e.objectKeys(this.shape)) if (n && !n[t]) r[t] = this.shape[t];
		else {
			let e = this.shape[t];
			for (; e instanceof I;) e = e._def.innerType;
			r[t] = e;
		}
		return new t({
			...this._def,
			shape: () => r
		});
	}
	keyof() {
		return Ue(e.objectKeys(this.shape));
	}
};
E.create = (e, t) => new E({
	shape: () => e,
	unknownKeys: "strip",
	catchall: C.create(),
	typeName: R.ZodObject,
	...y(t)
}), E.strictCreate = (e, t) => new E({
	shape: () => e,
	unknownKeys: "strict",
	catchall: C.create(),
	typeName: R.ZodObject,
	...y(t)
}), E.lazycreate = (e, t) => new E({
	shape: e,
	unknownKeys: "strip",
	catchall: C.create(),
	typeName: R.ZodObject,
	...y(t)
});
var D = class extends b {
	_parse(e) {
		let { ctx: t } = this._processInputParams(e), n = this._def.options;
		function r(e) {
			for (let t of e) if (t.result.status === "valid") return t.result;
			for (let n of e) if (n.result.status === "dirty") return t.common.issues.push(...n.ctx.common.issues), n.result;
			let n = e.map((e) => new a(e.ctx.common.issues));
			return u(t, {
				code: i.invalid_union,
				unionErrors: n
			}), f;
		}
		if (t.common.async) return Promise.all(n.map(async (e) => {
			let n = {
				...t,
				common: {
					...t.common,
					issues: []
				},
				parent: null
			};
			return {
				result: await e._parseAsync({
					data: t.data,
					path: t.path,
					parent: n
				}),
				ctx: n
			};
		})).then(r);
		{
			let e, r = [];
			for (let i of n) {
				let n = {
					...t,
					common: {
						...t.common,
						issues: []
					},
					parent: null
				}, a = i._parseSync({
					data: t.data,
					path: t.path,
					parent: n
				});
				if (a.status === "valid") return a;
				a.status === "dirty" && !e && (e = {
					result: a,
					ctx: n
				}), n.common.issues.length && r.push(n.common.issues);
			}
			if (e) return t.common.issues.push(...e.ctx.common.issues), e.result;
			let o = r.map((e) => new a(e));
			return u(t, {
				code: i.invalid_union,
				unionErrors: o
			}), f;
		}
	}
	get options() {
		return this._def.options;
	}
};
D.create = (e, t) => new D({
	options: e,
	typeName: R.ZodUnion,
	...y(t)
});
var O = (t) => t instanceof j ? O(t.schema) : t instanceof F ? O(t.innerType()) : t instanceof M ? [t.value] : t instanceof N ? t.options : t instanceof We ? e.objectValues(t.enum) : t instanceof Ge ? O(t._def.innerType) : t instanceof Ne ? [void 0] : t instanceof Pe ? [null] : t instanceof I ? [void 0, ...O(t.unwrap())] : t instanceof L ? [null, ...O(t.unwrap())] : t instanceof Je || t instanceof Xe ? O(t.unwrap()) : t instanceof Ke ? O(t._def.innerType) : [], Le = class e extends b {
	_parse(e) {
		let { ctx: t } = this._processInputParams(e);
		if (t.parsedType !== n.object) return u(t, {
			code: i.invalid_type,
			expected: n.object,
			received: t.parsedType
		}), f;
		let r = this.discriminator, a = t.data[r], o = this.optionsMap.get(a);
		return o ? t.common.async ? o._parseAsync({
			data: t.data,
			path: t.path,
			parent: t
		}) : o._parseSync({
			data: t.data,
			path: t.path,
			parent: t
		}) : (u(t, {
			code: i.invalid_union_discriminator,
			options: Array.from(this.optionsMap.keys()),
			path: [r]
		}), f);
	}
	get discriminator() {
		return this._def.discriminator;
	}
	get options() {
		return this._def.options;
	}
	get optionsMap() {
		return this._def.optionsMap;
	}
	static create(t, n, r) {
		let i = /* @__PURE__ */ new Map();
		for (let e of n) {
			let n = O(e.shape[t]);
			if (!n.length) throw Error(`A discriminator value for key \`${t}\` could not be extracted from all schema options`);
			for (let r of n) {
				if (i.has(r)) throw Error(`Discriminator property ${String(t)} has duplicate value ${String(r)}`);
				i.set(r, e);
			}
		}
		return new e({
			typeName: R.ZodDiscriminatedUnion,
			discriminator: t,
			options: n,
			optionsMap: i,
			...y(r)
		});
	}
};
function Re(t, i) {
	let a = r(t), o = r(i);
	if (t === i) return {
		valid: !0,
		data: t
	};
	if (a === n.object && o === n.object) {
		let n = e.objectKeys(i), r = e.objectKeys(t).filter((e) => n.indexOf(e) !== -1), a = {
			...t,
			...i
		};
		for (let e of r) {
			let n = Re(t[e], i[e]);
			if (!n.valid) return { valid: !1 };
			a[e] = n.data;
		}
		return {
			valid: !0,
			data: a
		};
	}
	if (a === n.array && o === n.array) {
		if (t.length !== i.length) return { valid: !1 };
		let e = [];
		for (let n = 0; n < t.length; n++) {
			let r = t[n], a = i[n], o = Re(r, a);
			if (!o.valid) return { valid: !1 };
			e.push(o.data);
		}
		return {
			valid: !0,
			data: e
		};
	}
	return a === n.date && o === n.date && +t == +i ? {
		valid: !0,
		data: t
	} : { valid: !1 };
}
var k = class extends b {
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e), r = (e, r) => {
			if (ee(e) || ee(r)) return f;
			let a = Re(e.value, r.value);
			return a.valid ? ((te(e) || te(r)) && t.dirty(), {
				status: t.value,
				value: a.data
			}) : (u(n, { code: i.invalid_intersection_types }), f);
		};
		return n.common.async ? Promise.all([this._def.left._parseAsync({
			data: n.data,
			path: n.path,
			parent: n
		}), this._def.right._parseAsync({
			data: n.data,
			path: n.path,
			parent: n
		})]).then(([e, t]) => r(e, t)) : r(this._def.left._parseSync({
			data: n.data,
			path: n.path,
			parent: n
		}), this._def.right._parseSync({
			data: n.data,
			path: n.path,
			parent: n
		}));
	}
};
k.create = (e, t, n) => new k({
	left: e,
	right: t,
	typeName: R.ZodIntersection,
	...y(n)
});
var A = class e extends b {
	_parse(e) {
		let { status: t, ctx: r } = this._processInputParams(e);
		if (r.parsedType !== n.array) return u(r, {
			code: i.invalid_type,
			expected: n.array,
			received: r.parsedType
		}), f;
		if (r.data.length < this._def.items.length) return u(r, {
			code: i.too_small,
			minimum: this._def.items.length,
			inclusive: !0,
			exact: !1,
			type: "array"
		}), f;
		!this._def.rest && r.data.length > this._def.items.length && (u(r, {
			code: i.too_big,
			maximum: this._def.items.length,
			inclusive: !0,
			exact: !1,
			type: "array"
		}), t.dirty());
		let a = [...r.data].map((e, t) => {
			let n = this._def.items[t] || this._def.rest;
			return n ? n._parse(new v(r, e, r.path, t)) : null;
		}).filter((e) => !!e);
		return r.common.async ? Promise.all(a).then((e) => d.mergeArray(t, e)) : d.mergeArray(t, a);
	}
	get items() {
		return this._def.items;
	}
	rest(t) {
		return new e({
			...this._def,
			rest: t
		});
	}
};
A.create = (e, t) => {
	if (!Array.isArray(e)) throw Error("You must pass an array of schemas to z.tuple([ ... ])");
	return new A({
		items: e,
		typeName: R.ZodTuple,
		rest: null,
		...y(t)
	});
};
var ze = class e extends b {
	get keySchema() {
		return this._def.keyType;
	}
	get valueSchema() {
		return this._def.valueType;
	}
	_parse(e) {
		let { status: t, ctx: r } = this._processInputParams(e);
		if (r.parsedType !== n.object) return u(r, {
			code: i.invalid_type,
			expected: n.object,
			received: r.parsedType
		}), f;
		let a = [], o = this._def.keyType, s = this._def.valueType;
		for (let e in r.data) a.push({
			key: o._parse(new v(r, e, r.path, e)),
			value: s._parse(new v(r, r.data[e], r.path, e)),
			alwaysSet: e in r.data
		});
		return r.common.async ? d.mergeObjectAsync(t, a) : d.mergeObjectSync(t, a);
	}
	get element() {
		return this._def.valueType;
	}
	static create(t, n, r) {
		return n instanceof b ? new e({
			keyType: t,
			valueType: n,
			typeName: R.ZodRecord,
			...y(r)
		}) : new e({
			keyType: x.create(),
			valueType: t,
			typeName: R.ZodRecord,
			...y(n)
		});
	}
}, Be = class extends b {
	get keySchema() {
		return this._def.keyType;
	}
	get valueSchema() {
		return this._def.valueType;
	}
	_parse(e) {
		let { status: t, ctx: r } = this._processInputParams(e);
		if (r.parsedType !== n.map) return u(r, {
			code: i.invalid_type,
			expected: n.map,
			received: r.parsedType
		}), f;
		let a = this._def.keyType, o = this._def.valueType, s = [...r.data.entries()].map(([e, t], n) => ({
			key: a._parse(new v(r, e, r.path, [n, "key"])),
			value: o._parse(new v(r, t, r.path, [n, "value"]))
		}));
		if (r.common.async) {
			let e = /* @__PURE__ */ new Map();
			return Promise.resolve().then(async () => {
				for (let n of s) {
					let r = await n.key, i = await n.value;
					if (r.status === "aborted" || i.status === "aborted") return f;
					(r.status === "dirty" || i.status === "dirty") && t.dirty(), e.set(r.value, i.value);
				}
				return {
					status: t.value,
					value: e
				};
			});
		}
		{
			let e = /* @__PURE__ */ new Map();
			for (let n of s) {
				let r = n.key, i = n.value;
				if (r.status === "aborted" || i.status === "aborted") return f;
				(r.status === "dirty" || i.status === "dirty") && t.dirty(), e.set(r.value, i.value);
			}
			return {
				status: t.value,
				value: e
			};
		}
	}
};
Be.create = (e, t, n) => new Be({
	valueType: t,
	keyType: e,
	typeName: R.ZodMap,
	...y(n)
});
var Ve = class e extends b {
	_parse(e) {
		let { status: t, ctx: r } = this._processInputParams(e);
		if (r.parsedType !== n.set) return u(r, {
			code: i.invalid_type,
			expected: n.set,
			received: r.parsedType
		}), f;
		let a = this._def;
		a.minSize !== null && r.data.size < a.minSize.value && (u(r, {
			code: i.too_small,
			minimum: a.minSize.value,
			type: "set",
			inclusive: !0,
			exact: !1,
			message: a.minSize.message
		}), t.dirty()), a.maxSize !== null && r.data.size > a.maxSize.value && (u(r, {
			code: i.too_big,
			maximum: a.maxSize.value,
			type: "set",
			inclusive: !0,
			exact: !1,
			message: a.maxSize.message
		}), t.dirty());
		let o = this._def.valueType;
		function s(e) {
			let n = /* @__PURE__ */ new Set();
			for (let r of e) {
				if (r.status === "aborted") return f;
				r.status === "dirty" && t.dirty(), n.add(r.value);
			}
			return {
				status: t.value,
				value: n
			};
		}
		let c = [...r.data.values()].map((e, t) => o._parse(new v(r, e, r.path, t)));
		return r.common.async ? Promise.all(c).then((e) => s(e)) : s(c);
	}
	min(t, n) {
		return new e({
			...this._def,
			minSize: {
				value: t,
				message: _.toString(n)
			}
		});
	}
	max(t, n) {
		return new e({
			...this._def,
			maxSize: {
				value: t,
				message: _.toString(n)
			}
		});
	}
	size(e, t) {
		return this.min(e, t).max(e, t);
	}
	nonempty(e) {
		return this.min(1, e);
	}
};
Ve.create = (e, t) => new Ve({
	valueType: e,
	minSize: null,
	maxSize: null,
	typeName: R.ZodSet,
	...y(t)
});
var He = class e extends b {
	constructor() {
		super(...arguments), this.validate = this.implement;
	}
	_parse(e) {
		let { ctx: t } = this._processInputParams(e);
		if (t.parsedType !== n.function) return u(t, {
			code: i.invalid_type,
			expected: n.function,
			received: t.parsedType
		}), f;
		function r(e, n) {
			return l({
				data: e,
				path: t.path,
				errorMaps: [
					t.common.contextualErrorMap,
					t.schemaErrorMap,
					c(),
					o
				].filter((e) => !!e),
				issueData: {
					code: i.invalid_arguments,
					argumentsError: n
				}
			});
		}
		function s(e, n) {
			return l({
				data: e,
				path: t.path,
				errorMaps: [
					t.common.contextualErrorMap,
					t.schemaErrorMap,
					c(),
					o
				].filter((e) => !!e),
				issueData: {
					code: i.invalid_return_type,
					returnTypeError: n
				}
			});
		}
		let d = { errorMap: t.common.contextualErrorMap }, p = t.data;
		if (this._def.returns instanceof P) {
			let e = this;
			return m(async function(...t) {
				let n = new a([]), i = await e._def.args.parseAsync(t, d).catch((e) => {
					throw n.addIssue(r(t, e)), n;
				}), o = await Reflect.apply(p, this, i);
				return await e._def.returns._def.type.parseAsync(o, d).catch((e) => {
					throw n.addIssue(s(o, e)), n;
				});
			});
		}
		{
			let e = this;
			return m(function(...t) {
				let n = e._def.args.safeParse(t, d);
				if (!n.success) throw new a([r(t, n.error)]);
				let i = Reflect.apply(p, this, n.data), o = e._def.returns.safeParse(i, d);
				if (!o.success) throw new a([s(i, o.error)]);
				return o.data;
			});
		}
	}
	parameters() {
		return this._def.args;
	}
	returnType() {
		return this._def.returns;
	}
	args(...t) {
		return new e({
			...this._def,
			args: A.create(t).rest(S.create())
		});
	}
	returns(t) {
		return new e({
			...this._def,
			returns: t
		});
	}
	implement(e) {
		return this.parse(e);
	}
	strictImplement(e) {
		return this.parse(e);
	}
	static create(t, n, r) {
		return new e({
			args: t || A.create([]).rest(S.create()),
			returns: n || S.create(),
			typeName: R.ZodFunction,
			...y(r)
		});
	}
}, j = class extends b {
	get schema() {
		return this._def.getter();
	}
	_parse(e) {
		let { ctx: t } = this._processInputParams(e);
		return this._def.getter()._parse({
			data: t.data,
			path: t.path,
			parent: t
		});
	}
};
j.create = (e, t) => new j({
	getter: e,
	typeName: R.ZodLazy,
	...y(t)
});
var M = class extends b {
	_parse(e) {
		if (e.data !== this._def.value) {
			let t = this._getOrReturnCtx(e);
			return u(t, {
				received: t.data,
				code: i.invalid_literal,
				expected: this._def.value
			}), f;
		}
		return {
			status: "valid",
			value: e.data
		};
	}
	get value() {
		return this._def.value;
	}
};
M.create = (e, t) => new M({
	value: e,
	typeName: R.ZodLiteral,
	...y(t)
});
function Ue(e, t) {
	return new N({
		values: e,
		typeName: R.ZodEnum,
		...y(t)
	});
}
var N = class t extends b {
	_parse(t) {
		if (typeof t.data != "string") {
			let n = this._getOrReturnCtx(t), r = this._def.values;
			return u(n, {
				expected: e.joinValues(r),
				received: n.parsedType,
				code: i.invalid_type
			}), f;
		}
		if (this._cache ||= new Set(this._def.values), !this._cache.has(t.data)) {
			let e = this._getOrReturnCtx(t), n = this._def.values;
			return u(e, {
				received: e.data,
				code: i.invalid_enum_value,
				options: n
			}), f;
		}
		return m(t.data);
	}
	get options() {
		return this._def.values;
	}
	get enum() {
		let e = {};
		for (let t of this._def.values) e[t] = t;
		return e;
	}
	get Values() {
		let e = {};
		for (let t of this._def.values) e[t] = t;
		return e;
	}
	get Enum() {
		let e = {};
		for (let t of this._def.values) e[t] = t;
		return e;
	}
	extract(e, n = this._def) {
		return t.create(e, {
			...this._def,
			...n
		});
	}
	exclude(e, n = this._def) {
		return t.create(this.options.filter((t) => !e.includes(t)), {
			...this._def,
			...n
		});
	}
};
N.create = Ue;
var We = class extends b {
	_parse(t) {
		let r = e.getValidEnumValues(this._def.values), a = this._getOrReturnCtx(t);
		if (a.parsedType !== n.string && a.parsedType !== n.number) {
			let t = e.objectValues(r);
			return u(a, {
				expected: e.joinValues(t),
				received: a.parsedType,
				code: i.invalid_type
			}), f;
		}
		if (this._cache ||= new Set(e.getValidEnumValues(this._def.values)), !this._cache.has(t.data)) {
			let t = e.objectValues(r);
			return u(a, {
				received: a.data,
				code: i.invalid_enum_value,
				options: t
			}), f;
		}
		return m(t.data);
	}
	get enum() {
		return this._def.values;
	}
};
We.create = (e, t) => new We({
	values: e,
	typeName: R.ZodNativeEnum,
	...y(t)
});
var P = class extends b {
	unwrap() {
		return this._def.type;
	}
	_parse(e) {
		let { ctx: t } = this._processInputParams(e);
		return t.parsedType !== n.promise && t.common.async === !1 ? (u(t, {
			code: i.invalid_type,
			expected: n.promise,
			received: t.parsedType
		}), f) : m((t.parsedType === n.promise ? t.data : Promise.resolve(t.data)).then((e) => this._def.type.parseAsync(e, {
			path: t.path,
			errorMap: t.common.contextualErrorMap
		})));
	}
};
P.create = (e, t) => new P({
	type: e,
	typeName: R.ZodPromise,
	...y(t)
});
var F = class extends b {
	innerType() {
		return this._def.schema;
	}
	sourceType() {
		return this._def.schema._def.typeName === R.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
	}
	_parse(t) {
		let { status: n, ctx: r } = this._processInputParams(t), i = this._def.effect || null, a = {
			addIssue: (e) => {
				u(r, e), e.fatal ? n.abort() : n.dirty();
			},
			get path() {
				return r.path;
			}
		};
		if (a.addIssue = a.addIssue.bind(a), i.type === "preprocess") {
			let e = i.transform(r.data, a);
			if (r.common.async) return Promise.resolve(e).then(async (e) => {
				if (n.value === "aborted") return f;
				let t = await this._def.schema._parseAsync({
					data: e,
					path: r.path,
					parent: r
				});
				return t.status === "aborted" ? f : t.status === "dirty" || n.value === "dirty" ? p(t.value) : t;
			});
			{
				if (n.value === "aborted") return f;
				let t = this._def.schema._parseSync({
					data: e,
					path: r.path,
					parent: r
				});
				return t.status === "aborted" ? f : t.status === "dirty" || n.value === "dirty" ? p(t.value) : t;
			}
		}
		if (i.type === "refinement") {
			let e = (e) => {
				let t = i.refinement(e, a);
				if (r.common.async) return Promise.resolve(t);
				if (t instanceof Promise) throw Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
				return e;
			};
			if (r.common.async === !1) {
				let t = this._def.schema._parseSync({
					data: r.data,
					path: r.path,
					parent: r
				});
				return t.status === "aborted" ? f : (t.status === "dirty" && n.dirty(), e(t.value), {
					status: n.value,
					value: t.value
				});
			}
			return this._def.schema._parseAsync({
				data: r.data,
				path: r.path,
				parent: r
			}).then((t) => t.status === "aborted" ? f : (t.status === "dirty" && n.dirty(), e(t.value).then(() => ({
				status: n.value,
				value: t.value
			}))));
		}
		if (i.type === "transform") if (r.common.async === !1) {
			let e = this._def.schema._parseSync({
				data: r.data,
				path: r.path,
				parent: r
			});
			if (!h(e)) return f;
			let t = i.transform(e.value, a);
			if (t instanceof Promise) throw Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
			return {
				status: n.value,
				value: t
			};
		} else return this._def.schema._parseAsync({
			data: r.data,
			path: r.path,
			parent: r
		}).then((e) => h(e) ? Promise.resolve(i.transform(e.value, a)).then((e) => ({
			status: n.value,
			value: e
		})) : f);
		e.assertNever(i);
	}
};
F.create = (e, t, n) => new F({
	schema: e,
	typeName: R.ZodEffects,
	effect: t,
	...y(n)
}), F.createWithPreprocess = (e, t, n) => new F({
	schema: t,
	effect: {
		type: "preprocess",
		transform: e
	},
	typeName: R.ZodEffects,
	...y(n)
});
var I = class extends b {
	_parse(e) {
		return this._getType(e) === n.undefined ? m(void 0) : this._def.innerType._parse(e);
	}
	unwrap() {
		return this._def.innerType;
	}
};
I.create = (e, t) => new I({
	innerType: e,
	typeName: R.ZodOptional,
	...y(t)
});
var L = class extends b {
	_parse(e) {
		return this._getType(e) === n.null ? m(null) : this._def.innerType._parse(e);
	}
	unwrap() {
		return this._def.innerType;
	}
};
L.create = (e, t) => new L({
	innerType: e,
	typeName: R.ZodNullable,
	...y(t)
});
var Ge = class extends b {
	_parse(e) {
		let { ctx: t } = this._processInputParams(e), r = t.data;
		return t.parsedType === n.undefined && (r = this._def.defaultValue()), this._def.innerType._parse({
			data: r,
			path: t.path,
			parent: t
		});
	}
	removeDefault() {
		return this._def.innerType;
	}
};
Ge.create = (e, t) => new Ge({
	innerType: e,
	typeName: R.ZodDefault,
	defaultValue: typeof t.default == "function" ? t.default : () => t.default,
	...y(t)
});
var Ke = class extends b {
	_parse(e) {
		let { ctx: t } = this._processInputParams(e), n = {
			...t,
			common: {
				...t.common,
				issues: []
			}
		}, r = this._def.innerType._parse({
			data: n.data,
			path: n.path,
			parent: { ...n }
		});
		return g(r) ? r.then((e) => ({
			status: "valid",
			value: e.status === "valid" ? e.value : this._def.catchValue({
				get error() {
					return new a(n.common.issues);
				},
				input: n.data
			})
		})) : {
			status: "valid",
			value: r.status === "valid" ? r.value : this._def.catchValue({
				get error() {
					return new a(n.common.issues);
				},
				input: n.data
			})
		};
	}
	removeCatch() {
		return this._def.innerType;
	}
};
Ke.create = (e, t) => new Ke({
	innerType: e,
	typeName: R.ZodCatch,
	catchValue: typeof t.catch == "function" ? t.catch : () => t.catch,
	...y(t)
});
var qe = class extends b {
	_parse(e) {
		if (this._getType(e) !== n.nan) {
			let t = this._getOrReturnCtx(e);
			return u(t, {
				code: i.invalid_type,
				expected: n.nan,
				received: t.parsedType
			}), f;
		}
		return {
			status: "valid",
			value: e.data
		};
	}
};
qe.create = (e) => new qe({
	typeName: R.ZodNaN,
	...y(e)
});
var Je = class extends b {
	_parse(e) {
		let { ctx: t } = this._processInputParams(e), n = t.data;
		return this._def.type._parse({
			data: n,
			path: t.path,
			parent: t
		});
	}
	unwrap() {
		return this._def.type;
	}
}, Ye = class e extends b {
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e);
		if (n.common.async) return (async () => {
			let e = await this._def.in._parseAsync({
				data: n.data,
				path: n.path,
				parent: n
			});
			return e.status === "aborted" ? f : e.status === "dirty" ? (t.dirty(), p(e.value)) : this._def.out._parseAsync({
				data: e.value,
				path: n.path,
				parent: n
			});
		})();
		{
			let e = this._def.in._parseSync({
				data: n.data,
				path: n.path,
				parent: n
			});
			return e.status === "aborted" ? f : e.status === "dirty" ? (t.dirty(), {
				status: "dirty",
				value: e.value
			}) : this._def.out._parseSync({
				data: e.value,
				path: n.path,
				parent: n
			});
		}
	}
	static create(t, n) {
		return new e({
			in: t,
			out: n,
			typeName: R.ZodPipeline
		});
	}
}, Xe = class extends b {
	_parse(e) {
		let t = this._def.innerType._parse(e), n = (e) => (h(e) && (e.value = Object.freeze(e.value)), e);
		return g(t) ? t.then((e) => n(e)) : n(t);
	}
	unwrap() {
		return this._def.innerType;
	}
};
Xe.create = (e, t) => new Xe({
	innerType: e,
	typeName: R.ZodReadonly,
	...y(t)
}), E.lazycreate;
var R;
(function(e) {
	e.ZodString = "ZodString", e.ZodNumber = "ZodNumber", e.ZodNaN = "ZodNaN", e.ZodBigInt = "ZodBigInt", e.ZodBoolean = "ZodBoolean", e.ZodDate = "ZodDate", e.ZodSymbol = "ZodSymbol", e.ZodUndefined = "ZodUndefined", e.ZodNull = "ZodNull", e.ZodAny = "ZodAny", e.ZodUnknown = "ZodUnknown", e.ZodNever = "ZodNever", e.ZodVoid = "ZodVoid", e.ZodArray = "ZodArray", e.ZodObject = "ZodObject", e.ZodUnion = "ZodUnion", e.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", e.ZodIntersection = "ZodIntersection", e.ZodTuple = "ZodTuple", e.ZodRecord = "ZodRecord", e.ZodMap = "ZodMap", e.ZodSet = "ZodSet", e.ZodFunction = "ZodFunction", e.ZodLazy = "ZodLazy", e.ZodLiteral = "ZodLiteral", e.ZodEnum = "ZodEnum", e.ZodEffects = "ZodEffects", e.ZodNativeEnum = "ZodNativeEnum", e.ZodOptional = "ZodOptional", e.ZodNullable = "ZodNullable", e.ZodDefault = "ZodDefault", e.ZodCatch = "ZodCatch", e.ZodPromise = "ZodPromise", e.ZodBranded = "ZodBranded", e.ZodPipeline = "ZodPipeline", e.ZodReadonly = "ZodReadonly";
})(R ||= {});
var z = x.create, B = Oe.create;
qe.create, ke.create;
var Ze = Ae.create;
je.create, Me.create, Ne.create, Pe.create, Fe.create, S.create, C.create, Ie.create;
var Qe = w.create, V = E.create;
E.strictCreate;
var $e = D.create;
Le.create, k.create, A.create, ze.create, Be.create, Ve.create, He.create, j.create;
var H = M.create, U = N.create;
We.create, P.create, F.create, I.create, L.create, F.createWithPreprocess, Ye.create;
//#endregion
//#region src/lib/analytics-contract.ts
var W = "G-0B661FMB74", et = "hl-analytics-consent-v2", tt = V({
	version: H("2"),
	choice: U(["granted", "denied"]),
	updatedAt: B().int().nonnegative(),
	expiresAt: B().int().nonnegative()
}).strict();
V({
	version: H("2"),
	choice: U(["granted", "denied"])
}).strict();
var G = z().max(100).regex(/^[\p{L}\p{N}_ .+%()&–—:/-]{1,100}$/u), K = U([
	"camada",
	"escopo",
	"foco",
	"setor",
	"classe",
	"escopoFoco",
	"estagio",
	"half",
	"year",
	"ageRound"
]), nt = U([
	"vc",
	"func",
	"cheque",
	"cheque_avg",
	"cheque_median",
	"velocity",
	"companies",
	"period_capital",
	"rounds"
]), q = B().int().min(1).max(2e3), rt = B().finite().min(0).max(3600), J = {
	report_version: G,
	report_publication: z().datetime().optional()
};
function it(e, t) {
	let n = G.safeParse(e), r = z().datetime().safeParse(t);
	return {
		report_version: n.success ? n.data : "published_report",
		...r.success ? { report_publication: r.data } : {}
	};
}
var at = U([
	"report",
	"database",
	"institutional"
]), ot = V({
	x_axis: K,
	metric: nt,
	breakdown: U([
		"none",
		"camada",
		"escopo",
		"classe",
		"estagio",
		"foco",
		"setor"
	]),
	ai_filter: U([
		"all",
		"native",
		"enabled"
	]),
	period: U([
		"all",
		"2024",
		"2025",
		"2026"
	]),
	compare: Ze(),
	second_metric: nt,
	chart_type: U([
		"line",
		"bar",
		"multi_line",
		"stacked",
		"stacked_100",
		"grouped",
		"donut",
		"combo",
		"age_combo"
	]),
	include_partial: Ze().optional(),
	top_n: B().int().min(0).max(100).optional(),
	subsector: G.optional()
}), st = {
	research_gate_view: V({}),
	research_form_start: V({}),
	research_form_error: V({ error_code: U([
		"invalid_input",
		"verify_unavailable",
		"save_failed"
	]) }),
	generate_lead: V({ method: H("research_gate") }),
	newsletter_signup: V({ method: H("research_gate") }),
	research_access_granted: V({ access_type: U([
		"new",
		"returning",
		"restored"
	]) }),
	research_choice: V({ destination: at }),
	research_switch: V({
		destination: at,
		link_location: U([
			"floating_switch",
			"reader_header",
			"report_chart"
		])
	}),
	database_tab_viewed: V({ exploration_mode: U(["guided", "builder"]) }),
	report_open: V({
		...J,
		total_pages: q
	}),
	report_page_view: V({
		...J,
		page_number: q
	}),
	report_read_time: V({
		...J,
		page_number: q,
		read_time_seconds: rt
	}),
	report_progress: V({
		...J,
		progress_percent: $e([
			H(25),
			H(50),
			H(75),
			H(100)
		])
	}),
	report_link_click: V({
		...J,
		page_number: q,
		destination_type: U([
			"internal",
			"external",
			"email"
		]),
		link_domain: G.optional()
	}),
	comparison_change: V({
		view: K,
		metric: U([
			"vc",
			"func",
			"cheque",
			"velocity"
		]),
		aggregation: U([
			"soma",
			"media",
			"mediana",
			"lider"
		]),
		ai_filter: U([
			"todas",
			"native",
			"powered"
		]),
		top_n: B().int().min(0).max(100),
		founded_years: B().int().min(0).max(6),
		round_years: B().int().min(0).max(6)
	}),
	chart_config_change: ot,
	chart_preset_select: V({ preset_id: G }),
	chart_drill: V({
		exploration_mode: U(["guided", "builder"]),
		dimension: K,
		drill_depth: B().int().min(0).max(8)
	}),
	chart_reset: V({ exploration_mode: U(["guided", "builder"]) }),
	report_engaged: V({ ...J }),
	database_engaged: V({}),
	research_engaged: V({ content_type: U(["report", "database"]) }),
	research_error: V({ error_code: U([
		"report_metadata",
		"report_file",
		"report_render",
		"gate_save",
		"analytics_session"
	]) }),
	contact_click: V({
		method: U(["email", "pitch_form"]),
		link_location: G
	}),
	outbound_click: V({
		link_domain: G,
		link_location: G
	}),
	scroll_depth: V({ progress_percent: H(90) })
};
function ct(e, t) {
	if (!Object.hasOwn(st, e)) return null;
	let n = st[e].strict().safeParse(t);
	return n.success ? n.data : null;
}
U([.../* @__PURE__ */ new Set([
	"visit",
	"gate_submit",
	"choice",
	"database_tab_viewed",
	"report_chart_opened",
	"report_page_viewed",
	"report_link_clicked",
	"chart_config_used",
	"chart_drill",
	"comparison_drill",
	...Object.keys(st)
])]).options;
var Y = {
	referrer: z().max(500).optional(),
	device: U(["Mobile", "Desktop"]).optional(),
	browser: z().max(500).optional()
}, lt = Qe(V({
	dim: K,
	value: G.optional(),
	grupo: G.optional()
}).strict()).max(8);
V({
	...Y,
	exploration_mode: H("guided"),
	dimension: K,
	drill_depth: B().int().min(0).max(8)
}), V(Y), V({
	...Y,
	marketing_opt_in: Ze().optional()
}), V({
	...Y,
	destination: U(["report", "database"])
}), V({
	...Y,
	tab: U(["guided", "builder"])
}), V({
	...Y,
	page: q,
	preset: G.optional(),
	href: z().max(500).optional()
}), V({
	...Y,
	page: q,
	seconds: rt,
	version: z().max(200),
	report_id: z().max(100).nullish(),
	total_pages: q.optional()
}), V({
	...Y,
	page: q,
	href: z().max(500),
	version: z().max(200).optional(),
	report_id: z().max(100).optional()
}), V({
	...Y,
	xAxis: K,
	metric: nt,
	breakdown: G,
	aiFilter: U([
		"all",
		"native",
		"enabled"
	]),
	period: U([
		"all",
		"2024",
		"2025",
		"2026"
	]),
	compare: Ze(),
	secondMetric: nt,
	chartType: G
}), V({
	...Y,
	path: lt
});
function X(e) {
	let t = e.split(/[?#]/, 1)[0]?.replace(/\/+$/, "") || "/";
	return [
		"/",
		"/pt",
		"/es",
		"/ai-research",
		"/ai-research/report",
		"/ai-research/database",
		"/ai-research/privacy"
	].includes(t) ? t === "/ai-research" || t === "/pt" || t === "/es" ? `${t}/` : t : null;
}
function ut(e) {
	try {
		let t = new URL(e);
		return /^https?:$/.test(t.protocol) ? t.origin : "";
	} catch {
		return "";
	}
}
function dt(e, t) {
	if (e.startsWith("mailto:")) return {
		destination_type: "email",
		href: "mailto:"
	};
	try {
		let n = new URL(e, t);
		return /^https?:$/.test(n.protocol) ? {
			destination_type: n.origin === t ? "internal" : "external",
			link_domain: n.hostname,
			href: n.origin + (X(n.pathname) ?? "/")
		} : {
			destination_type: "internal",
			href: "#"
		};
	} catch {
		return {
			destination_type: "internal",
			href: "#"
		};
	}
}
function ft(e) {
	let t = new URLSearchParams(e), n = {};
	for (let e of [
		"utm_source",
		"utm_medium",
		"utm_campaign",
		"utm_content",
		"utm_term"
	]) {
		let r = t.get(e);
		r && /^[a-zA-Z0-9_-]{1,100}$/.test(r) && (n[e] = r);
	}
	return n;
}
//#endregion
//#region src/lib/analytics.ts
var pt = class {
	last;
	lastInput;
	total = 0;
	constructor(e) {
		this.last = e, this.lastInput = e;
	}
	input(e) {
		this.lastInput = e;
	}
	tick(e, t) {
		t && (this.total += Math.max(0, Math.min(e, this.lastInput + 6e4) - this.last)), this.last = e;
	}
	take() {
		let e = this.total / 1e3;
		return this.total = 0, e;
	}
};
function mt(e, t = Date.now()) {
	try {
		let n = tt.safeParse(JSON.parse(e.getItem("hl-analytics-consent-v2") ?? "null"));
		if (n.success && n.data.updatedAt <= t && n.data.expiresAt > t && n.data.expiresAt - n.data.updatedAt <= 15552e6) return n.data;
		if (e.getItem("hl-consent") === "denied") return {
			version: "2",
			choice: "denied",
			updatedAt: t,
			expiresAt: t + 15552e6
		};
	} catch {}
	return null;
}
var ht = class {
	win;
	listeners = /* @__PURE__ */ new Set();
	deliveryListeners = /* @__PURE__ */ new Set();
	preference = null;
	loaded = !1;
	started = !1;
	excluded = !1;
	internal = !1;
	page = null;
	lastPage = "";
	previousLocation = "";
	onceKeys = /* @__PURE__ */ new Set();
	sessionReady = Promise.resolve(!1);
	sessionGeneration = 0;
	reportTimes = /* @__PURE__ */ new Map();
	reportSeconds = /* @__PURE__ */ new Map();
	databaseSeconds = 0;
	databaseActions = 0;
	lastDatabaseAction = 0;
	pending = [];
	campaign = {};
	clocks = /* @__PURE__ */ new Set();
	lastInput = Date.now();
	constructor(e) {
		this.win = e;
		try {
			this.preference = mt(e.localStorage);
		} catch {}
	}
	subscribe = (e) => (this.listeners.add(e), () => {
		this.listeners.delete(e);
	});
	onDelivery(e) {
		return this.deliveryListeners.add(e), () => {
			this.deliveryListeners.delete(e);
		};
	}
	status = () => this.preference?.expiresAt && this.preference.expiresAt > Date.now() ? this.preference.choice : "unknown";
	allowed = () => !this.excluded && !this.internal && this.status() === "granted";
	ready = () => this.sessionReady;
	notify() {
		for (let e of this.listeners) e();
	}
	gtag(...e) {
		this.win.dataLayer ??= [], this.win.gtag ??= (...e) => {
			this.win.dataLayer.push(e);
		}, this.win.gtag(...e);
	}
	start() {
		if (this.started) return;
		this.started = !0;
		let e = () => {
			this.lastInput = performance.now();
			for (let e of this.clocks) e.input(this.lastInput);
		};
		for (let t of [
			"pointerdown",
			"keydown",
			"scroll",
			"touchstart"
		]) this.win.addEventListener(t, e, { passive: !0 });
		this.win.addEventListener("storage", (e) => {
			if (e.key === "hl-analytics-consent-v2" || e.key === "hl-consent" || e.key === null) {
				try {
					this.preference = mt(this.win.localStorage);
				} catch {
					this.preference = null;
				}
				this.applyConsent(), this.notify();
			}
		}), this.win.document.addEventListener("visibilitychange", () => {
			for (let e of this.clocks) e.tick(performance.now(), !1);
			this.status() === "unknown" && this.preference && (this.preference = null, this.applyConsent(), this.notify());
		}), this.win.setInterval(() => {
			this.preference && this.status() === "unknown" && (this.preference = null, this.applyConsent(), this.notify());
		}, 6e4), this.applyConsent();
	}
	async choose(e) {
		let t = this.preference, n = Date.now();
		this.preference = {
			version: "2",
			choice: e,
			updatedAt: n,
			expiresAt: n + 15552e6
		};
		let r = await this.applyConsent();
		if (e === "granted" && !r) throw this.preference = t, this.pending = [], this.win[`ga-disable-${W}`] = !this.allowed(), this.notify(), Error("Unable to save analytics preferences. Please try again.");
		try {
			this.win.localStorage.setItem(et, JSON.stringify(this.preference)), this.win.localStorage.removeItem("hl-consent");
		} catch {}
		this.notify();
	}
	async applyConsent() {
		let e = ++this.sessionGeneration, t = this.allowed();
		this.win[`ga-disable-${W}`] = !t, t || (this.lastPage = "", this.pending = [], this.reportTimes.clear(), this.reportSeconds.clear(), this.databaseSeconds = 0, this.databaseActions = 0, this.loaded && this.gtag("consent", "update", {
			analytics_storage: "denied",
			ad_storage: "denied",
			ad_user_data: "denied",
			ad_personalization: "denied"
		}), this.clearCookies());
		let n = this.win.fetch("/ai-research/api/v1/analytics/consent", {
			method: "POST",
			credentials: "same-origin",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				version: "2",
				choice: this.status() === "granted" ? "granted" : "denied"
			})
		}).then(async (e) => {
			if (!e.ok) return !1;
			let t = await e.json();
			return t.saved !== !0 || typeof t.internal != "boolean" ? !1 : (this.internal = t.internal, this.internal && (this.pending = []), this.win[`ga-disable-${W}`] = !this.allowed(), !0);
		}).catch(() => !1);
		this.sessionReady = n;
		let r = await n;
		if (e !== this.sessionGeneration || !this.allowed() || !r) return r;
		this.campaign = ft(this.win.location.search), this.load(), this.sendPage();
		for (let e of this.pending.splice(0)) this.gtag("event", e.event, {
			...this.context(),
			...e.params,
			send_to: W
		});
		return !0;
	}
	clearCookies() {
		for (let e of this.win.document.cookie.split(";")) {
			let t = e.split("=", 1)[0]?.trim() ?? "";
			if (/^_ga(?:_|$)|^_gid$|^_gat/.test(t)) for (let e of [
				"",
				`; Domain=${this.win.location.hostname}`,
				"; Domain=.headlinelatam.com"
			]) for (let n of [
				"/",
				"/ai-research",
				"/ai-research/"
			]) this.win.document.cookie = `${t}=; Max-Age=0; Path=${n}${e}; SameSite=Lax`;
		}
	}
	load() {
		if (this.loaded) {
			this.gtag("consent", "update", {
				analytics_storage: "granted",
				ad_storage: "denied",
				ad_user_data: "denied",
				ad_personalization: "denied"
			});
			return;
		}
		if (this.loaded = !0, this.gtag("consent", "default", {
			analytics_storage: "denied",
			ad_storage: "denied",
			ad_user_data: "denied",
			ad_personalization: "denied"
		}), this.gtag("consent", "update", {
			analytics_storage: "granted",
			ad_storage: "denied",
			ad_user_data: "denied",
			ad_personalization: "denied"
		}), this.gtag("js", /* @__PURE__ */ new Date()), this.gtag("set", {
			page_location: `https://headlinelatam.com${X(this.win.location.pathname) ?? "/"}`,
			page_referrer: ut(this.win.document.referrer)
		}), this.gtag("config", W, {
			send_page_view: !1,
			allow_google_signals: !1,
			allow_ad_personalization_signals: !1,
			cookie_domain: "headlinelatam.com",
			cookie_path: "/",
			cookie_expires: 15552e3,
			cookie_update: !1,
			cookie_flags: "SameSite=Lax;Secure"
		}), this.win.location.hostname !== "headlinelatam.com") return;
		let e = this.win.document.createElement("script");
		e.async = !0, e.id = "headline-google-analytics", e.src = `https://www.googletagmanager.com/gtag/js?id=${W}`, this.win.document.head.append(e);
	}
	setExcluded(e) {
		e !== this.excluded && (this.excluded = e, this.applyConsent());
	}
	view(e) {
		this.page = e && X(e.path) ? e : null, this.sendPage();
	}
	context() {
		let e = this.page;
		return e ? {
			site_area: e.area,
			research_view: e.view,
			ui_language: e.language,
			content_group: e.language,
			instrumentation_version: "2",
			page_location: `https://headlinelatam.com${X(e.path)}`,
			page_title: e.title
		} : null;
	}
	sendPage() {
		if (!this.loaded || !this.allowed() || !this.page) return;
		let e = `${this.page.path}:${this.page.view}`;
		if (e === this.lastPage) return;
		let t = this.context(), n = {};
		for (let [e, t] of Object.entries({
			utm_source: "campaign_source",
			utm_medium: "campaign_medium",
			utm_campaign: "campaign_name",
			utm_content: "campaign_content",
			utm_term: "campaign_term"
		})) this.campaign[e] && (n[t] = this.campaign[e]);
		this.gtag("set", {
			...t,
			page_referrer: this.previousLocation || ut(this.win.document.referrer)
		}), this.gtag("event", "page_view", {
			...t,
			...n,
			page_referrer: this.previousLocation || ut(this.win.document.referrer),
			send_to: W
		}), this.previousLocation = String(t?.page_location ?? ""), this.lastPage = e, this.page.view === "gate" && this.track("research_gate_view", {}, "gate_view");
	}
	once(e) {
		if (!this.allowed() || this.onceKeys.has(e)) return !1;
		try {
			if (this.win.sessionStorage.getItem(`hl.analytics.once.${e}`)) return !1;
			this.win.sessionStorage.setItem(`hl.analytics.once.${e}`, "1");
		} catch {}
		return this.onceKeys.add(e), !0;
	}
	track(e, t, n) {
		let r = ct(e, t);
		if (!(!this.allowed() || !r || !this.page || n && !this.once(n))) {
			this.loaded ? this.gtag("event", e, {
				...this.context(),
				...e.startsWith("report_") ? {
					research_view: "report",
					page_location: "https://headlinelatam.com/ai-research/report"
				} : {},
				...r,
				send_to: W
			}) : this.pending.length < 20 && this.pending.push({
				event: e,
				params: r
			});
			for (let t of this.deliveryListeners) t({
				event: e,
				params: r
			});
			if (e === "comparison_change" || e === "chart_config_change" || e === "chart_drill") {
				let e = Date.now();
				e - this.lastDatabaseAction >= 750 && (this.databaseActions += 1), this.lastDatabaseAction = e, this.checkDatabase();
			}
		}
	}
	createClock() {
		let e = new pt(performance.now());
		return e.input(performance.now()), this.clocks.add(e), {
			take: () => (e.tick(performance.now(), this.allowed() && this.win.document.visibilityState === "visible"), e.take()),
			dispose: () => {
				this.clocks.delete(e);
			}
		};
	}
	databaseTime(e) {
		this.allowed() && (this.databaseSeconds += e, this.checkDatabase());
	}
	checkDatabase() {
		this.databaseSeconds < 30 || this.databaseActions < 2 || (this.track("database_engaged", {}, "database_engaged"), this.track("research_engaged", { content_type: "database" }, "research_engaged"));
	}
	reportTime(e, t, n, r, i) {
		if (!this.allowed() || r <= 0) return;
		let a = /^[a-zA-Z0-9_ .+%()–—:/-]{1,100}$/.test(e) ? e : "published_report", o = t || a, s = this.reportTimes.get(o) ?? /* @__PURE__ */ new Map();
		s.set(n, (s.get(n) ?? 0) + r), this.reportTimes.set(o, s);
		let c = (this.reportSeconds.get(o) ?? 0) + r;
		this.reportSeconds.set(o, c), this.track("report_read_time", {
			...it(a, t),
			page_number: n,
			read_time_seconds: Math.round(r * 10) / 10
		}), (s.get(n) ?? 0) >= 2 && this.track("report_page_view", {
			...it(a, t),
			page_number: n
		}, `report_page:${o}:${n}`);
		let l = [...s.values()].filter((e) => e >= 2).length;
		for (let e of [
			25,
			50,
			75,
			100
		]) i > 0 && l / i * 100 >= e && this.track("report_progress", {
			...it(a, t),
			progress_percent: e
		}, `report_progress:${o}:${e}`);
		c >= 60 && l >= 3 && (this.track("report_engaged", it(a, t), `report_engaged:${o}`), this.track("research_engaged", { content_type: "report" }, "research_engaged"));
	}
};
function gt() {
	if (typeof window > "u") throw Error("Analytics is browser-only");
	return window.headlineAnalytics ??= new ht(window);
}
function _t(e, t, n) {
	typeof window < "u" && gt().track(e, t, n);
}
//#endregion
//#region src/lib/institutional-analytics.ts
var vt = {
	en: {
		title: "Analytics preferences",
		text: "With your permission, we use Google Analytics to understand visits and improve Headline's website and research. Analytics is optional. Your name and email are never sent to Google. Advertising is disabled. Your choice lasts 180 days.",
		accept: "Accept analytics",
		decline: "Decline analytics",
		preferences: "Privacy preferences",
		privacy: "Privacy notice",
		close: "Close",
		error: "Preferences could not be saved. Please try again."
	},
	pt: {
		title: "Preferências de analytics",
		text: "Com sua permissão, usamos Google Analytics para entender as visitas e melhorar o site e a pesquisa da Headline. Analytics é opcional. Seu nome e e-mail nunca são enviados ao Google. Publicidade desativada. Sua escolha vale por 180 dias.",
		accept: "Aceitar analytics",
		decline: "Recusar analytics",
		preferences: "Preferências de privacidade",
		privacy: "Aviso de privacidade",
		close: "Fechar",
		error: "Não foi possível salvar as preferências. Tente novamente."
	},
	es: {
		title: "Preferencias de analytics",
		text: "Con tu permiso, usamos Google Analytics para entender las visitas y mejorar el sitio y la investigación de Headline. Analytics es opcional. Tu nombre y correo nunca se envían a Google. La publicidad está desactivada. Tu elección dura 180 días.",
		accept: "Aceptar analytics",
		decline: "Rechazar analytics",
		preferences: "Preferencias de privacidad",
		privacy: "Aviso de privacidad",
		close: "Cerrar",
		error: "No se pudieron guardar las preferencias. Inténtalo de nuevo."
	}
}, yt = location.pathname.startsWith("/pt") ? "pt" : location.pathname.startsWith("/es") ? "es" : "en", Z = vt[yt], Q = gt(), bt = X(location.pathname);
bt && Q.view({
	path: bt,
	view: "institutional",
	title: document.title,
	area: "institutional",
	language: yt
}), Q.start();
var $ = document.getElementById("consent");
if ($) {
	$.replaceChildren(), $.setAttribute("role", "region"), $.setAttribute("aria-label", Z.title);
	let e = document.createElement("p");
	e.textContent = `${Z.text} `;
	let t = document.createElement("a");
	t.href = yt === "pt" ? "/ai-research/privacy?lang=pt" : "/ai-research/privacy", t.textContent = Z.privacy, t.target = "_blank", t.rel = "noopener", e.append(t);
	let n = document.createElement("p");
	n.setAttribute("role", "alert"), n.hidden = !0;
	let r = document.createElement("div");
	r.className = "acts";
	let i = document.createElement("button");
	i.type = "button", i.textContent = Z.decline;
	let a = document.createElement("button");
	a.type = "button", a.textContent = Z.accept, a.className = "ok";
	let o = document.createElement("button");
	o.type = "button", o.textContent = Z.close, o.addEventListener("click", () => {
		$.hidden = !0;
	});
	let s = () => {
		$.hidden = Q.status() !== "unknown", o.hidden = Q.status() === "unknown";
	}, c = async (e) => {
		a.disabled = i.disabled = !0, n.hidden = !0;
		try {
			await Q.choose(e), s();
		} catch {
			n.textContent = Z.error, n.hidden = !1;
		} finally {
			a.disabled = i.disabled = !1;
		}
	};
	i.addEventListener("click", () => {
		c("denied");
	}), a.addEventListener("click", () => {
		c("granted");
	}), r.append(i, a, o), $.append(e, n, r);
	let l = document.createElement("button");
	l.type = "button", l.textContent = Z.preferences, l.style.cssText = "position:fixed;bottom:8px;left:12px;z-index:90;padding:5px 10px;border:1px solid #d9d9cc;border-radius:5px;background:#faf8f2;color:#333;font:12px sans-serif;cursor:pointer", l.addEventListener("click", () => {
		$.hidden = !1, o.hidden = Q.status() === "unknown";
	}), document.body.append(l), Q.subscribe(s), s();
}
document.addEventListener("click", (e) => {
	let t = e.target;
	if (!(t instanceof Element)) return;
	let n = t.closest("a[href]");
	if (!n) return;
	let r = n.closest("section")?.id || "footer";
	if (n.protocol === "mailto:" || n.hostname === "forms.headline.com" && n.pathname === "/intros-and-ideas") {
		_t("contact_click", {
			method: n.protocol === "mailto:" ? "email" : "pitch_form",
			link_location: r
		});
		return;
	}
	let i = dt(n.href, window.location.origin);
	i.destination_type === "external" && "link_domain" in i && _t("outbound_click", {
		link_domain: i.link_domain,
		link_location: r
	});
}), document.addEventListener("scroll", () => {
	let e = document.documentElement.scrollHeight - window.innerHeight;
	e > 0 && window.scrollY / e >= .9 && _t("scroll_depth", { progress_percent: 90 }, `scroll:${bt}`);
}, { passive: !0 });
//#endregion
