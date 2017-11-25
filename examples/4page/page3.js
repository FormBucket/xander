import React from 'react';
import { dispatch } from 'xander';

let Page3 = ({count}) => <div onClick={() => dispatch('inc')}>{count}</div>;
export default Page3;
