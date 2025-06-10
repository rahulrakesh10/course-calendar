import chrono from 'chrono-node';

export function extractDatesFromText(text) {
    const results = chrono.parse(text);
    return results.map((result) => {
      const context = result.text;
      const date = result.start.date();
      return {
        title: context.length > 50 ? context.slice(0, 50) + '...' : context,
        date,
      };
    });
  }
  