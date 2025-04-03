'use client';

// pages/metadata-generator.tsx
import { Key, useState } from 'react';
import Head from 'next/head';

export default function MetadataGenerator() {
    const [inputText, setInputText] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [metadata, setMetadata] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [useApi, setUseApi] = useState(false);
    const [apiKey, setApiKey] = useState("");

    const analyzeText = async () => {
        if (!inputText.trim()) return;

        setIsAnalyzing(true);

        try {
            let results;

            if (useApi && apiKey) {
                // Example of how you would call an external API
                results = await analyzeWithExternalApi(inputText, apiKey);
            } else {
                // Local analysis without external APIs
                results = generateMetadata(inputText);
            }

            setMetadata(results);
        } catch (error) {
            console.error("Error analyzing text:", error);
            alert("Error analyzing text. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Mock function to demonstrate API integration
    const analyzeWithExternalApi = async (text: string, key: string) => {
        // This would be replaced with actual API calls
        console.log("Would analyze with API using key:", key);

        // For now, just use our local analysis
        return generateMetadata(text);
    };

    const generateMetadata = (text: string) => {
        // Basic text statistics
        const characters = text.length;
        const charactersNoSpaces = text.replace(/\s/g, "").length;
        const words = text.match(/\S+/g) || [];
        const wordCount = words.length;

        // Word length analysis
        const wordLengths = words.map((word) => word.length);
        const averageWordLength =
            wordCount > 0
                ? (
                      wordLengths.reduce((sum, length) => sum + length, 0) /
                      wordCount
                  ).toFixed(2)
                : 0;
        const longestWord =
            wordCount > 0
                ? words.reduce(
                      (longest, word) =>
                          word.length > longest.length ? word : longest,
                      ""
                  )
                : "";
        const shortestWord =
            wordCount > 0
                ? words.reduce(
                      (shortest, word) =>
                          shortest === "" || word.length < shortest.length
                              ? word
                              : shortest,
                      ""
                  )
                : "";

        // Sentence analysis
        // More sophisticated sentence splitter
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
        const sentenceCount = sentences.length;
        const averageWordsPerSentence =
            sentenceCount > 0 ? (wordCount / sentenceCount).toFixed(2) : 0;

        // Paragraph analysis
        const paragraphs = text.split(/\n\s*\n/);
        const paragraphCount = paragraphs.filter(
            (p) => p.trim().length > 0
        ).length;

        // Word frequency
        const wordFrequency: Record<string, number> = {};
        words.forEach((word) => {
            const normalizedWord = word
                .toLowerCase()
                .replace(/[.,?!;:()"'-]/g, "");
            wordFrequency[normalizedWord] =
                (wordFrequency[normalizedWord] || 0) + 1;
        });

        // Sort words by frequency
        const sortedWords = Object.entries(wordFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10); // Top 10 most frequent words

        // Character distribution
        const charDistribution: Record<string, number> = {};
        text.split("").forEach((char) => {
            if (char.trim()) {
                const normalizedChar = char.toLowerCase();
                charDistribution[normalizedChar] =
                    (charDistribution[normalizedChar] || 0) + 1;
            }
        });

        // IMPROVED: Readability scores with multiple metrics
        const readabilityMetrics = calculateReadabilityMetrics(
            text,
            words,
            sentences
        );

        // IMPROVED: Enhanced sentiment analysis
        const sentimentAnalysis = improvedSentimentAnalysis(text);

        // IMPROVED: Better language detection
        const languageInfo = improvedLanguageDetection(text);

        return {
            basicStats: {
                characters,
                charactersNoSpaces,
                wordCount,
                sentenceCount,
                paragraphCount,
                averageWordLength,
                averageWordsPerSentence,
            },
            wordAnalysis: {
                longestWord,
                shortestWord,
                topWords: sortedWords,
                uniqueWords: Object.keys(wordFrequency).length,
                lexicalDiversity:
                    (
                        (Object.keys(wordFrequency).length / wordCount) *
                        100
                    ).toFixed(2) + "%",
            },
            readability: readabilityMetrics,
            sentiment: sentimentAnalysis,
            language: languageInfo,
            charDistribution: Object.entries(charDistribution)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 15), // Top 15 most frequent characters
        };
    };

    // IMPROVED: Enhanced readability calculation
    const calculateReadabilityMetrics = (
        text: string,
        words: string[],
        sentences: string[]
    ) => {
        // Count syllables more accurately
        const syllableCount = countSyllables(words);
        const wordCount = words.length;
        const sentenceCount = sentences.length;

        // Prevent division by zero
        if (wordCount === 0 || sentenceCount === 0) {
            return {
                fleschReadingEase: "N/A",
                fleschKincaidGrade: "N/A",
                gunningFogIndex: "N/A",
                smogIndex: "N/A",
                automatedReadabilityIndex: "N/A",
                colemanLiauIndex: "N/A",
                readabilityConsensus: "Not enough text to analyze",
                estimatedReadTime: "Less than 1 second",
            };
        }

        // Calculate various readability formulas

        // 1. Flesch Reading Ease
        const fleschReadingEase = (
            206.835 -
            1.015 * (wordCount / sentenceCount) -
            84.6 * (syllableCount / wordCount)
        ).toFixed(2);

        // 2. Flesch-Kincaid Grade Level
        const fleschKincaidGrade = (
            0.39 * (wordCount / sentenceCount) +
            11.8 * (syllableCount / wordCount) -
            15.59
        ).toFixed(2);

        // 3. Gunning Fog Index
        // Count complex words (words with 3+ syllables)
        const complexWords = words.filter(
            (word) => countWordSyllables(word) >= 3
        ).length;
        const gunningFogIndex = (
            0.4 *
            (wordCount / sentenceCount + 100 * (complexWords / wordCount))
        ).toFixed(2);

        // 4. SMOG Index
        const smogIndex = (
            1.043 * Math.sqrt(complexWords * (30 / sentenceCount) + 3.1291)
        ).toFixed(2);

        // 5. Automated Readability Index
        const letters = text.replace(/[^a-zA-Z]/g, "").length;
        const automatedReadabilityIndex = (
            4.71 * (letters / wordCount) +
            0.5 * (wordCount / sentenceCount) -
            21.43
        ).toFixed(2);

        // 6. Coleman-Liau Index
        const L = (letters / wordCount) * 100; // Letters per 100 words
        const S = (sentenceCount / wordCount) * 100; // Sentences per 100 words
        const colemanLiauIndex = (0.0588 * L - 0.296 * S - 15.8).toFixed(2);

        // Get consensus readability level
        const scores = [
            parseFloat(fleschKincaidGrade),
            parseFloat(gunningFogIndex),
            parseFloat(smogIndex),
            parseFloat(automatedReadabilityIndex),
            parseFloat(colemanLiauIndex),
        ].filter((score) => !isNaN(score));

        const averageGradeLevel =
            scores.length > 0
                ? scores.reduce((sum, score) => sum + score, 0) / scores.length
                : 0;

        const readabilityConsensus = getReadabilityLevel(averageGradeLevel);

        // Calculate read time
        const estimatedReadTime = calculateReadTime(wordCount);

        return {
            fleschReadingEase,
            fleschKincaidGrade,
            gunningFogIndex,
            smogIndex,
            automatedReadabilityIndex,
            colemanLiauIndex,
            averageGradeLevel: averageGradeLevel.toFixed(1),
            readabilityConsensus,
            estimatedReadTime,
        };
    };

    // IMPROVED: Enhanced syllable counting
    const countSyllables = (words: string[]): number => {
        return words.reduce(
            (total, word) => total + countWordSyllables(word),
            0
        );
    };

    const countWordSyllables = (word: string): number => {
        word = word.toLowerCase().replace(/[^a-z]/g, "");

        // Edge cases
        if (word.length <= 3) return 1;

        // Remove endings
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
        word = word.replace(/^y/, "");

        // Count vowel groups
        const syllables = word.match(/[aeiouy]{1,2}/g);

        return syllables ? syllables.length : 1;
    };

    // IMPROVED: Enhanced sentiment analysis
    const improvedSentimentAnalysis = (text: string) => {
        // More comprehensive word lists
        const positiveWords = [
            "good",
            "great",
            "excellent",
            "happy",
            "positive",
            "wonderful",
            "best",
            "love",
            "nice",
            "amazing",
            "awesome",
            "fantastic",
            "superior",
            "outstanding",
            "perfect",
            "terrific",
            "enjoy",
            "pleasure",
            "delight",
            "glad",
            "triumph",
            "success",
            "achieve",
            "accomplish",
            "beneficial",
            "favorite",
            "brilliant",
            "spectacular",
            "splendid",
            "superb",
            "magnificent",
            "marvelous",
            "joyful",
            "beautiful",
            "praise",
            "impressive",
            "extraordinary",
            "tremendous",
            "fabulous",
            "exceptional",
            "incredible",
            "remarkable",
            "satisfying",
            "masterful",
            "glorious",
            "admirable",
            "commendable",
            "effective",
        ];

        const negativeWords = [
            "bad",
            "worst",
            "terrible",
            "horrible",
            "hate",
            "dislike",
            "awful",
            "poor",
            "negative",
            "wrong",
            "failure",
            "fail",
            "disappointed",
            "disappointing",
            "frustrating",
            "annoying",
            "inadequate",
            "inferior",
            "worthless",
            "useless",
            "mediocre",
            "miserable",
            "pathetic",
            "stupid",
            "catastrophe",
            "disaster",
            "tragic",
            "unfortunate",
            "upsetting",
            "appalling",
            "atrocious",
            "woeful",
            "dreadful",
            "horrendous",
            "adverse",
            "alarming",
            "angry",
            "anxious",
            "deplorable",
            "depressing",
            "devastated",
            "grim",
            "heartbreaking",
            "hopeless",
            "painful",
            "severe",
            "unhappy",
            "unpleasant",
            "wretched",
        ];

        // Add emotion words
        const emotionWords = {
            joy: [
                "happy",
                "joy",
                "delighted",
                "thrilled",
                "excited",
                "ecstatic",
                "content",
                "pleased",
            ],
            sadness: [
                "sad",
                "unhappy",
                "depressed",
                "miserable",
                "gloomy",
                "downcast",
                "tearful",
                "melancholy",
            ],
            anger: [
                "angry",
                "furious",
                "outraged",
                "enraged",
                "irate",
                "irritated",
                "annoyed",
                "mad",
            ],
            fear: [
                "afraid",
                "scared",
                "frightened",
                "terrified",
                "anxious",
                "nervous",
                "worried",
                "panicked",
            ],
            surprise: [
                "surprised",
                "amazed",
                "astonished",
                "shocked",
                "startled",
                "stunned",
                "bewildered",
                "dumbfounded",
            ],
            disgust: [
                "disgusted",
                "revolted",
                "nauseated",
                "repulsed",
                "appalled",
                "horrified",
                "sickened",
                "loathing",
            ],
        };

        // Intensifiers and diminishers
        const intensifiers = [
            "very",
            "extremely",
            "incredibly",
            "absolutely",
            "completely",
            "totally",
            "utterly",
            "highly",
        ];
        const diminishers = [
            "somewhat",
            "slightly",
            "barely",
            "hardly",
            "scarcely",
            "a bit",
            "a little",
            "rather",
        ];
        const negators = [
            "not",
            "no",
            "never",
            "neither",
            "nor",
            "none",
            "nothing",
            "nowhere",
        ];

        // Extract words
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];

        // Initialize counts
        let positiveCount = 0;
        let negativeCount = 0;
        let intensifierCount = 0;
        let diminisherCount = 0;
        let negatorCount = 0;
        const emotions: Record<string, number> = {
            joy: 0,
            sadness: 0,
            anger: 0,
            fear: 0,
            surprise: 0,
            disgust: 0,
        };

        // Keep track of context
        let prevWord = "";
        let prevPrevWord = "";

        // Analyze words
        words.forEach((word) => {
            // Check for sentiment words
            if (positiveWords.includes(word)) {
                // Check for negation (e.g. "not good")
                if (
                    negators.includes(prevWord) ||
                    (prevPrevWord &&
                        negators.includes(prevPrevWord) &&
                        diminishers.includes(prevWord)) ||
                    intensifiers.includes(prevWord)
                ) {
                    negativeCount++;
                } else {
                    positiveCount++;
                    // Adjust for intensifiers (e.g. "very good")
                    if (intensifiers.includes(prevWord)) {
                        positiveCount += 0.5;
                    }
                    // Adjust for diminishers (e.g. "slightly good")
                    if (diminishers.includes(prevWord)) {
                        positiveCount -= 0.25;
                    }
                }
            }

            if (negativeWords.includes(word)) {
                // Check for negation (e.g. "not bad")
                if (
                    negators.includes(prevWord) ||
                    (prevPrevWord &&
                        negators.includes(prevPrevWord) &&
                        diminishers.includes(prevWord)) ||
                    intensifiers.includes(prevWord)
                ) {
                    positiveCount++;
                } else {
                    negativeCount++;
                    // Adjust for intensifiers (e.g. "very bad")
                    if (intensifiers.includes(prevWord)) {
                        negativeCount += 0.5;
                    }
                    // Adjust for diminishers (e.g. "slightly bad")
                    if (diminishers.includes(prevWord)) {
                        negativeCount -= 0.25;
                    }
                }
            }

            // Count modifiers
            if (intensifiers.includes(word)) intensifierCount++;
            if (diminishers.includes(word)) diminisherCount++;
            if (negators.includes(word)) negatorCount++;

            // Check for emotions
            for (const [emotion] of Object.entries(emotions)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if ((emotionWords as any)[emotion].includes(word)) {
                    emotions[emotion]++;
                }
            }

            // Update previous words
            prevPrevWord = prevWord;
            prevWord = word;
        });

        // Calculate sentiment metrics
        const totalSentimentWords = positiveCount + negativeCount;

        // Calculate polarity (-1 to 1)
        const polarityScore =
            totalSentimentWords > 0
                ? (
                      (positiveCount - negativeCount) /
                      totalSentimentWords
                  ).toFixed(2)
                : "0.00";

        // Calculate subjectivity (0 to 1)
        const subjectivityScore =
            words.length > 0
                ? (totalSentimentWords / words.length).toFixed(2)
                : "0.00";

        // Get primary emotion
        const primaryEmotion =
            Object.entries(emotions)
                .sort((a, b) => b[1] - a[1])
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .filter(([_, count]) => count > 0)[0]?.[0] || "neutral";

        // Determine sentiment label
        let sentimentLabel = "Neutral";
        const polarityValue = parseFloat(polarityScore);

        if (polarityValue >= 0.05)
            sentimentLabel =
                polarityValue >= 0.3 ? "Very Positive" : "Positive";
        if (polarityValue <= -0.05)
            sentimentLabel =
                polarityValue <= -0.3 ? "Very Negative" : "Negative";

        return {
            positiveWords: positiveCount,
            negativeWords: negativeCount,
            polarityScore,
            subjectivityScore,
            overall: sentimentLabel,
            primaryEmotion:
                primaryEmotion.charAt(0).toUpperCase() +
                primaryEmotion.slice(1),
            emotionBreakdown: emotions,
            intensifierCount,
            diminisherCount,
            negatorCount,
        };
    };

    // IMPROVED: Enhanced language detection
    const improvedLanguageDetection = (text: string) => {
        if (!text.trim()) return { detectedLanguage: "Unknown (empty text)" };

        // Get a sample for analysis
        const sample = text.substring(0, 2000).toLowerCase();

        // Character set detection
        const charSets = {
            latin: /[a-z]/i,
            cyrillic: /[а-яё]/i,
            greek: /[\u0370-\u03FF]/i,
            arabic: /[\u0600-\u06FF]/i,
            hebrew: /[\u0590-\u05FF]/i,
            devanagari: /[\u0900-\u097F]/i, // Hindi and other Indian languages
            chinese: /[\u4E00-\u9FFF]/i,
            japanese: /[\u3040-\u309F\u30A0-\u30FF]/i, // Hiragana and Katakana
            korean: /[\uAC00-\uD7A3\u1100-\u11FF]/i, // Hangul
            thai: /[\u0E00-\u0E7F]/i,
        };

        // Test for character sets
        const detectedSets: string[] = [];
        for (const [setName, pattern] of Object.entries(charSets)) {
            if (pattern.test(sample)) {
                detectedSets.push(setName);
            }
        }

        // If no specific character set is detected, default to unknown
        if (detectedSets.length === 0)
            return { detectedLanguage: "Unknown", confidence: "Low" };

        // If non-Latin characters detected, make assumptions based on character set
        if (detectedSets.length === 1 && detectedSets[0] !== "latin") {
            const charSet = detectedSets[0];
            switch (charSet) {
                case "cyrillic":
                    return {
                        detectedLanguage:
                            "Russian (or other Cyrillic language)",
                        confidence: "Medium",
                    };
                case "greek":
                    return { detectedLanguage: "Greek", confidence: "High" };
                case "arabic":
                    return { detectedLanguage: "Arabic", confidence: "High" };
                case "hebrew":
                    return { detectedLanguage: "Hebrew", confidence: "High" };
                case "devanagari":
                    return {
                        detectedLanguage:
                            "Hindi (or other Devanagari script language)",
                        confidence: "High",
                    };
                case "chinese":
                    return { detectedLanguage: "Chinese", confidence: "High" };
                case "japanese":
                    return { detectedLanguage: "Japanese", confidence: "High" };
                case "korean":
                    return { detectedLanguage: "Korean", confidence: "High" };
                case "thai":
                    return { detectedLanguage: "Thai", confidence: "High" };
            }
        }

        // If we have Latin + another script, make some reasonable guesses
        if (detectedSets.length > 1 && detectedSets.includes("latin")) {
            if (detectedSets.includes("japanese"))
                return {
                    detectedLanguage: "Japanese with Latin script",
                    confidence: "Medium",
                };
            if (detectedSets.includes("chinese"))
                return {
                    detectedLanguage: "Chinese with Latin script",
                    confidence: "Medium",
                };
            if (detectedSets.includes("cyrillic"))
                return {
                    detectedLanguage: "Multilingual text with Cyrillic",
                    confidence: "Medium",
                };
            return {
                detectedLanguage: "Multilingual text",
                confidence: "Medium",
                detectedScripts: detectedSets,
            };
        }

        // For Latin-based text, use language-specific patterns
        if (detectedSets.includes("latin")) {
            // Extract words for analysis
            const words = sample.match(/\b\w+\b/g) || [];
            if (words.length < 5)
                return {
                    detectedLanguage: "Unknown (insufficient text)",
                    confidence: "Low",
                };

            // Language fingerprints (common words, letter patterns, and character frequency)
            const languageData = [
                {
                    language: "English",
                    commonWords: [
                        "the",
                        "and",
                        "of",
                        "to",
                        "in",
                        "is",
                        "that",
                        "for",
                        "it",
                        "as",
                        "with",
                        "on",
                        "be",
                        "this",
                        "by",
                    ],
                    patterns: [/th/, /ing$/, /ly$/, /ed$/],
                    letters: "etaoinsrhldcumfpgwybvkxjqz", // Frequency order in English
                },
                {
                    language: "Spanish",
                    commonWords: [
                        "el",
                        "la",
                        "de",
                        "que",
                        "y",
                        "en",
                        "un",
                        "ser",
                        "por",
                        "con",
                        "para",
                        "no",
                        "como",
                        "su",
                        "lo",
                    ],
                    patterns: [/ción$/, /mente$/, /que /, /ado$/],
                    letters: "eaosnridltcumpbgyvqjfzhñxwk",
                },
                {
                    language: "French",
                    commonWords: [
                        "le",
                        "la",
                        "les",
                        "de",
                        "et",
                        "est",
                        "en",
                        "un",
                        "du",
                        "dans",
                        "qui",
                        "que",
                        "pas",
                        "pour",
                        "ce",
                    ],
                    patterns: [/aux$/, /eux$/, /ment$/, /tion$/],
                    letters: "easintrulocdpmvéfbqhgjàèyxêzâôùûîïëüçœw",
                },
                {
                    language: "German",
                    commonWords: [
                        "der",
                        "die",
                        "und",
                        "den",
                        "in",
                        "von",
                        "zu",
                        "das",
                        "mit",
                        "sich",
                        "des",
                        "auf",
                        "für",
                        "ist",
                        "im",
                    ],
                    patterns: [/ung$/, /lich$/, /sch/, /ein /],
                    letters: "enirstdaluhgcmobwfkzvüpäößjyqxéèê",
                },
                {
                    language: "Italian",
                    commonWords: [
                        "il",
                        "di",
                        "che",
                        "la",
                        "e",
                        "in",
                        "a",
                        "per",
                        "un",
                        "sono",
                        "si",
                        "con",
                        "su",
                        "da",
                        "non",
                    ],
                    patterns: [/zione$/, /anto$/, /ento$/, /ito$/],
                    letters: "eaionlrtscdupmvgfbzqhàòìèúù",
                },
                {
                    language: "Portuguese",
                    commonWords: [
                        "de",
                        "a",
                        "o",
                        "que",
                        "e",
                        "do",
                        "da",
                        "em",
                        "um",
                        "para",
                        "é",
                        "com",
                        "não",
                        "uma",
                        "os",
                    ],
                    patterns: [/ção$/, /ado$/, /inho$/, /mente$/],
                    letters: "eaosrdintmucplgvfbhqjzxkywç",
                },
                {
                    language: "Dutch",
                    commonWords: [
                        "de",
                        "het",
                        "een",
                        "van",
                        "en",
                        "in",
                        "is",
                        "dat",
                        "op",
                        "te",
                        "voor",
                        "zijn",
                        "met",
                        "die",
                        "niet",
                    ],
                    patterns: [/ij/, /lijk$/, /heid$/, /sch/],
                    letters: "entaoridhslgmvukpwbzjcfyxq",
                },
            ];

            // Score for each language
            const scores: { [language: string]: number } = {};
            languageData.forEach((lang) => {
                scores[lang.language] = 0;

                // Common words score
                const wordSet = new Set(words);
                lang.commonWords.forEach((word) => {
                    if (wordSet.has(word)) scores[lang.language] += 2;
                });

                // Pattern matching score
                lang.patterns.forEach((pattern) => {
                    const matches = sample.match(pattern) || [];
                    scores[lang.language] += matches.length * 0.5;
                });

                // Letter frequency analysis (simplified)
                const sampleLetters = sample.replace(/[^a-z]/gi, "");
                let letterScore = 0;
                for (let i = 0; i < Math.min(10, lang.letters.length); i++) {
                    const letter = lang.letters[i];
                    const count = (
                        sampleLetters.match(new RegExp(letter, "gi")) || []
                    ).length;
                    letterScore += (count * (10 - i)) / 100; // Weight by importance of letter
                }
                scores[lang.language] += letterScore;
            });

            // Find the highest score
            const sortedScores = Object.entries(scores).sort(
                (a, b) => b[1] - a[1]
            );
            const topLanguage = sortedScores[0][0];
            const topScore = sortedScores[0][1];

            // Calculate confidence based on score gap
            let confidence = "Low";
            if (sortedScores.length > 1) {
                const secondScore = sortedScores[1][1];
                const gap = topScore / (secondScore || 1);

                if (gap > 2) confidence = "High";
                else if (gap > 1.3) confidence = "Medium";
            }

            return {
                detectedLanguage: topLanguage,
                confidence,
                alternativePossibilities: sortedScores
                    .slice(1, 3)
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    .map(([lang, _]) => lang),
            };
        }

        return { detectedLanguage: "Unknown", confidence: "Low" };
    };

    // Helper function to determine reading level
    const getReadabilityLevel = (score: number) => {
        if (score <= 1) return "Kindergarten";
        if (score <= 2) return "1st Grade";
        if (score <= 3) return "2nd Grade";
        if (score <= 4) return "3rd Grade";
        if (score <= 5) return "4th Grade";
        if (score <= 6) return "5th Grade";
        if (score <= 7) return "6th Grade";
        if (score <= 8) return "7th Grade";
        if (score <= 9) return "8th Grade";
        if (score <= 10) return "9th Grade";
        if (score <= 11) return "10th Grade";
        if (score <= 12) return "11th-12th Grade";
        if (score <= 13) return "College Freshman";
        if (score <= 14) return "College Sophomore";
        if (score <= 15) return "College Junior";
        if (score <= 16) return "College Senior";
        return "Graduate Level";
    };

    const calculateReadTime = (wordCount: number) => {
        const wordsPerMinute = 225; // Average reading speed
        const minutes = wordCount / wordsPerMinute;

        if (minutes < 1 / 60) {
            return "Less than 1 second";
        }

        if (minutes < 1) {
            return `${Math.ceil(minutes * 60)} seconds`;
        }

        const fullMinutes = Math.floor(minutes);
        const seconds = Math.ceil((minutes - fullMinutes) * 60);

        if (seconds === 0) {
            return `${fullMinutes} minute${fullMinutes !== 1 ? "s" : ""}`;
        }

        return `${fullMinutes} minute${
            fullMinutes !== 1 ? "s" : ""
        } ${seconds} second${seconds !== 1 ? "s" : ""}`;
    };

    // Free APIs information
    const freeAPIInfo = [
        {
            name: "Meaningcloud",
            services: [
                "Language Detection",
                "Sentiment Analysis",
                "Text Classification",
            ],
            url: "https://www.meaningcloud.com/",
            freeTier: "Up to 20,000 requests/month (with some limitations)",
        },
        {
            name: "LanguageLayer",
            services: ["Language Detection"],
            url: "https://languagelayer.com/",
            freeTier: "Up to 500 requests/month",
        },
        {
            name: "Natural Language API by Google",
            services: [
                "Sentiment Analysis",
                "Entity Analysis",
                "Content Classification",
            ],
            url: "https://cloud.google.com/natural-language",
            freeTier: "Free quota of operations/month, then pay-as-you-go",
        },
        {
            name: "TextGears",
            services: ["Grammar Checking", "Language Detection"],
            url: "https://textgears.com/",
            freeTier: "Limited free API access",
        },
    ];

    return (
        <div className="min-h-screen p-3">
            <Head>
                <title>Advanced Text Metadata Generator</title>
                <meta
                    name="description"
                    content="Generate in-depth metadata and analyze text content"
                />
            </Head>

            <main className="max-w-4xl mx-auto">
                <div className="foreground p-6 rounded-lg shadow-input mb-6">
                    <h2 className="text-xl font-bold mb-4">Input Text</h2>
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="w-full p-3 border rounded-lg h-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Paste your text here to analyze..."
                    ></textarea>

                    <div className="mt-4 flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <button
                                onClick={analyzeText}
                                disabled={isAnalyzing || !inputText.trim()}
                                className={`w-full py-2 px-4 rounded-lg text-black ${
                                    isAnalyzing || !inputText.trim()
                                        ? "bg-primary/50 cursor-not-allowed"
                                        : "bg-primary hover:bg-blue-700"
                                }`}
                            >
                                {isAnalyzing ? "Analyzing..." : "Analyze Text"}
                            </button>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="useApi"
                                checked={useApi}
                                onChange={(e) => setUseApi(e.target.checked)}
                                className="mr-2"
                            />
                            <label htmlFor="useApi" className="text-sm">
                                Use External API
                            </label>
                        </div>
                    </div>

                    {useApi && (
                        <div className="mt-4">
                            <label
                                htmlFor="apiKey"
                                className="block text-sm font-medium mb-1"
                            >
                                API Key
                            </label>
                            <input
                                type="text"
                                id="apiKey"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your API key"
                            />

                            <div className="mt-3 text-sm text-white/60">
                                <p className="font-medium mb-1">
                                    Recommended Free APIs:
                                </p>
                                <ul className="list-disc pl-5">
                                    {freeAPIInfo.map((api, index) => (
                                        <li key={index} className="mb-2">
                                            <span className="font-medium">
                                                {api.name}
                                            </span>
                                            : {api.services.join(", ")}
                                            <div className="text-xs mt-1">
                                                <span className="text-green-600">
                                                    Free Tier:
                                                </span>{" "}
                                                {api.freeTier}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {metadata && (
                    <div className="foreground p-6 rounded-lg shadow-input mb-6">
                        <h2 className="text-xl font-bold mb-4">
                            Analysis Results
                        </h2>

                        {/* Basic Statistics */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <span className='whitespace-nowrap'>Basic Statistics</span>
                                <hr className='border-1 border-white/30 w-full grow'/>
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <div className="bg-background/30 shadow-inset p-3 rounded-md">
                                    <div className="text-sm text-white/70">
                                        Characters
                                    </div>
                                    <div className="text-lg font-medium">
                                        {metadata.basicStats.characters}
                                    </div>
                                </div>
                                <div className="bg-background/30 shadow-inset p-3 rounded-md">
                                    <div className="text-sm text-white/70">
                                        Characters (no spaces)
                                    </div>
                                    <div className="text-lg font-medium">
                                        {metadata.basicStats.charactersNoSpaces}
                                    </div>
                                </div>
                                <div className="bg-background/30 shadow-inset p-3 rounded-md">
                                    <div className="text-sm text-white/70">
                                        Words
                                    </div>
                                    <div className="text-lg font-medium">
                                        {metadata.basicStats.wordCount}
                                    </div>
                                </div>
                                <div className="bg-background/30 shadow-inset p-3 rounded-md">
                                    <div className="text-sm text-white/70">
                                        Sentences
                                    </div>
                                    <div className="text-lg font-medium">
                                        {metadata.basicStats.sentenceCount}
                                    </div>
                                </div>
                                <div className="bg-background/30 shadow-inset p-3 rounded-md">
                                    <div className="text-sm text-white/70">
                                        Paragraphs
                                    </div>
                                    <div className="text-lg font-medium">
                                        {metadata.basicStats.paragraphCount}
                                    </div>
                                </div>
                                <div className="bg-background/30 shadow-inset p-3 rounded-md">
                                    <div className="text-sm text-white/70">
                                        Avg. Word Length
                                    </div>
                                    <div className="text-lg font-medium">
                                        {metadata.basicStats.averageWordLength}
                                    </div>
                                </div>
                                <div className="bg-background/30 shadow-inset p-3 rounded-md">
                                    <div className="text-sm text-white/70">
                                        Avg. Words per Sentence
                                    </div>
                                    <div className="text-lg font-medium">
                                        {
                                            metadata.basicStats
                                                .averageWordsPerSentence
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Word Analysis */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <span className='whitespace-nowrap'>Word Analysis</span>
                                <hr className='border-1 border-white/30 w-full grow'/>
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <div className="mb-3">
                                        <div className="text-sm text-white/70">
                                            Longest Word
                                        </div>
                                        <div className="text-lg font-medium">
                                            {metadata.wordAnalysis.longestWord}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="text-sm text-white/70">
                                            Shortest Word
                                        </div>
                                        <div className="text-lg font-medium">
                                            {metadata.wordAnalysis.shortestWord}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="text-sm text-white/70">
                                            Unique Words
                                        </div>
                                        <div className="text-lg font-medium">
                                            {metadata.wordAnalysis.uniqueWords}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="text-sm text-white/70">
                                            Lexical Diversity
                                        </div>
                                        <div className="text-lg font-medium">
                                            {
                                                metadata.wordAnalysis
                                                    .lexicalDiversity
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-white/70 mb-2">
                                        Top Words
                                    </div>
                                    <div className="bg-background/30 shadow-inset p-3 rounded-md max-h-64 overflow-y-auto">
                                        {metadata.wordAnalysis.topWords.map(
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            ([word, count]: any, index: Key | null | undefined) => (
                                                <div
                                                    key={index}
                                                    className="flex justify-between mb-1 text-sm"
                                                >
                                                    <span>{word}</span>
                                                    <span className="font-medium">
                                                        {count}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Character Distribution */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <span className='whitespace-nowrap'>Character Distribution</span>
                                <hr className='border-1 border-white/30 w-full grow'/>
                            </h3>
                            <div className="bg-background/30 shadow-inset p-3 rounded-md grid grid-cols-3 sm:grid-cols-7 gap-2">
                                {metadata.charDistribution.map(
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    ([char, count]: any, index: Key | null | undefined) => (
                                        <div
                                            key={index}
                                            className="flex justify-evenly"
                                        >
                                            <span className="font-mono">
                                                {char === " "
                                                    ? "(space)"
                                                    : char}
                                            </span>
                                            <span className="font-medium">
                                                {count}
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Readability Metrics */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <span className='whitespace-nowrap'>Readability</span>
                                <hr className='border-1 border-white/30 w-full grow'/>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="bg-blue-400/10 p-4 rounded-md mb-4">
                                        <div className="text-sm text-white/60">
                                            Consensus Reading Level
                                        </div>
                                        <div className="text-xl font-bold text-blue-800">
                                            {
                                                metadata.readability
                                                    .readabilityConsensus
                                            }
                                        </div>
                                        <div className="text-sm text-white/60 mt-2">
                                            Average Grade Level:{" "}
                                            {
                                                metadata.readability
                                                    .averageGradeLevel
                                            }
                                        </div>
                                    </div>

                                    <div className="bg-green-400/10 p-4 rounded-md">
                                        <div className="text-sm text-white/60">
                                            Estimated Reading Time
                                        </div>
                                        <div className="text-xl font-bold text-green-800">
                                            {
                                                metadata.readability
                                                    .estimatedReadTime
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-background/30 shadow-inset p-3 rounded-md">
                                    <h4 className="font-medium mb-2">
                                        Readability Scores
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Flesch Reading Ease:</span>
                                            <span className="font-medium">
                                                {
                                                    metadata.readability
                                                        .fleschReadingEase
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Flesch-Kincaid Grade:</span>
                                            <span className="font-medium">
                                                {
                                                    metadata.readability
                                                        .fleschKincaidGrade
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Gunning Fog Index:</span>
                                            <span className="font-medium">
                                                {
                                                    metadata.readability
                                                        .gunningFogIndex
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>SMOG Index:</span>
                                            <span className="font-medium">
                                                {metadata.readability.smogIndex}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Automated Readability:</span>
                                            <span className="font-medium">
                                                {
                                                    metadata.readability
                                                        .automatedReadabilityIndex
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Coleman-Liau Index:</span>
                                            <span className="font-medium">
                                                {
                                                    metadata.readability
                                                        .colemanLiauIndex
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sentiment Analysis */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <span className='whitespace-nowrap'>Sentiment Analysis</span>
                                <hr className='border-1 border-white/30 w-full grow'/>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="bg-background/30 shadow-inset p-4 rounded-md mb-4">
                                        <div className="text-sm text-white/60">
                                            Overall Sentiment
                                        </div>
                                        <div
                                            className={`text-xl font-bold ${
                                                metadata.sentiment.overall.includes(
                                                    "Positive"
                                                )
                                                    ? "text-green-600"
                                                    : metadata.sentiment.overall.includes(
                                                          "Negative"
                                                      )
                                                    ? "text-red-600"
                                                    : "text-white/60"
                                            }`}
                                        >
                                            {metadata.sentiment.overall}
                                        </div>
                                        <div className="mt-3 text-sm">
                                            <div className="flex justify-between mb-1">
                                                <span>Polarity Score:</span>
                                                <span className="font-medium">
                                                    {
                                                        metadata.sentiment
                                                            .polarityScore
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Subjectivity Score:</span>
                                                <span className="font-medium">
                                                    {
                                                        metadata.sentiment
                                                            .subjectivityScore
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-purple-400/10 p-4 rounded-md">
                                        <div className="text-sm text-white/60">
                                            Primary Emotion
                                        </div>
                                        <div className="text-xl font-bold text-purple-800">
                                            {metadata.sentiment.primaryEmotion}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="bg-background/30 shadow-inset p-3 rounded-md mb-4">
                                        <h4 className="font-medium mb-2">
                                            Word Sentiment
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-green-600">
                                                    Positive Words:
                                                </span>
                                                <span className="font-medium">
                                                    {
                                                        metadata.sentiment
                                                            .positiveWords
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-red-600">
                                                    Negative Words:
                                                </span>
                                                <span className="font-medium">
                                                    {
                                                        metadata.sentiment
                                                            .negativeWords
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Intensifiers:</span>
                                                <span className="font-medium">
                                                    {
                                                        metadata.sentiment
                                                            .intensifierCount
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Diminishers:</span>
                                                <span className="font-medium">
                                                    {
                                                        metadata.sentiment
                                                            .diminisherCount
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Negators:</span>
                                                <span className="font-medium">
                                                    {
                                                        metadata.sentiment
                                                            .negatorCount
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-background/30 shadow-inset p-3 rounded-md">
                                        <h4 className="font-medium mb-2">
                                            Emotion Breakdown
                                        </h4>
                                        <div className="space-y-1">
                                            {Object.entries(
                                                metadata.sentiment
                                                    .emotionBreakdown
                                            ).map(([emotion, count]) => (
                                                <div
                                                    key={emotion}
                                                    className="flex justify-between text-sm"
                                                >
                                                    <span className="capitalize">
                                                        {emotion}:
                                                    </span>
                                                    <span className="font-medium">
                                                        {count as number}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Language Detection */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <span className='whitespace-nowrap'>Language Detection</span>
                                <hr className='border-1 border-white/30 w-full grow'/>
                            </h3>
                            <div className="bg-background/30 shadow-inset p-4 rounded-md">
                                <div className="text-sm text-white/60">
                                    Detected Language
                                </div>
                                <div className="text-xl font-bold">
                                    {metadata.language.detectedLanguage}
                                    <span className="ml-2 text-sm font-normal text-white/70">
                                        (Confidence:{" "}
                                        {metadata.language.confidence})
                                    </span>
                                </div>

                                {metadata.language.alternativePossibilities && (
                                    <div className="mt-3 text-sm">
                                        <div className="font-medium">
                                            Alternative Possibilities:
                                        </div>
                                        <div className="text-white/60">
                                            {metadata.language.alternativePossibilities.join(
                                                ", "
                                            )}
                                        </div>
                                    </div>
                                )}

                                {metadata.language.detectedScripts && (
                                    <div className="mt-3 text-sm">
                                        <div className="font-medium">
                                            Detected Scripts:
                                        </div>
                                        <div className="text-white/60">
                                            {metadata.language.detectedScripts
                                                .map(
                                                    (script: string) =>
                                                        script
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                        script.slice(1)
                                                )
                                                .join(", ")}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}