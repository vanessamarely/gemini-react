import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Loading from "../Loading/Loading";

import "./Story.css";

import { MODEL_NAME, API_KEY } from "../../utils/settings";

const Story = () => {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const [image, setImage] = useState("");
  const [imageInineData, setImageInlineData] = useState("");
  const [aiResponse, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    aiImageRun();
  };

  const getBase64 = (file: any) =>
    new Promise(function (resolve, reject) {
      let reader = new FileReader();
      reader.readAsDataURL(file as any);
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject("Error");
    });

  const fileToGenerativePart = async (file: any) => {
    const base64EncodedDataPromise = new Promise((resolve: any) => {
      const reader: any = new FileReader();

      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(file as any);
    });

    return {
      inlineData: {
        data: await base64EncodedDataPromise,
        mimeType: file?.type,
      },
    };
  };

  const handleImageChange = (e: any) => {
    const file = e.target?.files[0];

    // getting base64 from file to render in DOM
    getBase64(file)
      .then((result) => {
        setImage(result as any);
      })
      .catch((e) => console.log(e));

    // generating content model for Gemini Google AI
    fileToGenerativePart(file).then((image) => {
      setImageInlineData(image as any);
    });
  };

  /**
   * Generative AI Call to fetch image insights
   */
  const aiImageRun = async () => {
    setLoading(true);
    setResponse("");

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent([
      "What's in this photo?",
      imageInineData,
    ]);
    const response = await result.response;
    const text = response.text();

    setResponse(text);
    setLoading(false);
  };

  return (
    <>
      {loading == true && aiResponse == "" ? (
        <Loading />
      ) : (
        <div style={{ margin: "30px 0" }}>
          <p>{aiResponse}</p>
        </div>
      )}
      <div>
        <div style={{ display: "flex" }}>
          <input type="file" onChange={(e) => handleImageChange(e)} />
          <button
            className="button"
            style={{ marginLeft: "20px" }}
            onClick={() => handleClick()}
          >
            Search
          </button>
        </div>
        <img src={image} style={{ width: "30%", marginTop: 30 }} />
      </div>
    </>
  );
};

export default Story;
