import React from 'react';
import { database } from './firebase';
import { ref, onValue } from 'firebase/database';

function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = React.useState([]);

  React.useEffect(() => {
    const playersRef = ref(database, 'players');
    onValue(playersRef, (snapshot) => {
      const players = snapshot.val() || {};
      const answersRef = ref(database, 'answers');
      onValue(answersRef, (answerSnapshot) => {
        const answers = answerSnapshot.val() || {};
        const questionsRef = ref(database, 'questions');
        onValue(questionsRef, (questionSnapshot) => {
          const questions = questionSnapshot.val() || {};
          const leaderboard = calculateLeaderboard(players, answers, questions);
          setLeaderboardData(leaderboard);
        });
      });
    });
  }, []);

  const calculateLeaderboard = (players, answers, questions) => {
    const playerScores = {};

    for (const playerId in players) {
      playerScores[players[playerId].name] = {
        name: players[playerId].name,
        score: 0,
        totalTime: 0,
        correctAnswers: 0,
      };
    }

    for (const questionId in answers) {
      const question = questions[questionId];
      if (!question) continue;

      const questionAnswers = answers[questionId];
      for (const answerId in questionAnswers) {
        const answer = questionAnswers[answerId];
        if (answer.answer === question.correctAnswer) {
          const player = playerScores[answer.studentName];
          if (player) {
            player.score++;
            const answerTime = answer.timestamp - new Date(question.createdAt).getTime();
            player.totalTime += answerTime;
            player.correctAnswers++;
          }
        }
      }
    }

    const leaderboard = Object.values(playerScores);

    leaderboard.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      if(a.correctAnswers === 0) return 1;
      if(b.correctAnswers === 0) return -1;
      return (a.totalTime / a.correctAnswers) - (b.totalTime / b.correctAnswers);
    });

    return leaderboard;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-4xl font-black mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">LEADERBOARD</h1>
      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700">
        {leaderboardData.length > 0 ? (
          <ul className="space-y-2">
            {leaderboardData.map((entry, index) => (
              <li key={index} className="bg-gray-900/50 p-3 rounded-lg flex justify-between items-center">
                <span className="text-gray-300">{index + 1}. {entry.name}</span>
                <div>
                  <span className="text-gray-300 font-bold">{entry.score} {entry.score === 1 ? 'point' : 'points'}</span>
                  <span className="text-gray-500 text-sm ml-4">
                    {entry.correctAnswers > 0 ? `${(entry.totalTime / entry.correctAnswers / 1000).toFixed(2)}s avg` : ''}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No scores yet.</p>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;