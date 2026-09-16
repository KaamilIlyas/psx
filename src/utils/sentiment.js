// Client-side quick keyword sentiment analyzer for news items
export function analyzeSentiment(title) {
  if (!title) return 'Neutral';
  const t = title.toLowerCase();
  const positiveWords = [
    'profit', 'increase', 'gain', 'dividend', 'growth', 'rise', 'expansion', 
    'record', 'deal', 'highest', 'positive', 'upgrade', 'jump', 'recovery', 
    'earnings', 'exceed', 'acquired', 'success', 'payout'
  ];
  const negativeWords = [
    'loss', 'decline', 'fall', 'drop', 'decrease', 'crisis', 'investigation', 
    'fine', 'penalty', 'court', 'charges', 'negative', 'downgrade', 'deficit',
    'shrink', 'slump', 'warn', 'cancel', 'regulatory', 'protest'
  ];
  
  let score = 0;
  positiveWords.forEach(w => {
    if (t.includes(w)) score++;
  });
  negativeWords.forEach(w => {
    if (t.includes(w)) score--;
  });
  
  if (score > 0) return 'Positive';
  if (score < 0) return 'Negative';
  return 'Neutral';
}
