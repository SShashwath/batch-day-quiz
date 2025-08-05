import React, { useState, useEffect } from 'react';
import { ref, onValue, push, set, serverTimestamp } from 'firebase/database';
import { database } from './firebase';

function Join() {
  const [name, setName] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [players, setPlayers] = useState([]);

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
        setCountdown(10); // Reset countdown for new question
      } else {
        setCurrentQuestion(null);
      }
    });

    const playersRef = ref(database, 'players');
    onValue(playersRef, (snapshot) => {
      const playersData = snapshot.val();
      setPlayers(playersData ? Object.values(playersData) : []);
    });
  }, []);

  useEffect(() => {
    if (currentQuestion && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [currentQuestion, countdown]);

  const handleJoin = (e) => {
    e.preventDefault();
    if (name.trim()) {
      const playersRef = ref(database, 'players');
      const newPlayerRef = push(playersRef);
      set(newPlayerRef, { name });
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-center text-gray-100">{currentQuestion.text}</h2>
              <div className="text-2xl font-bold text-yellow-400">{countdown}s</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedOption === option;
                let buttonClass = 'bg-gray-900/50 hover:bg-purple-500/50 border border-gray-700';
                if (isSelected) {
                  buttonClass = 'bg-purple-600 text-white';
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSubmit(option)}
                    disabled={submitted || countdown === 0}
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
          <div className="text-center">
            <p className="text-gray-500 text-xl mb-4">Waiting for the next question...</p>
            <h3 className="text-lg font-bold text-gray-400">Players in Lobby:</h3>
            <ul className="mt-2">
              {players.map((player, index) => (
                <li key={index} className="text-gray-300">{player.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Join;