type Contributors = {
  id: number
  id_str: string
  screen_name: string
}
type Size = {
  h: number
  w: number
  resize: 'crop' | 'fit'
}
type Sizes = {
  thumb: Size
  large: Size
  medium: Size
  small: Size
}
type HashtagEntity = {
  indices: [number, number]
  text: string
}
type MediaEntity = {
  id: number
  id_str: string
  indices: [number, number]
  url: string
  display_url: string
  expanded_url: string
  media_url: string
  media_url_https: string
  sizes: Sizes
  source_status_id: number
  source_status_id_str: string
  type: string
}
type UrlEntity = {
  url: string
  display_url: string
  expanded_url: string
  indices: [number, number]
}
type UserMentionEntity = {
  id: number
  id_str: string
  indices: [number, number]
  name: string
  screen_name: string
}
type Entities = {
  hashtags: HashtagEntity[]
  media: MediaEntity[]
  urls: UrlEntity[]
  user_mentions: UserMentionEntity[]
}
type PlaceAttribute = {
  street_address: string
  locality: string
  region: string
  iso3: string
  postal_code: string
  phone: string
  twitter: string
  url: string
  'app:id': string
}
type Place = {
  geometry: GeoJSON.Point
  attributes: PlaceAttribute
  bounding_box: GeoJSON.Polygon
  contained_within: Place[]
  country: string
  country_code: string
  full_name: string
  id: string
  name: string
  place_type: string
  url: string
}
type User = {
  contributors_enabled: boolean
  created_at: string
  default_profile: string
  default_profile_image: string
  description: string
  entities: Entities
  favourites_count: number
  follow_request_sent?: boolean
  following?: boolean
  followers_count: number
  friends_count: number
  geo_enabled?: boolean
  id: number
  id_str: string
  is_translator?: boolean
  lang: string
  listed_count: number
  location: string
  name: string
  notifications?: boolean
  profile_background_color: string
  profile_background_image_url: string
  profile_background_image_url_https: string
  profile_background_tile: boolean
  profile_banner_url: string
  profile_image_url: string
  profile_image_url_https: string
  profile_link_color: string
  profile_sidebar_border_color: string
  profile_sidebar_fill_color: string
  profile_text_color: string
  profile_use_background_image: boolean
  protected: boolean
  screen_name: string
  show_all_inline_media: boolean
  status?: Tweet
  statuses_count: number
  time_zone?: string
  url: string
  utc_offset?: number
  verified: boolean
  withheld_in_countries: string
  withheld_scope: string
}
type Tweet = {
  id: number
  id_str: string
  annotations?: Object
  contributors?: Contributors[]
  coordinates?: GeoJSON.Point
  created_at: string
  current_user_retweet?: {
    id: number
    id_str: string
  }
  entities: Entities
  favorite_count?: number
  favorited?: boolean
  filter_level: 'none' | 'low' | 'medium'
  geo?: Object
  in_reply_to_screen_name?: string
  in_reply_to_status_id?: number
  in_reply_to_status_id_str?: string
  in_reply_to_user_id?: number
  in_reply_to_user_id_str?: string
  lang?: string
  place?: Place
  possibly_sensitive?: boolean
  quoted_status_id?: number
  quoted_status_id_str?: string
  quoted_status?: Tweet
  scopes?: Object
  retweet_count: number
  retweeted: boolean
  retweeted_status?: Tweet
  source?: string
  text?: string
  full_text?: string
  truncated: boolean
  user: User
  withheld_copyright?: boolean
  withheld_in_countries?: string[]
  withheld_scope?: string
  display_text_range?: [number, number]
}

type TweetSummary = {
  user: User
  favorites: number
  retweets: number
  timestamp: string
  text: string
}
