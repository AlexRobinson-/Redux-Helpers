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



## Selectors