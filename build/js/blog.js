(function() {

  var tmpDOM, i, j;

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