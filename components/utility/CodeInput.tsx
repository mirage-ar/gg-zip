"use client";
import React, { useEffect, useState } from "react";

import styles from "./CodeInput.module.css";
import { on } from "events";

interface CodeInputProps {
  onSubmit: (code: string) => void;
  getCode: string | null;
}

const CodeInput: React.FC<CodeInputProps> = ({ onSubmit, getCode }) => {
  const [inputValues, setInputValues] = useState(Array(5).fill(""));

  useEffect(() => {
    if (getCode) {
      setInputValues(Array.from(getCode));
    }
  }, [getCode]);

  const handleChange = (index: number, value: string) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value.slice(0, 1).replace(/[^a-zA-Z0-9]/g, "");
    setInputValues(newInputValues);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .slice(0, 5)
      .replace(/[^a-zA-Z0-9]/g, "");
    const newInputValues = [...inputValues];

    // Distribute the pasted content to the input boxes
    Array.from(pasteData).forEach((char, i) => {
      if (i < newInputValues.length) {
        newInputValues[i] = char;
      }
    });

    setInputValues(newInputValues);

    // Focus the next input after the last character of the pasted data
    const nextIndex = pasteData.length < newInputValues.length ? pasteData.length : newInputValues.length - 1;
    const nextInput = document.querySelector(`input[name='input-${nextIndex}']`) as HTMLElement;
    nextInput?.focus();
  };

  const handleKeyUp = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key.match(/^[a-zA-Z0-9]$/)) {
      const nextSibling = document.querySelector(`input[name='input-${index + 1}']`) as HTMLElement;
      nextSibling?.focus();
    } else if (e.key === "Backspace" && !inputValues[index]) {
      const prevSibling = document.querySelector(`input[name='input-${index - 1}']`) as HTMLElement;
      prevSibling?.focus();
    }
  };

  const handleSubmit = () => {
    const input = inputValues.join("");
    if (input.length !== 5) {
      setInputValues(Array(5).fill(""));
      return;
    }

    // input is valid
    onSubmit(inputValues.join("").toUpperCase());
  };

  return (
    <div className={styles.inputContainer}>
      {inputValues.map((value, index) => (
        <input
          key={index}
          className={styles.numberInput}
          type="text"
          //   inputMode="verbatim"
          maxLength={1}
          value={value}
          placeholder="_"
          onPaste={handlePaste}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyUp={(e) => handleKeyUp(index, e)}
          name={`input-${index}`}
        />
      ))}
      <button className={styles.submitButton} onClick={handleSubmit}>
        Enter
      </button>
    </div>
  );
};

export default CodeInput;
