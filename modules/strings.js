
module.exports = {
    pleaseProvideBothWordAndDefinition: 'Please provide both word and definition.',
    warningWordAlreadyExists: word => `Warning! '${word}' already exists.`,
    requestNewEntryRecorded: (requestCount, word, definition, wordCount) => ({
      message: `Request # ${requestCount} - New entry recorded:`,
      entry: { word, definition },
      words: `Amount of entries ${wordCount}`
    }),
    requestWordNotFound: (requestCount, word) => `Request # ${requestCount + 1}, word '${word}' not found!`,
    notFound: 'Not Found'
  };
  