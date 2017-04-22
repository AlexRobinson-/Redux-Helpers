# Alex's Redux Helpers

## Actions

### action(type, payload, meta)

```js
/**
* This will return
* 
* {
*   type: 'DO_STUFF',
*   payload: {
*     whatStuff: 'look at cat pictures'
*   },
*   meta: {}
* }
*/
const doStuff = whatStuff => action(
    'DO_STUFF',
    { whatStuff }
);

doStuff('look at cat pictures');
```

## Reducers

## createReducer(config)
This helper function will create a redux reducer for you from the provided config.

When the reducer receives an action, if it matches one of the keys you provided (excluding initial and default) it will use that action handler to get the new state.

The config is fairly minimal
 - initial [any] `required` is used as the initial state
 - default [func(state, action)] `optional` used to catch any actions you haven't listed in the config
 - {ACTION} [any|func(state, action)] If function provided, will return its result, otherwise will return the value 


```js
const count = createReducer({
  initial: 0, // required
  INCREMENT: (state, action) => state + action.payload.amount,
  RESET: 0,
  default: (state, action) => {
    console.log('Not an INCREMENT or RESET action', action);
    return state
  }
})
```
vs
```js
const count = (state = 0, action) => {
  switch(action.type) {
    case INCREMENT:
      return state + action.payload.amount;
    case INCREMENT:
      return 0
    default: 
      console.log('Not an INCREMENT or RESET action', action);
      return state
  }
}
```

## createMultiReducer
This works similar to `combineReducers` in redux, but instead allows you to either define your reducers as objects to be created with `createReducer` or as a regular reducer function.

Example

```js
const auth = createMultiReducer({
  userId: {
    initial: null,
    LOGIN_SUCCESS: (_, action) => action.payload.userId,
    LOGOUT: null
  },
  isLoggedIn: {
    initial: false,
    LOGIN_SUCCESS: true,
    LOGOUT: false
  },
  isLoggingIn: (state = false, action) => {
    // I used a function here just for demonstration
    // Using the createReducer object would be cleaner in my opinion here
    switch(action.type) {
      case 'LOGIN_REQUEST':
        return true
      case LOGIN_SUCCESS:
      case LOGIN_FAILURE:
        return false
      default:
        return state
    }
  }
})
```

vs

```js
const initialState = {userId: null, isLoggedIn: false, isLoggedIn: false};
const auth = (state = initialState, action) => {
  switch(action.type) {
    case LOGIN_SUCCESS:
      return {
        userId: action.payload.userId,
        isLoggedIn: true,
        isLoggingIn: false
      }
    case LOGOUT:
      return {
        ...state,
        userId: null,
        isLoggedIn: false
      }
    case LOGIN_REQUEST:
    case LOGIN_FAILURE:
      return {
        ...state,
        isLoggingIn: false
      }
    default:
      return state
  }
}
```

or

```js
const userId = (state = null, action) => {
  switch(action.type) {
    case LOGIN_SUCCESS:
      return action.payload.userId
    case LOGOUT:
      return null
  default:
    return state
  }
}

const isLoggedIn = (state = false, action) => {
  switch(action.type) {
    case LOGIN_SUCCESS:
      return true
    case LOGOUT:
      return false
  default:
    return state
  }
}

const isLoggingIn = (state = false, action) => {
  switch(action.type) {
    case LOGIN_REQUEST:
      return true
    case LOGIN_SUCCESS:
    case LOGIN_FAILURE:
      return false
  default:
    return state
  }
}

const auth = combineReducers({
  userId,
  isLoggedIn,
  isLoggingIn
})
```



## Selectors