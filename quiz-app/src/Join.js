// src/Join.js
import React, { useState, useEffect } from 'react';
import { ref, onValue, push, set, serverTimestamp } from 'firebase/database';
import { database } from './firebase';

function Join() {
  const [name, setName] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  // This effect hook listens for new questions from the database
  useEffect(() => {
    // Reference to the 'questions' node in your database
    const questionsRef = ref(database, 'questions');

    // onValue() sets up a listener that runs whenever the data changes.
    onValue(questionsRef, (snapshot) => {
      const questions = snapshot.val();
      if (questions) {
        // Get the most recent question
        const latestQuestionId = Object.keys(questions).pop();
        const latestQuestion = questions[latestQuestionId];
        setCurrentQuestion({ id: latestQuestionId, ...latestQuestion });
        setSelectedOption(null); // Reset selection for new question
      }
    });
  }, []); // The empty array ensures this effect runs only once

  const handleJoin = (e) => {
    e.preventDefault();
    if (name.trim()) {
      setHasJoined(true);
    }
  };

  const handleAnswerSubmit = (option) => {
    if (!currentQuestion) return;
    setSelectedOption(option);

    // Reference to the 'answers' node for the current question
    const answersRef = ref(database, `answers/${currentQuestion.id}`);
    const newAnswerRef = push(answersRef);
    
    // Set the student's answer with their name and a server timestamp
    set(newAnswerRef, {
      studentName: name,
      answer: option,
      timestamp: serverTimestamp(), // Use server's time for accuracy
    });
  };

  // If the student hasn't entered their name yet, show the name form
  if (!hasJoined) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Join Quiz</h1>
        <form onSubmit={handleJoin} className="max-w-sm mx-auto">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your name"
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full mt-4 focus:outline-none focus:shadow-outline"
          >
            Join
          </button>
        </form>
      </div>
    );
  }

  // After joining, show the quiz interface
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Welcome, {name}!</h1>
      {currentQuestion ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl mb-4">{currentQuestion.text}</h2>
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSubmit(option)}
                disabled={selectedOption !== null} // Disable after answering
                className={`block w-full text-left p-4 rounded ${
                  selectedOption === option
                    ? 'bg-blue-500 text-white' // Highlight selected answer
                    : 'bg-gray-200 hover:bg-gray-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {option}
              </button>
            ))}
          </div>
          {selectedOption && (
            <p className="mt-4 text-green-600 font-bold">Your answer has been submitted!</p>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500">Waiting for the host to ask a question...</p>
      )}
    </div>
  );
}

export default Join;