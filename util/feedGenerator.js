const twitterModel = require("../models/twitterPostModel");
const telegramModel = require("../models/telegramPostModel");
const { Feed } = require("../consts.json");
async function generateFeed() {
  let messages = [];
  const tweets = await twitterModel
    .find({})
    .sort({ epochTime: "descending" })
    .limit(Feed.maxLength);
  const telegramMessages = await telegramModel
    .find({})
    .sort({ epochTime: "descending" })
    .limit(Feed.maxLength);

  messages = tweetsToFeed(tweets);
  messages = messages.concat(telegramToFeed(telegramMessages));

  messages = messages.sort((a, b) => b.epochTime - a.epochTime);

  messages.length = Math.min(messages.length, Feed.maxLength);

  return {
    maxMessages: Feed.maxLength,
    messages: messages,
    stopTheWarInUkraine: "yes please :)",
  };
}

function tweetsToFeed(tweets) {
  let messages = [];
  tweets.forEach((tweet) => {
    messages.push({
      created_at: tweet.created_at,
      text: tweet.full_text,
      messageURL: `https://twitter.com/${tweet.authorUsername}/status/${tweet.tweetID}`,
      images: tweet.images,
      videos: tweet.videos,
      author: tweet.authorUsername,
      epochTime: tweet.epochTime,
      categories: tweet.categories,
      type: "twitter",
      twitterData: {
        tweetID: tweet.tweetID,
        authorID: tweet.authorID,
        authorUsername: tweet.authorUsername,
        authorDisplayName: tweet.authorDisplayName,
        profileImage: tweet.profileImage,
      },
    });
  });
  return messages;
}

function telegramToFeed(telegramMessages) {
  let messages = [];
  telegramMessages.forEach((message) => {
    messages.push({
      created_at: message.time,
      text: message.text,
      messageURL: message.messageURL,
      images: message.image ? [message.image] : [],
      videos: message.video ? [message.video] : [],
      author: message.user,
      epochTime: message.epochTime,
      categories: message.categories,
      type: "telegram",
      telegramData: {
        messageId: message.messageId,
        authorName: message.authorName,
      },
    });
  });
  return messages;
}

module.exports = { generateFeed };
