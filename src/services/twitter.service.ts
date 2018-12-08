const Twitter = require('twitter')

import { log } from '../utils/log.utils'

type TwitterOptions = {
  q: string
  lang?: string
}

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
})

export const getTweets = (term: string, callback: Function, options?: TwitterOptions): Promise<any> =>
  client.get('search/tweets', { ...options, q: term }, (error: any, tweets: any) => {
    if (error) {
      log.info(error)
      return callback({ error, data: [] })
    }
    return callback(tweets)
  })


