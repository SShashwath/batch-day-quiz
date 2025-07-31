import React, { useState, useEffect } from 'react';
import { ref, onValue, push, set, query, orderByChild, limitToLast } from 'firebase/database';
import { database } from './firebase';

function Host() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [latestQuestion, setLatestQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const questionsRef = ref(database, 'questions');
    const lastQuestionQuery = query(questionsRef, orderByChild('createdAt'), limitToLast(1));

    onValue(lastQuestionQuery, (snapshot) => {
      const questionData = snapshot.val();
      if (questionData) {
        const questionId = Object.keys(questionData)[0];
        setLatestQuestion({ id: questionId, ...questionData[questionId] });
      } else {
        setLatestQuestion(null);
      }
    });
  }, []);

  useEffect(() => {
    if (!latestQuestion) {
      setAnswers([]);
      return;
    }

    const answersRef = ref(database, `answers/${latestQuestion.id}`);
    const answersQuery = query(answersRef, orderByChild('timestamp'));

    onValue(answersQuery, (snapshot) => {
      const answersData = snapshot.val();
      const answersList = answersData ? Object.values(answersData) : [];
      setAnswers(answersList);
    });
  }, [latestQuestion]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim() || options.some(opt => !opt.trim())) {
      alert('Please fill out the question and all four options.');
      return;
    }

    const questionsRef = ref(database, 'questions');
    const newQuestionRef = push(questionsRef);

    set(newQuestionRef, {
      text: question,
      options: options,
      createdAt: Date.now()
    });

    setQuestion('');
    setOptions(['', '', '', '']);
  };

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
      {/* Column 1: Create Question Form */}
      <div className="flex flex-col">
        <h1 className="text-4xl font-black mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">QUIZ MASTER</h1>
        <form onSubmit={handleSubmit} className="w-full mx-auto bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700">
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
          {options.map((option, index) => (
            <div className="mb-4" key={index}>
              <input
                id={`option-${index}`}
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="bg-gray-900/50 border border-gray-700 rounded w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
                placeholder={`Option ${index + 1}`}
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full mt-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Broadcast Question
          </button>
        </form>
      </div>

      {/* Column 2: Results Panel */}
      <div className="flex flex-col">
        <h2 className="text-4xl font-black mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">LIVE RESULTS</h2>
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700 flex-grow">
          {latestQuestion ? (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-200">
                <span className="text-gray-400">Q:</span> {latestQuestion.text}
              </h3>
              <ul className="space-y-3">
                {answers.length > 0 ? (
                  answers.map((ans, index) => (
                    <li key={index} className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg border border-gray-700 animate-fade-in">
                      <div className="flex items-center">
                        <span className="font-bold text-lg text-blue-400 mr-3">{index + 1}</span>
                        <span className="font-medium text-gray-200">{ans.studentName}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-bold text-teal-400">{ans.answer}</span>
                        {index === 0 && <span className="text-xs font-bold bg-green-500 text-white py-1 px-2 rounded-full ml-3">FASTEST</span>}
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">Waiting for answers...</p>
                )}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No question has been asked yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Host;