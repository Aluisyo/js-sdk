import API from '@mesg/api'
import Application from './application'

const defaultEndpoint = 'localhost:50052'

type Options = {
  endpoint?: string
}

const applicationBuilder = (options?: Options): Application => {
  const endpoint = options && options.endpoint ? options.endpoint : defaultEndpoint;
  return new Application(API(endpoint));
}

export default applicationBuilder;

export {
  Application
}

