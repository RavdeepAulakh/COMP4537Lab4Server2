
module.exports = {
    pleaseProvideBothWordAndDefinition: 'Please provide both word and definition.',
    warningWordAlreadyExists: word => `Warning! '${word}' already exists.`,
    requestNewEntryRecorded: (requestCount, word, definition) => ({
      message: `Request # ${requestCount} - New entry recorded:`,
      entry: { word, definition }
    }),
    requestWordNotFound: (requestCount, word) => `Request # ${requestCount + 1}, word '${word}' not found!`,
    notFound: 'Not Found'
  };
  