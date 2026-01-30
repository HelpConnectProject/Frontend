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

    const compact = value.replace(/\s+/g, '').toUpperCase();

  
    if (/^HU\d{26}$/.test(compact)) {
      return null;
    }


    if (/^\d{8}-\d{8}(-\d{8})?$/.test(compact)) {
      return null;
    }

    return { bankAccount: true };
  };
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
