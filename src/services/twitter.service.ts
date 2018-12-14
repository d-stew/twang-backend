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

type UserTweets = Array<Tweet>

type TopTweet = {
  username: string
  retweets: number
  favorites: number
  engagement: number
  timestamp: string
  text?: string
}

type TopTweets = Array<TopTweet>

type MonthlyStats = { [key: string]: { tweets: number; engagement: number; } }

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
  client.get('statuses/user_timeline', { screen_name: username, count: 200, exclude_replies: true, tweet_mode: 'extended' }, (error: any, userTweets: UserTweets) => {
    if (error) {
      log.info(error)
      return callback({ error, data: [] })
    }

    const response = getUserData(userTweets)

    return callback(response)
  })
}

export const getUserProfilePic = (username: string) => {
  return client.get('users/show', { screen_name: username })
}

export const openStream = (keyword: string): string => {
  const stream = client.stream('statuses/filter', { track: keyword })

  stream.on('data', (event: Tweet) => {
    parseLiveTweet(event)
  })

  stream.on('error', (error: Error) => {
    throw error
  })

  return 'Stream open'
}

type UserDataResponse = { topTweets: TopTweets; monthlyStats: MonthlyStats}
function getUserData(userTweets: UserTweets): UserDataResponse {
  const topTweets: TopTweets = []
  const monthlyStats: MonthlyStats = {}

  userTweets.forEach((tweet: Tweet) => {
    const tweetSummary = {
      username: tweet.user.screen_name,
      timestamp: tweet.created_at,
      month: tweet.created_at.split(' ')[1],
      retweets: tweet.retweet_count || 0,
      favorites: tweet.favorite_count || 0,
      engagement: tweet.retweet_count + (tweet.favorite_count || 0),
      text: tweet.full_text,
    }

    if (topTweets.length < 5) {
      topTweets.push(tweetSummary)
    } else {
      const engagementScores = topTweets.map((tweet) => tweet.engagement)
      const min = engagementScores.reduce((a,b): number => Math.min(a,b))
      const index: number = engagementScores.indexOf(min)

      tweetSummary.engagement > min ? topTweets[index] = tweetSummary : null
    }

    if (!monthlyStats[tweetSummary.month]) {
      monthlyStats[tweetSummary.month] = {
        engagement: tweetSummary.engagement,
        tweets: 1,
      }
    } else {
      monthlyStats[tweetSummary.month].tweets += 1
      monthlyStats[tweetSummary.month].engagement += tweetSummary.engagement
    }
  })

  return { topTweets, monthlyStats }
}

function parseLiveTweet(tweet: Tweet) {
  parseLanguages(tweet)
  parseLocations(tweet)
  parseText(tweet)
}

function parseLanguages(tweet: Tweet): void {
  if (twitterData.languages[tweet.lang!]) {
    twitterData.languages[tweet.lang!] += 1
  } else {
    twitterData.languages[tweet.lang!] = 1
  }
}

function parseLocations(tweet: Tweet): void {
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

function parseText(tweet: Tweet): void {
  if (tweet.text) {
    twitterData.tweets.push({
      user: tweet.user,
      favorites: tweet.favorite_count || 0,
      retweets: tweet.retweet_count,
      timestamp: tweet.created_at,
      text: tweet.text,
    })
  }
}
