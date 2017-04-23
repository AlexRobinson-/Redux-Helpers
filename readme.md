[![npm](https://img.shields.io/npm/v/alexs-redux-helpers.svg)](https://www.npmjs.com/package/alexs-redux-helpers)

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

## createReducer(config = {})
This helper function will create a redux reducer for you from the provided config.

When the reducer receives an action, if it matches one of the keys you provided (excluding initial and default) it will use that action handler to get the new state.

The config is fairly minimal
 - initial [any] `required` is used as the initial state
 - default [func(state, action)] `optional` used to catch any actions you haven't listed in the config
 - {ACTION} [any|func(state, action)] If function provided, will return its result, otherwise will return the value 


```js
const count = createReducer({
  initial: 0, // required
  [INCREMENT]: (state, action) => state + action.payload.amount,
  [RESET]: 0,
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
    case RESET:
      return 0
    default: 
      console.log('Not an INCREMENT or RESET action', action);
      return state
  }
}
```

## createMultiReducer(config = {})
This works similar to `combineReducers` in redux, but instead allows you to either define your reducers as objects to be created with `createReducer` or as a regular reducer function.

Example

```js
const auth = createMultiReducer({
  userId: {
    initial: null,
    [LOGIN_SUCCESS]: (_, action) => action.payload.userId,
    [LOGOUT]: null
  },
  isLoggedIn: {
    initial: false,
    [LOGIN_SUCCESS]: true,
    [LOGOUT]: false
  },
  isLoggingIn: (state = false, action) => {
    // I used a function here just for demonstration
    // Using the createReducer object would be cleaner in my opinion here
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
## createDynamicReducer(config = {})
There have been a few instances where I have created a reducer, whos state is an object. Each action that it handled simply updated keys/ids of the object.

I created the createDynamicReducer to make this process a little bit simpler.

Each action handler should return an array in the format [getId(s), getNewState]

- getId(s) [func] return either a single id, or an array of ids
- getNewState [any|func(state[id], action)] If a function, will be called with the id's sub-state, otherwise will set the substate to the value of getNewState

You can use `initial` and `default` just like in the createReducer function. However here `initial` is optional and is used as the initial state for each item in the object, rather than the reducers state.

```js
const todos = createDynamicReducer({
  [ADD_TODO]: [
    action => action.payload.todo.id,
    (state, action) => action.payload.todo
  ],
  [UPDATE_TODO]: [
    action => action.payload.todo.id,
    (state, action) => ({ ...state, ...action.payload.todo })
  ],
  [MARK_TODOS_AS_COMPLETED]: [
    action => action.payload.todoIds,
    state => ({...state, completed: true})
  ],
  [REMOVE_TODOS]: [
    action => action.payload.todoIds,
    null
  ]
})
```

vs

```js
const todos = (state = {}, action) => {
  switch(action.type) {
    case ADD_TODO:
      return {
        ...state,
        [action.payload.todo.id]: action.payload.todo
      }
    case UPDATE_TODO:
      return {
        ...state,
        [action.payload.todo.id]: {
          ...state[action.payload.todo.id],
          ...action.payload.todo
        }
      }
    case MARK_TODOS_AS_COMPLETED:
      return action.payload.todoIds.reduce(
        (newState, id) => ({
          ...newState,
          [id]: { ...newState[id], completed: true }
        }), state
      )
    case REMOVE_TODOS:
      return action.payload.todoIds.reduce(
        (newState, id) => ({
          ...newState,
          [id]: null
        }), state
      )
    default:
      return state
  }
}
```

## createMetaReducer(metaName, reducer)
Sometimes you may create reducers that only handle meta data in your app, this function can help clean that up a little bit.

The function will ignore any actions that are missing the specific meta key. When an action comes through with the metaName, your reducer will be called with only the meta data. 

```js
dispatch({
 type: 'FETCH_TODO_REQUEST',
 payload: {
   todoId: 123
 },
 meta: {
   log: {
     type: LOG_MESSAGE,
     message: `Fetching todo ${123}`
   }
 }
})

const logs = createMetaReducer('log', (state = {errors = [], info = []}, action) => {
  // Here action = {type: LOG_MESSAGE, message: `Fetching todo ${123}`}
  switch(action.type) {
    case LOG_ERROR:
      return {
        ...state,
        errors: [...state.errors, action.message]
      }
    case LOG_INFO:
      return {
        ...state,
        info: [...state.info, action.message]
      }
    default:
      return state
  }
})
```

## Selectors

### nestSelectors(selectors = {})
A pattern with selectors I like to follow is to create selectors that are only aware of their current 'level' in the state tree.
What this means when you have a nested state tree, you may need to also nest your selectors to pass down the correct part of the state. 

```js
// /todos/by-id.js
// ... reducer code

const getById = (state, id) => state[id];

export const selectors = {
  getById
}

// /todos/index.js
import byId, {selectors as byIdSelectors} from './by-id'
// import other todo sub-reducers

export default combineReducers({
  // other todo reducers...
  byId
})

const nestedById = nestSelectors(byIdSelectors, state => state.byId)

export const selectors = {
  ...otherNestedSelectors,
  ...nestedById,
}

// /index.js
import todos, {selectors as rawTodoSelectors} from './todos';
// import other reducers

export default combineReducers({
  // other sub reducers
  todos
})

export todoSelectors = nestSelectors(rawTodoSelectors, state => state.todos)
```