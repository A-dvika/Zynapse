// // src/app/chat/page.tsx
// "use client";

// import React, { useState } from "react";

// const ChatPage: React.FC = () => {
//   const [question, setQuestion] = useState("");
//   const [answer, setAnswer] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setAnswer("");
//     try {
//       const response = await fetch("/api/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ question }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setAnswer(data.answer);
//       } else {
//         setError(data.error || "Something went wrong");
//       }
//     } catch (err) {
//       setError("An error occurred while contacting the API.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
//       <h1>Chatbot Test</h1>
//       <form onSubmit={handleSubmit}>
//         <textarea
//           rows={4}
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           placeholder="Type your question here..."
//           style={{ width: "100%", marginBottom: "10px" }}
//         />
//         <button type="submit" disabled={loading}>
//           {loading ? "Loading..." : "Ask"}
//         </button>
//       </form>
//       {error && <p style={{ color: "red" }}>Error: {error}</p>}
//       {answer && (
//         <div
//           style={{
//             marginTop: "20px",
//             padding: "10px",
//             border: "1px solid #ccc",
//             borderRadius: "4px",
//           }}
//         >
//           <h3>Answer:</h3>
//           <p>{answer}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatPage;
