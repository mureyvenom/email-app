import { createSelector } from 'reselect';

const selectUser = (state) => state.user;

export const selectUsername = createSelector(
    [selectUser],
    (user) => user.username
);

export const selectCurrentUser = createSelector(
    [selectUser],
    user => user.currentUser
);

export const selectLoginError = createSelector(
    [selectUser],
    user => user.loginError
)