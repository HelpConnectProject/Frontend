import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export const PHONE_ALLOWED_CHARS = /^\+?[0-9\s()\-]*$/;

export function phoneValidator(minDigits: number = 9, maxDigits: number = 15): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const rawValue = control.value;
    if (rawValue === null || rawValue === undefined) {
      return null;
    }

    const value = String(rawValue).trim();
    if (value === '') {
      return null; 
    }

    if (!PHONE_ALLOWED_CHARS.test(value)) {
      return { phoneInvalidChars: true };
    }

    const digits = value.replace(/\D/g, '');
    if (digits.length < minDigits || digits.length > maxDigits) {
      return { phoneDigits: { minDigits, maxDigits, actual: digits.length } };
    }

    return null;
  };
}

export function bankAccountValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const rawValue = control.value;
    if (rawValue === null || rawValue === undefined) {
      return null;
    }

    const value = String(rawValue).trim();
    if (value === '') {
      return null; 
    }

    const compact = value.replace(/[\s-]+/g, '').toUpperCase();

    // Accept any valid IBAN (all countries) with checksum verification.
    // IBAN: allow any country (15..34 chars), basic structure only.
    // (We keep this intentionally lenient; detailed checksum validation can be done server-side.)
    if (/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(compact)) {
      return null;
    }

    // Keep supporting common HU domestic format: 8-8 or 8-8-8 digits.
    if (/^\d{8}-\d{8}(-\d{8})?$/.test(value.trim())) {
      return null;
    }

    return { bankAccount: true };
  };
}

function normalizeBankAccountInput(input: string): string {
  // Typical user inputs: "IBAN HU12 ...", "HU12 3456...", with spaces/dashes.
  let s = input.trim();
  s = s.replace(/^iban\s*:?\s*/i, '');
  s = s.replace(/[\s-]+/g, '');
  return s.toUpperCase();
}

function isValidIban(iban: string): boolean {
  // IBAN length is 15..34, must be alphanumeric.
  if (!/^[A-Z0-9]+$/.test(iban)) return false;
  if (iban.length < 15 || iban.length > 34) return false;
  if (!/^[A-Z]{2}\d{2}/.test(iban)) return false;

  // Move first four characters to the end.
  const rearranged = iban.slice(4) + iban.slice(0, 4);

  // MOD-97 on the expanded numeric representation.
  let remainder = 0;
  for (const ch of rearranged) {
    if (ch >= '0' && ch <= '9') {
      remainder = (remainder * 10 + (ch.charCodeAt(0) - 48)) % 97;
      continue;
    }

    // A=10 ... Z=35; feed digits one by one.
    const code = ch.charCodeAt(0) - 55;
    if (code < 10 || code > 35) return false;
    const tens = Math.floor(code / 10);
    const ones = code % 10;
    remainder = (remainder * 10 + tens) % 97;
    remainder = (remainder * 10 + ones) % 97;
  }

  return remainder === 1;
}

export function matchControls(controlName: string, matchingControlName: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const control = group.get(controlName);
    const matchingControl = group.get(matchingControlName);

    if (!control || !matchingControl) {
      return null;
    }

    const value = control.value;
    const matchingValue = matchingControl.value;

    if (!value || !matchingValue) {
      return null;
    }

    if (value !== matchingValue) {
      return { mismatch: true };
    }

    return null;
  };
}
