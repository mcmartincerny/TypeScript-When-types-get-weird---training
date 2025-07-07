import React, { useState } from "react";

// ADVANCED: CONDITIONAL TYPES IN REACT
// -----------------------------------

//! PROBLEM: Input components where onChange type depends on input type prop
// Traditional approach uses generic props with optional fields:
// - Loses type safety (e.g., text inputs might receive number handlers)
// - No autocomplete for type-specific props
// - Runtime errors when accessing props that don't exist for a specific type

//! SOLUTION: Using discriminated unions and conditional types

// Common props shared by all input types
type CommonProps = {
  disabled?: boolean;
};

// Text input - returns string values
type TextInputProps = CommonProps & {
  type: "text";
  value: string;
  onChange: (value: string) => void;
  innerInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

// Number input - returns number values
type NumberInputProps = CommonProps & {
  type: "number";
  value: number;
  onChange: (value: number) => void;
  innerInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

// Checkbox input - returns boolean values
type CheckboxInputProps = CommonProps & {
  type: "checkbox";
  checked: boolean;
  onChange: (value: boolean) => void;
  text?: string;
  innerInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

// Button input - triggers an action without returning a value
type ButtonInputProps = CommonProps & {
  type: "button";
  onPressed: () => void;
  text: string;
  innerInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

// Select input - returns values of a specific type
// Generic T allows for type-safe option values
type SelectInputProps<T extends string> = CommonProps & {
  type: "select";
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
  innerInputProps?: React.SelectHTMLAttributes<HTMLSelectElement>;
};

// Union type combining all possible input types
// Note: We use T extends string = string to make SelectInputProps work in the union
type InputProps =
  | TextInputProps
  | NumberInputProps
  | CheckboxInputProps
  | ButtonInputProps
  | SelectInputProps<string>;

// The Input component uses the type field to determine:
// 1. Which props are required
// 2. What type of value to handle
// 3. What HTML element to render
export function Input(props: InputProps) {
  const { disabled } = props;

  switch (props.type) {
    case "text":
      return (
        <input
          {...props.innerInputProps}
          type="text"
          value={props.value}
          disabled={disabled}
          onChange={(e) => props.onChange(e.target.value)}
        />
      );

    case "number":
      return (
        <input
          {...props.innerInputProps}
          type="number"
          value={props.value}
          disabled={disabled}
          onChange={(e) => props.onChange(Number(e.target.value))}
        />
      );

    case "checkbox":
      return (
        <label>
          <input
            {...props.innerInputProps}
            type="checkbox"
            checked={props.checked}
            disabled={disabled}
            onChange={(e) => props.onChange(e.target.checked)}
          />
          {props.text}
        </label>
      );

    case "button":
      return (
        <input
          {...props.innerInputProps}
          type="button"
          value={props.text}
          onClick={props.onPressed}
          disabled={disabled}
        />
      );
      
    case "select":
      return (
        <select
          {...props.innerInputProps}
          value={props.value}
          disabled={disabled}
          onChange={(e) => props.onChange(e.target.value as any)}
        >
          {props.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
  }
}

//! Usage Examples

const App = () => {
  const [text, setText] = useState("");
  const [number, setNumber] = useState(0);
  const [checked, setChecked] = useState(false);
  
  // Type-safe select with specific options
  type ColorOption = "red" | "green" | "blue";
  const [color, setColor] = useState<ColorOption>("red");

  const handleSubmit = () => {
    alert(`Text: ${text}, Number: ${number}, Checked: ${checked}, Color: ${color}`);
  };

  return (
    <>
      {/* Text input with string value and onChange */}
      <Input
        type="text"
        value={text}
        onChange={(v) => setText(v)}
        innerInputProps={{ placeholder: "Enter text" }}
      />

      {/* Number input with number value and onChange */}
      <Input
        type="number"
        value={number}
        onChange={(v) => setNumber(v)}
        disabled
        innerInputProps={{ placeholder: "Enter number" }}
      />

      {/* Checkbox with boolean checked and onChange */}
      <Input
        type="checkbox"
        checked={checked}
        onChange={(v) => setChecked(v)}
        text="Accept terms"
      />

      {/* Button with action callback */}
      <Input type="button" text="Submit" onPressed={handleSubmit} disabled />
      
      {/* Select with type-safe options */}
      <Input
        type="select"
        value={color}
        options={[
          { value: "red", label: "Red" },
          { value: "green", label: "Green" },
          { value: "blue", label: "Blue" },
        ]}
        onChange={(v) => setColor(v as ColorOption)}
      />
    </>
  );
};

// Benefits of this approach:
// 1. TypeScript enforces the correct props based on the type prop
// 2. onChange handler has the correct parameter type for each input type
// 3. No need for type assertions or checks in consuming code
// 4. Autocomplete works correctly for each input type
// 5. Impossible to provide incompatible props (like checked for text inputs)
