// netlify/functions/getNews.js

exports.handler = async (event) => {
  // Dynamically import node-fetch
  const fetch = (await import('node-fetch')).default;

  const { queryStringParameters } = event;
  const { q, page = 1, pageSize = 6 } = queryStringParameters;

  const apiKey = process.env.REACT_APP_NEWS_API_KEY;
  const baseUrl = 'https://newsapi.org/v2/';
  const url = q
    ? `${baseUrl}everything?q=${q}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`
    : `${baseUrl}top-headlines?country=us&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error('Fetch error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch news' }),
    };
  }
};
