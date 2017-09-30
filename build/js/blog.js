(function() {

  var tmpDOM, i, j, usr, get

  get = function(url, callback) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
      //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
      xmlhttp = new XMLHttpRequest()
    } else {
      // IE6, IE5 浏览器执行代码
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP")
    }
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        callback(null, xmlhttp.responseText)
      } else {
        callback('err', null)
      }
    }
    xmlhttp.open('GET', url, true)
    xmlhttp.send()
  }

  /**
   * usr
   */
  usr = localStorage.getItem('note-usr')
  if (!usr) {
    window.location.href = '../login.html'
  }

  get(`http://www.graydalf.com/githubio/note/?usr=${usr.name}&token=${usr.token}`, function(err, data) {
    if (err) {
      localStorage.removeItem('note-usr')
      window.location.href = '../login.html'
    }

    //TODO data
    console.log(data);
  })

  /**
   * aside doc-tree hide or show
   */
  document.querySelector('main>aside>.doc-tree-taggle').addEventListener('click', function() {
    var asideDOM = document.querySelector('main>aside')
    if (asideDOM.className.includes('drawer')) {
      asideDOM.className = asideDOM.className.replace(/drawer/, '').trim()
    } else {
      asideDOM.className += ' drawer'
    }
  })

  /**
   * aside doc-tree click event
   */
  tmpDOM = document.querySelectorAll('main>aside>.doc-tree span')
  for (i = 0; i < tmpDOM.length; i++) {
    tmpDOM[i].addEventListener('click', function(item) {
      var ulDOM = item.target.nextSibling
      if (ulDOM.hasAttribute('hidden')) {
        ulDOM.removeAttribute('hidden')
      } else {
        ulDOM.setAttribute('hidden', 'hidden')
      }
    })
  }





}())