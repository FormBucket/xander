import React from 'react';
let Page3 = ({store, count}) => <div onClick={() => store.dispatch('inc')}>{count}</div>;

export default Page3;
