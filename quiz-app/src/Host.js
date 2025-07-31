import React, { useState, useEffect } from 'react';
import { ref, onValue, push, set, query, orderByChild, limitToLast } from 'firebase/database';
import { database } from './firebase';
import Confetti from 'react-confetti';

function Host() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(null);
  const [latestQuestion, setLatestQuestion] = useState(null);
  const [winner, setWinner] = useState(null);
  const [answerCounts, setAnswerCounts] = useState({});
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [questionQueue, setQuestionQueue] = useState([]);

  // Effect to get the latest question
  useEffect(() => {
    const questionsRef = ref(database, 'questions');
    const lastQuestionQuery = query(questionsRef, orderByChild('createdAt'), limitToLast(1));

    onValue(lastQuestionQuery, (snapshot) => {
      const questionData = snapshot.val();
      if (questionData) {
        const questionId = Object.keys(questionData)[0];
        setLatestQuestion({ id: questionId, ...questionData[questionId] });
        setShowResults(false); // Hide results for new question
      } else {
        setLatestQuestion(null);
      }
    });
  }, []);

  // Effect to find the winner and calculate counts for the latest question
  useEffect(() => {
    if (!latestQuestion) {
      setWinner(null);
      setAnswerCounts({});
      setTotalAnswers(0);
      return;
    }

    const answersRef = ref(database, `answers/${latestQuestion.id}`);
    const answersQuery = query(answersRef, orderByChild('timestamp'));

    onValue(answersQuery, (snapshot) => {
      const answersData = snapshot.val();
      const answersList = answersData ? Object.values(answersData) : [];
      setTotalAnswers(answersList.length);

      // Find the winner
      if (latestQuestion.correctAnswer) {
        const firstCorrectAnswer = answersList.find(ans => ans.answer === latestQuestion.correctAnswer);
        setWinner(firstCorrectAnswer || null);
      }

      // Calculate the counts for each option
      const counts = latestQuestion.options.reduce((acc, option) => {
        acc[option] = 0;
        return acc;
      }, {});

      answersList.forEach(ans => {
        if (counts[ans.answer] !== undefined) {
          counts[ans.answer]++;
        }
      });
      setAnswerCounts(counts);
    });
  }, [latestQuestion]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddToQueue = (e) => {
    e.preventDefault();
    if (!question.trim() || options.some(opt => !opt.trim()) || correctOptionIndex === null) {
      alert('Please fill out the question, all options, and select the correct answer.');
      return;
    }
    const newQuestion = {
      text: question,
      options: options,
      correctAnswer: options[correctOptionIndex],
    };
    setQuestionQueue([...questionQueue, newQuestion]);
    setQuestion('');
    setOptions(['', '', '', '']);
    setCorrectOptionIndex(null);
  };

  const handleBroadcast = (questionToBroadcast) => {
    const questionsRef = ref(database, 'questions');
    const newQuestionRef = push(questionsRef);
    
    set(newQuestionRef, {
      ...questionToBroadcast,
      createdAt: Date.now()
    });

    setQuestionQueue(questionQueue.filter(q => q !== questionToBroadcast));
  };

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
      {winner && <Confetti />}
      {/* Column 1: Create Question Form */}
      <div className="flex flex-col">
        <h1 className="text-4xl font-black mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">QUIZ MASTER</h1>
        <form onSubmit={handleAddToQueue} className="w-full mx-auto bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700">
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="question">
              New Question
            </label>
            <input
              id="question"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="bg-gray-900/50 border border-gray-700 rounded w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              placeholder="e.g., What is the powerhouse of the cell?"
            />
          </div>
          
          <label className="block text-gray-300 text-sm font-bold mb-2">Options (Select the correct one)</label>
          {options.map((option, index) => (
            <div className="mb-2 flex items-center" key={index}>
              <input
                type="radio"
                name="correctOption"
                id={`radio-${index}`}
                checked={correctOptionIndex === index}
                onChange={() => setCorrectOptionIndex(index)}
                className="form-radio h-5 w-5 text-green-500 bg-gray-700 border-gray-600 focus:ring-green-500"
              />
              <input
                id={`option-${index}`}
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="ml-3 bg-gray-900/50 border border-gray-700 rounded w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
                placeholder={`Option ${index + 1}`}
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Add to Queue
          </button>
        </form>

        <div className="w-full mx-auto bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700 mt-8">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-300">Question Queue</h2>
          {questionQueue.length > 0 ? (
            <ul className="space-y-4">
              {questionQueue.map((q, index) => (
                <li key={index} className="bg-gray-900/50 p-4 rounded-lg flex justify-between items-center">
                  <span className="text-gray-300">{q.text}</span>
                  <button
                    onClick={() => handleBroadcast(q)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    Broadcast
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center">No questions in the queue.</p>
          )}
        </div>
      </div>

      {/* Column 2: Results Panel */}
      <div className="flex flex-col">
        <h2 className="text-4xl font-black mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">LIVE RESULTS</h2>
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700 flex-grow">
          {latestQuestion ? (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-300">
                <span className="text-gray-500">Q:</span> {latestQuestion.text}
              </h3>
              
              {!showResults ? (
                <div className="text-center">
                  <p className="text-2xl text-gray-400 mb-4">Waiting for answers... ({totalAnswers} received)</p>
                  <button 
                    onClick={() => setShowResults(true)}
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    Show Results
                  </button>
                </div>
              ) : (
                <>
                  {/* Winner Section */}
                  <div className="text-center bg-gray-900/50 p-4 rounded-lg border border-gray-700 mb-6">
                    <h4 className="text-lg font-bold text-gray-400">Fastest Correct Answer</h4>
                    {winner ? (
                      <div className="animate-fade-in">
                        <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400 mt-2">
                          {winner.studentName}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500 mt-2">Waiting for a correct answer...</p>
                    )}
                  </div>

                  {/* Vote Distribution Section */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-400 mb-2">Vote Distribution ({totalAnswers} total)</h4>
                    <div className="space-y-3">
                      {latestQuestion.options.map((option, index) => {
                        const count = answerCounts[option] || 0;
                        const percentage = totalAnswers > 0 ? (count / totalAnswers) * 100 : 0;
                        const isCorrect = option === latestQuestion.correctAnswer;
                        return (
                          <div key={index} className={`w-full bg-gray-900/50 rounded-lg p-3 border ${isCorrect ? 'border-green-500' : 'border-gray-700'}`}>
                            <div className="flex justify-between items-center text-gray-300 mb-1">
                              <span className={`${isCorrect ? 'text-green-400 font-bold' : ''}`}>{option}</span>
                              <span className="font-bold">{count} vote{count !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                              <div
                                className={`h-2.5 rounded-full transition-all duration-500 ${isCorrect ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-teal-400'}`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-xl">No question has been asked yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Host;

