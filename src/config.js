export const REST_API_ENDPOINT = `https://shrouded-stream-44632-cd39131a61d5.herokuapp.com`;
export const REGISTER_USER_ENDPOINT = `${REST_API_ENDPOINT}/register`;
export const LOGIN_USER_ENDPOINT = `${REST_API_ENDPOINT}/login`;
export const USER_METADATA_ENDPOINT = `${REST_API_ENDPOINT}/user-metadata`;
export const USER_VIDEOS_ENDPOINT = `${REST_API_ENDPOINT}/user-videos`;
export const ADD_BIO_ENDPOINT = `${REST_API_ENDPOINT}/bio`;
export const UPLOAD_VIDEO_ENDPOINT = `${REST_API_ENDPOINT}/upload-video`;
export const REGISTERED_USERS_ENDPOINT = `${REST_API_ENDPOINT}/registered-users`;
export const LISTING_VIDEOS_LIMIT = 5;
export const ADD_BIO_CONFIG = {
  MAXIMUM_WORDS_COUNT: 500,
  MINIMUM_WORDS_COUNT: 1,
};
export const UPLOAD_VIDEO_CONFIG = {
  MAX_FILE_SIZE_IN_MB: 6,
  ACCEPTED_FILE_TYPES: ["video/mp4"],
  TITLE_MAX_WORDS: 30,
  DESCRIPTION_MAX_WORDS: 120,
};
