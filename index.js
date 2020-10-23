const App = (() => {
  const components = {};
  let beforeInstallEvent = null;

  const onBeforeInstallPromptEvent = (e) => {
    // Don't show the mini-infobar on mobile
    // e.preventDefault();

    beforeInstallEvent = e;
  }

  const onAppInstalled = (e) => {
    beforeInstallEvent = null;
  }

  const onInstall = async () => {
    if (!beforeInstallEvent) return;

    // Show the browser install prompt
    beforeInstallEvent.prompt();

    // Wait for the user to accept or dismiss the install prompt
    const { outcome } = await beforeInstallEvent.userChoice;

    // If the prompt was dismissed
    if (outcome === 'dismissed') {
      console.log('Installed!')
    }
  }

  const init = () => {
    window.addEventListener('load', () => {
      // Listen for beforeinstallprompt events, indicating App is installable.
      window.addEventListener('beforeinstallprompt', onBeforeInstallPromptEvent);

      // Listen for the appinstalled event, indicating App has been installed.
      window.addEventListener('appinstalled', onAppInstalled);

      document.querySelectorAll('.install-btn').forEach(e => e.addEventListener('click', onInstall))
    })
  }

  init();

  return {
    addComponent: (name, component) => {
      components[name] = component;
    },
    getComponent: (name) => {
      return components[name];
    }
  }
})()

const AsyncModule = (() => {
  const load = async (filePath) => {
    return new Promise(resolve => {
      // Checks if the file is already loaded to skip
      const exist = document.querySelector(`script[src="${filePath}"]`);
      if(exist) return resolve();

      var s = document.createElement('script');
      s.setAttribute('src', filePath);
      s.onload=() => {
        resolve();
      };

      document.head.appendChild( s );
    })
  }

  return {
    load
  } 
})()

// API
const API = (() => {
  const baseUrl = 'https://book-store-server2020.herokuapp.com';

  const getProductTypes = async () => {
    return fetch(`${baseUrl}/products`)
      .then(response => response.json());
  }

  const getUserData = async () => {
    // Replaces with a correct userId
    return fetch(`${baseUrl}/users/1`)
      .then(response => response.json());
  }

  /**
   * 
   * @param {*} userData partial user props to update
   */
  const updateUserCartData = async (userCartData) => {
    // Replaces with a correct userId
    return fetch(`${baseUrl}/users/1`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        updatedAt: new Date().getTime(), // it should be in the server side
        cart: userCartData
      })
    })
      .then(response => response.json());
  }

  return {
    getProductTypes,
    getUserData,
    updateUserCartData
  }
})()


// ErrorComponent
const ErrorComponent = (() => {
  return {
    render: () => '404 Page Not Found'
  }
})()


// Service Worker
const SWModule = (() => {
  if('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(() => {
          console.log('ServiceWorker registered!')
        })
        .catch((err) => {
          console.log('ServiceWorker register had an error ', err)
        })
    })
  }
})()

// routes

const Router = (() => {
  const parseLocation = () => location.hash.slice(1).toLowerCase() || '/';
  const findComponentByPath = (path, routes) => routes.find(r => r.path.match(new RegExp(`^\\${path}$`, 'gm'))) || undefined;

  let privateRoutes = [];
  let currentComponent = null;

  class Router {
    constructor(routes) {
      privateRoutes = routes;

      this.update();
      window.addEventListener('hashchange', this.update);
    }

    update = async () => {
      // call unmount method
      if (currentComponent) {
        currentComponent.willUnmount && currentComponent.willUnmount();
      }

      // Find the component based on the current path
      const path = parseLocation();
      // If there's no matching route, get the "Error" component
      const { component = ErrorComponent } = findComponentByPath(path, privateRoutes) || {};

      if(typeof component === 'function') {
        currentComponent = await component();
      } else {
        currentComponent = component;
      }
     
      if(currentComponent.load) {
        await currentComponent.load();
      }

      const componentRender = await currentComponent.render();
    
      const content = document.getElementById('content');
      content.innerHTML = '';
      
      if (typeof componentRender === 'string'){
        content.innerHTML = componentRender;
      } else {
        content.appendChild(componentRender);
      }
    
      M.updateTextFields(); // for updating material component values
    
      var elem = document.querySelector('.sidenav');
      var instance = M.Sidenav.getInstance(elem);
      instance.close();
    }
  }

  return Router;
})()

const runMaterialComponents = () => {
  var elems = document.querySelectorAll('.sidenav');
  M.Sidenav.init(elems);
}

// Miss a loading when a script is loading
const routes = [
  { path: '/', component:  () => AsyncModule.load('products-component.js').then(() => App.getComponent('ProductsComponent')), },
  { path: '/about', component: () => AsyncModule.load('about-component.js').then(() => App.getComponent('AboutComponent')) },
];

document.addEventListener('DOMContentLoaded', function() {
  runMaterialComponents();

  // router
  new Router(routes);
});