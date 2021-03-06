import { User } from '@src/models/user';
import { AuthService } from '@src/services/auth';
import { Methods, doRequest } from '../../util/doRequest';

describe('/users/create', () => {
    afterEach(async () => {
        await User.deleteMany({});
    });
    beforeAll(async () => {
        await User.deleteMany({});
    });

    describe('When creating a new user', () => {
        const userData = {
            name: 'username',
            password: '123456',
            email: 'username@mail.com',
        };

        it('should create a new user with success and return 201', async () => {
            const options = {
                method: Methods.post,
            };

            const body = {
                ...userData,
            };

            const response = await doRequest('/users/create', body, options);

            const user = await User.findOne({ email: body.email });
            expect(response.status).toBe(201);
            expect(user).toBeTruthy();
        });

        it('should create a user with hashed password', async () => {
            const options = {
                method: Methods.post,
            };

            const body = {
                ...userData,
            };

            await doRequest('/users/create', body, options);

            const user = await User.findOne({ email: body.email });
            await expect(
                AuthService.comparePassword(
                    userData.password,
                    user?.password || ''
                )
            ).resolves.toBeTruthy();
        });

        it('should return 409 if user already exists', async () => {
            await new User(userData).save();

            const body = {
                ...userData,
            };

            const options = {
                method: Methods.post,
            };

            const response = await doRequest('/users/create', body, options);
            expect(response.status).toBe(409);
        });
    });
});
