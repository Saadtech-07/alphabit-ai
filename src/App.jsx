import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import mammoth from "mammoth";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [fileText, setFileText] = useState("");

  const fetchAndExtractText = async (url) => {
    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      const arrayBuffer = response.data;
      const result = await mammoth.extractRawText({ arrayBuffer });
      setFileText(result.value);
    } catch (error) {
      console.error("Error fetching or extracting text from the DOCX file:", error);
      setAnswer("Error extracting text from the file.");
    }
  };

  const generateAnswer = async (e) => {
    e.preventDefault();
    setGeneratingAnswer(true);
    setAnswer("Loading your answer... \n It might take up to 10 seconds");

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAddhSsaXdqU5EwzN9Nx50ACGy8T6jjdI4`,
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          contents: [{ parts: [{ text: fileText || question }] }],
        },
      });

      setAnswer(response.data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.error("Error generating answer:", error);
      setAnswer("Sorry - Something went wrong. Please try again!");
    }

    setGeneratingAnswer(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      generateAnswer(e);
    }
  };

  const clearChat = () => {
    setQuestion("");
    setAnswer("");
    setFileText("");
  };

  // Updated URL of the Word document
  const docUrl = "https://cahcetp.s3.ap-south-1.amazonaws.com/alphabit+ai.docx";

  // Fetch and extract text when the component mounts
  useEffect(() => {
    fetchAndExtractText(docUrl);
  }, [docUrl]);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 h-screen p-3 flex flex-col justify-center items-center">
      <form
        onSubmit={generateAnswer}
        className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 text-center rounded-lg shadow-lg bg-white py-6 px-4 transition-all duration-500 transform hover:scale-105"
      >
        <textarea
          required
          className="border border-gray-300 rounded w-full h-48 p-3 transition-all duration-300 focus:border-blue-400 focus:shadow-lg"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask anything"
        ></textarea>
        <button
          type="submit"
          className={`bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition-all duration-300 ${
            generatingAnswer ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={generatingAnswer}
        >
          Generate answer
        </button>
        <button
          type="button"
          className="bg-red-500 text-white p-3 rounded-md hover:bg-red-600 transition-all duration-300 ml-2"
          onClick={clearChat}
        >
          Clear
        </button>
      </form>
      <div className="w-full md:w-2/3 lg:w-full xl:w-1/3 text-center rounded-lg bg-white my-4 shadow-lg transition-all duration-500 transform hover:scale-105">
        <ReactMarkdown className="p-4">{answer}</ReactMarkdown>
      </div>
    </div>
  );
}

export default App;
