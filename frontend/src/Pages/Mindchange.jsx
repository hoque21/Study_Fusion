import React, { useState, useEffect } from 'react';

/* Study Fusion brand tokens (kept local since this component uses inline styles) */
const INK = '#0B1F3A';
const GOLD = '#F5A623';
const GOLD_TINT = '#FFF3DF';
const PALE = '#F5F8FC';
const BORDER = '#DCE6F2';

// MCQ Quiz
function Question({ data, onAnswer }) {
  return (
    <div>
      <h3>{data.question}</h3>
      <div style={{ marginTop: '15px' }}>
        {data.options.map(option => (
          <button
            key={option}
            onClick={() => onAnswer(option)}
            style={{
              display: 'block',
              margin: '8px auto',
              padding: '10px 15px',
              width: '200px',
              cursor: 'pointer',
              borderRadius: '8px',
              border: `1px solid ${INK}`,
              backgroundColor: PALE,
              color: INK,
              fontWeight: 600,
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

// Score Component
function Score({ score, total }) {
  return <h2 style={{ color: INK }}>🎉 Your Score: {score} / {total}</h2>;
}

// Number Puzzle Game
function NumberPuzzle() {
  const [sequence, setSequence] = useState([]);
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const start = Math.floor(Math.random() * 5) + 1;
    const seq = [start, start + 2, start + 4, null, start + 8];
    setSequence(seq);
  }, []);

  const handleCheck = () => {
    if (parseInt(input) === sequence[3]) {
      setMessage('✅ Correct!');
    } else {
      setMessage(`❌ Wrong! Answer is ${sequence[3]}`);
    }
  };

  return (
    <div>
      <h3>Complete the sequence:</h3>
      <h2 style={{ color: INK }}>
        {sequence.map((num, idx) => (num === null ? '___' : num)).join(', ')}
      </h2>
      <input
        type="number"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ padding: '5px', width: '80px', border: `1px solid ${BORDER}`, borderRadius: '5px' }}
      />
      <button
        onClick={handleCheck}
        style={{
          marginLeft: '10px',
          padding: '5px 14px',
          borderRadius: '5px',
          border: 'none',
          backgroundColor: INK,
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        Check
      </button>
      <p>{message}</p>
    </div>
  );
}

// Word Scramble Game
function WordScramble() {
  const words = ['apple', 'banana', 'orange', 'grape', 'mango'];
  const [word, setWord] = useState('');
  const [scrambled, setScrambled] = useState('');
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const w = words[Math.floor(Math.random() * words.length)];
    const scrambledWord = w.split('').sort(() => 0.5 - Math.random()).join('');
    setWord(w);
    setScrambled(scrambledWord);
  }, []);

  const handleCheck = () => {
    if (input.toLowerCase() === word) {
      setMessage('✅ Correct!');
    } else {
      setMessage(`❌ Wrong! Answer is ${word}`);
    }
  };

  return (
    <div>
      <h3>Unscramble the word:</h3>
      <h2 style={{ color: INK }}>{scrambled}</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ padding: '5px', border: `1px solid ${BORDER}`, borderRadius: '5px' }}
      />
      <button
        onClick={handleCheck}
        style={{
          marginLeft: '10px',
          padding: '5px 14px',
          borderRadius: '5px',
          border: 'none',
          backgroundColor: INK,
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        Check
      </button>
      <p>{message}</p>
    </div>
  );
}

// Memory Game
function MemoryGame() {
  const emojis = ['🍎','🍌','🍇','🍉','🍒'];
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);

  useEffect(() => {
    const shuffled = [...emojis, ...emojis].sort(() => 0.5 - Math.random());
    setCards(shuffled);
  }, []);

  const handleClick = (index) => {
    if (selected.length === 2 || matched.includes(index)) return;
    const newSelected = [...selected, index];
    setSelected(newSelected);
    if (newSelected.length === 2) {
      if (cards[newSelected[0]] === cards[newSelected[1]]) {
        setMatched([...matched, ...newSelected]);
      }
      setTimeout(() => setSelected([]), 500);
    }
  };

  return (
    <div>
      <h3>Match the pairs:</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => handleClick(idx)}
            style={{
              width: '50px', height: '50px', margin: '5px', fontSize: '30px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `2px solid ${INK}`, borderRadius: '8px',
              backgroundColor: selected.includes(idx) || matched.includes(idx) ? '#fff' : GOLD_TINT,
              cursor: 'pointer'
            }}
          >
            {selected.includes(idx) || matched.includes(idx) ? card : ''}
          </div>
        ))}
      </div>
      <p>Matched: {matched.length / 2} / {emojis.length}</p>
    </div>
  );
}

// Color Guess Game
function ColorGuessGame() {
  const colors = ['red', 'green', 'blue', 'yellow', 'purple'];
  const [target, setTarget] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setTarget(colors[Math.floor(Math.random() * colors.length)]);
  }, []);

  const handleClick = (color) => {
    if (color === target) {
      setMessage('✅ Correct!');
      setTarget(colors[Math.floor(Math.random() * colors.length)]);
    } else {
      setMessage(`❌ Wrong! It was ${target}`);
    }
  };

  return (
    <div>
      <h3>Guess the color:</h3>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
        {colors.map(color => (
          <div
            key={color}
            onClick={() => handleClick(color)}
            style={{ width: '50px', height: '50px', backgroundColor: color, margin: '5px', cursor: 'pointer', borderRadius: '8px', border: `2px solid ${INK}` }}
          />
        ))}
      </div>
      <p>{message}</p>
    </div>
  );
}

// Main Brain Games Component
export default function Mindchange() {
  const [activeGame, setActiveGame] = useState('quiz');

  const games = ['quiz','numberPuzzle','wordScramble','memoryGame','colorGame'];

  // MCQ Questions
  const questions = [
    { question: "Which number comes next in the sequence: 2, 4, 8, 16, ?", options: ["18", "24", "32", "64"], answer: "32" },
    { question: "What is the capital of France?", options: ["Paris", "Berlin", "Madrid", "Rome"], answer: "Paris" },
    { question: "Which shape has 4 equal sides?", options: ["Rectangle", "Square", "Triangle", "Circle"], answer: "Square" },
  ];

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const handleAnswer = (option) => {
    if (option === questions[current].answer) setScore(score + 1);
    const next = current + 1;
    if (next < questions.length) setCurrent(next);
    else setShowScore(true);
  };

  const renderGame = () => {
    switch(activeGame){
      case 'quiz': return showScore ? <Score score={score} total={questions.length} /> : <Question data={questions[current]} onAnswer={handleAnswer} />;
      case 'numberPuzzle': return <NumberPuzzle />;
      case 'wordScramble': return <WordScramble />;
      case 'memoryGame': return <MemoryGame />;
      case 'colorGame': return <ColorGuessGame />;
      default: return null;
    }
  }

  return (
    <div style={{ maxWidth:'650px', margin:'50px auto', padding:'24px', fontFamily:'Arial, sans-serif', border: `2px solid ${BORDER}`, borderRadius:'14px', backgroundColor: PALE }}>
      <h1 style={{ textAlign:'center', color: INK }}>🎓 Study Fusion Brain Games</h1>
      <p style={{ textAlign: 'center', color: '#3B5378', marginTop: '-8px', marginBottom: '24px', fontSize: '14px' }}>
        A quick mental warm-up while you wait for your consultation.
      </p>
      <div style={{ display:'flex', justifyContent:'space-around', marginBottom:'30px', flexWrap:'wrap' }}>
        {games.map(game => (
          <button key={game} onClick={() => { setActiveGame(game); setCurrent(0); setScore(0); setShowScore(false); }}
            style={{
              padding:'10px 15px',
              borderRadius:'8px',
              border: activeGame===game ? `2px solid ${INK}` : `1px solid ${BORDER}`,
              backgroundColor: activeGame===game ? GOLD_TINT : '#fff',
              color: INK,
              fontWeight: activeGame===game ? 700 : 500,
              cursor:'pointer',
              margin:'5px',
            }}
          >
            {game==='quiz'?'MCQ Quiz': game==='numberPuzzle'?'Number Puzzle': game==='wordScramble'?'Word Scramble': game==='memoryGame'?'Memory Game':'Color Guess'}
          </button>
        ))}
      </div>
      <div style={{ textAlign:'center' }}>{renderGame()}</div>
    </div>
  );
}
