// @flow

import axios from 'axios';
import httpadapter from 'axios/lib/adapters/http';

axios.defaults.adapter = httpadapter;
export default axios;
