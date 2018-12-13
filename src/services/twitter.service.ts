const Twitter = require('twitter')
const io = require('socket.io')()
const { log } = require('../utils/log.utils')

io.listen(8000)

type TwitterOptions = {
  q: string
  lang?: string
}

type TwitterData = {
  count: number
  locations: { [key: string]: number }
  languages: { [key: string]: number }
  tweets: Array<TweetSummary>
}

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
})

const twitterData: TwitterData = {
  count: 0,
  locations: {},
  languages: {},
  tweets: [],
}

io.on('connection', (socket: any) => {
  console.log('*** Client connected ***')

  setInterval(() => {
    socket.emit('twitterData', { twitterData })
  }, 10000)

  socket.on('disconnect', () => {
    console.log('*** Client disconnected ***')
    twitterData.count = 0
    twitterData.tweets.length = 0
    twitterData.locations = {}
    twitterData.languages = {}
  })
})

export const getTweets = (term: string, callback: Function, options?: TwitterOptions): Promise<any> =>
  client.get('search/tweets', { ...options, q: term }, (error: any, tweets: any) => {
    if (error) {
      log.info(error)
      return callback({ error, data: [] })
    }
    return callback(tweets)
  })

export const openStream = (term: string): string => {
  const stream = client.stream('statuses/filter', { track: term })

  stream.on('data', (event: Tweet) => {
    console.log('EVENT', event)

    parseTweet(event)
  })

  stream.on('error', (error: Error) => {
    throw error
  })

  return 'Stream open'
}

function parseTweet(tweet: Tweet) {
  if (twitterData.languages[tweet.lang!]) {
    twitterData.languages[tweet.lang!] += 1
  } else {
    twitterData.languages[tweet.lang!] = 1
  }

  if (tweet.geo || tweet.coordinates || tweet.place) {
    console.log('geo', tweet.geo, 'coordinates', tweet.coordinates, 'place', tweet.place)
  }

  if (tweet.text) {
    twitterData.tweets.push({
      user: tweet.user,
      favorites: tweet.favorite_count || 0,
      retweets: tweet.retweet_count,
      timestamp: tweet.created_at,
      text: tweet.text
    })
  }

}


