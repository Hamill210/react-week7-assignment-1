import thunk from 'redux-thunk';

import configureStore from 'redux-mock-store';

import {
  loadInitialData,
  setRegions,
  setCategories,
  loadRestaurants,
  loadRestaurant,
  setRestaurants,
  setRestaurant,
  requestLogin,
  setAccessToken,
  sendReview,
  logout,
  changeReviewField,
  loadReview,
} from './actions';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

jest.mock('./services/api');

describe('actions', () => {
  let store;

  describe('loadInitialData', () => {
    beforeEach(() => {
      store = mockStore({});
    });

    it('runs setRegions and setCategories', async () => {
      await store.dispatch(loadInitialData());

      const actions = store.getActions();

      expect(actions[0]).toEqual(setRegions([]));
      expect(actions[1]).toEqual(setCategories([]));
    });
  });

  describe('loadRestaurants', () => {
    context('with selectedRegion and selectedCategory', () => {
      beforeEach(() => {
        store = mockStore({
          selectedRegion: { id: 1, name: '서울' },
          selectedCategory: { id: 1, name: '한식' },
        });
      });

      it('runs setRestaurants', async () => {
        await store.dispatch(loadRestaurants());

        const actions = store.getActions();

        expect(actions[0]).toEqual(setRestaurants([]));
      });
    });

    context('without selectedRegion', () => {
      beforeEach(() => {
        store = mockStore({
          selectedCategory: { id: 1, name: '한식' },
        });
      });

      it('does\'nt run any actions', async () => {
        await store.dispatch(loadRestaurants());

        const actions = store.getActions();

        expect(actions).toHaveLength(0);
      });
    });

    context('without selectedCategory', () => {
      beforeEach(() => {
        store = mockStore({
          selectedRegion: { id: 1, name: '서울' },
        });
      });

      it('does\'nt run any actions', async () => {
        await store.dispatch(loadRestaurants());

        const actions = store.getActions();

        expect(actions).toHaveLength(0);
      });
    });
  });

  describe('loadRestaurant', () => {
    beforeEach(() => {
      store = mockStore({});
    });

    it('dispatchs setRestaurant', async () => {
      await store.dispatch(loadRestaurant({ restaurantId: 1 }));

      const actions = store.getActions();

      expect(actions[0]).toEqual(setRestaurant(null));
      expect(actions[1]).toEqual(setRestaurant({}));
    });
  });

  describe('requestLogin', () => {
    context('with login fields', () => {
      beforeEach(() => {
        store = mockStore({
          loginFields: {
            email: 'test@email.com',
            password: '123',
          },
        });
      });

      it('requests Login', async () => {
        await store.dispatch(requestLogin());

        const actions = store.getActions();
        expect(actions[0]).toEqual(setAccessToken({}));
      });
    });
  });

  describe('sendReview', () => {
    context('with restaurant id', () => {
      beforeEach(() => {
        store = mockStore({
          restaurantId: '1,',
          reviewFields: {},
          accessToken: 'ACCESS_TOKEN',
        });
      });

      it('load reviews', async () => {
        await store.dispatch(sendReview({ restaurantId: 1 }));

        const actions = store.getActions();

        expect(actions[0]).toEqual(changeReviewField({ name: 'score', value: '' }));
        expect(actions[1]).toEqual(changeReviewField({ name: 'description', value: '' }));
      });
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      store = mockStore({
        accessToken: 'ACCESS_TOKEN',
      });
    });

    it('requests logout', async () => {
      await store.dispatch(logout());

      const actions = store.getActions();
      expect(actions[0]).toEqual(logout());
    });
  });
});
