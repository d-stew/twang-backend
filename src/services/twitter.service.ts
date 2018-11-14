const Twitter = require('twitter');

import { map } from 'lodash';
import { log } from '../utils/log.utils';

type TwitterOptions = {
  q: string;
  lang?: string;
};

type CleanTweet = {
  text: string;
  createdAt: string;
  location?: string;
  geo?: string;
  coordinates?: string;
  place?: string;
};

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

export const getTweets = (term: string, callback: Function, options?: TwitterOptions): Promise<any> => {
  return client.get(
    'search/tweets',
    { ...options, q: term },
    (error: any, tweets: any) => {
      if (error) {
        log.info(error)
        return callback({ error, data: [] });
      }
      return callback(tweets);
    }
  );
};

export const cleanTweets = (tweets: Array<any>): Array<CleanTweet> => {
  return map(tweets, (tweet) => {
    return {
      text: tweet.text,
      createdAt: tweet.created_at,
      location: tweet.user.location || null,
      geo: tweet.geo || null,
      coordinates: tweet.coordinates || null,
      place: tweet.place || null,
      lang: tweet.lang || tweet.user.lang || null,
    };
  });
};
