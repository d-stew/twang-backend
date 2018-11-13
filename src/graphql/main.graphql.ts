import { gql } from 'apollo-server-express'

import * as twitterService from '../services/twitter.service'

const TwitterDataType = gql`
  type TwitterData {
    tweet: String!
  }
`

const getTweets = async (_: {}, { keyword }: { keyword: string }) => twitterService.getTweets(keyword)

export const types = [
  TwitterDataType,
]

export const queryResolvers = {
  getTweets,
}
export const queries = `
  """
  Get all tweets that include provided keyword
  """
  getTweets: TwitterData
`
export const mutationResolvers = {}
export const mutations = ``
