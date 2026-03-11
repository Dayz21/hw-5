export const parseNumberParam = (value: string | null): number | null => {
    if (!value) return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : null;
};

export const toInputString = (value: number | null) => (value == null ? "" : String(value));

export const clampNumber = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

export const sanitizeIntInput = (value: string) => value.replace(/[^\d]/g, "");

export const sanitizeFloatInput = (value: string) => {
    const normalized = value.replace(/,/g, ".").replace(/[^\d.]/g, "");
    const [head, ...rest] = normalized.split(".");
    if (rest.length === 0) return head;
    return `${head}.${rest.join("")}`;
};

export const clampIntString = (value: string, min: number, max: number) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    const n = Number(trimmed);
    if (!Number.isFinite(n)) return "";
    return String(clampNumber(Math.trunc(n), min, max));
};

export const clampFloatString = (value: string, min: number, max: number) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    const n = Number(trimmed);
    if (!Number.isFinite(n)) return "";
    return String(clampNumber(n, min, max));
};
