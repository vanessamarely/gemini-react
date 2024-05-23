import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Loading from "../Loading/Loading";
import "./TextPrompt.css";

import { MODEL_NAME, API_KEY } from "../../utils/settings";

const TextPrompt = () => {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = async (
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setLoading(true);
    const result = await model.generateContent(input);
    const response = await result.response;

    setOutput(response.text());
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <form>
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Enter your prompt here..."
          />

          <button
            className="chat-form-button"
            type="submit"
            onClick={handleSubmit}
          >
            Generar
          </button>
          <div className="response">{output && <p>{output}</p>}</div>
        </form>
      )}
    </>
  );
};

export default TextPrompt;
