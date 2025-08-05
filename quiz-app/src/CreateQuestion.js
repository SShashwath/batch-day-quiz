import React from 'react';

function CreateQuestion({ question, setQuestion, options, setOptions, correctOptionIndex, setCorrectOptionIndex, handleAddToQueue }) {
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
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
  );
}

export default CreateQuestion;