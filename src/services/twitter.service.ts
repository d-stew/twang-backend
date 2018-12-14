const Twitter = require('twitter')
const io = require('socket.io')()
const { log } = require('../utils/log.utils')

io.listen(8000)

type TwitterOptions = {
  q: string
  lang?: string
}

type Location = {
  latitude: number
  longitude: number
}

type TwitterData = {
  count: number
  locations: Array<Location>
  languages: { [key: string]: number }
  tweets: Array<TweetSummary>
}

const twitterData: TwitterData = {
  count: 0,
  locations: [],
  languages: {},
  tweets: [],
}

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
})

io.on('connection', (socket: any) => {
  console.log('*** Client connected ***')

  socket.on('startSocket', () => {
    setInterval(() => {
      socket.emit('twitterData', { twitterData })
    }, 10000)
  })

  socket.on('disconnect', () => {
    console.log('*** Client disconnected ***')
    twitterData.count = 0
    twitterData.tweets.length = 0
    twitterData.locations = []
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

export const getUserTweets = (username: string, callback: Function) => {
  client.get('statuses/user_timeline', { screen_name: username }, (error: any, userData: any) => {
    if (error) {
      log.info(error)
      return callback({ error, data: [] })
    }

    return callback(userData)
  })
}

export const openStream = (keyword: string): string => {
  const stream = client.stream('statuses/filter', { track: keyword })

  stream.on('data', (event: Tweet) => {
    parseTweet(event)
  })

  stream.on('error', (error: Error) => {
    throw error
  })

  return 'Stream open'
}

function parseTweet(tweet: Tweet) {
  checkLanguages(tweet)

  checkLocations(tweet)

  checkText(tweet)
}

function checkLanguages(tweet: Tweet): void {
  if (twitterData.languages[tweet.lang!]) {
    twitterData.languages[tweet.lang!] += 1
  } else {
    twitterData.languages[tweet.lang!] = 1
  }
}

function checkLocations(tweet: Tweet): void {
  if (tweet.place && tweet.place.bounding_box) {
    const [[[longitude, latitude]]] = tweet.place.bounding_box.coordinates

    twitterData.locations.push({ longitude, latitude })
  }

  if (tweet.coordinates) {
    // TODO: Handle coordinates
    console.log('tweet.coordinates', tweet.coordinates)
  }

  if (tweet.geo) {
    // TODO: Handle geo
    console.log('tweet.geo', tweet.geo)
  }
}

function checkText(tweet: Tweet): void {
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
