import { ThisError } from '../../../../error/this-error';
import { User } from './user.value';

describe('User（値オブジェクト）', () => {
  describe('.init', () => {
    const sut = User;

    test('userが生成される', () => {
      const [user, error] = sut.init('user_uuid');
      expect(user).toBeInstanceOf(User);
      expect(error).toBeNull();
    });

    test('uuidが空文字の場合、エラーが返る', async () => {
      const [user, error] = sut.init('');
      expect(user).toBeNull();
      expect(error).toBeInstanceOf(ThisError);
    });
  });
});
