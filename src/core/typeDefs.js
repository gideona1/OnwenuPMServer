export const typeDefs = `#graphql
  scalar Date
  
  type Query {
    getUser: User
    getAllUsers(query: String): [User]
    getPaymentInfo(paymentId: ID!): Payment
    getPastDuePaymentInfo: [Payment]
    getPaymentHistoryInfo: [Payment]
    getUpcomingPaymentInfo: Payment
    getChargeInfo(paymentId: ID!): Charge
    verifyUser: Boolean
  }

  type Mutation {
    createVerification(email: String!): Boolean
    createPayments(userId: ID!, amount: Int!): Boolean
    createUser(name: String, email: String!, phoneNumber: String!, notTenant: Boolean): User
    verifyCode(email: String!, code: String!): Token
    paymentSheet(paymentId: ID!): PaymentSheet
  }

  type User {
    id: ID
    phoneNumber: String,
    email: String,
    name: String,
    rentMonthly: Int,
    balance: Int,
    propertyID: ID,
    userType: String
  }

  type Token {
    accessToken: String
  }

  type Charge {
    status: String
    amount: Int
    created: Date
    paymentMethod: String
    paymentLastFour: String
    receiptNumber: String
    receiptLink: String
  }

  type Payment {
    id: ID
    paymentIntent: PaymentIntent
    owner: ID
    dueDate: Date
  }

  type PaymentIntent {
    id: String
    status: String
    amount: Int
  }

  type PaymentSheet {
    paymentIntent: String
    ephemeralKey: String
    customer: String
    customerDefaultInfo: User
    publishableKey: String
  }
`;
