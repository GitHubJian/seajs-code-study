var require
var define

!(function(global) {
  var isIE = /IE/.test(navigator.userAgent),
    head = document.getElementsByTagName('head')[0]

  function importScript(url, successCallback, failureCallback) {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url

    script.onerror = function() {
      failureCallback && failureCallback()
    }

    script.onload = function() {
      successCallback && successCallback()
    }

    if (isIE) {
      setTimeout(function() {
        head.appendChild(script)
      }, 0)
    } else {
      head.appendChild(script)
    }
  }

  function importAsyncModule(url, successCallback, failureCallback) {
    var o =
      importAsyncModulesCallback[url] || (importAsyncModulesCallback[url] = [])
    o.push(successCallback)

    var cssUrl = url.replace(/\.js$/, '.css')
    resModules[cssUrl] && require.loadCss(cssUrl)

    var res = resModules[url] || {}
    var resUrl = res.pkg ? pkgModules[res.pkg].url : res.url || url

    if (!(resUrl in asyncModulesStatus)) {
      asyncModulesStatus[resUrl] = !0
      importScript(resUrl, null, failureCallback)
    }
  }

  function extend(target, source) {
    if (target) {
      for (var n in target) {
        if (target.hasOwnProperty(n)) {
          source[n] = target[n]
        }
      }
    }
  }

  var importAsyncModulesCallback = {}
  var cssCacheModules = {}

  var defineModules = {}
  var cacheModules = {}

  var asyncModulesStatus = {}

  var resModules = {}
  var pkgModules = {}

  define = function(id, factory) {
    defineModules[id] = factory

    if (id === 'invoker.js') {
      debugger
    }

    var callbacks = importAsyncModulesCallback[id]
    if (callbacks) {
      for (var t = callbacks.length - 1; t >= 0; --t) {
        callbacks[t]()
      }

      delete importAsyncModule[id]
    }
  }

  require = function(id) {
    id = require.alias(id)
    var module = cacheModules[id]
    if (module) return module.exports

    var module$1 = defineModules[id]
    if (!module$1) {
      throw Error('Cannot find module `' + id + '`')
    }

    module = cacheModules[id] = {
      exports: {}
    }

    var result

    if ('function' === typeof module$1) {
      result = module$1.apply(module, [require, module.exports, module])
    } else {
      result = module$1
    }

    result && (module.exports = result)

    return module.exports
  }

  require.async = function(ids, successCallback, failureCallback) {
    debugger
    function findDeps(deps) {
      var r = deps.length - 1
      for (; r >= 0; --r) {
        var dep = deps[r]

        if (!(dep in defineModules || dep in currentDepsModule)) {
          currentDepsModule[dep] = !0
          debugger
          index++
          ;/\.css$/.test(dep)
            ? require.loadCss(dep, loadDeps, failureCallback)
            : importAsyncModule(dep, loadDeps, failureCallback)

          var res = resModules[dep]
          res && 'deps' in res && findDeps(res.deps)
        }
      }
    }

    function loadDeps() {
      debugger
      if (0 == index--) {
        var r,
          n,
          t = []

        for (r = 0, n = deps.length; n > r; ++r) {
          t[r] = require(deps[r])
        }

        successCallback && successCallback.apply(global, t)
      }
    }

    var deps = 'string' === typeof ids ? [ids] : ids
    var originDeps = [],
      c = deps.length - 1
    for (; c >= 0; --c) {
      if (deps[c].match(/\^src\:/)) {
        originDeps.push(deps[c].substring(4))
        deps.splice(c, 1)
      } else {
        deps[c] = require.alias(deps[c])
      }
    }

    var originDep = originDeps[0]
    if (originDeps.length > 1) {
      for (c = originDeps.length - 1; c >= 1; --c) {
        importScript(originDeps[c], null, failureCallback)
      }

      if (0 == deps.length) {
        r(originDep, successCallback, failureCallback)
      } else {
        r(originDep, null, failureCallback)
      }
    } else {
      if (1 === originDeps.length) {
        if (0 === deps.length) {
          importScript(originDep, successCallback, failureCallback)
        } else {
          r(originDep, null, failureCallback)
        }
      }
    }

    if (0 !== deps.length) {
      var currentDepsModule = {},
        index = 0

      findDeps(deps)
      debugger
      loadDeps()
    }
  }

  require.resourceMap = function(resource) {
    extend(resource.res, resModules)
    extend(resource.pkg, pkgModules)
  }

  require.alias = function(id) {
    return id
  }

  //
  ;(function(head) {
    var r = (function() {
      var browser,
        version,
        opera = 'opera',
        chrome = 'chrome',
        safari = 'safari',
        firefox = 'firefox',
        ie = 'ie',
        win = window,
        userAgent = win.navigator.userAgent

      if (win.opera) {
        browser = opera
        version = parseFloat(win.opera.version())
      }

      if (/AppleWebKit\/(\S+)/.test(userAgent)) {
        if (/Chrome\/(\S+)/.test(userAgent)) {
          browser = chrome
          version = parseFloat(RegExp.$1)
        } else if (/Version\/(\S)/.test(userAgent)) {
          browser = safari
          version = parseFloat(RegExp.$1)
        } else {
          browser = safari
          version = 2
        }
      }

      if (/Firefox\/(\S)/.test(userAgent)) {
        browser = firefox
        version = parseFloat(RegExp.$1)
      }

      if (window.ActiveXObject || 'ActiveXObject' in window) {
        browser = ie
        if (/MSIE ([^;]+)/.test(version)) {
          version = parseFloat(RegExp.$1)
        }
      }

      return {
        browser: browser,
        version: version
      }
    })()

    var loadCSSModulesStatus = {}
    var browser = r.browser
    var version = r.version

    var i =
      'ie' === browser ||
      ('firefox' === browser && version > 8.9) ||
      'opera' === browser ||
      ('chrome' === browser && version > 19) ||
      ('safari' === browser && version > 5.9)

    var a =
      ('chrome' === browser && version > 9) ||
      ('safari' === browser && version > 4.9) ||
      'firefox' === browser

    var cssRE = /\.css(?:\?\S+|#\S+)?$/

    var f = {
      importCSS: function(uri, callback) {
        function onload() {
          loadCSSModulesStatus[uri] = !0
          onerror()
          l && callback()
        }

        function onerror() {
          link.onload = link.onerror = null
          head$1 = null
        }

        var l = 'function' == typeof callback

        if (loadCSSModulesStatus[uri]) {
          l && callback()

          return void 0
        }

        var head$1 = head
        var link = document.createElement('link')
        link.rel = 'stylesheet'
        link.type = 'text/css'
        link.href = uri
        link.onerror = onerror

        if (l) {
          if (i) {
            link.onload = function() {
              onload()
            }

            if ('ie' === browser && 6 === version) {
              head$1.appendChild(link)
            } else {
              head$1.appendChild(link)
            }
          } else if (a) {
            head$1.appendChild(link)
            var img = document.createElement('img')
            img.onerror = function() {
              img.onerror = null
              img = null
              onload()
            }
            img.src = uri
          } else {
            head$1.appendChild(link)
            var v = function() {
              link.sheet && 'object' === typeof link.sheet.cssRules
                ? onload()
                : setTimeout(v, 300)
            }
            v()
          }
        } else {
          head$1.appendChild(link)
        }
      },
      loadCss: function(urls, callback, immediate) {
        function load$1(url, callback) {
          if (!url || cssCacheModules[url]) return void callback()

          cssCacheModules[url] = !0
          if (!cssRE.test(url)) {
            throw new Error('the file must be the css file!!!')
          }

          f.importCSS(url, callback)
        }

        function load() {
          var url = urls.shift()
          url ? load$1(url, load) : callback && callback()
        }

        urls = 'string' === typeof urls ? [urls] : urls
        var i = urls.length
        if (!i || 1 > i) {
          throw new Error('urls is not allowed empty!')
        }

        if (immediate) {
          load()
        } else {
          for (var s = 0; s < urls.length; s++) {
            load$1(urls[s], function() {
              i--
              0 === i && callback && callback()
            })
          }
        }
      }
    }

    require.loadCss = function(urls, callback, immediate) {
      urls = 'string' === typeof urls ? [urls] : urls
      if (!urls.length) return callback()

      for (var t = 0, o = urls.length; o > t; t++) {
        var i = urls[t],
          res = resModules[i] || {},
          l = res.pkg ? pkgModules[res.pkg].url : res.url || i

        urls[t] =
          l === i
            ? i.replace(/(\S+):(\S+)/, function(e, r, n) {
                return '/box-static/' + r + '/' + n
              })
            : l
      }

      f.loadCss(urls, callback, immediate)
    }
  })(head)
})(this)
