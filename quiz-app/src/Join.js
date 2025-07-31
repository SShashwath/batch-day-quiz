import React, { useState, useEffect } from 'react';
import { ref, onValue, push, set, serverTimestamp } from 'firebase/database';
import { database } from './firebase';

function Join() {
  const [name, setName] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const questionsRef = ref(database, 'questions');
    onValue(questionsRef, (snapshot) => {
      const questions = snapshot.val();
      if (questions) {
        const latestQuestionId = Object.keys(questions).pop();
        const latestQuestion = questions[latestQuestionId];
        setCurrentQuestion({ id: latestQuestionId, ...latestQuestion });
        setSelectedOption(null);
        setSubmitted(false);
      } else {
        setCurrentQuestion(null);
      }
    });
  }, []);

  const handleJoin = (e) => {
    e.preventDefault();
    if (name.trim()) {
      setHasJoined(true);
    }
  };

  const handleAnswerSubmit = (option) => {
    if (!currentQuestion || submitted) return;
    setSelectedOption(option);
    setSubmitted(true);

    const answersRef = ref(database, `answers/${currentQuestion.id}`);
    const newAnswerRef = push(answersRef);

    set(newAnswerRef, {
      studentName: name,
      answer: option,
      timestamp: serverTimestamp(),
    });
  };

  if (!hasJoined) {
    return (
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-4xl font-black mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">JOIN QUIZ</h1>
        <form onSubmit={handleJoin} className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-700">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-900/50 border border-gray-700 rounded w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
            placeholder="Enter your name to join..."
          />
          <button
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Let's Go!
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-400">Welcome, {name}!</h1>
      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700 min-h-[300px] flex flex-col justify-center">
        {currentQuestion ? (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">{currentQuestion.text}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedOption === option;
                const buttonClass = isSelected
                  ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white scale-105'
                  : 'bg-gray-900/50 hover:bg-purple-500/50 border border-gray-700';

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSubmit(option)}
                    disabled={submitted}
                    className={`w-full text-left p-4 rounded-lg font-bold text-lg transition-all duration-300 transform disabled:opacity-60 disabled:cursor-not-allowed ${buttonClass}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {submitted && (
              <p className="mt-6 text-center text-green-400 font-bold text-xl animate-pulse">Answer Locked In!</p>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-xl">Waiting for the next question...</p>
        )}
      </div>
    </div>
  );
}

export default Join;