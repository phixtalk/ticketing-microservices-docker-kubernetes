import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // We are on the server
    // note that we also have to pass headers. this does 2 things
    // 1. it includes the cookie it got from the browser and forwards it to
    // ingress nginx to be used for authentication
    // 2. it include the host url, telling ingress which route to use from it's
    // config file. in this case: ticketing.dev

    /**
     * the baseURL is gotten from this template:
     * http://SERVICENAME.NAMESPACE.svc.cluster.local
     * you can get all namespaces with: kubectl get namespace 
     * next get all the services in the ingress-nginx namespace like this:
     * kubectl get services -n ingress-nginx
     * this prints out: ingress-nginx-controller, which is what we used below
     */

    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers
    });
  } else {
    // We must be on the browser
    // note that we did not pass headers, because the browser takes 
    // care of appending the cookies and sends it automatically on each request
    return axios.create({
      baseUrl: '/'
    });
  }
};
