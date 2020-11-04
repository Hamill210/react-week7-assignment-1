import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { useDispatch, useSelector } from 'react-redux';

import LoginFormContainer from './LoginFormContainer';

jest.mock('react-redux');

describe('LoginFormContainer', () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    dispatch.mockClear();

    useDispatch.mockImplementation(() => dispatch);

    useSelector.mockImplementation((selector) => selector({
      loginFields: {
        email: '',
        password: '',
      },
      accessToken: given.accessToken,
    }));
  });

  context('when logged in', () => {
    given('accessToken', () => 'ACCESS_TOCKEN');

    it('render log out button', () => {
      const { getByText } = render(<LoginFormContainer />);

      expect(getByText('Log out')).not.toBeNull();
    });

    it('listens click event', () => {
      const { getByText } = render(<LoginFormContainer />);

      fireEvent.click(getByText('Log out'));

      expect(dispatch).toBeCalledWith({
        type: 'setAccessToken',
        payload: { accessToken: null },
      });
    });
  });

  context('when logged out', () => {
    given('accessToken', () => null);

    const controls = [
      {
        label: 'E-mail',
        name: 'email',
        value: 'test',
      },
      {
        label: 'Password',
        name: 'password',
        value: 'test',
      },
    ];

    it('renders input controls', () => {
      const { getByLabelText } = render(<LoginFormContainer />);

      controls.forEach(({ label }) => {
        expect(getByLabelText(label)).not.toBeNull();
      });
    });

    it('renders "Log In" button', () => {
      const { getByText } = render(<LoginFormContainer />);

      expect(getByText('로그인')).not.toBeNull();
    });

    it('listens change events', () => {
      const { getByLabelText } = render(<LoginFormContainer />);

      controls.forEach(({ label, name, value }) => {
        const input = getByLabelText(label);

        fireEvent.change(input, { target: { value } });

        expect(dispatch).toBeCalledWith({
          type: 'changeLoginFields',
          payload: { name, value },
        });
      });
    });

    it('listens click event', () => {
      const { getByText } = render(<LoginFormContainer />);

      fireEvent.click(getByText('로그인'));

      expect(dispatch).toBeCalled();
    });
  });
});
