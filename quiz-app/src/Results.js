import React from 'react';
import Confetti from 'react-confetti';

function Results({ latestQuestion, winner, answerCounts, totalAnswers, showResults, setShowResults }) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700 flex-grow">
      {winner && <Confetti />}
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
  );
}

export default Results;