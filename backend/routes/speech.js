const express = require('express');
const { body, validationResult } = require('express-validator');

const router = express.Router();

const normalizePinyin = (value) => {
  if (!value) {
    return '';
  }
  return value
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const extractTones = (value) => {
  const matches = value.match(/[1-5]/g);
  return matches ? matches.join('') : '';
};

const levenshtein = (a, b) => {
  const matrix = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
};

// @route   POST /api/speech/score
// @desc    Score spoken/typed pinyin against expected answer
// @access  Public
router.post('/score', [
  body('expected')
    .isString()
    .notEmpty()
    .withMessage('Expected pronunciation is required'),
  body('transcript')
    .isString()
    .notEmpty()
    .withMessage('Transcript is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const expectedRaw = req.body.expected;
  const transcriptRaw = req.body.transcript;

  const expected = normalizePinyin(expectedRaw);
  const transcript = normalizePinyin(transcriptRaw);

  const maxLen = Math.max(expected.length, transcript.length) || 1;
  const distance = levenshtein(expected, transcript);
  const similarityScore = Math.max(0, Math.round((1 - distance / maxLen) * 100));

  const expectedTones = extractTones(expectedRaw);
  const transcriptTones = extractTones(transcriptRaw);
  const toneScore =
    expectedTones && transcriptTones
      ? expectedTones === transcriptTones
        ? 100
        : Math.max(40, Math.round((1 - levenshtein(expectedTones, transcriptTones) / Math.max(expectedTones.length, transcriptTones.length)) * 100))
      : 60;

  const overallScore = Math.round(similarityScore * 0.7 + toneScore * 0.3);

  res.json({
    success: true,
    scores: {
      overall: overallScore,
      pronunciation: similarityScore,
      tone: toneScore
    },
    feedback:
      overallScore >= 90
        ? 'Great pronunciation!'
        : overallScore >= 75
          ? 'Nice work. Focus on smoother tone transitions.'
          : 'Keep practicing the tones and syllable order.'
  });
});

module.exports = router;
