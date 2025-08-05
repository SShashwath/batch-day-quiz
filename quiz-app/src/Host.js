import React, { useState, useEffect } from 'react';
import { ref, onValue, push, set, query, orderByChild, limitToLast } from 'firebase/database';
import { database } from './firebase';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import CreateQuestion from './CreateQuestion';
import Results from './Results';
import HostLogin from './HostLogin';

function Host() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(null);
  const [latestQuestion, setLatestQuestion] = useState(null);
  const [winner, setWinner] = useState(null);
  const [answerCounts, setAnswerCounts] = useState({});
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [questionQueue, setQuestionQueue] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && location.pathname === '/host') {
      navigate('/host/create');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const questionsRef = ref(database, 'questions');
    const lastQuestionQuery = query(questionsRef, orderByChild('createdAt'), limitToLast(1));

    onValue(lastQuestionQuery, (snapshot) => {
      const questionData = snapshot.val();
      if (questionData) {
        const questionId = Object.keys(questionData)[0];
        setLatestQuestion({ id: questionId, ...questionData[questionId] });
        setShowResults(false);
      } else {
        setLatestQuestion(null);
      }
    });
  }, [isAuthenticated]);

  useEffect(() => {
    if (!latestQuestion || !isAuthenticated) {
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

      if (latestQuestion.correctAnswer) {
        const firstCorrectAnswer = answersList.find(ans => ans.answer === latestQuestion.correctAnswer);
        setWinner(firstCorrectAnswer || null);
      }

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
  }, [latestQuestion, isAuthenticated]);

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
  
  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate('/host/create');
  };

  if (!isAuthenticated) {
    return <HostLogin onLogin={handleLogin} />;
  }

  return (
    <div className="container mx-auto p-4 w-full max-w-6xl">
      <h1 className="text-4xl font-black mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">QUIZ MASTER</h1>
      <div className="flex justify-center mb-4">
        <Link to="/host/create" className={`px-4 py-2 rounded-l-lg ${location.pathname.includes('/create') ? 'bg-purple-600' : 'bg-gray-700'}`}>Create Question</Link>
        <Link to="/host/results" className={`px-4 py-2 rounded-r-lg ${location.pathname.includes('/results') ? 'bg-purple-600' : 'bg-gray-700'}`}>Results</Link>
      </div>
      <Routes>
        <Route path="create" element={
          <div>
            <CreateQuestion
              question={question}
              setQuestion={setQuestion}
              options={options}
              setOptions={setOptions}
              correctOptionIndex={correctOptionIndex}
              setCorrectOptionIndex={setCorrectOptionIndex}
              handleAddToQueue={handleAddToQueue}
            />
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
        } />
        <Route path="results" element={
          <Results
            latestQuestion={latestQuestion}
            winner={winner}
            answerCounts={answerCounts}
            totalAnswers={totalAnswers}
            showResults={showResults}
            setShowResults={setShowResults}
          />
        } />
      </Routes>
    </div>
  );
}

export default Host;