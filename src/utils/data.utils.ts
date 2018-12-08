import { map } from 'lodash'

type CleanTweet = {
  text: string
  createdAt: string
  location?: string
  geo?: string
  coordinates?: string
  place?: string
}

export const cleanTweets = (tweets: Array<any>): Array<CleanTweet> =>
  map(tweets, (tweet) => {
    return {
      text: tweet.text,
      createdAt: tweet.created_at,
      location: tweet.user.location || null,
      geo: tweet.geo || null,
      coordinates: tweet.coordinates || null,
      place: tweet.place || null,
      lang: tweet.lang || tweet.user.lang || null,
    }
  })
