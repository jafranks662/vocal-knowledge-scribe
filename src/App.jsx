import React, { useState } from 'react';

// Placeholder chat component. Replace with actual chat UI later.
const ChatComponent = () => (
  <div>
    <p>Chat interface goes here.</p>
  </div>
);

// Placeholder voice quiz component. Accepts a question and the correct answer.
const VoiceQuiz = ({ question, answer }) => (
  <div>
    <h2>{question}</h2>
    <p>Correct Answer: {answer}</p>
    {/* Implement voice quiz logic here */}
  </div>
);

// Placeholder study mode component. Renders a list of notes.
const StudyMode = ({ notes }) => (
  <div>
    <h2>Study Notes</h2>
    <ul>
      {notes.map((note, index) => (
        <li key={index}>{note}</li>
      ))}
    </ul>
  </div>
);

// Main application component that switches between modes.
const App = () => {
  const [mode, setMode] = useState('CHAT');

  // Helper to display the current mode in the heading.
  const modeLabel = {
    CHAT: 'CHAT',
    QUIZ: 'QUIZ',
    STUDY: 'STUDY',
  }[mode];

  return (
    <div className="app-container">
      <h1>Current Mode: {modeLabel}</h1>
      <div className="mode-buttons">
        <button onClick={() => setMode('CHAT')}>Chat Mode</button>
        <button onClick={() => setMode('QUIZ')}>Quiz Me</button>
        <button onClick={() => setMode('STUDY')}>Study Mode</button>
      </div>

      {mode === 'CHAT' && <ChatComponent />}
      {mode === 'QUIZ' && (
        <VoiceQuiz question="What is 2 + 2?" answer="4" />
      )}
      {mode === 'STUDY' && (
        <StudyMode notes={['React Hooks', 'State Management', 'Routing']} />
      )}
    </div>
  );
};

export default App;
