const User = require('./User')
const Guide = require('./Guide')
const Agency = require('./Agency')
const GuideAgency = require('./GuideAgency')
const Booking = require('./Booking')
const Review = require('./Review')
const Conversation = require('./Conversation')
const Message = require('./Message')
const Post = require('./Post')
const Story = require('./Story')
const Circuit = require('./Circuit')
const Activity = require('./Activity')
const Payment = require('./Payment')
const Notification = require('./Notification')
const Favorite = require('./Favorite')

User.hasOne(Guide, { foreignKey: 'userId', as: 'guide' })
Guide.belongsTo(User, { foreignKey: 'userId', as: 'user' })

User.hasOne(Agency, { foreignKey: 'userId', as: 'agency' })
Agency.belongsTo(User, { foreignKey: 'userId', as: 'user' })

Guide.belongsToMany(Agency, { through: GuideAgency, foreignKey: 'guideId', as: 'agencies' })
Agency.belongsToMany(Guide, { through: GuideAgency, foreignKey: 'agencyId', as: 'guides' })

Booking.belongsTo(User, { foreignKey: 'touristId', as: 'tourist' })
Booking.belongsTo(Guide, { foreignKey: 'guideId', as: 'guide' })
Booking.belongsTo(Agency, { foreignKey: 'agencyId', as: 'agency' })
Booking.hasMany(Payment, { foreignKey: 'bookingId', as: 'payments' })

Review.belongsTo(User, { foreignKey: 'reviewerId', as: 'reviewer' })
Review.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' })

Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'messages' })
Message.belongsTo(Conversation, { foreignKey: 'conversationId', as: 'conversation' })

Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' })
Story.belongsTo(User, { foreignKey: 'authorId', as: 'author' })

Circuit.belongsTo(User, { foreignKey: 'authorId', as: 'author' })
Activity.belongsTo(User, { foreignKey: 'authorId', as: 'author' })

Payment.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' })
Payment.belongsTo(User, { foreignKey: 'payerId', as: 'payer' })
Payment.belongsTo(User, { foreignKey: 'payeeId', as: 'payee' })

Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' })

Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' })

module.exports = {
  User,
  Guide,
  Agency,
  GuideAgency,
  Booking,
  Review,
  Conversation,
  Message,
  Post,
  Story,
  Circuit,
  Activity,
  Payment,
  Notification,
  Favorite,
}
