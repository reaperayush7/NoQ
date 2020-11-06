const User        = require('../src/models/user');
const mongoose = require('mongoose');
const url = 'mongodb+srv://admin:Coolayush1@cluster0-exkjk.mongodb.net/noQ_test?retryWrites=true&w=majority'
beforeAll(async () => {
    await mongoose.connect(url, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,})})
afterAll(async () => {await mongoose.connection.close();})
describe("Users' Tests", () => {
    it('Testing if creating new user works', () => {
        const user = {
            'name': 'Test',
            'email': 'testing123@gmail.com',
            'profilePicture': 'profilePicture-150123123.png',
            'description': 'This is user create testing',
            'password': '12345678'
        };
        return User.create(user).then((user_test) => {
            expect(user_test.name).toEqual('Test')
        });
    })
})
